import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFx, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/batching";
import SharePointListProvisioner from './SharePointListProvisioner';

/**
 * SharePoint Service - Individual exported functions
 * Each function is exported separately for granular imports
 */

// Singleton SP instance
let spInstance: SPFI | null = null;
let webPartContext: WebPartContext | null = null;

/**
 * Initialize the SharePoint instance
 * Must be called before using any SP functions
 */
export const initializeSP = (context: WebPartContext): SPFI => {
    webPartContext = context;
    spInstance = spfi().using(SPFx(context));
    return spInstance;
};

/**
 * Get the current SP instance
 * Throws error if not initialized
 */
const getSP = (): SPFI => {
    if (!spInstance) {
        throw new Error("SP instance not initialized. Call initializeSP(context) first.");
    }
    return spInstance;
};

/**
 * Handle missing list errors by attempting to provision all lists
 */
const handleListError = async (error: any, listName: string): Promise<boolean> => {
    if ((error?.message?.indexOf("404") !== -1 || error?.message?.indexOf("does not exist") !== -1 || error?.status === 404) && webPartContext) {
        console.warn(`⚠️ List '${listName}' not found. Auto-provisioning lists...`);
        try {
            const provisioner = new SharePointListProvisioner(webPartContext);
            await provisioner.provisionAllLists();
            return true;
        } catch (provisionError) {
            console.error("❌ Auto-provisioning failed:", provisionError);
        }
    }
    return false;
};

// ==================== SmartPages ====================

export const getPages = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('SmartPages').items
        .select('Id', 'Title', 'MultilingualTitle', 'Slug', 'PageStatus', 'IsHomePage', 'Description', 'SEOConfig', 'VersionNote', 'Modified', 'Created', 'Author/Title', 'Editor/Title')
        .expand('Author', 'Editor')
        .orderBy('Title')();
};

export const getPageById = async (id: number): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('SmartPages').items.getById(id)();
};

export const savePage = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('SmartPages').items.add(data);
};

export const updatePage = async (id: number, data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('SmartPages').items.getById(id).update(data);
};

export const deletePage = async (id: number): Promise<void> => {
    const sp = getSP();
    await sp.web.lists.getByTitle('SmartPages').items.getById(id).delete();
};

// ==================== Containers ====================

export const getContainersByPageId = async (pageId: number): Promise<any[]> => {
    const sp = getSP();

    return await sp.web.lists
        .getByTitle('Containers')
        .items
        .filter(`PageId eq ${pageId}`)
        .select(
            'Id',
            'PageId',
            'Title',
            'ContainerType',
            'SortOrder',
            'Settings',
            'ContainerContent',
            'IsVisible',
            'BtnEnabled',
            'BtnName',
            'BtnUrl'
        )
        .orderBy('SortOrder')();
};

export const saveContainer = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('Containers').items.add(data);
};

export const updateContainer = async (id: number, data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('Containers').items.getById(id).update(data);
};

export const deleteContainer = async (id: number): Promise<void> => {
    const sp = getSP();
    await sp.web.lists.getByTitle('Containers').items.getById(id).delete();
};

// ==================== TopNavigation ====================

export const getNavigation = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('TopNavigation').items
        .select('Id', 'Title', 'Parent/Id', 'NavType', 'SmartPage/Id', 'SmartPage/Title', 'ExternalURL', 'SortOrder', 'IsVisible', 'OpenInNewTab', 'Translations', 'Modified')
        .expand('Parent', 'SmartPage')
        .orderBy('SortOrder')();
};

export const saveNavItem = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('TopNavigation').items.add(data);
};

export const updateNavItem = async (id: number, data: any): Promise<any> => {
    if (isNaN(id)) return;
    const sp = getSP();
    return await sp.web.lists.getByTitle('TopNavigation').items.getById(id).update(data);
};

