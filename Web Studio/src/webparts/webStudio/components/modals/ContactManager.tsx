import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore, getTranslation, getItemTranslation, GLOBAL_DEFAULT_IMAGE } from '../../store';
import { ContactItem } from '../../types';
import { GenericModal, ConfirmDeleteDialog } from './SharedModals';
import { JoditRichTextEditor } from '../JoditEditor';
import { SharePointMetadataFooter } from '../common/SharePointMetadataFooter';
import { Search, Plus, Trash2, X, Image as ImageIcon, Monitor, List as ListIcon, Pencil, ChevronDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';

// ==================== Create Contact Modal ====================
export const CreateContactModal = ({ onSave, onCancel }: { onSave: (contact: ContactItem) => void, onCancel: () => void }) => {
    const { currentLanguage } = useStore();
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState(false);

    const handleCreate = () => {
        if (!fullName.trim()) {
            setError(true);
            return;
        }

        const id = `temp_${Date.now()}`;
        const newContact: ContactItem = {
            id,
            fullName: fullName.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            status: 'Draft',
            sortOrder: 0,
            jobTitle: '',
            company: '',
            email: '',
            phone: '',
            description: '',
            imageUrl: '',
            imageName: '',
            translations: {}
        };

        onSave(newContact);
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[500px] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
                    <h3 className="text-lg font-bold text-[var(--primary-color)]">{getTranslation('TITLE_CREATE_CONTACT', currentLanguage)}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm font-medium flex items-center gap-2">
                            {getTranslation('MSG_REQ_TITLE', currentLanguage)}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            {getTranslation('LABEL_TITLE', currentLanguage)} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => { setFullName(e.target.value); setError(false); }}
                            placeholder={getTranslation('PLACEHOLDER_CONTACT_NAME', currentLanguage)}
                            className={`w-full border p-3 text-sm outline-none rounded-sm transition-shadow ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[var(--primary-color)]'}`}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                {getTranslation('LABEL_FIRST_NAME', currentLanguage) || 'First Name'}
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => { setFirstName(e.target.value); setError(false); }}
                                placeholder="John"
                                className="w-full border border-gray-300 p-3 text-sm outline-none rounded-sm transition-shadow focus:border-[var(--primary-color)]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                {getTranslation('LABEL_LAST_NAME', currentLanguage) || 'Last Name'}
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => { setLastName(e.target.value); setError(false); }}
                                placeholder="Doe"
                                className="w-full border border-gray-300 p-3 text-sm outline-none rounded-sm transition-shadow focus:border-[var(--primary-color)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm"
                    >
                        {getTranslation('BTN_CANCEL', currentLanguage)}
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2 bg-[var(--primary-color)] text-white hover:opacity-90 text-sm font-bold rounded-sm shadow-sm transition-colors"
                    >
                        {getTranslation('BTN_CREATE', currentLanguage)}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const DUMMY_IMAGE = "";

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

