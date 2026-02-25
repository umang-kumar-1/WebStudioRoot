
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useStore, getLocalizedText, getTranslation, getItemTranslation, GLOBAL_DEFAULT_IMAGE } from '../../store';
import { translateText } from '../../services/geminiService';
import { Container, SliderItem } from '../../types';
import { GenericModal, TabButton, ConfirmDeleteDialog, EditTrigger } from './SharedModals';
import { SharePointMetadataFooter } from '../common/SharePointMetadataFooter';
import { JoditRichTextEditor } from '../JoditEditor';
import {
    Plus, X, GripVertical, Image as ImageIcon, Trash2, Copy, Pencil,
    ArrowUpDown, ChevronLeft, ChevronRight, Eye, Save,
    Link as LinkIcon, Circle, Upload,
    Search, Wand2, Check, Hash
} from 'lucide-react';

// Images are now fetched from SharePoint Picture Library dynamically

// --- NOTE: Slider items are fully dynamic via SharePoint (no hardcoded defaults) ---

// --- HELPER COMPONENTS ---

const ImagePicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [tab, setTab] = useState<'LIB' | 'URL' | 'UPLOAD'>('LIB');
    const { images, uploadImage, currentLanguage } = useStore();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const uploaded = await uploadImage(file, 'Containers');
            if (uploaded) {
                onChange(uploaded.url);
            }
        }
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
                {['LIB', 'URL', 'UPLOAD'].map((t, i) => {
                    const label = t === 'LIB' ? getTranslation('TAB_EXISTING_IMAGES', currentLanguage) :
                        t === 'URL' ? getTranslation('TAB_IMAGE_URL', currentLanguage) :
                            getTranslation('TAB_UPLOAD_IMAGE', currentLanguage);
                    return (
                        <button key={t} onClick={() => setTab(t as any)} className={`pb-2 text-xs font-bold uppercase ${tab === t ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]' : 'text-gray-500'}`}>{label}</button>
                    );
                })}
            </div>

            {tab === 'LIB' && (
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                    {images.map((img) => (
                        <div key={img.id} className="relative group aspect-square">
                            <img
                                src={img.url}
                                onClick={() => onChange(img.url)}
                                className={`w-full h-full object-cover cursor-pointer border-2 transition-all ${value === img.url ? 'border-[var(--primary-color)]' : 'border-transparent hover:border-gray-300'}`}
                                title={img.name}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-white font-bold uppercase">{getTranslation('BTN_SELECT', currentLanguage)}</span>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-5 text-center py-8 text-gray-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs italic">{getTranslation('MSG_NO_LIB_IMAGES', currentLanguage)}</p>
                        </div>
                    )}
                </div>
            )}

            {tab === 'URL' && (
                <div className="flex gap-2">
                    <input className="flex-1 border p-2 text-sm rounded-sm" placeholder="https://..." value={value} onChange={e => onChange(e.target.value)} />
                </div>
            )}

            {tab === 'UPLOAD' && (
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1 uppercase font-bold">{getTranslation('MSG_CLICK_TO_UPLOAD', currentLanguage)}</span>
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
            )}
        </div>
    );
};

const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

// --- SUB-COMPONENT: CREATE SLIDER ITEM MODAL ---
export const CreateSliderItemModal = ({ onSave, onCancel }: { onSave: (title: string) => void, onCancel: () => void }) => {
    const { currentLanguage } = useStore();
    const [title, setTitle] = useState('');
    const [error, setError] = useState(false);

    const handleCreate = () => {
        if (!title.trim()) {
            setError(true);
            return;
        }
        onSave(title);
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[500px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <h3 className="text-lg font-bold text-[var(--primary-color)]">Create Slider Item</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm font-medium flex items-center gap-2">
                            {getTranslation('MSG_REQ_TITLE', currentLanguage)}
                        </div>
                    )}
                    <div>
                        <input
                            className={`w-full border p-3 text-sm outline-none rounded-sm transition-shadow ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[var(--primary-color)]'}`}
                            placeholder="Slider item title"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setError(false); }}
                            autoFocus
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                    <button onClick={onCancel} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">
                        {getTranslation('BTN_CANCEL', currentLanguage)}
                    </button>
                    <button onClick={handleCreate} className="px-6 py-2 bg-[var(--primary-color)] text-white hover:opacity-90 text-sm font-bold rounded-sm shadow-sm transition-colors">
                        {getTranslation('BTN_CREATE', currentLanguage)}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- SUB-COMPONENT: SLIDER ITEM EDITOR ---