export const deleteNavItem = async (id: number): Promise<void> => {
    if (isNaN(id)) return;
    const sp = getSP();
    await sp.web.lists.getByTitle('TopNavigation').items.getById(id).delete();
};

// ==================== News ====================

export const getNews = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('News').items
        .select('Id', 'Title', 'Status', 'PublishDate', 'Description', 'Thumbnail/Id', 'ReadMoreURL', 'ReadMoreText', 'ReadMoreEnabled', 'SEOConfig', 'Translations', 'ImageUrl', 'ImageName', 'Modified', 'Created', 'Author/Title', 'Editor/Title')
        .expand('Thumbnail', 'Author', 'Editor')
        .orderBy('PublishDate', false)();
};

export const saveNews = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('News').items.add(data);
};

export const updateNews = async (id: number, data: any): Promise<any> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP update for invalid News ID: ${id}`);
        return;
    }
    const sp = getSP();
    return await sp.web.lists.getByTitle('News').items.getById(id).update(data);
};

export const deleteNews = async (id: number): Promise<void> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP delete for invalid News ID: ${id}`);
        return;
    }
    const sp = getSP();
    await sp.web.lists.getByTitle('News').items.getById(id).delete();
};

// ==================== Events ====================

export const getEvents = async (): Promise<any[]> => {
    const fetchEvents = async () => {
        const sp = getSP();
        return await sp.web.lists.getByTitle('Events').items
            .select('Id', 'Title', 'StartDate', 'EndDate', 'Location', 'Description', 'Category', 'Translations', 'Status', 'ImageUrl', 'ImageName', 'ReadMoreURL', 'ReadMoreText', 'ReadMoreEnabled', 'SEOConfig', 'Modified', 'Created', 'Author/Title', 'Editor/Title')
            .expand('Author', 'Editor')
            .orderBy('StartDate', true)();
    };

    try {
        return await fetchEvents();
    } catch (error) {
        if (await handleListError(error, 'Events')) {
            return await fetchEvents();
        }
        throw error;
    }
};

export const saveEvent = async (data: any): Promise<any> => {
    const sp = getSP();
    const payload = { ...data };
    if (payload.StartDate && typeof payload.StartDate !== 'string') payload.StartDate = new Date(payload.StartDate).toISOString();
    if (payload.EndDate && typeof payload.EndDate !== 'string') payload.EndDate = new Date(payload.EndDate).toISOString();

    return await sp.web.lists.getByTitle('Events').items.add(payload);
};

export const updateEvent = async (id: number, data: any): Promise<any> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP update for invalid Event ID: ${id}`);
        return;
    }
    const sp = getSP();
    const payload = { ...data };
    if (payload.StartDate && typeof payload.StartDate !== 'string') payload.StartDate = new Date(payload.StartDate).toISOString();
    if (payload.EndDate && typeof payload.EndDate !== 'string') payload.EndDate = new Date(payload.EndDate).toISOString();

    return await sp.web.lists.getByTitle('Events').items.getById(id).update(payload);
};

export const deleteEvent = async (id: number): Promise<void> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP delete for invalid Event ID: ${id}`);
        return;
    }
    const sp = getSP();
    await sp.web.lists.getByTitle('Events').items.getById(id).delete();
};

// ==================== ContainerItems ====================

export const getContainerItems = async (): Promise<any[]> => {
    const fetchContainerItems = async () => {
        const sp = getSP();
        return await sp.web.lists.getByTitle('ContainerItems').items
            .select('Id', 'Title', 'Status', 'SortOrder', 'Description', 'Translations', 'ImageUrl', 'ImageName', 'Modified', 'Created', 'Author/Title', 'Editor/Title')
            .expand('Author', 'Editor')
            .orderBy('SortOrder', true)();
    };

    try {
        return await fetchContainerItems();
    } catch (error) {
        if (await handleListError(error, 'ContainerItems')) {
            return await fetchContainerItems();
        }
        throw error;
    }
};