// ==================== Contact Editor ====================
export const ContactEditor = ({ item, onSave, onCancel, onDelete }: any) => {
    const { images, uploadImage, currentLanguage } = useStore();
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('BASIC');
    const [imgTab, setImgTab] = useState('COPY');
    const [searchImg, setSearchImg] = useState('');
    const pasteAreaRef = React.useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<any>({
        id: item.id || 0,
        fullName: item.fullName || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        status: item.status || 'Draft',
        sortOrder: item.sortOrder || 0,
        jobTitle: item.jobTitle || '',
        company: item.company || '',
        email: item.email || '',
        phone: item.phone || '',
        description: item.description || '',
        imageUrl: item.imageUrl || GLOBAL_DEFAULT_IMAGE,
        imageName: item.imageName || '',
        translations: item.translations || { en: { fullName: '', firstName: '', lastName: '', jobTitle: '', description: '' } },
    });

    const updateField = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));

    const handleImagePaste = async (e: React.ClipboardEvent) => {
        e.preventDefault();
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (!file) continue;

                setIsUploading(true);
                try {
                    const result = await uploadImage(file, 'Contacts', { Title: formData.fullName || 'Contact' });
                    if (result) {
                        setFormData({
                            ...formData,
                            imageUrl: result.url,
                            imageName: result.name
                        });
                    }
                } catch (error) {
                    console.error('Image upload failed:', error);
                } finally {
                    setIsUploading(false);
                }
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await uploadImage(file, 'Contacts', { Title: formData.fullName || 'Contact' });
            if (result) {
                setFormData({
                    ...formData,
                    imageUrl: result.url,
                    imageName: result.name
                });
            }
        } catch (error) {
            console.error('Image upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = () => {
        const updatedContact: ContactItem = {
            ...formData,
        };
        onSave(updatedContact);
    };



    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white w-[1000px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">{getTranslation('TITLE_EDIT_CONTACT', currentLanguage)} - {formData.fullName}</h3>
                    <div className="flex items-center gap-4">
                        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-sm"><MenuIcon /></button>
                        <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0 gap-6">
                    {[
                        { id: 'BASIC', label: getTranslation('TAB_BASIC_INFO', currentLanguage) },
                        { id: 'IMAGE', label: getTranslation('TAB_IMAGE', currentLanguage) }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
                    {/* BASIC INFORMATION */}
                    {activeTab === 'BASIC' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_FIRST_NAME', currentLanguage) || 'First Name'}</label>
                                        <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_LAST_NAME', currentLanguage) || 'Last Name'}</label>
                                        <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_FULL_NAME', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.fullName} onChange={e => updateField('fullName', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_COMPANY', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.company} onChange={e => updateField('company', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_JOB_TITLE', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_EMAIL', currentLanguage)}</label>
                                        <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_SORT_ORDER', currentLanguage)}</label>
                                        <input className="w-32 border border-gray-300 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" type="number" value={formData.sortOrder} onChange={e => updateField('sortOrder', parseInt(e.target.value) || 0)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getTranslation('LABEL_DESCRIPTION', currentLanguage)}</label>
                                    <div className="border border-gray-300 rounded-sm overflow-hidden">
                                        <JoditRichTextEditor
                                            value={formData.description}
                                            onChange={(newValue) => updateField('description', newValue)}
                                            height={300}
                                        />
                                    </div>
                                </div>
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
                                                className="flex-1 border border-gray-200 p-2 text-sm text-gray-600 rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
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
                                        <input className="w-full border border-gray-300 p-2 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" value={formData.imageName} onChange={e => updateField('imageName', e.target.value)} />
                                    </div>
                                    <button onClick={() => { updateField('imageUrl', ''); updateField('imageName', ''); }} className="text-xs text-[var(--primary-color)] hover:underline flex items-center gap-1">
                                        <X className="w-3 h-3" /> {getTranslation('BTN_REMOVE', currentLanguage)}
                                    </button>
                                </div>
                            </div>

                            {/* Bottom: Selection Tabs */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex gap-6 border-b border-gray-200 mb-6">
                                    {['COPY', 'UPLOAD', 'CHOOSE'].map(subId => {
                                        return (
                                            <button
                                                key={subId}
                                                onClick={() => setImgTab(subId)}
                                                className={`pb-2 text-xs font-bold uppercase transition-colors ${imgTab === subId ? 'border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {subId === 'CHOOSE' ? `${getTranslation('LABEL_CHOOSE_FROM_GALLERY', currentLanguage)} (${images.length})` :
                                                    subId === 'COPY' ? 'COPY & PASTE' : 'UPLOAD'}
                                            </button>
                                        );
                                    })}
                                </div>

                                {imgTab === 'COPY' && (
                                    <div className="space-y-4">
                                        <div
                                            ref={pasteAreaRef}
                                            onPaste={handleImagePaste}
                                            className="h-32 border-2 border-dashed border-[var(--primary-color)] bg-blue-50/20 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-blue-50/50 transition-all group"
                                            onClick={() => pasteAreaRef.current?.focus()}
                                            tabIndex={0}
                                        >
                                            <Monitor className="w-8 h-8 mb-2 text-[var(--primary-color)] opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-bold text-[var(--primary-color)]">{getTranslation('MSG_PASTE_OR_UPLOAD', currentLanguage)}</span>
                                            {isUploading && <span className="text-[10px] animate-pulse mt-1 text-[var(--primary-color)] font-bold">{getTranslation('MSG_UPLOADING', currentLanguage)}</span>}
                                        </div>
                                    </div>
                                )}

                                {imgTab === 'UPLOAD' && (
                                    <div className="flex justify-center py-6">
                                        <label className={`bg-[var(--primary-color)] text-white px-8 py-3 text-sm font-bold shadow-sm cursor-pointer hover:opacity-90 rounded-sm flex items-center gap-3 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <Plus className="w-5 h-5" /> {isUploading ? getTranslation('MSG_UPLOADING', currentLanguage) : 'Upload Image'}
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isUploading} />
                                        </label>
                                    </div>
                                )}



                                {imgTab === 'CHOOSE' && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input
                                                className="w-full border border-gray-300 p-2 pl-9 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                                                placeholder={getTranslation('LABEL_SEARCH_ITEMS', currentLanguage)}
                                                value={searchImg}
                                                onChange={e => setSearchImg(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1">
                                            {images.filter(img => img.name.toLowerCase().includes(searchImg.toLowerCase())).map(img => (
                                                <div
                                                    key={img.id}
                                                    onClick={() => { updateField('imageUrl', img.url); updateField('imageName', img.name); }}
                                                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-sm border-2 transition-all ${formData.imageUrl === img.url ? 'border-[var(--primary-color)] shadow-md' : 'border-transparent hover:border-blue-200'}`}
                                                >
                                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Footer with Metadata & Actions */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100 px-8 py-4">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <SharePointMetadataFooter
                                listTitle="Contacts"
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
                            <button
                                onClick={onCancel}
                                className="px-8 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm uppercase tracking-wide transition-colors"
                            >
                                {getTranslation('BTN_CANCEL', currentLanguage)}
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 transition-all rounded-sm uppercase tracking-wide"
                            >
                                {getTranslation('BTN_SAVE', currentLanguage)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ==================== Contact Manager ====================
export const ContactManager = ({ onClose }: { onClose: () => void }) => {
    const { contacts, addContact, updateContact, deleteContact, currentLanguage } = useStore();
    const [view, setView] = useState<'VISUAL' | 'LIST'>('VISUAL');
    const [showCreate, setShowCreate] = useState(false);
    const [editingItem, setEditingItem] = useState<ContactItem | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ContactItem, direction: 'asc' | 'desc' }>({ key: 'fullName', direction: 'asc' });

    const handleCreateInit = async (contact: ContactItem) => {
        const addedItem = await addContact(contact);
        setShowCreate(false);
        if (addedItem) setEditingItem(addedItem);
    };

    const handleSaveEdit = (item: ContactItem) => {
        updateContact(item);
        setEditingItem(null);
    };

    const handleDelete = () => {
        if (deleteId) {
            deleteContact(deleteId);
            setDeleteId(null);
            setEditingItem(null);
        }
    };

    const toggleSort = () => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }));

    const sortedContacts = [...contacts].sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredContacts = sortedContacts.filter(c =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.jobTitle && c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const customFooter = (
        <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm flex items-center gap-1">
            {getTranslation('BTN_CLOSE', currentLanguage)} <span className="text-gray-400 text-xs border border-gray-300 rounded-full w-4 h-4 inline-flex items-center justify-center">i</span>
        </button>
    );

    return (
        <GenericModal
            title={getTranslation('CONTACT_MGMT', currentLanguage)}
            onClose={onClose}
            width="w-[90vw] min-w-[1200px]"
            noFooter={true}
            customFooter={customFooter}
            headerIcons={
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 mr-2 hidden md:inline">{getTranslation('MSG_CONTACT_DESC', currentLanguage)} <span className="text-blue-400 border border-blue-200 rounded-full w-4 h-4 inline-flex items-center justify-center text-[10px]">i</span></span>
                    <div className="flex border border-[var(--primary-color)] rounded-sm overflow-hidden shadow-sm h-8">
                        <button onClick={() => setView('VISUAL')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'VISUAL' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><Monitor className="w-3 h-3" /> {getTranslation('LABEL_VISUAL_VIEW', currentLanguage)}</button>
                        <button onClick={() => setView('LIST')} className={`px-3 text-xs font-bold flex items-center gap-2 transition-colors ${view === 'LIST' ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-[var(--primary-color)] hover:bg-blue-50'}`}><ListIcon className="w-3 h-3" /> {getTranslation('LABEL_LIST_VIEW', currentLanguage)}</button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col h-[600px] bg-white">
                {/* Toolbar */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0 gap-4">
                    <div className="flex-1 max-w-lg relative">
                        <input
                            placeholder={getTranslation('LABEL_SEARCH_CONTACTS', currentLanguage)}
                            className="border border-gray-300 p-2.5 pl-9 pr-9 text-sm w-full focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mr-2">
                            <span>{getTranslation('LABEL_SORT_BY', currentLanguage)}</span>
                            <div className="relative">
                                <select
                                    className="border border-gray-300 p-2 pr-8 text-sm rounded-sm bg-white focus:ring-1 focus:ring-[var(--primary-color)] outline-none appearance-none cursor-pointer w-40"
                                    value={sortConfig.key}
                                    onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value as keyof ContactItem }))}
                                >
                                    <option value="fullName">{getTranslation('LABEL_FULL_NAME', currentLanguage)}</option>
                                    <option value="jobTitle">{getTranslation('LABEL_JOB_TITLE', currentLanguage)}</option>
                                    <option value="status">{getTranslation('LABEL_STATUS', currentLanguage)}</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                            </div>
                            <button onClick={toggleSort} className="p-2 border border-gray-300 rounded-sm hover:bg-gray-50 text-[var(--primary-color)]">
                                {sortConfig.direction === 'asc' ? <ArrowUpAZ className="w-4 h-4" /> : <ArrowDownAZ className="w-4 h-4" />}
                            </button>
                        </div>

                        <button onClick={() => setShowCreate(true)} className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm font-bold hover:opacity-90 shadow-sm rounded-sm">
                            {getTranslation('BTN_ADD_CONTACT', currentLanguage)}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {filteredContacts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <Plus className="w-12 h-12 opacity-20" />
                            <p className="font-bold">{searchQuery ? 'No contacts match your search' : 'No contacts yet'}</p>
                            <p className="text-sm">{getTranslation('MSG_CONTACT_DESC', currentLanguage)}</p>
                        </div>
                    ) : view === 'VISUAL' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all group relative flex flex-col rounded-sm overflow-hidden min-h-[140px]"
                                    onClick={() => setEditingItem(contact)}
                                >
                                    <div className="flex h-full cursor-pointer">
                                        <div className="w-32 bg-gray-100 flex items-center justify-center relative overflow-hidden border-r border-gray-100">
                                            <img
                                                src={contact.imageUrl || DUMMY_IMAGE}
                                                alt={contact.fullName}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('bg-gray-200'); }}
                                            />
                                            {(!contact.imageUrl) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{getItemTranslation(contact, currentLanguage, 'fullName')}</h4>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${contact.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-400 text-yellow-900'}`}>
                                                        {contact.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-[var(--primary-color)] mb-1 line-clamp-1">{getItemTranslation(contact, currentLanguage, 'jobTitle')}</p>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{stripHtml(getItemTranslation(contact, currentLanguage, 'description') || 'No description provided.')}</p>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); setEditingItem(contact); }} className="p-1 hover:bg-blue-50 rounded-sm text-[var(--icon-color)]"><Pencil className="w-3 h-3" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); setDeleteId(contact.id); }} className="p-1 hover:bg-red-50 hover:text-red-600 rounded-sm text-[var(--icon-color)]"><Trash2 className="w-3 h-3" /></button>
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
                                        <th className="p-4 w-20 text-center">Image</th>
                                        <th className="p-4">Name & Position</th>
                                        <th className="p-4 w-32">Status</th>
                                        <th className="p-4 text-right w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredContacts.map(contact => (
                                        <tr key={contact.id} className="hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => setEditingItem(contact)}>
                                            <td className="p-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-sm mx-auto flex items-center justify-center overflow-hidden border border-gray-200">
                                                    <img src={contact.imageUrl || DUMMY_IMAGE} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                    {!contact.imageUrl && <ImageIcon className="w-5 h-5 text-gray-300" />}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-bold text-gray-800 text-sm mb-0.5">{getItemTranslation(contact, currentLanguage, 'fullName')}</div>
                                                <div className="text-xs text-gray-500">{getItemTranslation(contact, currentLanguage, 'jobTitle')}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full inline-block ${contact.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-400 text-yellow-900'}`}>
                                                    {contact.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); setEditingItem(contact); }} className="p-1.5 hover:bg-blue-50 rounded-sm text-[var(--icon-color)]"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(contact.id); }} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-sm text-[var(--icon-color)]"><Trash2 className="w-4 h-4" /></button>
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

            {/* Sub-Modals */}
            {showCreate && <CreateContactModal onSave={handleCreateInit} onCancel={() => setShowCreate(false)} />}
            {editingItem && <ContactEditor item={editingItem} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} onDelete={(id: string) => setDeleteId(id)} />}
            {deleteId && <ConfirmDeleteDialog title="Delete Contact" message="Are you sure you want to delete this contact? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
        </GenericModal>
    );
};
