
import React, { useState, useRef } from 'react';
import { useStore, getItemTranslation, getLocalizedText, getTranslation, GLOBAL_DEFAULT_IMAGE } from '../../store';
import { DocumentItem } from '../../types';
import { GenericModal, ConfirmDeleteDialog } from './SharedModals';
import { JoditRichTextEditor } from '../JoditEditor';
import {
    Monitor, List as ListIcon, Filter, Upload, FileText, Pencil, Trash2, X,
    Search, ChevronDown, ArrowDownAZ, ArrowUpAZ,
    FileSpreadsheet, File, Presentation, Link as LinkIcon, FileQuestion,
    HelpCircle, Calendar, Check, Copy, Wand2,
    Info,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { SharePointMetadataFooter } from '../common/SharePointMetadataFooter';

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

// --- CONSTANTS ---
const DOC_TYPES = ['Word', 'PDF', 'Presentations', 'Excel', 'Link', 'Others'];
const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];
const STATUSES = ['Draft', 'Published'];
const DUMMY_IMAGE = "";

// MOCK_GALLERY REMOVED

const getDocIcon = (type: string) => {
    switch (type) {
        case 'Word': return <FileText className="w-8 h-8 text-blue-600" />;
        case 'Excel': return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
        case 'PDF': return <File className="w-8 h-8 text-red-500" />;
        case 'PPT':
        case 'Presentations': return <Presentation className="w-8 h-8 text-orange-500" />;
        case 'Link': return <LinkIcon className="w-8 h-8 text-sky-500" />;
        default: return <FileQuestion className="w-8 h-8 text-gray-400" />;
    }
};

// --- SUB-COMPONENTS ---

