
import { create } from 'zustand';
import { ModalType, ViewMode, Page, SiteConfig, ThemeConfig, LanguageCode, MultilingualText, NavItem, NewsItem, EventItem, DocumentItem, Container, ContainerItem, ContactItem, ImageItem, ImageFolder, TranslationItem, PermissionGroup, PermissionUser, ContactQuery, SliderItem } from './types';

// Initial State for UI Labels (populated from SharePoint)
export const INITIAL_UI_LABELS: Record<string, MultilingualText> = {
  APP_TITLE: { en: 'Web Studio', de: 'Web Studio', fr: 'Web Studio', es: 'Web Studio' },
  APP_SUBTITLE: { en: 'Enterprise CMS', de: 'Unternehmens-CMS', fr: 'CMS d\'entreprise', es: 'CMS empresarial' },
  SITE_GLOBALS: { en: 'Site Globals', de: 'Globale Einstellungen', fr: 'Paramètres globaux', es: 'Configuración global' },
  PAGES: { en: 'Pages', de: 'Seiten', fr: 'Pages', es: 'Páginas' },
  SECTION_PAGE_INFO: { en: 'Page Info', de: 'Seiteninfo', fr: 'Info page', es: 'Info página' },
  LABEL_TITLE: { en: 'Title', de: 'Titel', fr: 'Titre', es: 'Título' },
  LABEL_SUBTITLE: { en: 'Subtitle', de: 'Untertitel', fr: 'Sous-titre', es: 'Subtítulo' },
  LABEL_CTA_BUTTON: { en: 'CTA Button', de: 'Call-to-Action-Button', fr: 'Bouton CTA', es: 'Botón CTA' },
  LABEL_STATUS: { en: 'Status', de: 'Status', fr: 'Statut', es: 'Estado' },
  LABEL_MODIFIED: { en: 'Modified', de: 'Geändert', fr: 'Modifié', es: 'Modificado' },
  PAGE_PREVIEW: { en: 'Page Preview', de: 'Seitenvorschau', fr: 'Aperçu de la page', es: 'Vista previa' },
  EDIT_MODE: { en: 'Edit Mode', de: 'Bearbeitungsmodus', fr: 'Mode édition', es: 'Modo edición' },
  CONTENT_TRANS: { en: 'Content Translator', de: 'Inhaltsübersetzer', fr: 'Traducteur de contenu', es: 'Traductor de contenido' },
  NAV_MGMT: { en: 'Navigation Management', de: 'Navigationsverwaltung', fr: 'Gestion de navigation', es: 'Gestión de navegación' },
  NEWS_MGMT: { en: 'News Management', de: 'Nachrichtenverwaltung', fr: 'Gestion des actualités', es: 'Gestión de noticias' },
  EVENT_MGMT: { en: 'Event Management', de: 'Veranstaltungsverwaltung', fr: 'Gestion des événements', es: 'Gestión de eventos' },
  DOC_MGMT: { en: 'Document Management', de: 'Dokumentenverwaltung', fr: 'Gestion documentaire', es: 'Gestión de documentos' },
  FOOTER_MGMT: { en: 'Footer Management', de: 'Fußzeilenverwaltung', fr: 'Gestion de pied de page', es: 'Gestión de pie de página' },
  SITE_MGMT: { en: 'Site Management', de: 'Seitenverwaltung', fr: 'Gestion du site', es: 'Gestión del sitio' },
  IMG_MGMT: { en: 'Image Management', de: 'Bildverwaltung', fr: 'Gestion des images', es: 'Gestion des images' },
  PERM_MGMT: { en: 'Permission Management', de: 'Berechtigungsverwaltung', fr: 'Gestion des permissions', es: 'Gestión de permisos' },
  CONTACT_Q: { en: 'Contact Form Queries', de: 'Kontaktanfragen', fr: 'Demandes de contact', es: 'Consultas de contacto' },
  STYLING: { en: 'Styling Configuration', de: 'Design-Konfiguration', fr: 'Configuration du style', es: 'Configuración de estilo' },
  BTN_EDIT: { en: 'Edit', de: 'Bearbeiten', fr: 'Éditer', es: 'Editar' },
  LABEL_ORIGINAL: { en: 'Original', de: 'Original', fr: 'Original', es: 'Original' },
  LABEL_TRANSLATION: { en: 'Translation', de: 'Übersetzung', fr: 'Traduction', es: 'Traducción' },
  LABEL_TRANSLATED: { en: 'Translated', de: 'Übersetzt', fr: 'Traduit', es: 'Traducido' },
  BTN_SUGGEST_AI: { en: 'Suggest with AI', de: 'Mit KI vorschlagen', fr: 'Suggérer avec IA', es: 'Sugerir con IA' },
  TITLE_EDIT_TRANSLATION: { en: 'Edit Translation', de: 'Übersetzung bearbeiten', fr: 'Modifier la traduction', es: 'Editar traducción' },
  CONTAINER_ITEM_MGMT: { en: 'Container Items', de: 'Container-Elemente', fr: 'Éléments de conteneur', es: 'elementos de contenedor' },
  TITLE_CREATE_CONTAINER_ITEM: { en: 'Create Container Item', de: 'Container-Element erstellen', fr: 'Créer un élément de conteneur', es: 'Crear elemento de contenedor' },
  PLACEHOLDER_ITEM_TITLE: { en: 'Enter item title...', de: 'Titel des Elements eingeben...', fr: 'Entrez le titre de l\'élément...', es: 'Ingrese el título del elemento...' },
  TITLE_EDIT_CONTAINER_ITEM: { en: 'Edit Container Item', de: 'Container-Element bearbeiten', fr: 'Modifier l\'élément de conteneur', es: 'Editar elemento de contenedor' },
  TAB_BASIC_INFO: { en: 'Basic Info', de: 'Basis-Info', fr: 'Infos de base', es: 'Información básica' },
  TAB_IMAGE_INFO: { en: 'Image Info', de: 'Bild-Info', fr: 'Infos image', es: 'Información de imagen' },
  TAB_SEO: { en: 'SEO', de: 'SEO', fr: 'SEO', es: 'SEO' },
  TAB_TRANSLATION: { en: 'Translation', de: 'Übersetzung', fr: 'Traduction', es: 'Traducción' },
  LABEL_SORT_ORDER: { en: 'Sort Order', de: 'Sortierung', fr: 'Ordre de tri', es: 'Orden de clasificación' },
  LABEL_ADD_READ_MORE: { en: 'Add Read More Link', de: 'Mehr lesen Link hinzufügen', fr: 'Ajouter un lien Lire la suite', es: 'Agregar enlace Leer más' },
  LABEL_LINK_URL: { en: 'Link URL', de: 'Link URL', fr: 'URL du lien', es: 'URL del enlace' },
  LABEL_LINK_TEXT: { en: 'Link Text', de: 'Link Text', fr: 'Texte du lien', es: 'Texto del enlace' },
  LABEL_ORIGINAL_DESC: { en: 'Original Description', de: 'Originale Beschreibung', fr: 'Description originale', es: 'Descripción original' },
  PLACEHOLDER_ITEM_DESC: { en: 'Enter item description...', de: 'Beschreibung des Elements eingeben...', fr: 'Entrez la description de l\'élément...', es: 'Ingrese la descripción del elemento...' },
  LABEL_SEO_TITLE: { en: 'SEO Title', de: 'SEO Titel', fr: 'Titre SEO', es: 'Título SEO' },
  LABEL_META_DESC: { en: 'Meta Description', de: 'Meta-Beschreibung', fr: 'Méta description', es: 'Meta descripción' },
  LABEL_KEYWORDS: { en: 'Keywords', de: 'Schlagworte', fr: 'Mots-clés', es: 'Palabras clave' },
  LABEL_TRANSLATED_TITLE: { en: 'Translated Title', de: 'Übersetzter Titel', fr: 'Titre traduit', es: 'Título traducido' },
  LABEL_TRANSLATED_READ_MORE: { en: 'Translated Link Text', de: 'Übersetzter Link-Text', fr: 'Texte de lien traduit', es: 'Texto de enlace traducido' },
  LABEL_TRANSLATED_DESC: { en: 'Translated Description', de: 'Übersetzte Beschreibung', fr: 'Description traduite', es: 'Descripción traducida' },
  BTN_ADD_ITEM: { en: 'Add Item', de: 'Element hinzufügen', fr: 'Ajouter un élément', es: 'Agregar elemento' },
  LABEL_SEARCH_ITEMS: { en: 'Search items...', de: 'Elemente suchen...', fr: 'Rechercher des éléments...', es: 'Buscar elementos...' },
  MSG_CONTAINER_ITEM_DESC: { en: 'Manage reusable items for your containers.', de: 'Verwalten Sie wiederverwendbare Elemente für Ihre Container.', fr: 'Gérez les éléments réutilisables pour vos conteneurs.', es: 'Administre elementos reutilizables para sus contenedores.' },

  // Contact Management
  CONTACT_MGMT: { en: 'Contact Management', de: 'Kontaktverwaltung', fr: 'Gestion des contacts', es: 'Gestión de contactos' },
  TITLE_CREATE_CONTACT: { en: 'Create New Contact', de: 'Neuen Kontakt erstellen', fr: 'Créer un nouveau contact', es: 'Crear nuevo contacto' },
  TITLE_EDIT_CONTACT: { en: 'Edit Contact', de: 'Kontakt bearbeiten', fr: 'Modifier le contact', es: 'Editar contacto' },
  LABEL_FIRST_NAME: { en: 'First Name', de: 'Vorname', fr: 'Prénom', es: 'Nombre' },
  LABEL_LAST_NAME: { en: 'Last Name', de: 'Nachname', fr: 'Nom de famille', es: 'Apellido' },
  LABEL_FULL_NAME: { en: 'Full Name', de: 'Vollständiger Name', fr: 'Nom complet', es: 'Nombre completo' },
  LABEL_JOB_TITLE: { en: 'Job Title', de: 'Berufsbezeichnung', fr: 'Titre du poste', es: 'Título del trabajo' },
  LABEL_COMPANY: { en: 'Company', de: 'Firma', fr: 'Entreprise', es: 'Empresa' },
  LABEL_EMAIL: { en: 'Email', de: 'E-Mail', fr: 'E-mail', es: 'Correo electrónico' },
  LABEL_PHONE: { en: 'Phone', de: 'Telefon', fr: 'Téléphone', es: 'Teléfono' },
  TAB_SOCIAL_LINKS: { en: 'Social Links', de: 'Soziale Medien', fr: 'Réseaux sociaux', es: 'Redes sociales' },
  LABEL_LINKEDIN: { en: 'LinkedIn URL', de: 'LinkedIn URL', fr: 'URL LinkedIn', es: 'URL de LinkedIn' },
  LABEL_TWITTER: { en: 'Twitter URL', de: 'Twitter URL', fr: 'URL Twitter', es: 'URL de Twitter' },
  LABEL_FACEBOOK: { en: 'Facebook URL', de: 'Facebook URL', fr: 'URL Facebook', es: 'URL de Facebook' },
  PLACEHOLDER_CONTACT_NAME: { en: 'Enter contact name...', de: 'Kontaktname eingeben...', fr: 'Entrez le nom du contact...', es: 'Ingrese el nombre del contacto...' },
  MSG_CONTACT_DESC: { en: 'Manage your team members and contacts.', de: 'Verwalten Sie Ihre Teammitglieder und Kontakte.', fr: 'Gérez vos membres d\'équipe et vos contacts.', es: 'Administre los miembros de su equipo y contactos.' },

  // General Buttons & Labels
  BTN_CREATE: { en: 'Create', de: 'Erstellen', fr: 'Créer', es: 'Crear' },
  BTN_CANCEL: { en: 'Cancel', de: 'Abbrechen', fr: 'Annuler', es: 'Cancelar' },
  BTN_SAVE: { en: 'Save', de: 'Speichern', fr: 'Enregistrer', es: 'Guardar' },
  BTN_DELETE: { en: 'Delete', de: 'Löschen', fr: 'Supprimer', es: 'Eliminar' },
  BTN_REMOVE: { en: 'Remove', de: 'Entfernen', fr: 'Retirer', es: 'Eliminar' },
  LABEL_DESCRIPTION: { en: 'Description', de: 'Beschreibung', fr: 'Description', es: 'Descripción' },
  LABEL_ACTIONS: { en: 'Actions', de: 'Aktionen', fr: 'Actions', es: 'Acciones' },
  TAB_IMAGE: { en: 'Image Information', de: 'Bild', fr: 'Image', es: 'Imagen' },

  // Image Upload Messages
  MSG_PASTE_OR_UPLOAD: { en: 'Paste image or click to upload', de: 'Bild einfügen oder zum Hochladen klicken', fr: 'Collez une image ou cliquez pour télécharger', es: 'Pegue la imagen o haga clic para cargar' },
  MSG_SUPPORTS_IMAGE_FORMATS: { en: 'Supports JPG, PNG, WEBP', de: 'Unterstützt JPG, PNG, WEBP', fr: 'Supporte JPG, PNG, WEBP', es: 'Soporta JPG, PNG, WEBP' },
  MSG_UPLOADING: { en: 'Uploading...', de: 'Wird hochgeladen...', fr: 'Téléchargement...', es: 'Subiendo...' },
  LABEL_CHOOSE_FROM_GALLERY: { en: 'Choose from Gallery', de: 'Aus Galerie wählen', fr: 'Choisir dans la galerie', es: 'Elegir de la galería' },

  // Translation Info
  MSG_TRANSLATION_INFO: { en: 'Provide translations for multilingual support. Fallback to English if empty.', de: 'Geben Sie Übersetzungen für mehrsprachige Unterstützung an. Fallback auf Englisch, wenn leer.', fr: 'Fournissez des traductions pour le support multilingue. Retour à l\'anglais si vide.', es: 'Proporcione traducciones para soporte multilingüe. Vuelve a inglés si está vacío.' },

  // Missing Labels for Contact Manager & others
  BTN_CLOSE: { en: 'Close', de: 'Schließen', fr: 'Fermer', es: 'Cerrar' },
  LABEL_VISUAL_VIEW: { en: 'Visual View', de: 'Visuelle Ansicht', fr: 'Vue visuelle', es: 'Vista visual' },
  LABEL_LIST_VIEW: { en: 'List View', de: 'Listenansicht', fr: 'Vue liste', es: 'Vista de lista' },
  BTN_READ_MORE: { en: 'Read More', de: 'Mehr lesen', fr: 'Lire la suite', es: 'Leer más' },
  LABEL_SEARCH_CONTACTS: { en: 'Search contacts...', de: 'Kontakte suchen...', fr: 'Rechercher des contacts...', es: 'Buscar contactos...' },
  LABEL_SORT_BY: { en: 'Sort by', de: 'Sortieren nach', fr: 'Trier par', es: 'Ordenar por' },
  BTN_ADD_CONTACT: { en: 'Add Contact', de: 'Kontakt hinzufügen', fr: 'Ajouter un contact', es: 'Agregar contacto' },
  MSG_REQ_TITLE: { en: 'This field is required.', de: 'Dieses Feld ist erforderlich.', fr: 'Ce champ est obligatoire.', es: 'Este campo es obligatorio.' },
  LABEL_IMAGE_URL: { en: 'Image URL', de: 'Bild URL', fr: 'URL de l\'image', es: 'URL de la imagen' },
  LABEL_IMAGE_NAME: { en: 'Image Name', de: 'Bildname', fr: 'Nom de l\'image', es: 'Nombre de la imagen' },
  LABEL_TRANSLATED_JOB_TITLE: { en: 'Translated Job Title', de: 'Übersetzter Beruf', fr: 'Titre du poste traduit', es: 'Título del trabajo traducido' },
  LABEL_OPEN_OOTB_FORM: { en: 'Open out-of-the-box form', de: 'Standard-Formular öffnen', fr: 'Ouvrir le formulaire standard', es: 'Abrir formulario estándar' },
  TAB_URL: { en: 'URL', de: 'URL', fr: 'URL', es: 'URL' },
  BTN_DEFAULT_LOGO: { en: 'Default Logo', de: 'Standardlogo', fr: 'Logo par défaut', es: 'Logo predeterminado' },

  // Navigation Manager - Header Configuration
  NAV_HEADER_CONFIG: { en: 'Header Configuration', de: 'Kopfzeilen-Konfiguration', fr: 'Configuration de l\'en-tête', es: 'Configuración de encabezado' },
  NAV_MENU_PLACEMENT: { en: 'Menu Placement', de: 'Menü-Platzierung', fr: 'Placement du menu', es: 'Posición del menú' },
  NAV_RIGHT_OF_PAGE: { en: 'Right of Page', de: 'Rechts auf der Seite', fr: 'Droite de la page', es: 'Derecha de la página' },
  NAV_NEAR_LOGO: { en: 'Near Logo', de: 'Neben dem Logo', fr: 'Près du logo', es: 'Cerca del logo' },
  NAV_NEXT_LINE: { en: 'Next Line', de: 'Nächste Zeile', fr: 'Ligne suivante', es: 'Línea siguiente' },
  NAV_ROW_ALIGNMENT: { en: 'Row Alignment', de: 'Zeilen-Ausrichtung', fr: 'Alignement de la ligne', es: 'Alineación de fila' },
  NAV_PAGE_WIDTH: { en: 'Page Width', de: 'Seitenbreite', fr: 'Largeur de la page', es: 'Ancho de página' },
  NAV_FULL_WIDTH: { en: 'Full Width', de: 'Volle Breite', fr: 'Pleine largeur', es: 'Ancho completo' },
  NAV_STANDARD_BOXED: { en: 'Standard (Boxed)', de: 'Standard (Gerahmt)', fr: 'Standard (encadré)', es: 'Estándar (enmarcado)' },
  NAV_BG_COLOR: { en: 'Background Color', de: 'Hintergrundfarbe', fr: 'Couleur de fond', es: 'Color de fondo' },
  NAV_LOGO_SETTINGS: { en: 'Logo Settings', de: 'Logo-Einstellungen', fr: 'Paramètres du logo', es: 'Configuración del logo' },
  NAV_LOGO_POSITION: { en: 'Position', de: 'Position', fr: 'Position', es: 'Posición' },
  BTN_ADD_NAV_ITEM: { en: 'Add Navigation Item', de: 'Navigationselement hinzufügen', fr: 'Ajouter un élément de navigation', es: 'Agregar elemento de navegación' },
  BTN_VISUAL_VIEW: { en: 'Visual View', de: 'Visuelle Ansicht', fr: 'Vue visuelle', es: 'Vista visual' },
  BTN_LIST_VIEW: { en: 'List View', de: 'Listenansicht', fr: 'Vue liste', es: 'Vue liste' },
  LABEL_URL_PAGE: { en: 'URL / Page', de: 'URL / Seite', fr: 'URL / Page', es: 'URL / Página' },
  TH_ACTIONS: { en: 'Actions', de: 'Aktionen', fr: 'Actions', es: 'Acciones' },
  BTN_ADD_NEW: { en: 'Add New', de: 'Neu hinzufügen', fr: 'Ajouter nouveau', es: 'Agregar nuevo' },
  BTN_ADD_LEVEL: { en: 'Add Level', de: 'Ebene hinzufügen', fr: 'Ajouter un niveau', es: 'Agregar nivel' },
  HELP_SLIDE_QUEUE: {
    en: 'Drag with the handle to reorder, or use the arrows for fine-tuning. Duplicate a slide with the copy icon, or edit its content and design.',
    de: 'Ziehen Sie am Griff, um die Reihenfolge zu ändern, oder verwenden Sie die Pfeile zur Feinabstimmung. Duplizieren Sie eine Folie mit dem Kopier-Symbol oder bearbeiten Sie deren Inhalt und Design.',
    fr: 'Faites glisser la poignée pour réorganiser ou utilisez les flèches pour affiner. Dupliquez une diapositive avec l\'icône de copie, ou modifiez son contenu et sa conception.',
    es: 'Arrastre con el controlador para reordenar o use las flechas para ajustar. Duplique una diapositiva con el icono de copiar o edite su contenido y diseño.'
  },
};

