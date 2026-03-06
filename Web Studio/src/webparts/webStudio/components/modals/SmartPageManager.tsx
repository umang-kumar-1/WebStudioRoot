
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore, getLocalizedText, getTranslation } from '../../store';
import { translateText } from '../../services/geminiService';
import { Page, MultilingualText } from '../../types';
import { JoditRichTextEditor } from '../JoditEditor';
import {
    X, Menu as MenuIcon, Wand2, Check, Image as ImageIcon,
    Upload, Copy, Search, Globe
} from 'lucide-react';
import { SharePointMetadataFooter } from '../common/SharePointMetadataFooter';

export const SmartPageEditor = ({
    item,
    onSave,
    onCancel,
    onDelete
}: {
    item: Page,
    onSave: (p: Page) => void,
    onCancel: () => void,
    onDelete?: (id: string) => void
}) => {
    const { currentLanguage, images, uploadImage } = useStore();
    const [activeTab, setActiveTab] = useState<'BASIC' | 'IMAGE' | 'SEO' | 'TRANSLATION'>('BASIC');
    const [formData, setFormData] = useState<Page>({ ...item });
    const [isTranslating, setIsTranslating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imgTab, setImgTab] = useState<'COPY' | 'UPLOAD' | 'CHOOSE'>('CHOOSE');
    const [searchImg, setSearchImg] = useState('');
    const pasteAreaRef = useRef<HTMLDivElement>(null);

    // Sync formData when item changes (Fixes "previously opened modal" bug)
    useEffect(() => {
        setFormData({ ...item });
    }, [item]);

    const updateField = (field: keyof Page, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateTitle = (lang: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            title: { ...prev.title, [lang]: value }
        }));
    };

    const updateSeo = (field: 'title' | 'description' | 'keywords', value: string) => {
        setFormData(prev => ({
            ...prev,
            seo: { ...(prev.seo || { title: '', description: '', keywords: '' }), [field]: value }
        }));
    };

    const handleSave = () => {
        onSave({
            ...formData,
            modifiedDate: new Date().toISOString()
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsUploading(true);
        try {
            const file = e.target.files[0];
            const result = await uploadImage(file, 'SmartPages');
            if (result) {
                updateField('imageUrl', result.url);
                updateField('imageName', file.name);
            }
        } catch (error) {
            console.error("Upload Error", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (!file) continue;
                setIsUploading(true);
                try {
                    const result = await uploadImage(file, 'SmartPages');
                    if (result) {
                        updateField('imageUrl', result.url);
                        updateField('imageName', result.name);
                    }
                } catch (error) {
                    console.error("Paste Upload Error", error);
                } finally {
                    setIsUploading(false);
                }
            }
        }
    };

    const handleGallerySelect = (img: any) => {
        updateField('imageUrl', img.url);
        updateField('imageName', img.name || '');
    };

    const suggestSeo = () => {
        const baseTitle = getLocalizedText(formData.title, 'en');
        updateSeo('title', `${baseTitle} - Official Page`);
        updateSeo('description', `Learn more about ${baseTitle}. ${formData.description?.substring(0, 100) || ''}...`);
        updateSeo('keywords', `${baseTitle.toLowerCase().split(' ').join(', ')}, corporate, info`);
    };

    const suggestTranslationData = async () => {
        if (!currentLanguage || currentLanguage === 'en') return;
        setIsTranslating(true);
        try {
            const translatedTitle = await translateText(formData.title.en, currentLanguage);
            const translatedDesc = formData.description ? await translateText(formData.description, currentLanguage) : '';

            if (translatedTitle) {
                setFormData(prev => ({
                    ...prev,
                    title: { ...prev.title, [currentLanguage]: translatedTitle },
                    description: translatedDesc || prev.description
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    const filteredGallery = images.filter(img => (img.name || '').toLowerCase().includes(searchImg.toLowerCase()));

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[1000px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">
                        {getTranslation('TITLE_EDIT_PAGE_INFO', currentLanguage)} - {getLocalizedText(formData.title, currentLanguage)}
                    </h3>
                    <div className="flex items-center gap-4">
                        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-sm text-gray-500"><MenuIcon className="w-5 h-5" /></button>
                        <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    {[
                        { id: 'BASIC', label: getTranslation('TAB_BASIC_INFO', currentLanguage) },
                        { id: 'IMAGE', label: getTranslation('TAB_IMAGE_INFO', currentLanguage) },
                        { id: 'SEO', label: getTranslation('TAB_SEO', currentLanguage) },
                        { id: 'TRANSLATION', label: getTranslation('TAB_TRANSLATION', currentLanguage) }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
                    {activeTab === 'BASIC' && (
                        <div className="space-y-6 bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (English)</label>
                                    <input
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                        value={formData.title.en}
                                        onChange={e => updateTitle('en', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none bg-white"
                                        value={formData.status}
                                        onChange={e => updateField('status', e.target.value)}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL Path)</label>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 p-2.5 rounded-sm">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <input
                                            className="w-full bg-transparent text-sm outline-none text-gray-600 font-mono"
                                            value={formData.slug}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort Order</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            value={formData.sortOrder || 0}
                                            onChange={e => updateField('sortOrder', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="flex items-center pt-5 gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-[var(--primary-color)] rounded-sm border-gray-300"
                                            checked={formData.isHomePage}
                                            onChange={e => updateField('isHomePage', e.target.checked)}
                                        />
                                        <label className="text-sm font-bold text-gray-700">Set as Home</label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Original Description</label>
                                <JoditRichTextEditor
                                    value={formData.description || ''}
                                    onChange={(newValue) => updateField('description', newValue)}
                                    placeholder="Enter original description..."
                                    height={200}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'IMAGE' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm space-y-6">
                            <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Current" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thumbnail Image URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 border border-gray-300 p-2 text-sm text-gray-600 rounded-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                                                value={formData.imageUrl || ''}
                                                onChange={e => updateField('imageUrl', e.target.value)}
                                                placeholder="https://..."
                                            />
                                            <button onClick={() => updateField('imageUrl', '')} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-sm hover:bg-gray-200 uppercase transition-colors">Default Logo</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image Name</label>
                                        <input
                                            className="w-full border border-gray-300 p-2 text-sm rounded-sm"
                                            value={formData.imageName || ''}
                                            onChange={e => updateField('imageName', e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => updateField('imageUrl', '')} className="text-xs text-[var(--primary-color)] hover:underline flex items-center gap-1">
                                        <X className="w-3 h-3" /> Clear Image
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex gap-6 border-b border-gray-200 mb-6">
                                    {['COPY & PASTE', 'UPLOAD', 'CHOOSE FROM EXISTING'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setImgTab(tab.split(' ')[0] as any)}
                                            className={`pb-2 text-xs font-bold uppercase transition-colors ${imgTab === tab.split(' ')[0] ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-gray-400'}`}
                                        >
                                            {tab === 'CHOOSE FROM EXISTING' ? `${tab} (${images.length})` : tab}
                                        </button>
                                    ))}
                                </div>

                                {imgTab === 'COPY' && (
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
                                )}

                                {imgTab === 'UPLOAD' && (
                                    <div className="flex justify-end">
                                        <label className={`bg-[var(--primary-color)] text-white px-6 py-2 text-sm font-bold shadow-md cursor-pointer hover:opacity-90 rounded-sm flex items-center gap-2 transition-all ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                                            <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Image'}
                                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
                                        </label>
                                    </div>
                                )}

                                {imgTab === 'CHOOSE' && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                className="w-full border border-gray-300 p-2.5 pl-9 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                                placeholder="Search gallery..."
                                                value={searchImg}
                                                onChange={e => setSearchImg(e.target.value)}
                                            />
                                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="grid grid-cols-5 gap-3 max-h-60 overflow-y-auto p-1">
                                            {filteredGallery.map(img => (
                                                <div
                                                    key={img.id}
                                                    onClick={() => handleGallerySelect(img)}
                                                    className={`aspect-square border-2 rounded-sm cursor-pointer transition-all overflow-hidden relative group ${formData.imageUrl === img.url ? 'border-[var(--primary-color)]' : 'border-transparent hover:border-gray-300'}`}
                                                >
                                                    <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    {formData.imageUrl === img.url && (
                                                        <div className="absolute top-1 right-1 bg-[var(--primary-color)] text-white rounded-full p-0.5 shadow-sm"><Check className="w-3 h-3" /></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'SEO' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm space-y-6">
                            <div className="flex justify-end">
                                <button onClick={suggestSeo} className="bg-[var(--primary-color)] text-white px-4 py-2 text-xs font-bold flex items-center gap-2 hover:opacity-90 shadow-sm transition-all rounded-sm active:scale-95">
                                    <Wand2 className="w-3 h-3" /> Suggest with AI
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Title</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)]" value={formData.seo?.title || ''} onChange={e => updateSeo('title', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Description</label>
                                    <textarea className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none h-24 resize-none focus:ring-1 focus:ring-[var(--primary-color)]" value={formData.seo?.description || ''} onChange={e => updateSeo('description', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keywords</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)]" value={formData.seo?.keywords || ''} onChange={e => updateSeo('keywords', e.target.value)} placeholder="e.g. services, about, contact" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'TRANSLATION' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase">
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Original (English)</div>
                                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Translation ({currentLanguage.toUpperCase()})</div>
                                </div>
                                <button
                                    onClick={suggestTranslationData}
                                    disabled={isTranslating}
                                    className={`text-[var(--primary-color)] text-xs font-bold flex items-center gap-2 hover:underline transition-all ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                                >
                                    <Wand2 className={`w-3 h-3 ${isTranslating ? 'animate-pulse' : ''}`} /> {isTranslating ? 'Translating...' : 'Suggest with AI'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6 opacity-60">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Original Title</label>
                                        <div className="p-3 bg-gray-50 border border-gray-100 text-sm rounded-sm text-gray-600 font-medium">{formData.title.en}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Original Description</label>
                                        <div className="p-3 bg-gray-50 border border-gray-100 text-sm rounded-sm text-gray-600 prose prose-sm max-h-40 overflow-y-auto" dangerouslySetInnerHTML={{ __html: formData.description || '' }} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Translated Title</label>
                                        <input
                                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                            value={formData.title[currentLanguage] || ''}
                                            onChange={e => updateTitle(currentLanguage, e.target.value)}
                                            placeholder="Enter translated title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Translated Description</label>
                                        <JoditRichTextEditor
                                            value={formData.description || ''}
                                            onChange={(newValue) => updateField('description', newValue)}
                                            placeholder="Enter translated description..."
                                            height={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100 px-8 py-4">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <SharePointMetadataFooter
                                listTitle="SmartPages"
                                itemId={formData.id}
                                createdDate={item.createdDate || item.modifiedDate}
                                createdBy={item.createdBy}
                                modifiedDate={item.modifiedDate}
                                modifiedBy={item.modifiedBy}
                                onDelete={() => onDelete?.(formData.id)}
                                onVersionRestore={() => {
                                    useStore.getState().loadFromSharePoint();
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={onCancel} className="px-8 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors uppercase tracking-wide">Cancel</button>
                            <button onClick={handleSave} className="px-8 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 rounded-sm transition-all active:scale-95 uppercase tracking-wide">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const CreateSmartPageModal = ({ onSave, onCancel }: { onSave: (p: Partial<Page>) => void, onCancel: () => void }) => {
    const { currentLanguage } = useStore();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        setSlug('/' + title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
    }, [title]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!title.trim()) {
            setError(true);
            return;
        }

        onSave({
            title: { en: title, de: title, fr: title, es: title } as MultilingualText,
            slug,
            status: 'Draft',
            containers: [],
            modifiedDate: new Date().toISOString(),
            description: '',
            isHomePage: false,
            imageUrl: '',
            imageName: '',
            sortOrder: 0
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[500px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[var(--primary-color)]">{getTranslation('TITLE_CREATE_PAGE', currentLanguage)}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm font-medium flex items-center gap-2">
                            {getTranslation('MSG_REQ_TITLE', currentLanguage)}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_PAGE_TITLE', currentLanguage)} <span className="text-red-500">*</span></label>
                        <input
                            autoFocus
                            className={`w-full border p-2.5 text-sm rounded-sm outline-none transition-shadow ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[var(--primary-color)]'}`}
                            placeholder="e.g. Service Details"
                            value={title}
                            onChange={e => { setTitle(e.target.value); setError(false); }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_URL_SLUG', currentLanguage)}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 p-2.5 rounded-sm">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <input
                                className="w-full bg-transparent text-sm outline-none text-gray-600 font-mono"
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-gray-300 text-sm font-bold hover:bg-gray-100 rounded-sm transition-colors">{getTranslation('BTN_CANCEL', currentLanguage)}</button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-md rounded-sm transition-opacity hover:opacity-90"
                        >
                            {getTranslation('BTN_CREATE_PAGE', currentLanguage)}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
