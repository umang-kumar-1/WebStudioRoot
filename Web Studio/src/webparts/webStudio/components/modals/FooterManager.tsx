
import { useState } from 'react';
import { useStore, getLocalizedText, getTranslation } from '../../store';
import { SiteConfig } from '../../types';
import { GenericModal } from './SharedModals';
import {
    Menu, HelpCircle, LayoutTemplate, Briefcase, ChevronDown, ChevronRight, Monitor,
    List as ListIcon, X, Plus, MapPin, Globe, Linkedin, Facebook, Twitter, Instagram,
    Mail, Phone, Layers, Trash2, Edit2,
    Link as LinkIcon, Type,
    Layout, MousePointer2, Save
} from 'lucide-react';

export const FooterManager = ({ onClose }: { onClose: () => void }) => {
    const { siteConfig, updateFooterConfig, currentLanguage, saveGlobalSettings } = useStore();
    // Local State for isolation - no global side effects until save
    const [localConfig, setLocalConfig] = useState<SiteConfig['footer']>(JSON.parse(JSON.stringify(siteConfig.footer)));
    const [view, setView] = useState<'VISUAL' | 'LIST' | 'BUILDER'>('VISUAL');
    const [isSettingsOpen, setIsSettingsOpen] = useState(true);

    // Builder Specific State
    const [activeSection, setActiveSection] = useState<'MAIN' | 'CONTACT' | 'BOTTOM' | null>('MAIN');
    const [selectedItem, setSelectedItem] = useState<{ type: 'COLUMN' | 'LINK' | 'SOCIAL' | 'COPYRIGHT' | 'CONTACT', id: string, parentId?: string } | null>(null);

    const handleSave = async () => {
        updateFooterConfig(localConfig);
        await saveGlobalSettings('site');
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const handleUpdate = (key: string, value: any) => {
        setLocalConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleCopyrightUpdate = (value: string) => {
        handleUpdate('copyright', { ...localConfig.copyright, [currentLanguage]: value });
    };

    const handleFontUpdate = (key: string, value: string) => {
        handleUpdate('fontSettings', { ...localConfig.fontSettings, [key]: value });
    };

    // --- BUILDER LOGIC ---

    const addColumn = () => {
        const newCol = { id: `col_${Date.now()}`, title: 'New Column', links: [] };
        handleUpdate('columns', [...localConfig.columns, newCol]);
        setSelectedItem({ type: 'COLUMN', id: newCol.id });
    };

    const deleteColumn = (id: string) => {
        if (confirm(getTranslation('MSG_DELETE_COL_CONFIRM', currentLanguage))) {
            handleUpdate('columns', localConfig.columns.filter(c => c.id !== id));
            setSelectedItem(null);
        }
    };

    const addItemToColumn = (colId: string) => {
        const newLink = { id: `lnk_${Date.now()}`, label: 'New Link', url: '#' };
        const newCols = localConfig.columns.map(c => {
            if (c.id === colId) return { ...c, links: [...c.links, newLink] };
            return c;
        });
        handleUpdate('columns', newCols);
        setSelectedItem({ type: 'LINK', id: newLink.id, parentId: colId });
    };

    const deleteItemFromColumn = (colId: string, linkId: string) => {
        const newCols = localConfig.columns.map(c => {
            if (c.id === colId) return { ...c, links: c.links.filter(l => l.id !== linkId) };
            return c;
        });
        handleUpdate('columns', newCols);
        setSelectedItem(null);
    };

    // --- RENDER HELPERS ---

    const getFooterBg = (bgValue: string) => {
        switch (bgValue) {
            case 'white': return '#ffffff';
            case 'light-grey': return '#f3f4f6';
            case 'site-color': return 'var(--brand-dark)';
            default: return bgValue;
        }
    };

    const getFooterTextColor = (bgValue: string) => {
        const bg = getFooterBg(bgValue);
        if (bg === '#ffffff' || bg === '#f3f4f6') return 'var(--text-primary)';
        return '#ffffff';
    };

    const isPresetColor = ['white', 'light-grey', 'site-color'].includes(localConfig.backgroundColor);

    // --- RIGHT PANEL RENDERER ---
    const renderPropertiesPanel = () => {
        if (!selectedItem) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50/50">
                    <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">{getTranslation('MSG_SELECT_ELEMENT', currentLanguage)}</p>
                    <p className="text-xs mt-2 opacity-70">{getTranslation('MSG_CLICK_ELEMENT', currentLanguage)}</p>
                </div>
            );
        }

        if (selectedItem.type === 'COLUMN') {
            const col = localConfig.columns.find(c => c.id === selectedItem.id);
            if (!col) return null;
            return (
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-blue-100 rounded-sm text-[var(--primary-color)]"><Layout className="w-4 h-4" /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('TITLE_EDIT_COLUMN', currentLanguage)}</h4>
                            <p className="text-xs text-gray-500">{getTranslation('SECTION_MAIN_NAV', currentLanguage)}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LBL_COLUMN_HEADING', currentLanguage)}</label>
                        <input
                            value={col.title}
                            onChange={(e) => {
                                const newCols = localConfig.columns.map(c => c.id === col.id ? { ...c, title: e.target.value } : c);
                                handleUpdate('columns', newCols);
                            }}
                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                            placeholder={getTranslation('LBL_COLUMN_HEADING', currentLanguage)}
                        />
                    </div>
                    <div className="pt-4">
                        <button onClick={() => deleteColumn(col.id)} className="text-red-500 text-xs font-bold flex items-center gap-2 hover:bg-red-50 p-2 rounded-sm w-full justify-center border border-red-200">
                            <Trash2 className="w-3 h-3" /> {getTranslation('BTN_DELETE_COLUMN', currentLanguage)}
                        </button>
                    </div>
                </div>
            );
        }

        if (selectedItem.type === 'LINK' && selectedItem.parentId) {
            const col = localConfig.columns.find(c => c.id === selectedItem.parentId);
            const link = col?.links.find(l => l.id === selectedItem.id);
            if (!col || !link) return null;
            return (
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-green-100 rounded-sm text-green-700"><LinkIcon className="w-4 h-4" /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('TITLE_EDIT_LINK', currentLanguage)}</h4>
                            <p className="text-xs text-gray-500">{getTranslation('LBL_INSIDE', currentLanguage) || 'Inside'}: {col.title}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LBL_LABEL_TEXT', currentLanguage)}</label>
                        <input
                            value={link.label}
                            onChange={(e) => {
                                const newCols = localConfig.columns.map(c => c.id === col.id ? {
                                    ...c, links: c.links.map(l => l.id === link.id ? { ...l, label: e.target.value } : l)
                                } : c);
                                handleUpdate('columns', newCols);
                            }}
                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LBL_DESTINATION_URL', currentLanguage)}</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                value={link.url}
                                onChange={(e) => {
                                    const newCols = localConfig.columns.map(c => c.id === col.id ? {
                                        ...c, links: c.links.map(l => l.id === link.id ? { ...l, url: e.target.value } : l)
                                    } : c);
                                    handleUpdate('columns', newCols);
                                }}
                                className="w-full border border-gray-300 p-2.5 pl-9 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                placeholder="URL"
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button onClick={() => deleteItemFromColumn(col.id, link.id)} className="text-red-500 text-xs font-bold flex items-center gap-2 hover:bg-red-50 p-2 rounded-sm w-full justify-center border border-red-200">
                            <Trash2 className="w-3 h-3" /> {getTranslation('BTN_REMOVE_LINK', currentLanguage)}
                        </button>
                    </div>
                </div>
            );
        }

        if (selectedItem.type === 'COPYRIGHT') {
            return (
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-purple-100 rounded-sm text-purple-700"><Type className="w-4 h-4" /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('TITLE_COPYRIGHT', currentLanguage)}</h4>
                            <p className="text-xs text-gray-500">{getTranslation('SECTION_BOTTOM_BAR', currentLanguage)}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('TITLE_COPYRIGHT', currentLanguage)} ({currentLanguage.toUpperCase()})</label>
                        <textarea
                            value={localConfig.copyright[currentLanguage] || ''}
                            onChange={(e) => handleCopyrightUpdate(e.target.value)}
                            className="w-full border border-gray-300 p-3 text-sm h-32 resize-none rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        />
                    </div>
                </div>
            );
        }

        if (selectedItem.type === 'SOCIAL') {
            return (
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-pink-100 rounded-sm text-pink-700"><Globe className="w-4 h-4" /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('TITLE_SOCIAL_NETWORKS', currentLanguage)}</h4>
                            <p className="text-xs text-gray-500">{getTranslation('SECTION_BOTTOM_BAR', currentLanguage)}</p>
                        </div>
                    </div>
                    {['linkedin', 'facebook', 'twitter', 'instagram'].map(platform => (
                        <div key={platform}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 capitalize">{platform}</label>
                            <input
                                value={(localConfig.socialLinks as any)[platform]}
                                onChange={(e) => handleUpdate('socialLinks', { ...localConfig.socialLinks, [platform]: e.target.value })}
                                className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                placeholder={`https://${platform}.com/...`}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        if (selectedItem.type === 'CONTACT') {
            return (
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-orange-100 rounded-sm text-orange-700"><MapPin className="w-4 h-4" /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('SECTION_CONTACT_INFO', currentLanguage)}</h4>
                            <p className="text-xs text-gray-500">{getTranslation('MSG_CORP_ONLY', currentLanguage) || 'Corporate Template Only'}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LOCATION', currentLanguage)}</label>
                        <input
                            value={localConfig.contactInfo.address}
                            onChange={(e) => handleUpdate('contactInfo', { ...localConfig.contactInfo, address: e.target.value })}
                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_SENDER_EMAIL', currentLanguage)}</label>
                        <input
                            value={localConfig.contactInfo.email}
                            onChange={(e) => handleUpdate('contactInfo', { ...localConfig.contactInfo, email: e.target.value })}
                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_PHONE', currentLanguage) || 'Phone'}</label>
                        <input
                            value={localConfig.contactInfo.phone}
                            onChange={(e) => handleUpdate('contactInfo', { ...localConfig.contactInfo, phone: e.target.value })}
                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                        />
                    </div>
                </div>
            );
        }

        return null;
    };

    const footerButtons = (
        <div className="flex justify-end gap-3 w-full">
            <button onClick={handleCancel} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 rounded-sm flex items-center gap-1">{getTranslation('BTN_CANCEL', currentLanguage)}</button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold hover:opacity-90 rounded-sm shadow-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> {getTranslation('BTN_SAVE_CHANGES', currentLanguage)}
            </button>
        </div>
    );

    return (
        <GenericModal
            className="footer-management-popup"
            title={getTranslation('FOOTER_MGMT', currentLanguage)}
            onClose={handleCancel}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
            customFooter={footerButtons}
            headerIcons={<Menu className="w-5 h-5 text-gray-500 cursor-pointer" />}
        >
            <div className={`flex flex-col ${view === 'BUILDER' ? 'h-[75vh]' : 'pb-8 space-y-6'}`}>

                {/* View Toggles */}
                <div className={`flex items-center justify-between ${view === 'BUILDER' ? 'px-6 py-2 border-b border-gray-200 bg-gray-50' : 'mb-2'}`}>
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        {view === 'BUILDER' ? <Layers className="w-4 h-4 text-[var(--primary-color)]" /> : null}
                        {view === 'BUILDER' ? getTranslation('LBL_LAYOUT_BUILDER', currentLanguage) : getTranslation('LBL_FOOTER_CONFIG', currentLanguage)}
                    </h4>
                    <div className="flex border border-[var(--primary-color)] rounded-sm overflow-hidden shadow-sm h-8">
                        <button onClick={() => setView('VISUAL')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'VISUAL' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><Monitor className="w-3 h-3" /> {getTranslation('LBL_VISUAL', currentLanguage)}</button>
                        <button onClick={() => setView('LIST')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'LIST' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><ListIcon className="w-3 h-3" /> {getTranslation('LBL_LIST', currentLanguage)}</button>
                        <button onClick={() => setView('BUILDER')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'BUILDER' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><Layers className="w-3 h-3" /> {getTranslation('LBL_BUILDER', currentLanguage)}</button>
                    </div>
                </div>

                {view === 'BUILDER' ? (
                    /* --- BUILDER VIEW --- */
                    <div className="flex-1 flex overflow-hidden bg-gray-100">

                        {/* LEFT: CANVAS */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* SECTION 1: MAIN NAVIGATION */}
                            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setActiveSection(activeSection === 'MAIN' ? null : 'MAIN')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-blue-100 rounded-sm text-[var(--primary-color)]"><Layout className="w-4 h-4" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('SECTION_MAIN_NAV', currentLanguage)}</h4>
                                            <p className="text-xs text-gray-500">{getTranslation('DESC_MAIN_NAV', currentLanguage) || 'Contains columns of links.'}</p>
                                        </div>
                                    </div>
                                    {activeSection === 'MAIN' ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                </div>

                                {activeSection === 'MAIN' && (
                                    <div className="p-6 bg-gray-50/50">
                                        {/* Columns Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {localConfig.columns.map((col) => (
                                                <div
                                                    key={col.id}
                                                    onClick={() => setSelectedItem({ type: 'COLUMN', id: col.id })}
                                                    className={`bg-white border rounded-sm p-4 cursor-pointer hover:shadow-md transition-all group ${selectedItem?.id === col.id ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]' : 'border-gray-200'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="font-bold text-sm text-gray-800 truncate pr-2">{col.title}</h5>
                                                        <button onClick={(e) => { e.stopPropagation(); setSelectedItem({ type: 'COLUMN', id: col.id }); }} className="text-gray-400 hover:text-[var(--primary-color)]"><Edit2 className="w-3 h-3" /></button>
                                                    </div>

                                                    {/* Items in Column */}
                                                    <div className="space-y-1 mb-4 min-h-[60px]">
                                                        {col.links.map(link => (
                                                            <div
                                                                key={link.id}
                                                                onClick={(e) => { e.stopPropagation(); setSelectedItem({ type: 'LINK', id: link.id, parentId: col.id }); }}
                                                                className={`text-xs px-2 py-1.5 rounded-sm flex items-center gap-2 hover:bg-gray-50 ${selectedItem?.id === link.id ? 'bg-blue-50 text-[var(--primary-color)] font-bold' : 'text-gray-600'}`}
                                                            >
                                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                                <span className="truncate flex-1">{link.label}</span>
                                                            </div>
                                                        ))}
                                                        {col.links.length === 0 && <div className="text-[10px] text-gray-400 italic px-2">{getTranslation('MSG_NO_LINKS', currentLanguage)}</div>}
                                                    </div>

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); addItemToColumn(col.id); }}
                                                        className="w-full py-1.5 border border-dashed border-gray-300 text-xs font-bold text-gray-500 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] rounded-sm flex items-center justify-center gap-1 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" /> {getTranslation('BTN_ADD_ITEM', currentLanguage)}
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add Column Card */}
                                            <div
                                                onClick={addColumn}
                                                className="border-2 border-dashed border-gray-300 rounded-sm p-4 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] cursor-pointer transition-all min-h-[200px]"
                                            >
                                                <Plus className="w-8 h-8 mb-2" />
                                                <span className="text-sm font-bold">{getTranslation('BTN_ADD_COLUMN', currentLanguage)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 2: CONTACT (Conditional) */}
                            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setActiveSection(activeSection === 'CONTACT' ? null : 'CONTACT')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-orange-100 rounded-sm text-orange-700"><MapPin className="w-4 h-4" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('SECTION_CONTACT_INFO', currentLanguage)}</h4>
                                            <p className="text-xs text-gray-500">{getTranslation('MSG_CORP_ONLY', currentLanguage)}</p>
                                        </div>
                                    </div>
                                    {activeSection === 'CONTACT' ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                </div>

                                {activeSection === 'CONTACT' && (
                                    <div className="p-6 grid grid-cols-3 gap-4">
                                        <div
                                            onClick={() => setSelectedItem({ type: 'CONTACT', id: 'contact' })}
                                            className={`p-4 border rounded-sm cursor-pointer hover:shadow-sm transition-all ${selectedItem?.type === 'CONTACT' ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] bg-blue-50' : 'border-gray-200 bg-white'}`}
                                        >
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_LOCATION', currentLanguage)}</div>
                                            <div className="text-sm font-medium text-gray-800 truncate">{localConfig.contactInfo.address || getTranslation('MSG_NOT_SET', currentLanguage) || 'Not set'}</div>
                                        </div>
                                        <div
                                            onClick={() => setSelectedItem({ type: 'CONTACT', id: 'contact' })}
                                            className={`p-4 border rounded-sm cursor-pointer hover:shadow-sm transition-all ${selectedItem?.type === 'CONTACT' ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] bg-blue-50' : 'border-gray-200 bg-white'}`}
                                        >
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_SENDER_EMAIL', currentLanguage)}</div>
                                            <div className="text-sm font-medium text-gray-800 truncate">{localConfig.contactInfo.email || getTranslation('MSG_NOT_SET', currentLanguage) || 'Not set'}</div>
                                        </div>
                                        <div
                                            onClick={() => setSelectedItem({ type: 'CONTACT', id: 'contact' })}
                                            className={`p-4 border rounded-sm cursor-pointer hover:shadow-sm transition-all ${selectedItem?.type === 'CONTACT' ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] bg-blue-50' : 'border-gray-200 bg-white'}`}
                                        >
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LABEL_PHONE', currentLanguage)}</div>
                                            <div className="text-sm font-medium text-gray-800 truncate">{localConfig.contactInfo.phone || getTranslation('MSG_NOT_SET', currentLanguage) || 'Not set'}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 3: BOTTOM BAR */}
                            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setActiveSection(activeSection === 'BOTTOM' ? null : 'BOTTOM')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-purple-100 rounded-sm text-purple-700"><Type className="w-4 h-4" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{getTranslation('SECTION_BOTTOM_BAR', currentLanguage)}</h4>
                                            <p className="text-xs text-gray-500">{getTranslation('TITLE_COPYRIGHT', currentLanguage)} & {getTranslation('TITLE_SOCIAL_NETWORKS', currentLanguage)}</p>
                                        </div>
                                    </div>
                                    {activeSection === 'BOTTOM' ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                </div>

                                {activeSection === 'BOTTOM' && (
                                    <div className="p-6 grid grid-cols-2 gap-6">
                                        <div
                                            onClick={() => setSelectedItem({ type: 'COPYRIGHT', id: 'copy' })}
                                            className={`p-4 border rounded-sm cursor-pointer hover:shadow-sm transition-all group ${selectedItem?.type === 'COPYRIGHT' ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase">{getTranslation('TITLE_COPYRIGHT', currentLanguage)}</span>
                                                <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                            </div>
                                            <div className="text-sm text-gray-800 line-clamp-2">{getLocalizedText(localConfig.copyright, currentLanguage)}</div>
                                        </div>
                                        <div
                                            onClick={() => setSelectedItem({ type: 'SOCIAL', id: 'social' })}
                                            className={`p-4 border rounded-sm cursor-pointer hover:shadow-sm transition-all group ${selectedItem?.type === 'SOCIAL' ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase">{getTranslation('TITLE_SOCIAL_NETWORKS', currentLanguage)}</span>
                                                <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                            </div>
                                            <div className="flex gap-3">
                                                <Linkedin className={`w-5 h-5 ${localConfig.socialLinks.linkedin ? 'text-blue-700' : 'text-gray-300'}`} />
                                                <Facebook className={`w-5 h-5 ${localConfig.socialLinks.facebook ? 'text-blue-600' : 'text-gray-300'}`} />
                                                <Twitter className={`w-5 h-5 ${localConfig.socialLinks.twitter ? 'text-sky-500' : 'text-gray-300'}`} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* LIVE PREVIEW AREA */}
                            <div className="pt-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Monitor className="w-4 h-4 text-gray-500" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{getTranslation('TITLE_LIVE_FOOTER_PREVIEW', currentLanguage)}</h4>
                                </div>
                                <div className="border border-gray-300 shadow-sm bg-white overflow-hidden">
                                    <div
                                        style={{
                                            backgroundColor: getFooterBg(localConfig.backgroundColor),
                                            color: getFooterTextColor(localConfig.backgroundColor),
                                            padding: '2rem',
                                            textAlign: localConfig.template === 'Table' ? localConfig.alignment : 'left'
                                        }}
                                    >
                                        <div className="opacity-50 text-[10px] uppercase font-bold mb-4 tracking-widest border-b border-current pb-1 w-20">{getTranslation('LABEL_FOOTER_AREA', currentLanguage) || 'Footer Area'}</div>
                                        <div className="grid grid-cols-4 gap-8 opacity-80 text-xs">
                                            {localConfig.columns.map(col => (
                                                <div key={col.id}>
                                                    <div className="font-bold mb-2 uppercase">{col.title}</div>
                                                    <div className="space-y-1">
                                                        {col.links.map(l => <div key={l.id}>{l.label}</div>)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: PROPERTIES PANEL */}
                        <div className="w-[320px] bg-white border-l border-gray-200 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
                            {renderPropertiesPanel()}
                        </div>
                    </div>
                ) : (
                    /* --- EXISTING VIEWS (Visual / List) --- */
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col space-y-6">
                            {/* Template Selection */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-2">{getTranslation('LBL_SELECT_TEMPLATE', currentLanguage)} <HelpCircle className="inline w-3 h-3 text-[var(--primary-color)]" /></h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Table', 'Corporate'].map(t => (
                                        <div
                                            key={t}
                                            onClick={() => handleUpdate('template', t)}
                                            className={`border p-4 cursor-pointer transition-all ${localConfig.template === t ? 'border-[var(--primary-color)] bg-[var(--brand-light)] ring-1 ring-[var(--primary-color)]' : 'border-gray-200 hover:border-[var(--primary-color)]'}`}
                                        >
                                            <div className="flex items-center gap-2 font-bold text-sm mb-1">
                                                {t === 'Table' ? <LayoutTemplate className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                                {t} View <HelpCircle className="w-3 h-3 text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500">{t === 'Table' ? 'Organized columns of links.' : 'Professional layout with contact.'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Settings Accordion */}
                            <div className="border border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className="w-full px-4 py-3 flex justify-between items-center text-sm font-bold text-[var(--primary-color)] bg-[var(--brand-light)]/50 border-b border-gray-200"
                                >
                                    <span className="flex items-center gap-2">{getTranslation('LBL_FOOTER_SETTINGS', currentLanguage)} <HelpCircle className="w-3 h-3" /></span>
                                    {isSettingsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>

                                {isSettingsOpen && (
                                    <div className="p-6 space-y-6">
                                        {/* Row 1: BG Color & Alignment */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LBL_BG_COLOR', currentLanguage)} <HelpCircle className="inline w-3 h-3" /></label>
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex gap-0 border border-gray-300 rounded-sm overflow-hidden flex-1">
                                                        {[
                                                            { id: 'white', label: getTranslation('LBL_COLOR_WHITE', currentLanguage) },
                                                            { id: 'light-grey', label: getTranslation('LBL_COLOR_GREY', currentLanguage) },
                                                            { id: 'site-color', label: getTranslation('LBL_COLOR_SITE', currentLanguage) },
                                                            { id: 'other', label: getTranslation('LBL_COLOR_OTHER', currentLanguage) }
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => {
                                                                    if (opt.id === 'other') {
                                                                        const currentHex = ['white', 'light-grey', 'site-color'].includes(localConfig.backgroundColor) ? '#cccccc' : localConfig.backgroundColor;
                                                                        handleUpdate('backgroundColor', currentHex);
                                                                    } else {
                                                                        handleUpdate('backgroundColor', opt.id);
                                                                    }
                                                                }}
                                                                className={`flex-1 py-2 text-xs font-medium transition-colors ${(opt.id === 'other' && !isPresetColor) || localConfig.backgroundColor === opt.id
                                                                    ? 'bg-[var(--primary-color)] text-white'
                                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {!isPresetColor && (
                                                        <div className="relative w-8 h-8 flex-shrink-0 border border-gray-300 rounded-sm overflow-hidden group">
                                                            <div className="w-full h-full" style={{ backgroundColor: localConfig.backgroundColor }}></div>
                                                            <input
                                                                type="color"
                                                                value={localConfig.backgroundColor}
                                                                onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                            />
                                                            <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover:bg-black/0 transition-colors"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Alignment - TABLE VIEW ONLY */}
                                            {localConfig.template === 'Table' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LBL_ALIGNMENT', currentLanguage)} <HelpCircle className="inline w-3 h-3" /></label>
                                                    <div className="flex gap-4">
                                                        {['left', 'center', 'right'].map(align => (
                                                            <label key={align} className="flex items-center gap-2 cursor-pointer text-sm capitalize text-gray-700">
                                                                <input
                                                                    type="radio"
                                                                    checked={localConfig.alignment === align}
                                                                    onChange={() => handleUpdate('alignment', align)}
                                                                    className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                                                                />
                                                                {align}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Row 2: Text */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('TITLE_COPYRIGHT', currentLanguage)} ({currentLanguage.toUpperCase()}) <HelpCircle className="inline w-3 h-3" /></label>
                                                <input
                                                    type="text"
                                                    value={localConfig.copyright[currentLanguage] || ''}
                                                    onChange={(e) => handleCopyrightUpdate(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[var(--primary-color)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LBL_SUB_FOOTER_TEXT', currentLanguage)} <HelpCircle className="inline w-3 h-3" /></label>
                                                <input
                                                    type="text"
                                                    value={localConfig.subFooterText}
                                                    onChange={(e) => handleUpdate('subFooterText', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[var(--primary-color)]"
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Font Settings */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{getTranslation('LBL_FONT_SIZE_SETTINGS', currentLanguage)}</label>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <label className="text-xs text-gray-400 mb-1 block">{getTranslation('LBL_HEADING_SIZE', currentLanguage)}</label>
                                                    <input
                                                        type="text"
                                                        value={localConfig.fontSettings?.headingSize || '16px'}
                                                        onChange={(e) => handleFontUpdate('headingSize', e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[var(--primary-color)]"
                                                        placeholder="16px"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400 mb-1 block">{getTranslation('LBL_SUBHEADING_SIZE', currentLanguage)}</label>
                                                    <input
                                                        type="text"
                                                        value={localConfig.fontSettings?.subHeadingSize || '14px'}
                                                        onChange={(e) => handleFontUpdate('subHeadingSize', e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[var(--primary-color)]"
                                                        placeholder="14px"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Preview Section - Title */}
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <Monitor className="w-4 h-4" /> {getTranslation('LABEL_VISUAL_VIEW', currentLanguage)}
                                </h4>
                            </div>

                            <div className="border border-gray-200 bg-gray-50 min-h-[300px] p-8 flex justify-center w-full">
                                {/* VISUAL PREVIEW MODE */}
                                {view === 'VISUAL' && (
                                    <div className="w-full border border-gray-300 shadow-lg scale-95 origin-top transition-all duration-300">
                                        <div
                                            style={{
                                                backgroundColor: getFooterBg(localConfig.backgroundColor),
                                                color: getFooterTextColor(localConfig.backgroundColor),
                                                padding: '3rem 2rem',
                                                textAlign: localConfig.template === 'Table' ? localConfig.alignment : 'left'
                                            }}
                                        >
                                            {/* TABLE VIEW RENDER */}
                                            {localConfig.template === 'Table' && (
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                    <div className="col-span-1">
                                                        <h4 className="font-bold mb-4" style={{ fontSize: localConfig.fontSettings.headingSize }}>{siteConfig.name}</h4>
                                                        <p className="opacity-70 max-w-sm" style={{ fontSize: localConfig.fontSettings.subHeadingSize }}>
                                                            {localConfig.subFooterText}
                                                        </p>
                                                    </div>
                                                    {localConfig.columns.map(col => (
                                                        <div key={col.id}>
                                                            <h5 className="font-bold mb-4 uppercase tracking-wider opacity-80" style={{ fontSize: localConfig.fontSettings.headingSize }}>{col.title}</h5>
                                                            <ul className="space-y-2 opacity-70" style={{ fontSize: localConfig.fontSettings.subHeadingSize }}>
                                                                {col.links.map(link => (
                                                                    <li key={link.id}><span className="hover:underline cursor-pointer">{link.label}</span></li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* CORPORATE VIEW RENDER */}
                                            {localConfig.template === 'Corporate' && (
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10 pb-8 mb-6 text-left">
                                                    {/* Company Brand - Span 4 */}
                                                    <div className="md:col-span-4 pr-8">
                                                        <h4 className="font-bold mb-3 tracking-tight" style={{ fontSize: localConfig.fontSettings.headingSize }}>
                                                            {siteConfig.name}
                                                        </h4>
                                                        <div className="opacity-70 leading-relaxed max-w-xs" style={{ fontSize: localConfig.fontSettings.subHeadingSize }}>
                                                            Providing enterprise-grade solutions for the modern digital workplace. Connecting people and technology.
                                                        </div>
                                                    </div>

                                                    {/* Contact Info - Span 5 */}
                                                    <div className="md:col-span-5">
                                                        <h5 className="font-bold mb-4 uppercase tracking-wider opacity-90 border-b border-white/20 pb-2 inline-block" style={{ fontSize: localConfig.fontSettings.subHeadingSize }}>
                                                            {getTranslation('TITLE_CONTACT_US', currentLanguage) || 'Contact Us'}
                                                        </h5>
                                                        <div className="space-y-3 opacity-80" style={{ fontSize: localConfig.fontSettings.subHeadingSize }}>
                                                            {localConfig.contactInfo.address && <div className="flex items-start gap-3"><MapPin className="w-4 h-4 flex-shrink-0 mt-1 opacity-70" /> <span>{localConfig.contactInfo.address}</span></div>}
                                                            {localConfig.contactInfo.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 flex-shrink-0 opacity-70" /> <span>{localConfig.contactInfo.email}</span></div>}
                                                            {localConfig.contactInfo.phone && <div className="flex items-center gap-3"><Phone className="w-4 h-4 flex-shrink-0 opacity-70" /> <span>{localConfig.contactInfo.phone}</span></div>}
                                                        </div>
                                                    </div>

                                                    {/* Social Links - Span 3 */}
                                                    <div className="md:col-span-3">
                                                        <h5 className="font-bold mb-4 uppercase tracking-wider opacity-90 border-b border-white/20 pb-2 inline-block" style={{ fontSize: localConfig.fontSettings.subHeadingSize }}>
                                                            {getTranslation('TITLE_CONNECT', currentLanguage) || 'Connect'}
                                                        </h5>
                                                        <div className="flex gap-3">
                                                            {localConfig.socialLinks.linkedin && <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Linkedin className="w-4 h-4" /></div>}
                                                            {localConfig.socialLinks.facebook && <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Facebook className="w-4 h-4" /></div>}
                                                            {localConfig.socialLinks.twitter && <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Twitter className="w-4 h-4" /></div>}
                                                            {localConfig.socialLinks.instagram && <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer transition-colors"><Instagram className="w-4 h-4" /></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Shared Bottom Bar */}
                                            <div className="mt-0 pt-0 text-center text-xs opacity-50 flex flex-col md:flex-row justify-between items-center gap-2">
                                                <span>{getLocalizedText(localConfig.copyright, currentLanguage)}</span>
                                                {localConfig.subFooterText && <span>{localConfig.subFooterText}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* LIST EDIT MODE */}
                                {view === 'LIST' && (
                                    <div className="w-full">
                                        {/* Table View Editor */}
                                        {localConfig.template === 'Table' && (
                                            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {localConfig.columns.map((col, idx) => (
                                                    <div key={col.id} className="bg-white border border-dashed border-gray-300 p-4 hover:border-[var(--primary-color)] transition-colors group">
                                                        <input
                                                            value={col.title}
                                                            onChange={(e) => {
                                                                const newCols = [...localConfig.columns];
                                                                newCols[idx].title = e.target.value;
                                                                handleUpdate('columns', newCols);
                                                            }}
                                                            className="font-bold mb-3 w-full border-b border-transparent hover:border-gray-200 focus:border-[var(--primary-color)] focus:outline-none"
                                                            placeholder={getTranslation('LBL_COLUMN_HEADING', currentLanguage)}
                                                        />
                                                        <div className="space-y-2">
                                                            {col.links.map((link, lIdx) => (
                                                                <div key={link.id} className="flex gap-2 text-sm">
                                                                    <input
                                                                        value={link.label}
                                                                        onChange={(e) => {
                                                                            const newCols = [...localConfig.columns];
                                                                            newCols[idx].links[lIdx].label = e.target.value;
                                                                            handleUpdate('columns', newCols);
                                                                        }}
                                                                        className="flex-1 border p-1 text-xs"
                                                                        placeholder={getTranslation('LBL_LABEL_TEXT', currentLanguage)}
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const newCols = [...localConfig.columns];
                                                                            newCols[idx].links.splice(lIdx, 1);
                                                                            handleUpdate('columns', newCols);
                                                                        }}
                                                                        className="text-red-400 hover:text-red-600"
                                                                    ><X className="w-3 h-3" /></button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => {
                                                                    const newCols = [...localConfig.columns];
                                                                    newCols[idx].links.push({ id: `l_${Date.now()}`, label: 'New Link', url: '#' });
                                                                    handleUpdate('columns', newCols);
                                                                }}
                                                                className="text-xs text-[var(--primary-color)] hover:underline flex items-center gap-1 mt-2"
                                                            ><Plus className="w-3 h-3" /> {getTranslation('LABEL_ADD_LINK', currentLanguage) || 'Add Link'}</button>
                                                        </div>
                                                        <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                                                            <button
                                                                onClick={() => {
                                                                    const newCols = localConfig.columns.filter(c => c.id !== col.id);
                                                                    handleUpdate('columns', newCols);
                                                                }}
                                                                className="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >{getTranslation('BTN_REMOVE_GROUP', currentLanguage) || 'Remove Group'}</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => handleUpdate('columns', [...localConfig.columns, { id: `c_${Date.now()}`, title: 'New Column', links: [] }])}
                                                    className="border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-gray-400 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all"
                                                >
                                                    <Plus className="w-8 h-8 mb-2" />
                                                    <span className="text-sm font-bold">{getTranslation('BTN_ADD_LINK_GROUP', currentLanguage) || 'Add Link Group'}</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Corporate View Editor */}
                                        {localConfig.template === 'Corporate' && (
                                            <div className="w-full max-w-2xl space-y-6 mx-auto">
                                                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                                                    <h5 className="font-bold mb-4 text-sm uppercase text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> {getTranslation('SECTION_CONTACT_INFO', currentLanguage)}</h5>
                                                    <div className="space-y-4">
                                                        <div><label className="text-xs font-bold text-gray-400">{getTranslation('LABEL_LOCATION', currentLanguage)}</label><input type="text" value={localConfig.contactInfo.address} onChange={(e) => handleUpdate('contactInfo', { ...localConfig.contactInfo, address: e.target.value })} className="w-full border p-2 text-sm mt-1 focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div><label className="text-xs font-bold text-gray-400">{getTranslation('LABEL_SENDER_EMAIL', currentLanguage)}</label><input type="text" value={localConfig.contactInfo.email} onChange={(e) => handleUpdate('contactInfo', { ...localConfig.contactInfo, email: e.target.value })} className="w-full border p-2 text-sm mt-1 focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                            <div><label className="text-xs font-bold text-gray-400">{getTranslation('LABEL_PHONE', currentLanguage)}</label><input type="text" value={localConfig.contactInfo.phone} onChange={(e) => handleUpdate('contactInfo', { ...localConfig.contactInfo, phone: e.target.value })} className="w-full border p-2 text-sm mt-1 focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                                                    <h5 className="font-bold mb-4 text-sm uppercase text-gray-500 flex items-center gap-2"><Globe className="w-4 h-4" /> {getTranslation('TITLE_SOCIAL_NETWORKS', currentLanguage)}</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-700" /><input type="text" placeholder="LinkedIn URL" value={localConfig.socialLinks.linkedin} onChange={(e) => handleUpdate('socialLinks', { ...localConfig.socialLinks, linkedin: e.target.value })} className="flex-1 border p-2 text-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                        <div className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" /><input type="text" placeholder="Facebook URL" value={localConfig.socialLinks.facebook} onChange={(e) => handleUpdate('socialLinks', { ...localConfig.socialLinks, facebook: e.target.value })} className="flex-1 border p-2 text-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                        <div className="flex items-center gap-2"><Twitter className="w-4 h-4 text-sky-500" /><input type="text" placeholder="Twitter URL" value={localConfig.socialLinks.twitter} onChange={(e) => handleUpdate('socialLinks', { ...localConfig.socialLinks, twitter: e.target.value })} className="flex-1 border p-2 text-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                        <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-600" /><input type="text" placeholder="Instagram URL" value={localConfig.socialLinks.instagram} onChange={(e) => handleUpdate('socialLinks', { ...localConfig.socialLinks, instagram: e.target.value })} className="flex-1 border p-2 text-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </GenericModal>
    );
};