export const GLOBAL_DEFAULT_IMAGE = 'https://hochhuth-consulting.de//images/logo.png';

export const DEFAULT_THEME: ThemeConfig = {
  // Brand Colors (Corporate Blue #2f5596)
  '--primary-color': '#2f5596',
  '--secondary-color': '#1f3f73',
  '--brand-light': '#e6ecf7',
  '--brand-dark': '#1c355f',
  '--gradient-primary': 'linear-gradient(135deg, #2f5596 0%, #1f3f73 100%)',

  // Sidebar Specific
  '--sidebar-bg': '#ffffff',
  '--sidebar-text': '#1f2937',
  '--sidebar-text-muted': '#6b7280',
  '--sidebar-border-color': '#e5e7eb',

  '--sidebar-icon-color': '#2f5596',
  '--sidebar-link-color': '#2f5596',
  '--sidebar-link-hover-color': '#1f3f73',
  '--sidebar-active-text-color': '#2f5596',
  '--sidebar-active-indicator-color': '#2f5596',
  '--sidebar-button-color': '#2f5596',
  '--sidebar-active-bg': '#eff6ff',
  '--sidebar-hover-bg': '#f9fafb',

  // Text & Links
  '--text-primary': '#1f2937',
  '--text-secondary': '#4b5563',
  '--text-on-primary': '#ffffff',
  '--link-color': '#2f5596',
  '--link-hover-color': '#1f3f73',

  // Backgrounds
  '--bg-body': '#f8fafc',
  '--bg-surface': '#ffffff',
  '--bg-hover': '#eef2ff',

  // Buttons
  '--btn-primary-bg': '#2f5596',
  '--btn-primary-text': '#ffffff',
  '--btn-primary-hover-bg': '#1f3f73',
  '--btn-secondary-bg': '#ffffff',
  '--btn-secondary-text': '#1f2937',
  '--btn-padding-y': '0.5rem',
  '--btn-padding-x': '1.25rem',
  '--btn-font-size': '14px',

  // Status
  '--status-success': '#16a34a',
  '--status-warning': '#f59e0b',
  '--status-error': '#dc2626',

  // Borders
  '--border-radius-sm': '0px',
  '--border-radius-md': '0px',
  '--border-radius-lg': '0px',
  '--border-color': '#d1d5db',

  // Typography
  '--font-import-url': '',
  '--font-family-base': '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  '--font-family-secondary': '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',

  '--heading-color': '#1f2937',
  '--heading-h1-color': 'var(--heading-color)',
  '--heading-h2-color': 'var(--heading-color)',
  '--heading-h3-color': 'var(--heading-color)',
  '--heading-h4-color': 'var(--heading-color)',
  '--heading-h5-color': 'var(--heading-color)',
  '--heading-h6-color': 'var(--heading-color)',

  '--font-size-base': '14px',
  '--font-size-h1': '42px',
  '--font-size-h2': '32px',
  '--font-size-h3': '24px',
  '--font-size-h4': '20px',
  '--font-size-h5': '16px',
  '--font-size-h6': '14px',
  '--font-weight-bold': '600',

  // Icon Styling
  '--icon-color': '#2f5596',
  '--edit-icon-bg': '#2563eb',
  '--edit-icon-color': '#ffffff',
  '--edit-icon-hover-bg': '#1d4ed8',
};


