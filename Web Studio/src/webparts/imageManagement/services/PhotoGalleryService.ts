import { SPFI, spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import { Image, Folder } from "../components/types";

interface ISpFolder {
    Name: string;
    ServerRelativeUrl: string;
    UniqueId: string;
}

export class PhotoGalleryService {
    private _sp: SPFI;

    // Initialize PnPjs using the SPFx context. This is the standard pattern for v3/v4.
    constructor(context: WebPartContext) {
        this._sp = spfi().using(SPFx(context));
    }

    private guidToNumber(guid: string): number {
        const hex = guid.replace(/-/g, "");
        const num = parseInt(hex.slice(0, 12), 16);
        return num;
    }

    public async getFolders(libraryName: string): Promise<Folder[]> {
        try {
            const libraryRoot = this._sp.web.lists.getByTitle(libraryName).rootFolder;
            const subFolders = await libraryRoot.folders
                .select("Name", "ServerRelativeUrl", "UniqueId")();

            return subFolders
                .filter((f: ISpFolder) => f.Name !== "Forms" && !f.Name.startsWith("_"))
                .map((f: ISpFolder) => ({
                    id: this.guidToNumber(f.UniqueId),
                    name: f.Name,
                    serverRelativeUrl: f.ServerRelativeUrl
                }));
        } catch (error) {
            console.error("Error fetching folders:", error);
            return [];
        }
    }

    public async getImages(libraryName: string, folders: Folder[]): Promise<Image[]> {
        try {
            const list = this._sp.web.lists.getByTitle(libraryName);
            // Cast to any to access getAll() mixin which might not be correctly typed in the environment
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let items: any[] = [];
            let pageSize = 5000;
            let pagedItems;

            do {
                pagedItems = await (list.items as any)
                    .select(
                        "Id", "Title", "Description", "FileLeafRef", "FileRef", "EncodedAbsUrl",
                        "ImageWidth", "ImageHeight", "UniqueId",
                        "Created", "Modified",
                        "Author/Id", "Author/Title",
                        "Editor/Id", "Editor/Title"
                    )
                    .expand("Author", "Editor")
                    .top(pageSize)
                    .skip(items.length)();

                items = items.concat(pagedItems);
            } while (pagedItems.length === pageSize);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedImages = items.map((item: any) => {
                // Determine file URL
                const fileUrl = item.EncodedAbsUrl || item.FileRef;

                if (fileUrl && fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
                    // Cache busting logic from snippet
                    const versionParam = item.Modified || item.UniqueId || Date.now().toString();
                    const cacheBustedUrl = `${fileUrl}?v=${encodeURIComponent(versionParam)}`;

                    return {
                        id: item.Id,
                        folderId: this.resolveFolderId(fileUrl, folders),
                        src: cacheBustedUrl,
                        name: item.FileLeafRef,
                        title: item.Title || "",
                        description: item.Description || "",
                        // copyright: item.CopyrightInfo || "", // Removed as requested
                        created: item.Created,
                        modified: item.Modified,
                        modifiedDate: item.Modified,
                        authorId: item.Author?.Id,
                        author: item.Author?.Title,
                        editorId: item.Editor?.Id,
                        editor: item.Editor?.Title,
                        uniqueId: item.UniqueId,
                        width: item.ImageWidth,
                        height: item.ImageHeight
                    } as Image;
                }
                return null;
            }).filter((i: Image | null) => i !== null) as Image[];

            return mappedImages;
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
    }

    private resolveFolderId(fileUrl: string, folders: Folder[]): number {
        try {
            // Snippet logic: parse URL segments
            const url = new URL(fileUrl.startsWith('http') ? fileUrl : window.location.origin + fileUrl);
            const pathSegments = url.pathname.split("/").filter(Boolean);

            // Look backwards through segments to find folder name
            for (let i = pathSegments.length - 2; i >= 0; i--) {
                const segment = decodeURIComponent(pathSegments[i]).toLowerCase();
                const folder = folders.find(
                    (f) => f.name.toLowerCase() === segment
                );
                if (folder) return folder.id;
            }
            return 0; // Default or Root
        } catch {
            // Fallback to simple includes check if URL parsing fails
            const urlPart = decodeURIComponent(fileUrl).toLowerCase();
            for (const folder of folders) {
                if (urlPart.includes(`/${folder.name.toLowerCase()}/`)) {
                    return folder.id;
                }
            }
            return 0;
        }
    }

    public async uploadImage(
        libraryName: string,
        imageFile: Blob,
        fileName: string,
        folderName: string,
        metadata: { title?: string; description?: string }
    ): Promise<void> {
        const libraryRoot = this._sp.web.lists.getByTitle(libraryName).rootFolder;

        let targetFolder;
        if (folderName && folderName !== "All Images") {
            try {
                targetFolder = libraryRoot.folders.getByUrl(folderName);
            } catch {
                targetFolder = libraryRoot;
            }
        } else {
            targetFolder = libraryRoot;
        }

        let finalFileName = fileName;

        // Check for existence and rename if necessary (Logic from snippet)
        try {
            // In PnPjs v3/v4 we filter using OData
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const existingFiles = await (targetFolder.files as any)
                .filter(`Name eq '${fileName}'`)
                .select("Name")();

            if (existingFiles.length > 0) {
                const extension = fileName.includes(".")
                    ? fileName.substring(fileName.lastIndexOf("."))
                    : "";
                const baseName = fileName.replace(extension, "");
                finalFileName = `${baseName}_${Date.now()}${extension}`;
            }
        } catch (e) {
            console.warn("Error checking for existing files, proceeding with original name", e);
        }

        // Upload with Overwrite: true effectively (since we renamed on conflict if needed, or we overwrite if we want to)
        // Wait, snippet says "file.add(..., false)" which implies failure on exist. 
        // But snippet logic does rename beforehand.
        // I will use addUsingPath with Overwrite true because I already uniquely named it if it existed.
        await targetFolder.files.addUsingPath(finalFileName, imageFile, { Overwrite: true });

        const file = targetFolder.files.getByUrl(finalFileName);
        const item = await file.getItem();

        await item.update({
            Title: metadata.title || "",
            Description: metadata.description || ""
            // CopyrightInfo removed
        });
    }

    public async updateImage(
        libraryName: string,
        itemId: number,
        metadata: { title?: string; description?: string },
        newBlob?: Blob,
        newFileName?: string
    ): Promise<void> {
        const list = this._sp.web.lists.getByTitle(libraryName);
        const item = list.items.getById(itemId);

        if (newBlob) {
            const file = item.file;
            await file.setContent(newBlob);
        }

        if (newFileName) {
            const currentItem = await item.select("FileLeafRef", "FileRef")();
            if (currentItem.FileLeafRef !== newFileName) {
                const file = item.file;
                await file.moveByPath(newFileName, true);
            }
        }

        await item.update({
            Title: metadata.title,
            Description: metadata.description
            // CopyrightInfo removed
        });
    }
    public async deleteImage(libraryName: string, itemId: number): Promise<void> {
        try {
            await this._sp.web.lists.getByTitle(libraryName).items.getById(itemId).delete();
        } catch (error) {
            console.error("Error deleting image:", error);
            throw error;
        }
    }
}