// 1. ADD DOCUMENT MODAL
export const AddDocumentModal = ({ onSave, onCancel }: { onSave: (doc: any) => void, onCancel: () => void }) => {
    const { currentLanguage, uiLabels } = useStore();
    const [activeTab, setActiveTab] = useState<'UPLOAD' | 'DRAG' | 'LINK'>('UPLOAD');
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState({
        itemRank: 5,
        fileName: '',
        docName: '',
        url: '',
        file: null as File | null
    });

    const getFileType = (name: string) => {
        if (!name) return 'Others';
        const ext = name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'PDF';
        if (['doc', 'docx'].includes(ext || '')) return 'Word';
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'Excel';
        if (['ppt', 'pptx'].includes(ext || '')) return 'Presentations';
        return 'Others';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, fileName: file.name, file: file });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFormData({ ...formData, fileName: file.name, file: file });
            setActiveTab('UPLOAD');
        }
    };

    const handleSave = () => {
        // Basic validation logic
        if (activeTab === 'UPLOAD' && !formData.fileName) return;
        if (activeTab === 'LINK' && !formData.url) return;

        onSave({
            title: formData.docName || formData.fileName || 'Untitled Document',
            type: activeTab === 'LINK' ? 'Link' : getFileType(formData.fileName),
            itemRank: formData.itemRank,
            url: formData.url,
            status: 'Draft',
            year: new Date().getFullYear().toString(),
            date: new Date().toISOString().split('T')[0],
            file: formData.file || undefined
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[600px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <h3 className="text-lg font-bold text-[var(--primary-color)]">{getLocalizedText(uiLabels.TITLE_ADD_DOC, currentLanguage)}</h3>
                    <div className="flex items-center gap-3">
                        <MenuIcon />
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-gray-200 gap-6">
                    {[
                        { value: 'UPLOAD', label: 'UPLOAD' },
                        { value: 'DRAG', label: 'DRAG & DROP' },
                        { value: 'LINK', label: 'LINK' }
                    ].map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value as any)}
                            className={`py-3 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === tab.value ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {getLocalizedText(uiLabels[`TAB_${tab.value === 'DRAG' ? 'DRAG_DROP' : tab.label === 'UPLOAD' ? 'UPLOAD_UPPER' : tab.label}` as keyof typeof uiLabels], currentLanguage)}
                        </button>
                    ))}
                </div>

                <div className="p-8 space-y-6 min-h-[300px]">
                    {activeTab === 'UPLOAD' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_ITEM_RANK', currentLanguage)} <Info className="inline w-3 h-3 text-blue-400" /></label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm appearance-none outline-none focus:border-[var(--primary-color)] bg-white"
                                        value={formData.itemRank}
                                        onChange={e => setFormData({ ...formData, itemRank: Number(e.target.value) })}
                                    >
                                        <option value="3">(5) Relevant Item</option>
                                        <option value="1">(1) Critical Item</option>
                                        <option value="5">(3) Standard Item</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex gap-0">
                                <label className="px-4 py-2 border border-gray-300 bg-gray-50 text-gray-700 text-sm font-bold hover:bg-gray-100 cursor-pointer rounded-l-sm border-r-0">
                                    {getTranslation('BTN_CHOOSE_FILE', currentLanguage)}
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                                <div className="flex-1 border border-gray-300 p-2 text-sm text-gray-500 italic flex items-center rounded-r-sm gap-2">
                                    {formData.fileName ? (
                                        <>
                                            <div className="scale-75 origin-left">
                                                {getDocIcon(getFileType(formData.fileName))}
                                            </div>
                                            {formData.fileName}
                                        </>
                                    ) : (
                                        getTranslation('MSG_NO_FILE_CHOSEN', currentLanguage)
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_DOC_NAME', currentLanguage)}</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:border-[var(--primary-color)] outline-none"
                                    placeholder={getTranslation('PLACEHOLDER_RENAME_DOC', currentLanguage)}
                                    value={formData.docName}
                                    onChange={e => setFormData({ ...formData, docName: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'DRAG' && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-sm h-48 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-[var(--primary-color)] bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <Upload className={`w-10 h-10 mb-2 ${isDragging ? 'text-[var(--primary-color)]' : 'text-gray-400'}`} />
                            <p className={`text-sm font-bold ${isDragging ? 'text-[var(--primary-color)]' : 'text-gray-600'}`}>
                                {isDragging ? getTranslation('MSG_DROP_FILE', currentLanguage) : getTranslation('MSG_DRAG_DROP', currentLanguage)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{getTranslation('MSG_SUPPORTED_FILES', currentLanguage)}</p>
                        </div>
                    )}

                    {activeTab === 'LINK' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_EXTERNAL_URL', currentLanguage)}</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:border-[var(--primary-color)] outline-none"
                                    placeholder="https://"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LINK_NAME', currentLanguage)}</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:border-[var(--primary-color)] outline-none"
                                    placeholder={getTranslation('PLACEHOLDER_DISPLAY_NAME', currentLanguage)}
                                    value={formData.docName}
                                    onChange={e => setFormData({ ...formData, docName: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                    <button onClick={onCancel} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">{getTranslation('BTN_CANCEL', currentLanguage)}</button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-gray-200 text-gray-500 font-bold text-sm rounded-sm hover:bg-[var(--primary-color)] hover:text-white transition-colors uppercase disabled:opacity-50"
                        disabled={activeTab === 'UPLOAD' && !formData.fileName}
                    >
                        {getTranslation('BTN_UPLOAD', currentLanguage)}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// 2. EDIT DOCUMENT MODAL (Using NewsEditor Structure)
export const DocumentEditor = ({ item, onSave, onCancel, onDelete }: any) => {
    const { uploadImage, currentLanguage, uiLabels, images } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('BASIC');
    const [formData, setFormData] = useState<any>({
        ...item,
        name: item.name || item.title, // Initialize name from existing name or title
        imageUrl: item.imageUrl || '',
        imageName: item.imageName || '',
        translations: item.translations || { en: { title: '', description: '', readMoreText: '' } },
    });

    // Image Tab State
    const [imgTab, setImgTab] = useState('COPY');
    const [searchImg, setSearchImg] = useState('');
    const pasteAreaRef = useRef<HTMLDivElement>(null);

    const updateField = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));
    const updateTranslation = (lang: string, key: string, val: string) => setFormData((p: any) => ({ ...p, translations: { ...p.translations, [lang]: { ...p.translations?.[lang], [key]: val } } }));

    // Image Handlers
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

    const suggestTranslation = () => {
        setFormData((p: any) => ({
            ...p,
            translations: {
                ...p.translations,
                en: { title: `Translated: ${formData.title}`, description: `Translated: ${formData.description}` }
            }
        }));
    };

    const filteredGallery = images.filter(img => img.name.toLowerCase().includes(searchImg.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[1000px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">{getLocalizedText(uiLabels.TITLE_EDIT_DOC, currentLanguage)} - {formData.title}</h3>
                    <div className="flex items-center gap-4">
                        <MenuIcon />
                        <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    {['BASIC INFORMATION', 'IMAGE INFORMATION', 'TRANSLATION'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.split(' ')[0])}
                            className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.split(' ')[0] ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab === 'BASIC INFORMATION' ? getLocalizedText(uiLabels.TAB_BASIC_INFO, currentLanguage) :
                                tab === 'IMAGE INFORMATION' ? getLocalizedText(uiLabels.TAB_IMAGE_INFO, currentLanguage) :
                                    getLocalizedText(uiLabels.TAB_TRANSLATION, currentLanguage)}
                        </button>
                    ))}
                </div>

                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
                    {activeTab === 'BASIC' && (
                        <div className="space-y-6 bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_FILE_NAME', currentLanguage)}</label>
                                    <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden bg-white">
                                        <input
                                            className="w-full p-2.5 text-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                                            value={formData.name}
                                            onChange={e => updateField('name', e.target.value)}
                                            title="Edit to rename the file in SharePoint"
                                        />
                                        <span className="px-3 text-xs text-gray-400 bg-gray-50 border-l border-gray-200 h-full flex items-center">.docx</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{getTranslation('MSG_RENAME_WARNING', currentLanguage)}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_YEAR', currentLanguage)}</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm bg-white" value={formData.year} onChange={e => updateField('year', e.target.value)}>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_STATUS', currentLanguage)}</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm bg-white" value={formData.status} onChange={e => updateField('status', e.target.value)}>
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_ITEM_RANK', currentLanguage)}</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm bg-white" value={formData.itemRank} onChange={e => updateField('itemRank', Number(e.target.value))}>
                                        <option value="5">{getTranslation('LABEL_RANK_STANDARD', currentLanguage)}</option>
                                        <option value="1">{getTranslation('LABEL_RANK_CRITICAL', currentLanguage)}</option>
                                        <option value="3">{getTranslation('LABEL_RANK_RELEVANT', currentLanguage)}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_TITLE', currentLanguage)}</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.title} onChange={e => updateField('title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_SORT_ORDER', currentLanguage)}</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                        placeholder="0"
                                        value={formData.sortOrder || 0}
                                        onChange={e => updateField('sortOrder', Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.readMore?.enabled || false} onChange={e => setFormData({ ...formData, readMore: { ...formData.readMore, enabled: e.target.checked } })} className="rounded-sm text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                <label className="text-sm text-gray-700">{getTranslation('LABEL_ADD_READ_MORE', currentLanguage)}</label>
                            </div>

                            {formData.readMore?.enabled && (
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
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_DESC', currentLanguage)}</label>
                                <JoditRichTextEditor
                                    value={formData.description}
                                    onChange={(newValue) => updateField('description', newValue)}
                                    placeholder={getTranslation('PLACEHOLDER_DESC', currentLanguage)}
                                    height={200}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'IMAGE' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm space-y-6">
                            {/* Top: Current Image */}
                            <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 bg-gray-100 border border-gray-300 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                    <img
                                        src={formData.imageUrl || DUMMY_IMAGE}
                                        alt="Current"
                                        className="w-full h-full object-cover"
                                        style={{ display: formData.imageUrl ? 'block' : 'none' }}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    {!formData.imageUrl && <FileText className="w-8 h-8 text-gray-300" />}
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
                                            {sub === 'COPY & PASTE' ? getLocalizedText(uiLabels.TAB_COPY_PASTE, currentLanguage) :
                                                sub === 'UPLOAD' ? getLocalizedText(uiLabels.TAB_UPLOAD_UPPER, currentLanguage) :
                                                    `${getLocalizedText(uiLabels.TAB_CHOOSE_EXISTING, currentLanguage)} (${images.length})`}
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
                                        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[400px] border border-gray-100 bg-gray-50/50 p-2 rounded-sm content-start">
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-min">
                                                {filteredGallery.map(img => (
                                                    <div
                                                        key={img.id}
                                                        onClick={() => handleGallerySelect(img)}
                                                        className={`
                                                            relative aspect-square cursor-pointer overflow-hidden rounded-sm border-2 transition-all group bg-white shadow-sm
                                                            ${formData.imageUrl === img.url ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)] ring-opacity-20 z-10' : 'border-transparent hover:border-blue-300 hover:shadow-md'}
                                                        `}
                                                    >
                                                        <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                        {!img.url && <div className="absolute inset-0 flex items-center justify-center bg-gray-100"><FileText className="w-6 h-6 text-gray-300" /></div>}
                                                        {formData.imageUrl === img.url && <div className="absolute top-1 right-1 bg-[var(--primary-color)] text-white rounded-full p-0.5 shadow-md z-20"><Check className="w-3 h-3" /></div>}
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1.5 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">{img.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Original (English)</div>
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Translation ({currentLanguage.toUpperCase()})</div>
                                </div>
                                <button onClick={suggestTranslation} className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-purple-200 transition-colors">
                                    <Wand2 className="w-3 h-3" /> Suggestion with AI
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left: Original */}
                                <div className="space-y-4 opacity-70 pointer-events-none">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">TITLE</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.title} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">READ MORE TEXT</label>
                                        <input className="w-full border border-gray-300 p-2 text-sm bg-gray-50" value={formData.readMore?.text || ''} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIPTION</label>
                                        <div className="border border-gray-300 p-2 bg-gray-50 min-h-[150px]">
                                            <div className="text-sm" dangerouslySetInnerHTML={{ __html: formData.description }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Translation */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">TRANSLATED TITLE</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated title..."
                                            value={formData.translations[currentLanguage]?.title || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">TRANSLATED READ MORE TEXT</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            placeholder="Enter translated read more text..."
                                            value={formData.translations[currentLanguage]?.readMoreText || ''}
                                            onChange={e => updateTranslation(currentLanguage, 'readMoreText', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">TRANSLATED DESCRIPTION</label>
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
                                listTitle="Documents"
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
                                Cancel
                            </button>
                            <button onClick={() => onSave(formData)} className="px-8 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 transition-all rounded-sm uppercase tracking-wide">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN DOCUMENT MANAGER ---
export const DocumentManager = ({ onClose }: any) => {
    const { documents, addDocument, updateDocument, deleteDocument, currentLanguage, uiLabels } = useStore();
    const [view, setView] = useState<'VISUAL' | 'LIST'>('VISUAL');
    const [showFilters, setShowFilters] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
    const [activeFilters, setActiveFilters] = useState({
        types: [] as string[],
        years: [] as string[],
        status: [] as string[]
    });

    // Use documents from store
    const allDocs = [...documents];

    // Filter Logic
    const filteredDocs = allDocs.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeFilters.types.length === 0 || activeFilters.types.includes(doc.type === 'PPT' ? 'Presentations' : doc.type);
        const matchesYear = activeFilters.years.length === 0 || activeFilters.years.includes(doc.year);
        const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(doc.status);
        return matchesSearch && matchesType && matchesYear && matchesStatus;
    }).sort((a, b) => {
        const valA = (a as any)[sortConfig.key];
        const valB = (b as any)[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const toggleFilter = (category: 'types' | 'years' | 'status', value: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(i => i !== value)
                : [...prev[category], value]
        }));
    };

    const clearFilters = () => setActiveFilters({ types: [], years: [], status: [] });

    const handleSaveDoc = async (doc: DocumentItem) => {
        if (doc.id) await updateDocument(doc);
        else await addDocument({ ...doc, id: `doc_${Date.now()}` });
        setShowAdd(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        deleteDocument(id);
        setDeleteId(null);
        setEditingItem(null);
    };

    const customFooter = (
        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm flex items-center gap-1">
            Close <span className="text-gray-400 text-xs border border-gray-300 rounded-full w-4 h-4 inline-flex items-center justify-center">i</span>
        </button>
    );

    return (
        <GenericModal
            className="document-management-popup"
            title={getLocalizedText(uiLabels.DOC_MGMT, currentLanguage)}
            onClose={onClose}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
            customFooter={customFooter}
            headerIcons={
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 mr-2 hidden md:inline">{getLocalizedText(uiLabels.DESC_DOC_MGMT, currentLanguage)} <span className="text-blue-400 border border-blue-200 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]">i</span></span>
                    <div className="flex border border-[var(--primary-color)] rounded-sm overflow-hidden shadow-sm h-8">
                        <button onClick={() => setView('VISUAL')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'VISUAL' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><Monitor className="w-3 h-3" /> {getLocalizedText(uiLabels.LABEL_VISUAL_VIEW, currentLanguage)}</button>
                        <button onClick={() => setView('LIST')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'LIST' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><ListIcon className="w-3 h-3" /> {getLocalizedText(uiLabels.LABEL_LIST_VIEW, currentLanguage)}</button>
                    </div>
                    <HelpCircle className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[var(--primary-color)]" />
                </div>
            }
        >
            <div className="flex flex-col h-[650px] bg-white">

                {/* TOP TOOLBAR */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0 gap-4">
                    <div className="flex-1 max-w-lg flex gap-2">
                        <div className="relative flex-1">
                            <input
                                placeholder={getLocalizedText(uiLabels.LABEL_SEARCH_DOCS, currentLanguage)}
                                className="border border-gray-300 p-2.5 pl-9 pr-9 text-sm w-full focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    title={getLocalizedText(uiLabels.BTN_CLEAR_SEARCH, currentLanguage)}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 flex items-center gap-2 text-sm font-bold border rounded-sm transition-colors ${showFilters ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'bg-[var(--primary-color)] text-white hover:bg-opacity-90 border-[var(--primary-color)]'}`}
                        >
                            <Filter className="w-4 h-4" /> {getTranslation('BTN_FILTERS', currentLanguage)} <span className="text-[10px] border border-white/40 px-1 rounded-full">i</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mr-2">
                            <span>{getLocalizedText(uiLabels.LABEL_SORT_BY, currentLanguage)}</span>
                            <span className="text-blue-400 text-xs border border-blue-200 rounded-full w-4 h-4 inline-flex items-center justify-center">i</span>
                            <div className="relative">
                                <select
                                    className="border border-gray-300 p-2 pr-8 text-sm rounded-sm bg-white focus:ring-1 focus:ring-[var(--primary-color)] outline-none appearance-none cursor-pointer w-40"
                                    value={sortConfig.key}
                                    onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value }))}
                                >
                                    <option value="title">{getLocalizedText(uiLabels.LABEL_TITLE, currentLanguage)}</option>
                                    <option value="date">{getLocalizedText(uiLabels.LABEL_PUBLISH_DATE, currentLanguage)}</option>
                                    <option value="status">{getLocalizedText(uiLabels.LABEL_STATUS, currentLanguage)}</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                            </div>
                            <button onClick={() => setSortConfig(p => ({ ...p, direction: p.direction === 'asc' ? 'desc' : 'asc' }))} className="p-2 border border-gray-300 rounded-sm hover:bg-gray-50 text-[var(--primary-color)]">
                                {sortConfig.direction === 'asc' ? <ArrowUpAZ className="w-4 h-4" /> : <ArrowDownAZ className="w-4 h-4" />}
                            </button>
                        </div>

                        <button onClick={() => setShowAdd(true)} className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold hover:opacity-90 shadow-sm rounded-sm">
                            {getLocalizedText(uiLabels.BTN_ADD_DOCUMENT, currentLanguage)}
                        </button>
                    </div>
                </div>

                {/* FILTER PANEL */}
                {showFilters && (
                    <div className="border-b border-gray-200 bg-gray-50 p-6 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-3 gap-12 text-sm">
                            <div>
                                <h5 className="font-bold text-[var(--primary-color)] mb-3">{getTranslation('LABEL_DOC_TYPES', currentLanguage)}</h5>
                                <div className="space-y-2">
                                    {DOC_TYPES.map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-gray-900 text-gray-600">
                                            <input type="checkbox" className="rounded-sm text-[var(--primary-color)] focus:ring-[var(--primary-color)]" checked={activeFilters.types.includes(type)} onChange={() => toggleFilter('types', type)} />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="font-bold text-[var(--primary-color)] mb-3">{getTranslation('LABEL_YEAR', currentLanguage)}</h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {YEARS.map(year => (
                                        <label key={year} className="flex items-center gap-2 cursor-pointer hover:text-gray-900 text-gray-600">
                                            <input type="checkbox" className="rounded-sm text-[var(--primary-color)] focus:ring-[var(--primary-color)]" checked={activeFilters.years.includes(year)} onChange={() => toggleFilter('years', year)} />
                                            {year}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <h5 className="font-bold text-[var(--primary-color)] mb-3">{getTranslation('LABEL_STATUS', currentLanguage)}</h5>
                                <div className="space-y-2">
                                    {STATUSES.map(status => (
                                        <label key={status} className="flex items-center gap-2 cursor-pointer hover:text-gray-900 text-gray-600">
                                            <input type="checkbox" className="rounded-sm text-[var(--primary-color)] focus:ring-[var(--primary-color)]" checked={activeFilters.status.includes(status)} onChange={() => toggleFilter('status', status)} />
                                            {status}
                                        </label>
                                    ))}
                                </div>
                                <button onClick={clearFilters} className="absolute bottom-0 right-0 px-4 py-2 border border-[var(--primary-color)] text-[var(--primary-color)] text-xs font-bold hover:bg-[var(--brand-light)] rounded-sm flex items-center gap-1">
                                    {getTranslation('BTN_CLEAR_FILTERS', currentLanguage)} <span className="text-[10px] border border-[var(--primary-color)] rounded-full w-3.5 h-3.5 inline-flex items-center justify-center">i</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {view === 'VISUAL' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredDocs.map((doc: any) => (
                                <div key={doc.id} className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all rounded-sm flex items-center gap-4 group relative">
                                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                                        {getDocIcon(doc.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-800 text-sm truncate pr-4">{getItemTranslation(doc, currentLanguage, 'title')}</h4>
                                            <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${doc.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> {doc.date}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full border border-yellow-200">
                                            {doc.status === 'Draft' ? 'Draft' : 'Draft'} <Info className="inline w-3 h-3 ml-1" />
                                        </span>
                                        <button onClick={() => setEditingItem(doc)} className="p-1.5 hover:bg-gray-100 rounded-sm" style={{ color: 'var(--icon-color)' }}><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setDeleteId(doc.id)} className="p-1.5 hover:bg-red-50 rounded-sm" style={{ color: 'var(--icon-color)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 w-16 text-center">{getTranslation('LABEL_FILE_TYPE', currentLanguage)}</th>
                                        <th className="p-4">{getTranslation('LABEL_DOC_NAME', currentLanguage)}</th>
                                        <th className="p-4 w-32">{getTranslation('LABEL_DATE', currentLanguage)}</th>
                                        <th className="p-4 w-32">{getTranslation('LABEL_STATUS', currentLanguage)}</th>
                                        <th className="p-4 text-right w-32">{getTranslation('TH_ACTIONS', currentLanguage)}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDocs.map((doc: any) => (
                                        <tr key={doc.id} className="hover:bg-[var(--brand-light)] transition-colors group">
                                            <td className="p-3 text-center">
                                                <div className="w-8 h-8 mx-auto flex items-center justify-center">
                                                    {getDocIcon(doc.type)}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-bold text-gray-800 text-sm mb-1">{getItemTranslation(doc, currentLanguage, 'title')}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1">{stripHtml(getItemTranslation(doc, currentLanguage, 'description')) || stripHtml(doc.description) || 'No description'}</div>
                                            </td>
                                            <td className="p-3 text-gray-500 text-xs font-mono">{doc.date}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full inline-block ${doc.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingItem(doc)} className="p-1.5 hover:bg-blue-50 rounded-sm" style={{ color: 'var(--icon-color)' }}><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => setDeleteId(doc.id)} className="p-1.5 hover:bg-red-50 rounded-sm" style={{ color: 'var(--icon-color)' }}><Trash2 className="w-4 h-4" /></button>
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

            {/* Sub Modals */}
            {showAdd && <AddDocumentModal onSave={handleSaveDoc} onCancel={() => setShowAdd(false)} />}
            {editingItem && <DocumentEditor item={editingItem} onSave={handleSaveDoc} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {deleteId && <ConfirmDeleteDialog title={getLocalizedText(uiLabels.TITLE_DELETE_DOC, currentLanguage)} message={getLocalizedText(uiLabels.MSG_CONFIRM_DELETE_DOC, currentLanguage)} onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
        </GenericModal>
    );
};