const recalculateFolderCounts = (folders: ImageFolder[], images: ImageItem[]): ImageFolder[] => {
  return folders.map(f => {
    if (f.id === 'all') return { ...f, count: images.length };
    return { ...f, count: images.filter(i => i.folderId === f.id).length };
  });
};


const MOCK_USERS: PermissionUser[] = [
  { id: 'u1', name: 'Abhishek Tiwari', email: 'abhishek.tiwari@webstudio.de' },
  { id: 'u2', name: 'Aditi Mishra', email: 'aditi.mishra@webstudio.de' },
  { id: 'u3', name: 'Aman Munjal', email: 'aman.munjal@webstudio.de' },
  { id: 'u4', name: 'Amit Kumar', email: 'amit.kumar@webstudio.de' },
  { id: 'u5', name: 'Ankita Pandit', email: 'ankita.pandit@webstudio.de' },
  { id: 'u6', name: 'Shivdutt Mishra', email: 'shivdutt.mishra@webstudio.de' },
];

const MOCK_GROUPS: PermissionGroup[] = [
  { id: 'members', name: 'WebStudio Members', description: 'Control access for visitors and basic users. Ideal for granting read-only or limited permissions.', type: 'Members', memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'] },
  { id: 'visitors', name: 'WebStudio Visitors', description: 'Control access for visitors and basic users. Ideal for granting read-only or limited permissions.', type: 'Visitors', memberIds: [] },
  { id: 'owners', name: 'WebStudio Owners', description: 'Manage high-level permissions for administrators and owners. Use with caution.', type: 'Owners', memberIds: ['u6'] },
];

const unescapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
};

interface AppState {
  viewMode: ViewMode;
  activeModal: ModalType;
  siteConfig: SiteConfig;
  themeConfig: ThemeConfig;
  pages: Page[];
  news: NewsItem[];
  events: EventItem[];
  documents: DocumentItem[];
  images: ImageItem[];
  imageFolders: ImageFolder[];
  translationItems: TranslationItem[];
  permissionGroups: PermissionGroup[];
  permissionUsers: PermissionUser[];
  contactQueries: ContactQuery[];
  containerItems: ContainerItem[];
  contacts: ContactItem[];
  sliderItems: SliderItem[];
  currentPageId: string;
  currentLanguage: LanguageCode;

  uiLabels: Record<string, MultilingualText>;
  editingLabelKey: string | null;
  editingContainerId: string | null;

  toggleViewMode: () => void;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  updateThemeVar: (key: string, value: string) => void;
  setThemeConfig: (config: ThemeConfig) => void;
  setCurrentPage: (id: string) => void;
  resetTheme: () => void;
  setLanguage: (lang: LanguageCode) => void;
  setEditingContainerId: (id: string | null) => void;

  updateNavPosition: (pos: SiteConfig['navPosition']) => void;
  updateNavAlignment: (align: SiteConfig['navAlignment']) => void;
  updateHeaderConfig: (config: Partial<SiteConfig>) => void;
  updateLogo: (logo: SiteConfig['logo']) => void;
  addNavItem: (item: NavItem) => Promise<void>;
  updateNavItem: (item: NavItem) => Promise<void>;
  deleteNavItem: (id: string) => Promise<void>;

