import * as React from 'react';
import { Folder } from './../types';
import { useStore, getTranslation } from './../../../webStudio/store';

interface FolderListProps {
    folders: (Folder & { imageCount: number })[];
    totalImageCount: number;
    selectedFolderId: number;
    onSelectFolder: (folderId: number) => void;
}

const FolderList: React.FC<FolderListProps> = ({ folders, totalImageCount, selectedFolderId, onSelectFolder }) => {
    const { currentLanguage } = useStore();
    return (
        <div className="card h-100 d-flex flex-column">
            <div className="card-header flex-shrink-0">
                <h5 className="mb-0">{getTranslation('LABEL_FOLDERS', currentLanguage)}</h5>
            </div>
            <div className="list-group list-group-flush scrollbar border-0">
                <button
                    type="button"
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedFolderId === 0 ? 'active' : ''}`}
                    onClick={() => onSelectFolder(0)}
                >
                    <div className="fw-bold d-flex align-items-center">
                        <i className="bi bi-images me-2 icon-theme" title={getTranslation('LABEL_ALL_IMAGES', currentLanguage)}></i> {getTranslation('LABEL_ALL_IMAGES', currentLanguage)}
                    </div>
                    <span className="badge bg-SiteColor rounded-pill">{totalImageCount}</span>
                </button>
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedFolderId === folder.id ? 'active' : ''}`}
                        onClick={() => onSelectFolder(folder.id)}
                    >
                        <div className="d-flex align-items-center">
                            <i className="bi bi-folder me-2 icon-theme" title={folder.name}></i> {folder.name}
                        </div>
                        <span className="badge bg-SiteColor rounded-pill">{folder.imageCount}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FolderList;
