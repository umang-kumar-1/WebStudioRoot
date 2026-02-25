
// Enums
export enum ContainerType {
  HERO = 'HERO',
  IMAGE_TEXT = 'IMAGE_TEXT',
  SLIDER = 'SLIDER',
  CARD_GRID = 'CARD_GRID',
  CONTACT_FORM = 'CONTACT_FORM',
  DATA_GRID = 'DATA_GRID',
  TABLE = 'TABLE',
  MAP = 'MAP'
}

export enum ModalType {
  NONE = 'NONE',
  NAVIGATION = 'NAVIGATION',
  NEWS = 'NEWS',
  EVENTS = 'EVENTS',
  DOCUMENTS = 'DOCUMENTS',
  CONTACTS = 'CONTACTS',
  FOOTER = 'FOOTER',
  SITE_MGMT = 'SITE_MGMT',
  CONTAINER_EDITOR = 'CONTAINER_EDITOR',
  SLIDER_MANAGER = 'SLIDER_MANAGER', // New Isolated Modal
  IMAGES = 'IMAGES',
  TRANSLATION = 'TRANSLATION',
  PERMISSIONS = 'PERMISSIONS',
  CONTACT_QUERIES = 'CONTACT_QUERIES',
  STYLING = 'STYLING',
  PAGE_INFO = 'PAGE_INFO',
  VERSION_HISTORY = 'VERSION_HISTORY',
  CONTAINER_ITEMS = 'CONTAINER_ITEMS',
  LABEL_EDITOR = 'LABEL_EDITOR'
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  EDIT = 'EDIT'
}

// Styling & Theming
export interface ThemeConfig {
  [key: string]: string;
}

// Multilingual Core
export type LanguageCode = 'en' | 'de' | 'fr' | 'es';

export interface MultilingualText {
  en: string;
  de: string;
  fr: string;
  es: string;
}

// Content Models
export interface NavItem {
  id: string;
  parentId: string; // 'root' for top level
  title: string; // Simplified for this specific requirement
  type: 'Page' | 'External';
  url?: string;
  pageId?: string; // Reference to a Smart Page
  isVisible: boolean;
  openInNewTab: boolean;
  order: number;
  status?: 'Draft' | 'Published'; // Navigation item status
  translations?: Record<string, string>;
  modified?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  status: 'Draft' | 'Published';
  publishDate: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
  readMore: {
    enabled: boolean;
    text?: string;
    url?: string;
  };
  seo?: {
    title: string;
    description: string;
    keywords?: string;
  };
  translations?: Record<string, {
    title: string;
    description: string;
    readMoreText?: string;
  }>;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface EventItem {
  id: string;
  title: string;
  status: 'Draft' | 'Published';
  startDate: string;
  endDate?: string;
  location?: string;
  category?: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
  readMore: {
    enabled: boolean;
    text?: string;
    url?: string;
  };
  seo?: {
    title: string;
    description: string;
    keywords?: string;
  };
  translations?: Record<string, {
    title: string;
    description: string;
    readMoreText?: string;
    category?: string;
    location?: string;
  }>;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  name?: string; // File name (FileLeafRef) - separate from title metadata
  status: 'Draft' | 'Published';
  date: string;
  type: 'PDF' | 'Word' | 'Excel' | 'PPT' | 'Link' | 'Other';
  year: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
  url?: string;
  itemRank?: number;
  file?: File;
  translations?: Record<string, {
    title: string;
    description: string;
    readMoreText?: string;
  }>;
  sortOrder?: number;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  authorName?: string;
  editorName?: string;
}

export interface ContainerItem {
  id: string;
  title: string;
  status: 'Draft' | 'Published';
  sortOrder: number;
  description: string;
  imageUrl?: string;
  imageName?: string;
  translations?: Record<string, {
    title: string;
    description: string;
  }>;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ContactItem {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  status: 'Draft' | 'Published';
  sortOrder: number;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  description: string;
  imageUrl?: string;
  imageName?: string;
  translations?: Record<string, {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    company?: string;
    description?: string;
  }>;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageName?: string;
  ctaText?: string;
  ctaUrl?: string;
  sortOrder: number;
  status: 'Draft' | 'Published';
  translations?: Record<string, {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
  }>;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  folderId: string;
  width?: number;
  height?: number;
  size?: string;
  type?: string;
  createdDate?: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  description?: string;
  title?: string;
  copyright?: string;
}

export interface ImageFolder {
  id: string;
  name: string;
  count: number;
}

export interface TranslationItem {
  id: string;
  sourceList: string;
  original: string; // English
  translations: {
    de?: string;
    fr?: string;
    es?: string;
    en?: string;
  };
  lastUpdated?: string;
}

// Permission Models
export interface PermissionUser {
  id: string;
  name: string;
  email: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  type: 'Owners' | 'Members' | 'Visitors' | 'Custom';
  memberIds: string[];
}

export interface ContactQueryField {
  label: string;
  value: string;
  type: string;
  id: string;
}

export interface ContactQuery {
  id: string;
  // Metadata
  pageId?: string;
  pageName: string;
  containerId?: string;
  created: string; // ISO String
  status: 'New' | 'Read' | 'Replied';

  // Flattened for easy access (from fields)
  firstName?: string;
  lastName?: string;
  email?: string;
  smartPage?: string; // Legacy support

  // Dynamic Data
  fields: ContactQueryField[];
}

export interface Container {
  id: string;
  pageId: string; // Explicit binding to page
  type: ContainerType;
  order: number;
  settings: Record<string, any>; // Flexible config based on type
  content: Record<string, MultilingualText | any>; // Values are now multilingual
  title?: string; // Container Title (metadata)
  isVisible: boolean;
}

export interface Page {
  id: string;
  title: MultilingualText;
  slug: string;
  status: 'Draft' | 'Published';
  createdBy: string;
  modifiedBy: string;
  modifiedDate: string;
  containers: Container[];
  // New fields for Page Info Editor
  description?: string;
  isHomePage?: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
}

export type NavPosition = 'right' | 'near_logo' | 'below_logo';

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  translations?: Record<string, string>;
  modified?: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
  translations?: Record<string, string>;
  modified?: string;
}

export interface SiteConfig {
  name: string;
  languages: LanguageCode[];
  defaultLanguage: LanguageCode;
  navPosition: NavPosition;
  navAlignment: 'left' | 'center' | 'right';
  headerWidth: 'full' | 'standard';
  headerBackgroundColor: string;
  logo: {
    url: string;
    position: 'left' | 'center' | 'right';
    width: string;
  };
  navigation: NavItem[];
  footer: {
    template: 'Table' | 'Corporate';
    backgroundColor: string; // can be 'white', 'light-grey', 'site-color', or custom hex
    alignment: 'left' | 'center' | 'right';
    subFooterText: string;
    fontSettings: {
      headingSize: string;
      subHeadingSize: string;
    };
    columns: FooterColumn[]; // For Table View
    contactInfo: {
      address: string;
      email: string;
      phone: string;
    };
    socialLinks: {
      linkedin: string;
      facebook: string;
      twitter: string;
      instagram: string;
    };
    copyright: MultilingualText;
    translations?: Record<string, {
      subFooterText?: string;
    }>;
    modified?: string;
  };
}

// AI Service Types
export interface AIThemeRequest {
  prompt: string;
  currentConfig?: ThemeConfig;
}
