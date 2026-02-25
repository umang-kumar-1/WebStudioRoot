import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import { DateTimeFieldFormatType, UrlFieldFormatType } from "@pnp/sp/fields";
import {
    SEED_SMART_PAGES,
    // SEED_TOP_NAVIGATION,
    SEED_NEWS,
    SEED_EVENTS,
    SEED_GLOBAL_SETTINGS,
    SEED_TRANSLATIONS,
    // SEED_CONTAINERS
} from './seedData';
import { DEFAULT_LOGO_BASE64 } from './defaultLogo';

// Interface Definitions
interface IColumnDef {
    InternalName: string;
    Type: "Text" | "Note" | "Choice" | "Boolean" | "Number" | "DateTime" | "URL" | "Lookup";
    Description: string;
    Indexed?: boolean;
    Choices?: string[];
    LookupListTitle?: string; // Required for Lookup
    LookupFieldName?: string; // Optional, defaults to Title
}

interface IListDef {
    Title: string;
    Template: number;
    Columns: IColumnDef[];
}

// Singleton pattern to prevent multiple simultaneous provisioning
let provisioningPromise: Promise<void> | null = null;
let isProvisioning = false;

export default class SharePointListProvisioner {
    private _sp: SPFI;

    constructor(context: WebPartContext) {
        this._sp = spfi().using(SPFx(context));
    }

    public async provisionAllLists(): Promise<void> {
        // If provisioning is already in progress, wait for it to complete
        if (isProvisioning && provisioningPromise) {
            console.log('⏳ Provisioning already in progress, waiting for completion...');
            return provisioningPromise;
        }

        // If provisioning was completed successfully before, skip
        if (provisioningPromise && !isProvisioning) {
            console.log('✅ Provisioning already completed successfully');
            return provisioningPromise;
        }

        // Start new provisioning
        isProvisioning = true;
        provisioningPromise = this._provisionAllListsInternal();

        try {
            await provisioningPromise;
            isProvisioning = false;
        } catch (error) {
            isProvisioning = false;
            provisioningPromise = null; // Reset on error to allow retry
            throw error;
        }
    }

