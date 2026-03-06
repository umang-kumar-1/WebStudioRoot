
import React, { useState } from 'react';
import { useStore, getLocalizedText, getGlobalTranslation } from '../store';
import { ModalType, ViewMode, LanguageCode, NavItem } from '../types';
import { EditTrigger } from './modals/SharedModals';
import {
  Globe, LayoutTemplate, FileText, Calendar, Archive, FileImage,
  Languages, Users, MessageSquare, Paintbrush, ChevronDown,
  ChevronRight, Pencil, History, File, CornerDownRight
} from 'lucide-react';


// --- Shared Accordion Component ---
interface SidebarAccordionProps {
  icon: React.ElementType;
  label: string;
  editLabelKey?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Standardized visual design for accordions (Icon + Title Left, Chevron Right)
const SidebarAccordion: React.FC<SidebarAccordionProps> = ({ icon: Icon, label, editLabelKey, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-[var(--sidebar-border-color)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors group relative"
        style={{
          backgroundColor: isOpen ? 'var(--sidebar-active-bg)' : 'var(--sidebar-hover-bg)',
          color: isOpen ? 'var(--sidebar-active-text-color)' : 'var(--sidebar-text)',
        }}
      >
        {/* Active Indicator Line */}
        {isOpen && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: 'var(--sidebar-active-indicator-color)' }}
          />
        )}

        <div className="flex items-center gap-3 min-w-0">
          {/* Icon aligned left */}
          <Icon className={`w-4 h-4 flex-shrink-0 ${isOpen ? 'text-[var(--sidebar-active-text-color)]' : 'text-[var(--sidebar-icon-color)]'}`} />

          {/* Text */}
          <span className={`text-xs font-bold uppercase tracking-wider truncate select-none ${isOpen ? 'text-[var(--sidebar-active-text-color)]' : 'text-[var(--sidebar-text)]'}`}>
            {label}
          </span>

          {/* Edit Trigger next to text */}
          {editLabelKey && (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center">
              <EditTrigger labelKey={editLabelKey} className={isOpen ? 'text-[var(--sidebar-active-text-color)]' : ''} />
            </div>
          )}
        </div>

        {/* Chevron aligned right */}
        {isOpen ? (
          <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 ml-2 ${isOpen ? 'text-[var(--sidebar-active-text-color)]' : 'text-gray-400 group-hover:text-gray-600'}`} />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
        )}
      </button>

      {isOpen && (
        <div className="py-2 bg-[var(--sidebar-bg)] border-t border-dashed border-[var(--sidebar-border-color)]">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Reusable Global Item ---
const GlobalItem = ({ icon: Icon, labelKey, modalType }: { icon: any, labelKey: string, modalType: ModalType }) => {
  const { openModal, currentLanguage, uiLabels } = useStore();

  // Use dynamic label from store
  const label = uiLabels[labelKey]
    ? (uiLabels[labelKey][currentLanguage] || uiLabels[labelKey]['en'])
    : labelKey;

  return (
    <div className="group flex items-center justify-between px-4 py-2 text-sm text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] cursor-pointer transition-colors border-l-2 border-transparent hover:border-[var(--sidebar-border-color)]">
      <div className="flex items-center gap-3" onClick={() => openModal(modalType)}>
        {/* Color applied strictly to the icon */}
        <Icon className="w-4 h-4 text-[var(--sidebar-icon-color)] opacity-75 group-hover:opacity-100" />
        <span className="font-medium">{label}</span>
      </div>
      {/* Info Icon: Always visible, branded on hover, opens label editor */}
      <EditTrigger labelKey={labelKey} />
    </div>
  );
};

// --- Recursive Nav Item Component ---
interface SidebarNavItemProps {
  item: NavItem;
  level: number;
  allItems: NavItem[];
  currentPageId: string;
  onSelect: (id: string) => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, level, allItems, currentPageId, onSelect }) => {
  const { translationItems, currentLanguage } = useStore();
  const children = allItems.filter(n => n.parentId === item.id).sort((a, b) => a.order - b.order);
  const isPage = item.type === 'Page' && item.pageId;
  const isActive = isPage && item.pageId === currentPageId;

  const localizedTitle = getGlobalTranslation(item.id, translationItems, currentLanguage, item.title);

  return (
    <>
      <div
        onClick={() => {
          if (isPage && item.pageId) onSelect(item.pageId);
        }}
        className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-all border-l-2 hover:bg-[var(--sidebar-hover-bg)]`}
        style={{
          paddingLeft: `${16 + (level * 16)}px`,
          backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
          color: isActive ? 'var(--sidebar-active-text-color)' : (item.isVisible ? 'var(--sidebar-text-muted)' : 'var(--sidebar-text-muted) opacity-50'),
          borderLeftColor: isActive ? 'var(--sidebar-active-indicator-color)' : 'transparent',
          fontWeight: isActive ? 600 : 400
        }}
      >
        {/* Visual Cue for Child */}
        {level > 0 && <CornerDownRight className="w-3 h-3 opacity-30" />}

        {item.type === 'Page' ? <File className="w-3 h-3 opacity-50" /> : <Globe className="w-3 h-3 opacity-30" />}

        <span className="flex-1 truncate">{localizedTitle}</span>

        {isActive && <div className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: 'var(--sidebar-active-indicator-color)' }}></div>}
      </div>
      {children.map(child => (
        <SidebarNavItem key={child.id} item={child} level={level + 1} allItems={allItems} currentPageId={currentPageId} onSelect={onSelect} />
      ))}
    </>
  );
};


