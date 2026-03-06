import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageUploader from './ImageUploader';
import { Image, Folder, FilterType, Dimensions } from '../types';
import { useStore, getTranslation } from './../../../webStudio/store';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface ImageEditorModalProps {
    imagesLength: number;
    isOpen: boolean;
    onClose: () => void;
    onSave: (image: Omit<Image, 'id'> & { id?: number }) => void;
    onDelete?: (image: Image) => void;
    imageToEdit: Image | undefined;
    folders: Folder[];
    images: Image[];
    selectedFolderId?: number;
}

const BLANK_IMAGE_STATE: Omit<Image, 'id' | 'folderId'> & { folderId: number | '' } = {
    src: '',
    name: '',
    title: '',
    description: '',
    folderId: '',
    created: '',
    modifiedDate: '',
    author: '',
    editor: ''
};

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ imagesLength, isOpen, onClose, onSave, onDelete, imageToEdit, folders, images, selectedFolderId }) => {
    const [editedImage, setEditedImage] = useState<Omit<Image, 'id' | 'src' | 'folderId'> & { id?: number, src: string | null, folderId: number | '' }>(BLANK_IMAGE_STATE);
    const imgRef = useRef<HTMLImageElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [rotation, setRotation] = useState(0);
    const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.NONE);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
    const [isPreviewHovered, setIsPreviewHovered] = useState(false);
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const { currentLanguage } = useStore();

    const toggleAccordion = (id: string) => {
        setActiveAccordion(prev => prev === id ? null : id);
    };

    const resetEditorState = useCallback(() => {
        setCrop(undefined);
        setCompletedCrop(undefined);
        setRotation(0);
        setActiveFilter(FilterType.NONE);
        setDimensions({ width: 0, height: 0 });

        let initialFolderId: number | '' = '';
        if (selectedFolderId && selectedFolderId !== 0) {
            initialFolderId = selectedFolderId;
        } else if (folders.length > 0) {
            initialFolderId = folders[0].id;
        }

        setEditedImage({ ...BLANK_IMAGE_STATE, folderId: initialFolderId });
        setPreviewDataUrl(null);
    }, [folders, selectedFolderId]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
            if (imageToEdit) {
                setEditedImage(imageToEdit);
            } else {
                resetEditorState();
            }
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, imageToEdit, resetEditorState]);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
        setDimensions({ width, height });
        setCrop({
            unit: '%',
            width: 100,
            height: 100,
            x: 0,
            y: 0,
        });
        setCompletedCrop(undefined);
    }, []);

    const applyEdits = useCallback(() => {
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        if (!image || !canvas || !image.complete || image.naturalWidth === 0) {
            return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const cropToUse = completedCrop;
        const targetWidth = cropToUse ? cropToUse.width * scaleX : image.naturalWidth;
        const targetHeight = cropToUse ? cropToUse.height * scaleY : image.naturalHeight;

        canvas.width = dimensions.width || targetWidth;
        canvas.height = dimensions.height || targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.filter = activeFilter;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        const sourceX = cropToUse ? cropToUse.x * scaleX : 0;
        const sourceY = cropToUse ? cropToUse.y * scaleY : 0;
        const sourceWidth = cropToUse ? cropToUse.width * scaleX : image.naturalWidth;
        const sourceHeight = cropToUse ? cropToUse.height * scaleY : image.naturalHeight;

        ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    }, [completedCrop, rotation, activeFilter, dimensions]);

    useEffect(() => {
        if (editedImage.src) {
            applyEdits();
            if (previewCanvasRef.current) {
                setPreviewDataUrl(previewCanvasRef.current.toDataURL('image/png'));
            }
        }
    }, [applyEdits, editedImage.src]);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setEditedImage(prev => ({
                ...prev,
                src: reader.result as string,
                name: file.name,
                title: prev.title || '',
                description: prev.description || '',
            }));
        });
        reader.readAsDataURL(file);
    };

    const handlePropertyChange = (field: string, value: string | number) => {
        setEditedImage(prev => ({ ...prev, [field]: value }));
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDimensions(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
    };

    const handleSave = () => {
        if (!editedImage.src || !previewCanvasRef.current) return;
        if (!imageToEdit && !editedImage.folderId) {
            alert('Please select a folder for the new image.');
            return;
        }

        applyEdits();
        const finalImageSrc = previewCanvasRef.current.toDataURL('image/png');

        const finalImage: Omit<Image, 'id'> & { id?: number } = {
            ...editedImage,
            src: finalImageSrc || editedImage.src,
            folderId: editedImage.folderId as number, // Cast since we validate it's not empty
        };
        onSave(finalImage);
    };

    const handleCopyAndSave = () => {
        if (!editedImage.src || !previewCanvasRef.current) return;

        applyEdits();
        const finalImageSrc = previewCanvasRef.current.toDataURL('image/png');

        // Create a new image object, but without the ID
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...imageWithoutId } = editedImage;

        const finalImage: Omit<Image, 'id'> = {
            ...imageWithoutId,
            src: finalImageSrc || editedImage.src,
            folderId: editedImage.folderId as number,
            title: editedImage.title ? `${editedImage.title}_Copy${imagesLength + 1}` : "", // Add (Copy) to title
            name: editedImage.name, // Add prefix to name
        };
        onSave(finalImage);
    };

    if (!isOpen) return null;

    const controlsDisabled = !editedImage.src;

    return (
        <>
            <div className="modal-backdrop d-flex justify-content-center align-items-center" tabIndex={-1} role="dialog">
                <div className="modal-content p-4 edit-modal-large bg-white">
                    <div className="modal-header">
                        <div className="modal-title text-dark">
                            {imageToEdit
                                ? `${getTranslation('TITLE_EDITING', currentLanguage)}: ${editedImage.title || editedImage.name}`
                                : getTranslation('TITLE_ADD_NEW_IMAGE', currentLanguage)}
                        </div>
                        <button type="button" className="btn-close" onClick={onClose} aria-label={getTranslation('BTN_CLOSE', currentLanguage)}></button>
                    </div>
                    <div className="modal-body addimg scrollbar pe-1 border-0 p-0" style={{ flexGrow: '1', flexShrink: '1', flexBasis: 'auto' }}>
                        <div className="row g-4 h-100">
                            {/* Left Column: Uploader & Controls */}
                            <div className="col-lg-4 d-flex flex-column">
                                <div className="mb-4">
                                    <h6>{editedImage.src ? getTranslation('LABEL_REPLACE_IMAGE', currentLanguage) : getTranslation('LABEL_STEP_UPLOAD', currentLanguage)}</h6>
                                    <ImageUploader onImageUpload={handleImageUpload} images={images} />
                                </div>
                                <div className="flex-grow-1" style={{ opacity: controlsDisabled ? 0.6 : 1, pointerEvents: controlsDisabled ? 'none' : 'auto' }}>
                                    <h6>{getTranslation('LABEL_STEP_ADJUST', currentLanguage)}</h6>
                                    <div className="accordion" id="editorControlsAccordion">
                                        {/* Resize */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button ${activeAccordion === 'collapseResize' ? '' : 'collapsed'}`}
                                                    type="button"
                                                    onClick={() => toggleAccordion('collapseResize')}
                                                    aria-expanded={activeAccordion === 'collapseResize'}
                                                >
                                                    <i className="bi bi-aspect-ratio me-2 icon-theme"></i>{getTranslation('LABEL_RESIZE', currentLanguage)}
                                                </button>
                                            </h2>
                                            <div id="collapseResize" className={`accordion-collapse ${activeAccordion === 'collapseResize' ? 'd-block' : 'd-none'}`}>
                                                <div className="accordion-body">
                                                    <div className="input-group mb-2">
                                                        <span className="input-group-text" style={{ width: '40px' }}>W</span>
                                                        <input type="number" className="form-control" name="width" value={dimensions.width} onChange={handleDimensionChange} />
                                                    </div>
                                                    <div className="input-group">
                                                        <span className="input-group-text" style={{ width: '40px' }}>H</span>
                                                        <input type="number" className="form-control" name="height" value={dimensions.height} onChange={handleDimensionChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rotate */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button ${activeAccordion === 'collapseRotate' ? '' : 'collapsed'}`}
                                                    type="button"
                                                    onClick={() => toggleAccordion('collapseRotate')}
                                                    aria-expanded={activeAccordion === 'collapseRotate'}
                                                >
                                                    <i className="bi bi-arrow-clockwise me-2 icon-theme"></i>{getTranslation('LABEL_ROTATE', currentLanguage)}
                                                </button>
                                            </h2>
                                            <div id="collapseRotate" className={`accordion-collapse ${activeAccordion === 'collapseRotate' ? 'd-block' : 'd-none'}`}>
                                                <div className="accordion-body">
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-outline-secondary w-100" onClick={() => setRotation(r => r - 90)}><i className="bi bi-arrow-counterclockwise"></i> Left</button>
                                                        <button className="btn btn-outline-secondary w-100" onClick={() => setRotation(r => r + 90)}>Right <i className="bi bi-arrow-clockwise"></i></button>
                                                    </div>
                                                    <p className="text-muted text-center mt-2">Current: {rotation}°</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Filters */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button ${activeAccordion === 'collapseFilters' ? '' : 'collapsed'}`}
                                                    type="button"
                                                    onClick={() => toggleAccordion('collapseFilters')}
                                                    aria-expanded={activeAccordion === 'collapseFilters'}
                                                >
                                                    <i className="bi bi-palette me-2 icon-theme"></i>{getTranslation('LABEL_FILTERS', currentLanguage)}
                                                </button>
                                            </h2>
                                            <div id="collapseFilters" className={`accordion-collapse ${activeAccordion === 'collapseFilters' ? 'd-block' : 'd-none'}`}>
                                                <div className="accordion-body">
                                                    <div className="btn-group w-100" role="group">
                                                        <button type="button" className={`btn ${activeFilter === FilterType.NONE ? 'btn-primary' : 'btn-defaut'}`} onClick={() => handleFilterChange(FilterType.NONE)}>None</button>
                                                        <button type="button" className={`btn ${activeFilter === FilterType.GRAYSCALE ? 'btn-primary' : 'btn-defaut'}`} onClick={() => handleFilterChange(FilterType.GRAYSCALE)}>Grayscale</button>
                                                        <button type="button" className={`btn ${activeFilter === FilterType.SEPIA ? 'btn-primary' : 'btn-defaut'}`} onClick={() => handleFilterChange(FilterType.SEPIA)}>Sepia</button>
                                                        <button type="button" className={`btn ${activeFilter === FilterType.INVERT ? 'btn-primary' : 'btn-defaut'}`} onClick={() => handleFilterChange(FilterType.INVERT)}>Invert</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image Properties */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button ${activeAccordion === 'collapseProperties' ? '' : 'collapsed'}`}
                                                    type="button"
                                                    onClick={() => toggleAccordion('collapseProperties')}
                                                    aria-expanded={activeAccordion === 'collapseProperties'}
                                                >
                                                    <i className="bi bi-card-text me-2 icon-theme"></i>{getTranslation('LABEL_IMAGE_PROPERTIES', currentLanguage)}
                                                </button>
                                            </h2>
                                            <div id="collapseProperties" className={`accordion-collapse ${activeAccordion === 'collapseProperties' ? 'd-block' : 'd-none'}`}>
                                                <div className="accordion-body">
                                                    {!imageToEdit && (
                                                        <div className="mb-3">
                                                            <label htmlFor="folderId" className="form-label small fw-bold text-danger">Select Folder*</label>
                                                            <select
                                                                id="folderId"
                                                                className="form-select"
                                                                value={editedImage.folderId}
                                                                onChange={(e) => handlePropertyChange('folderId', parseInt(e.target.value))}
                                                                required
                                                            >
                                                                <option value="" disabled>Choose a folder...</option>
                                                                {folders.map(folder => (
                                                                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    <div className="mb-2">
                                                        <label htmlFor="imageName" className="form-label small">{getTranslation('LABEL_NAME', currentLanguage)}</label>
                                                        <input type="text" id="imageName" className="form-control" value={editedImage.name} onChange={(e) => handlePropertyChange('name', e.target.value)} placeholder={getTranslation('PH_IMG_NAME_EXAMPLE', currentLanguage)} />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor="title" className="form-label small">{getTranslation('LABEL_TITLE', currentLanguage)}</label>
                                                        <input type="text" id="title" className="form-control" value={editedImage.title} onChange={(e) => handlePropertyChange('title', e.target.value)} placeholder={getTranslation('PH_IMG_TITLE_EXAMPLE', currentLanguage)} />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label htmlFor="description" className="form-label small">{getTranslation('LABEL_DESCRIPTION', currentLanguage)}</label>
                                                        <textarea id="description" className="form-control" rows={3} value={editedImage.description} onChange={(e) => handlePropertyChange('description', e.target.value)} placeholder={getTranslation('PH_IMG_DESC_EXAMPLE', currentLanguage)}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column: Editor & Preview */}
                            <div className="col-lg-8 d-flex flex-column h-100">
                                {!editedImage.src ? (
                                    <div className="d-flex justify-content-center align-items-center h-100 border rounded bg-light">
                                        <div className="text-center text-muted">
                                            <i className="bi bi-image" style={{ fontSize: '6rem' }}></i>
                                            <h4 className="mt-3">Image Preview Area</h4>
                                            <p>Upload an image to start editing.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-secondary bg-opacity-10 p-3 rounded text-center d-flex align-items-center justify-content-center flex-grow-1" style={{ minHeight: 0 }}>
                                            <ReactCrop
                                                crop={crop}
                                                //src={editedImage.src}
                                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                onComplete={(c) => setCompletedCrop(c)}
                                            >
                                                <img
                                                    ref={imgRef}
                                                    src={editedImage.src}
                                                    alt="Upload Preview"
                                                    onLoad={onImageLoad}
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                />
                                            </ReactCrop>
                                        </div>
                                        <div className="mt-3 flex-shrink-0">
                                            <h6 className="text-muted text-center mb-2">Live Preview</h6>
                                            <div
                                                className="position-relative text-center"
                                                onMouseEnter={() => setIsPreviewHovered(true)}
                                                onMouseLeave={() => setIsPreviewHovered(false)}
                                            >
                                                <canvas
                                                    ref={previewCanvasRef}
                                                    className="border rounded shadow-sm mx-auto"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '15vh',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                                {isPreviewHovered && previewDataUrl && (
                                                    <div
                                                        className="position-absolute p-1 bg-white border rounded shadow-lg"
                                                        style={{
                                                            bottom: '100%',
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            marginBottom: '10px',
                                                            width: 'auto',
                                                            maxWidth: '400px',
                                                            zIndex: 1056
                                                        }}
                                                    >
                                                        <img
                                                            src={previewDataUrl}
                                                            alt="Large preview of edits"
                                                            style={{
                                                                width: '100%',
                                                                height: 'auto',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                        <div className="text-center small text-muted bg-light p-1">Large Preview</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer gap-2">
                        <div className="alignCenter w-100">
                            <div className='text-start'>
                                {imageToEdit && (
                                    <>
                                        <div className='alignCenter gap-1'><span >Created</span><span className='hreflink siteColor'> {editedImage?.created ? new Date(editedImage.created).toLocaleDateString() : ''}</span><span>By</span><span className='siteColor hreflink'><a>{editedImage?.author ? editedImage?.author : ''}</a></span></div>
                                        <div className='alignCenter gap-1'><span>Last modified</span><span className='hreflink siteColor'> {editedImage?.modifiedDate ? new Date(editedImage.modifiedDate).toLocaleDateString() : ''}</span><span>By</span><span className='siteColor hreflink'><a>{editedImage?.editor ? editedImage?.editor : ''}</a></span></div>
                                        {onDelete && imageToEdit && (
                                            <div className='mt-2'>
                                                <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => {
                                                    if (confirm(getTranslation('MSG_DELETE_CONFIRM', currentLanguage))) {
                                                        // @ts-ignore
                                                        onDelete(imageToEdit);
                                                    }
                                                }}>
                                                    <i className="bi bi-trash me-1 icon-theme"></i>{getTranslation('BTN_DELETE_ITEM', currentLanguage)}
                                                </button>
                                            </div>
                                        )}
                                        <div className='alignCenter gap-1'>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='alignCenter col gap-1 justify-content-end text-end'>
                                <button type="button" className="btn btn-default" onClick={onClose}>{getTranslation('BTN_CANCEL', currentLanguage)}</button>
                                {imageToEdit && (
                                    <button type="button" className="btn btn-primary" onClick={handleCopyAndSave} disabled={controlsDisabled}>
                                        <i className="bi bi-copy me-2"></i>{getTranslation('BTN_COPY_SAVE_NEW', currentLanguage)}
                                    </button>
                                )}
                                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={controlsDisabled}>
                                    {imageToEdit ? getTranslation('BTN_SAVE_CHANGES', currentLanguage) : getTranslation('BTN_SAVE_IMAGE', currentLanguage)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImageEditorModal;