import * as React from 'react';

import { Share2, Trash2, History, X, Menu, ExternalLink } from 'lucide-react';
import { getItemVersions, restoreItemVersion } from '../../services/SPService';
import { useStore, getTranslation } from '../../store';
import { useSPContext } from '../../contexts/SPServiceContext';
// import { format } from 'date-fns';

interface SharePointMetadataFooterProps {
    listTitle: string;
    itemId: string;
    createdDate?: string;
    createdBy?: string;
    modifiedDate?: string;
    modifiedBy?: string;
    onDelete?: () => void;
    onVersionRestore?: () => void;
}

export const SharePointMetadataFooter: React.FC<SharePointMetadataFooterProps> = ({
    listTitle,
    itemId,
    createdDate,
    createdBy,
    modifiedDate,
    modifiedBy,
    onDelete,
    onVersionRestore
}) => {
    const { currentLanguage } = useStore();
    const { context } = useSPContext();

    const [showVersions, setShowVersions] = React.useState(false);
    const [versions, setVersions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleOpenOOTB = () => {
        const siteUrl = context.pageContext.web.absoluteUrl;
        const url = `${siteUrl}/Lists/${listTitle}/DispForm.aspx?ID=${itemId}`;
        window.open(url, '_blank');
    };

    const handleShare = () => {
        const url = `${window.location.origin}${window.location.pathname}?ID=${itemId}&List=${listTitle}`;
        navigator.clipboard.writeText(url);
        alert('Item link copied to clipboard!');
    };



    const handleViewVersions = async () => {
        setLoading(true);
        setShowVersions(true);
        try {
            const history = await getItemVersions(listTitle, parseInt(itemId));
            setVersions(history);
        } catch (error) {
            console.error('Error fetching versions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (versionLabel: string) => {
        if (confirm(`Are you sure you want to restore version ${versionLabel}?`)) {
            try {
                await restoreItemVersion(listTitle, parseInt(itemId), versionLabel);
                alert('Version restored successfully! Please refresh or re-save.');
                setShowVersions(false);
                if (onVersionRestore) onVersionRestore();
            } catch (error) {
                console.error('Error restoring version:', error);
            }
        }
    };



    // Define the columns that we explicitly care about (provisioned columns)
    const PROVISIONED_COLUMNS: Record<string, string[]> = {
        'Documents': ['Title', 'DocumentYear', 'DocStatus', 'ItemRank', 'DocType', 'DocumentDescriptions', 'SortOrder', 'Translations', 'ImageUrl', 'ImageName'],
        'News': ['Title', 'MultilingualTitle', 'Status', 'PublishDate', 'Description', 'Thumbnail', 'ReadMoreURL', 'ReadMoreText', 'ReadMoreEnabled', 'SEOConfig', 'Translations', 'ImageUrl', 'ImageName'],
        'Events': ['Title', 'MultilingualTitle', 'StartDate', 'EndDate', 'Location', 'Description', 'Category', 'Translations', 'Status', 'ImageUrl', 'ImageName', 'ReadMoreURL', 'ReadMoreText', 'ReadMoreEnabled', 'SEOConfig'],
        'SmartPages': ['Title', 'MultilingualTitle', 'Slug', 'PageStatus', 'IsHomePage', 'Description', 'SEOConfig', 'VersionNote'],
        'Contacts': ['Title', 'Status', 'SortOrder', 'JobTitle', 'Company', 'Email', 'Phone', 'Description', 'Translations', 'SocialLinks', 'ImageUrl', 'ImageName'],
        'ImageSlider': ['Title', 'Subtitle', 'Description', 'Status', 'SortOrder', 'CtaText', 'CtaUrl', 'Translations', 'ImageUrl', 'ImageName']
    };

    const formatDateDDMonYYYY = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // const month = months[date.getMonth()];
        const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        // Native toLocaleDateString approach for dd-Mon-yyyy
        const datePart = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

        return `${datePart} ${time}`;
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between w-full gap-4 text-[11px] text-gray-400">
                <div className="flex flex-col leading-tight">

                    <div>
                        <span className="font-medium">Created</span> <span className="text-[var(--primary-color)] font-medium">{createdDate?.substring(0, 10)}</span>
                        <span className="ml-1 font-medium">By</span> <span className="text-gray-500">{createdBy || 'System'}</span>
                    </div>
                    <div>
                        <span className="font-medium">Last modified</span> <span className="text-[var(--primary-color)] font-medium">{modifiedDate?.substring(0, 10)}</span>
                        <span className="ml-1 font-medium">By</span> <span className="text-gray-500">{modifiedBy || 'System'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenOOTB}
                        className="flex items-center gap-1.5 hover:text-[var(--primary-color)] transition-colors py-1"
                    >
                        <ExternalLink className="w-3 h-3 opacity-70" />
                        <span>{getTranslation('LABEL_OPEN_OOTB_FORM', currentLanguage) || 'Open out-of-the-box form'}</span>
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 hover:text-[var(--primary-color)] transition-colors py-1"
                    >
                        <Share2 className="w-3 h-3 opacity-70" />
                        <span>Share this {listTitle.slice(0, -1)}</span>
                    </button>





                    {onDelete && (
                        <>
                            <span className="text-gray-300">|</span>
                            <button
                                onClick={onDelete}
                                className="flex items-center gap-1.5 hover:text-red-500 transition-colors py-1"
                            >
                                <Trash2 className="w-3 h-3 opacity-70" />
                                <span>Delete this item</span>
                            </button>
                        </>
                    )}

                    <span className="text-gray-300">|</span>

                    <button
                        onClick={handleViewVersions}
                        className="flex items-center gap-1.5 hover:text-[var(--primary-color)] transition-colors py-1"
                    >
                        <History className="w-3 h-3 opacity-70" />
                        <span>Version History</span>
                    </button>
                </div>
            </div>

            {/* Version History Modal */}
            {/* Version History Modal */}
            {showVersions && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-md shadow-2xl w-[1000px] flex flex-col max-h-[90vh] overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h3 className="text-xl font-bold text-[var(--primary-color)] flex items-center gap-2">
                                Version History
                            </h3>
                            <div className="flex items-center gap-2">
                                <Menu className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                                <button onClick={() => setShowVersions(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center p-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
                                </div>
                            ) : versions.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white sticky top-0 z-10">
                                        <tr className="border-b border-gray-100">
                                            <th className="py-3 px-6 font-bold text-[var(--primary-color)] w-16">No</th>
                                            <th className="py-3 px-6 font-bold text-[var(--primary-color)]">Info</th>
                                            <th className="py-3 px-6 font-bold text-[var(--primary-color)] w-48">Modified by</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {versions.map((version, index) => {
                                            // Determine which fields to show based on changes from previous version
                                            const previousVersion = versions[index + 1];
                                            const relevantFields = PROVISIONED_COLUMNS[listTitle] || [];

                                            const changedFields = relevantFields.filter(key => {
                                                const currentVal = version[key];

                                                // 1. If we have a previous version, compare values
                                                if (previousVersion) {
                                                    const prevVal = previousVersion[key];
                                                    // Simple loose comparison (covers "2" vs 2). 
                                                    // Watch out for null vs empty string if you want those to be equal.
                                                    // For now, simple diff.
                                                    if (currentVal != prevVal) return true;
                                                    return false;
                                                }

                                                // 2. If NO previous version (this is the oldest version 1.0), 
                                                // show all fields that have a value (i.e. created with these values)
                                                return currentVal !== null && currentVal !== undefined && currentVal !== '';
                                            });

                                            return (
                                                <tr key={version.VersionLabel} className="group hover:bg-gray-50/30 transition-colors align-top">
                                                    <td className="py-4 px-6 text-gray-700 font-medium">{version.VersionLabel}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="space-y-2">
                                                            {changedFields.length > 0 ? (
                                                                changedFields.map(key => {
                                                                    let displayValue = undefined;
                                                                    const rawVal = version[key];

                                                                    // Format known date fields
                                                                    if (['PublishDate', 'StartDate', 'EndDate'].includes(key) && rawVal) {
                                                                        displayValue = formatDateDDMonYYYY(rawVal);
                                                                    } else {
                                                                        displayValue = String(rawVal);
                                                                    }

                                                                    return (
                                                                        <div key={key} className="grid grid-cols-[140px_1fr] gap-4">
                                                                            <div className="text-gray-900 font-medium break-words">{key}</div>
                                                                            <div className="text-gray-600 break-words">{displayValue}</div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="text-gray-400 italic">No tracked changes</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-[var(--primary-color)] font-medium mb-1">
                                                                {formatDateDDMonYYYY(version.Created)}
                                                            </span>
                                                            <span className="text-gray-700 font-medium">{version.Editor?.LookupValue || version.Editor?.Title || 'System'}</span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleRestore(version.VersionLabel); }}
                                                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline self-start opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                Restore this version
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12 text-gray-500">No version history found.</div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-white">
                            <button
                                onClick={() => setShowVersions(false)}
                                className="px-6 py-2 border border-[var(--primary-color)] text-[var(--primary-color)] text-sm font-bold hover:bg-[var(--primary-color)]/10 transition-colors rounded-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