export const saveContainerItem = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('ContainerItems').items.add(data);
};

export const updateContainerItem = async (id: number, data: any): Promise<any> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP update for invalid ContainerItem ID: ${id}`);
        return;
    }
    const sp = getSP();
    return await sp.web.lists.getByTitle('ContainerItems').items.getById(id).update(data);
};

export const deleteContainerItem = async (id: number): Promise<void> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP delete for invalid ContainerItem ID: ${id}`);
        return;
    }
    const sp = getSP();
    await sp.web.lists.getByTitle('ContainerItems').items.getById(id).delete();
};

// ==================== ImageSlider ====================

export const getSliderItems = async (): Promise<any[]> => {
    const fetchSliderItems = async () => {
        const sp = getSP();
        return await sp.web.lists.getByTitle('ImageSlider').items
            .select('Id', 'Title', 'Subtitle', 'Description', 'Status', 'SortOrder', 'CtaText', 'CtaUrl', 'Translations', 'ImageUrl', 'ImageName', 'Modified', 'Created', 'Author/Title', 'Editor/Title')
            .expand('Author', 'Editor')
            .orderBy('SortOrder', true)();
    };

    try {
        return await fetchSliderItems();
    } catch (error) {
        if (await handleListError(error, 'ImageSlider')) {
            return await fetchSliderItems();
        }
        console.warn('ImageSlider list not available, returning empty.');
        return [];
    }
};

export const saveSliderItem = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('ImageSlider').items.add(data);
};

export const updateSliderItem = async (id: number, data: any): Promise<any> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP update for invalid SliderItem ID: ${id}`);
        return;
    }
    const sp = getSP();
    return await sp.web.lists.getByTitle('ImageSlider').items.getById(id).update(data);
};

export const deleteSliderItem = async (id: number): Promise<void> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP delete for invalid SliderItem ID: ${id}`);
        return;
    }
    const sp = getSP();
    await sp.web.lists.getByTitle('ImageSlider').items.getById(id).delete();
};

// ==================== Contacts ====================

export const getContacts = async (): Promise<any[]> => {
    const fetchContacts = async () => {
        const sp = getSP();
        return await sp.web.lists.getByTitle('Contacts').items
            .select('Id', 'Title', 'FirstName', 'LastName', 'Status', 'SortOrder', 'JobTitle', 'Company', 'Email', 'Phone', 'Description', 'Translations', 'ImageUrl', 'ImageName', 'Modified', 'Created', 'Author/Title', 'Editor/Title')
            .expand('Author', 'Editor')
            .orderBy('SortOrder', true)();
    };

    try {
        return await fetchContacts();
    } catch (error) {
        if (await handleListError(error, 'Contacts')) {
            return await fetchContacts();
        }
        throw error;
    }
};

export const saveContact = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('Contacts').items.add(data);
};

