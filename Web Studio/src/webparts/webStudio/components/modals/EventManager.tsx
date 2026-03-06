
import React, { useState, useRef } from 'react';
import { useStore, getItemTranslation, getTranslation, GLOBAL_DEFAULT_IMAGE, getLocalizedText } from '../../store';
import { EventItem } from '../../types';
import { GenericModal, ConfirmDeleteDialog } from './SharedModals';
import { JoditRichTextEditor } from '../JoditEditor';
import {
    Monitor, List as ListIcon, Pencil, Trash2, X,
    ImageIcon, Search, ChevronDown, ArrowDownAZ, ArrowUpAZ,
    Calendar, Wand2, Upload, Copy, Check
} from 'lucide-react';
import { SharePointMetadataFooter } from '../common/SharePointMetadataFooter';
import { createPortal } from 'react-dom';
import { translateText } from '../../services/geminiService';
import { EditTrigger } from './SharedModals';

const DUMMY_IMAGE = "";

// Removed MOCK_GALLERY in favor of store.images

// --- HELPERS ---
const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};


const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

// --- SUB-COMPONENT: CREATE EVENT MODAL ---
export const CreateEventModal = ({ onSave, onCancel }: { onSave: (title: string) => void, onCancel: () => void }) => {
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
                    <h3 className="text-lg font-bold text-[var(--primary-color)]">{getTranslation('MODAL_CREATE_EVENT', currentLanguage)}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm font-medium flex items-center gap-2">
                            Please enter a Title to continue.
                        </div>
                    )}
                    <div>
                        <input
                            className={`w-full border p-3 text-sm outline-none rounded-sm transition-shadow ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[var(--primary-color)]'}`}
                            placeholder={getTranslation('PH_ENTER_TITLE', currentLanguage)}
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

