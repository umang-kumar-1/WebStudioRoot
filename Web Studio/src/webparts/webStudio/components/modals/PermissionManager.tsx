import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store';
import { GenericModal, TabButton } from './SharedModals';
import { JoditRichTextEditor } from '../JoditEditor';
import { PermissionGroup, PermissionUser } from '../../types';
import {
    X, Users, UserPlus, UserCheck, Search, ChevronDown,
    ArrowRight, Plus, User, Check, Settings, Trash2,
    Shield
} from 'lucide-react';

// --- CHILD MODAL: CREATE NEW GROUP ---
const CreateGroupModal = ({ onClose }: { onClose: () => void }) => {
    const { createPermissionGroup } = useStore();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const handleSave = () => {
        if (!name) return;
        const newGroup: PermissionGroup = {
            id: `g_${Date.now()}`,
            name: name,
            description: desc,
            type: 'Custom',
            memberIds: []
        };
        createPermissionGroup(newGroup);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[600px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">Create New Group</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto flex-1">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Group Name <span className="text-red-500">*</span></label>
                        <input
                            className="w-full border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm transition-shadow focus:shadow-inner"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter group name"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <JoditRichTextEditor
                            value={desc}
                            onChange={(val: string) => setDesc(val)}
                            placeholder="Enter group description"
                            height={180}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 rounded-sm">Save Group</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- CHILD MODAL: ADD MEMBER ---
const AddMemberModal = ({ groupName, groupId, onClose }: { groupName: string, groupId: string, onClose: () => void }) => {
    const { permissionGroups, permissionUsers, addMemberToGroup } = useStore();
    const [searchUser, setSearchUser] = useState('');
    const [selectedUser, setSelectedUser] = useState<PermissionUser | null>(null);

    // Filter users not already in the group
    const currentGroup = permissionGroups.find(g => g.id === groupId);
    const filteredUsers = permissionUsers.filter(u =>
        (u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())) &&
        !currentGroup?.memberIds.includes(u.id)
    );

    const handleSave = () => {
        if (selectedUser && groupId) {
            addMemberToGroup(groupId, selectedUser.id);
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[600px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">Add User to {groupName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto flex-1 min-h-[200px]">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Search User</label>
                        <div className="relative">
                            <input
                                className="w-full border border-gray-300 p-2.5 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm"
                                placeholder="Enter user name or email"
                                value={selectedUser ? selectedUser.name : searchUser}
                                onChange={(e) => { setSearchUser(e.target.value); setSelectedUser(null); }}
                                autoFocus
                            />
                            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />

                            {selectedUser && (
                                <button onClick={() => { setSelectedUser(null); setSearchUser(''); }} className="absolute right-10 top-2.5 text-gray-400 hover:text-red-500">
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {searchUser && !selectedUser && (
                                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl max-h-48 overflow-y-auto z-50 mt-1 rounded-sm">
                                    {filteredUsers.map(u => (
                                        <div key={u.id} className="p-3 hover:bg-blue-50 cursor-pointer text-sm flex flex-col border-b border-gray-100 last:border-0" onClick={() => { setSelectedUser(u); setSearchUser(''); }}>
                                            <span className="font-bold text-gray-800">{u.name}</span>
                                            <span className="text-xs text-gray-500">{u.email}</span>
                                        </div>
                                    ))}
                                    {filteredUsers.length === 0 && <div className="p-4 text-gray-400 text-xs italic text-center">No users found</div>}
                                </div>
                            )}
                        </div>
                        {selectedUser && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-800">{selectedUser.name}</div>
                                    <div className="text-xs text-gray-600">{selectedUser.email}</div>
                                </div>
                                <Check className="w-4 h-4 text-blue-600 ml-auto" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">Cancel</button>
                    <button onClick={handleSave} disabled={!selectedUser} className="px-6 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm">Add Member</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- CHILD MODAL: GROUP DETAIL ---
const GroupDetailModal = ({ initialGroupId, onClose }: { initialGroupId: string, onClose: () => void }) => {
    const { permissionGroups, permissionUsers, removeMemberFromGroup, updatePermissionGroup } = useStore();

    const [currentGroupId, setCurrentGroupId] = useState(initialGroupId);
    const [activeTab, setActiveTab] = useState<'BASIC' | 'MEMBERS'>('MEMBERS');
    const [showAddMember, setShowAddMember] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const liveGroup = permissionGroups.find(g => g.id === currentGroupId);

    if (!liveGroup) return null;

    const members = liveGroup.memberIds.map(id => permissionUsers.find(u => u.id === id)).filter(Boolean) as PermissionUser[];
    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const [editName, setEditName] = useState(liveGroup.name);
    const [editDesc, setEditDesc] = useState(liveGroup.description);

    useEffect(() => {
        setEditName(liveGroup.name);
        setEditDesc(liveGroup.description);
        setSearchTerm('');
    }, [liveGroup]);

    const handleSaveBasic = () => {
        updatePermissionGroup({ ...liveGroup, name: editName, description: editDesc });
    };

    return createPortal(
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[90vw] min-w-[1000px] h-[85vh] shadow-2xl rounded-sm border border-gray-300 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white border border-gray-200 rounded-sm">
                            <Users className="w-5 h-5 text-[var(--primary-color)]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Manage Group: <span className="text-[var(--primary-color)]">{liveGroup.name}</span></h3>

                            {/* Group Selection Dropdown */}
                            <div className="relative mt-1">
                                <select
                                    className="appearance-none bg-transparent text-xs font-bold text-gray-500 uppercase cursor-pointer pr-4 hover:text-gray-700 outline-none"
                                    value={currentGroupId}
                                    onChange={(e) => setCurrentGroupId(e.target.value)}
                                >
                                    {permissionGroups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-400 absolute top-0.5 right-0 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 bg-white flex-shrink-0">
                    <TabButton active={activeTab === 'BASIC'} label="Basic Information" onClick={() => setActiveTab('BASIC')} icon={Settings} />
                    <TabButton active={activeTab === 'MEMBERS'} label={`Group Members (${members.length})`} onClick={() => setActiveTab('MEMBERS')} icon={Users} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">

                    {/* Basic Info Tab */}
                    {activeTab === 'BASIC' && (
                        <div className="mx-auto space-y-6 bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Group Name</label>
                                <input className="w-full border border-gray-300 p-2.5 text-sm rounded-sm" value={editName} onChange={e => setEditName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <JoditRichTextEditor
                                    value={editDesc}
                                    onChange={(val: string) => setEditDesc(val)}
                                    height={180}
                                    placeholder="Enter group description"
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button onClick={() => { setEditName(liveGroup.name); setEditDesc(liveGroup.description); }} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 rounded-sm">Reset</button>
                                <button onClick={handleSaveBasic} className="px-4 py-2 bg-[var(--primary-color)] text-white text-xs font-bold shadow-sm hover:opacity-90 rounded-sm">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'MEMBERS' && (
                        <div className="flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                            {/* Toolbar */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-2 relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        placeholder="Search members..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-9 py-2 border border-gray-300 text-sm rounded-sm w-64 focus:outline-none focus:border-[var(--primary-color)]"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                            title="Clear search"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button onClick={() => setShowAddMember(true)} className="px-4 py-2 bg-[var(--primary-color)] text-white text-sm font-bold shadow-sm hover:opacity-90 flex items-center gap-2 rounded-sm transition-transform active:scale-95">
                                    <UserPlus className="w-4 h-4" /> Add Member
                                </button>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase text-xs font-bold">
                                        <tr>
                                            <th className="p-4 border-r">User Name</th>
                                            <th className="p-4 border-r">Email Address</th>
                                            <th className="p-4 text-center w-24">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredMembers.map(m => (
                                            <tr key={m.id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="p-4 border-r font-medium text-gray-800 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    {m.name}
                                                </td>
                                                <td className="p-4 border-r text-gray-600 font-mono text-xs">{m.email}</td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => removeMemberFromGroup(liveGroup.id, m.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Remove Member">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredMembers.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-12 text-center text-gray-400 italic">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users className="w-10 h-10 opacity-20" />
                                                        <span>No members found matching your search.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">Close</button>
                </div>
            </div>

            {/* Add Member Popup */}
            {showAddMember && <AddMemberModal groupName={liveGroup.name} groupId={liveGroup.id} onClose={() => setShowAddMember(false)} />}
        </div>,
        document.body
    );
};

// --- CHILD MODAL: CHECK PERMISSIONS ---
const CheckPermissionModal = ({ onClose }: { onClose: () => void }) => {
    const { permissionUsers, permissionGroups } = useStore();
    const [search, setSearch] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleCheck = () => {
        const user = permissionUsers.find(u => u.name.toLowerCase() === search.toLowerCase() || u.email.toLowerCase() === search.toLowerCase());
        if (user) {
            const groups = permissionGroups.filter(g => g.memberIds.includes(user.id));
            setResult({ user, groups });
        } else {
            // Simple visual feedback instead of alert
            setResult({ notFound: true });
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[600px] shadow-2xl rounded-sm border border-gray-300 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-xl font-bold text-[var(--primary-color)]">Check User Permissions</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto flex-1">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Search User</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    className="w-full border border-gray-300 p-2 text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none rounded-sm"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setResult(null); }}
                                    placeholder="Enter exact name or email"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                                />
                                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                            </div>
                            <button onClick={handleCheck} className="px-4 py-2 bg-[var(--primary-color)] text-white text-xs font-bold rounded-sm hover:opacity-90">Check</button>
                        </div>
                    </div>

                    {result && !result.notFound && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-blue-100">
                                <div className="w-12 h-12 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {result.user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-gray-900">{result.user.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{result.user.email}</div>
                                </div>
                            </div>
                            <div className="text-sm">
                                <h4 className="font-bold mb-2 text-gray-700 flex items-center gap-2"><Shield className="w-4 h-4" /> Group Memberships</h4>
                                <ul className="space-y-2">
                                    {result.groups.map((g: any) => (
                                        <li key={g.id} className="flex items-center gap-2 p-2 bg-white border border-blue-100 rounded-sm">
                                            <Check className="w-4 h-4 text-green-600" />
                                            <span className="font-medium text-gray-700">{g.name}</span>
                                        </li>
                                    ))}
                                    {result.groups.length === 0 && <li className="italic text-gray-500 p-2">No direct group memberships found.</li>}
                                </ul>
                            </div>
                        </div>
                    )}

                    {result && result.notFound && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center rounded-sm">
                            User not found. Please try again.
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Helper Card Component (Extracted)
const PermissionCard: React.FC<{ group: PermissionGroup, icon: any, onSelect: (id: string) => void }> = ({ group, icon: Icon, onSelect }) => (
    <div
        className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-[var(--primary-color)] transition-all cursor-pointer group rounded-sm flex flex-col h-full min-h-[220px]"
        onClick={() => onSelect(group.id)}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--brand-light)] rounded-sm text-[var(--primary-color)]">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{group.name}</h4>
        </div>
        <div className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-3 flex-1" dangerouslySetInnerHTML={{ __html: group.description }} />
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-gray-50 -mx-6 -mb-6 px-6 py-3 transition-colors">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{group.memberIds.length} Members</span>
            <ArrowRight className="w-4 h-4 text-[var(--primary-color)] transform group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);

// --- MAIN PARENT POPUP ---
export const PermissionManager = ({ onClose }: { onClose: () => void }) => {
    const { permissionGroups } = useStore();
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showCheckPerm, setShowCheckPerm] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    // Filter Logic for Specific Order
    const membersGroup = permissionGroups.find(g => g.id === 'members' || g.type === 'Members');
    const visitorsGroup = permissionGroups.find(g => g.id === 'visitors' || g.type === 'Visitors');
    const ownersGroup = permissionGroups.find(g => g.id === 'owners' || g.type === 'Owners');
    const customGroups = permissionGroups.filter(g => g.type === 'Custom' || (g.id !== 'members' && g.id !== 'visitors' && g.id !== 'owners' && g.type !== 'Members' && g.type !== 'Visitors' && g.type !== 'Owners'));

    const customFooter = (
        <div className="flex justify-end">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold hover:bg-gray-100 rounded-sm">Close</button>
        </div>
    );

    return (
        <GenericModal
            className="permission-management-popup"
            title="Permission Management"
            onClose={onClose}
            width="w-[85vw] min-w-[1000px] max-w-[1200px]"
            noFooter={true}
            customFooter={customFooter}
            headerIcons={
                <div className="flex gap-3">
                    <button onClick={() => setShowCheckPerm(true)} className="flex items-center gap-2 text-[var(--primary-color)] text-sm font-bold hover:bg-blue-50 px-3 py-1.5 rounded-sm transition-colors border border-transparent hover:border-blue-100">
                        <UserCheck className="w-4 h-4" /> Check User Permissions
                    </button>
                    <button onClick={() => setShowCreateGroup(true)} className="bg-[var(--primary-color)] text-white px-4 py-1.5 text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-sm rounded-sm">
                        <Plus className="w-4 h-4" /> Create New Group
                    </button>
                </div>
            }
        >
            <div className="p-8 bg-gray-50 h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Standard Groups */}
                    {membersGroup && <PermissionCard group={membersGroup} icon={Users} onSelect={setSelectedGroupId} />}
                    {visitorsGroup && <PermissionCard group={visitorsGroup} icon={User} onSelect={setSelectedGroupId} />}
                    {ownersGroup && <PermissionCard group={ownersGroup} icon={UserPlus} onSelect={setSelectedGroupId} />}

                    {/* Custom Groups */}
                    {customGroups.map(g => (
                        <PermissionCard key={g.id} group={g} icon={Settings} onSelect={setSelectedGroupId} />
                    ))}
                </div>

                {permissionGroups.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Users className="w-16 h-16 mb-4 opacity-20" />
                        <p>No permission groups found.</p>
                    </div>
                )}
            </div>

            {/* Child Modals */}
            {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
            {showCheckPerm && <CheckPermissionModal onClose={() => setShowCheckPerm(false)} />}
            {selectedGroupId && <GroupDetailModal initialGroupId={selectedGroupId} onClose={() => setSelectedGroupId(null)} />}
        </GenericModal>
    );
};