  addNews: (item: NewsItem) => Promise<NewsItem | null>;
  updateNews: (item: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;

  addEvent: (item: EventItem) => Promise<EventItem | null>;
  updateEvent: (item: EventItem) => void;
  deleteEvent: (id: string) => void;

  addDocument: (item: DocumentItem) => Promise<DocumentItem | null>;
  updateDocument: (item: DocumentItem) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  addContainerItem: (item: ContainerItem) => Promise<ContainerItem | null>;
  updateContainerItem: (item: ContainerItem) => void;
  deleteContainerItem: (id: string) => void;

  addSliderItem: (item: SliderItem) => Promise<SliderItem | null>;
  updateSliderItem: (item: SliderItem) => Promise<void>;
  deleteSliderItem: (id: string) => Promise<void>;

  addContact: (item: ContactItem) => Promise<ContactItem | null>;
  updateContact: (item: ContactItem) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  addImage: (item: ImageItem) => void;
  uploadImage: (file: File, folderId?: string, metadata?: any) => Promise<ImageItem | null>;
  checkImageExists: (fileName: string, folderId?: string) => Promise<boolean>;
  updateImage: (item: ImageItem) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;

  updateTranslationItem: (id: string, sourceList: string, original: string, lang: string, value: string) => void;

  // Permission Actions
  createPermissionGroup: (group: PermissionGroup) => void;
  updatePermissionGroup: (group: PermissionGroup) => void;
  addMemberToGroup: (groupId: string, userId: string) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;

  // Contact Query Actions
  addContactQuery: (query: ContactQuery) => Promise<void>;
  deleteContactQuery: (ids: string[]) => Promise<void>;

  updateFooterConfig: (config: Partial<SiteConfig['footer']>) => void;

  openLabelEditor: (key: string) => void;
  updateLabel: (key: string, text: string, lang: LanguageCode) => void;

  addPage: (page: Page) => Promise<Page | null>;
  updatePage: (page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  addContainer: (pageId: string, container: Container) => Promise<Container | null>;
  updateContainer: (pageId: string, container: Container) => Promise<void>;
  deleteContainer: (pageId: string, cId: string) => Promise<void>;
  reorderContainers: (pageId: string, newOrder: Container[]) => void;

  // SharePoint Data Loading Actions
  loadFromSharePoint: () => Promise<void>;
  saveGlobalSettings: (type: 'theme' | 'site' | 'labels' | 'app') => Promise<void>;
  syncTranslations: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;

  activeTranslationSource: string;
  setTranslationSource: (source: string) => void;
  translationSources: string[];

  // Helper functions for managing taggedItems
  removeItemFromContainers: (itemId: string) => Promise<void>;
  validateContainerTaggedItems: () => Promise<void>;
}

export const useStore = create<AppState>()(
  (set, get) => ({
    viewMode: ViewMode.EDIT,
    activeModal: ModalType.NONE,
    themeConfig: DEFAULT_THEME,
    pages: [],
    news: [],
    events: [],
    documents: [],
    containerItems: [],
    contacts: [],
    sliderItems: [],
    images: [],
    imageFolders: [],
    translationItems: [],
    permissionGroups: MOCK_GROUPS,
    permissionUsers: MOCK_USERS,
    contactQueries: [],
    currentPageId: '1',
    currentLanguage: 'en',
    uiLabels: INITIAL_UI_LABELS,
    editingLabelKey: null,
    editingContainerId: null,
    isLoading: false,
    activeTranslationSource: 'TopNavigation',
    translationSources: [
      'TopNavigation',
      'SmartPages',
      'News',
      'Events',
      'Documents',
      'Containers',
      'GlobalSettings',
      'ContactQueries',
      'TranslationDictionary',
      'Images',
      'ContainerItems',
      'Contacts'
    ],
    siteConfig: {
      name: 'My Enterprise Site',
      languages: ['en', 'de', 'fr', 'es'],
      defaultLanguage: 'en',
      navPosition: 'right',
      navAlignment: 'center',
      headerWidth: 'full',
      headerBackgroundColor: '#ffffff',
      logo: { url: '', position: 'left', width: '150px' },
      navigation: [],
      footer: {
        template: 'Table',
        backgroundColor: 'site-color',
        alignment: 'left',
        subFooterText: 'Powered By : Web Studio CMS',
        fontSettings: { headingSize: '16px', subHeadingSize: '14px' },
        columns: [
          { id: '1', title: 'Platform', links: [{ id: 'l1', label: 'SharePoint Online', url: '#' }, { id: 'l2', label: 'Power Platform', url: '#' }] },
          { id: '2', title: 'Legal', links: [{ id: 'l4', label: 'Privacy Policy', url: '#' }, { id: 'l5', label: 'Terms of Service', url: '#' }] },
          { id: '3', title: 'Company', links: [{ id: 'l7', label: 'About Us', url: '#' }, { id: 'l9', label: 'Contact', url: '#' }] }
        ],
        contactInfo: { address: 'Christinenstr 16, 10119 Berlin', email: 'info@webstudio.de', phone: '+49 30 868706600' },
        socialLinks: { linkedin: 'https://linkedin.com', facebook: '', twitter: '', instagram: '' },
        copyright: { en: '© 2026 Web Studio Corp', de: '© 2026 Unternehmen Corp', fr: '© 2026 Entreprise Corp', es: '© 2026 Empresa Corp' }
      }
    },

    toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === ViewMode.PREVIEW ? ViewMode.EDIT : ViewMode.PREVIEW })),
    openModal: (type) => set({ activeModal: type }),
    closeModal: () => set({ activeModal: ModalType.NONE, editingLabelKey: null, editingContainerId: null }),
    updateThemeVar: (key, value) => {
      set((state) => ({ themeConfig: { ...state.themeConfig, [key]: value } }));
      get().saveGlobalSettings('theme');
    },
    setThemeConfig: (config) => {
      set({ themeConfig: config });
      get().saveGlobalSettings('theme');
    },
    setCurrentPage: (id) => {
      const state = get();
      const page = state.pages.find(p => p.id === id);
      if (page) {
        const hash = page.slug === '/' ? '' : page.slug;
        if (window.location.hash !== `#${hash}`) {
          window.location.hash = hash;
        }
        // Also set it immediately for responsiveness
        set({ currentPageId: id });
      }
      get().saveGlobalSettings('app');
    },
    resetTheme: () => {
      set({ themeConfig: DEFAULT_THEME });
      get().saveGlobalSettings('theme');
    },
    setLanguage: (lang) => {
      set({ currentLanguage: lang });
      get().saveGlobalSettings('app');
    },
    setEditingContainerId: (id) => {
      set({ editingContainerId: id });
      get().saveGlobalSettings('app');
    },
    setTranslationSource: (source) => set({ activeTranslationSource: source }),

    updateNavPosition: (pos) => {
      set((state) => ({ siteConfig: { ...state.siteConfig, navPosition: pos } }));
      get().saveGlobalSettings('site');
    },
    updateNavAlignment: (align) => {
      set((state) => ({ siteConfig: { ...state.siteConfig, navAlignment: align } }));
      get().saveGlobalSettings('site');
    },
    updateHeaderConfig: (config) => {
      set((state) => ({ siteConfig: { ...state.siteConfig, ...config } }));
      get().saveGlobalSettings('site');
    },
    updateLogo: (logo) => {
      set((state) => ({ siteConfig: { ...state.siteConfig, logo } }));
      get().saveGlobalSettings('site');
    },
    addNavItem: async (item) => {
      try {
        const { saveNavItem } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          ParentId: item.parentId !== 'root' ? Number(item.parentId) : null,
          NavType: item.type,
          SmartPageId: item.pageId ? Number(item.pageId) : null,
          ExternalURL: item.url || '',
          SortOrder: item.order,
          IsVisible: item.isVisible,
          OpenInNewTab: item.openInNewTab || false,
          Translations: JSON.stringify(item.translations || {})
        };
        const result = await saveNavItem(spData);
        const realId = result.Id || result.data.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ siteConfig: { ...state.siteConfig, navigation: [...state.siteConfig.navigation, newItem] } }));
      } catch (error) {
        console.error('Error adding nav item:', error);
      }
    },

    updateNavItem: async (item) => {
      try {
        const { updateNavItem: updateNavItemSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          ParentId: item.parentId !== 'root' ? Number(item.parentId) : null,
          NavType: item.type,
          SmartPageId: item.pageId ? Number(item.pageId) : null,
          ExternalURL: item.url || '',
          SortOrder: item.order,
          IsVisible: item.isVisible,
          OpenInNewTab: item.openInNewTab || false,
          Translations: JSON.stringify(item.translations || {})
        };
        await updateNavItemSP(Number(item.id), spData);
        set((state) => ({ siteConfig: { ...state.siteConfig, navigation: state.siteConfig.navigation.map(n => n.id === item.id ? item : n) } }));
      } catch (error) {
        console.error('Error updating nav item:', error);
      }
    },

    deleteNavItem: async (id) => {
      try {
        const { deleteNavItem: deleteNavItemSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        await deleteNavItemSP(Number(id));
        set((state) => ({ siteConfig: { ...state.siteConfig, navigation: state.siteConfig.navigation.filter(n => n.id !== id && n.parentId !== id) } }));
      } catch (error) {
        console.error('Error deleting nav item:', error);
      }
    },

    addNews: async (item) => {
      try {
        const { saveNews } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          Status: item.status,
          PublishDate: item.publishDate,
          Description: item.description,
          ReadMoreURL: item.readMore?.url || '',
          ReadMoreText: item.readMore?.text || '',
          ReadMoreEnabled: item.readMore?.enabled || false,
          SEOConfig: JSON.stringify(item.seo || {}),
          Translations: JSON.stringify(item.translations || {}),
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || ''
        };
        const result = await saveNews(spData);
        console.log('saveNews Result:', result); // Debugging
        // PnPjs returns { data: { Id: ... } }
        const realId = result.data ? result.data.Id : result.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ news: [...state.news, newItem] }));
        return newItem;
      } catch (error) {
        console.error('Error adding news:', error);
        return null;
      }
    },

    updateNews: async (item) => {
      try {
        // Update local state immediately for responsiveness
        set((state) => ({ news: state.news.map(n => n.id === item.id ? item : n) }));

        // Verify ID is numeric (real SP item) before calling service
        if (!isNaN(Number(item.id))) {
          const { updateNews: updateNewsSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          if (updateNewsSP) {
            const spData = {
              Title: item.title,
              Status: item.status,
              PublishDate: item.publishDate,
              Description: item.description,
              ReadMoreURL: item.readMore?.url || '',
              ReadMoreText: item.readMore?.text || '',
              ReadMoreEnabled: item.readMore?.enabled || false,
              SEOConfig: JSON.stringify(item.seo || {}),
              Translations: JSON.stringify(item.translations || {}),
              ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
              ImageName: item.imageName || ''
            };
            await updateNewsSP(Number(item.id), spData);
            console.log(`✅ News updated in SharePoint: ${item.id}`);
          }
        } else {
          console.warn(`Skipping SP update for non-numeric News ID: ${item.id}`);
        }
      } catch (error) {
        console.error('Error updating news:', error);
        // Optionally revert local state here if needed
      }
    },

    deleteNews: async (id) => {
      try {
        if (!isNaN(Number(id))) {
          const { deleteNews: deleteNewsSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          await deleteNewsSP(Number(id));
        } else {
          console.warn(`Skipping SP delete for non-numeric News ID: ${id}`);
        }
        set((state) => ({ news: state.news.filter(n => n.id !== id) }));

        // Remove from all containers' taggedItems
        get().removeItemFromContainers(id);
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    },

    addEvent: async (item) => {
      try {
        const { saveEvent } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          StartDate: item.startDate,
          EndDate: item.endDate,
          Location: item.location,
          Description: item.description,
          Category: item.category,
          Translations: JSON.stringify(item.translations || {}),
          Status: item.status,
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || '',
          ReadMoreURL: item.readMore?.url || '',
          ReadMoreText: item.readMore?.text || '',
          ReadMoreEnabled: item.readMore?.enabled || false,
          SEOConfig: JSON.stringify(item.seo || {})
        };
        const result = await saveEvent(spData);
        console.log('saveEvent Result:', result); // Debugging
        const realId = result.data ? result.data.Id : result.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ events: [...state.events, newItem] }));
        return newItem;
      } catch (error) {
        console.error('Error adding event:', error);
        return null;
      }
    },
    updateEvent: async (item) => {
      try {
        // Update local state immediately
        set((state) => ({ events: state.events.map(n => n.id === item.id ? item : n) }));

        if (!isNaN(Number(item.id))) {
          const { updateEvent: updateEventSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          if (updateEventSP) {
            const spData = {
              Title: item.title,
              StartDate: item.startDate,
              EndDate: item.endDate,
              Location: item.location,
              Description: item.description,
              Category: item.category,
              Translations: JSON.stringify(item.translations || {}),
              Status: item.status,
              ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
              ImageName: item.imageName || '',
              ReadMoreURL: item.readMore?.url || '',
              ReadMoreText: item.readMore?.text || '',
              ReadMoreEnabled: item.readMore?.enabled || false,
              SEOConfig: JSON.stringify(item.seo || {})
            };
            await updateEventSP(Number(item.id), spData);
            console.log(`✅ Event updated in SharePoint: ${item.id}`);
          }
        } else {
          console.warn(`Skipping SP update for non-numeric Event ID: ${item.id}`);
        }
      } catch (error) {
        console.error('Error updating event:', error);
      }
    },
    deleteEvent: async (id) => {
      try {
        if (!isNaN(Number(id))) {
          const { deleteEvent: deleteEventSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          await deleteEventSP(Number(id));
        } else {
          console.warn(`Skipping SP delete for non-numeric Event ID: ${id}`);
        }
        set((state) => ({ events: state.events.filter(n => n.id !== id) }));

        // Remove from all containers' taggedItems
        get().removeItemFromContainers(id);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    },

    addDocument: async (item) => {
      try {
        const { saveDocument } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          DocStatus: item.status,
          DocumentYear: item.year,
          DocumentDescriptions: item.description,
          ItemRank: item.itemRank,
          DocType: item.type,
          FileRef: item.url,
          File: item.file,
          SortOrder: item.sortOrder || 0,
          Translations: item.translations ? JSON.stringify(item.translations) : '{}',
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || ''
        };
        const result = await saveDocument(spData);
        console.log('saveDocument Result:', result); // Debugging
        const realId = result.data ? result.data.Id : result.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ documents: [...state.documents, newItem] }));
        return newItem;
      } catch (error) {
        console.error('Error adding document:', error);
        return null;
      }
    },

    updateDocument: async (item) => {
      try {
        const { updateDocument: updateDocumentSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          Name: item.name, // Include for rename detection
          DocumentYear: item.year,
          DocStatus: item.status,
          ItemRank: item.itemRank,
          DocType: item.type,
          DocumentDescriptions: item.description,
          SortOrder: item.sortOrder || 0,
          Translations: item.translations ? JSON.stringify(item.translations) : '{}',
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || '',
        };
        await updateDocumentSP(Number(item.id), spData);
        set((state) => ({ documents: state.documents.map(n => n.id === item.id ? item : n) }));
      } catch (error) {
        console.error('Error updating document:', error);
      }
    },

    deleteDocument: async (id) => {
      try {
        const { deleteDocument: deleteDocumentSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        await deleteDocumentSP(Number(id));
        set((state) => ({ documents: state.documents.filter(n => n.id !== id) }));

        // Remove from all containers' taggedItems
        get().removeItemFromContainers(id);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    },

    addContainerItem: async (item) => {
      try {
        const { saveContainerItem } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          Status: item.status,
          SortOrder: item.sortOrder,
          Description: item.description,
          Translations: JSON.stringify(item.translations || {}),
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || ''
        };
        const result = await saveContainerItem(spData);
        const realId = result.data ? result.data.Id : result.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ containerItems: [...state.containerItems, newItem] }));
        return newItem;
      } catch (error) {
        console.error('Error adding container item:', error);
        return null;
      }
    },

    updateContainerItem: async (item) => {
      try {
        set((state) => ({ containerItems: state.containerItems.map(n => n.id === item.id ? item : n) }));
        if (!isNaN(Number(item.id))) {
          const { updateContainerItem: updateContainerItemSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          const spData = {
            Title: item.title,
            Status: item.status,
            SortOrder: item.sortOrder,
            Description: item.description,
            Translations: JSON.stringify(item.translations || {}),
            ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
            ImageName: item.imageName || ''
          };
          await updateContainerItemSP(Number(item.id), spData);
        }
      } catch (error) {
        console.error('Error updating container item:', error);
      }
    },

    deleteContainerItem: async (id) => {
      try {
        if (!isNaN(Number(id))) {
          const { deleteContainerItem: deleteContainerItemSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          await deleteContainerItemSP(Number(id));
        }
        set((state) => ({ containerItems: state.containerItems.filter(n => n.id !== id) }));

        // Remove from all containers' taggedItems
        get().removeItemFromContainers(id);
      } catch (error) {
        console.error('Error deleting container item:', error);
      }
    },

    addSliderItem: async (item) => {
      try {
        const { saveSliderItem } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.title,
          Subtitle: item.subtitle || '',
          Description: item.description || '',
          Status: item.status,
          SortOrder: item.sortOrder,
          CtaText: item.ctaText || '',
          CtaUrl: item.ctaUrl || '',
          Translations: JSON.stringify(item.translations || {}),
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || ''
        };
        const result = await saveSliderItem(spData);
        const realId = result.data ? result.data.Id : result.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ sliderItems: [...state.sliderItems, newItem] }));
        return newItem;
      } catch (error) {
        console.error('Error adding slider item:', error);
        return null;
      }
    },

    updateSliderItem: async (item) => {
      try {
        set((state) => ({ sliderItems: state.sliderItems.map(n => n.id === item.id ? item : n) }));
        if (!isNaN(Number(item.id))) {
          const { updateSliderItem: updateSliderItemSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          const spData = {
            Title: item.title,
            Subtitle: item.subtitle || '',
            Description: item.description || '',
            Status: item.status,
            SortOrder: item.sortOrder,
            CtaText: item.ctaText || '',
            CtaUrl: item.ctaUrl || '',
            Translations: JSON.stringify(item.translations || {}),
            ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
            ImageName: item.imageName || ''
          };
          await updateSliderItemSP(Number(item.id), spData);
        }
      } catch (error) {
        console.error('Error updating slider item:', error);
      }
    },

    deleteSliderItem: async (id) => {
      try {
        if (!isNaN(Number(id))) {
          const { deleteSliderItem: deleteSliderItemSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          await deleteSliderItemSP(Number(id));
        }
        set((state) => ({ sliderItems: state.sliderItems.filter(n => n.id !== id) }));

        // Remove from all containers' taggedItems
        get().removeItemFromContainers(id);
      } catch (error) {
        console.error('Error deleting slider item:', error);
      }
    },

    addContact: async (item) => {
      try {
        const { saveContact } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: item.fullName,
          FirstName: item.firstName || '',
          LastName: item.lastName || '',
          Status: item.status,
          SortOrder: item.sortOrder,
          JobTitle: item.jobTitle || '',
          Company: item.company || '',
          Email: item.email || '',
          Phone: item.phone || '',
          Description: item.description,
          Translations: JSON.stringify(item.translations || {}),
          ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
          ImageName: item.imageName || ''
        };
        const result = await saveContact(spData);
        const realId = result.data ? result.data.Id : result.Id;
        const newItem = { ...item, id: String(realId) };
        set((state) => ({ contacts: [...state.contacts, newItem] }));
        return newItem;
      } catch (error) {
        console.error('Error adding contact:', error);
        return null;
      }
    },

    updateContact: async (item) => {
      try {
        set((state) => ({ contacts: state.contacts.map(n => n.id === item.id ? item : n) }));
        if (!isNaN(Number(item.id))) {
          const { updateContact: updateContactSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          const spData = {
            Title: item.fullName,
            FirstName: item.firstName || '',
            LastName: item.lastName || '',
            Status: item.status,
            SortOrder: item.sortOrder,
            JobTitle: item.jobTitle || '',
            Company: item.company || '',
            Email: item.email || '',
            Phone: item.phone || '',
            Description: item.description,
            Translations: JSON.stringify(item.translations || {}),
            ImageUrl: { Url: item.imageUrl || '', Description: item.imageName || '' },
            ImageName: item.imageName || ''
          };
          await updateContactSP(Number(item.id), spData);
          console.log(`✅ Contact updated in SharePoint: ${item.id}`);
        }
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    },

    deleteContact: async (id) => {
      try {
        if (!isNaN(Number(id))) {
          const { deleteContact: deleteContactSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          await deleteContactSP(Number(id));
        }
        set((state) => ({ contacts: state.contacts.filter(n => n.id !== id) }));

        // Remove from all containers' taggedItems
        get().removeItemFromContainers(id);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    },

    addImage: (item) => set((state) => {
      const newImages = [...state.images, item];
      return {
        images: newImages,
        imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
      };
    }),

    checkImageExists: async (fileName: string, folderId: string = '') => {
      try {
        const { checkImageExists } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        return await checkImageExists(fileName, folderId);
      } catch (error) {
        console.error('Error checking image existence:', error);
        return false;
      }
    },

    uploadImage: async (file: File, folderId?: string, metadata?: any) => {
      try {
        const { uploadImage } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const result = await uploadImage(file, folderId, metadata);

        if (result && result.item) {
          const newItem: ImageItem = {
            id: String(result.item.Id),
            name: result.item.FileLeafRef,
            url: result.item.FileRef,
            folderId: folderId || 'all',
            title: metadata?.Title || result.item.FileLeafRef,
            description: metadata?.Description || '',
            createdDate: result.item.Created || new Date().toISOString(),
            modifiedDate: result.item.Modified || new Date().toISOString(),
            createdBy: 'System'
          };

          set((state: AppState) => {
            const newImages = [...state.images.filter(img => img.id !== newItem.id), newItem];
            return {
              images: newImages,
              imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
            };
          });
          return newItem;
        }
        return null;
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    },

    updateImage: async (item: ImageItem) => {
      try {
        const { updateImage } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');

        let fileToUpload: File | undefined;
        if (item.url && item.url.startsWith('data:')) {
          const response = await fetch(item.url);
          const blob = await response.blob();
          fileToUpload = new File([blob], item.name, { type: blob.type });
        }

        const updatedMetadata = {
          Title: item.title,
          Description: item.description,
          AssetCategory: item.folderId !== 'all' ? item.folderId : undefined
        };

        const result = await updateImage(Number(item.id), fileToUpload, updatedMetadata);

        const updatedItem: ImageItem = {
          ...item,
          id: String(result.Id),
          name: result.FileLeafRef,
          url: result.FileRef,
          title: result.Title || result.FileLeafRef,
          description: result.Description || '',
          modifiedDate: result.Modified || new Date().toISOString()
        };

        set((state: AppState) => {
          const newImages = state.images.map(i => i.id === updatedItem.id ? updatedItem : i);
          return {
            images: newImages,
            imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
          };
        });
      } catch (error) {
        console.error('Error updating image:', error);
      }
    },
    deleteImage: async (id) => {
      try {
        const { deleteImage } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        await deleteImage(Number(id));

        set((state) => {
          const newImages = state.images.filter(i => i.id !== id);
          return {
            images: newImages,
            imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
          };
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    },

    updateTranslationItem: (id, sourceList, original, lang, value) => set((state) => {
      const existingIndex = state.translationItems.findIndex(item => item.id === id);
      if (existingIndex >= 0) {
        const newItems = [...state.translationItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          translations: { ...newItems[existingIndex].translations, [lang]: value },
          lastUpdated: new Date().toISOString()
        };
        return { translationItems: newItems };
      } else {
        const newItem: TranslationItem = {
          id,
          sourceList,
          original,
          translations: { [lang]: value },
          lastUpdated: new Date().toISOString()
        };
        return { translationItems: [...state.translationItems, newItem] };
      }
    }),

    // Permission Actions
    createPermissionGroup: (group) => set((state) => ({ permissionGroups: [...state.permissionGroups, group] })),
    updatePermissionGroup: (group) => set((state) => ({ permissionGroups: state.permissionGroups.map(g => g.id === group.id ? group : g) })),
    addMemberToGroup: (groupId: string, userId: string) => set((state) => ({
      permissionGroups: state.permissionGroups.map(g => g.id === groupId ? { ...g, memberIds: [...g.memberIds, userId] } : g)
    })),
    removeMemberFromGroup: (groupId: string, userId: string) => set((state) => ({
      permissionGroups: state.permissionGroups.map(g => g.id === groupId ? { ...g, memberIds: g.memberIds.filter(id => id !== userId) } : g)
    })),

    // Contact Query Actions
    addContactQuery: async (query) => {
      try {
        // Add to local state immediately for responsiveness
        set((state) => ({ contactQueries: [query, ...state.contactQueries] }));

        // Save to SharePoint
        const { saveContactQuery } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: query.email || 'Anonymous',
          SourcePageId: query.pageId ? Number(query.pageId) : null,
          QueryStatus: query.status,
          FormData: JSON.stringify({
            fields: query.fields,
            firstName: query.firstName,
            lastName: query.lastName,
            email: query.email,
            pageName: query.pageName,
            containerId: query.containerId,
            created: query.created
          })
        };
        const result = await saveContactQuery(spData);
        const realId = result.data ? result.data.Id : result.Id;

        // Update with real SharePoint ID
        set((state) => ({
          contactQueries: state.contactQueries.map(q =>
            q.id === query.id ? { ...q, id: String(realId) } : q
          )
        }));

        console.log(`✅ Contact query saved to SharePoint with ID: ${realId}`);
      } catch (error) {
        console.error('Error saving contact query:', error);
      }
    },

    deleteContactQuery: async (ids: string[]) => {
      try {
        // Delete from SharePoint
        const { deleteContactQueries } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const numericIds = ids.filter(id => !isNaN(Number(id))).map(id => Number(id));
        if (numericIds.length > 0) {
          await deleteContactQueries(numericIds);
        }

        // Update local state
        set((state) => ({ contactQueries: state.contactQueries.filter(q => !ids.includes(q.id)) }));
        console.log(`✅ Deleted ${ids.length} contact queries`);
      } catch (error) {
        console.error('Error deleting contact queries:', error);
      }
    },

    updateFooterConfig: (config) => set((state) => ({ siteConfig: { ...state.siteConfig, footer: { ...state.siteConfig.footer, ...config } } })),

    openLabelEditor: (key) => set({ activeModal: ModalType.LABEL_EDITOR, editingLabelKey: key }),
    updateLabel: (key, text, lang) => set((state) => ({ uiLabels: { ...state.uiLabels, [key]: { ...state.uiLabels[key], [lang]: text } }, activeModal: ModalType.NONE, editingLabelKey: null })),

    addPage: async (page) => {
      try {
        // 1. Save Page to SharePoint
        const { savePage, saveContainer } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spPageData = {
          Title: page.title.en,
          MultilingualTitle: JSON.stringify(page.title),
          Slug: page.slug,
          PageStatus: page.status,
          IsHomePage: page.isHomePage,
          Description: page.description,
          SEOConfig: JSON.stringify(page.seo || {}),
          VersionNote: 'Initial Creation'
        };

        const savedPage = await savePage(spPageData);
        // PnPjs returns { data: { Id: ... } }
        const realPageId = String(savedPage.Id);

        // 2. Assign Real ID to Containers & Save Them
        const containersToSave = page.containers && page.containers.length > 0
          ? page.containers
          : [];

        const savedContainersWithIds: Container[] = [];

        for (const container of containersToSave) {
          const spContainerData = {
            PageId: Number(realPageId),
            ContainerType: container.type,
            SortOrder: container.order,
            Settings: JSON.stringify(container.settings || {}),
            ContainerContent: JSON.stringify(container.content || {}),
            IsVisible: container.isVisible,
            Title: container.title || container.settings?.containerTitle || container.settings?.title || container.type,
            BtnEnabled: container.settings?.btnEnabled || false,
            BtnName: container.settings?.btnName || '',
            BtnUrl: container.settings?.btnUrl || ''
          };
          const savedContainer = await saveContainer(spContainerData);
          savedContainersWithIds.push({ ...container, id: String(savedContainer.data.Id), pageId: realPageId });
        }

        // 3. Update Local Store with Fully Populated Page
        const newPage: Page = {
          ...page,
          id: realPageId,
          title: page.title, // Keep full object
          containers: savedContainersWithIds,
          modifiedDate: savedPage.Modified || new Date().toISOString()
        };

        set((state) => ({ pages: [...state.pages, newPage] }));
        console.log(`✅ Page created with ID: ${realPageId}`);
        return newPage;

      } catch (error) {
        console.error('Error adding page:', error);
        return null;
      }
    },

    updatePage: async (page) => {
      try {
        const { updatePage: updatePageSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          Title: page.title.en,
          MultilingualTitle: JSON.stringify(page.title),
          Slug: page.slug,
          PageStatus: page.status,
          IsHomePage: page.isHomePage,
          Description: page.description,
          SEOConfig: JSON.stringify(page.seo || {})
        };
        await updatePageSP(Number(page.id), spData);
        set((state) => ({ pages: state.pages.map(p => p.id === page.id ? page : p) }));
      } catch (error) {
        console.error('Error updating page:', error);
      }
    },

    deletePage: async (id) => {
      try {
        const { deletePage: deletePageSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        await deletePageSP(Number(id));
        // Also remove containers locally (SP cascade delete not assumed, but keeping store clean)
        set((state) => ({ pages: state.pages.filter(p => p.id !== id) }));
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    },
    addContainer: async (pageId, container) => {
      try {
        console.log('📦 Adding container with settings:', container.settings);

        // Process settings to upload any external image URLs to SharePoint
        const processedSettings = { ...container.settings };

        // Check if container has a background image URL
        if (processedSettings.bgImage && typeof processedSettings.bgImage === 'string' && processedSettings.bgImage.trim() !== '') {
          console.log(`🔍 Found bgImage URL: ${processedSettings.bgImage}`);

          // Import the uploadImageFromUrl function
          const { uploadImageFromUrl } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');

          // Upload the image and get the SharePoint URL
          const sharePointUrl = await uploadImageFromUrl(
            processedSettings.bgImage,
            'Containers',
            {
              Title: container.title || container.content?.title?.en || 'Container Background',
              Description: `Background image for container ${container.type}`,
              AltText: 'Container background image'
            }
          );

          // Update the settings with the SharePoint URL
          if (sharePointUrl) {
            processedSettings.bgImage = sharePointUrl;
            console.log(`✅ Updated bgImage to SharePoint URL: ${sharePointUrl}`);
          }
        }

        const { saveContainer } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          PageId: Number(pageId),
          ContainerType: container.type,
          SortOrder: container.order,
          Settings: JSON.stringify(processedSettings),
          ContainerContent: JSON.stringify(container.content || {}),
          IsVisible: container.isVisible,
          Title: container.title || container.settings?.containerTitle || container.settings?.title || container.type,
          BtnEnabled: processedSettings.btnEnabled || false,
          BtnName: processedSettings.btnName || '',
          BtnUrl: processedSettings.btnUrl || ''
        };
        const savedItem = await saveContainer(spData);
        // PnPjs returns { data: { Id: ... } }
        const newContainer = {
          ...container,
          id: String(savedItem.Id),
          pageId,
          settings: processedSettings // Use processed settings with SharePoint URLs
        };
        set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: [...p.containers, newContainer] } : p) }));
        return newContainer;
      } catch (error) {
        console.error('Error adding container:', error);
        return null;
      }
    },

    updateContainer: async (pageId, container) => {
      try {
        console.log('🔄 Updating container with settings:', container.settings);

        // Process settings to upload any external image URLs to SharePoint
        const processedSettings = { ...container.settings };

        // Check if container has a background image URL that isn't already from SharePoint
        if (processedSettings.bgImage && typeof processedSettings.bgImage === 'string' && processedSettings.bgImage.trim() !== '') {
          console.log(`🔍 Found bgImage URL: ${processedSettings.bgImage}`);

          // Import the uploadImageFromUrl function
          const { uploadImageFromUrl } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');

          // Upload the image and get the SharePoint URL (will skip if already SharePoint URL)
          const sharePointUrl = await uploadImageFromUrl(
            processedSettings.bgImage,
            'Containers',
            {
              Title: container.title || container.content?.title?.en || 'Container Background',
              Description: `Background image for container ${container.type}`,
              AltText: 'Container background image'
            }
          );

          // Update the settings with the SharePoint URL
          if (sharePointUrl) {
            processedSettings.bgImage = sharePointUrl;
            console.log(`✅ Updated bgImage to SharePoint URL: ${sharePointUrl}`);
          }
        }

        const { updateContainer: updateContainerSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const spData = {
          PageId: Number(pageId),
          ContainerType: container.type,
          SortOrder: container.order,
          Settings: JSON.stringify(processedSettings),
          ContainerContent: JSON.stringify(container.content || {}),
          IsVisible: container.isVisible,
          Title: container.title || container.settings?.containerTitle || container.settings?.title || container.type,
          BtnEnabled: processedSettings.btnEnabled || false,
          BtnName: processedSettings.btnName || '',
          BtnUrl: processedSettings.btnUrl || ''
        };
        await updateContainerSP(Number(container.id), spData);

        // Update local state with processed settings
        const updatedContainer = { ...container, settings: processedSettings };
        set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: p.containers.map(c => c.id === container.id ? updatedContainer : c) } : p) }));
      } catch (error) {
        console.error('Error updating container:', error);
      }
    },

    deleteContainer: async (pageId, cId) => {
      try {
        const { deleteContainer: deleteContainerSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        await deleteContainerSP(Number(cId));
        set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: p.containers.filter(c => c.id !== cId) } : p) }));
      } catch (error) {
        console.error('Error deleting container:', error);
      }
    },
    reorderContainers: (pageId, newOrder) => set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: newOrder } : p) })),

    // SharePoint Data Loading Actions
    saveGlobalSettings: async (type) => {
      try {
        const { upsertGlobalSetting } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const state = get();
        let key = '';
        let data = '';

        if (type === 'theme') {
          key = 'THEME_CONFIG';
          data = JSON.stringify(state.themeConfig);
        } else if (type === 'site') {
          key = 'SITE_CONFIG';
          // Exclude navigation from config blob to avoid redundancy
          const { navigation: _navigation, ...configToSave } = state.siteConfig;
          data = JSON.stringify(configToSave);
        } else if (type === 'labels') {
          key = 'UI_LABELS';
          data = JSON.stringify(state.uiLabels);
        } else if (type === 'app') {
          key = 'APP_STATE';
          data = JSON.stringify({
            currentPageId: state.currentPageId,
            currentLanguage: state.currentLanguage,
            editingContainerId: state.editingContainerId
          });
        }

        if (key && data) {
          await upsertGlobalSetting(key, { ConfigData: data });
          console.log(`✅ Saved ${type} settings to SharePoint`);
        }
      } catch (error) {
        console.error(`❌ Error saving ${type} settings:`, error);
      }
    },

    syncTranslations: async () => {
      try {
        const { upsertTranslation } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
        const state = get();

        for (const item of state.translationItems) {
          await upsertTranslation(item.id, item.translations, item.sourceList);
        }
        console.log('✅ Translations synced to SharePoint');
      } catch (error) {
        console.error('❌ Error syncing translations:', error);
      }
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    loadFromSharePoint: async () => {
      try {
        set({ isLoading: true });
        console.log('🔄 Loading data from SharePoint...');

        // Dynamically import SP service functions
        const {
          getPages,
          getContainersByPageId,
          getNavigation,
          getNews,
          getEvents,
          getDocuments,
          getImages,
          getFolders,
          getGlobalSettings,
          getTranslations,
          getContainerItems,
          getContactQueries,
          getContacts,
          getSliderItems
        } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');

        // Load all data in parallel
        const [spPages, spNav, spNews, spEvents, spDocs, spSettings, spTranslations, spContainerItems, spContactQueries, spContacts, spSliderItems] = await Promise.all([
          getPages().catch(err => { console.error('Error loading pages:', err); return []; }),
          getNavigation().catch(err => { console.error('Error loading nav:', err); return []; }),
          getNews().catch(err => { console.error('Error loading news:', err); return []; }),
          getEvents().catch(err => { console.error('Error loading events:', err); return []; }),
          getDocuments().catch(err => { console.error('Error loading documents:', err); return []; }),
          getGlobalSettings().catch(err => { console.error('Error loading settings:', err); return []; }),
          getTranslations().catch(err => { console.error('Error loading translations:', err); return []; }),
          getContainerItems().catch(err => { console.error('Error loading container items:', err); return []; }),
          getContactQueries().catch(err => { console.error('Error loading contact queries:', err); return []; }),
          getContacts().catch(err => { console.error('Error loading contacts:', err); return []; }),
          getSliderItems().catch(err => { console.error('Error loading slider items:', err); return []; })
        ]);

        console.log('📊 SharePoint Data Loaded:', { spPages, spNav, spNews, spDocs, spSettings, spTranslations, spContainerItems, spContactQueries });

        // --- Process Global Settings ---
        let loadedTheme = DEFAULT_THEME;
        let loadedSiteConfig = get().siteConfig;
        let loadedUiLabels = INITIAL_UI_LABELS;

        if (spSettings.length > 0) {
          const themeItem = spSettings.find((i: any) => i.Title === 'THEME_CONFIG');
          if (themeItem && themeItem.ConfigData) {
            try {
              const parsedTheme = JSON.parse(themeItem.ConfigData);
              loadedTheme = { ...DEFAULT_THEME, ...parsedTheme };
            } catch (e) {
              console.error('Error parsing theme config:', e);
            }
          }

          const siteItem = spSettings.find((i: any) => i.Title === 'SITE_CONFIG');
          if (siteItem && siteItem.ConfigData) {
            try {
              const parsedSite = JSON.parse(siteItem.ConfigData);
              // Merge with existing structure to ensure no missing keys
              loadedSiteConfig = { ...loadedSiteConfig, ...parsedSite };
            } catch (e) {
              console.error('Error parsing site config:', e);
            }
          }

          const labelsItem = spSettings.find((i: any) => i.Title === 'UI_LABELS');
          if (labelsItem && labelsItem.ConfigData) {
            try {
              const parsedLabels = JSON.parse(labelsItem.ConfigData);
              loadedUiLabels = { ...loadedUiLabels, ...parsedLabels };
            } catch (e) {
              console.error('Error parsing UI labels:', e);
            }
          }

          const appItem = spSettings.find((i: any) => i.Title === 'APP_STATE');
          if (appItem && appItem.ConfigData) {
            try {
              const parsedApp = JSON.parse(appItem.ConfigData);
              if (parsedApp.currentPageId) set({ currentPageId: parsedApp.currentPageId });
              if (parsedApp.currentLanguage) set({ currentLanguage: parsedApp.currentLanguage });
              if (parsedApp.editingContainerId) set({ editingContainerId: parsedApp.editingContainerId });
            } catch (e) {
              console.error('Error parsing APP state:', e);
            }
          }

          const sourcesItem = spSettings.find((i: any) => i.Title === 'TRANSLATION_SOURCES');
          if (sourcesItem && sourcesItem.ConfigData) {
            try {
              const parsedSources = JSON.parse(sourcesItem.ConfigData);
              if (Array.isArray(parsedSources)) set({ translationSources: parsedSources });
            } catch (e) {
              console.error('Error parsing TRANSLATION_SOURCES:', e);
            }
          }
        }

        // --- Process Translations from List ---
        if (spTranslations && spTranslations.length > 0) {
          spTranslations.forEach((t: any) => {
            if (t.Title) {
              loadedUiLabels[t.Title] = {
                en: t.EN || loadedUiLabels[t.Title]?.en || '',
                de: t.DE || loadedUiLabels[t.Title]?.de || '',
                fr: t.FR || loadedUiLabels[t.Title]?.fr || '',
                es: t.ES || loadedUiLabels[t.Title]?.es || ''
              };
            }
          });
        }

        // Transform for the Dictionary View state
        const loadedTranslationItems: TranslationItem[] = spTranslations && spTranslations.length > 0
          ? spTranslations.map((t: any) => ({
            id: t.Title,
            sourceList: t.SourceList || 'General',
            original: t.Title,
            translations: {
              en: t.EN || '',
              de: t.DE || '',
              fr: t.FR || '',
              es: t.ES || ''
            },
            lastUpdated: new Date().toISOString()
          }))
          : Object.keys(loadedUiLabels).map(key => ({
            id: key,
            sourceList: 'TranslationDictionary',
            original: key,
            translations: loadedUiLabels[key],
            lastUpdated: new Date().toISOString()
          }));

        // Transform SharePoint data to store format
        const transformedPages: Page[] = await Promise.all(
          spPages.map(async (spPage: any) => {
            // Load containers for this page
            const spContainers = await getContainersByPageId(spPage.Id).catch(() => []);

            return {
              id: String(spPage.Id),
              title: spPage.MultilingualTitle ? JSON.parse(spPage.MultilingualTitle) : { en: spPage.Title },
              slug: spPage.Slug || '/',
              status: spPage.PageStatus || 'Draft',
              createdBy: spPage.Author?.Title || 'System',
              modifiedBy: spPage.Editor?.Title || 'System',
              modifiedDate: spPage.Modified || new Date().toISOString(),
              description: unescapeHtml(spPage.Description || ''),
              isHomePage: spPage.IsHomePage || false,
              seo: spPage.SEOConfig ? JSON.parse(spPage.SEOConfig) : undefined,
              containers: spContainers.map((c: any) => {
                const parsedSettings = c.Settings ? JSON.parse(c.Settings) : {};
                // Merge dedicated button columns into settings (SP columns are source of truth)
                if (c.BtnEnabled !== undefined && c.BtnEnabled !== null) parsedSettings.btnEnabled = c.BtnEnabled;
                if (c.BtnName) parsedSettings.btnName = c.BtnName;
                if (c.BtnUrl) parsedSettings.btnUrl = c.BtnUrl;

                return {
                  id: String(c.Id),
                  pageId: c.Page?.Id ? String(c.Page.Id) : '',
                  type: c.ContainerType,
                  order: c.SortOrder || 0,
                  isVisible: c.IsVisible !== false,
                  settings: parsedSettings,
                  content: c.ContainerContent ? ((): any => {
                    const parsed = JSON.parse(c.ContainerContent);
                    // Unescape description in translations if present
                    if (parsed.translations) {
                      Object.keys(parsed.translations).forEach(lang => {
                        if (parsed.translations[lang].description) {
                          parsed.translations[lang].description = unescapeHtml(parsed.translations[lang].description);
                        }
                      });
                    }
                    return parsed;
                  })() : {},
                  title: c.Title || ''
                };
              })
            };
          })
        );

        const transformedNav: NavItem[] = spNav.map((item: any) => ({
          id: String(item.Id),
          parentId: item.Parent?.Id ? String(item.Parent.Id) : 'root',
          title: item.Title,
          type: item.NavType || 'Page',
          pageId: item.SmartPage?.Id ? String(item.SmartPage.Id) : undefined,
          url: item.ExternalURL,
          isVisible: item.IsVisible !== false,
          openInNewTab: item.OpenInNewTab || false,
          order: item.SortOrder || 0,
          translations: item.Translations ? JSON.parse(item.Translations) : {},
          modified: item.Modified
        }));

        const transformedNews: NewsItem[] = spNews.map((item: any) => ({
          id: String(item.Id),
          title: item.Title,
          status: item.Status || 'Draft',
          publishDate: item.PublishDate || new Date().toISOString(),
          description: unescapeHtml(item.Description || ''),
          imageUrl: item.ImageUrl?.Url || '',
          imageName: item.ImageName || '',
          readMore: {
            enabled: item.ReadMoreEnabled || false,
            text: item.ReadMoreText || '',
            url: item.ReadMoreURL || ''
          },
          seo: item.SEOConfig ? JSON.parse(item.SEOConfig) : { title: '', description: '', keywords: '' },
          translations: item.Translations ? ((): any => {
            const parsed = JSON.parse(item.Translations);
            Object.keys(parsed).forEach(lang => {
              if (parsed[lang].description) {
                parsed[lang].description = unescapeHtml(parsed[lang].description);
              }
            });
            return parsed;
          })() : {},
          createdBy: item.Author?.Title || 'System',
          modifiedBy: item.Editor?.Title || 'System',
          createdDate: item.Created,
          modifiedDate: item.Modified || item.Created
        }));

        const transformedEvents: EventItem[] = spEvents.map((item: any) => ({
          id: String(item.Id),
          title: item.Title,
          status: item.Status || 'Draft',
          startDate: item.StartDate || new Date().toISOString(),
          endDate: item.EndDate || '',
          location: item.Location || '',
          description: unescapeHtml(item.Description || ''),
          category: item.Category || 'General',
          imageUrl: item.ImageUrl?.Url || '',
          imageName: item.ImageName || '',
          readMore: {
            enabled: item.ReadMoreEnabled || false,
            text: item.ReadMoreText || '',
            url: item.ReadMoreURL || ''
          },
          seo: item.SEOConfig ? JSON.parse(item.SEOConfig) : { title: '', description: '', keywords: '' },
          translations: item.Translations ? ((): any => {
            const parsed = JSON.parse(item.Translations);
            Object.keys(parsed).forEach(lang => {
              if (parsed[lang].description) {
                parsed[lang].description = unescapeHtml(parsed[lang].description);
              }
            });
            return parsed;
          })() : {},
          createdBy: item.Author?.Title || 'System',
          modifiedBy: item.Editor?.Title || 'System',
          createdDate: item.Created,
          modifiedDate: item.Modified || item.Created
        }));

        const transformedDocs: DocumentItem[] = spDocs.map((item: any) => ({
          id: String(item.Id),
          title: item.Title,
          name: item.Name, // File name (FileLeafRef)
          status: item.DocStatus || 'Draft',
          date: item.Modified || new Date().toISOString(),
          type: item.DocType || 'PDF',
          year: item.DocumentYear || new Date().getFullYear().toString(),
          description: unescapeHtml(item.DocumentDescriptions || ''),
          itemRank: item.ItemRank || 5,
          sortOrder: item.SortOrder || 0,
          url: item.FileRef,
          imageUrl: item.ImageUrl || '',
          imageName: item.ImageName || '',
          translations: item.Translations ? ((): any => {
            const parsed = JSON.parse(item.Translations);
            Object.keys(parsed).forEach(lang => {
              if (parsed[lang].description) {
                parsed[lang].description = unescapeHtml(parsed[lang].description);
              }
            });
            return parsed;
          })() : {},
          createdBy: item.AuthorName || 'System',
          modifiedBy: item.EditorName || 'System',
          createdDate: item.Created,
          modifiedDate: item.Modified || item.Created
        }));

        // --- IMAGES ---
        // Fetch Folders first, then Images
        let transformedImages: ImageItem[] = [];
        let imageFolders: ImageFolder[] = [];
        try {
          const folders = await getFolders();
          const images = await getImages(folders);

          // Transform folders to ImageFolder type
          imageFolders = [
            { id: 'all', name: 'All Images', count: images.length },
            ...folders.map(f => ({
              id: f.id,
              name: f.name,
              count: images.filter(i => String(i.AssetCategory).toLowerCase() === String(f.id).toLowerCase()).length
            }))
          ];

          transformedImages = images.map((img: any) => ({
            id: String(img.Id),
            name: img.FileName,
            url: img.ImageUrl,
            folderId: img.AssetCategory || 'all',
            title: img.Title || img.FileName,
            description: img.Description || '',
            copyright: img.CopyrightInfo || '',
            createdDate: img.Created,
            createdBy: img.AuthorName || 'Unknown'
          }));

        } catch (e) { console.error('Error loading images/folders', e); }

        const transformedContainerItems: ContainerItem[] = spContainerItems.map((item: any) => ({
          id: String(item.Id),
          title: item.Title,
          status: item.Status || 'Draft',
          sortOrder: item.SortOrder || 0,
          description: unescapeHtml(item.Description || ''),
          imageUrl: item.ImageUrl?.Url || '',
          imageName: item.ImageName || '',
          translations: item.Translations ? ((): any => {
            const parsed = JSON.parse(item.Translations);
            Object.keys(parsed).forEach(lang => {
              if (parsed[lang].description) {
                parsed[lang].description = unescapeHtml(parsed[lang].description);
              }
            });
            return parsed;
          })() : {},
          createdBy: item.Author?.Title || 'System',
          modifiedBy: item.Editor?.Title || 'System',
          createdDate: item.Created,
          modifiedDate: item.Modified || item.Created
        }));

        // --- CONTACTS ---
        const transformedContacts: ContactItem[] = spContacts.map((item: any) => ({
          id: String(item.Id),
          fullName: item.Title || '',
          firstName: item.FirstName || '',
          lastName: item.LastName || '',
          status: item.Status || 'Draft',
          sortOrder: item.SortOrder || 0,
          jobTitle: item.JobTitle || '',
          company: item.Company || '',
          email: item.Email || '',
          phone: item.Phone || '',
          description: unescapeHtml(item.Description || ''),
          imageUrl: item.ImageUrl?.Url || '',
          imageName: item.ImageName || '',
          translations: item.Translations ? ((): any => {
            const parsed = JSON.parse(item.Translations);
            Object.keys(parsed).forEach(lang => {
              if (parsed[lang].description) {
                parsed[lang].description = unescapeHtml(parsed[lang].description);
              }
            });
            return parsed;
          })() : {},
          createdBy: item.Author?.Title || 'System',
          modifiedBy: item.Editor?.Title || 'System',
          createdDate: item.Created,
          modifiedDate: item.Modified || item.Created
        }));

        // --- CONTACT QUERIES ---
        const transformedContactQueries: ContactQuery[] = spContactQueries.map((item: any) => {
          let formData: any = {};
          try {
            formData = item.FormData ? JSON.parse(item.FormData) : {};
          } catch (e) {
            console.error('Error parsing FormData for contact query:', e);
          }

          return {
            id: String(item.Id),
            pageId: item.SourcePage?.Id ? String(item.SourcePage.Id) : formData.pageId || '',
            pageName: item.SourcePage?.Title || formData.pageName || 'Unknown Page',
            containerId: formData.containerId || '',
            created: item.Created || formData.created || new Date().toISOString(),
            status: item.QueryStatus || 'New',
            email: formData.email || item.Title || 'Anonymous',
            firstName: formData.firstName,
            lastName: formData.lastName,
            smartPage: formData.pageName,
            fields: formData.fields || []
          };
        });

        // --- SLIDER ITEMS ---
        const transformedSliderItems = spSliderItems.map((item: any) => ({
          id: String(item.Id),
          title: item.Title || '',
          subtitle: item.Subtitle || '',
          description: item.Description || '',
          status: item.Status || 'Draft',
          sortOrder: item.SortOrder || 0,
          ctaText: item.CtaText || '',
          ctaUrl: item.CtaUrl || '',
          imageUrl: item.ImageUrl?.Url || '',
          imageName: item.ImageName || '',
          translations: item.Translations ? JSON.parse(item.Translations) : {},
          createdDate: item.Created,
          modifiedDate: item.Modified || item.Created,
          createdBy: item.Author?.Title || 'System',
          modifiedBy: item.Editor?.Title || item.Author?.Title || 'System'
        }));

        // Update store with SharePoint data (fallback to mock if empty)
        // Update store with SharePoint data (No Mock Fallbacks)
        // --- Navigation Logic to Set Default Page ---
        // 1. Find "HOME" in Navigation (Case Insensitive)
        let defaultPageId = '';
        const homeNavItem = transformedNav.find(n => n.title.toUpperCase() === 'HOME' && n.pageId);

        if (homeNavItem && homeNavItem.pageId) {
          defaultPageId = homeNavItem.pageId;
        } else {
          // 2. Fallback: Run "any" navigation.
          // We prioritize ROOT items to match the user's likely expectation (Top/First Sidebar Item)
          const rootItems = transformedNav.filter(n => n.parentId === 'root').sort((a, b) => a.order - b.order);
          const firstRootPage = rootItems.find(n => n.type === 'Page' && n.pageId);

          if (firstRootPage && firstRootPage.pageId) {
            defaultPageId = firstRootPage.pageId;
          } else {
            // If no root pages, try ANY page in navigation (sorted by order)
            const sortedNav = [...transformedNav].sort((a, b) => a.order - b.order);
            const firstPageNav = sortedNav.find(n => n.type === 'Page' && n.pageId);

            if (firstPageNav && firstPageNav.pageId) {
              defaultPageId = firstPageNav.pageId;
            } else if (transformedPages.length > 0) {
              // Fallback: First generic page (no nav item)
              defaultPageId = transformedPages[0].id;
            }
          }
        }

        // Verify the page actually exists in our loaded pages
        const defaultPageExists = transformedPages.find(p => p.id === defaultPageId);
        if (!defaultPageExists && transformedPages.length > 0) {
          defaultPageId = transformedPages[0].id;
        }

        // If no hash is set (root), or if we want to enforce the default logic
        // construct the correct slug for the determined default page
        if (defaultPageExists) {
          const targetSlug = defaultPageExists.slug;
          // Only redirect if at root or if necessary. 
          // If the user already has a hash, App.tsx will likely handle it. 
          // However, if the current hash is invalid or just empty, we set this.
          if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
            window.location.hash = targetSlug;
          }
        }

        set({
          pages: transformedPages,
          news: transformedNews,
          events: transformedEvents,
          documents: transformedDocs,
          containerItems: transformedContainerItems,
          contacts: transformedContacts,
          sliderItems: transformedSliderItems,
          contactQueries: transformedContactQueries,
          images: transformedImages,
          imageFolders: imageFolders,
          siteConfig: {
            ...loadedSiteConfig,
            navigation: transformedNav
          },
          themeConfig: loadedTheme,
          uiLabels: loadedUiLabels,
          translationItems: loadedTranslationItems,
          currentPageId: defaultPageId || '1', // Ensure valid ID
          isLoading: false
        });

        console.log('✅ SharePoint data loaded successfully');

        // Validate and clean up invalid taggedItems references
        await get().validateContainerTaggedItems();
      } catch (error) {
        console.error('❌ Error loading SharePoint data:', error);
        set({ isLoading: false });
      }
    },

    // Helper function to remove a deleted item from all containers' taggedItems
    removeItemFromContainers: async (itemId: string) => {
      try {
        const state = get();
        let hasChanges = false;

        const updatedPages = state.pages.map(page => {
          const updatedContainers = page.containers.map(container => {
            const taggedItems = container.settings?.taggedItems;
            if (taggedItems && Array.isArray(taggedItems) && taggedItems.includes(itemId)) {
              hasChanges = true;
              const newTaggedItems = taggedItems.filter((id: string) => id !== itemId);
              console.log(`🧹 Removing item ${itemId} from container ${container.id} in page ${page.id}`);
              return {
                ...container,
                settings: {
                  ...container.settings,
                  taggedItems: newTaggedItems
                }
              };
            }
            return container;
          });

          if (updatedContainers.some((c, i) => c !== page.containers[i])) {
            return { ...page, containers: updatedContainers };
          }
          return page;
        });

        if (hasChanges) {
          set({ pages: updatedPages });

          // Update SharePoint for each modified container
          const { updateContainer: updateContainerSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          for (const page of updatedPages) {
            for (const container of page.containers) {
              const originalContainer = state.pages
                .find(p => p.id === page.id)
                ?.containers.find(c => c.id === container.id);

              if (originalContainer && originalContainer.settings?.taggedItems !== container.settings?.taggedItems) {
                const spData = {
                  PageId: Number(page.id),
                  ContainerType: container.type,
                  SortOrder: container.order,
                  Settings: JSON.stringify(container.settings || {}),
                  ContainerContent: JSON.stringify(container.content || {}),
                  IsVisible: container.isVisible,
                  Title: container.title || container.settings?.containerTitle || container.settings?.title || container.type,
                  BtnEnabled: container.settings?.btnEnabled || false,
                  BtnName: container.settings?.btnName || '',
                  BtnUrl: container.settings?.btnUrl || ''
                };
                await updateContainerSP(Number(container.id), spData);
                console.log(`✅ Updated container ${container.id} in SharePoint`);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error removing item from containers:', error);
      }
    },

    // Helper function to validate and clean up invalid taggedItems on load
    validateContainerTaggedItems: async () => {
      try {
        const state = get();
        const allItemIds = new Set([
          ...state.news.map(n => n.id),
          ...state.events.map(e => e.id),
          ...state.documents.map(d => d.id),
          ...state.containerItems.map(c => c.id),
          ...state.contacts.map(c => c.id),
          ...state.sliderItems.map(s => s.id),
          ...state.pages.map(p => p.id)
        ]);

        let hasChanges = false;

        const updatedPages = state.pages.map(page => {
          const updatedContainers = page.containers.map(container => {
            const taggedItems = container.settings?.taggedItems;
            if (taggedItems && Array.isArray(taggedItems)) {
              const validTaggedItems = taggedItems.filter((id: string) => allItemIds.has(id));

              if (validTaggedItems.length !== taggedItems.length) {
                hasChanges = true;
                const removedIds = taggedItems.filter((id: string) => !allItemIds.has(id));
                console.log(`🧹 Cleaning invalid IDs from container ${container.id}: ${removedIds.join(', ')}`);

                return {
                  ...container,
                  settings: {
                    ...container.settings,
                    taggedItems: validTaggedItems
                  }
                };
              }
            }
            return container;
          });

          if (updatedContainers.some((c, i) => c !== page.containers[i])) {
            return { ...page, containers: updatedContainers };
          }
          return page;
        });

        if (hasChanges) {
          set({ pages: updatedPages });

          // Update SharePoint for each modified container
          const { updateContainer: updateContainerSP } = await import(/* webpackChunkName: 'sp-service' */ './services/SPService');
          for (const page of updatedPages) {
            for (const container of page.containers) {
              const originalContainer = state.pages
                .find(p => p.id === page.id)
                ?.containers.find(c => c.id === container.id);

              if (originalContainer && originalContainer.settings?.taggedItems !== container.settings?.taggedItems) {
                const spData = {
                  PageId: Number(page.id),
                  ContainerType: container.type,
                  SortOrder: container.order,
                  Settings: JSON.stringify(container.settings || {}),
                  ContainerContent: JSON.stringify(container.content || {}),
                  IsVisible: container.isVisible,
                  Title: container.title || container.settings?.containerTitle || container.settings?.title || container.type,
                  BtnEnabled: container.settings?.btnEnabled || false,
                  BtnName: container.settings?.btnName || '',
                  BtnUrl: container.settings?.btnUrl || ''
                };
                await updateContainerSP(Number(container.id), spData);
                console.log(`✅ Validated and updated container ${container.id} in SharePoint`);
              }
            }
          }

          console.log('✅ Container taggedItems validation completed');
        }
      } catch (error) {
        console.error('Error validating container taggedItems:', error);
      }
    },
  })
);

export const getTranslation = (key: string, lang: LanguageCode): string => {
  const uiLabels = useStore.getState().uiLabels;
  const item = uiLabels[key] || INITIAL_UI_LABELS[key];
  if (!item) return key;
  return item[lang] || item.en || key;
};

export const getLocalizedText = (text: MultilingualText | string, lang: LanguageCode): string => {
  if (typeof text === 'string') return text;
  if (!text) return '';
  return text[lang] || text.en || '';
};

export const getItemTranslation = (item: any, lang: LanguageCode, field: string): string => {
  if (!item) return '';

  // Check specific language
  if (item.translations && item.translations[lang]) {
    if (typeof item.translations[lang] === 'string' && field === 'title') {
      return item.translations[lang];
    }
    if (item.translations[lang][field]) {
      return item.translations[lang][field];
    }
  }

  // Fallback to English translation
  if (item.translations && item.translations['en']) {
    if (typeof item.translations['en'] === 'string' && field === 'title') {
      return item.translations['en'];
    }
    if (item.translations['en'][field]) {
      return item.translations['en'][field];
    }
  }

  return item[field] || '';
};

export const getGlobalTranslation = (id: string, translationItems: any[], lang: LanguageCode, fallback: string): string => {
  const item = translationItems?.find(t => t.id === id);
  if (!item) return fallback;
  return item.translations[lang] || item.translations.en || fallback;
};