export const SliderItemEditor = ({ item, onSave, onCancel, onDelete }: any) => {
    const { images, uploadImage, currentLanguage } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('BASIC');
    const [isTranslating, setIsTranslating] = useState(false);
    const [formData, setFormData] = useState<any>({
        id: item.id || 0,
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        status: item.status || 'Draft',
        sortOrder: item.sortOrder || 0,
        ctaText: item.ctaText || '',
        ctaUrl: item.ctaUrl || '',
        imageUrl: item.imageUrl || GLOBAL_DEFAULT_IMAGE,
        imageName: item.imageName || '',
        translations: item.translations || { en: { title: '', subtitle: '', description: '', ctaText: '' } },
    });

    // Image Tab State
    const [imgTab, setImgTab] = useState('COPY');
    const [searchImg, setSearchImg] = useState('');
    const pasteAreaRef = useRef<HTMLDivElement>(null);

    // Update Helpers
    const updateField = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));
    const updateTranslation = (lang: string, key: string, val: string) => setFormData((p: any) => ({ ...p, translations: { ...p.translations, [lang]: { ...p.translations?.[lang], [key]: val } } }));

    const suggestTranslation = async () => {
        setIsTranslating(true);
        try {
            const [translatedTitle, translatedSubtitle, translatedDesc, translatedCta] = await Promise.all([
                formData.title ? translateText(formData.title, currentLanguage) : '',
                formData.subtitle ? translateText(formData.subtitle, currentLanguage) : '',
                formData.description ? translateText(formData.description, currentLanguage) : '',
                formData.ctaText ? translateText(formData.ctaText, currentLanguage) : ''
            ]);

            setFormData((p: any) => ({
                ...p,
                translations: {
                    ...p.translations,
                    [currentLanguage]: {
                        ...p.translations?.[currentLanguage],
                        title: translatedTitle || p.translations?.[currentLanguage]?.title || '',
                        subtitle: translatedSubtitle || p.translations?.[currentLanguage]?.subtitle || '',
                        description: translatedDesc || p.translations?.[currentLanguage]?.description || '',
                        ctaText: translatedCta || p.translations?.[currentLanguage]?.ctaText || ''
                    }
                }
            }));
        } catch (error) {
            console.error("Translation Error", error);
        } finally {
            setIsTranslating(false);
        }
    };

    // --- IMAGE HANDLERS ---
    const handlePaste = async (e: React.ClipboardEvent) => {
        e.preventDefault();
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    setIsUploading(true);
                    const uploadedImage = await uploadImage(blob, 'Pictures');
                    setIsUploading(false);
                    if (uploadedImage) {
                        updateField('imageUrl', uploadedImage.url);
                        updateField('imageName', uploadedImage.name);
                    }
                }
            }
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            const uploadedImage = await uploadImage(file, 'Pictures');
            setIsUploading(false);
            if (uploadedImage) {
                updateField('imageUrl', uploadedImage.url);
                updateField('imageName', uploadedImage.name);
            }
        }
    };

    const handleSelectImage = (img: any) => {
        updateField('imageUrl', img.url);
        updateField('imageName', img.name);
    };

    const filteredGallery = images.filter((img) => img.name.toLowerCase().includes(searchImg.toLowerCase()));

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[1000px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">Edit Slider Item - {formData.title}</h3>
                    <div className="flex items-center gap-4">
                        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-sm"><MenuIcon /></button>
                        <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    {[
                        { id: 'BASIC', label: getTranslation('TAB_BASIC_INFO', currentLanguage) },
                        { id: 'IMAGE', label: getTranslation('TAB_IMAGE_INFO', currentLanguage) },
                        { id: 'TRANSLATION', label: getTranslation('TAB_TRANSLATION', currentLanguage) }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? 'border-b-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">

                    {/* BASIC INFORMATION */}
                    {activeTab === 'BASIC' && (
                        <div className="space-y-6 bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_TITLE', currentLanguage)}</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.title} onChange={e => updateField('title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_SUBTITLE', currentLanguage)}</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.subtitle} onChange={e => updateField('subtitle', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_CTA_BUTTON', currentLanguage)}</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.ctaText} onChange={e => updateField('ctaText', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LINK_URL', currentLanguage)}</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.ctaUrl} onChange={e => updateField('ctaUrl', e.target.value)} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_SORT_ORDER', currentLanguage)}</label>
                                    <div className="relative">
                                        <input type="number" className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.sortOrder} onChange={e => updateField('sortOrder', parseInt(e.target.value) || 0)} />
                                        <Hash className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_STATUS', currentLanguage)}</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm bg-white focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.status} onChange={e => updateField('status', e.target.value)}>
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_ORIGINAL_DESC', currentLanguage)}</label>
                                <JoditRichTextEditor
                                    value={formData.description}
                                    onChange={(newValue) => updateField('description', newValue)}
                                    placeholder={getTranslation('PLACEHOLDER_ITEM_DESC', currentLanguage) || "A brief description of the slide."}
                                    height={200}
                                />
                            </div>
                        </div>
                    )}

                    {/* IMAGE INFORMATION */}
                    {activeTab === 'IMAGE' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm space-y-6">
                            {/* Top: Current Image */}
                            <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 bg-gray-100 border border-gray-300 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                    <img
                                        src={formData.imageUrl || ''}
                                        alt="Current"
                                        className="w-full h-full object-cover"
                                        style={{ display: formData.imageUrl ? 'block' : 'none' }}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    {!formData.imageUrl && <ImageIcon className="w-8 h-8 text-gray-300" />}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_IMAGE_URL', currentLanguage)}</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 border border-gray-300 p-2 text-sm text-gray-600 rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                                value={formData.imageUrl || ''}
                                                onChange={e => updateField('imageUrl', e.target.value)}
                                                placeholder="https://..."
                                            />
                                            <button
                                                onClick={() => updateField('imageUrl', GLOBAL_DEFAULT_IMAGE)}
                                                className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-sm hover:bg-gray-200 transition-colors"
                                            >
                                                {getTranslation('BTN_DEFAULT_LOGO', currentLanguage)}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_IMAGE_NAME', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formData.imageName} onChange={e => updateField('imageName', e.target.value)} />
                                    </div>
                                    <button onClick={() => updateField('imageUrl', '')} className="text-xs text-[var(--primary-color)] hover:underline flex items-center gap-1">
                                        <X className="w-3 h-3" /> Clear Image
                                    </button>
                                </div>
                            </div>

                            {/* Bottom: Selection Tabs */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex gap-6 border-b border-gray-200 mb-4">
                                    {['COPY & PASTE', 'UPLOAD', 'CHOOSE FROM EXISTING'].map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => setImgTab(sub.split(' ')[0])}
                                            className={`pb-2 text-xs font-bold uppercase transition-colors ${imgTab === sub.split(' ')[0] ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-gray-500'}`}
                                        >
                                            {sub === 'COPY & PASTE' ? getTranslation('TAB_COPY_PASTE', currentLanguage) :
                                                sub === 'UPLOAD' ? getTranslation('TAB_UPLOAD_UPPER', currentLanguage) :
                                                    `${getTranslation('TAB_CHOOSE_EXISTING', currentLanguage)} (${images.length})`}
                                        </button>
                                    ))}
                                </div>

                                {imgTab === 'COPY' && (
                                    <div className="space-y-4">
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Image name</label><input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formData.imageName || ''} onChange={e => updateField('imageName', e.target.value)} /></div>
                                        <div
                                            ref={pasteAreaRef}
                                            onPaste={handlePaste}
                                            className="h-32 border-2 border-dashed border-[var(--primary-color)] bg-blue-50 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                                            onClick={() => pasteAreaRef.current?.focus()}
                                            tabIndex={0}
                                        >
                                            <Copy className="w-6 h-6 mb-2 text-[var(--primary-color)] opacity-50" />
                                            <span className="font-bold text-[var(--primary-color)]">Click here & Press Ctrl+V (Cmd+V) to Paste</span>
                                        </div>
                                    </div>
                                )}

                                {imgTab === 'UPLOAD' && (
                                    <div className="space-y-4">
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Image name</label><input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formData.imageName || ''} onChange={e => updateField('imageName', e.target.value)} /></div>
                                        <div className="flex justify-end">
                                            <label className={`bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold shadow-sm cursor-pointer hover:opacity-90 rounded-sm flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                                                <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Image'}
                                                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {imgTab === 'CHOOSE' && (
                                    <div className="flex flex-col h-full">
                                        <div className="relative mb-4 shrink-0">
                                            <input
                                                className="w-full border border-gray-300 p-2 pl-8 pr-8 text-sm rounded-sm focus:outline-none focus:border-[var(--primary-color)]"
                                                placeholder="Search images..."
                                                value={searchImg}
                                                onChange={e => setSearchImg(e.target.value)}
                                            />
                                            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                                            {searchImg && (
                                                <button
                                                    onClick={() => setSearchImg('')}
                                                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="Clear search"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-5 gap-3 max-h-[280px] overflow-y-auto border border-gray-200 p-3 rounded-sm bg-gray-50">
                                            {filteredGallery.map((img) => (
                                                <div key={img.id} className="relative group cursor-pointer" onClick={() => handleSelectImage(img)}>
                                                    <div className="aspect-square rounded-sm overflow-hidden border border-gray-200 shadow-sm bg-white group-hover:ring-2 group-hover:ring-[var(--primary-color)]">
                                                        <img
                                                            src={img.url}
                                                            alt={img.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        />
                                                        {!img.url && <div className="absolute inset-0 flex items-center justify-center bg-gray-100"><ImageIcon className="w-6 h-6 text-gray-300" /></div>}

                                                        {formData.imageUrl === img.url && (
                                                            <div className="absolute top-1 right-1 bg-[var(--primary-color)] text-white rounded-full p-0.5 shadow-md z-20">
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                        )}

                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1.5 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            {img.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {filteredGallery.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                                <span className="text-xs">{getTranslation('MSG_NO_LIB_IMAGES', currentLanguage)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TRANSLATION */}
                    {activeTab === 'TRANSLATION' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase">
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> {getTranslation('LABEL_ORIGINAL', currentLanguage)}</div>
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> {getTranslation('LABEL_TRANSLATION', currentLanguage)} ({currentLanguage.toUpperCase()})</div>
                                </div>
                                <button onClick={suggestTranslation} disabled={isTranslating} className={`text-[var(--primary-color)] text-xs font-bold flex items-center gap-2 hover:underline ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}>
                                    <Wand2 className={`w-3 h-3 ${isTranslating ? 'animate-pulse' : ''}`} /> {isTranslating ? getTranslation('MSG_TRANSLATING', currentLanguage) : getTranslation('BTN_SUGGEST_AI', currentLanguage)}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left: Original */}
                                <div className="space-y-4 opacity-70 pointer-events-none">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.title} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.subtitle} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                                        <div className="border border-gray-300 p-2 bg-gray-50 min-h-[150px]">
                                            <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.description }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">CTA</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.ctaText} readOnly />
                                    </div>
                                </div>

                                {/* Right: Translation */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANSLATED_TITLE', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated title..."
                                            value={formData.translations[currentLanguage]?.title || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_SUBTITLE', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated subtitle..."
                                            value={formData.translations[currentLanguage]?.subtitle || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'subtitle', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANSLATED_DESC', currentLanguage)}</label>
                                        <JoditRichTextEditor
                                            value={formData.translations[currentLanguage]?.description || ''}
                                            onChange={(newValue) => updateTranslation(currentLanguage, 'description', newValue)}
                                            placeholder="Enter translated description..."
                                            height={150}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_CTA_BUTTON', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated CTA text..."
                                            value={formData.translations[currentLanguage]?.ctaText || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'ctaText', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Fixed Footer with Metadata & Actions */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100 px-8 py-4">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <SharePointMetadataFooter
                                listTitle="ImageSlider"
                                itemId={formData.id}
                                createdDate={item.createdDate}
                                createdBy={item.createdBy}
                                modifiedDate={item.modifiedDate}
                                modifiedBy={item.modifiedBy}
                                onDelete={() => onDelete(formData.id)}
                                onVersionRestore={() => {
                                    useStore.getState().loadFromSharePoint();
                                }}
                            />
                        </div>
                        <div className="flex gap-3 flex-shrink-0 items-center">
                            <button onClick={onCancel} className="px-8 py-2 border border-gray-300 bg-white text-gray-800 text-sm font-bold hover:bg-gray-50 transition-colors rounded-sm uppercase tracking-wide">
                                {getTranslation('BTN_CANCEL', currentLanguage)}
                            </button>
                            <button onClick={() => onSave(formData)} className="px-8 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 transition-all rounded-sm uppercase tracking-wide">
                                {getTranslation('BTN_SAVE', currentLanguage)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- SUB-MODAL: EDIT SLIDE ---
// Strictly isolated component for editing a single slide
const EditSlideModal = ({
    slideId,
    allSlides,
    onSave,
    onClose,
    onDelete
}: {
    slideId: string,
    allSlides: any[],
    onSave: (id: string, data: any) => void,
    onClose: () => void,
    onDelete: (id: string) => void
}) => {
    const { currentLanguage } = useStore();
    const initialIndex = allSlides.findIndex(s => s.id === slideId);
    const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const slide = allSlides[currentIndex];

    const [formState, setFormState] = useState<any>({
        id: slide?.id,
        title: slide?.title || '',
        subtitle: slide?.subtitle || slide?.sub || '',
        desc: slide?.desc || '',
        image: slide?.image || slide?.img || '',
        url: slide?.url || '',
        layout: slide?.layout || 'text_overlay',
        cta: slide?.cta || '',
        adjustments: slide?.adjustments || { zoom: 1, rotate: 0, brightness: 100, contrast: 100 }
    });

    useEffect(() => {
        if (slide) {
            setFormState({
                id: slide.id,
                title: slide.title || '',
                subtitle: slide.subtitle || slide.sub || '',
                desc: slide.desc || '',
                image: slide.image || slide.img || '',
                url: slide.url || '',
                layout: slide.layout || 'text_overlay',
                cta: slide.cta || '',
                adjustments: slide.adjustments || { zoom: 1, rotate: 0, brightness: 100, contrast: 100 }
            });
        }
    }, [slide]);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);

    const updateForm = (key: string, val: any) => setFormState((prev: any) => ({ ...prev, [key]: val }));
    const updateAdjustment = (key: string, val: any) => setFormState((prev: any) => ({ ...prev, adjustments: { ...prev.adjustments, [key]: val } }));

    const handleSaveClick = () => {
        onSave(slide.id, formState);
        onClose(); // FIX: Close modal after save
    };

    const handleDeleteClick = () => {
        onDelete(slide.id);
        if (allSlides.length <= 1) onClose();
        else {
            setDeleteConfirm(false);
            setCurrentIndex(0);
        }
    };

    if (!slide) return null;

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[95vw] h-[95vh] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">{getTranslation('TITLE_EDIT_SLIDE', currentLanguage)} - {formState.title || getTranslation('LABEL_UNTITLED_SLIDE', currentLanguage)}</h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-sm p-1">
                            <button onClick={handlePrev} className="p-1 hover:bg-white rounded-sm transition-colors text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="text-xs font-bold text-gray-500 px-2 min-w-[120px] text-center">{getTranslation('LABEL_EDITING_SLIDE', currentLanguage)} {currentIndex + 1} {getTranslation('LABEL_OF', currentLanguage)} {allSlides.length}</span>
                            <button onClick={handleNext} className="p-1 hover:bg-white rounded-sm transition-colors text-gray-600"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* LEFT: FORM */}
                        <div className="space-y-8">
                            {/* Identity */}
                            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <EditTrigger labelKey="SECTION_SLIDE_IDENTITY" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">{getTranslation('SECTION_SLIDE_IDENTITY', currentLanguage)}</h4>
                                </div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{getTranslation('LABEL_SLIDE_NAME', currentLanguage)}</label>
                                <input className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formState.title} onChange={(e) => updateForm('title', e.target.value)} placeholder={getTranslation('PLACEHOLDER_SLIDE_NAME', currentLanguage)} />
                            </div>

                            {/* Layout */}
                            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">{getTranslation('SECTION_LAYOUT', currentLanguage)}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'text_overlay', label: getTranslation('LAYOUT_TEXT_OVERLAY', currentLanguage), icon: <div className="w-full h-8 bg-gray-200 relative"><div className="absolute inset-2 bg-gray-400 opacity-50"></div></div> },
                                        { id: 'solid_color', label: getTranslation('LAYOUT_SOLID_COLOR', currentLanguage), icon: <div className="w-full h-8 bg-gray-400 flex items-center justify-center"><div className="w-1/2 h-2 bg-white"></div></div> },
                                        { id: 'split_left_img', label: getTranslation('LAYOUT_SPLIT_LEFT', currentLanguage), icon: <div className="flex w-full h-8"><div className="w-1/2 bg-gray-300"></div><div className="w-1/2 bg-gray-100"></div></div> },
                                        { id: 'split_right_img', label: getTranslation('LAYOUT_SPLIT_RIGHT', currentLanguage), icon: <div className="flex w-full h-8"><div className="w-1/2 bg-gray-100"></div><div className="w-1/2 bg-gray-300"></div></div> },
                                    ].map(layout => (
                                        <div key={layout.id} onClick={() => updateForm('layout', layout.id)} className={`border rounded-sm p-3 cursor-pointer hover:border-[var(--primary-color)] transition-all flex flex-col items-center gap-2 ${formState.layout === layout.id ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] bg-blue-50' : 'border-gray-200'}`}>
                                            {layout.icon}
                                            <span className="text-[10px] font-bold text-gray-600">{layout.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{getTranslation('SECTION_CONTENT', currentLanguage)}</h4>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">{getTranslation('LABEL_HEADER_TITLE', currentLanguage)}</label><input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formState.title} onChange={e => updateForm('title', e.target.value)} /></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">{getTranslation('LABEL_SUBTITLE', currentLanguage)}</label><input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formState.subtitle} onChange={e => updateForm('subtitle', e.target.value)} /></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">{getTranslation('LABEL_CTA_BUTTON', currentLanguage)}</label><input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formState.cta} onChange={e => updateForm('cta', e.target.value)} /></div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">{getTranslation('LABEL_CONTENT_TEXT', currentLanguage)}</label>
                                    <JoditRichTextEditor
                                        value={formState.desc}
                                        onChange={(val: string) => updateForm('desc', val)}
                                        height={180}
                                        placeholder="Enter content..."
                                    />
                                </div>
                            </div>

                            {/* URL */}
                            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4" /> {getTranslation('LABEL_URL_OPTIONAL', currentLanguage)}</h4>
                                <input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={formState.url} onChange={e => updateForm('url', e.target.value)} placeholder="https://..." />
                            </div>
                        </div>

                        {/* RIGHT: PREVIEW & IMAGE */}
                        <div className="space-y-8">
                            {/* Live Preview */}
                            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm relative">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2"><Eye className="w-4 h-4" /> {getTranslation('SECTION_LIVE_PREVIEW', currentLanguage)}</h4>
                                <div className="w-full aspect-video bg-gray-100 border border-gray-300 overflow-hidden relative group rounded-sm">
                                    {formState.image && (
                                        <img
                                            src={formState.image}
                                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${formState.layout === 'split_left_img' || formState.layout === 'split_right_img' ? 'w-1/2' : 'w-full'}`}
                                            style={{
                                                left: formState.layout === 'split_right_img' ? '50%' : '0',
                                                filter: `brightness(${formState.adjustments.brightness}%) contrast(${formState.adjustments.contrast}%)`,
                                                transform: `scale(${formState.adjustments.zoom}) rotate(${formState.adjustments.rotate}deg)`
                                            }}
                                        />
                                    )}
                                    <div className={`absolute p-8 flex flex-col justify-center ${formState.layout === 'text_overlay' ? 'inset-0 bg-black/40 text-white items-center text-center' : ''} ${formState.layout === 'solid_color' ? 'inset-0 bg-gray-800 text-white items-center text-center' : ''} ${formState.layout === 'split_left_img' ? 'right-0 top-0 bottom-0 w-1/2 bg-white text-gray-800 items-start text-left pl-12' : ''} ${formState.layout === 'split_right_img' ? 'left-0 top-0 bottom-0 w-1/2 bg-white text-gray-800 items-start text-left pr-12' : ''}`}>
                                        <h2 className="text-3xl font-bold mb-2">{formState.title}</h2>
                                        <h3 className="text-xl font-medium opacity-80 mb-4">{formState.subtitle}</h3>
                                        <div className="text-sm opacity-70 leading-relaxed" dangerouslySetInnerHTML={{ __html: formState.desc }} />
                                        {formState.cta && <button className="mt-4 px-6 py-2 bg-[var(--primary-color)] text-white font-bold rounded-sm shadow-sm">{formState.cta}</button>}
                                    </div>
                                </div>
                            </div>

                            {/* Image Editor */}
                            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> {getTranslation('SECTION_IMAGE_EDITOR', currentLanguage)}</h4>
                                <ImagePicker value={formState.image} onChange={(v) => updateForm('image', v)} />
                                <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
                                    <h5 className="text-[10px] font-bold text-gray-400 uppercase">{getTranslation('SECTION_IMAGE_ADJUSTMENTS', currentLanguage)}</h5>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div><div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>{getTranslation('LABEL_ZOOM', currentLanguage)}</span><span>{formState.adjustments.zoom}x</span></div><input type="range" min="1" max="2" step="0.1" value={formState.adjustments.zoom} onChange={e => updateAdjustment('zoom', parseFloat(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]" /></div>
                                        <div><div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>{getTranslation('LABEL_ROTATE', currentLanguage)}</span><span>{formState.adjustments.rotate}°</span></div><input type="range" min="0" max="360" step="90" value={formState.adjustments.rotate} onChange={e => updateAdjustment('rotate', parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]" /></div>
                                        <div><div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>{getTranslation('LABEL_BRIGHTNESS', currentLanguage)}</span><span>{formState.adjustments.brightness}%</span></div><input type="range" min="50" max="150" value={formState.adjustments.brightness} onChange={e => updateAdjustment('brightness', parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]" /></div>
                                        <div><div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>{getTranslation('LABEL_CONTRAST', currentLanguage)}</span><span>{formState.adjustments.contrast}%</span></div><input type="range" min="50" max="150" value={formState.adjustments.contrast} onChange={e => updateAdjustment('contrast', parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
                    <button onClick={() => setDeleteConfirm(true)} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> {getTranslation('BTN_DELETE_SLIDE', currentLanguage)}</button>
                    <div className="flex items-center gap-4">
                        <button onClick={handleSaveClick} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold rounded-sm shadow-md hover:opacity-90">{getTranslation('BTN_SAVE_CHANGES', currentLanguage)}</button>
                    </div>
                </div>

                {deleteConfirm && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white p-6 rounded-sm shadow-2xl w-[400px] border border-gray-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{getTranslation('BTN_DELETE_SLIDE', currentLanguage)}</h4>
                                <p className="text-sm text-gray-600 mb-6">{getTranslation('MSG_CONFIRM_DELETE_SLIDE', currentLanguage)}</p>
                                <div className="flex w-full gap-3">
                                    <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2 border border-gray-300 rounded-sm text-sm font-bold hover:bg-gray-50">{getTranslation('BTN_CANCEL', currentLanguage)}</button>
                                    <button onClick={handleDeleteClick} className="flex-1 py-2 bg-red-600 text-white rounded-sm text-sm font-bold hover:bg-red-700 shadow-sm">{getTranslation('BTN_DELETE', currentLanguage)}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

// --- MAIN SLIDER MANAGER COMPONENT ---
export const SliderManager = ({ onClose }: { onClose: () => void }) => {
    const { editingContainerId, pages, updateContainer, deleteContainer, currentLanguage, sliderItems, addSliderItem, updateSliderItem, deleteSliderItem } = useStore();

    // Retrieve the container using editingContainerId
    const sliderData = useMemo(() => {
        for (const p of pages) {
            const c = p.containers.find(con => con.id === editingContainerId);
            if (c) return { container: c, pageId: p.id };
        }
        return null;
    }, [pages, editingContainerId]);

    const [activeTab, setActiveTab] = useState<'SLIDES' | 'SETTINGS' | 'MANAGE_CONTENT'>('SLIDES');
    const [sliderContainer, setSliderContainer] = useState<Container | null>(null);
    const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
    const [deleteSlideId, setDeleteSlideId] = useState<string | null>(null);
    const [showDeleteSliderConfirm, setShowDeleteSliderConfirm] = useState(false);
    // --- Manage Content state ---
    const [showCreateSliderItem, setShowCreateSliderItem] = useState(false);
    const [editingSliderItem, setEditingSliderItem] = useState<SliderItem | null>(null);
    const [deleteSliderItemId, setDeleteSliderItemId] = useState<string | null>(null);

    // Initialize State with Fallback Logic
    useEffect(() => {
        if (sliderData) {
            const containerCopy = JSON.parse(JSON.stringify(sliderData.container));

            // Ensure slides array exists (no hardcoded defaults)
            if (!containerCopy.settings.slides) {
                containerCopy.settings.slides = [];
            }

            setSliderContainer(containerCopy);
        }
    }, [sliderData]);

    if (!sliderContainer || !sliderData) return null;

    // Detect which template: Image/Text Slider vs Image Gallery Carousel
    const isImageTextSlider =
        sliderContainer.settings?.templateId !== 'img_gallery' &&
        sliderContainer.settings?.templateVariant !== 1;

    // Use slides from local state (which might now contain defaults)
    const slides = sliderContainer.settings.slides || [];

    // For Image/Text Slider: only show items tagged to this container
    const taggedIds: string[] = sliderContainer.settings.taggedItems || [];
    const taggedSliderItems = sliderItems.filter(item => taggedIds.includes(item.id));

    const saveChanges = () => {
        updateContainer(sliderData.pageId, sliderContainer);
        onClose();
    };

    const handleDeleteSlider = async () => {
        if (!sliderData) return;
        await deleteContainer(sliderData.pageId, sliderData.container.id);
        onClose();
    };

    const updateSliderSetting = (key: string, val: any) => {
        setSliderContainer(prev => {
            if (!prev) return null;
            return { ...prev, settings: { ...prev.settings, [key]: val } };
        });
    };

    const updateSliderContent = (key: string, val: string) => {
        setSliderContainer(prev => {
            if (!prev) return null;
            return { ...prev, content: { ...prev.content, [key]: { ...(prev.content[key] as any), [currentLanguage]: val } } };
        });
    };

    // --- Slider Item Actions (SharePoint-backed) ---
    const handleCreateSliderItem = async (title: string) => {
        const newItem: SliderItem = {
            id: `slider_${Date.now()}`,
            title: title,
            subtitle: '',
            description: '',
            status: 'Draft',
            sortOrder: sliderItems.length + 1,
            ctaText: '',
            ctaUrl: '',
            imageUrl: '',
            imageName: '',
            translations: { en: { title: '', subtitle: '', description: '', ctaText: '' } }
        };
        const addedItem = await addSliderItem(newItem);
        setShowCreateSliderItem(false);
        setEditingSliderItem(addedItem || newItem);
    };

    const handleSaveSliderItem = async (item: SliderItem) => {
        const isNew = !sliderItems.find((s) => s.id === item.id);
        if (isNew) {
            const addedItem = await addSliderItem(item);
            const newId = (addedItem?.id || item.id) as string;
            // Auto-tag the new item to this container so it shows in Slides tab
            setSliderContainer(prev => {
                if (!prev) return null;
                const existingTagged: string[] = prev.settings.taggedItems || [];
                if (existingTagged.includes(newId)) return prev;
                return { ...prev, settings: { ...prev.settings, taggedItems: [...existingTagged, newId] } };
            });
        } else {
            updateSliderItem(item);
        }
        setEditingSliderItem(null);
    };

    const handleDeleteSliderItem = (id: string) => {
        deleteSliderItem(id);
        // Remove from tagged items list in local state
        setSliderContainer(prev => {
            if (!prev) return null;
            const updatedTagged = (prev.settings.taggedItems || []).filter((tid: string) => tid !== id);
            return { ...prev, settings: { ...prev.settings, taggedItems: updatedTagged } };
        });
        setDeleteSliderItemId(null);
        setEditingSliderItem(null);
    };

    // --- Slide Actions ---
    const addSlide = () => {
        const newSlide = {
            id: `slide_${Date.now()}`,
            title: '', subtitle: '', desc: '', image: '', cta: '',
            layout: 'text_overlay', url: '', adjustments: { zoom: 1, rotate: 0, brightness: 100, contrast: 100 }
        };
        updateSliderSetting('slides', [...slides, newSlide]);
    };

    const updateSlideData = (id: string, data: any) => {
        const newSlides = slides.map((s: any) => s.id === id ? data : s);
        updateSliderSetting('slides', newSlides);
    };

    // Actual delete logic
    const performDeleteSlide = (id: string) => {
        updateSliderSetting('slides', slides.filter((s: any) => s.id !== id));
    };

    // Requests deletion from List View (opens confirmation)
    const requestDeleteSlide = (id: string) => {
        setDeleteSlideId(id);
    };

    const duplicateSlide = (id: string) => {
        const src = slides.find((s: any) => s.id === id);
        if (src) {
            const copy = { ...src, id: `slide_${Date.now()}_copy`, title: `${src.title} (Copy)` };
            updateSliderSetting('slides', [...slides, copy]);
        }
    };

    // --- Drag & Drop (Isolated) ---
    const handleDrop = (sourceId: string, targetId: string) => {
        if (sourceId === targetId) return;
        const dragIndex = slides.findIndex((s: any) => s.id === sourceId);
        const hoverIndex = slides.findIndex((s: any) => s.id === targetId);
        const newSlides = [...slides];
        const [moved] = newSlides.splice(dragIndex, 1);
        newSlides.splice(hoverIndex, 0, moved);
        updateSliderSetting('slides', newSlides);
    };

    return (
        <GenericModal
            title={getTranslation('SLIDER_MGMT', currentLanguage)}
            onClose={onClose}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
        >
            <div className="flex flex-col h-[75vh] bg-white">
                <div className="flex border-b border-gray-200 px-6 bg-white">
                    <TabButton active={activeTab === 'SLIDES'} label={getTranslation('TAB_SLIDES', currentLanguage)} onClick={() => setActiveTab('SLIDES')} />
                    <TabButton active={activeTab === 'SETTINGS'} label={getTranslation('TAB_SETTINGS', currentLanguage)} onClick={() => setActiveTab('SETTINGS')} />
                    {!isImageTextSlider && (
                        <TabButton active={activeTab === 'MANAGE_CONTENT'} label="Manage Content" onClick={() => setActiveTab('MANAGE_CONTENT')} />
                    )}
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {activeTab === 'SLIDES' && (
                        <div className="w-full space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    {getTranslation('LABEL_SLIDE_QUEUE', currentLanguage)}
                                    <EditTrigger
                                        labelKey="LABEL_SLIDE_QUEUE"
                                        title={getTranslation('HELP_SLIDE_QUEUE', currentLanguage)}
                                    />
                                </h4>
                                {isImageTextSlider ? (
                                    <button onClick={() => setEditingSliderItem({
                                        id: `slider_${Date.now()}`,
                                        title: '',
                                        subtitle: '',
                                        description: '',
                                        status: 'Draft',
                                        sortOrder: sliderItems.length + 1,
                                        ctaText: '',
                                        ctaUrl: '',
                                        imageUrl: '',
                                        imageName: '',
                                        translations: { en: { title: '', subtitle: '', description: '', ctaText: '' } }
                                    })} className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold rounded-sm hover:opacity-90 flex items-center gap-2 shadow-sm transition-transform active:scale-95"><Plus className="w-4 h-4" /> {getTranslation('BTN_ADD_SLIDE', currentLanguage)}</button>
                                ) : (
                                    <button onClick={addSlide} className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold rounded-sm hover:opacity-90 flex items-center gap-2 shadow-sm transition-transform active:scale-95"><Plus className="w-4 h-4" /> {getTranslation('BTN_ADD_SLIDE', currentLanguage)}</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {isImageTextSlider ? (
                                    /* Image/Text Slider: show only tagged items */
                                    <>
                                        {taggedSliderItems.length === 0 && <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-sm bg-gray-50 text-gray-400">{getTranslation('MSG_NO_SLIDES', currentLanguage)}</div>}
                                        {taggedSliderItems.map((item) => (
                                            <div key={item.id} className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 flex gap-4 items-center group hover:shadow-md transition-all cursor-default">
                                                <div className="cursor-move text-gray-300 hover:text-gray-600"><GripVertical className="w-5 h-5" /></div>
                                                <div className="w-16 h-12 bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden rounded-sm">
                                                    {item.imageUrl
                                                        ? <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
                                                        : <div className="w-full h-full" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm text-gray-800 truncate">{getItemTranslation(item, currentLanguage, 'title')}</div>
                                                    <div className="text-xs text-gray-500 truncate">{getItemTranslation(item, currentLanguage, 'subtitle') || getItemTranslation(item, currentLanguage, 'description') || '—'}</div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingSliderItem(item)} className="p-2 text-gray-400 hover:text-white rounded-sm transition-all hover:bg-[var(--edit-icon-bg,#2563eb)]" title={getTranslation('BTN_EDIT', currentLanguage)}><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => setDeleteSliderItemId(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all" title={getTranslation('BTN_DELETE', currentLanguage)}><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    /* Image Gallery Carousel: show local slides array */
                                    <>
                                        {slides.map((slide: any, idx: number) => (
                                            <div
                                                key={slide.id}
                                                draggable
                                                onDragStart={(e) => { e.dataTransfer.setData('slideId', slide.id); }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => { const srcId = e.dataTransfer.getData('slideId'); handleDrop(srcId, slide.id); }}
                                                className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 flex gap-4 items-center group hover:shadow-md transition-all cursor-default"
                                            >
                                                <div className="cursor-move text-gray-300 hover:text-gray-600"><GripVertical className="w-5 h-5" /></div>
                                                <div className="w-16 h-12 bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden rounded-sm relative">
                                                    {slide.image || slide.img ? <img src={slide.image || slide.img} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm text-gray-800 truncate">{slide.title || getTranslation('LABEL_UNTITLED_SLIDE', currentLanguage)}</div>
                                                    <div className="text-xs text-gray-500 truncate">{stripHtml(slide.desc) || getTranslation('LABEL_NO_DESCRIPTION', currentLanguage)}</div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingSlideId(slide.id)} className="p-2 text-gray-400 hover:text-white rounded-sm transition-all hover:bg-[var(--edit-icon-bg, #2563eb)]" title={getTranslation('BTN_EDIT', currentLanguage)}><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => duplicateSlide(slide.id)} className="p-2 text-gray-400 hover:text-white rounded-sm transition-all hover:bg-[var(--edit-icon-bg, #2563eb)]" title={getTranslation('BTN_COPY', currentLanguage)}><Copy className="w-4 h-4" /></button>
                                                    <button onClick={() => requestDeleteSlide(slide.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all" title={getTranslation('BTN_DELETE', currentLanguage)}><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                                <div className="text-gray-300 cursor-move"><ArrowUpDown className="w-4 h-4" /></div>
                                            </div>
                                        ))}
                                        {slides.length === 0 && <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-sm bg-gray-50 text-gray-400">{getTranslation('MSG_NO_SLIDES', currentLanguage)}</div>}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'SETTINGS' && (
                        <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">{getTranslation('SECTION_GENERAL_SETTINGS', currentLanguage)}</h4>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_SLIDER_TITLE', currentLanguage)}</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={getLocalizedText(sliderContainer.content.title, currentLanguage)} onChange={(e) => updateSliderContent('title', e.target.value)} placeholder={getTranslation('PLACEHOLDER_SLIDER_TITLE', currentLanguage)} />
                                </div>
                            </div>
                            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">{getTranslation('SECTION_AUTOPLAY', currentLanguage)}</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">{getTranslation('LABEL_ENABLE_AUTOPLAY', currentLanguage)}</label>
                                        <div onClick={() => updateSliderSetting('autoplay', !sliderContainer.settings.autoplay)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${sliderContainer.settings.autoplay ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm absolute top-1 transition-all ${sliderContainer.settings.autoplay ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </div>
                                    {sliderContainer.settings.autoplay && (
                                        <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex justify-between"><span>{getTranslation('LABEL_SLIDER_SPEED', currentLanguage)}</span><span className="text-[var(--primary-color)]">{sliderContainer.settings.speed || 5}s</span></label>
                                            <input type="range" min="2" max="10" step="1" value={sliderContainer.settings.speed || 5} onChange={(e) => updateSliderSetting('speed', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">{getTranslation('SECTION_TEXT_OVERLAY', currentLanguage)}</h4>
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-sm"><span className="text-sm font-medium text-gray-700">{getTranslation('LABEL_SHOW_TITLE', currentLanguage)}</span><div onClick={() => updateSliderSetting('showSlideTitle', !sliderContainer.settings.showSlideTitle)} className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${sliderContainer.settings.showSlideTitle !== false ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}><div className={`w-2.5 h-2.5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${sliderContainer.settings.showSlideTitle !== false ? 'left-5' : 'left-0.5'}`} /></div></div>
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-sm"><span className="text-sm font-medium text-gray-700">{getTranslation('LABEL_SHOW_DESC', currentLanguage)}</span><div onClick={() => updateSliderSetting('showSlideDescription', !sliderContainer.settings.showSlideDescription)} className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${sliderContainer.settings.showSlideDescription !== false ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}><div className={`w-2.5 h-2.5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${sliderContainer.settings.showSlideDescription !== false ? 'left-5' : 'left-0.5'}`} /></div></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_OVERLAY_POS', currentLanguage)}</label>
                                    <div className="flex gap-4">
                                        {[
                                            { id: 'bottom', label: getTranslation('POS_BOTTOM', currentLanguage) },
                                            { id: 'middle', label: getTranslation('POS_MIDDLE', currentLanguage) }
                                        ].map(pos => (
                                            <label key={pos.id} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-sm cursor-pointer transition-all ${sliderContainer.settings.overlayPosition === pos.id ? 'border-[var(--primary-color)] bg-blue-50 text-[var(--primary-color)] font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input type="radio" name="overlayPos" checked={sliderContainer.settings.overlayPosition === pos.id} onChange={() => updateSliderSetting('overlayPosition', pos.id)} className="hidden" />
                                                {sliderContainer.settings.overlayPosition === pos.id ? <Circle className="w-3 h-3 fill-current" /> : <Circle className="w-3 h-3 text-gray-400" />} {pos.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'MANAGE_CONTENT' && (
                        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">Image Slider List</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">Items stored in SharePoint <strong>ImageSlider</strong> list.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateSliderItem(true)}
                                    className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold rounded-sm hover:opacity-90 flex items-center gap-2 shadow-sm"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                {sliderItems.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-sm bg-gray-50">
                                        <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                                        <p className="text-gray-400 text-sm font-medium">No slider items yet</p>
                                        <p className="text-gray-300 text-xs mt-1">Click "Add Item" to create the first entry in the <strong>ImageSlider</strong> SharePoint list.</p>
                                    </div>
                                )}
                                {sliderItems.map((item) => (
                                    <div key={item.id} className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 flex gap-4 items-center group hover:shadow-md transition-all">
                                        <div className="w-16 h-12 bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden rounded-sm relative">
                                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} /> : <ImageIcon className="w-6 h-6 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm text-gray-800 truncate">{getItemTranslation(item, currentLanguage, 'title')}</div>
                                            <div className="text-xs text-gray-500 truncate">{getItemTranslation(item, currentLanguage, 'subtitle') || getItemTranslation(item, currentLanguage, 'description') || '—'}</div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>{item.status}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingSliderItem(item)}
                                                className="p-2 text-gray-400 hover:text-white rounded-sm transition-all hover:bg-[var(--edit-icon-bg,#2563eb)]"
                                                title="Edit"
                                            ><Pencil className="w-4 h-4" /></button>
                                            <button
                                                onClick={() => setDeleteSliderItemId(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                                title="Delete"
                                            ><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
                    <button
                        onClick={() => setShowDeleteSliderConfirm(true)}
                        className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" /> {getTranslation('BTN_DELETE_SLIDER', currentLanguage)}
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">{getTranslation('BTN_CANCEL', currentLanguage)}</button>
                        <button onClick={saveChanges} className="px-8 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 rounded-sm flex items-center gap-2"><Save className="w-4 h-4" /> {getTranslation('BTN_SAVE_CHANGES', currentLanguage)}</button>
                    </div>
                </div>
            </div>

            {showDeleteSliderConfirm && (
                <ConfirmDeleteDialog
                    title={getTranslation('BTN_DELETE_SLIDER', currentLanguage)}
                    message={getTranslation('MSG_CONFIRM_DELETE_SLIDER', currentLanguage)}
                    onConfirm={handleDeleteSlider}
                    onCancel={() => setShowDeleteSliderConfirm(false)}
                />
            )}

            {editingSlideId && (
                <EditSlideModal
                    slideId={editingSlideId}
                    allSlides={slides}
                    onSave={updateSlideData}
                    onClose={() => setEditingSlideId(null)}
                    onDelete={performDeleteSlide} // Pass the actual delete function to child
                />
            )}

            {deleteSlideId && (
                <ConfirmDeleteDialog
                    title={getTranslation('BTN_DELETE_SLIDE', currentLanguage)}
                    message={getTranslation('MSG_CONFIRM_DELETE_SLIDE_LIST', currentLanguage)}
                    onConfirm={() => { performDeleteSlide(deleteSlideId); setDeleteSlideId(null); }}
                    onCancel={() => setDeleteSlideId(null)}
                />
            )}

            {deleteSliderItemId && (
                <ConfirmDeleteDialog
                    title="Delete Slider Item"
                    message="Are you sure you want to permanently delete this slider item from the SharePoint list? This cannot be undone."
                    onConfirm={() => deleteSliderItemId && handleDeleteSliderItem(deleteSliderItemId)}
                    onCancel={() => setDeleteSliderItemId(null)}
                />
            )}

            {showCreateSliderItem && (
                <CreateSliderItemModal
                    onSave={handleCreateSliderItem}
                    onCancel={() => setShowCreateSliderItem(false)}
                />
            )}

            {editingSliderItem && (
                <SliderItemEditor
                    item={editingSliderItem}
                    onSave={handleSaveSliderItem}
                    onCancel={() => setEditingSliderItem(null)}
                    onDelete={(id: string) => setDeleteSliderItemId(id)}
                />
            )}
        </GenericModal>
    );
};