export const Sidebar: React.FC = () => {
  const {
    viewMode, toggleViewMode,
    pages, currentPageId, setCurrentPage,
    openModal, currentLanguage, setLanguage,
    uiLabels, siteConfig
  } = useStore();

  const [isGlobalsOpen, setIsGlobalsOpen] = useState(true);
  const [isPagesOpen, setIsPagesOpen] = useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const activePage = pages.find(p => p.id === currentPageId);

  const handleLangSelect = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const getLangLabel = (code: LanguageCode) => {
    switch (code) {
      case 'en': return 'English';
      case 'de': return 'German';
      case 'fr': return 'French';
      case 'es': return 'Spanish';
      default: return 'English';
    }
  };

  const getLabel = (key: string) => {
    return uiLabels[key] ? (uiLabels[key][currentLanguage] || uiLabels[key]['en']) : key;
  };

  const rootNavItems = siteConfig.navigation.filter(n => n.parentId === 'root').sort((a, b) => a.order - b.order);

  return (
    <div
      className="w-72 flex flex-col h-screen shadow-lg z-20 flex-shrink-0 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        borderRight: '1px solid var(--sidebar-border-color)'
      }}
    >
      {/* Brand & Language Switcher */}
      <div
        className="h-16 flex items-center justify-between px-4 relative flex-shrink-0"
        style={{ borderBottom: '1px solid var(--sidebar-border-color)' }}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--sidebar-button-color)' }}>
            <Globe className="text-white w-5 h-5" />
          </div>
          <div>
            <h6 className="font-bold leading-tight flex items-center gap-1" style={{ color: 'var(--sidebar-text)' }}>
              {getLabel('APP_TITLE')}
              <EditTrigger labelKey="APP_TITLE" className="ml-1" />
              <span style={{ color: 'var(--sidebar-icon-color)' }} className="align-top text-[10px]">®</span>
            </h6>
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1" style={{ color: 'var(--sidebar-text-muted)' }}>
              {getLabel('APP_SUBTITLE')}
              <EditTrigger labelKey="APP_SUBTITLE" />
            </span>
          </div>
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 border border-transparent hover:bg-[var(--sidebar-hover-bg)] transition-all"
            style={{
              color: 'var(--sidebar-text)',
            }}
          >
            {currentLanguage.toUpperCase()} <ChevronDown className="w-3 h-3" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-gray-200 shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 text-gray-800">
              {['en', 'de', 'fr', 'es'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangSelect(lang as LanguageCode)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${currentLanguage === lang ? 'font-bold bg-blue-50' : 'text-gray-700'}`}
                  style={{ color: currentLanguage === lang ? 'var(--sidebar-icon-color)' : 'inherit' }}
                >
                  {getLangLabel(lang as LanguageCode)}
                  {currentLanguage === lang && <div className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: 'var(--sidebar-icon-color)' }}></div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto admin-scroll">

        {/* 1. Site Globals Accordion */}
        <SidebarAccordion
          icon={Globe}
          label={getLabel('SITE_GLOBALS')}
          editLabelKey="SITE_GLOBALS"
          isOpen={isGlobalsOpen}
          onToggle={() => setIsGlobalsOpen(!isGlobalsOpen)}
        >
          <GlobalItem icon={LayoutTemplate} labelKey="NAV_MGMT" modalType={ModalType.NAVIGATION} />
          <GlobalItem icon={FileText} labelKey="NEWS_MGMT" modalType={ModalType.NEWS} />
          <GlobalItem icon={Calendar} labelKey="EVENT_MGMT" modalType={ModalType.EVENTS} />
          <GlobalItem icon={Archive} labelKey="DOC_MGMT" modalType={ModalType.DOCUMENTS} />
          <GlobalItem icon={LayoutTemplate} labelKey="FOOTER_MGMT" modalType={ModalType.FOOTER} />
          <GlobalItem icon={Globe} labelKey="SITE_MGMT" modalType={ModalType.SITE_MGMT} />
          <GlobalItem icon={FileImage} labelKey="IMG_MGMT" modalType={ModalType.IMAGES} />
          <GlobalItem icon={Languages} labelKey="CONTENT_TRANS" modalType={ModalType.TRANSLATION} />
          <GlobalItem icon={Users} labelKey="PERM_MGMT" modalType={ModalType.PERMISSIONS} />
          <GlobalItem icon={MessageSquare} labelKey="CONTACT_Q" modalType={ModalType.CONTACT_QUERIES} />
          <GlobalItem icon={Paintbrush} labelKey="STYLING" modalType={ModalType.STYLING} />
        </SidebarAccordion>

        {/* 2. Page Preview / Edit Mode Toggle */}
        <div className="px-4 py-4 border-b border-[var(--sidebar-border-color)]">
          <div className="flex shadow-sm overflow-hidden border border-[var(--sidebar-border-color)]">
            <button
              onClick={toggleViewMode}
              className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1
                ${viewMode === ViewMode.PREVIEW
                  ? 'text-white'
                  : 'bg-white hover:bg-gray-50'}`}
              style={{
                backgroundColor: viewMode === ViewMode.PREVIEW ? 'var(--sidebar-button-color)' : undefined,
                color: viewMode === ViewMode.PREVIEW ? '#ffffff' : 'var(--sidebar-text-muted)'
              }}
            >
              {getLabel('PAGE_PREVIEW')} <EditTrigger labelKey="PAGE_PREVIEW" className={viewMode === ViewMode.PREVIEW ? "text-white/70 hover:text-white" : ""} />
            </button>
            <button
              onClick={toggleViewMode}
              className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1
                ${viewMode === ViewMode.EDIT
                  ? 'text-white'
                  : 'bg-white hover:bg-gray-50'}`}
              style={{
                backgroundColor: viewMode === ViewMode.EDIT ? 'var(--sidebar-button-color)' : undefined,
                color: viewMode === ViewMode.EDIT ? '#ffffff' : 'var(--sidebar-text-muted)'
              }}
            >
              {getLabel('EDIT_MODE')} <EditTrigger labelKey="EDIT_MODE" className={viewMode === ViewMode.EDIT ? "text-white/70 hover:text-white" : ""} />
            </button>
          </div>
        </div>

        {/* 3. Page Info Section */}
        <div className="px-4 py-6 border-b border-[var(--sidebar-border-color)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 opacity-80" style={{ color: 'var(--sidebar-text)' }}>
              {getLabel('SECTION_PAGE_INFO')} <EditTrigger labelKey="SECTION_PAGE_INFO" />
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => openModal(ModalType.VERSION_HISTORY)}
                className="p-1 hover:bg-gray-100 text-[var(--sidebar-text-muted)] transition-colors"
                title="Version History"
              >
                <History className="w-3 h-3" />
              </button>
              <button
                onClick={() => openModal(ModalType.PAGE_INFO)}
                className="p-1 hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--sidebar-link-color)' }}
                title="Edit Info"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>
            <p className="flex justify-between">
              <span className="font-semibold opacity-70 flex items-center gap-1">{getLabel('LABEL_TITLE')}: <EditTrigger labelKey="LABEL_TITLE" /></span>
              <span style={{ color: 'var(--sidebar-text)' }}>{getLocalizedText(activePage?.title || '', currentLanguage)}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold opacity-70 flex items-center gap-1">{getLabel('LABEL_STATUS')}: <EditTrigger labelKey="LABEL_STATUS" /></span>
              <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-bold ${activePage?.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {activePage?.status}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold opacity-70 flex items-center gap-1">{getLabel('LABEL_MODIFIED')}: <EditTrigger labelKey="LABEL_MODIFIED" /></span>
              <span>{new Date(activePage?.modifiedDate || '').toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* 4. Pages Accordion (Now Rendering Navigation Hierarchy) */}
        <SidebarAccordion
          icon={LayoutTemplate}
          label={getLabel('PAGES')}
          editLabelKey="PAGES"
          isOpen={isPagesOpen}
          onToggle={() => setIsPagesOpen(!isPagesOpen)}
        >
          <div className="space-y-0.5 mt-1 pb-2">
            {rootNavItems.length > 0 ? (
              rootNavItems.map(item => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  level={0}
                  allItems={siteConfig.navigation}
                  currentPageId={currentPageId}
                  onSelect={setCurrentPage}
                />
              ))
            ) : (
              <div className="px-4 py-2 text-xs italic opacity-50">No published pages found in navigation.</div>
            )}
          </div>
        </SidebarAccordion>

      </div>
    </div>
  );
};
