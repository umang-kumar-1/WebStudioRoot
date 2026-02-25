import React, { useState, useEffect, useMemo } from 'react';
import { useStore, getLocalizedText, getItemTranslation, GLOBAL_DEFAULT_IMAGE } from '../../store';
import { translateText } from '../../services/geminiService';
import { Container, ContainerType } from '../../types';
import { GenericModal, TabButton, ConfirmDeleteDialog } from './SharedModals';
import {
    Trash2, AlignCenter, AlignLeft, AlignRight,
    Plus, X, Square, Circle, LayoutGrid, List as ListIcon,
    Image as ImageIcon, Palette,
    ArrowUp, ArrowDown, Monitor, Globe, Wand2, Smartphone, Tablet,
    Upload, Link as LinkIcon, MoreHorizontal, AlignJustify,
    FileText, AlertCircle, Pencil, Save, FileSpreadsheet, Presentation,
    MapPin
} from 'lucide-react';

import { JoditRichTextEditor } from '../JoditEditor';

// Import Reusable Editors
import { NewsEditor, CreateNewsModal } from './NewsManager';
import { EventEditor, CreateEventModal } from './EventManager';
import { DocumentEditor, AddDocumentModal } from './DocumentManager';
import { ContainerItemEditor, CreateContainerItemModal } from './ContainerItemManager';
import { ContactEditor, CreateContactModal } from './ContactManager';
import { SliderItemEditor, CreateSliderItemModal } from './SliderManager';

// --- MOCK ASSETS ---


// --- HELPER: DOCUMENT ICONS ---
const getDocIcon = (type: string) => {
    switch (type) {
        case 'Word': return <FileText className="w-8 h-8 text-blue-600 opacity-80" />;
        case 'Excel': return <FileSpreadsheet className="w-8 h-8 text-green-600 opacity-80" />;
        case 'PDF': return <FileText className="w-8 h-8 text-red-500 opacity-80" />;
        case 'PPT':
        case 'Presentations': return <Presentation className="w-8 h-8 text-orange-500 opacity-80" />;
        case 'Link': return <LinkIcon className="w-8 h-8 text-sky-500 opacity-80" />;
        default: return <FileText className="w-8 h-8 text-gray-400 opacity-80" />;
    }
};

// --- SHARED COMPONENTS ---

interface VisualOptionProps {
    label: string;
    icon?: React.ElementType;
    active: boolean;
    onClick: () => void;
    extraClass?: string;
}

const VisualOption = ({ label, icon: Icon, active, onClick, extraClass = "" }: VisualOptionProps) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 px-2 text-xs font-bold uppercase flex flex-col items-center justify-center gap-2 border rounded-sm transition-all ${active ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'} ${extraClass}`}
    >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
    </button>
);

interface VisualSelectorOption {
    value: string | number | boolean;
    label: string;
    text?: string;
    icon?: React.ElementType;
}

interface VisualSelectorProps {
    label: string;
    options: VisualSelectorOption[];
    value: string | number | boolean;
    onChange: (val: string | number | boolean) => void;
}

