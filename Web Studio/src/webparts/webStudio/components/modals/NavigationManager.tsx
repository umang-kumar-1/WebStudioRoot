import React, { useState, useEffect } from 'react';
import { useStore, getLocalizedText, getTranslation } from '../../store';
import { NavItem, Page } from '../../types';
import { GenericModal, HelpGuideModal } from './SharedModals';
import { SharePointMetadataFooter } from '../common/SharePointMetadataFooter';
import { Monitor, List as ListIcon, HelpCircle, Menu, Plus, GripVertical, EyeOff, Pencil, Trash2, X, Search, Printer, Check, ImageIcon, ChevronRight, ChevronDown, AlertTriangle, FileText, Globe, Upload } from 'lucide-react';

// --- Helper: Get localized nav item title ---
const getNavItemTitle = (item: NavItem, lang: string): string => {
    if (lang && lang !== 'en' && item.translations && item.translations[lang]) {
        return item.translations[lang];
    }
    return item.title;
};

// --- Sub-Modals for Navigation ---
const NavDeleteConfirmation = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-[400px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
            <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Item</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Are you sure you want to delete this navigation item? This action will also remove all sub-items and cannot be undone.</p>
            </div>
            <div className="flex border-t border-gray-200 bg-gray-50">
                <button onClick={onCancel} className="flex-1 py-3 text-sm font-medium text-gray-700 hover:bg-white transition-colors border-r border-gray-200">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">Delete</button>
            </div>
        </div>
    </div>
);

