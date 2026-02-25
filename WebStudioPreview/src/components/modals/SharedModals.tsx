import { createPortal } from 'react-dom';
import { X, HelpCircle, Trash2, Info } from 'lucide-react';
import { useStore } from '../../store';

// --- EDIT TRIGGER COMPONENT ---
export const EditTrigger = ({ labelKey, className = "", title = "Edit Translation" }: { labelKey: string, className?: string, title?: string }) => {
    const { openLabelEditor } = useStore();
    return (
        <div
            className={`transition-opacity cursor-pointer inline-flex align-middle hover:opacity-100 opacity-70 ${className}`}
            title={title}
            onClick={(e) => {
                e.stopPropagation();
                openLabelEditor(labelKey);
            }}
        >
            <Info className="w-3 h-3 transition-colors" style={{ color: 'var(--icon-color)' }} />
        </div>
    );
};

// --- SHARED VERSION HISTORY MODAL (SINGLE SOURCE OF TRUTH) ---
export const SharedVersionHistoryModal = ({ onClose, data }: { onClose: () => void, data?: any[] }) => {
    // Default mock data structure if none provided, to match the standardized screenshot layout
    const versions = data || [
        { no: 134, info: [{ label: 'PageContainers', value: 'HOCHHUTH CONSULTING GMBH' }, { label: 'Action', value: 'Content Update' }], date: '03/02/2026 12:45PM', user: 'SM', badge: 'SM' },
        { no: 133, info: [], date: '30/01/2026 10:54AM', user: 'SM', badge: 'SM' },
        { no: 132, info: [{ label: 'ContentStatus', value: 'Edit-Mode' }, { label: 'PublishingStatus', value: 'Non-Published' }], date: '13/01/2026 2:56PM', user: 'SG', badge: 'SG' },
        { no: 131, info: [{ label: 'ContentStatus', value: 'Protected' }, { label: 'PublishingStatus', value: 'Published' }], date: '13/01/2026 12:25PM', user: 'SG', badge: 'SG' },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[900px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">Version History</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-auto p-0 bg-white">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-white text-[var(--primary-color)] font-bold border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 w-16 border-r border-gray-100">No</th>
                                <th className="px-6 py-3 border-r border-gray-100">Info</th>
                                <th className="px-6 py-3 w-64">Modified by</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {versions.map((v: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 align-top text-gray-900 font-medium border-r border-gray-100">{v.no}</td>
                                    <td className="px-6 py-4 align-top border-r border-gray-100">
                                        <div className="space-y-2">
                                            {v.info && v.info.length > 0 ? v.info.map((inf: any, idx: number) => (
                                                <div key={idx} className="grid grid-cols-[140px_1fr] gap-4">
                                                    <span className="text-gray-900 font-medium">{inf.label}</span>
                                                    <span className="text-gray-700 truncate">{inf.value}</span>
                                                </div>
                                            )) : <span className="text-gray-400 italic">No details recorded</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center gap-2 text-[var(--primary-color)]">
                                            <span>{v.date}</span>
                                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-sm uppercase bg-blue-100 text-blue-700">{v.badge}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm shadow-sm transition-colors">Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const GenericModal = ({ title, subtitle, children, onClose, width = 'max-w-2xl', noFooter = false, headerIcons = null, className = '', customFooter = null }: any) => (
    <div className={`bg-white rounded-sm shadow-2xl flex flex-col max-h-[90vh] w-full ${width} relative animate-in fade-in zoom-in-95 duration-200 z-50 border border-gray-300 ${className}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-[var(--primary-color)]">{title}</h2>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
                {headerIcons}
                <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded-sm hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50/50 relative" style={{ padding: '14px 21px' }}>
            {children}
        </div>
        {!noFooter && !customFooter && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 rounded-b-sm flex-shrink-0 z-10">
                <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-sm hover:bg-gray-50 text-sm font-bold transition-colors">Cancel</button>
                <button onClick={onClose} className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-sm hover:opacity-90 text-sm font-bold shadow-sm transition-colors">Save Changes</button>
            </div>
        )}
        {customFooter && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-sm flex-shrink-0 w-full z-10 flex justify-end gap-3">
                {customFooter}
            </div>
        )}
    </div>
);

export const ConfirmDeleteDialog = ({ title, message, onConfirm, onCancel }: any) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-[450px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50">
                    <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title || "Confirm Deletion"}</h3>
                <p className="text-sm text-gray-500 leading-relaxed px-4">{message || "Are you sure you want to delete this item? This action cannot be undone."}</p>
            </div>
            <div className="flex border-t border-gray-200 bg-gray-50">
                <button onClick={onCancel} className="flex-1 py-4 text-sm font-bold text-gray-700 hover:bg-white transition-colors border-r border-gray-200">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">Delete</button>
            </div>
        </div>
    </div>
);

export const TabButton = ({ active, label, onClick, icon: Icon }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${active ? 'border-[var(--primary-color)] text-[var(--primary-color)] bg-[var(--brand-light)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
    >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
    </button>
);

export const HelpGuideModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <div className="bg-white w-[700px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-[var(--primary-color)]" />
                <h3 className="text-lg font-bold text-[var(--primary-color)]">Help Guide</h3>
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 text-sm text-gray-700 flex-1">
                <section>
                    <h4 className="font-bold text-base mb-2 text-gray-900">Introduction</h4>
                    <p>Welcome to the Management Module. Use this tool to organize your content effectively.</p>
                </section>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end flex-shrink-0 bg-white">
                <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-sm font-bold rounded-sm">Close</button>
            </div>
        </div>
    </div>
);