const VisualSelector = ({ label, options, value, onChange }: VisualSelectorProps) => (
    <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>
        <div className="flex bg-gray-100 p-1 rounded-sm gap-1">
            {options.map((opt) => (
                <button
                    key={opt.value.toString()}
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 rounded-sm transition-all ${value === opt.value ? 'bg-white text-[var(--primary-color)] shadow-sm ring-1 ring-[var(--primary-color)]' : 'text-gray-500 hover:text-gray-700'}`}
                    title={opt.label}
                >
                    {opt.icon && <opt.icon className="w-4 h-4" />}
                    {opt.text || opt.label}
                </button>
            ))}
        </div>
    </div>
);

const ColorPicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-sm overflow-hidden border border-gray-300 shadow-sm">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full h-full" style={{ backgroundColor: value }}></div>
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-24 border border-gray-300 p-1.5 text-xs rounded-sm font-mono uppercase" />
    </div>
);

const ImagePicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [tab, setTab] = useState<'LIB' | 'UPLOAD'>('LIB');
    const { images, uploadImage } = useStore();

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
                {['Existing Images', 'Upload Image'].map((l, i) => {
                    const t = i === 0 ? 'LIB' : 'UPLOAD';
                    return (
                        <button key={t} onClick={() => setTab(t as any)} className={`pb-2 text-xs font-bold uppercase ${tab === t ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]' : 'text-gray-500'}`}>{l}</button>
                    );
                })}
            </div>

            {tab === 'LIB' && (
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                    {images.map((img, i) => (
                        <div key={img.id} className="relative group aspect-square">
                            <img
                                src={img.url}
                                onClick={() => onChange(img.url)}
                                className={`w-full h-full object-cover cursor-pointer border-2 transition-all ${value === img.url ? 'border-[var(--primary-color)]' : 'border-transparent hover:border-gray-300'}`}
                                title={img.name}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-white font-bold uppercase">Select</span>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-5 text-center py-8 text-gray-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs italic">No images in library</p>
                        </div>
                    )}
                </div>
            )}

            {tab === 'UPLOAD' && (
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1 uppercase font-bold">Click to Upload</span>
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                </label>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-sm border border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {value ? <img src={value} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-300" />}
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            className="flex-1 border border-gray-300 p-2 text-xs rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder="Paste image URL here..."
                        />
                        <button
                            onClick={() => onChange(GLOBAL_DEFAULT_IMAGE)}
                            className="px-3 py-2 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-sm hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
                            title="Set to Default Logo"
                        >
                            LOGO
                        </button>
                    </div>
                    {value && (
                        <button onClick={() => onChange('')} className="text-red-500 hover:text-red-700 transition-colors" title="Clear Image">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TranslationTab = ({ data, onUpdate, fields }: { data: Container, onUpdate: (key: string, value: string) => void, fields: { key: string, label: string, type: 'input' | 'textarea' | 'rich' }[] }) => {
    const { currentLanguage } = useStore();
    const [isTranslating, setIsTranslating] = useState(false);

    const getValue = (key: string, lang: string) => {
        const item = data.content[key];
        if (!item) return '';
        if (typeof item === 'string') return item;
        return item[lang] || '';
    };

    const handleSuggestAI = async () => {
        setIsTranslating(true);
        try {
            // ✅ Translate sequentially (not in parallel) to avoid React stale state overwrites.
            // With Promise.all, each onUpdate called setData with the same old `data` snapshot,
            // so only the last update survived. Sequential ensures each update sees fresh state.
            for (const field of fields) {
                const originalVal = getValue(field.key, 'en');
                if (originalVal) {
                    const translated = await translateText(originalVal, currentLanguage);
                    if (translated) {
                        onUpdate(field.key, translated);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-[var(--primary-color)]" /><span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Translation Manager</span></div>
                <div className="flex items-center gap-4"><div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border px-3 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-blue-500"></span>{currentLanguage === 'en' ? 'English (Source)' : `Target Language: ${currentLanguage.toUpperCase()}`}</div></div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/2 bg-gray-50 border-r border-gray-200 p-8 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-6"><div className="w-2 h-2 rounded-full bg-gray-400"></div><h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Original (English)</h4></div>
                    <div className="space-y-6">
                        {fields.map(field => (
                            <div key={`orig_${field.key}`}>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{field.label}</label>
                                {field.type === 'rich' ? (
                                    <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-600 min-h-[100px]">
                                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: getValue(field.key, 'en') || '' }}></div>
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-600 min-h-[100px] whitespace-pre-wrap select-text">{getValue(field.key, 'en') || <span className="opacity-50">Empty</span>}</div>
                                ) : (
                                    <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-600 select-text">{getValue(field.key, 'en') || <span className="opacity-50">Empty</span>}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 bg-white p-8 overflow-y-auto relative">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--primary-color)]"></div><h4 className="text-xs font-bold text-[var(--primary-color)] uppercase tracking-wider">Translation ({currentLanguage.toUpperCase()})</h4></div>
                        <button onClick={handleSuggestAI} disabled={isTranslating} className={`text-[var(--primary-color)] text-xs font-bold flex items-center gap-1.5 hover:bg-blue-50 px-3 py-1.5 rounded-sm transition-colors border border-transparent hover:border-blue-100 ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}>
                            <Wand2 className={`w-3 h-3 ${isTranslating ? 'animate-pulse' : ''}`} /> {isTranslating ? 'Translating...' : 'Suggest with AI'}
                        </button>
                    </div>
                    <div className="space-y-6">
                        {fields.map(field => (
                            <div key={`trans_${field.key}`}>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Translated {field.label}</label>
                                {field.type === 'rich' ? (
                                    <JoditRichTextEditor
                                        value={getValue(field.key, currentLanguage)}
                                        onChange={(val: string) => onUpdate(field.key, val)}
                                        placeholder={`Enter ${field.label} translation...`}
                                        height={150}
                                    />
                                ) : field.type === 'textarea' ? (
                                    <textarea className="w-full p-3 border border-gray-300 rounded-sm text-sm text-gray-800 focus:ring-1 focus:ring-[var(--primary-color)] outline-none min-h-[100px] resize-y placeholder:text-gray-300" value={getValue(field.key, currentLanguage)} onChange={(e) => onUpdate(field.key, e.target.value)} placeholder={`Enter ${field.label} translation...`} />
                                ) : (
                                    <input className="w-full p-3 border border-gray-300 rounded-sm text-sm text-gray-800 focus:ring-1 focus:ring-[var(--primary-color)] outline-none placeholder:text-gray-300" value={getValue(field.key, currentLanguage)} onChange={(e) => onUpdate(field.key, e.target.value)} placeholder={`Enter ${field.label} translation...`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 1. HEADER / HERO EDITOR ---
const HeroEditor = ({ data, setData, onClose }: { data: Container, setData: React.Dispatch<React.SetStateAction<Container>>, onClose?: () => void }) => {
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'SETTINGS' | 'TRANSLATION'>('CONTENT');
    const { currentLanguage } = useStore();

    // Ensure we have a default bgType if none exists (migration/safety)
    useEffect(() => {
        if (!data.settings.bgType) {
            updateSetting('bgType', 'none');
        }
    }, []);

    const updateContent = (key: string, val: string) => {
        // ✅ Use functional update to always read latest state and avoid stale closure overwrites during AI translation
        setData((prev: Container) => ({
            ...prev,
            content: { ...prev.content, [key]: { ...(prev.content[key] as any), [currentLanguage]: val } }
        }));
    };

    const updateSetting = (key: string, val: any) => {
        setData((prev: Container) => ({ ...prev, settings: { ...prev.settings, [key]: val } }));
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex border-b border-gray-200 px-6 bg-gray-50">
                <TabButton active={activeTab === 'CONTENT'} label="Manage Content" onClick={() => setActiveTab('CONTENT')} />
                <TabButton active={activeTab === 'SETTINGS'} label="Settings" onClick={() => setActiveTab('SETTINGS')} />
                <TabButton active={activeTab === 'TRANSLATION'} label="Translation" onClick={() => setActiveTab('TRANSLATION')} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'CONTENT' && (
                    <div className="p-8 space-y-6 mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Container Title (Internal)</label><input className="w-full border p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Home Page Hero Section" /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label><input className="w-full border p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm" value={getLocalizedText(data.content.title, currentLanguage)} onChange={(e) => updateContent('title', e.target.value)} /></div>

                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Heading (Optional)</label><input className="w-full border p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm" value={getLocalizedText(data.content.subtitle, currentLanguage)} onChange={(e) => updateContent('subtitle', e.target.value)} /></div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Rich Text)</label>
                            <JoditRichTextEditor
                                value={getLocalizedText(data.content.description, currentLanguage)}
                                onChange={(val: string) => updateContent('description', val)}
                                height={200}
                                placeholder="Description..."
                            />
                        </div>

                        {/* Button Configuration */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Action Button</h4>
                                <div
                                    className="flex items-center gap-2 cursor-pointer select-none"
                                    onClick={() => updateSetting('btnEnabled', !data.settings.btnEnabled)}
                                >
                                    <span className="text-xs font-medium text-gray-500">{data.settings.btnEnabled ? 'Enabled' : 'Disabled'}</span>
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${data.settings.btnEnabled ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}>
                                        <div
                                            className="w-4 h-4 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform"
                                            style={{ left: data.settings.btnEnabled ? '18px' : '2px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {data.settings.btnEnabled && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Name</label>
                                        <input
                                            className="w-full border p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm"
                                            value={data.settings.btnName || ''}
                                            onChange={(e) => updateSetting('btnName', e.target.value)}
                                            placeholder="e.g. Learn More, Get Started, Contact Us"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button URL</label>
                                        <input
                                            className="w-full border p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm"
                                            value={data.settings.btnUrl || ''}
                                            onChange={(e) => updateSetting('btnUrl', e.target.value)}
                                            placeholder="e.g. https://example.com or /page-slug"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'SETTINGS' && (
                    <div className="p-8 space-y-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Template design (Standard)</h4>
                            <div className="flex gap-4 mb-4">
                                <VisualOption label="Text title" active={data.settings.bgType === 'none'} onClick={() => updateSetting('bgType', 'none')} />
                                <VisualOption label="Title with color background" active={data.settings.bgType === 'color'} onClick={() => updateSetting('bgType', 'color')} />
                                <VisualOption label="Title with image background" active={data.settings.bgType === 'image'} onClick={() => updateSetting('bgType', 'image')} />
                                <VisualOption label="Layout Design Section" active={data.settings.bgType === 'layout'} onClick={() => updateSetting('bgType', 'layout')} />
                            </div>

                            {data.settings.bgType === 'layout' && (
                                <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Layout design</h4>
                                    <div className="flex gap-4">
                                        <VisualOption
                                            label="Image Left, Text Right"
                                            active={data.settings.layoutVariant === 'img_left'}
                                            onClick={() => updateSetting('layoutVariant', 'img_left')}
                                            icon={() => (
                                                <div className="flex w-full h-8 border border-gray-300 rounded-sm overflow-hidden">
                                                    <div className="w-1/2 bg-[var(--primary-color)] opacity-50"></div>
                                                    <div className="w-1/2 bg-gray-100"></div>
                                                </div>
                                            )}
                                        />
                                        <VisualOption
                                            label="Text Left, Image Right"
                                            active={data.settings.layoutVariant === 'img_right'}
                                            onClick={() => updateSetting('layoutVariant', 'img_right')}
                                            icon={() => (
                                                <div className="flex w-full h-8 border border-gray-300 rounded-sm overflow-hidden">
                                                    <div className="w-1/2 bg-gray-100"></div>
                                                    <div className="w-1/2 bg-[var(--primary-color)] opacity-50"></div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            {data.settings.bgType === 'color' && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-sm">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Background Color</label>
                                    <ColorPicker value={data.settings.bgColor || '#ffffff'} onChange={(v) => updateSetting('bgColor', v)} />
                                </div>
                            )}

                            {(data.settings.bgType === 'image' || data.settings.bgType === 'layout') && (
                                <div className="mt-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image</label>
                                    <ImagePicker value={data.settings.bgImage || ''} onChange={(v) => updateSetting('bgImage', v)} />
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Typography</h4>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                {/* Heading Color */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Heading Color</label>
                                    <select className="w-full border p-2 text-sm rounded-sm bg-white mb-2" value={data.settings.titleColor || 'site'} onChange={(e) => updateSetting('titleColor', e.target.value)}>
                                        <option value="site">Site Color</option>
                                        <option value="black">Black</option>
                                        <option value="white">White</option>
                                        <option value="custom">Custom Color</option>
                                    </select>
                                    {data.settings.titleColor === 'custom' && (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                            <ColorPicker value={data.settings.titleCustomColor || '#333333'} onChange={(v) => updateSetting('titleCustomColor', v)} />
                                        </div>
                                    )}
                                </div>

                                {/* Sub Heading Color */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sub Heading Color</label>
                                    <select className="w-full border p-2 text-sm rounded-sm bg-white mb-2" value={data.settings.subtitleColor || 'site'} onChange={(e) => updateSetting('subtitleColor', e.target.value)}>
                                        <option value="site">Site Color</option>
                                        <option value="black">Black</option>
                                        <option value="white">White</option>
                                        <option value="custom">Custom Color</option>
                                    </select>
                                    {data.settings.subtitleColor === 'custom' && (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                            <ColorPicker value={data.settings.subtitleCustomColor || '#666666'} onChange={(v) => updateSetting('subtitleCustomColor', v)} />
                                        </div>
                                    )}
                                </div>

                                {/* Description Color */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description Color</label>
                                    <select className="w-full border p-2 text-sm rounded-sm bg-white mb-2" value={data.settings.descColor || 'site'} onChange={(e) => updateSetting('descColor', e.target.value)}>
                                        <option value="site">Site Color</option>
                                        <option value="black">Black</option>
                                        <option value="white">White</option>
                                        <option value="custom">Custom Color</option>
                                    </select>
                                    {data.settings.descColor === 'custom' && (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                            <ColorPicker value={data.settings.descCustomColor || '#555555'} onChange={(v) => updateSetting('descCustomColor', v)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alignment</label>
                                    <div className="flex border rounded-sm overflow-hidden">
                                        {['left', 'center', 'right'].map(align => (
                                            <button key={align} onClick={() => updateSetting('align', align)} className={`flex-1 py-2 flex justify-center ${data.settings.align === align ? 'bg-[var(--primary-color)] text-white' : 'bg-white hover:bg-gray-50'}`}>
                                                {align === 'left' ? <AlignLeft className="w-4 h-4" /> : (align === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Letter Case</label>
                                    <select className="w-full border p-2 text-sm rounded-sm bg-white" value={data.settings.letterCase} onChange={(e) => updateSetting('letterCase', e.target.value)}>
                                        <option value="uppercase">UPPERCASE</option>
                                        <option value="lowercase">lowercase</option>
                                        <option value="sentence">Sentence case</option>
                                        <option value="title">Title Case</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'TRANSLATION' && (
                    <TranslationTab
                        data={data}
                        onUpdate={updateContent}
                        fields={[
                            { key: 'title', label: 'Heading', type: 'input' },
                            { key: 'subtitle', label: 'Sub Heading', type: 'input' },
                            { key: 'description', label: 'Description', type: 'rich' }
                        ]}
                    />
                )}
            </div>
        </div>
    );
};

// --- 2. DATA GRID EDITOR (Strict Implementation) ---

const DataGridEditor = ({ data, setData, onClose }: { data: Container, setData: (d: Container) => void, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'SETTINGS'>('CONTENT');
    const {
        news, events, documents, pages, containerItems, contacts, sliderItems,
        addNews, addEvent, addDocument, addContainerItem, addContact, addSliderItem,
        updateNews, updateEvent, updateDocument, updatePage, updateContainerItem, updateContact, updateSliderItem,
        deleteNews, deleteEvent, deleteDocument, deleteContainerItem, deleteContact, deleteSliderItem,
        currentLanguage
    } = useStore();

    // Internal State for Modals
    const [showCreate, setShowCreate] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null); // For editing source item
    const [deleteId, setDeleteId] = useState<string | null>(null);
    // Strict Behavior: Setting updates trigger immediate save via parent wrapper (which syncs to store)
    const updateSetting = (key: string, val: any) => setData({ ...data, settings: { ...data.settings, [key]: val } });
    const updateContent = (key: string, val: string) => {
        setData({ ...data, content: { ...data.content, [key]: { ...(data.content[key] as any), [currentLanguage]: val } } });
    };

    // Data Source Management — for SLIDER containers, default to 'ImageSlider'
    const source = data.settings.source || (data.type === ContainerType.SLIDER ? 'ImageSlider' : 'News');
    const normalizeSource = (src?: string) => (src === 'Contacts' ? 'Contact' : src);
    const normalizedSource = normalizeSource(source);
    let sourceData: any[] = [];
    if (source === 'News') sourceData = news;
    else if (source === 'Event') sourceData = events;
    else if (source === 'Document') sourceData = documents;
    else if (source === 'Smart Pages') sourceData = pages;
    else if (source === 'Contact') sourceData = contacts;
    else if (source === 'Container Items') sourceData = containerItems;
    else if (source === 'ImageSlider') sourceData = sliderItems;

    const taggedIds = data.settings.taggedItems || [];

    const getContainerSource = (container: Container) => {
        if (container.settings?.source) return normalizeSource(container.settings.source);
        if (container.type === ContainerType.SLIDER) return 'ImageSlider';
        return undefined;
    };

    const isTaggedElsewhere = (id: string, overrideCurrent?: string[]) => {
        return pages.some(page => page.containers.some(container => {
            const containerSource = getContainerSource(container);
            if (!containerSource || containerSource !== normalizedSource) return false;
            const tagged = container.id === data.id ? (overrideCurrent || container.settings?.taggedItems) : container.settings?.taggedItems;
            return Array.isArray(tagged) && tagged.includes(id);
        }));
    };

    // Filter Items
    const availableItems = sourceData.filter((item: any) => !taggedIds.includes(item.id));
    const taggedItems = taggedIds.map((id: string) => sourceData.find((item: any) => item.id === id)).filter(Boolean);

    // Validation
    const columns = data.settings.columns || 3;
    const isValidationFailed = taggedItems.length < columns;

    // --- Actions ---

    const handleTag = async (id: string) => {
        if (taggedIds.includes(id)) return;
        const newTagged = [...taggedIds, id];
        updateSetting('taggedItems', newTagged);

        // Auto-Publish Logic
        const item = sourceData.find((i: any) => i.id === id);
        if (item && item.status !== 'Published') {
            const updated = { ...item, status: 'Published' };
            if (source === 'News') await updateNews(updated);
            else if (source === 'Event') await updateEvent(updated);
            else if (source === 'Document') await updateDocument(updated);
            else if (source === 'Smart Pages') await updatePage(updated);
            else if (source === 'Container Items') await updateContainerItem(updated);
            else if (source === 'Contact') await updateContact(updated);
            else if (source === 'ImageSlider') await updateSliderItem(updated);
        }
    };

    const handleUntag = async (id: string) => {
        const newTagged = taggedIds.filter((tid: string) => tid !== id);
        updateSetting('taggedItems', newTagged);

        // Auto-Draft Logic
        const item = sourceData.find((i: any) => i.id === id);
        if (item && item.status !== 'Draft') {
            const stillTagged = isTaggedElsewhere(id, newTagged);
            if (stillTagged) return;
            const updated = { ...item, status: 'Draft' };
            if (source === 'News') await updateNews(updated);
            else if (source === 'Event') await updateEvent(updated);
            else if (source === 'Document') await updateDocument(updated);
            else if (source === 'Smart Pages') await updatePage(updated);
            else if (source === 'Container Items') await updateContainerItem(updated);
            else if (source === 'Contact') await updateContact(updated);
            else if (source === 'ImageSlider') await updateSliderItem(updated);
        }
    };

    // --- Create New Item Logic ---
    const handleCreateInit = async (title: string | any) => {
        // 1. Create item in Source
        let newItem: any;
        const baseId = `${source.toLowerCase().substring(0, 3)}_${Date.now()}`;

        if (source === 'News') {
            newItem = { id: baseId, title, status: 'Draft', publishDate: new Date().toISOString(), description: '', imageUrl: '', readMore: { enabled: true }, translations: {} };
            await addNews(newItem);
        } else if (source === 'Event') {
            newItem = { id: baseId, title, status: 'Draft', startDate: new Date().toISOString(), endDate: new Date().toISOString(), description: '', imageUrl: '', readMore: { enabled: true }, translations: {} };
            await addEvent(newItem);
        } else if (source === 'Document') {
            newItem = { id: baseId, title, status: 'Draft', date: new Date().toISOString(), type: 'PDF', year: '2025', description: '', translations: {} };
            await addDocument(newItem);
        } else if (source === 'Container Items') {
            newItem = { id: baseId, title, status: 'Draft', sortOrder: 0, description: '', imageUrl: '', readMore: { enabled: false, url: '', text: '' }, translations: {}, seo: {} };
            await addContainerItem(newItem);
        } else if (source === 'Contact') {
            if (typeof title === 'object') {
                newItem = title;
                await addContact(newItem);
            }
        } else if (source === 'ImageSlider') {
            newItem = {
                id: `slider_${Date.now()}`,
                title,
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
            const added = await addSliderItem(newItem);
            newItem = added || newItem;
        }

        // 2. Automatically Tag (without auto-publishing)
        if (newItem) {
            const newTagged = [...taggedIds, newItem.id];
            updateSetting('taggedItems', newTagged);
        }
        setShowCreate(false);
    };

    // --- Edit Item Logic ---
    const handleSaveEdit = (item: any) => {
        if (source === 'News') updateNews(item);
        else if (source === 'Event') updateEvent(item);
        else if (source === 'Document') updateDocument(item);
        else if (source === 'Container Items') updateContainerItem(item);
        else if (source === 'Contact') updateContact(item);
        else if (source === 'ImageSlider') updateSliderItem(item);
        setEditingItem(null);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0">
                <TabButton active={activeTab === 'CONTENT'} label="Manage Content" onClick={() => setActiveTab('CONTENT')} />
                <TabButton active={activeTab === 'SETTINGS'} label="Settings" onClick={() => setActiveTab('SETTINGS')} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'CONTENT' && (
                    <div className="p-8 w-full space-y-8">
                        {isValidationFailed && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4" />
                                Minimum {columns} items required for the selected column layout. Please tag more items.
                            </div>
                        )}

                        {/* Section 1: Create */}
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider text-[var(--primary-color)]">1. Create New {source === 'Contact' ? 'Contact' : (source === 'Container Items' ? 'Container Item' : source === 'ImageSlider' ? 'Slider Item' : source)}</h4>
                                <div className="text-gray-400 text-xs italic mt-1">
                                    Create a new item in {source === 'ImageSlider' ? 'Image Slider' : source} and immediately add it to this container.
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setShowCreate(true);
                                    }}
                                    className="bg-[var(--primary-color)] text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center gap-2 hover:opacity-90 shadow-sm transition-transform active:scale-95"
                                >
                                    <Plus className="w-4 h-4" /> Create New {source === 'ImageSlider' ? 'Slider Item' : source}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 h-[600px]">
                            {/* Section 2: Connect Existing */}
                            <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm">
                                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-700 text-sm text-[var(--primary-color)] flex items-center gap-2">
                                        2. Connect Existing {source === 'Contact' ? 'Contact' : (source === 'Container Items' ? 'Container Items' : source === 'ImageSlider' ? 'Slider Items' : source + 's')} <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{availableItems.length}</span>
                                    </h4>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
                                    {availableItems.map((item: any) => (
                                        <div key={item.id} className="bg-white border border-gray-200 p-3 rounded-sm flex gap-3 group hover:shadow-md transition-all items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-sm flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : (source === 'Document' ? getDocIcon(item.type) : <ImageIcon className="w-5 h-5 text-gray-300" />)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate text-gray-800">{getItemTranslation(item, currentLanguage, (source === 'Contacts' || source === 'Contact') ? 'fullName' : 'title')}</div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[8px] px-1 py-0 rounded-sm uppercase font-bold ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{item.status}</span>
                                                    {(item.publishDate || item.date || item.startDate) && (
                                                        <span className="text-[9px] text-gray-400">
                                                            {new Date(item.publishDate || item.date || item.startDate).toLocaleDateString()}
                                                            {item.endDate && item.endDate !== item.startDate && ` - ${new Date(item.endDate).toLocaleDateString()}`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingItem(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button
                                                    onClick={() => handleTag(item.id)}
                                                    className="px-3 py-1 bg-white border border-gray-300 text-gray-500 text-[10px] font-bold uppercase rounded-sm hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] flex items-center gap-1 transition-colors"
                                                >
                                                    Tag <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {availableItems.length === 0 && <div className="text-center p-12 text-gray-400 text-xs">No items available to tag.</div>}
                                </div>
                            </div>

                            {/* Section 3: Already Tagged */}
                            <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm">
                                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-700 text-sm text-[var(--primary-color)] flex items-center gap-2">
                                        3. Already Tagged {source === 'Contact' ? 'Contact' : (source === 'Container Items' ? 'Container Items' : source === 'ImageSlider' ? 'Slider Items' : source + 's')} <span className="bg-[var(--primary-color)] text-white text-xs px-2 py-0.5 rounded-full">{taggedItems.length}</span>
                                    </h4>
                                </div>
                                <div
                                    className="flex-1 overflow-y-auto p-4 bg-gray-50/30"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${source === 'ImageSlider' ? Math.min(columns, 2) : columns}, minmax(0, 1fr))`,
                                        gap: '1rem',
                                        alignContent: 'start'
                                    }}
                                >
                                    {taggedItems.map((item: any, idx: number) => (
                                        <div key={item.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col group hover:shadow-md transition-all h-full min-h-[180px]">
                                            <div className="h-24 bg-gray-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : (source === 'Document' ? getDocIcon(item.type) : <ImageIcon className="w-6 h-6 text-gray-300" />)}
                                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button onClick={() => handleUntag(item.id)} className="bg-white/90 text-red-600 p-1 rounded-sm shadow-sm hover:bg-white"><X className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                            <div className="p-3 flex-1 flex flex-col">
                                                <div className="font-bold text-xs text-gray-800 line-clamp-2 mb-1">{getItemTranslation(item, currentLanguage, (source === 'Contacts' || source === 'Contact') ? 'fullName' : 'title')}</div>
                                                <div className="mt-auto flex justify-between items-center">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-bold ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                                                    <button onClick={() => setEditingItem(item)} className="text-gray-400 hover:text-blue-600"><Pencil className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {taggedItems.length === 0 && <div className="col-span-full text-center p-12 text-gray-400 text-xs">No items tagged yet. Tag items from the left list.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'SETTINGS' && (
                    <div className="p-8 w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm space-y-8">

                            {/* Display Options */}
                            <div>
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">Display Options</h4>
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label><input className="w-full border p-2 text-sm rounded-sm" value={getLocalizedText(data.content.title, currentLanguage)} onChange={(e) => updateContent('title', e.target.value)} /></div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={data.settings.showHeader !== false} onChange={e => updateSetting('showHeader', e.target.checked)} /> Show Header</label>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between mb-1"><label className="text-xs font-bold text-gray-500 uppercase">Subheading</label><label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={data.settings.showSubheading} onChange={e => updateSetting('showSubheading', e.target.checked)} /> Enable</label></div>
                                    {data.settings.showSubheading && <input className="w-full border p-2 text-sm rounded-sm" value={data.settings.subheading || ''} onChange={e => updateSetting('subheading', e.target.value)} />}
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={data.settings.showDescription} onChange={e => updateSetting('showDescription', e.target.checked)} /> Enable</label></div>
                                    {data.settings.showDescription && (
                                        <JoditRichTextEditor
                                            value={data.settings.description || ''}
                                            onChange={(val: string) => updateSetting('description', val)}
                                            height={160}
                                            placeholder="Description..."
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Layout & Behavior */}
                            <div>
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">Layout & Behavior</h4>
                                <VisualSelector label="Content Alignment" value={data.settings.align || 'left'} onChange={(v: any) => updateSetting('align', v)} options={[{ value: 'left', label: 'Left', icon: AlignLeft }, { value: 'center', label: 'Center', icon: AlignCenter }, { value: 'right', label: 'Right', icon: AlignRight }]} />
                                <VisualSelector label="Columns" value={data.settings.columns || 3} onChange={(v: any) => updateSetting('columns', v)} options={[{ value: 1, label: '1 Column', icon: Smartphone }, { value: 2, label: '2 Columns', icon: Tablet }, { value: 3, label: '3 Columns', icon: Monitor }]} />
                                <VisualSelector
                                    label="Ordering Type"
                                    value={data.settings.ordering || '123'}
                                    onChange={(v: any) => updateSetting('ordering', v)}
                                    options={[
                                        { value: '123', label: '123' },
                                        { value: 'III', label: 'I II III' },
                                        { value: 'IIIII', label: 'IIIII', icon: AlignJustify },
                                        { value: 'ABC', label: 'ABC' },
                                        { value: 'abc', label: 'abc' },
                                        { value: 'dots', label: '...', icon: MoreHorizontal },
                                        { value: 'none', label: 'None', icon: X }
                                    ]}
                                />
                                <div className="grid grid-cols-2 gap-8">
                                    <VisualSelector label="Card Border" value={data.settings.border || 'sharp'} onChange={(v: any) => updateSetting('border', v)} options={[{ value: 'sharp', label: 'Sharp', icon: Square }, { value: 'rounded', label: 'Rounded', icon: Square }, { value: 'none', label: 'None', icon: X }]} />
                                    <VisualSelector
                                        label="Image Position"
                                        value={data.settings.imgPos || 'top'}
                                        onChange={(v: any) => updateSetting('imgPos', v)}
                                        options={[
                                            { value: 'top', label: 'Top', icon: AlignCenter },
                                            { value: 'left', label: 'Left', icon: AlignLeft },
                                            { value: 'right', label: 'Right', icon: AlignRight },
                                            { value: 'none', label: 'None', icon: X }
                                        ]}
                                    />
                                </div>
                                <VisualSelector label="Image Border Section" value={data.settings.imgBorder || 'sharp'} onChange={(v: any) => updateSetting('imgBorder', v)} options={[{ value: 'sharp', label: 'Sharp Corners', icon: Square }, { value: 'rounded', label: 'Rounded Corners', icon: Square }, { value: 'circle', label: 'Circle', icon: Circle }]} />
                                <VisualSelector label="Card Layout" value={data.settings.layout || 'grid'} onChange={(v: any) => updateSetting('layout', v)} options={[{ value: 'grid', label: 'Grid', icon: LayoutGrid }, { value: 'slider', label: 'Slider', icon: ListIcon }]} />

                                {data.settings.layout === 'slider' && (
                                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Slider Settings</label>
                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => updateSetting('autoplay', !data.settings.autoplay)}>
                                                <span className="text-xs">Autoplay</span>
                                                <div className={`w-8 h-4 rounded-full relative transition-colors ${data.settings.autoplay ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}>
                                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${data.settings.autoplay ? 'left-4.5' : 'left-0.5'}`} style={{ left: data.settings.autoplay ? '18px' : '2px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-500">Speed</span>
                                            <input type="range" min="2" max="10" step="1" value={data.settings.speed || 5} onChange={(e) => updateSetting('speed', parseFloat(e.target.value))} className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]" />
                                            <span className="text-xs font-mono w-8 text-right">{data.settings.speed || 5}s</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Identity */}
                            <div>
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">Container Identity</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Container Title (Internal)</label>
                                        <input className="w-full border p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Latest News Grid" />
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Source</label><input className="w-full border p-2 text-sm bg-gray-100 text-gray-600 rounded-sm" value={data.settings.source} readOnly /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unique Container ID</label><div className="flex gap-2"><input className="flex-1 border p-2 text-sm bg-gray-100 text-gray-600 rounded-sm" value={data.id} readOnly /><button className="px-3 py-2 border text-xs font-bold bg-white hover:bg-gray-50 rounded-sm">Generate</button></div></div>
                                </div>
                            </div>

                            {/* Added to Pages */}
                            <div>
                                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 text-xs uppercase tracking-wider">Added to Pages</h4>
                                <div className="border border-gray-200 p-3 rounded-sm bg-gray-50 text-sm text-gray-500 italic">
                                    Read-only list of pages would appear here.
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Create Modals */}
            {showCreate && source === 'News' && <CreateNewsModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {showCreate && source === 'Event' && <CreateEventModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {showCreate && source === 'Document' && <AddDocumentModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {showCreate && source === 'Container Items' && <CreateContainerItemModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {showCreate && source === 'Contact' && <CreateContactModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {showCreate && source === 'ImageSlider' && <CreateSliderItemModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}

            {/* Edit Modals (non-ImageSlider) */}
            {editingItem && source === 'News' && <NewsEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {editingItem && source === 'Event' && <EventEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {editingItem && source === 'Document' && <DocumentEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {editingItem && source === 'Container Items' && <ContainerItemEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {editingItem && source === 'Contact' && <ContactEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {editingItem && source === 'ImageSlider' && <SliderItemEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}

            {deleteId && (
                <ConfirmDeleteDialog
                    title={`Delete ${source === 'ImageSlider' ? 'Slider Item' : source}`}
                    message={`Are you sure you want to delete this ${source === 'ImageSlider' ? 'slider item' : source.toLowerCase()}? This action cannot be undone.`}
                    onConfirm={() => {
                        if (source === 'News') deleteNews(deleteId);
                        else if (source === 'Event') deleteEvent(deleteId);
                        else if (source === 'Document') deleteDocument(deleteId);
                        else if (source === 'Container Items') deleteContainerItem(deleteId);
                        else if (source === 'Contact') deleteContact(deleteId);
                        else if (source === 'ImageSlider') deleteSliderItem(deleteId);
                        setDeleteId(null);
                        setEditingItem(null);
                    }}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
};

const ContactFormEditor = ({ data, setData, onClose }: { data: Container, setData: (d: Container) => void, onClose?: () => void }) => {
    // ... [Previous ContactFormEditor code remains unchanged]
    const [activeTab, setActiveTab] = useState<'TEXT' | 'PREVIEW' | 'TRANSLATION'>('TEXT');
    const { currentLanguage } = useStore();

    const updateSetting = (key: string, val: any) => setData({ ...data, settings: { ...data.settings, [key]: val } });

    const updateTranslationContent = (key: string, val: string) => {
        const newContent = { ...data.content };
        if (!newContent[key]) newContent[key] = {};
        newContent[key] = { ...(newContent[key] as any), [currentLanguage]: val };

        const newSettings = { ...data.settings };
        if (['heading', 'subheading', 'description', 'buttonText'].includes(key)) {
            newSettings[key] = val;
        }
        else if (key.startsWith('field_')) {
            const match = key.match(/field_(.+)_([a-z]+)/);
            if (match) {
                const fId = match[1];
                const fType = match[2];
                if (newSettings.fields) {
                    newSettings.fields = newSettings.fields.map((f: any) => {
                        if (f.id === fId) return { ...f, [fType]: val };
                        return f;
                    });
                }
            }
        }

        setData({
            ...data,
            content: newContent,
            settings: newSettings
        });
    };

    const fields = data.settings.fields || [];

    const updateField = (id: string, updates: any) => {
        const newFields = fields.map((f: any) => f.id === id ? { ...f, ...updates } : f);
        updateSetting('fields', newFields);
    };

    const addField = () => {
        const newField = { id: `f_${Date.now()}`, label: 'New Field', type: 'text', placeholder: '', required: false };
        updateSetting('fields', [...fields, newField]);
    };

    const removeField = (id: string) => {
        updateSetting('fields', fields.filter((f: any) => f.id !== id));
    };

    const moveField = (idx: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === fields.length - 1)) return;
        const newFields = [...fields];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        [newFields[idx], newFields[swapIdx]] = [newFields[swapIdx], newFields[idx]];
        updateSetting('fields', newFields);
    };

    const getTranslationFields = () => {
        const baseFields = [
            { key: 'heading', label: 'Form Heading', type: 'input' },
            { key: 'subheading', label: 'Form Subheading', type: 'input' },
            { key: 'description', label: 'Description', type: 'rich' },
            { key: 'buttonText', label: 'Button Text', type: 'input' }
        ];

        const dynamicFields = fields.map((f: any) => ([
            { key: `field_${f.id}_label`, label: `Label: ${f.label}`, type: 'input' },
            { key: `field_${f.id}_placeholder`, label: `Placeholder: ${f.label}`, type: 'input' }
        ])).flat();

        return [...baseFields, ...dynamicFields];
    };

    const PreviewForm = () => (
        <div
            className="p-10 w-full max-w-xl shadow-2xl border border-gray-200 rounded-sm mx-auto relative flex flex-col gap-6 bg-white"
            style={{
                backgroundColor: data.settings.bgType === 'color' ? data.settings.bgColor : 'white',
                backgroundImage: data.settings.bgType === 'image' && data.settings.bgImage ? `url(${data.settings.bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px'
            }}
        >
            {data.settings.bgType === 'image' && <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-0 rounded-sm"></div>}

            <div className={`relative z-10 text-${data.settings.alignment || 'center'}`}>
                {data.settings.heading && <h2 className="text-3xl font-bold text-[var(--primary-color)] mb-2 break-words leading-tight">{data.settings.heading}</h2>}
                {data.settings.subheading && <p className="text-gray-500 text-sm font-medium">{data.settings.subheading}</p>}
                {data.settings.description && <div className="text-gray-400 text-xs mt-2" dangerouslySetInnerHTML={{ __html: data.settings.description }} />}
            </div>

            <div className="relative z-10 space-y-4">
                {fields.map((f: any) => (
                    <div key={f.id}>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        {f.type === 'textarea' ? (
                            <textarea className="w-full border border-gray-300 p-2 text-sm bg-white rounded-sm resize-none h-20" placeholder={f.placeholder} disabled />
                        ) : (
                            <input className="w-full border border-gray-300 p-2 text-sm bg-white rounded-sm" placeholder={f.placeholder} disabled />
                        )}
                    </div>
                ))}

                <div className="flex items-start gap-2 mt-4">
                    <div className="w-4 h-4 border border-gray-300 bg-white mt-0.5 rounded-sm"></div>
                    <span className="text-xs text-gray-500 leading-tight">I have read the Privacy Policy note.</span>
                </div>

                <button className="w-full bg-[var(--primary-color)] text-white py-3 font-bold text-sm shadow-md opacity-80 cursor-not-allowed uppercase tracking-wider rounded-sm mt-4">
                    {data.settings.buttonText || 'Send Message'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex border-b border-gray-200 px-6 bg-gray-50">
                <TabButton active={activeTab === 'TEXT'} label="Form Builder" onClick={() => setActiveTab('TEXT')} />
                <TabButton active={activeTab === 'PREVIEW'} label="Live Preview" onClick={() => setActiveTab('PREVIEW')} />
                <TabButton active={activeTab === 'TRANSLATION'} label="Translation" onClick={() => setActiveTab('TRANSLATION')} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'TEXT' && (
                    <div className="p-8 bg-gray-50 w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Heading Section */}
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <h4 className="font-bold text-gray-700 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Title & Identity</h4>
                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Container Title (Internal)</label><input className="w-full border p-2 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Careers Contact Form" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label><input className="w-full border p-2 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.heading || ''} onChange={(e) => updateSetting('heading', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subheading</label><input className="w-full border p-2 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.subheading || ''} onChange={(e) => updateSetting('subheading', e.target.value)} /></div>
                                <VisualSelector label="Alignment" value={data.settings.alignment || 'center'} onChange={(v: any) => updateSetting('alignment', v)} options={[{ value: 'center', label: 'Center', icon: AlignCenter }, { value: 'left', label: 'Left', icon: AlignLeft }]} />
                            </div>
                            <div className="mb-0">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <JoditRichTextEditor
                                    value={data.settings.description || ''}
                                    onChange={(val: string) => updateSetting('description', val)}
                                    height={160}
                                    placeholder="Description..."
                                />
                            </div>
                        </div>

                        {/* Background Section */}
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <h4 className="font-bold text-gray-700 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Background</h4>
                            <div className="flex gap-4 mb-4">
                                <VisualOption label="None" icon={X} active={data.settings.bgType === 'none'} onClick={() => updateSetting('bgType', 'none')} />
                                <VisualOption label="Color" icon={Palette} active={data.settings.bgType === 'color'} onClick={() => updateSetting('bgType', 'color')} />
                                <VisualOption label="Image" icon={ImageIcon} active={data.settings.bgType === 'image'} onClick={() => updateSetting('bgType', 'image')} />
                            </div>
                            {data.settings.bgType === 'color' && <ColorPicker value={data.settings.bgColor || '#ffffff'} onChange={(v) => updateSetting('bgColor', v)} />}
                            {data.settings.bgType === 'image' && <ImagePicker value={data.settings.bgImage || ''} onChange={(v) => updateSetting('bgImage', v)} />}
                        </div>

                        {/* Fields */}
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <h4 className="font-bold text-gray-700 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Input Fields</h4>
                            <div className="space-y-2">
                                {fields.map((field: any, idx: number) => (
                                    <div key={field.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-sm bg-gray-50 group">
                                        <div className="flex flex-col gap-1 text-gray-300 hover:text-gray-500">
                                            <ArrowUp className="w-3 h-3 cursor-pointer" onClick={() => moveField(idx, 'up')} />
                                            <ArrowDown className="w-3 h-3 cursor-pointer" onClick={() => moveField(idx, 'down')} />
                                        </div>
                                        <div className="flex-1 grid grid-cols-3 gap-2">
                                            <input className="border p-1.5 text-xs rounded-sm" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} placeholder="Label" />
                                            <input className="border p-1.5 text-xs rounded-sm" value={field.placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })} placeholder="Placeholder" />
                                            <select className="border p-1.5 text-xs rounded-sm bg-white" value={field.type} onChange={e => updateField(field.id, { type: e.target.value })}>
                                                <option value="text">Text</option><option value="email">Email</option><option value="textarea">Long Text</option><option value="number">Number</option><option value="checkbox">Checkbox</option><option value="select">Dropdown</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                                            <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} title="Required" />
                                            <button onClick={() => removeField(field.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addField} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-400 text-xs font-bold hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] flex items-center justify-center gap-2 mt-2">
                                    <Plus className="w-3 h-3" /> Add Field
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Button Text</label>
                            <input className="w-full border p-2 text-sm rounded-sm" value={data.settings.buttonText || ''} onChange={(e) => updateSetting('buttonText', e.target.value)} />
                        </div>
                    </div>
                )}

                {activeTab === 'PREVIEW' && (
                    <div className="flex justify-center p-8 bg-gray-50 min-h-full">
                        <PreviewForm />
                    </div>
                )}

                {activeTab === 'TRANSLATION' && (
                    <TranslationTab
                        data={data}
                        onUpdate={updateTranslationContent}
                        fields={getTranslationFields()}
                    />
                )}
            </div>
        </div>
    );
};

// --- 4. TABLE EDITOR ---
const TableEditor = ({ data, setData, onClose }: { data: Container, setData: (d: Container) => void, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'SETTINGS' | 'TRANSLATION'>('CONTENT');
    const { currentLanguage } = useStore();

    const updateSetting = (key: string, val: any) => setData({ ...data, settings: { ...data.settings, [key]: val } });

    const updateContent = (key: string, val: any) => {
        setData({
            ...data,
            content: { ...data.content, [key]: val }
        });
    };

    const updateTranslationContent = (key: string, val: string) => {
        // Handle Translation logic for Table Title
        const newContent = { ...data.content };
        if (!newContent['title']) newContent['title'] = { en: '', de: '', fr: '', es: '' };
        newContent['title'] = { ...(newContent['title'] as any), [currentLanguage]: val };
        setData({ ...data, content: newContent });
    };

    // Columns
    const columns = data.settings.columns || [];
    const rows = data.content.rows || [];

    const addColumn = () => {
        const newCol = { id: `col_${Date.now()}`, header: 'New Column' };
        updateSetting('columns', [...columns, newCol]);
    };

    const updateColumn = (id: string, header: string) => {
        updateSetting('columns', columns.map((c: any) => c.id === id ? { ...c, header } : c));
    };

    const removeColumn = (id: string) => {
        updateSetting('columns', columns.filter((c: any) => c.id !== id));
        // Cleanup data if needed? For now we keep rows intact to prevent accidental data loss.
    };

    // Rows
    const addRow = () => {
        const newRow: any = { id: `row_${Date.now()}` };
        columns.forEach((c: any) => newRow[c.id] = '');
        updateContent('rows', [...rows, newRow]);
    };

    const updateRow = (id: string, colId: string, val: string) => {
        const newRows = rows.map((r: any) => r.id === id ? { ...r, [colId]: val } : r);
        updateContent('rows', newRows);
    };

    const removeRow = (id: string) => {
        updateContent('rows', rows.filter((r: any) => r.id !== id));
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex border-b border-gray-200 px-6 bg-gray-50">
                <TabButton active={activeTab === 'CONTENT'} label="Content & Data" onClick={() => setActiveTab('CONTENT')} />
                <TabButton active={activeTab === 'SETTINGS'} label="Table Settings" onClick={() => setActiveTab('SETTINGS')} />
                <TabButton active={activeTab === 'TRANSLATION'} label="Translation" onClick={() => setActiveTab('TRANSLATION')} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'CONTENT' && (
                    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
                        {/* Columns Manager */}
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Manage Columns</h4>
                                <button onClick={addColumn} className="text-xs font-bold text-[var(--primary-color)] hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Column</button>
                            </div>
                            <div className="space-y-2">
                                {columns.map((col: any, idx: number) => (
                                    <div key={col.id} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 font-mono w-6 text-center">{idx + 1}</span>
                                        <input
                                            className="flex-1 border p-2 text-sm rounded-sm"
                                            value={col.header}
                                            onChange={(e) => updateColumn(col.id, e.target.value)}
                                            placeholder="Column Header Name"
                                        />
                                        <button onClick={() => removeColumn(col.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {columns.length === 0 && <div className="text-sm text-gray-400 text-center p-4 border border-dashed border-gray-300 rounded-sm">No columns defined.</div>}
                            </div>
                        </div>

                        {/* Data Manager */}
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Manage Rows</h4>
                                <button onClick={addRow} className="bg-[var(--primary-color)] text-white px-3 py-1.5 text-xs font-bold rounded-sm hover:opacity-90 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Row</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            {columns.map((col: any) => <th key={col.id} className="border p-2 text-left font-bold text-gray-600">{col.header}</th>)}
                                            <th className="border p-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row: any) => (
                                            <tr key={row.id}>
                                                {columns.map((col: any) => (
                                                    <td key={col.id} className="border p-1">
                                                        <input className="w-full p-1 outline-none" value={row[col.id] || ''} onChange={e => updateRow(row.id, col.id, e.target.value)} />
                                                    </td>
                                                ))}
                                                <td className="border p-1 text-center">
                                                    <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="p-4 text-center text-gray-400">No data rows added.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'SETTINGS' && (
                    <div className="p-8 bg-gray-50 min-h-full">
                        <div className="mx-auto bg-white p-8 border border-gray-200 shadow-sm rounded-sm space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Container Title (Internal)</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Project Phases Table" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Title</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.title} onChange={(e) => updateSetting('title', e.target.value)} placeholder="Enter Table Title" />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Table Features</h5>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={data.settings.enableGlobalSearch} onChange={e => updateSetting('enableGlobalSearch', e.target.checked)} />
                                        <span className="text-sm font-medium text-gray-700">Enable Global Search</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={data.settings.enableColumnSearch} onChange={e => updateSetting('enableColumnSearch', e.target.checked)} />
                                        <span className="text-sm font-medium text-gray-700">Enable Column Search</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={data.settings.enableSorting} onChange={e => updateSetting('enableSorting', e.target.checked)} />
                                        <span className="text-sm font-medium text-gray-700">Enable Sorting Icons</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'TRANSLATION' && (
                    <TranslationTab
                        data={data}
                        onUpdate={updateTranslationContent}
                        fields={[{ key: 'title', label: 'Table Title', type: 'input' }]}
                    />
                )}
            </div>
        </div>
    );
};

// --- 5. MAP EDITOR ---
const MapEditor = ({ data, setData, onClose }: { data: Container, setData: (d: Container) => void, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'SETTINGS' | 'TRANSLATION'>('SETTINGS');
    const { currentLanguage } = useStore();

    const updateSetting = (key: string, val: any) => setData({ ...data, settings: { ...data.settings, [key]: val } });

    const updateTranslationContent = (key: string, val: string) => {
        const newContent = { ...data.content };
        if (!newContent['title']) newContent['title'] = { en: '', de: '', fr: '', es: '' };
        newContent['title'] = { ...(newContent['title'] as any), [currentLanguage]: val };
        setData({ ...data, content: newContent });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex border-b border-gray-200 px-6 bg-gray-50">
                <TabButton active={activeTab === 'SETTINGS'} label="Map Settings" onClick={() => setActiveTab('SETTINGS')} />
                <TabButton active={activeTab === 'TRANSLATION'} label="Translation" onClick={() => setActiveTab('TRANSLATION')} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'SETTINGS' && (
                    <div className="p-8 bg-gray-50 min-h-full">
                        <div className="mx-auto bg-white p-8 border border-gray-200 shadow-sm rounded-sm space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Container Title (Internal)</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Office Locations Map" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Title</label>
                                    <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.title} onChange={(e) => updateSetting('title', e.target.value)} placeholder="Enter Map Title" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Map Type</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.mapType} onChange={(e) => updateSetting('mapType', e.target.value)}>
                                        <option value="World">World Map</option>
                                        <option value="Continent">Continent Map</option>
                                        <option value="Country">Country Map</option>
                                    </select>
                                </div>
                            </div>

                            {data.settings.mapType === 'Continent' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Continent</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm" value={data.settings.selectedRegion} onChange={e => updateSetting('selectedRegion', e.target.value)}>
                                        <option value="">-- Select --</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Asia">Asia</option>
                                        <option value="North America">North America</option>
                                        <option value="South America">South America</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Oceania">Oceania</option>
                                    </select>
                                </div>
                            )}

                            {data.settings.mapType === 'Country' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Country</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm" value={data.settings.selectedRegion} onChange={e => updateSetting('selectedRegion', e.target.value)}>
                                        <option value="">-- Select --</option>
                                        <option value="USA">United States</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="India">India</option>
                                        <option value="China">China</option>
                                    </select>
                                </div>
                            )}

                            {data.settings.mapType === 'Country' && data.settings.selectedRegion === 'India' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select State</label>
                                    <select className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.selectedState} onChange={e => updateSetting('selectedState', e.target.value)}>
                                        <option value="">-- Select State --</option>
                                        <option value="IN-AN">Andaman and Nicobar Islands</option>
                                        <option value="IN-AP">Andhra Pradesh</option>
                                        <option value="IN-AR">Arunachal Pradesh</option>
                                        <option value="IN-AS">Assam</option>
                                        <option value="IN-BR">Bihar</option>
                                        <option value="IN-CH">Chandigarh</option>
                                        <option value="IN-CT">Chhattisgarh</option>
                                        <option value="IN-DN">Dadra and Nagar Haveli</option>
                                        <option value="IN-DD">Daman and Diu</option>
                                        <option value="IN-DL">Delhi</option>
                                        <option value="IN-GA">Goa</option>
                                        <option value="IN-GJ">Gujarat</option>
                                        <option value="IN-HR">Haryana</option>
                                        <option value="IN-HP">Himachal Pradesh</option>
                                        <option value="IN-JK">Jammu and Kashmir</option>
                                        <option value="IN-JH">Jharkhand</option>
                                        <option value="IN-KA">Karnataka</option>
                                        <option value="IN-KL">Kerala</option>
                                        <option value="IN-LA">Ladakh</option>
                                        <option value="IN-LD">Lakshadweep</option>
                                        <option value="IN-MP">Madhya Pradesh</option>
                                        <option value="IN-MH">Maharashtra</option>
                                        <option value="IN-MN">Manipur</option>
                                        <option value="IN-ML">Meghalaya</option>
                                        <option value="IN-MZ">Mizoram</option>
                                        <option value="IN-NL">Nagaland</option>
                                        <option value="IN-OR">Odisha</option>
                                        <option value="IN-PY">Puducherry</option>
                                        <option value="IN-PB">Punjab</option>
                                        <option value="IN-RJ">Rajasthan</option>
                                        <option value="IN-SK">Sikkim</option>
                                        <option value="IN-TN">Tamil Nadu</option>
                                        <option value="IN-TG">Telangana</option>
                                        <option value="IN-TR">Tripura</option>
                                        <option value="IN-UP">Uttar Pradesh</option>
                                        <option value="IN-UT">Uttarakhand</option>
                                        <option value="IN-WB">West Bengal</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Initial Location Search</label>
                                <div className="relative">
                                    <input className="w-full border border-gray-300 p-2.5 pl-9 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={data.settings.locationSearch} onChange={e => updateSetting('locationSearch', e.target.value)} placeholder="City, Place, etc." />
                                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'TRANSLATION' && (
                    <TranslationTab
                        data={data}
                        onUpdate={updateTranslationContent}
                        fields={[{ key: 'title', label: 'Map Title', type: 'input' }]}
                    />
                )}
            </div>
        </div>
    );
};

// ... (ContainerEditorModal export and its content remains the same)
export const ContainerEditorModal = ({ onClose }: { onClose: () => void }) => {
    const { editingContainerId, pages, updateContainer, deleteContainer } = useStore();

    // 1. Find Container
    const containerData = useMemo(() => {
        if (!editingContainerId) return null;
        for (const page of pages) {
            const container = page.containers.find(c => c.id === editingContainerId);
            if (container) return { container, pageId: page.id };
        }
        return null;
    }, [editingContainerId, pages]);

    const [localContainer, setLocalContainer] = useState<Container | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (containerData) {
            setLocalContainer(JSON.parse(JSON.stringify(containerData.container)));
        }
    }, [containerData]);

    if (!containerData || !localContainer) return null;

    const handleSave = () => {
        updateContainer(containerData.pageId, localContainer);
        onClose();
    };

    const handleDeleteContainer = async () => {
        if (!containerData) return;
        await deleteContainer(containerData.pageId, containerData.container.id);
        onClose();
    };

    // Determine Title based on type
    const getTitle = () => {
        switch (localContainer.type) {
            case ContainerType.HERO: return "Header / Hero Editor";
            case ContainerType.SLIDER: return "Slider Manager";
            case ContainerType.CARD_GRID: return "Data Grid Editor";
            case ContainerType.CONTACT_FORM: return "Contact Form Editor";
            case ContainerType.TABLE: return "Table View Editor";
            case ContainerType.MAP: return "Map Editor";
            default: return "Container Editor";
        }
    };

    // Render Content
    const renderEditor = () => {
        switch (localContainer.type) {
            case ContainerType.HERO:
                return <HeroEditor data={localContainer} setData={setLocalContainer} onClose={onClose} />;
            case ContainerType.SLIDER:
                return <DataGridEditor data={localContainer} setData={setLocalContainer} onClose={onClose} />;
            case ContainerType.CARD_GRID:
                return <DataGridEditor data={localContainer} setData={setLocalContainer} onClose={onClose} />;
            case ContainerType.CONTACT_FORM:
                return <ContactFormEditor data={localContainer} setData={setLocalContainer} onClose={onClose} />;
            case ContainerType.TABLE:
                return <TableEditor data={localContainer} setData={setLocalContainer} onClose={onClose} />;
            case ContainerType.MAP:
                return <MapEditor data={localContainer} setData={setLocalContainer} onClose={onClose} />;
            default:
                return <div className="p-8 text-center text-gray-500">Editor not available for this container type.</div>;
        }
    };

    return (
        <GenericModal
            title={getTitle()}
            onClose={onClose}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
            customFooter={(
                <div className="flex justify-between items-center w-full">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" /> Delete Container
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-8 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-md hover:opacity-90 rounded-sm flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
                    </div>
                </div>
            )}
        >
            <div className="h-[75vh] flex flex-col bg-white">
                {renderEditor()}
            </div>

            {showDeleteConfirm && (
                <ConfirmDeleteDialog
                    title="Delete Container"
                    message="Are you sure you want to remove this container from the page? This action cannot be undone."
                    onConfirm={handleDeleteContainer}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </GenericModal>
    );
};