const SmartPageSelector = ({ onClose, onSelect }: { onClose: () => void, onSelect: (pageId: string, pageName: string) => void }) => {
    const { pages, currentLanguage } = useStore();

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[900px] h-[600px] flex flex-col shadow-2xl rounded-sm border border-gray-300 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <h3 className="font-bold text-[var(--primary-color)] text-lg">Select SmartPage</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">Showing {pages.length} pages</span>
                        <div className="flex items-center bg-white border border-gray-300 px-3 py-1.5 w-64 rounded-sm">
                            <input type="text" placeholder="Search pages..." className="flex-1 outline-none text-sm" />
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-sm text-gray-500"><Printer className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex border-b border-gray-200 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <div className="w-12 p-3 text-center border-r border-gray-200">#</div>
                    <div className="flex-1 p-3 border-r border-gray-200">Page Title</div>
                    <div className="flex-[2] p-3">URL Structure</div>
                </div>
                <div className="flex-1 overflow-y-auto bg-white">
                    {pages.map((page, idx) => (
                        <div key={page.id} className={`flex border-b border-gray-100 hover:bg-[var(--brand-light)] cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                            onClick={() => onSelect(page.id, getLocalizedText(page.title, currentLanguage))}>
                            <div className="w-12 p-3 flex justify-center items-center border-r border-gray-100 text-gray-400">
                                {idx + 1}
                            </div>
                            <div className="flex-1 p-3 border-r border-gray-100 text-sm font-medium text-gray-800 flex items-center">
                                {getLocalizedText(page.title, currentLanguage)}
                            </div>
                            <div className="flex-[2] p-3 text-xs text-gray-500 font-mono truncate flex items-center">
                                .../SitePages/{getLocalizedText(page.title, 'en').replace(/\s/g, '-')}.aspx
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-50 rounded-sm transition-colors">Cancel</button>
                    <button onClick={onClose} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold hover:opacity-90 rounded-sm shadow-sm transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

const ParentSelector = ({ onClose, onSelect, currentParentId }: { onClose: () => void, onSelect: (id: string, title: string) => void, currentParentId: string }) => {
    const { siteConfig } = useStore();
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[500px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <h3 className="font-bold text-[var(--primary-color)] text-lg">Select Parent Item</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto max-h-[400px]">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-2">Navigation Structure</div>
                    <div className="border border-gray-200 rounded-sm overflow-hidden">
                        <div onClick={() => onSelect('root', 'Root')} className={`px-4 py-3 cursor-pointer text-sm flex items-center gap-3 border-b border-gray-100 transition-colors ${currentParentId === 'root' ? 'bg-[var(--brand-light)] text-[var(--primary-color)] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}>
                            <div className={`w-4 h-4 flex items-center justify-center rounded-full border ${currentParentId === 'root' ? 'border-[var(--primary-color)] bg-[var(--primary-color)]' : 'border-gray-400'}`}>
                                {currentParentId === 'root' && <Check className="w-3 h-3 text-white" />}
                            </div>
                            Root Level
                        </div>
                        {siteConfig.navigation.map(nav => (
                            <div key={nav.id} onClick={() => onSelect(nav.id, nav.title)} className={`px-4 py-3 cursor-pointer text-sm flex items-center gap-3 border-b border-gray-100 last:border-0 pl-8 transition-colors ${currentParentId === nav.id ? 'bg-[var(--brand-light)] text-[var(--primary-color)] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}>
                                <div className={`w-4 h-4 flex items-center justify-center rounded-full border ${currentParentId === nav.id ? 'border-[var(--primary-color)] bg-[var(--primary-color)]' : 'border-gray-400'}`}>
                                    {currentParentId === nav.id && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {nav.title}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-50 rounded-sm transition-colors">Cancel</button>
                    <button onClick={onClose} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold rounded-sm shadow-sm hover:opacity-90 transition-colors">Select</button>
                </div>
            </div>
        </div>
    );
};

interface NavItemEditorProps {
    item: Partial<NavItem>;
    isNew: boolean;
    onSave: (item: Partial<NavItem>) => void;
    onCancel: () => void;
    forcedParentId?: string;
}

const NavItemEditor = ({ item, isNew, onSave, onCancel, forcedParentId }: NavItemEditorProps) => {
    const { siteConfig, pages, currentLanguage, deleteNavItem } = useStore();
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'TRANSLATIONS'>('GENERAL');
    const [formData, setFormData] = useState<Partial<NavItem>>({
        id: `new_${Date.now()}`,
        parentId: forcedParentId || 'root',
        title: '',
        type: 'Page', // Force default to Page
        isVisible: true,
        openInNewTab: false,
        status: 'Published', // Default status
        ...item
    });
    const [showParentSelector, setShowParentSelector] = useState(false);
    const [showPageSelector, setShowPageSelector] = useState(false);
    const [parentName, setParentName] = useState('Root');
    const [linkedPageName, setLinkedPageName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (formData.parentId === 'root') setParentName('Root');
        else {
            const parent = siteConfig.navigation.find(n => n.id === formData.parentId);
            if (parent) setParentName(parent.title);
        }
        if (formData.pageId) {
            const page = pages.find(p => p.id === formData.pageId);
            if (page) setLinkedPageName(getLocalizedText(page.title, currentLanguage));
        }
    }, [formData.parentId, formData.pageId, siteConfig.navigation, pages, currentLanguage]);

    const handleDelete = () => { if (formData.id) deleteNavItem(formData.id); onCancel(); };

    // Validation Logic
    const canSave = formData.title &&
        ((formData.type === 'Page' && formData.pageId) ||
            (formData.type === 'External' && formData.url));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[800px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">
                        {isNew ? 'Add Navigation Item' : `Edit Item: ${item.title}`}
                    </h3>
                    <div className="flex items-center gap-2">
                        <Menu className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    {[
                        { id: 'GENERAL', label: getTranslation('TAB_BASIC_INFO', currentLanguage) || 'General' },
                        { id: 'TRANSLATIONS', label: getTranslation('TAB_TRANSLATION', currentLanguage) || 'Translations' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? 'border-b-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-gray-50/50">

                    {/* GENERAL TAB */}
                    {activeTab === 'GENERAL' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent Item</label>
                                <div className="flex gap-0">
                                    <input type="text" readOnly value={parentName} className="flex-1 px-3 py-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-l-sm focus:outline-none" />
                                    <button onClick={() => setShowParentSelector(true)} className="px-4 py-2 bg-[var(--primary-color)] text-white hover:opacity-90 rounded-r-sm transition-colors border-l border-white/20"><Pencil className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Visibility Status</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-sm shadow-sm hover:border-[var(--primary-color)] transition-colors flex-1">
                                            <input type="radio" checked={formData.isVisible} onChange={() => setFormData({ ...formData, isVisible: true })} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                            <span className="font-medium">Visible</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-sm shadow-sm hover:border-[var(--primary-color)] transition-colors flex-1">
                                            <input type="radio" checked={!formData.isVisible} onChange={() => setFormData({ ...formData, isVisible: false })} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                            <span className="font-medium">Hidden</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Publish Status</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-sm shadow-sm hover:border-[var(--primary-color)] transition-colors flex-1">
                                            <input type="radio" checked={formData.status === 'Published'} onChange={() => setFormData({ ...formData, status: 'Published' })} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                            <span className="font-medium">Published</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-sm shadow-sm hover:border-[var(--primary-color)] transition-colors flex-1">
                                            <input type="radio" checked={formData.status === 'Draft'} onChange={() => setFormData({ ...formData, status: 'Draft' })} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                            <span className="font-medium">Draft</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Interaction</label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer bg-white px-3 py-2 border border-gray-200 rounded-sm shadow-sm hover:border-[var(--primary-color)] transition-colors">
                                        <input type="checkbox" checked={formData.openInNewTab} onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })} className="rounded-sm text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <span className="font-medium">Open link in new tab</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Navigation Title <span className="text-red-500">*</span> <span className="text-[10px] text-gray-400 normal-case font-normal ml-1">(English / Default)</span></label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none bg-white shadow-sm" placeholder="Enter English title here" />
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Link Destination</label>

                                <div className="flex flex-col gap-3 mb-4">
                                    {/* Internal SmartPage Option */}
                                    <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${formData.type === 'Page' ? 'border-[var(--primary-color)] bg-blue-50 ring-1 ring-[var(--primary-color)]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                        <input type="radio" name="linkType" checked={formData.type === 'Page'} onChange={() => setFormData({ ...formData, type: 'Page' })} className="mt-1 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                        <div>
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                <FileText className="w-4 h-4 text-[var(--primary-color)]" /> Internal SmartPage (Editable)
                                            </span>
                                            <span className="block text-xs text-gray-500 mt-1">Connect to an editable CMS page (Home, About, Services). Supports layout builder, versioning & publishing.</span>
                                        </div>
                                    </label>

                                    {/* External Link Option */}
                                    <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${formData.type === 'External' ? 'border-orange-300 bg-orange-50 ring-1 ring-orange-300' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                        <input type="radio" name="linkType" checked={formData.type === 'External'} onChange={() => setFormData({ ...formData, type: 'External' })} className="mt-1 text-orange-500 focus:ring-orange-500" />
                                        <div>
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                <Globe className="w-4 h-4 text-orange-500" /> External Link (Not Editable)
                                            </span>
                                            <span className="block text-xs text-gray-600 mt-1">
                                                For 3rd party sites (Google, Partners), PDFs, or mailto links only.
                                                <br />
                                                <strong className="text-orange-700 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> Do NOT use for internal website pages.</strong>
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                {formData.type === 'Page' ? (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Selected SmartPage <span className="text-red-500">*</span></label>
                                        <div className="flex gap-0 relative">
                                            <input
                                                type="text"
                                                readOnly
                                                value={linkedPageName}
                                                placeholder="No SmartPage mapped"
                                                className={`flex-1 px-3 py-2 border text-sm rounded-l-sm focus:outline-none ${!formData.pageId ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-300 bg-white text-gray-700'}`}
                                            />
                                            {linkedPageName && (
                                                <button onClick={() => { setLinkedPageName(''); setFormData({ ...formData, pageId: undefined }) }} className="absolute right-12 top-2 text-gray-400 hover:text-red-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => setShowPageSelector(true)} className="px-4 py-2 bg-white border border-l-0 border-gray-300 text-gray-600 hover:text-[var(--primary-color)] hover:bg-gray-50 rounded-r-sm transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {!formData.pageId && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> A SmartPage must be selected to save.</p>}
                                    </div>
                                ) : (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase">External URL <span className="text-red-500">*</span></label>
                                        <input type="text" value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://example.com or mailto:info@..." className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white shadow-sm" />
                                    </div>
                                )}
                            </div>
                        </> /* end GENERAL tab */
                    )}

                    {/* TRANSLATIONS TAB */}
                    {activeTab === 'TRANSLATIONS' && (
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                            {siteConfig.languages.filter(lang => lang !== 'en').length > 0 ? (
                                <>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                        <Globe className="w-3.5 h-3.5 text-[var(--primary-color)]" /> Translations
                                        <span className="text-[10px] text-gray-400 normal-case font-normal">(Optional — shown when that language is active)</span>
                                    </label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {siteConfig.languages.filter(lang => lang !== 'en').map(lang => {
                                            const langLabels: Record<string, { label: string; flag: string; placeholder: string }> = {
                                                de: { label: 'German', flag: '🇩🇪', placeholder: 'Deutschen Titel eingeben...' },
                                                fr: { label: 'French', flag: '🇫🇷', placeholder: 'Entrez le titre en français...' },
                                                es: { label: 'Spanish', flag: '🇪🇸', placeholder: 'Ingrese el título en español...' }
                                            };
                                            const meta = langLabels[lang] || { label: lang.toUpperCase(), flag: '🌐', placeholder: `Enter title in ${lang}...` };
                                            const currentVal = (formData.translations || {})[lang] || '';
                                            return (
                                                <div key={lang} className="flex items-center gap-3">
                                                    <span className="text-base w-6 text-center flex-shrink-0">{meta.flag}</span>
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{meta.label}</label>
                                                        <input
                                                            type="text"
                                                            value={currentVal}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                translations: { ...(formData.translations || {}), [lang]: e.target.value }
                                                            })}
                                                            placeholder={meta.placeholder}
                                                            className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none bg-white shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm italic">No additional languages configured.</p>
                                    <p className="text-xs mt-1">Add more languages in the Site Manager to enable translations.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>{/* end scrollable body */}

                {/* Footer */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100">
                    {/* Top row: metadata + action buttons */}
                    <div className="px-8 py-4 flex items-center justify-between gap-6">
                        <div className="flex-1">
                            {!isNew && formData.id ? (
                                <SharePointMetadataFooter
                                    listTitle="TopNavigation"
                                    itemId={formData.id}
                                    createdDate={item?.modified}
                                    modifiedDate={item?.modified}
                                    onDelete={!isNew ? () => setShowDeleteConfirm(true) : undefined}
                                />
                            ) : (
                                <div />
                            )}
                        </div>
                        <div className="flex gap-3 flex-shrink-0 items-center">
                            <button onClick={onCancel} className="px-8 py-2 border border-gray-300 bg-white text-gray-800 text-sm font-bold hover:bg-gray-50 transition-colors rounded-sm uppercase tracking-wide">
                                {getTranslation('BTN_CANCEL', currentLanguage)}
                            </button>
                            <button
                                onClick={() => canSave && onSave(formData)}
                                disabled={!canSave}
                                className={`px-8 py-2 text-white text-sm font-bold rounded-sm shadow-sm transition-all uppercase tracking-wide flex items-center gap-2 ${canSave ? 'bg-[var(--primary-color)] hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                <Check className="w-4 h-4" /> {getTranslation('BTN_SAVE_CHANGES', currentLanguage)}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-Selectors */}
                {showParentSelector && <ParentSelector currentParentId={formData.parentId || 'root'} onClose={() => setShowParentSelector(false)} onSelect={(id, _) => { setFormData({ ...formData, parentId: id }); setShowParentSelector(false); }} />}
                {showPageSelector && <SmartPageSelector onClose={() => setShowPageSelector(false)} onSelect={(id, _) => { setFormData({ ...formData, pageId: id }); setShowPageSelector(false); }} />}
                {showDeleteConfirm && <NavDeleteConfirmation onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />}
            </div>
        </div>
    );
};

interface NavSubItemProps {
    item: NavItem;
    allItems: NavItem[];
    onEdit: (item: NavItem) => void;
    onAddChild: (id: string) => void;
    currentLanguage?: string;
}

const NavSubItem = ({ item, allItems, onEdit, onAddChild, currentLanguage }: NavSubItemProps) => {
    const children = allItems.filter(n => n.parentId === item.id).sort((a, b) => a.order - b.order);
    return (
        <div className="relative group/child">
            <div className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between group-hover/child:bg-gray-50 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                <span className={`${!item.isVisible ? 'opacity-50 line-through decoration-red-400' : 'text-gray-700'} ${item.type === 'External' ? 'italic text-gray-500' : ''}`}>
                    {getNavItemTitle(item, currentLanguage || 'en')} {item.type === 'External' && <span className="text-[9px] border border-gray-300 px-1 rounded ml-1 not-italic">EXT</span>}
                </span>
                <div className="flex items-center gap-1">
                    <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover/child:opacity-100 hover:text-[var(--primary-color)] transition-opacity" />
                    {children.length > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                </div>
            </div>
            <div className="absolute left-full top-0 hidden group-hover/child:block pl-1 z-20 min-w-[200px]">
                <div className="bg-white border border-gray-200 shadow-xl rounded-sm py-1 animate-in fade-in zoom-in-95 duration-100">
                    {children.map(sub => (
                        <div key={sub.id} className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between text-sm group/sub cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); onEdit(sub); }}>
                            <span className={`${!sub.isVisible ? 'opacity-50 line-through' : 'text-gray-700'} ${sub.type === 'External' ? 'italic text-gray-500' : ''}`}>
                                {getNavItemTitle(sub, currentLanguage || 'en')}
                            </span>
                            <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover/sub:opacity-100 hover:text-[var(--primary-color)] transition-opacity" />
                        </div>
                    ))}
                    <button onClick={(e) => { e.stopPropagation(); onAddChild(item.id); }} className="w-full text-left px-4 py-2 text-xs text-[var(--primary-color)] hover:bg-[var(--brand-light)] font-bold border-t border-gray-100 flex items-center gap-1 transition-colors">
                        <Plus className="w-3 h-3" /> {getTranslation('BTN_ADD_LEVEL', (currentLanguage || 'en') as any)}
                    </button>
                </div>
            </div>
        </div>
    );
};

const NavPillDropdown = ({ item, allItems, onEdit, onAddChild, currentLanguage }: NavSubItemProps) => {
    const children = allItems.filter(n => n.parentId === item.id).sort((a, b) => a.order - b.order);
    return (
        <div className="relative group/parent inline-block">
            <div
                onClick={() => onEdit(item)}
                className={`px-4 py-2 bg-white border rounded-sm shadow-sm flex items-center gap-2 text-sm font-bold tracking-wide transition-all uppercase cursor-pointer ${!item.isVisible ? 'opacity-60 border-dashed border-red-300 text-gray-500' : 'border-gray-200 hover:border-[var(--primary-color)] text-gray-700 hover:text-[var(--primary-color)]'}`}
            >
                <span>{getNavItemTitle(item, currentLanguage || 'en')}</span>
                {item.type === 'External' && <Globe className="w-3 h-3 text-orange-400" />}
                <Pencil className="w-3 h-3 text-gray-400 ml-1" />
                {!item.isVisible && <EyeOff className="w-3 h-3 text-red-400" />}
                {children.length > 0 && <ChevronDown className="w-3 h-3 text-gray-400" />}
            </div>
            <div className="absolute top-full left-0 hidden group-hover/parent:block pt-1 z-10 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="bg-white border border-gray-200 shadow-xl rounded-sm py-1">
                    {children.map(child => (<NavSubItem key={child.id} item={child} allItems={allItems} onEdit={onEdit} onAddChild={onAddChild} currentLanguage={currentLanguage} />))}
                    <button onClick={() => onAddChild(item.id)} className="w-full text-left px-4 py-2 text-xs text-[var(--primary-color)] hover:bg-[var(--brand-light)] font-bold border-t border-gray-100 flex items-center gap-1 transition-colors">
                        <Plus className="w-3 h-3" /> {getTranslation('BTN_ADD_LEVEL', (currentLanguage || 'en') as any)}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface NavListRowProps {
    item: NavItem;
    level: number;
    allItems: NavItem[];
    pages: Page[];
    onEdit: (item: NavItem) => void;
    onDelete: (id: string) => void;
    currentLanguage?: string;
}

const BASE_URL = 'https://testing.hochhuth-consulting.de';

const NavListRow = ({ item, level, allItems, pages, onEdit, onDelete, currentLanguage }: NavListRowProps) => {
    const children = allItems.filter(n => n.parentId === item.id).sort((a, b) => a.order - b.order);

    // Build display URL
    const getDisplayUrl = (): string => {
        if (item.type === 'External') {
            return item.url || '—';
        }
        // Internal SmartPage: find the linked page's slug
        const linkedPage = pages.find(p => String(p.id) === String(item.pageId));
        const rawTitle = linkedPage?.title;
        const titleStr = typeof rawTitle === 'string' ? rawTitle : (rawTitle as any)?.en || item.title;

        // slug '/' means homepage root — use title as the segment instead
        const slug = linkedPage?.slug;
        const segment = (slug && slug !== '/') ? slug : `/${titleStr}`;
        return `${BASE_URL}${segment}`;
    };

    const displayUrl = getDisplayUrl();
    const isExternal = item.type === 'External';

    return (
        <React.Fragment>
            <tr className="border-b border-gray-100 hover:bg-[var(--brand-light)] group transition-colors">
                <td className="py-3 px-4">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                        <GripVertical className="w-4 h-4 text-gray-300 cursor-move" />
                        <span className={`text-sm font-medium ${!item.isVisible ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{getNavItemTitle(item, currentLanguage || 'en')}</span>
                        {!item.isVisible && <EyeOff className="w-3 h-3 text-red-400" />}
                    </div>
                </td>
                <td className="py-3 px-4 text-xs font-mono">
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 hover:underline truncate max-w-[400px] ${isExternal ? 'text-orange-600' : 'text-[var(--primary-color)]'
                            }`}
                        title={displayUrl}
                    >
                        {isExternal
                            ? <Globe className="w-3 h-3 flex-shrink-0" />
                            : <FileText className="w-3 h-3 flex-shrink-0" />
                        }
                        {displayUrl}
                    </a>
                </td>
                <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(item)} className="p-1.5 text-[var(--primary-color)] hover:bg-white rounded-sm border border-transparent hover:border-gray-200 shadow-sm" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDelete(item.id)} className="p-1.5 text-red-600 hover:bg-white rounded-sm border border-transparent hover:border-red-100 shadow-sm" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                </td>
            </tr>
            {children.map(child => (<NavListRow key={child.id} item={child} level={level + 1} allItems={allItems} pages={pages} onEdit={onEdit} onDelete={onDelete} currentLanguage={currentLanguage} />))}
        </React.Fragment>
    );
};

export const NavigationManager = ({ onClose }: { onClose: () => void }) => {
    const { siteConfig, pages, addNavItem, updateNavItem, updateNavPosition, updateNavAlignment, updateHeaderConfig, updateLogo, deleteNavItem, uploadImage, currentLanguage } = useStore();
    const [view, setView] = useState<'VISUAL' | 'LIST'>('VISUAL');
    const [editingItem, setEditingItem] = useState<NavItem | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [addingParentId, setAddingParentId] = useState<string | undefined>(undefined);
    const [showHelp, setShowHelp] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            try {
                const uploaded = await uploadImage(file, 'Logos');
                if (uploaded) {
                    updateLogo({ ...siteConfig.logo, url: uploaded.url });
                }
            } catch (err) {
                console.error("Logo upload failed:", err);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // --- MIGRATION LOGIC REMOVED to allow External Links ---
    // previously converted all External items to Pages automatically

    const rootItems = siteConfig.navigation.filter(n => n.parentId === 'root').sort((a, b) => a.order - b.order);
    const handleSaveItem = (item: Partial<NavItem>) => { if (isAdding) addNavItem(item as NavItem); else updateNavItem(item as NavItem); setEditingItem(null); setIsAdding(false); setAddingParentId(undefined); };
    const startAdd = (parentId?: string) => { setAddingParentId(parentId || 'root'); setIsAdding(true); setEditingItem(null); };
    const confirmDelete = () => { if (deleteId) { deleteNavItem(deleteId); setDeleteId(null); } };

    const footerContent = (
        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">
            {getTranslation('BTN_CLOSE', currentLanguage)}
        </button>
    );

    return (
        <GenericModal
            className="navigation-management-popup"
            title={getTranslation('NAV_MGMT', currentLanguage)}
            onClose={onClose}
            width="w-[80vw] min-w-[80vw] max-w-[80vw]"
            noFooter={true}
            customFooter={footerContent}
            headerIcons={
                <div className="flex items-center gap-4">
                    <div className="flex border border-[var(--primary-color)] rounded-sm overflow-hidden shadow-sm">
                        <button onClick={() => setView('VISUAL')} className={`px-3 py-1.5 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'VISUAL' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-[var(--brand-light)]'}`}><Monitor className="w-3 h-3" /> {getTranslation('BTN_VISUAL_VIEW', currentLanguage)}</button>
                        <button onClick={() => setView('LIST')} className={`px-3 py-1.5 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'LIST' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-[var(--brand-light)]'}`}><ListIcon className="w-3 h-3" /> {getTranslation('BTN_LIST_VIEW', currentLanguage)}</button>
                    </div>
                    <div className="h-5 w-px bg-gray-300"></div>
                    <HelpCircle onClick={() => setShowHelp(true)} className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[var(--primary-color)] transition-colors" />
                </div>
            }
        >
            <div className="space-y-8 min-h-[500px] flex flex-col pb-8">

                {/* Navigation Items Area */}
                <div className="flex-1">
                    {view === 'VISUAL' ? (
                        <div className="flex flex-wrap items-start gap-3 p-4 bg-white border border-gray-200 rounded-sm min-h-[150px] shadow-sm content-start">
                            {rootItems.map(item => (<NavPillDropdown key={item.id} item={item} allItems={siteConfig.navigation} onEdit={(i) => { setEditingItem(i); setIsAdding(false); }} onAddChild={startAdd} currentLanguage={currentLanguage} />))}
                            <button onClick={() => startAdd('root')} className="px-4 py-2 bg-[var(--brand-light)] border border-[var(--primary-color)] text-[var(--primary-color)] text-sm font-bold rounded-sm hover:bg-[var(--primary-color)] hover:text-white flex items-center gap-2 shadow-sm transition-all active:scale-95">
                                <Plus className="w-4 h-4" /> {getTranslation('BTN_ADD_NAV_ITEM', currentLanguage)}
                            </button>
                        </div>
                    ) : (
                        <div className="border border-gray-200 bg-white rounded-sm shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                                <h4 className="text-sm font-bold text-gray-700">{getTranslation('NAV_MGMT', currentLanguage)}</h4>
                                <button onClick={() => startAdd('root')} className="px-3 py-1.5 bg-[var(--primary-color)] text-white text-xs font-bold rounded-sm hover:bg-[var(--btn-primary-hover-bg)] flex items-center gap-1 shadow-sm transition-colors">
                                    <Plus className="w-3 h-3" /> {getTranslation('BTN_ADD_NEW', currentLanguage)}
                                </button>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                                    <tr><th className="px-4 py-2 text-left w-1/3">{getTranslation('LABEL_TITLE', currentLanguage)}</th><th className="px-4 py-2 text-left">{getTranslation('LABEL_URL_PAGE', currentLanguage)}</th><th className="px-4 py-2 text-right w-24">{getTranslation('TH_ACTIONS', currentLanguage)}</th></tr>
                                </thead>
                                <tbody>
                                    {rootItems.map(item => (<NavListRow key={item.id} item={item} level={0} allItems={siteConfig.navigation} pages={pages} onEdit={(i) => { setEditingItem(i); setIsAdding(false); }} onDelete={(id) => setDeleteId(id)} currentLanguage={currentLanguage} />))}
                                    {rootItems.length === 0 && (<tr><td colSpan={3} className="p-8 text-center text-gray-400 italic">No navigation items found.</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Configuration Section */}
                <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[var(--primary-color)]" /> {getTranslation('NAV_HEADER_CONFIG', currentLanguage)}
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Menu Placement Card */}
                        <div className="bg-gray-50 p-6 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4">{getTranslation('NAV_MENU_PLACEMENT', currentLanguage)}</label>
                            <div className="space-y-6">
                                <div className="flex gap-4 flex-wrap">
                                    {[
                                        { id: 'right', labelKey: 'NAV_RIGHT_OF_PAGE' },
                                        { id: 'near_logo', labelKey: 'NAV_NEAR_LOGO' },
                                        { id: 'below_logo', labelKey: 'NAV_NEXT_LINE' }
                                    ].map(opt => (
                                        <label key={opt.id} className={`flex items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded-sm shadow-sm transition-all ${siteConfig.navPosition === opt.id ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="navPos" checked={siteConfig.navPosition === opt.id} onChange={() => updateNavPosition(opt.id as any)} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                            <span className="text-sm font-medium text-gray-700">{getTranslation(opt.labelKey, currentLanguage)}</span>
                                        </label>
                                    ))}
                                </div>
                                {siteConfig.navPosition === 'below_logo' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 pl-4 border-l-2 border-blue-200">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{getTranslation('NAV_ROW_ALIGNMENT', currentLanguage)}</label>
                                        <div className="flex gap-4">
                                            {['left', 'center', 'right'].map(align => (
                                                <label key={align} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="navAlign" checked={siteConfig.navAlignment === align} onChange={() => updateNavAlignment(align as any)} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                                    <span className="text-sm text-gray-600 capitalize">{align}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{getTranslation('NAV_PAGE_WIDTH', currentLanguage)}</label>
                                        <select value={siteConfig.headerWidth || 'full'} onChange={(e) => updateHeaderConfig({ headerWidth: e.target.value as any })} className="w-full text-sm border-gray-300 rounded-sm focus:ring-[var(--primary-color)] bg-white p-1.5 focus:outline-none focus:border-[var(--primary-color)]">
                                            <option value="full">{getTranslation('NAV_FULL_WIDTH', currentLanguage)}</option>
                                            <option value="standard">{getTranslation('NAV_STANDARD_BOXED', currentLanguage)}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{getTranslation('NAV_BG_COLOR', currentLanguage)}</label>
                                        <div className="flex gap-2 items-center bg-white p-1 border border-gray-300 rounded-sm">
                                            <input type="color" value={siteConfig.headerBackgroundColor || '#ffffff'} onChange={(e) => updateHeaderConfig({ headerBackgroundColor: e.target.value })} className="h-6 w-6 p-0 border border-gray-200 rounded-sm cursor-pointer" />
                                            <span className="text-xs text-gray-500 font-mono">{siteConfig.headerBackgroundColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logo Settings Card */}
                        <div className="bg-gray-50 p-6 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-4">{getTranslation('NAV_LOGO_SETTINGS', currentLanguage)}</label>
                            <div className="space-y-6">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input type="text" placeholder="Logo URL (e.g. /assets/logo.png)" value={siteConfig.logo.url} onChange={(e) => updateLogo({ ...siteConfig.logo, url: e.target.value })} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow focus:shadow-sm" />
                                    </div>
                                    <label className={`flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50 text-gray-500 transition-colors group shadow-sm ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                                        <Upload className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploading} />
                                    </label>
                                    <input type="text" placeholder="Width (150px)" value={siteConfig.logo.width} onChange={(e) => updateLogo({ ...siteConfig.logo, width: e.target.value })} className="w-24 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow focus:shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{getTranslation('NAV_LOGO_POSITION', currentLanguage)}</label>
                                    <div className="flex gap-4">
                                        {['left', 'center', 'right'].map(pos => (
                                            <label key={pos} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="logoPos" checked={siteConfig.logo.position === pos} onChange={() => updateLogo({ ...siteConfig.logo, position: pos as any })} className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]" />
                                                <span className="text-sm text-gray-600 capitalize">{pos}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Modals */}
            {(editingItem || isAdding) && (<NavItemEditor item={editingItem || {}} isNew={isAdding} onSave={handleSaveItem} onCancel={() => { setEditingItem(null); setIsAdding(false); setAddingParentId(undefined); }} forcedParentId={addingParentId} />)}
            {showHelp && <HelpGuideModal onClose={() => setShowHelp(false)} />}
            {deleteId && (<NavDeleteConfirmation onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />)}
        </GenericModal>
    );
};
