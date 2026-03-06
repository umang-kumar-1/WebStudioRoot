
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore, getTranslation } from '../../store';
import { GenericModal } from './SharedModals';
import { ContactQuery, ContactQueryField } from '../../types';
import {
    Search, RefreshCw, X, FileSpreadsheet,
    Trash2, Info, Eye, Mail, Globe, Clock
} from 'lucide-react';

// --- SUB-COMPONENT: DETAIL VIEW MODAL ---
const QueryDetailModal = ({ query, onClose }: { query: ContactQuery, onClose: () => void }) => {
    const { currentLanguage } = useStore();
    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[600px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-[var(--primary-color)] flex items-center gap-2">
                        <Mail className="w-5 h-5" /> {getTranslation('TITLE_SUBMISSION_DETAILS', currentLanguage)}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-0 overflow-y-auto flex-1 bg-white">
                    {/* Header Info */}
                    <div className="bg-blue-50/50 p-6 border-b border-gray-100 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{getTranslation('LABEL_SUBMITTED_ON', currentLanguage)}</span>
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {new Date(query.created).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{getTranslation('LABEL_STATUS', currentLanguage)}</span>
                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full inline-block ${query.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                {query.status}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{getTranslation('LABEL_SOURCE_PAGE', currentLanguage)}</span>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Globe className="w-4 h-4 text-gray-400" />
                                {query.pageName}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{getTranslation('LABEL_SENDER_EMAIL', currentLanguage)}</span>
                            <div className="text-gray-700">{query.email || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="p-6 space-y-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-100 pb-2 mb-4">{getTranslation('LABEL_FORM_DATA', currentLanguage)}</h4>
                        {query.fields && query.fields.length > 0 ? (
                            query.fields.map((field: ContactQueryField) => (
                                <div key={field.id} className="space-y-1">
                                    <label className="text-xs font-bold text-[var(--primary-color)]">{field.label}</label>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-sm text-sm text-gray-800 whitespace-pre-wrap">
                                        {field.value || <span className="text-gray-400 italic">{getTranslation('LABEL_EMPTY', currentLanguage)}</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Legacy Support fallback
                            <div className="space-y-4 text-sm">
                                {query.firstName && <div><span className="font-bold text-gray-600">First Name:</span> {query.firstName}</div>}
                                {query.lastName && <div><span className="font-bold text-gray-600">Last Name:</span> {query.lastName}</div>}
                                {query.email && <div><span className="font-bold text-gray-600">Email:</span> {query.email}</div>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm shadow-sm">{getTranslation('BTN_MARK_READ', currentLanguage)}</button>
                    <button onClick={onClose} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold rounded-sm hover:opacity-90 shadow-sm">{getTranslation('BTN_CLOSE', currentLanguage)}</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- MAIN MANAGER ---
export const ContactQueryManager = ({ onClose }: { onClose: () => void }) => {
    const { contactQueries, deleteContactQuery, currentLanguage } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewingQuery, setViewingQuery] = useState<ContactQuery | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ContactQuery; direction: 'asc' | 'desc' } | null>({ key: 'created', direction: 'desc' });

    // Helper: Sort Data
    const sortedData = React.useMemo(() => {
        let sortableItems = [...contactQueries];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [contactQueries, sortConfig]);

    // Helper: Filter Data
    const filteredData = sortedData.filter((item) => {
        const searchStr = searchQuery.toLowerCase();
        // Global search across common fields
        return (
            (item.pageName?.toLowerCase() || '').includes(searchStr) ||
            (item.email?.toLowerCase() || '').includes(searchStr) ||
            item.status.toLowerCase().includes(searchStr) ||
            // Search inside dynamic fields
            (item.fields && item.fields.some(f => f.value.toLowerCase().includes(searchStr)))
        );
    });

    const handleSort = (key: keyof ContactQuery) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectRow = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = () => {
        if (selectedIds.length > 0) {
            if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
                deleteContactQuery(selectedIds);
                setSelectedIds([]);
            }
        }
    };

    const handleExport = () => {
        if (filteredData.length === 0) {
            alert("No data to export");
            return;
        }

        // Prepare CSV headers
        const headers = ['ID', 'Page Name', 'Email', 'Date', 'Status'];

        // Get all unique field labels from all queries
        const allFieldLabels = new Set<string>();
        filteredData.forEach(query => {
            if (query.fields && query.fields.length > 0) {
                query.fields.forEach(field => allFieldLabels.add(field.label));
            }
        });

        // Add field labels to headers
        headers.push(...Array.from(allFieldLabels));

        // Prepare CSV rows
        const rows = filteredData.map(query => {
            const row: string[] = [
                query.id,
                query.pageName || query.smartPage || 'Unknown',
                query.email || 'Anonymous',
                new Date(query.created).toLocaleString(),
                query.status
            ];

            // Add field values
            allFieldLabels.forEach(label => {
                const field = query.fields?.find(f => f.label === label);
                row.push(field ? field.value : '');
            });

            return row;
        });

        // Convert to CSV format
        const csvContent = [
            headers.map(h => `"${h}"`).join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `contact_queries_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRefresh = () => {
        setSearchQuery('');
        setSortConfig({ key: 'created', direction: 'desc' });
    };

    return (
        <GenericModal
            className="contact-query-popup"
            title={getTranslation('TITLE_CONTACT_QUERIES', currentLanguage)}
            onClose={onClose}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
            headerIcons={<Info className="w-5 h-5 text-[var(--primary-color)]" />}
        >
            <div className="flex flex-col h-[75vh] bg-white">

                {/* Toolbar */}
                <div className="px-6 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-600">
                            {getTranslation('MSG_SHOWING', currentLanguage)} {filteredData.length} {getTranslation('LABEL_OF', currentLanguage)} {contactQueries.length}
                        </span>

                        <div className="flex items-center bg-white border border-gray-300 px-2 py-1.5 h-9 w-80 rounded-sm relative">
                            <input
                                type="text"
                                placeholder={getTranslation('PLACEHOLDER_SEARCH_CONTACT', currentLanguage)}
                                className="flex-1 outline-none text-sm text-gray-700 pr-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors"
                                    title={getTranslation('BTN_CLEAR_SEARCH', currentLanguage)}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={selectedIds.length === 0}
                            className={`px-4 py-1.5 text-xs font-bold border rounded-sm transition-colors flex items-center gap-1 ${selectedIds.length > 0 ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' : 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed'}`}
                        >
                            <Trash2 className="w-3 h-3" /> {getTranslation('BTN_DELETE', currentLanguage)}
                        </button>
                        <button onClick={handleExport} className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-green-700 rounded-sm flex items-center gap-1 text-xs font-bold" title={getTranslation('BTN_EXPORT', currentLanguage)}>
                            <FileSpreadsheet className="w-3 h-3" /> {getTranslation('BTN_EXPORT', currentLanguage)}
                        </button>
                        <button onClick={handleRefresh} className="p-2 bg-white border border-gray-300 hover:bg-gray-50 text-[var(--primary-color)] rounded-sm" title={getTranslation('BTN_REFRESH', currentLanguage)}>
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-white relative">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-white text-xs text-gray-500 font-bold sticky top-0 z-10 shadow-sm uppercase tracking-wide">
                            <tr>
                                <th className="p-0 border-r border-b border-gray-200 w-10 text-center bg-gray-50">
                                    <div className="h-full flex items-center justify-center p-2">
                                        <input type="checkbox" onChange={() => {
                                            if (selectedIds.length === filteredData.length && filteredData.length > 0) setSelectedIds([]);
                                            else setSelectedIds(filteredData.map(d => d.id));
                                        }} checked={selectedIds.length === filteredData.length && filteredData.length > 0} />
                                    </div>
                                </th>
                                <th className="p-3 border-r border-b border-gray-200 w-24">{getTranslation('LABEL_ID', currentLanguage)}</th>
                                <th className="p-3 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('pageName')}>{getTranslation('LABEL_PAGE_NAME', currentLanguage)}</th>
                                <th className="p-3 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('email')}>{getTranslation('LABEL_SUBMITTED_BY', currentLanguage)}</th>
                                <th className="p-3 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('created')}>{getTranslation('LABEL_DATE', currentLanguage)}</th>
                                <th className="p-3 border-r border-b border-gray-200 w-32 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>{getTranslation('LABEL_STATUS', currentLanguage)}</th>
                                <th className="p-3 border-b border-gray-200 w-24 text-center">{getTranslation('LABEL_ACTION', currentLanguage)}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {filteredData.length > 0 ? filteredData.map((item, idx) => (
                                <tr key={item.id} className={`border-b border-gray-100 hover:bg-[var(--brand-light)] transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="p-3 text-center border-r border-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelectRow(item.id)}
                                        />
                                    </td>
                                    <td className="p-3 border-r border-gray-100 font-mono text-xs text-gray-500">{item.id.substring(3, 10)}...</td>
                                    <td className="p-3 border-r border-gray-100 font-medium">{item.pageName || item.smartPage || 'Unknown'}</td>
                                    <td className="p-3 border-r border-gray-100 text-blue-600">
                                        <div className="flex items-center gap-2">
                                            {item.email || 'Anonymous'}
                                        </div>
                                    </td>
                                    <td className="p-3 border-r border-gray-100 text-xs text-gray-500">{new Date(item.created).toLocaleString()}</td>
                                    <td className="p-3 border-r border-gray-100">
                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${item.status === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => setViewingQuery(item)} className="p-1.5 text-gray-400 hover:text-[var(--primary-color)] hover:bg-white rounded-sm transition-colors" title={getTranslation('BTN_VIEW_DETAILS', currentLanguage)}>
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr key="no-data">
                                    <td colSpan={7} className="p-12 text-center text-gray-400 italic">
                                        {getTranslation('MSG_NO_SUBMISSIONS', currentLanguage)}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-50 flex items-center gap-2 rounded-sm">
                        {getTranslation('BTN_CLOSE', currentLanguage)} <Info className="w-3 h-3 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Detail View */}
            {viewingQuery && <QueryDetailModal query={viewingQuery} onClose={() => setViewingQuery(null)} />}
        </GenericModal >
    );
};
