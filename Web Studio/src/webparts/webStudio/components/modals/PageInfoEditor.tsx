
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore, getLocalizedText } from '../../store';
import { SharedVersionHistoryModal } from './SharedModals';
import { JoditRichTextEditor } from '../JoditEditor';
import {
    X, Menu, Wand2, Trash2, ExternalLink,
} from 'lucide-react';

export const PageInfoEditor = ({ onClose }: { onClose: () => void }) => {
    const { pages, currentPageId, updatePage, currentLanguage } = useStore();
    const activePage = pages.find(p => p.id === currentPageId);

    const [activeTab, setActiveTab] = useState<'BASIC' | 'SEO'>('BASIC');
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        isHomePage: false,
        description: '',
        seoTitle: '',
        metaDescription: '',
        keywords: ''
    });

    useEffect(() => {
        if (activePage) {
            setFormData({
                title: getLocalizedText(activePage.title, 'en'), // Editing English title primarily for now
                isHomePage: activePage.isHomePage || false,
                description: activePage.description || '',
                seoTitle: activePage.seo?.title || '',
                metaDescription: activePage.seo?.description || '',
                keywords: activePage.seo?.keywords || ''
            });
        }
    }, [activePage]);

    if (!activePage) return null;

    const handleSave = () => {
        updatePage({
            ...activePage,
            title: { ...activePage.title, en: formData.title }, // Simple update for English
            isHomePage: formData.isHomePage,
            description: formData.description,
            seo: {
                title: formData.seoTitle,
                description: formData.metaDescription,
                keywords: formData.keywords
            },
            modifiedDate: new Date().toISOString()
        });
        onClose();
    };

    const handleSuggestAI = () => {
        setFormData(prev => ({
            ...prev,
            seoTitle: `${prev.title} - Official Page`,
            metaDescription: `Learn more about ${prev.title}. Comprehensive guide and details available here.`,
            keywords: `${prev.title.toLowerCase()}, corporate, info, official`
        }));
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[900px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden relative">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">Edit - {getLocalizedText(activePage.title, currentLanguage)}</h3>
                    <div className="flex items-center gap-4">
                        <button className="p-1 hover:bg-gray-100 rounded-sm"><Menu className="w-5 h-5 text-gray-500" /></button>
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    <button
                        onClick={() => setActiveTab('BASIC')}
                        className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'BASIC' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        BASIC INFORMATION
                    </button>
                    <button
                        onClick={() => setActiveTab('SEO')}
                        className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'SEO' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        SEO
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {activeTab === 'BASIC' && (
                        <div className="w-full bg-white p-8 border border-gray-200 shadow-sm rounded-sm space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title<span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Page Type</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                                            checked={formData.isHomePage}
                                            onChange={e => setFormData({ ...formData, isHomePage: e.target.checked })}
                                        />
                                        <label className="text-sm text-gray-700">Home Page</label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Content</label>
                                </div>
                                <JoditRichTextEditor
                                    value={formData.description}
                                    onChange={(newValue) => setFormData({ ...formData, description: newValue })}
                                    placeholder="Write Description"
                                    height={300}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'SEO' && (
                        <div className="w-full bg-white p-8 border border-gray-200 shadow-sm rounded-sm space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSuggestAI}
                                    className="bg-[var(--primary-color)] text-white px-4 py-2 text-xs font-bold flex items-center gap-2 hover:opacity-90 shadow-sm rounded-sm"
                                >
                                    <Wand2 className="w-3 h-3" /> Suggest with AI
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Title</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                    value={formData.seoTitle}
                                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Description</label>
                                <JoditRichTextEditor
                                    value={formData.metaDescription}
                                    onChange={(val: string) => setFormData({ ...formData, metaDescription: val })}
                                    placeholder="Write Meta Description"
                                    height={180}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keywords (comma-separated)</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                    value={formData.keywords}
                                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
                    <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex gap-1">Created <span className="text-[var(--primary-color)] font-medium">25 Nov 2024</span> By <span className="text-[var(--primary-color)] font-medium">Sameer Gupta</span></div>
                        <div className="flex gap-1">Last modified <span className="text-[var(--primary-color)] font-medium">{new Date(activePage.modifiedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> By <span className="text-[var(--primary-color)] font-medium">{activePage.modifiedBy || 'System'}</span></div>

                        <div className="flex gap-4 mt-2 font-bold text-[var(--primary-color)]">
                            <button className="hover:underline flex items-center gap-1 opacity-50 cursor-not-allowed"><ExternalLink className="w-3 h-3" /> Open out-of-the-box form</button>
                            <span className="text-gray-300">|</span>
                            <button className="hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete This Page</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setShowVersionHistory(true)} className="hover:underline flex items-center gap-1">Version History</button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 rounded-sm">Save</button>
                    </div>
                </div>
            </div>

            {/* Version History Modal Overlay */}
            {showVersionHistory && <SharedVersionHistoryModal onClose={() => setShowVersionHistory(false)} />}
        </div>,
        document.body
    );
};