    private async _provisionAllListsInternal(): Promise<void> {
        const schemas = this.getApplicationListSchemas();
        console.log(`\n🔄 Starting Provisioning for ${schemas.length} lists...\n`);

        // PHASE 1: Ensure all lists are created first
        console.log(`\n═══════════════════════════════════════════════`);
        console.log(`📋 PHASE 1: Creating all SharePoint lists`);
        console.log(`═══════════════════════════════════════════════\n`);

        const listReferences: Map<string, any> = new Map();

        for (const schema of schemas) {
            try {
                console.log(`---------------------------------------------`);
                console.log(`📂 Processing List: ${schema.Title}`);

                // Create the list (if it doesn't exist)
                const list = await this.ensureList(schema);
                if (list) {
                    listReferences.set(schema.Title, list);
                }

                // Small delay between list creations
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (err) {
                console.error(`❌ CRITICAL ERROR creating list ${schema.Title}:`, err);
            }
        }

        console.log(`\n✅ Phase 1 Complete: All lists created\n`);

        // PHASE 2: Add columns to all lists
        console.log(`\n═══════════════════════════════════════════════`);
        console.log(`📋 PHASE 2: Adding columns to all lists`);
        console.log(`═══════════════════════════════════════════════\n`);

        for (const schema of schemas) {
            try {
                console.log(`---------------------------------------------`);
                console.log(`📂 Adding columns to: ${schema.Title}`);

                const list = listReferences.get(schema.Title);
                if (list) {
                    await this.ensureColumns(list, schema.Columns);
                } else {
                    console.warn(`⚠️ List reference not found for ${schema.Title}, attempting to retrieve...`);
                    const retrievedList = await this.ensureList(schema);
                    if (retrievedList) {
                        await this.ensureColumns(retrievedList, schema.Columns);
                    }
                }

                // Small delay between column operations
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (err) {
                console.error(`❌ CRITICAL ERROR adding columns to ${schema.Title}:`, err);
            }
        }

        console.log(`\n✅ Phase 2 Complete: All columns added`);
        console.log(`\n🎉 Provisioning Completed!`);

        // 3. Seed empty lists with mock data
        console.log(`\n🌱 Starting Data Seeding...\n`);
        const defaultImageUrl = await this.ensureDefaultAssets();
        await this.seedAllLists(defaultImageUrl);
        console.log(`\n✅ Data Seeding Completed!`);
    }

    private async ensureList(schema: IListDef): Promise<any> {
        // First, try to get the list with retry logic
        let retries = 3;
        let delay = 500;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this._sp.web.lists.getByTitle(schema.Title)();
                console.log(`   ✅ List exists: ${schema.Title}`);
                return this._sp.web.lists.getByTitle(schema.Title);
            } catch (getError: any) {
                const errorMsg = getError?.message || JSON.stringify(getError);

                // If it's a 404, the list doesn't exist - try to create it
                if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
                    console.log(`   🔄 Creating list: ${schema.Title} (Template: ${schema.Template})...`);

                    try {
                        await this._sp.web.lists.add(schema.Title, "", schema.Template, true);
                        console.log(`   ✅ Created list: ${schema.Title}`);

                        // Enable versioning by default
                        const list = this._sp.web.lists.getByTitle(schema.Title);
                        await list.update({ EnableVersioning: true });
                        console.log(`   ✅ Enabled versioning for: ${schema.Title}`);

                        // Wait a bit for SharePoint to finalize the list creation
                        await new Promise(resolve => setTimeout(resolve, 500));

                        return list;
                    } catch (createError: any) {
                        const createErrorMsg = createError?.message || JSON.stringify(createError);

                        // If it says "already exists", that's actually fine - just return the list
                        if (createErrorMsg.includes('already exists') || createErrorMsg.includes('-2130575342')) {
                            console.log(`   ℹ️ List ${schema.Title} already exists (race condition handled)`);
                            const list = this._sp.web.lists.getByTitle(schema.Title);
                            await list.update({ EnableVersioning: true });
                            await new Promise(resolve => setTimeout(resolve, 500));
                            return list;
                        }

                        // Other creation errors - retry if possible
                        if (attempt < retries) {
                            console.warn(`   ⚠️ Failed to create list ${schema.Title}, attempt ${attempt}/${retries}, retrying in ${delay}ms...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            delay *= 2;
                            continue;
                        }

                        throw createError;
                    }
                }

                // For other errors (not 404), retry
                if (attempt < retries) {
                    console.warn(`   ⚠️ Failed to get list ${schema.Title}, attempt ${attempt}/${retries}, retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }

                throw getError;
            }
        }

        // This shouldn't be reached, but TypeScript needs it
        throw new Error(`Failed to ensure list ${schema.Title} after ${retries} attempts`);
    }

    private async ensureColumns(list: any, columns: IColumnDef[]): Promise<void> {
        const existingFields = await list.fields.select("InternalName", "Title", "Indexed")();
        const existingInternalNames = new Set(existingFields.map((f: any) => (f.InternalName || "").toLowerCase()));
        const existingTitles = new Set(existingFields.map((f: any) => (f.Title || "").toLowerCase()));

        for (const col of columns) {
            if (col.InternalName === "Title") continue;

            // Strict check: If it exists as InternalName OR Display Name (Title), skip creation
            const existsByInternal = existingInternalNames.has(col.InternalName.toLowerCase());
            const existsByTitle = existingTitles.has(col.InternalName.toLowerCase());

            if (existsByInternal || existsByTitle) {
                console.log(`   ✅ Field exists: ${col.InternalName}${existsByTitle && !existsByInternal ? ' (matched by Display Name)' : ''}`);

                // Still allow updating properties like Indexing if field already exists
                if (col.Indexed) {
                    const field = existingFields.find((f: any) =>
                        (f.InternalName || "").toLowerCase() === col.InternalName.toLowerCase() ||
                        (f.Title || "").toLowerCase() === col.InternalName.toLowerCase()
                    );
                    if (field && !field.Indexed) {
                        console.log(`   🔄 Indexing Field: ${col.InternalName}...`);
                        try {
                            await list.fields.getByInternalName(field.InternalName).update({ Indexed: true });
                            console.log(`   ✅ Indexed updated: ${col.InternalName}`);
                        } catch (indexErr) {
                            console.warn(`   ⚠️ Could not update index for ${col.InternalName}:`, indexErr);
                        }
                    }
                }
            } else {
                console.log(`   ➕ Creating Field: ${col.InternalName} (${col.Type})...`);

                // Retry logic with exponential backoff
                let retries = 3;
                let delay = 500;
                let lastError: any = null;

                for (let attempt = 1; attempt <= retries; attempt++) {
                    try {
                        await this.createField(list, col);
                        console.log(`   ✅ Created Field: ${col.InternalName}`);
                        lastError = null;
                        break;
                    } catch (err: any) {
                        lastError = err;
                        const errorMessage = err?.message || JSON.stringify(err);

                        // Check if it's a conflict error or transient error
                        if (errorMessage.includes('409') || errorMessage.includes('Conflict') || errorMessage.includes('500')) {
                            if (attempt < retries) {
                                console.warn(`   ⚠️ Attempt ${attempt} failed for ${col.InternalName}, retrying in ${delay}ms...`);
                                await new Promise(resolve => setTimeout(resolve, delay));
                                delay *= 2; // Exponential backoff
                            }
                        } else {
                            // Non-retryable error
                            break;
                        }
                    }
                }

                if (lastError) {
                    console.error(`   ❌ Failed to create field ${col.InternalName} after ${retries} attempts:`, lastError);
                }
            }
        }
    }

    private async createField(list: any, col: IColumnDef): Promise<void> {
        const indexed = col.Indexed || false;

        // Add field based on type
        switch (col.Type) {
            case "Text":
                await list.fields.addText(col.InternalName, { MaxLength: 255 });
                break;
            case "Note":
                await list.fields.addMultilineText(col.InternalName, { NumberOfLines: 6, RichText: false, RestrictedMode: false });
                break;
            case "Choice":
                await list.fields.addChoice(col.InternalName, { Choices: col.Choices || [], EditFormat: 0 });
                break;
            case "Boolean":
                await list.fields.addBoolean(col.InternalName);
                break;
            case "Number":
                await list.fields.addNumber(col.InternalName);
                break;
            case "DateTime":
                await list.fields.addDateTime(col.InternalName, { DisplayFormat: DateTimeFieldFormatType.DateTime });
                break;
            case "URL":
                await list.fields.addUrl(col.InternalName, { DisplayFormat: UrlFieldFormatType.Hyperlink });
                break;
            case "Lookup":
                if (!col.LookupListTitle) throw new Error(`LookupListTitle is required for Lookup field ${col.InternalName}`);
                const targetList = await this._sp.web.lists.getByTitle(col.LookupListTitle).select("Id")();
                await list.fields.addLookup(col.InternalName, { LookupListId: targetList.Id, LookupFieldName: col.LookupFieldName || "Title" });
                break;
            default:
                console.warn(`Unknown type ${col.Type} for ${col.InternalName}`);
                return;
        }

        // Longer delay to prevent SharePoint conflicts
        await new Promise(resolve => setTimeout(resolve, 300));

        // Only update if we have meaningful values to set
        const hasDescription = col.Description && col.Description.trim().length > 0;
        if (hasDescription || indexed) {
            const updatePayload: any = {};
            if (hasDescription) updatePayload.Description = col.Description;
            if (indexed) updatePayload.Indexed = true;

            // Retry logic for metadata updates
            let updateRetries = 2;
            let updateDelay = 500;
            let updateSuccess = false;

            for (let attempt = 1; attempt <= updateRetries && !updateSuccess; attempt++) {
                try {
                    await list.fields.getByInternalNameOrTitle(col.InternalName).update(updatePayload);
                    updateSuccess = true;
                } catch (updateErr: any) {
                    const updateErrMsg = updateErr?.message || JSON.stringify(updateErr);

                    if ((updateErrMsg.includes('409') || updateErrMsg.includes('Conflict')) && attempt < updateRetries) {
                        await new Promise(resolve => setTimeout(resolve, updateDelay));
                        updateDelay *= 2;
                    } else {
                        // Log but don't fail - the field was created successfully
                        console.warn(`   ⚠️ Could not update metadata for ${col.InternalName}:`, updateErr);
                        break;
                    }
                }
            }
        }
    }

    private async ensureDefaultAssets(): Promise<string> {
        const IMG_LIB_TITLE = "Images";
        const IMG_FILENAME = "logo.png";

        try {
            const list = this._sp.web.lists.getByTitle(IMG_LIB_TITLE);
            const items = await list.items.select("Id", "FileRef").filter("FSObjType eq 0").top(1)();

            if (items.length > 0) {
                console.log(`   ✅ Images library has content. Using existing image.`);
                return `${items[0].FileRef}?v=${Date.now()}`;
            }

            console.log(`   ⬆️ Uploading embedded default logo to ${IMG_LIB_TITLE}...`);
            const base64Data = DEFAULT_LOGO_BASE64.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Get the root folder and ensure we have the correct path
            const rootFolder = await list.rootFolder();
            const folderPath = rootFolder.ServerRelativeUrl;

            console.log(`   📁 Uploading to folder: ${folderPath}`);

            // Retry logic for file upload
            let uploadSuccess = false;
            let fileInfo: any = null;
            let retries = 3;

            for (let attempt = 1; attempt <= retries && !uploadSuccess; attempt++) {
                try {
                    fileInfo = await this._sp.web.getFolderByServerRelativePath(folderPath).files.addUsingPath(IMG_FILENAME, blob, { Overwrite: true });
                    uploadSuccess = true;
                    console.log("   ✅ Default logo uploaded.");
                } catch (uploadErr: any) {
                    if (attempt < retries) {
                        console.warn(`   ⚠️ Upload attempt ${attempt} failed, retrying...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } else {
                        throw uploadErr;
                    }
                }
            }

            if (!uploadSuccess || !fileInfo) {
                throw new Error("Failed to upload default logo after retries");
            }

            const webData = await this._sp.web.select("Url")();
            const host = new URL(webData.Url).origin;
            return `${host}${fileInfo.ServerRelativeUrl}?v=${Date.now()}`;

        } catch (err: any) {
            console.error("   ⚠️ Failed to ensure default assets:", err);
            return "";
        }
    }

    private async seedAllLists(defaultImageUrl: string): Promise<void> {
        try {
            await this.seedList('SmartPages', SEED_SMART_PAGES);
            // await this.seedNavigationWithLookups();
            await this.seedList('GlobalSettings', SEED_GLOBAL_SETTINGS);
            await this.seedList('TranslationDictionary', SEED_TRANSLATIONS);
            await this.seedList('News', SEED_NEWS, defaultImageUrl);
            await this.seedList('Events', SEED_EVENTS, defaultImageUrl);
            // await this.seedContainersWithLookups();

            console.log(`   ⏭️  Skipping Documents (Document Library - requires file upload)`);
            console.log(`   ⏭️  Skipping Images (Picture Library - requires file upload)`);
        } catch (err: any) {
            console.error('❌ Error during data seeding:', err);
        }
    }

    private async seedList(listTitle: string, seedData: any[], defaultImageUrl?: string): Promise<void> {
        try {
            const list = this._sp.web.lists.getByTitle(listTitle);
            const items = await list.items.top(1)();

            if (items.length === 0) {
                console.log(`   🌱 Seeding ${listTitle}...`);
                for (const item of seedData) {
                    const itemToSave = { ...item };
                    if (defaultImageUrl && (listTitle === 'News' || listTitle === 'Events' || listTitle === 'Documents')) {
                        itemToSave.ImageUrl = { Url: defaultImageUrl, Description: item.Title || 'Default Image' };
                        itemToSave.ImageName = "logo.png";
                    }
                    await list.items.add(itemToSave);
                }
                console.log(`   ✅ Seeded ${seedData.length} items to ${listTitle}`);
            } else {
                console.log(`   ⏭️  ${listTitle} already has data, skipping seed.`);
            }
        } catch (err) {
            console.error(`   ❌ Failed to seed ${listTitle}:`, err);
        }
    }

    // private async seedNavigationWithLookups(): Promise<void> {
    //     try {
    //         const navList = this._sp.web.lists.getByTitle('TopNavigation');
    //         const items = await navList.items.top(1)();

    //         if (items.length === 0) {
    //             console.log(`   🌱 Seeding TopNavigation with page lookups...`);
    //             const pagesItems = await this._sp.web.lists.getByTitle('SmartPages').items.select('Id', 'Title', 'Slug')();

    //             for (const navItem of SEED_TOP_NAVIGATION) {
    //                 let smartPageId = null;
    //                 if (navItem.NavType === 'Page') {
    //                     const slug = this.getSlugForNavTitle(navItem.Title);
    //                     const matchingPage = pagesItems.find(p => p.Slug === slug);
    //                     if (matchingPage) smartPageId = matchingPage.Id;
    //                 }
    //                 await navList.items.add({
    //                     Title: navItem.Title,
    //                     NavType: navItem.NavType,
    //                     SmartPageId: smartPageId,
    //                     ExternalURL: navItem.ExternalURL,
    //                     SortOrder: navItem.SortOrder,
    //                     IsVisible: navItem.IsVisible,
    //                     Status: 'Published' // Default status for seed data
    //                 });
    //             }
    //             console.log(`   ✅ Seeded ${SEED_TOP_NAVIGATION.length} nav items to TopNavigation`);
    //         }
    //     } catch (err: any) {
    //         console.error(`   ❌ Failed to seed TopNavigation:`, err);
    //     }
    // }

    // private async seedContainersWithLookups(): Promise<void> {
    //     try {
    //         const containersList = this._sp.web.lists.getByTitle('Containers');
    //         const items = await containersList.items.top(1)();

    //         if (items.length === 0) {
    //             console.log(`   🌱 Seeding Containers with page lookups...`);
    //             const pagesItems = await this._sp.web.lists.getByTitle('SmartPages').items.select('Id', 'Title', 'Slug')();

    //             for (const container of SEED_CONTAINERS) {
    //                 const targetPage = pagesItems.find(p => p.Slug === container.PageSlug);
    //                 if (targetPage) {
    //                     const { PageSlug, ...rest } = container;
    //                     await containersList.items.add({ ...rest, PageId: targetPage.Id });
    //                 }
    //             }
    //             console.log(`   ✅ Seeded ${SEED_CONTAINERS.length} containers`);
    //         }
    //     } catch (err: any) {
    //         console.error(`   ❌ Failed to seed Containers:`, err);
    //     }
    // }

    // private getSlugForNavTitle(title: string): string {
    //     const slugMap: Record<string, string> = {
    //         'HOME': '/',
    //         'WHAT WE OFFER': '/what-we-offer',
    //         'HOW WE WORK': '/how-we-work',
    //         'WHO WE ARE': '/who-we-are',
    //         'CAREERS': '/careers',
    //         'CONTACT': '/contact'
    //     };
    //     return slugMap[title] || '/';
    // }

    private getApplicationListSchemas(): IListDef[] {
        return [
            {
                Title: "SmartPages",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Page title (Default: English)" },
                    { InternalName: "MultilingualTitle", Type: "Note", Description: "JSON object containing translations" },
                    { InternalName: "Slug", Type: "Text", Description: "URL path (e.g., /services)", Indexed: true },
                    { InternalName: "PageStatus", Type: "Choice", Description: "Draft or Published", Choices: ["Draft", "Published"] },
                    { InternalName: "IsHomePage", Type: "Boolean", Description: "Flag to identify the root entry point" },
                    { InternalName: "Description", Type: "Note", Description: "Internal description" },
                    { InternalName: "SEOConfig", Type: "Note", Description: "JSON: { title, description, keywords }" },
                    { InternalName: "VersionNote", Type: "Text", Description: "Last change summary" }
                ]
            },
            {
                Title: "Images",
                Template: 109,
                Columns: [
                    { InternalName: "AltText", Type: "Text", Description: "Accessibility text" },
                    { InternalName: "AssetCategory", Type: "Choice", Description: "Logos, Headers, Team, General", Choices: ["Logos", "Headers", "Team", "General"] },
                    { InternalName: "CopyrightInfo", Type: "Text", Description: "Source/Attribution information" },
                    { InternalName: "Description", Type: "Note", Description: "Image description" }
                ]
            },
            {
                Title: "Documents",
                Template: 101,
                Columns: [
                    { InternalName: "DocumentYear", Type: "Text", Description: "Metadata for filtering" },
                    { InternalName: "DocStatus", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "ItemRank", Type: "Number", Description: "Critical (1), Important (3), Standard (5)" },
                    { InternalName: "DocType", Type: "Choice", Description: "PDF, Word, Excel, PPT, Link", Choices: ["PDF", "Word", "Excel", "PPT", "Link"] },
                    { InternalName: "DocumentDescriptions", Type: "Note", Description: "Extended description for the document" },
                    { InternalName: "SortOrder", Type: "Number", Description: "Numeric ordering for documents" },
                    { InternalName: "Translations", Type: "Note", Description: "JSON object containing multilingual title and description translations" },
                    { InternalName: "ImageUrl", Type: "URL", Description: "URL of the document's associated image" },
                    { InternalName: "ImageName", Type: "Text", Description: "Name of the document's associated image file" }
                ]
            },
            {
                Title: "GlobalSettings",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Unique Key" },
                    { InternalName: "ConfigData", Type: "Note", Description: "Large JSON payload" }
                ]
            },
            {
                Title: "TopNavigation",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Menu label" },
                    { InternalName: "Parent", Type: "Lookup", Description: "Parent Menu", LookupListTitle: "TopNavigation" },
                    { InternalName: "NavType", Type: "Choice", Description: "Page or External", Choices: ["Page", "External"] },
                    { InternalName: "SmartPage", Type: "Lookup", Description: "Link to SmartPages", LookupListTitle: "SmartPages" },
                    { InternalName: "ExternalURL", Type: "Text", Description: "External Link" },
                    { InternalName: "SortOrder", Type: "Number", Description: "Horizontal sorting index" },
                    { InternalName: "IsVisible", Type: "Boolean", Description: "Toggle visibility" },
                    { InternalName: "OpenInNewTab", Type: "Boolean", Description: "Open link in new tab" },
                    { InternalName: "Status", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "Translations", Type: "Note", Description: "JSON store for translated fields" }
                ]
            },
            {
                Title: "News",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "News heading (English fallback)" },
                    { InternalName: "Status", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "PublishDate", Type: "DateTime", Description: "Display date" },
                    { InternalName: "Description", Type: "Note", Description: "Summary" },
                    { InternalName: "Thumbnail", Type: "Lookup", Description: "Image", LookupListTitle: "Images" },
                    { InternalName: "ReadMoreURL", Type: "Text", Description: "External source link" },
                    { InternalName: "ReadMoreText", Type: "Text", Description: "Text for the external link" },
                    { InternalName: "ReadMoreEnabled", Type: "Boolean", Description: "Toggle read more link" },
                    { InternalName: "SEOConfig", Type: "Note", Description: "SEO Metadata JSON" },
                    { InternalName: "Translations", Type: "Note", Description: "JSON store for translated fields" },
                    { InternalName: "ImageUrl", Type: "URL", Description: "URL of the news thumbnail image" },
                    { InternalName: "ImageName", Type: "Text", Description: "Name of the news thumbnail image file" }
                ]
            },
            {
                Title: "Events",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Event Title (English fallback)" },
                    { InternalName: "StartDate", Type: "DateTime", Description: "Start Date & Time" },
                    { InternalName: "EndDate", Type: "DateTime", Description: "End Date & Time" },
                    { InternalName: "Location", Type: "Text", Description: "Event Location" },
                    { InternalName: "Description", Type: "Note", Description: "Event Details" },
                    { InternalName: "Category", Type: "Choice", Description: "Event Category", Choices: ["Conference", "Meeting", "Social", "Training", "Webinar"] },
                    { InternalName: "Translations", Type: "Note", Description: "JSON store for translated fields" },
                    { InternalName: "Status", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "ImageUrl", Type: "URL", Description: "URL of the event image" },
                    { InternalName: "ImageName", Type: "Text", Description: "Name of the event image file" },
                    { InternalName: "ReadMoreURL", Type: "Text", Description: "External source link" },
                    { InternalName: "ReadMoreText", Type: "Text", Description: "Text for the external link" },
                    { InternalName: "ReadMoreEnabled", Type: "Boolean", Description: "Toggle read more link" },
                    { InternalName: "SEOConfig", Type: "Note", Description: "SEO Metadata JSON" }
                ]
            },
            {
                Title: "Containers",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Internal Name" },
                    { InternalName: "Page", Type: "Lookup", Description: "Parent Page", LookupListTitle: "SmartPages" },
                    { InternalName: "ContainerType", Type: "Choice", Description: "Widget Type", Choices: ["HERO", "IMAGE_TEXT", "SLIDER", "CARD_GRID", "CONTACT_FORM", "DATA_GRID", "TABLE", "MAP"] },
                    { InternalName: "SortOrder", Type: "Number", Description: "Vertical placement" },
                    { InternalName: "Settings", Type: "Note", Description: "JSON layout config" },
                    { InternalName: "ContainerContent", Type: "Note", Description: "JSON content" },
                    { InternalName: "IsVisible", Type: "Boolean", Description: "Hide/Show" },
                    { InternalName: "BtnEnabled", Type: "Boolean", Description: "Action Button: Enable/Disable" },
                    { InternalName: "BtnName", Type: "Text", Description: "Action Button: Display Label" },
                    { InternalName: "BtnUrl", Type: "Text", Description: "Action Button: Navigation URL" }
                ]
            },
            {
                Title: "ContactQueries",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Sender Email" },
                    { InternalName: "SourcePage", Type: "Lookup", Description: "Origin Page", LookupListTitle: "SmartPages" },
                    { InternalName: "QueryStatus", Type: "Choice", Description: "Status", Choices: ["New", "Read", "Replied"] },
                    { InternalName: "FormData", Type: "Note", Description: "JSON payload" }
                ]
            },
            {
                Title: "TranslationDictionary",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Source Key (e.g. APP_TITLE)" },
                    { InternalName: "SourceList", Type: "Text", Description: "The source group/list for this translation", Indexed: true },
                    { InternalName: "EN", Type: "Text", Description: "English" },
                    { InternalName: "DE", Type: "Text", Description: "German" },
                    { InternalName: "FR", Type: "Text", Description: "French" },
                    { InternalName: "ES", Type: "Text", Description: "Spanish" }
                ]
            },
            {
                Title: "ContainerItems",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Item Title (English fallback)" },
                    { InternalName: "Status", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "SortOrder", Type: "Number", Description: "Numeric ordering for items" },
                    { InternalName: "Description", Type: "Note", Description: "Rich Text Content" },
                    { InternalName: "ImageUrl", Type: "URL", Description: "URL of the item image" },
                    { InternalName: "ImageName", Type: "Text", Description: "Name of the item image file" },
                    { InternalName: "Translations", Type: "Note", Description: "JSON store for translated fields" }
                ]
            },
            {
                Title: "Contacts",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Full Name (English fallback)" },
                    { InternalName: "FirstName", Type: "Text", Description: "Given Name" },
                    { InternalName: "LastName", Type: "Text", Description: "Surname" },
                    { InternalName: "Status", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "SortOrder", Type: "Number", Description: "Numeric ordering for contacts" },
                    { InternalName: "JobTitle", Type: "Text", Description: "Job Title/Position" },
                    { InternalName: "Company", Type: "Text", Description: "Company Name" },
                    { InternalName: "Email", Type: "Text", Description: "Contact Email Address" },
                    { InternalName: "Phone", Type: "Text", Description: "Contact Phone Number" },
                    { InternalName: "Description", Type: "Note", Description: "Biography or Description" },
                    { InternalName: "ImageUrl", Type: "URL", Description: "URL of the contact image" },
                    { InternalName: "ImageName", Type: "Text", Description: "Name of the contact image file" },
                    { InternalName: "Translations", Type: "Note", Description: "JSON store for translated fields" }
                ]
            },
            {
                Title: "ImageSlider",
                Template: 100,
                Columns: [
                    { InternalName: "Title", Type: "Text", Description: "Slide title (English fallback)" },
                    { InternalName: "Subtitle", Type: "Text", Description: "Slide subtitle or tagline" },
                    { InternalName: "Description", Type: "Note", Description: "Slide body text" },
                    { InternalName: "Status", Type: "Choice", Description: "Draft, Published", Choices: ["Draft", "Published"] },
                    { InternalName: "SortOrder", Type: "Number", Description: "Display order of the slide" },
                    { InternalName: "CtaText", Type: "Text", Description: "Call-to-action button label" },
                    { InternalName: "CtaUrl", Type: "Text", Description: "Call-to-action button URL" },
                    { InternalName: "ImageUrl", Type: "URL", Description: "URL of the slide image" },
                    { InternalName: "ImageName", Type: "Text", Description: "Name of the slide image file" },
                    { InternalName: "Translations", Type: "Note", Description: "JSON store for multilingual title, subtitle, description, ctaText" }
                ]
            }
        ];
    }
}