// --- SUB-COMPONENT: EDIT EVENT ---
export const EventEditor = ({ item, onSave, onCancel, onDelete }: any) => {
    const { images, uploadImage, currentLanguage, uiLabels } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('BASIC');
    const [formData, setFormData] = useState<any>({
        id: item.id || `evt_${Date.now()}`,
        title: item.title || '',
        status: item.status || 'Draft',
        startDate: (item.startDate || new Date().toISOString()).split('T')[0],
        endDate: (item.endDate || item.startDate || new Date().toISOString()).split('T')[0],
        category: item.category || '',
        location: item.location || '',
        description: item.description || '',
        imageUrl: item.imageUrl || GLOBAL_DEFAULT_IMAGE,
        imageName: item.imageName || 'EventImage',
        translations: item.translations || { en: { title: '', description: '', category: '', location: '', readMoreText: '' } },
        readMore: item.readMore || { enabled: false, url: '', text: '' },
        seo: item.seo || { title: '', description: '', keywords: '' },
    });

    // Image Tab State
    const [imgTab, setImgTab] = useState('COPY');
    const [searchImg, setSearchImg] = useState('');
    const pasteAreaRef = useRef<HTMLDivElement>(null);

    // Update Helpers
    const updateField = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));
    const updateSeo = (key: string, val: string) => setFormData((p: any) => ({ ...p, seo: { ...p.seo, [key]: val } }));
    const updateTranslation = (lang: string, key: string, val: string) => setFormData((p: any) => ({ ...p, translations: { ...p.translations, [lang]: { ...p.translations?.[lang], [key]: val } } }));

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
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const uploadedImage = await uploadImage(file, 'Pictures');
            setIsUploading(false);

            if (uploadedImage) {
                updateField('imageUrl', uploadedImage.url);
                updateField('imageName', uploadedImage.name);
            }
        }
    };

    const handleGallerySelect = (img: any) => {
        updateField('imageUrl', img.url);
        updateField('imageName', img.name);
    };

    // Filtered Gallery
    const filteredGallery = images.filter(img => img.name.toLowerCase().includes(searchImg.toLowerCase()));

    // Mock AI Actions
    const suggestSeo = () => {
        updateSeo('title', `Upcoming Event: ${formData.title}`);
        const dateRange = formData.startDate === formData.endDate ? formData.startDate : `${formData.startDate} to ${formData.endDate}`;
        updateSeo('description', `Join us for ${formData.title} on ${dateRange}. ${formData.description.substring(0, 50)}...`);
    };
    const [isTranslating, setIsTranslating] = useState(false);

    const suggestTranslation = async () => {
        setIsTranslating(true);
        try {
            const translatedTitle = await translateText(formData.title, currentLanguage);
            const translatedDesc = await translateText(formData.description, currentLanguage);
            const translatedCat = await translateText(formData.category, currentLanguage);
            const translatedLoc = await translateText(formData.location, currentLanguage);
            const translatedReadMore = formData.readMore.text ? await translateText(formData.readMore.text, currentLanguage) : '';

            setFormData((p: any) => ({
                ...p,
                translations: {
                    ...p.translations,
                    [currentLanguage]: {
                        ...p.translations?.[currentLanguage],
                        title: translatedTitle || p.translations?.[currentLanguage]?.title || '',
                        description: translatedDesc || p.translations?.[currentLanguage]?.description || '',
                        category: translatedCat || p.translations?.[currentLanguage]?.category || '',
                        location: translatedLoc || p.translations?.[currentLanguage]?.location || '',
                        readMoreText: translatedReadMore || p.translations?.[currentLanguage]?.readMoreText || ''
                    }
                }
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[1000px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">{getTranslation('MODAL_EDIT_EVENT', currentLanguage)} - {formData.title}</h3>
                    <div className="flex items-center gap-4">
                        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-sm"><MenuIcon /></button>
                        <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    {[
                        { id: 'BASIC', label: uiLabels.TAB_BASIC_INFO },
                        { id: 'IMAGE', label: uiLabels.TAB_IMAGE_INFO },
                        { id: 'SEO', label: uiLabels.TAB_SEO },
                        { id: 'TRANSLATION', label: uiLabels.TAB_TRANSLATION }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {getLocalizedText(tab.label, currentLanguage)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">

                    {/* BASIC INFORMATION */}
                    {activeTab === 'BASIC' && (
                        <div className="space-y-6 bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_TITLE', currentLanguage)}</label>
                                <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.title} onChange={e => updateField('title', e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_START_DATE', currentLanguage)}</label>
                                    <div className="relative">
                                        <input type="date" className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.startDate} onChange={e => updateField('startDate', e.target.value)} />
                                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_END_DATE', currentLanguage)}</label>
                                    <div className="relative">
                                        <input type="date" className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.endDate} onChange={e => updateField('endDate', e.target.value)} />
                                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_CATEGORY', currentLanguage)}</label>
                                    <input
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                        value={formData.category}
                                        onChange={e => updateField('category', e.target.value)}
                                        placeholder="e.g., Conference, Workshop, Webinar"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LOCATION', currentLanguage)}</label>
                                    <input
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                        value={formData.location}
                                        onChange={e => updateField('location', e.target.value)}
                                        placeholder="e.g., Berlin, Germany or Virtual"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.readMore.enabled} onChange={e => setFormData({ ...formData, readMore: { ...formData.readMore, enabled: e.target.checked } })} className="rounded-sm text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                <label className="text-sm text-gray-700">{getTranslation('LABEL_ADD_READ_MORE', currentLanguage)}</label>
                            </div>

                            {formData.readMore.enabled && (
                                <div className="grid grid-cols-2 gap-6 pl-6 border-l-2 border-gray-100">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LINK_URL', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="https://..."
                                            value={formData.readMore.url || ''}
                                            onChange={e => setFormData({ ...formData, readMore: { ...formData.readMore, url: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LINK_TEXT', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Read More"
                                            value={formData.readMore.text || ''}
                                            onChange={e => setFormData({ ...formData, readMore: { ...formData.readMore, text: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_ORIGINAL_DESC', currentLanguage)}</label>
                                <JoditRichTextEditor
                                    value={formData.description}
                                    onChange={(newValue) => updateField('description', newValue)}
                                    placeholder="A brief description of the event."
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
                                        <X className="w-3 h-3" /> {getTranslation('BTN_CLEAR_IMAGE', currentLanguage)}
                                    </button>
                                </div>
                            </div>

                            {/* Bottom: Selection Tabs */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex gap-6 border-b border-gray-200 mb-4">
                                    {[
                                        { id: 'COPY', label: uiLabels.TAB_IMG_COPY },
                                        { id: 'UPLOAD', label: uiLabels.TAB_IMG_UPLOAD },
                                        { id: 'CHOOSE', label: uiLabels.TAB_IMG_CHOOSE }
                                    ].map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setImgTab(sub.id)}
                                            className={`pb-2 text-xs font-bold uppercase transition-colors ${imgTab === sub.id ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-gray-500'}`}
                                        >
                                            {sub.id === 'CHOOSE' ? `${getLocalizedText(sub.label, currentLanguage)} (${images.length})` : getLocalizedText(sub.label, currentLanguage)}
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
                                                <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : getTranslation('BTN_UPLOAD_IMAGE', currentLanguage)}
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
                                                placeholder={getTranslation('PH_SEARCH_IMAGES', currentLanguage)}
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

                                        {/* Fixed Grid Layout Container */}
                                        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[400px] border border-gray-100 bg-gray-50/50 p-2 rounded-sm content-start">
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-min">
                                                {filteredGallery.map(img => (
                                                    <div
                                                        key={img.id}
                                                        onClick={() => handleGallerySelect(img)}
                                                        className={`
                                                            relative aspect-square cursor-pointer overflow-hidden rounded-sm border-2 transition-all group bg-white shadow-sm
                                                            ${formData.imageUrl === img.url
                                                                ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)] ring-opacity-20 z-10'
                                                                : 'border-transparent hover:border-blue-300 hover:shadow-md'}
                                                        `}
                                                    >
                                                        {/* Image */}
                                                        <img
                                                            src={img.url}
                                                            alt={img.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        />
                                                        {!img.url && <div className="absolute inset-0 flex items-center justify-center bg-gray-100"><ImageIcon className="w-6 h-6 text-gray-300" /></div>}

                                                        {/* Selected Indicator */}
                                                        {formData.imageUrl === img.url && (
                                                            <div className="absolute top-1 right-1 bg-[var(--primary-color)] text-white rounded-full p-0.5 shadow-md z-20">
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                        )}

                                                        {/* Label Overlay */}
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1.5 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                            {img.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {filteredGallery.length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                                    <span className="text-xs">{getTranslation('MSG_NO_IMAGES', currentLanguage)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SEO */}
                    {activeTab === 'SEO' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm space-y-6">
                            <div className="flex justify-end">
                                <button onClick={suggestSeo} className="bg-[var(--primary-color)] text-white px-4 py-2 text-xs font-bold flex items-center gap-2 hover:opacity-90 shadow-sm">
                                    <Wand2 className="w-3 h-3" /> {getTranslation('BTN_SUGGEST_AI', currentLanguage)}
                                </button>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_SEO_TITLE', currentLanguage)}</label>
                                <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm" value={formData.seo.title} onChange={e => updateSeo('title', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_META_DESC', currentLanguage)}</label>
                                <JoditRichTextEditor
                                    value={formData.seo.description}
                                    onChange={(val: string) => updateSeo('description', val)}
                                    height={160}
                                    placeholder="Meta description..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_KEYWORDS', currentLanguage)}</label>
                                <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm" value={formData.seo.keywords} onChange={e => updateSeo('keywords', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* TRANSLATION */}
                    {activeTab === 'TRANSLATION' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase">
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> {getTranslation('LABEL_ORIGINAL', currentLanguage)} (English)</div>
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> {getTranslation('LABEL_TRANSLATION_STATE', currentLanguage)} ({currentLanguage.toUpperCase()})</div>
                                </div>
                                <button onClick={suggestTranslation} disabled={isTranslating} className={`text-[var(--primary-color)] text-xs font-bold flex items-center gap-2 hover:underline ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}>
                                    <Wand2 className={`w-3 h-3 ${isTranslating ? 'animate-pulse' : ''}`} /> {isTranslating ? 'Translating...' : getTranslation('BTN_SUGGEST_AI', currentLanguage)}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left: Original */}
                                <div className="space-y-4 opacity-70 pointer-events-none">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TITLE', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.title} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_CATEGORY', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.category || ''} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_LOCATION', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.location || ''} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_READ_MORE', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.readMore.text || ''} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_DESC', currentLanguage)}</label>
                                        <div className="border border-gray-300 p-2 bg-gray-50 min-h-[150px]">
                                            <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.description }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Translation */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANS_TITLE', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated title..."
                                            value={formData.translations[currentLanguage]?.title || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANS_CAT', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated category..."
                                            value={formData.translations[currentLanguage]?.category || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'category', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANS_LOC', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated location..."
                                            value={formData.translations[currentLanguage]?.location || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'location', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANS_READ_MORE', currentLanguage)}</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated read more text..."
                                            value={formData.translations[currentLanguage]?.readMoreText || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'readMoreText', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{getTranslation('LABEL_TRANS_DESC', currentLanguage)}</label>
                                        <JoditRichTextEditor
                                            value={formData.translations[currentLanguage]?.description || ''}
                                            onChange={(newValue) => updateTranslation(currentLanguage, 'description', newValue)}
                                            placeholder="Enter translated description..."
                                            height={150}
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
                                listTitle="Events"
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
        </div>
    );
};

// --- MAIN EVENT MANAGER ---
export const EventManager = ({ onClose }: any) => {
    const { events, addEvent, updateEvent, deleteEvent, currentLanguage } = useStore();
    const [view, setView] = useState<'VISUAL' | 'LIST'>('VISUAL');
    const [showCreate, setShowCreate] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'startDate', direction: 'desc' });

    // Handle Create Init
    const handleCreateInit = async (title: string) => {
        const newItem: EventItem = {
            id: `evt_${Date.now()}`,
            title: title,
            status: 'Draft',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            description: '',
            imageUrl: '',
            readMore: { enabled: false, url: '' },
            translations: { en: { title: '', description: '' } },
            seo: { title: '', description: '', keywords: '' }
        };
        const addedItem = await addEvent(newItem);
        setShowCreate(false);
        setEditingItem(addedItem || newItem); // Use returned item with real ID
    };

    const handleSaveEdit = (item: any) => {
        updateEvent(item);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        deleteEvent(id);
        setDeleteId(null);
        setEditingItem(null);
    };

    // Use events from store
    const allEvents = [...events];

    // Sort & Filter
    const sortedEvents = [...allEvents].sort((a, b) => {
        const valA = (a as any)[sortConfig.key];
        const valB = (b as any)[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    const filteredEvents = sortedEvents.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const toggleSort = () => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }));

    const customFooter = (
        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm flex items-center gap-1">
            {getTranslation('BTN_CLOSE', currentLanguage)} <EditTrigger labelKey="BTN_CLOSE" />
        </button>
    );

    return (
        <GenericModal
            className="event-management-popup"
            title={getTranslation('TITLE_EVENT_MGMT', currentLanguage)}
            onClose={onClose}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
            customFooter={customFooter}
            headerIcons={
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 mr-2 hidden md:inline">{getTranslation('DESC_EVENT_MGMT', currentLanguage)} <EditTrigger labelKey="DESC_EVENT_MGMT" /></span>
                    <div className="flex border border-[var(--primary-color)] rounded-sm overflow-hidden shadow-sm h-8">
                        <button onClick={() => setView('VISUAL')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'VISUAL' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><Monitor className="w-3 h-3" /> {getTranslation('BTN_VISUAL_VIEW', currentLanguage)}</button>
                        <button onClick={() => setView('LIST')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'LIST' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><ListIcon className="w-3 h-3" /> {getTranslation('BTN_LIST_VIEW', currentLanguage)}</button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col h-[600px] bg-white">
                {/* Toolbar */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0 gap-4">
                    <div className="flex-1 max-w-lg relative">
                        <input
                            placeholder={getTranslation('LABEL_SEARCH_EVENTS', currentLanguage)}
                            className="border border-gray-300 p-2.5 pl-9 pr-9 text-sm w-full focus:ring-1 focus:ring-[var(--primary-color)]  outline-none rounded-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Clear search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mr-2">
                            <span>{getTranslation('LABEL_SORT_BY', currentLanguage)}</span>
                            <EditTrigger labelKey="LABEL_SORT_BY" />
                            <div className="relative">
                                <select
                                    className="border border-gray-300 p-2 pr-8 text-sm rounded-sm bg-white focus:ring-1 focus:ring-[var(--primary-color)] outline-none appearance-none cursor-pointer w-40"
                                    value={sortConfig.key}
                                    onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value }))}
                                >
                                    <option value="startDate">Start Date</option>
                                    <option value="title">Title</option>
                                    <option value="status">Status</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                            </div>
                            <button onClick={toggleSort} className="p-2 border border-gray-300 rounded-sm hover:bg-gray-50 text-[var(--primary-color)]">
                                {sortConfig.direction === 'asc' ? <ArrowUpAZ className="w-4 h-4" /> : <ArrowDownAZ className="w-4 h-4" />}
                            </button>
                        </div>

                        <button onClick={() => setShowCreate(true)} className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold hover:opacity-90 shadow-sm rounded-sm">
                            {getTranslation('BTN_ADD_EVENT', currentLanguage)}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {view === 'VISUAL' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map((n: any) => (
                                <div key={n.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all group relative flex flex-col rounded-sm overflow-hidden min-h-[140px]">
                                    <div className="flex h-full">
                                        <div className="w-32 bg-gray-100 flex items-center justify-center relative overflow-hidden border-r border-gray-100">
                                            <img
                                                src={n.imageUrl || DUMMY_IMAGE}
                                                alt={n.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center'); }}
                                            />
                                            {(!n.imageUrl) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{getItemTranslation(n, currentLanguage, 'title')}</h4>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${n.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-400 text-yellow-900'}`}>
                                                        {n.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(n.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                    {n.endDate && n.endDate !== n.startDate && ` - ${new Date(n.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                                                    {', ' + new Date(n.startDate).getFullYear()}
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{stripHtml(getItemTranslation(n, currentLanguage, 'description') || 'No description provided.')}</p>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingItem(n)} className="p-1 hover:bg-blue-50 rounded-sm" title="Edit" style={{ color: 'var(--icon-color)' }}><Pencil className="w-3 h-3" /></button>
                                                <button onClick={() => setDeleteId(n.id)} className="p-1 hover:bg-red-50 hover:text-red-600 rounded-sm" title="Delete" style={{ color: 'var(--icon-color)' }}><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 w-20 text-center">{getTranslation('TH_IMAGE', currentLanguage)}</th>
                                        <th className="p-4">{getTranslation('TH_TITLE_DATE', currentLanguage)}</th>
                                        <th className="p-4 w-32">{getTranslation('TH_STATUS', currentLanguage)}</th>
                                        <th className="p-4 text-right w-32">{getTranslation('TH_ACTIONS', currentLanguage)}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEvents.map((n: any) => (
                                        <tr key={n.id} className="hover:bg-[var(--brand-light)] transition-colors group">
                                            <td className="p-3 text-center">
                                                <div className="w-10 h-10 bg-gray-100 rounded-sm mx-auto flex items-center justify-center overflow-hidden border border-gray-200">
                                                    <img
                                                        src={n.imageUrl || DUMMY_IMAGE}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                    {(!n.imageUrl) && <ImageIcon className="w-5 h-5 text-gray-300" />}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-bold text-gray-800 text-sm mb-1">{getItemTranslation(n, currentLanguage, 'title')}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(n.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}
                                                    {n.endDate && n.endDate !== n.startDate && ` - ${new Date(n.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}`}
                                                    {', ' + new Date(n.startDate).getFullYear()}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full inline-block ${n.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-400 text-yellow-900'}`}>
                                                    {n.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingItem(n)} className="p-1.5 hover:bg-blue-50 rounded-sm" style={{ color: 'var(--icon-color)' }}><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => setDeleteId(n.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-sm" style={{ color: 'var(--icon-color)' }}><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreate && <CreateEventModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {editingItem && <EventEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {deleteId && <ConfirmDeleteDialog title="Delete Event" message="Are you sure you want to delete this event? This action cannot be undone." onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
        </GenericModal>
    );
};