export const updateContact = async (id: number, data: any): Promise<any> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP update for invalid Contact ID: ${id}`);
        return;
    }
    const sp = getSP();
    return await sp.web.lists.getByTitle('Contacts').items.getById(id).update(data);
};

export const deleteContact = async (id: number): Promise<void> => {
    if (isNaN(id)) {
        console.warn(`Skipping SP delete for invalid Contact ID: ${id}`);
        return;
    }
    const sp = getSP();
    await sp.web.lists.getByTitle('Contacts').items.getById(id).delete();
    console.log(`✅ Deleted Contact with ID ${id}`);
};

// ==================== Documents ====================

export interface IDocumentItem {
    Id: string;
    Title: string;
    DocStatus: string;
    Modified?: string;
    DocType: string;
    DocumentYear: string;
    DocumentDescriptions?: string;
    ItemRank: string;
    url?: string;
}

export const getDocuments = async (): Promise<IDocumentItem[]> => {
    try {
        const sp = getSP();

        const items = await sp.web.lists
            .getByTitle('Documents')
            .items
            .select(
                'Id',
                'FileLeafRef',
                'FileRef',
                'Created',
                'Modified',
                'DocumentYear',
                'DocStatus',
                'ItemRank',
                'DocType',
                'DocumentDescriptions',
                'SortOrder',
                'Translations',
                'ImageUrl',
                'ImageName',
                'Author/Title',
                'Editor/Title'
            )
            .expand('Author', 'Editor')
            .filter("FSObjType eq 0")
            .orderBy('FileLeafRef', true)();

        return items.map(item => ({
            Id: item.Id.toString(),
            Title: item.FileLeafRef
                ? item.FileLeafRef.replace(/\.[^/.]+$/, '')
                : '',
            Name: item.FileLeafRef || '', // Include actual file name
            DocStatus: item.DocStatus,
            Modified: item.Modified || item.Created,
            Created: item.Created,
            AuthorName: item.Author?.Title,
            EditorName: item.Editor?.Title,
            DocType: item.DocType,
            DocumentYear: item.DocumentYear,
            DocumentDescriptions: item.DocumentDescriptions || '',
            ItemRank: item.ItemRank,
            SortOrder: item.SortOrder,
            Translations: item.Translations,
            ImageUrl: item.ImageUrl?.Url || '',
            ImageName: item.ImageName || '',
            FileRef: item.FileRef
        }));

    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
};
export const saveDocument = async (data: any): Promise<any> => {
    try {
        const sp = getSP();

        if (!data.Title || data.Title.trim() === '') {
            throw new Error('Title is required');
        }

        const webInfo = await sp.web.select('ServerRelativeUrl')();
        const libraryPath = `${webInfo.ServerRelativeUrl}/Documents`;

        let uploadResult: any;

        if (data.File) {
            uploadResult = await sp.web.lists
                .getByTitle('Documents')
                .rootFolder
                .files.addUsingPath(
                    data.File.name,
                    data.File,
                    { Overwrite: true }
                );
        } else if (data.FileRef && data.FileRef.trim() !== '') {
            uploadResult = await sp.web
                .getFolderByServerRelativePath(libraryPath)
                .files.addUsingPath(
                    `${data.Title}.url`,
                    `[InternetShortcut]\nURL=${data.FileRef}`,
                    { Overwrite: true }
                );
        } else {
            uploadResult = await sp.web
                .getFolderByServerRelativePath(libraryPath)
                .files.addUsingPath(
                    `${data.Title}.txt`,
                    'Placeholder document.\nNo file or link was provided at creation time.',
                    { Overwrite: true }
                );
        }

        const item = await sp.web
            .getFileByServerRelativePath(uploadResult.ServerRelativeUrl)
            .getItem();

        const metadata: any = {
            DocStatus: data.DocStatus,
            DocType: data.DocType,
            DocumentYear: data.DocumentYear,
            ItemRank: data.ItemRank,
            DocumentDescriptions: data.DocumentDescriptions || ''
        };

        Object.keys(metadata).forEach(
            key => metadata[key] === undefined && delete metadata[key]
        );

        await item.update(metadata);

        return await item.select('Id')();

    } catch (error) {
        console.error('saveDocument error:', error);
        throw error;
    }
};

export const updateDocument = async (id: number, data: any): Promise<any> => {
    try {
        const sp = getSP();

        const item = sp.web.lists
            .getByTitle('Documents')
            .items.getById(id);

        const uploadedFile = data.File;

        /* -------- 1. Replace file content (no rename) -------- */
        if (uploadedFile instanceof File) {
            const fileInfo = await item.file();
            await sp.web
                .getFileByServerRelativePath(fileInfo.ServerRelativeUrl)
                .setContent(uploadedFile);
        }

        /* -------- 2. Rename file ONLY if Name explicitly provided -------- */
        if (typeof data.Name === 'string' && data.Name.trim() !== '') {
            const currentFile = await item.file();

            if (currentFile.Name !== data.Name) {
                const currentPath = currentFile.ServerRelativeUrl;
                const folderPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                const newPath = `${folderPath}${data.Name}`;

                await sp.web
                    .getFileByServerRelativePath(currentPath)
                    .moveByPath(newPath, true);
            }
        }

        /* -------- 3. Metadata update (Title is metadata ONLY) -------- */
        const {
            File: _ignoredFile,
            Name: _ignoredName,
            ...metadata
        } = data;

        Object.keys(metadata).forEach(
            key => metadata[key] === undefined && delete metadata[key]
        );

        if (Object.keys(metadata).length > 0) {
            await item.update(metadata);
        }

        return await item.select('Id')();

    } catch (error) {
        console.error('updateDocument error:', error);
        throw error;
    }
};

export const deleteDocument = async (id: number): Promise<void> => {
    const sp = getSP();
    await sp.web.lists.getByTitle('Documents').items.getById(id).delete();
};

// ==================== Images ====================

export interface IImageItem {
    Id: number;
    FileName: string;
    ImageUrl: string;
    AltText?: string;
    AssetCategory?: string;
    CopyrightInfo?: string;
    Created: string;
    AuthorName?: string;
    Title?: string;
    Description?: string;
}

// Helper to resolve folder ID from path
const resolveFolderId = (fileUrl: string, folders: IImageFolder[]): string => {
    try {
        const urlPart = decodeURIComponent(fileUrl).toLowerCase();
        for (const folder of folders) {
            if (urlPart.includes(`/${folder.name.toLowerCase()}/`)) {
                return folder.id;
            }
        }
        return 'all';
    } catch {
        return 'all';
    }
};

export const getImages = async (folders: IImageFolder[] = []): Promise<IImageItem[]> => {
    try {
        const sp = getSP();

        const items = await sp.web.lists
            .getByTitle('Images')
            .items
            .select(
                'Id',
                'FileLeafRef',
                'FileRef',
                'Created',
                'Modified',
                'Author/Title',
                'Editor/Title',
                'FSObjType',
                'Title',
                'Description',
                'AltText',
                'AssetCategory',
                'CopyrightInfo'
            )
            .expand('Author', 'Editor')
            .filter("FSObjType eq 0")
            .orderBy('Created', false)();

        const webData = await sp.web.select("Url")();
        const host = new URL(webData.Url).origin;

        return items.map(item => ({
            Id: item.Id,
            FileName: item.FileLeafRef,
            ImageUrl: item.FileRef.startsWith('http') ? item.FileRef : `${host}${item.FileRef}`,
            AltText: item.AltText || item.FileLeafRef,
            AssetCategory: item.AssetCategory || resolveFolderId(item.FileRef, folders),
            CopyrightInfo: item.CopyrightInfo || '',
            Created: item.Created,
            Modified: item.Modified,
            AuthorName: item.Author?.Title,
            EditorName: item.Editor?.Title,
            Title: item.Title || item.FileLeafRef,
            Description: item.Description || ''
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

export interface IImageFolder {
    id: string;
    name: string;
    serverRelativeUrl: string;
}

export const getFolders = async (): Promise<IImageFolder[]> => {
    try {
        const sp = getSP();
        const list = sp.web.lists.getByTitle('Images');
        const rootFolder = list.rootFolder;
        const subFolders = await rootFolder.folders.select("Name", "ServerRelativeUrl", "UniqueId")();

        return subFolders
            .filter((f: any) => f.Name !== "Forms" && !f.Name.startsWith("_"))
            .map((f: any) => ({
                id: f.Name.toLowerCase(),
                name: f.Name,
                serverRelativeUrl: f.ServerRelativeUrl
            }));
    } catch (error) {
        console.error("Error fetching folders:", error);
        return [];
    }
};

export const checkImageExists = async (fileName: string, folderName: string = ''): Promise<boolean> => {
    const sp = getSP();
    const libraryName = 'Images';

    try {
        const list = sp.web.lists.getByTitle(libraryName);
        const rootFolder = await list.rootFolder();
        let folderPath = rootFolder.ServerRelativeUrl;

        if (folderName && folderName !== 'all' && folderName !== 'All Images') {
            folderPath = `${folderPath}/${folderName}`;
        }

        const filePath = `${folderPath}/${fileName}`;

        try {
            await sp.web.getFileByServerRelativePath(filePath)();
            return true;
        } catch {
            return false;
        }
    } catch (error) {
        console.error("Error checking file existence:", error);
        return false;
    }
};

export const uploadImage = async (
    file: File,
    folderName: string = '',
    metadata?: any
): Promise<any> => {

    const sp = getSP();
    const libraryName = 'Images';

    try {
        const list = sp.web.lists.getByTitle(libraryName);
        const rootFolder = await list.rootFolder();

        let folderPath = rootFolder.ServerRelativeUrl;

        if (folderName && folderName !== 'all' && folderName !== 'All Images') {
            folderPath = `${folderPath}/${folderName}`;
            try {
                await sp.web.getFolderByServerRelativePath(folderPath)();
            } catch {
                await sp.web.folders.addUsingPath(folderPath);
            }
        }

        // Note: Validation should be done before calling this, but we use Overwrite: true to ensure update works if intended.
        // If the user wants to prevent overwrite, they should use checkImageExists first.
        // Upload the file
        await sp.web
            .getFolderByServerRelativePath(folderPath)
            .files.addUsingPath(file.name, file, { Overwrite: true });

        // Retrieve the item associated with the uploaded file
        // This avoids potential issues with the return type of addUsingPath in different contexts
        const item = await sp.web.getFileByServerRelativePath(`${folderPath}/${file.name}`).getItem();

        const finalMetadata = {
            Title: metadata?.Title || file.name,
            AltText: metadata?.AltText || metadata?.Title || file.name,
            AssetCategory: (folderName && folderName !== 'all') ? folderName : 'General',
            Description: metadata?.Description || '',
            CopyrightInfo: metadata?.CopyrightInfo || ''
        };

        await item.update(finalMetadata);

        const freshItem = await item.select('Id', 'Created', 'Modified', 'FileLeafRef', 'FileRef')();

        return {
            item: freshItem
        };

    } catch (error) {
        console.error("PnPjs v3 image upload failed", error);
        throw error;
    }
};

export const updateImage = async (id: number, file?: File, metadata?: any): Promise<any> => {
    try {
        const sp = getSP();
        const item = sp.web.lists.getByTitle('Images').items.getById(id);

        if (file) {
            const fileInfo = await item.file();
            await sp.web.getFileByServerRelativePath(fileInfo.ServerRelativeUrl).setContent(file);
        }

        if (metadata) {
            const finalMetadata: any = {};
            if (metadata.Title) finalMetadata.Title = metadata.Title;
            if (metadata.Title) finalMetadata.AltText = metadata.Title;
            if (metadata.Description !== undefined) finalMetadata.Description = metadata.Description;
            if (metadata.AssetCategory) finalMetadata.AssetCategory = metadata.AssetCategory;
            if (metadata.CopyrightInfo) finalMetadata.CopyrightInfo = metadata.CopyrightInfo;

            if (Object.keys(finalMetadata).length > 0) {
                await item.update(finalMetadata);
            }
        }

        const freshItem = await item.select('Id', 'Created', 'Modified', 'FileLeafRef', 'FileRef', 'Title', 'Description', 'AltText', 'AssetCategory', 'CopyrightInfo')();
        return freshItem;
    } catch (error) {
        console.error("updateImage failed", error);
        throw error;
    }
};

export const deleteImage = async (id: number): Promise<void> => {
    if (isNaN(id)) return;
    const sp = getSP();
    await sp.web.lists.getByTitle('Images').items.getById(id).delete();
};

export const updateImageMetadata = async (id: number, metadata: any): Promise<void> => {
    if (isNaN(id)) return;
    const sp = getSP();
    await sp.web.lists.getByTitle('Images').items.getById(id).update(metadata);
};

/**
 * Upload an image from a URL to SharePoint Picture Library
 * Downloads the image from the provided URL and uploads it to SharePoint
 * @param imageUrl - The URL of the image to download and upload
 * @param folderName - Optional folder name in the Images library (default: 'Containers')
 * @param metadata - Optional metadata for the image
 * @returns The SharePoint URL of the uploaded image
 */
export const uploadImageFromUrl = async (
    imageUrl: string,
    folderName: string = 'Containers',
    metadata?: { Title?: string; Description?: string; AltText?: string }
): Promise<string> => {
    try {
        // Skip if the URL is already a SharePoint URL
        if (!imageUrl || imageUrl.trim() === '') {
            console.log('   ⚠️ Empty image URL, skipping upload');
            return '';
        }

        const sp = getSP();
        const webData = await sp.web.select("Url")();
        const siteUrl = webData.Url;

        // Check if URL is already from SharePoint
        if (imageUrl.includes(siteUrl)) {
            console.log('   ℹ️ Image already hosted on SharePoint, skipping upload');
            return imageUrl;
        }

        console.log(`   📥 Downloading image from URL: ${imageUrl}`);

        // Fetch the image from the URL
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Get the blob
        const blob = await response.blob();

        // Extract filename from URL or generate one
        let fileName = imageUrl.split('/').pop()?.split('?')[0] || `image_${Date.now()}.jpg`;

        // Ensure filename has an extension
        if (!fileName.includes('.')) {
            const contentType = response.headers.get('content-type');
            const extension = contentType?.split('/')[1]?.split(';')[0] || 'jpg';
            fileName = `${fileName}.${extension}`;
        }

        // Clean filename - remove special characters
        fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

        console.log(`   📤 Uploading to SharePoint as: ${fileName}`);

        // Convert blob to File
        const file = new File([blob], fileName, { type: blob.type });

        // Upload using existing uploadImage function
        const result = await uploadImage(file, folderName, {
            Title: metadata?.Title || fileName,
            Description: metadata?.Description || `Uploaded from ${imageUrl}`,
            AltText: metadata?.AltText || fileName
        });

        // Construct full URL
        const host = new URL(siteUrl).origin;
        const uploadedUrl = result.item.FileRef.startsWith('http')
            ? result.item.FileRef
            : `${host}${result.item.FileRef}`;

        console.log(`   ✅ Image uploaded successfully: ${uploadedUrl}`);
        return uploadedUrl;

    } catch (error) {
        console.error('   ❌ Failed to upload image from URL:', error);
        // Return original URL as fallback
        return imageUrl;
    }
};

// ==================== GlobalSettings ====================

export const getGlobalSettings = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('GlobalSettings').items
        .select('Id', 'Title', 'ConfigData')();
};

export const getSettingByKey = async (key: string): Promise<any> => {
    const sp = getSP();
    const items = await sp.web.lists.getByTitle('GlobalSettings').items
        .filter(`Title eq '${key}'`)
        .top(1)();
    return items.length > 0 ? items[0] : null;
};

export const saveSetting = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('GlobalSettings').items.add(data);
};

export const updateSetting = async (id: number, data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('GlobalSettings').items.getById(id).update(data);
};

export const upsertGlobalSetting = async (key: string, data: any): Promise<void> => {
    const sp = getSP();
    const items = await sp.web.lists.getByTitle('GlobalSettings').items.filter(`Title eq '${key}'`).top(1)();

    if (items.length > 0) {
        await sp.web.lists.getByTitle('GlobalSettings').items.getById(items[0].Id).update({
            ConfigData: data.ConfigData
        });
    } else {
        await sp.web.lists.getByTitle('GlobalSettings').items.add({
            Title: key,
            ConfigData: data.ConfigData
        });
    }
};

// ==================== TranslationDictionary ====================

export const getTranslations = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('TranslationDictionary').items
        .select('Id', 'Title', 'SourceList', 'EN', 'DE', 'FR', 'ES').top(1000)();
};

export const saveTranslation = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('TranslationDictionary').items.add(data);
};

export const updateTranslation = async (id: number, data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('TranslationDictionary').items.getById(id).update(data);
};

export const upsertTranslation = async (key: string, translations: any, sourceList: string = 'General'): Promise<void> => {
    const sp = getSP();
    const items = await sp.web.lists.getByTitle('TranslationDictionary').items.filter(`Title eq '${key}'`).top(1)();

    const payload = {
        Title: key,
        SourceList: sourceList,
        DE: translations.de || '',
        FR: translations.fr || '',
        ES: translations.es || ''
    };

    if (items.length > 0) {
        await sp.web.lists.getByTitle('TranslationDictionary').items.getById(items[0].Id).update(payload);
    } else {
        await sp.web.lists.getByTitle('TranslationDictionary').items.add(payload);
    }
};

// ==================== ContactQueries ====================

export const getContactQueries = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('ContactQueries').items
        .select('Id', 'Title', 'SourcePage/Id', 'SourcePage/Title', 'QueryStatus', 'FormData', 'Created')
        .expand('SourcePage')
        .orderBy('Created', false)();
};

export const saveContactQuery = async (data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('ContactQueries').items.add(data);
};

export const updateContactQuery = async (id: number, data: any): Promise<any> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle('ContactQueries').items.getById(id).update(data);
};

export const deleteContactQuery = async (id: number): Promise<void> => {
    const sp = getSP();
    await sp.web.lists.getByTitle('ContactQueries').items.getById(id).delete();
};

export const deleteContactQueries = async (ids: number[]): Promise<void> => {
    const sp = getSP();
    const list = sp.web.lists.getByTitle('ContactQueries');

    for (const id of ids) {
        await list.items.getById(id).delete();
    }
};

// ==================== List Field Retrieval ====================

/**
 * Get all fields (columns) from a SharePoint list
 * Useful for understanding list schema and available fields
 */
export const getListFields = async (listTitle: string): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle(listTitle).fields
        .select('Id', 'Title', 'InternalName', 'TypeAsString', 'Description', 'Required', 'Hidden', 'ReadOnlyField')
        .filter('Hidden eq false')
        .orderBy('Title')();
};

/**
 * Get all lists in the current SharePoint site
 */
export const getAllLists = async (): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists
        .select('Id', 'Title', 'ItemCount', 'BaseTemplate', 'Description', 'Hidden')
        .filter('Hidden eq false')
        .orderBy('Title')();
};

/**
 * Get version history for a specific list item
 */
export const getItemVersions = async (listTitle: string, itemId: number): Promise<any[]> => {
    const sp = getSP();
    return await sp.web.lists.getByTitle(listTitle).items.getById(itemId).versions();
};

/**
 * Restore a specific version of a list item
 */
export const restoreItemVersion = async (listTitle: string, itemId: number, versionLabel: string): Promise<void> => {
    const sp = getSP();
    // PnP JS v3 doesn't have a direct restore() but we can get the version data and update the item
    const versions = await sp.web.lists.getByTitle(listTitle).items.getById(itemId).versions();
    const targetVersion = versions.find((v: any) => v.VersionLabel === versionLabel);

    if (targetVersion) {
        // Extract fields to restore (excluding metadata ones like Created, Modified, Author, Editor, etc.)
        const { Created, Modified, Author, Editor, ID, Id, ...fieldsToRestore } = targetVersion;
        await sp.web.lists.getByTitle(listTitle).items.getById(itemId).update(fieldsToRestore);
    } else {
        throw new Error(`Version ${versionLabel} not found`);
    }
};
