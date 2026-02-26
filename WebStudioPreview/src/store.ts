

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ModalType, ViewMode, ContainerType } from './types';
import type { Page, SiteConfig, ThemeConfig, LanguageCode, MultilingualText, NavItem, NewsItem, EventItem, DocumentItem, ContainerItem, ContactItem, SliderItem, Container, ImageItem, ImageFolder, TranslationItem, PermissionGroup, PermissionUser, ContactQuery } from './types';
import { API_BASE } from './services/apiTest';


// Static UI Translations (Initial State)
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
  FOOTER_MGMT: { en: 'Footer Management', de: 'Fußzeilenverwaltung', fr: 'Gestion de pied de page', es: 'Gestión de pie de page' },
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
  LABEL_OPEN_OOTB_FORM: { en: 'Open out-of-the-box form', de: 'Standard-Formular öffnen', fr: 'Ouvrir le formulaire standard', es: 'Ouvrir le formulaire standard' },
  TAB_URL: { en: 'URL', de: 'URL', fr: 'URL', es: 'URL' },
  BTN_DEFAULT_LOGO: { en: 'Default Logo', de: 'Standardlogo', fr: 'Logo par défaut', es: 'Logo predeterminiert' },

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

export const DEFAULT_THEME: ThemeConfig = {
  // // Brand Colors (Corporate Blue #2f5596)
  // '--primary-color': '#2f5596',
  // '--secondary-color': '#1f3f73',
  // '--brand-light': '#e6ecf7',
  // '--brand-dark': '#1c355f',
  // '--gradient-primary': 'linear-gradient(135deg, #2f5596 0%, #1f3f73 100%)',

  // // Sidebar Specific
  // '--sidebar-bg': '#ffffff',
  // '--sidebar-text': '#1f2937',
  // '--sidebar-text-muted': '#6b7280',
  // '--sidebar-border-color': '#e5e7eb',

  // '--sidebar-icon-color': '#2f5596',
  // '--sidebar-link-color': '#2f5596',
  // '--sidebar-link-hover-color': '#1f3f73',
  // '--sidebar-active-text-color': '#2f5596',
  // '--sidebar-active-indicator-color': '#2f5596',
  // '--sidebar-button-color': '#2f5596',
  // '--sidebar-active-bg': '#eff6ff',
  // '--sidebar-hover-bg': '#f9fafb',

  // // Text & Links
  // '--text-primary': '#1f2937',
  // '--text-secondary': '#4b5563',
  // '--text-on-primary': '#ffffff',
  // '--link-color': '#2f5596',
  // '--link-hover-color': '#1f3f73',

  // // Backgrounds
  // '--bg-body': '#f8fafc',
  // '--bg-surface': '#ffffff',
  // '--bg-hover': '#eef2ff',

  // // Buttons
  // '--btn-primary-bg': '#2f5596',
  // '--btn-primary-text': '#ffffff',
  // '--btn-primary-hover-bg': '#1f3f73',
  // '--btn-secondary-bg': '#ffffff',
  // '--btn-secondary-text': '#1f2937',
  // '--btn-padding-y': '0.5rem',
  // '--btn-padding-x': '1.25rem',
  // '--btn-font-size': '14px',

  // // Status
  // '--status-success': '#16a34a',
  // '--status-warning': '#f59e0b',
  // '--status-error': '#dc2626',

  // // Borders
  // '--border-radius-sm': '0px',
  // '--border-radius-md': '0px',
  // '--border-radius-lg': '0px',
  // '--border-color': '#d1d5db',

  // // Typography
  // '--font-import-url': '',
  // '--font-family-base': '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  // '--font-family-secondary': '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',

  // '--heading-color': '#1f2937',
  // '--heading-h1-color': 'var(--heading-color)',
  // '--heading-h2-color': 'var(--heading-color)',
  // '--heading-h3-color': 'var(--heading-color)',
  // '--heading-h4-color': 'var(--heading-color)',
  // '--heading-h5-color': 'var(--heading-color)',
  // '--heading-h6-color': 'var(--heading-color)',

  // '--font-size-base': '14px',
  // '--font-size-h1': '42px',
  // '--font-size-h2': '32px',
  // '--font-size-h3': '24px',
  // '--font-size-h4': '20px',
  // '--font-size-h5': '16px',
  // '--font-size-h6': '14px',
  // '--font-weight-bold': '600',

  // // Icon Styling
  // '--icon-color': '#2f5596',
  // '--edit-icon-bg': '#2563eb',
  // '--edit-icon-color': '#ffffff',
  // '--edit-icon-hover-bg': '#1d4ed8',
};

export const GLOBAL_DEFAULT_IMAGE = '';

const unescapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
};

// Helper: Generate Default Containers - PAGE-WISE ISOLATION
const createDefaultContainers = (pageId: string): Container[] => {
  // --- PAGE 1: HOME ---
  if (pageId === '1') {
    return [
      {
        id: `c_home_slider`,
        pageId: pageId,
        type: ContainerType.SLIDER,
        order: 0,
        isVisible: true,
        settings: { templateId: 'img_text', speed: 5, autoplay: true },
        content: { title: { en: 'Welcome to Web Studio', de: 'Willkommen', fr: 'Bienvenue', es: 'Bienvenido' } }
      },
      {
        id: `c_home_news_grid`,
        pageId: pageId,
        type: ContainerType.CARD_GRID,
        order: 1,
        isVisible: true,
        settings: {
          source: 'News',
          columns: 3,
          ordering: '123',
          layout: 'grid',
          imgPos: 'top',
          border: 'sharp',
          title: 'Latest News',
          taggedItems: ['1', 'mock_1', 'mock_2']
        },
        content: { title: { en: 'Latest News', de: 'Aktuelle Nachrichten', fr: 'Dernières nouvelles', es: 'Últimas noticias' } }
      },
      {
        id: `c_home_events`,
        pageId: pageId,
        type: ContainerType.CARD_GRID,
        order: 2,
        isVisible: true,
        settings: {
          source: 'Event',
          columns: 3,
          ordering: 'none',
          layout: 'slider',
          imgPos: 'left',
          border: 'rounded',
          title: 'Upcoming Events',
          taggedItems: ['e1', 'mock_e1', 'mock_e2']
        },
        content: { title: { en: 'Upcoming Events', de: 'Kommende Veranstaltungen', fr: 'Événements à venir', es: 'Próximos eventos' } }
      }
    ];
  }

  // --- PAGE 2: WHAT WE OFFER ---
  if (pageId === '2') {
    return [
      {
        id: `c_offer_hero`,
        pageId: pageId,
        type: ContainerType.HERO,
        order: 0,
        isVisible: true,
        settings: {
          templateId: 'hero_img',
          templateVariant: 1,
          bgType: 'image',
          bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=80',
          bgColor: '#1c355f',
          titleColor: 'white',
          align: 'center',
          heading: 'Our Services',
          containerTitle: 'What We Offer'
        },
        content: {
          title: { en: 'World Class Solutions', de: 'Weltklasse-Lösungen', fr: 'Solutions de classe mondiale', es: 'Soluciones de clase mundial' },
          subtitle: { en: 'Tailored for your business needs', de: 'Maßgeschneidert für Ihre Bedürfnisse', fr: 'Adapté à vos besoins', es: 'Adaptado a sus necesidades' },
          description: { en: 'We provide a wide range of digital services including consulting, development, and support.', de: 'Wir bieten eine breite Palette digitaler Dienste an.', fr: 'Nous proposons une large gamme de services numériques.', es: 'Ofrecemos una amplia gama de servicios digitales.' }
        }
      },
      {
        id: `c_offer_docs`,
        pageId: pageId,
        type: ContainerType.CARD_GRID,
        order: 1,
        isVisible: true,
        settings: {
          source: 'Document',
          columns: 3,
          ordering: 'ABC',
          layout: 'grid',
          imgPos: 'none',
          border: 'sharp',
          title: 'Service Catalog',
          taggedItems: ['d1', 'm1', 'm8']
        },
        content: { title: { en: 'Service Catalog', de: 'Servicekatalog', fr: 'Catalogue de services', es: 'Catálogo de servicios' } }
      },
      {
        id: `c_offer_slider`,
        pageId: pageId,
        type: ContainerType.SLIDER,
        order: 2,
        isVisible: true,
        settings: {
          templateId: 'img_gallery',
          templateVariant: 1,
          speed: 4,
          autoplay: true,
          slides: [
            { id: 's_prod1', title: 'Product A', desc: 'High performance module', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80' },
            { id: 's_prod2', title: 'Product B', desc: 'Enterprise integration', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80' }
          ]
        },
        content: { title: { en: 'Product Gallery', de: 'Produktgalerie', fr: 'Galerie de produits', es: 'Galería de productos' } }
      }
    ];
  }

  // --- PAGE 3: HOW WE WORK ---
  if (pageId === '3') {
    return [
      {
        id: `c_work_hero`,
        pageId: pageId,
        type: ContainerType.HERO,
        order: 0,
        isVisible: true,
        settings: {
          templateId: 'visual_text',
          templateVariant: 2,
          bgType: 'layout',
          layoutVariant: 'img_right',
          bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',
          bgColor: '#f8fafc',
          titleColor: 'black',
          align: 'left',
          heading: 'Our Process',
          containerTitle: 'Methodology'
        },
        content: {
          title: { en: 'Agile & Efficient', de: 'Agil & Effizient', fr: 'Agile et Efficace', es: 'Ágil y Eficiente' },
          description: { en: 'We follow a strict agile methodology to ensure rapid delivery and continuous improvement.', de: 'Wir folgen einer strengen agilen Methodik.', fr: 'Nous suivons une méthodologie agile stricte.', es: 'Seguimos una metodología ágil estricta.' }
        }
      },
      {
        id: `c_work_table`,
        pageId: pageId,
        type: ContainerType.TABLE,
        order: 1,
        isVisible: true,
        settings: {
          title: 'Project Phases',
          columns: [
            { id: 'c1', header: 'Phase' },
            { id: 'c2', header: 'Duration' },
            { id: 'c3', header: 'Deliverables' }
          ],
          enableGlobalSearch: false,
          enableSorting: true
        },
        content: {
          title: { en: 'Project Phases', de: 'Projektphasen', fr: 'Phases du projet', es: 'Fases del proyecto' },
          rows: [
            { id: 'r1', c1: 'Discovery', c2: '2 Weeks', c3: 'Requirements Doc' },
            { id: 'r2', c1: 'Design', c2: '4 Weeks', c3: 'Figma Prototypes' },
            { id: 'r3', c1: 'Development', c2: '8 Weeks', c3: 'Production Code' }
          ]
        }
      },
      {
        id: `c_work_map`,
        pageId: pageId,
        type: ContainerType.MAP,
        order: 2,
        isVisible: true,
        settings: {
          title: 'Global Presence',
          mapType: 'World',
          locationSearch: 'Berlin, Germany'
        },
        content: { title: { en: 'Our Locations', de: 'Unsere Standorte', fr: 'Nos emplacements', es: 'Nuestras ubicaciones' } }
      }
    ];
  }

  // --- PAGE 4: WHO WE ARE (Matches previous specific requirement) ---
  if (pageId === '4') {
    return [
      {
        id: `c_who_hero`,
        pageId: pageId,
        type: ContainerType.HERO,
        order: 0,
        isVisible: true,
        settings: {
          templateId: 'visual_text',
          templateVariant: 1,
          minHeight: 'full',
          bgType: 'image',
          bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
          bgColor: '#ffffff',
          titleColor: 'white',
          align: 'center',
          heading: 'WHO WE ARE',
          containerTitle: 'About Us'
        },
        content: {
          title: { en: 'WHO WE ARE', de: 'WER WIR SIND', fr: 'QUI NOUS SOMMES', es: 'QUIÉNES SOMOS' },
          subtitle: { en: 'Driving Innovation & Excellence', de: 'Innovation und Exzellenz vorantreiben', fr: 'Stimuler l\'innovation et l\'excellence', es: 'Impulsando la innovación y la excelencia' },
          description: { en: 'We are a dedicated team of professionals committed to delivering high-quality solutions that empower businesses to thrive in the digital age.', de: 'Wir sind ein engagiertes Team von Fachleuten.', fr: 'Nous sommes une équipe dévouée.', es: 'Somos un equipo dedicado.' }
        }
      },
      {
        id: `c_who_events`,
        pageId: pageId,
        type: ContainerType.CARD_GRID,
        order: 1,
        isVisible: true,
        settings: {
          source: 'Event',
          columns: 3,
          ordering: 'none',
          layout: 'grid',
          imgPos: 'top',
          border: 'sharp',
          title: 'Upcoming Events',
          taggedItems: ['e1', 'mock_e1', 'mock_e2']
        },
        content: {
          title: { en: 'Upcoming Events', de: 'Kommende Veranstaltungen', fr: 'Événements à venir', es: 'Próximos Eventos' }
        }
      },
      {
        id: `c_who_gallery`,
        pageId: pageId,
        type: ContainerType.SLIDER,
        order: 2,
        isVisible: true,
        settings: {
          templateId: 'img_gallery',
          templateVariant: 1,
          speed: 5,
          autoplay: true,
          arrows: true,
          dots: true,
          slides: [
            {
              id: 's1',
              title: 'Our Office',
              sub: 'Berlin Headquarters',
              desc: 'A glimpse into our daily work environment.',
              image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 's2',
              title: 'Team Spirit',
              sub: 'Collaborative Culture',
              desc: 'We believe in the power of teamwork.',
              image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80'
            },
            {
              id: 's3',
              title: 'Global Impact',
              sub: 'Connecting the World',
              desc: 'Our solutions reach clients globally.',
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80'
            }
          ]
        },
        content: {
          title: { en: 'Our Gallery', de: 'Unsere Galerie', fr: 'Notre Galerie', es: 'Nuestra Galería' }
        }
      }
    ];
  }

  // --- PAGE 5: CAREERS ---
  if (pageId === '5') {
    return [
      {
        id: `c_career_hero`,
        pageId: pageId,
        type: ContainerType.HERO,
        order: 0,
        isVisible: true,
        settings: {
          templateId: 'hero_img',
          bgType: 'image',
          bgImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80',
          titleColor: 'white',
          align: 'center',
          heading: 'Join Our Team',
          containerTitle: 'Careers'
        },
        content: {
          title: { en: 'Build the Future With Us', de: 'Bauen Sie die Zukunft mit uns', fr: 'Construisez l\'avenir avec nous', es: 'Construye el futuro con nosotros' },
          description: { en: 'Explore exciting opportunities to grow your career.', de: 'Entdecken Sie spannende Möglichkeiten.', fr: 'Explorez des opportunités passionnantes.', es: 'Explora oportunidades emocionantes.' }
        }
      },
      {
        id: `c_career_jobs`,
        pageId: pageId,
        type: ContainerType.CARD_GRID,
        order: 1,
        isVisible: true,
        settings: {
          source: 'News', // Mocking Jobs via News items for now
          columns: 2,
          ordering: 'none',
          layout: 'grid',
          imgPos: 'left',
          border: 'sharp',
          title: 'Open Positions',
          taggedItems: ['mock_6', 'mock_10']
        },
        content: { title: { en: 'Open Positions', de: 'Offene Stellen', fr: 'Postes ouverts', es: 'Posiciones abiertas' } }
      },
      {
        id: `c_career_contact`,
        pageId: pageId,
        type: ContainerType.CONTACT_FORM,
        order: 2,
        isVisible: true,
        settings: {
          heading: 'Apply Now',
          subheading: 'Send us your resume',
          bgType: 'color',
          bgColor: '#f3f4f6',
          buttonText: 'Submit Application',
          fields: [
            { id: 'f1', label: 'Full Name', type: 'text', required: true },
            { id: 'f2', label: 'Email', type: 'email', required: true },
            { id: 'f3', label: 'LinkedIn Profile', type: 'text', required: false },
            { id: 'f4', label: 'Cover Letter', type: 'textarea', required: true }
          ]
        },
        content: { title: { en: 'Apply Now', de: 'Jetzt bewerben', fr: 'Postuler maintenant', es: 'Aplica ya' } }
      }
    ];
  }

  // --- PAGE 6: CONTACT ---
  if (pageId === '6') {
    return [
      {
        id: `c_contact_hero`,
        pageId: pageId,
        type: ContainerType.HERO,
        order: 0,
        isVisible: true,
        settings: {
          templateId: 'page_content',
          bgType: 'color',
          bgColor: '#1f2937',
          titleColor: 'white',
          align: 'center',
          heading: 'Contact Us',
          containerTitle: 'Get in Touch'
        },
        content: {
          title: { en: 'We are here to help', de: 'Wir sind hier um zu helfen', fr: 'Nous sommes là pour aider', es: 'Estamos aquí para ayudar' },
          description: { en: 'Reach out to us for any inquiries or support.', de: 'Kontaktieren Sie uns für Anfragen.', fr: 'Contactez-nous pour toute demande.', es: 'Contáctenos para cualquier consulta.' }
        }
      },
      {
        id: `c_contact_form`,
        pageId: pageId,
        type: ContainerType.CONTACT_FORM,
        order: 1,
        isVisible: true,
        settings: {
          heading: 'Send a Message',
          bgType: 'none',
          fields: [
            { id: 'c1', label: 'Name', type: 'text', required: true },
            { id: 'c2', label: 'Email', type: 'email', required: true },
            { id: 'c3', label: 'Subject', type: 'text', required: false },
            { id: 'c4', label: 'Message', type: 'textarea', required: true }
          ],
          buttonText: 'Send Message'
        },
        content: { title: { en: 'Contact Form', de: 'Kontaktformular', fr: 'Formulaire de contact', es: 'Formulario de contacto' } }
      },
      {
        id: `c_contact_map`,
        pageId: pageId,
        type: ContainerType.MAP,
        order: 2,
        isVisible: true,
        settings: {
          title: 'Visit Us',
          mapType: 'Country',
          selectedRegion: 'Germany',
          locationSearch: 'Munich'
        },
        content: { title: { en: 'Headquarters', de: 'Hauptquartier', fr: 'Siège social', es: 'Sede central' } }
      }
    ];
  }

  return [];
};

// const MOCK_NAV: NavItem[] = [
//   { id: '1', parentId: 'root', title: 'HOME', type: 'Page', pageId: '1', isVisible: true, openInNewTab: false, order: 0 },
//   { id: '2', parentId: 'root', title: 'WHAT WE OFFER', type: 'Page', pageId: '2', isVisible: true, openInNewTab: false, order: 1 },
//   { id: '3', parentId: 'root', title: 'HOW WE WORK', type: 'Page', pageId: '3', isVisible: true, openInNewTab: false, order: 2 },
//   { id: '3_1', parentId: '3', title: 'Our Process', type: 'Page', pageId: '1', isVisible: true, openInNewTab: false, order: 0 },
//   { id: '4', parentId: 'root', title: 'WHO WE ARE', type: 'Page', pageId: '4', isVisible: true, openInNewTab: false, order: 3 },
//   { id: '5', parentId: 'root', title: 'CAREERS', type: 'Page', pageId: '5', isVisible: true, openInNewTab: false, order: 4 },
//   { id: '6', parentId: 'root', title: 'CONTACT', type: 'Page', pageId: '6', isVisible: true, openInNewTab: false, order: 5 },
// ];

/*
const MOCK_PAGES: Page[] = [
  {
    id: '1',
    title: { en: 'Home', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
    slug: '/',
    status: 'Published',
    createdBy: 'Sameer Gupta',
    modifiedBy: 'Shivdutt Mishra',
    modifiedDate: '2026-02-03T12:45:00Z',
    description: 'Welcome to our corporate intranet home page. This is the central hub for all company news.',
    isHomePage: true,
    seo: { title: 'Home - Web Studio', description: 'Corporate Intranet Home', keywords: 'home, intranet, corporate, news' },
    containers: createDefaultContainers('1')
  },
  {
    id: '2',
    title: { en: 'What We Offer', de: 'Was wir bieten', fr: 'Ce que nous offrons', es: 'Lo que ofrecemos' },
    slug: '/what-we-offer',
    status: 'Published',
    createdBy: 'System',
    modifiedBy: 'Admin',
    modifiedDate: new Date().toISOString(),
    description: 'Overview of our services and products.',
    seo: { title: 'Services - Web Studio', description: 'Our offerings', keywords: 'services, products' },
    containers: createDefaultContainers('2')
  },
  {
    id: '3',
    title: { en: 'How We Work', de: 'Wie wir arbeiten', fr: 'Notre méthode', es: 'Cómo trabajamos' },
    slug: '/how-we-work',
    status: 'Published',
    createdBy: 'System',
    modifiedBy: 'Admin',
    modifiedDate: new Date().toISOString(),
    containers: createDefaultContainers('3')
  },
  { id: '4', title: { en: 'Who We Are', de: 'Wer wir sind', fr: 'Qui nous sommes', es: 'Quiénes somos' }, slug: '/who-we-are', status: 'Published', createdBy: 'System', modifiedBy: 'Admin', modifiedDate: new Date().toISOString(), containers: createDefaultContainers('4') },
  { id: '5', title: { en: 'Careers', de: 'Karriere', fr: 'Carrières', es: 'Carreras' }, slug: '/careers', status: 'Published', createdBy: 'System', modifiedBy: 'Admin', modifiedDate: new Date().toISOString(), containers: createDefaultContainers('5') },
  { id: '6', title: { en: 'Contact', de: 'Kontakt', fr: 'Contact', es: 'Contacto' }, slug: '/contact', status: 'Published', createdBy: 'System', modifiedBy: 'Admin', modifiedDate: new Date().toISOString(), containers: createDefaultContainers('6') }
];
*/

// --- CENTRALIZED MOCK DATA ---
/*
const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'New Office Opening in Berlin', status: 'Published', publishDate: '2025-01-10', description: 'We are thrilled to announce the opening of our new regional headquarters.', readMore: { enabled: true, text: 'Read more', url: '#' }, translations: { de: { title: 'Neues Büro', description: 'Wir freuen uns...' }, fr: { title: 'Nouveau bureau', description: 'Nous sommes ravis...' } } },
  { id: 'mock_1', title: 'Global Expansion Strategy 2025', status: 'Published', publishDate: '2025-03-10', description: 'Our comprehensive plan to enter new markets in Asia and South America is now officially underway.', imageUrl: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_2', title: 'Employee Wellness Week Highlights', status: 'Published', publishDate: '2025-02-28', description: 'A look back at the activities and workshops from our successful wellness week.', imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e3169?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_3', title: 'Q1 Financial Results Announcement', status: 'Draft', publishDate: '2025-04-15', description: 'Upcoming announcement regarding the first quarter financial performance.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', readMore: { enabled: false } },
  { id: 'mock_4', title: 'New IT Security Protocols', status: 'Published', publishDate: '2025-01-15', description: 'Important updates to our cybersecurity measures and employee guidelines.', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_5', title: 'Sustainability Report 2024', status: 'Published', publishDate: '2024-12-20', description: 'Download the full report on our environmental impact and future goals.', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_6', title: 'Welcome to Our New CTO', status: 'Published', publishDate: '2025-03-01', description: 'We are pleased to welcome Sarah Jenkins to the executive leadership team.', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_7', title: 'Office Renovation Updates', status: 'Draft', publishDate: '2025-05-01', description: 'Phase 2 of the headquarters renovation begins next month.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80', readMore: { enabled: false } },
  { id: 'mock_8', title: 'Annual Charity Gala', status: 'Published', publishDate: '2024-11-10', description: 'Join us for an evening of giving back to our community partners.', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_9', title: 'Product Launch: X-Series', status: 'Published', publishDate: '2025-02-15', description: 'Introducing our latest innovation in enterprise software solutions.', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_10', title: 'Remote Work Policy Update', status: 'Published', publishDate: '2025-01-05', description: 'Clarifications on the hybrid work model and equipment allowances.', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f7853670c6e?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } }
];

const MOCK_EVENTS: EventItem[] = [
  { id: 'e1', title: 'Annual Tech Conference 2025', status: 'Published', startDate: '2025-06-15', endDate: '2025-06-17', description: 'Join us for the biggest tech conference of the year.', readMore: { enabled: true, text: 'Register Now', url: '#' }, translations: {} },
  { id: 'mock_e1', title: 'Q3 Town Hall Meeting', status: 'Published', startDate: '2025-08-15', endDate: '2025-08-15', description: 'Join leadership for updates on company performance and future goals.', imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_e2', title: 'Developer Summit 2025', status: 'Published', startDate: '2025-09-10', endDate: '2025-09-12', description: 'A 3-day deep dive into the latest technologies and frameworks.', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_e3', title: 'Annual Charity Run', status: 'Draft', startDate: '2025-10-05', endDate: '2025-10-05', description: 'Raise money for local charities by participating in our 5k run.', imageUrl: 'https://images.unsplash.com/photo-1552674605-46f5383a6d71?auto=format&fit=crop&w=300&q=80', readMore: { enabled: false } },
  { id: 'mock_e4', title: 'New Hire Orientation', status: 'Published', startDate: '2025-07-01', endDate: '2025-07-02', description: 'Welcoming our newest team members to the organization.', imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_e5', title: 'Product Launch: Alpha V2', status: 'Published', startDate: '2025-11-20', endDate: '2025-11-20', description: 'The next generation of our flagship product is here.', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_e6', title: 'Holiday Party 2025', status: 'Draft', startDate: '2025-12-18', endDate: '2025-12-18', description: 'Celebrate the end of a great year with food, drinks, and music.', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_e7', title: 'Leadership Workshop', status: 'Published', startDate: '2025-08-22', endDate: '2025-08-23', description: 'Training session for aspiring team leaders.', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } },
  { id: 'mock_e8', title: 'Client Appreciation Dinner', status: 'Published', startDate: '2025-09-25', endDate: '2025-09-25', description: 'An evening to thank our most loyal partners.', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80', readMore: { enabled: true } }
];

const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: 'd1', title: 'Company Policy 2025', status: 'Draft', date: '2025-01-20', type: 'Word', year: '2025', description: 'Updated company policies.', itemRank: 5, translations: {} },
  { id: 'm1', title: 'Q1 Financial Report', status: 'Published', date: '2025-04-10', type: 'Excel', year: '2025', description: 'Quarterly financial analysis.', itemRank: 5 },
  { id: 'm2', title: 'Employee Handbook v2', status: 'Published', date: '2025-01-15', type: 'PDF', year: '2025', description: 'Updated HR policies.', itemRank: 5 },
  { id: 'm3', title: 'Project Alpha Proposal', status: 'Draft', date: '2025-03-22', type: 'Word', year: '2025', description: 'Initial proposal draft.', itemRank: 5 },
  { id: 'm4', title: 'Marketing Assets Link', status: 'Published', date: '2024-11-05', type: 'Link', year: '2024', description: 'External drive link.', itemRank: 5, url: 'https://drive.google.com' },
  { id: 'm5', title: 'Q4 Board Presentation', status: 'Published', date: '2024-12-20', type: 'PPT', year: '2024', description: 'End of year review.', itemRank: 5 },
  { id: 'm6', title: 'IT Security Guidelines', status: 'Published', date: '2023-06-10', type: 'PDF', year: '2023', description: 'Security protocols.', itemRank: 5 },
  { id: 'm7', title: 'Budget Plan 2026', status: 'Draft', date: '2025-05-01', type: 'Excel', year: '2025', description: 'Forward looking budget.', itemRank: 5 },
  { id: 'm8', title: 'Brand Guidelines', status: 'Published', date: '2022-02-14', type: 'PDF', year: '2022', description: 'Corporate identity guide.', itemRank: 5 },
  { id: 'm9', title: 'Legacy Systems Manual', status: 'Published', date: '2020-08-30', type: 'Word', year: '2020', description: 'Old system documentation.', itemRank: 5 }
];
*/

/*
const MOCK_FOLDERS: ImageFolder[] = [
  { id: 'all', name: 'All Images', count: 8 },
  { id: 'container', name: 'Container-Images', count: 3 },
  { id: 'card', name: 'Card-Images', count: 0 },
  { id: 'page', name: 'Page-Images', count: 3 },
  { id: 'covers', name: 'Covers', count: 0 },
  { id: 'team', name: 'TeamImages', count: 1 },
  { id: 'footer', name: 'FooterUrl', count: 0 },
  { id: 'logos', name: 'Logos', count: 0 },
  { id: 'tiles', name: 'Tiles', count: 0 },
  { id: 'flags', name: 'Flags', count: 1 },
  { id: 'slider', name: 'SliderImages', count: 0 },
];
*/

/*
const MOCK_IMAGES: ImageItem[] = [
  { id: 'i1', name: 'Text Edit(10).png', url: '', folderId: 'container', title: 'Text Edit Image', createdDate: '2025-03-18', createdBy: 'Sameer Gupta' },
  { id: 'i2', name: 'benefit-img2.jpg', url: '', folderId: 'container', title: 'Benefit Image 2', createdDate: '2025-03-18', createdBy: 'Sameer Gupta' },
  { id: 'i3', name: 'benefit-img1.png', url: '', folderId: 'container', title: 'Benefit Image 1', createdDate: '2025-03-18', createdBy: 'Sameer Gupta' },
  { id: 'i4', name: 'GR_Hochhuth_Strategie_page-0002.jpg', url: '', folderId: 'page', title: 'Strategy Page 2', createdDate: '2025-03-18', createdBy: 'Sameer Gupta' },
  { id: 'i5', name: 'GR_Hochhuth_Strategie_page-0001.jpg', url: '', folderId: 'page', title: 'Strategy Page 1', createdDate: '2025-03-18', createdBy: 'Sameer Gupta' },
  { id: 'i6', name: 'GR_Hochhuth_Strategie_page-0001-1.jpg', url: '', folderId: 'page', title: 'Strategy Page 1.1', createdDate: '2025-03-18', createdBy: 'Sameer Gupta' },
  { id: 'i7', name: 'Team_Meeting.jpg', url: '', folderId: 'team', title: 'Team Meeting', createdDate: '2025-03-15', createdBy: 'Admin' },
  { id: 'i8', name: 'Flag_US.png', url: '', folderId: 'flags', title: 'US Flag', createdDate: '2025-01-10', createdBy: 'System' },
];
*/

/*
const MOCK_TRANSLATION_ITEMS: TranslationItem[] = [
  { id: '#5', sourceList: 'TopNavigation', original: 'Home', translations: { de: 'Startseite', fr: 'Accueil' }, lastUpdated: '31/12/2025' },
  { id: '#6', sourceList: 'TopNavigation', original: 'What we offer', translations: { de: 'Was wir bieten', fr: 'Ce que nous offrons' }, lastUpdated: '31/12/2025' },
];
*/

/*
const MOCK_USERS: PermissionUser[] = [
  { id: 'u1', name: 'Abhishek Tiwari', email: 'abhishek.tiwari@webstudio.de' },
  { id: 'u2', name: 'Aditi Mishra', email: 'aditi.mishra@webstudio.de' },
  { id: 'u3', name: 'Aman Munjal', email: 'aman.munjal@webstudio.de' },
  { id: 'u4', name: 'Amit Kumar', email: 'amit.kumar@webstudio.de' },
  { id: 'u5', name: 'Ankita Pandit', email: 'ankita.pandit@webstudio.de' },
  { id: 'u6', name: 'Shivdutt Mishra', email: 'shivdutt.mishra@webstudio.de' },
];
*/

/*
const MOCK_CONTAINER_ITEMS: ContainerItem[] = [
  {
    id: 'ci1',
    title: 'Modern Workplace',
    status: 'Published',
    sortOrder: 1,
    description: 'Transform your organization with our state-of-the-art modern workplace solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    readMore: { enabled: true, text: 'Learn More', url: '#' },
    translations: {
      de: { title: 'Moderner Arbeitsplatz', description: 'Transformieren Sie Ihr Unternehmen mit unseren modernen Arbeitsplatzlösungen.' }
    }
  },
  {
    id: 'ci2',
    title: 'Digital Transformation',
    status: 'Published',
    sortOrder: 2,
    description: 'Accelerate your digital journey with expert guidance and innovative technology.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    readMore: { enabled: true, text: 'Read More', url: '#' },
    translations: {
      de: { title: 'Digitale Transformation', description: 'Beschleunigen Sie Ihre digitale Reise mit Expertenberatung und innovativer Technologie.' }
    }
  },
  {
    id: 'ci3',
    title: 'Cloud Security',
    status: 'Published',
    sortOrder: 3,
    description: 'Protect your valuable assets with our comprehensive cloud security framework.',
    imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798ccc1340?auto=format&fit=crop&w=400&q=80',
    readMore: { enabled: true, text: 'Discover Now', url: '#' },
    translations: {
      de: { title: 'Cloud-Sicherheit', description: 'Schützen Sie Ihre wertvollen Assets mit unserem umfassenden Cloud-Sicherheits-Framework.' }
    }
  }
];
*/

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
  { id: 'visitors', name: 'WebStudio Visitors', description: 'Control access for visitors and basic memory usage basic users. Ideal for granting read-only or limited permissions.', type: 'Visitors', memberIds: [] },
  { id: 'owners', name: 'WebStudio Owners', description: 'Manage high-level permissions for administrators and owners. Use with caution.', type: 'Owners', memberIds: ['u6'] },
];

const recalculateFolderCounts = (folders: ImageFolder[], images: ImageItem[]): ImageFolder[] => {
  return folders.map(f => {
    if (f.id === 'all') return { ...f, count: images.length };
    return { ...f, count: images.filter(i => i.folderId === f.id).length };
  });
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
  containerItems: ContainerItem[];
  contacts: ContactItem[];
  sliderItems: SliderItem[];
  images: ImageItem[];
  imageFolders: ImageFolder[];
  translationItems: TranslationItem[];
  permissionGroups: PermissionGroup[];
  permissionUsers: PermissionUser[];
  contactQueries: ContactQuery[];
  currentPageId: string;
  currentLanguage: LanguageCode;

  uiLabels: Record<string, MultilingualText>;
  editingLabelKey: string | null;
  editingContainerId: string | null;
  isLoading: boolean;

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
  addNavItem: (item: NavItem) => void;
  updateNavItem: (item: NavItem) => void;
  deleteNavItem: (id: string) => void;

  addNews: (item: NewsItem) => void;
  updateNews: (item: NewsItem) => void;
  deleteNews: (id: string) => void;

  addEvent: (item: EventItem) => void;
  updateEvent: (item: EventItem) => void;
  deleteEvent: (id: string) => void;

  addDocument: (item: DocumentItem) => void;
  updateDocument: (item: DocumentItem) => void;
  deleteDocument: (id: string) => void;

  addImage: (item: ImageItem) => void;
  updateImage: (item: ImageItem) => void;
  deleteImage: (id: string) => void;

  updateContainerItem: (item: ContainerItem) => void;
  deleteContainerItem: (id: string) => void;

  updateContact: (item: ContactItem) => void;
  deleteContact: (id: string) => void;

  updateSliderItem: (item: SliderItem) => void;
  deleteSliderItem: (id: string) => void;

  updateTranslationItem: (id: string, sourceList: string, original: string, lang: string, value: string) => void;

  // Permission Actions
  createPermissionGroup: (group: PermissionGroup) => void;
  updatePermissionGroup: (group: PermissionGroup) => void;
  addMemberToGroup: (groupId: any, userId: any) => void;
  removeMemberFromGroup: (groupId: any, userId: any) => void;

  // Contact Query Actions
  addContactQuery: (query: ContactQuery) => void;
  deleteContactQuery: (ids: string[]) => void;

  updateFooterConfig: (config: Partial<SiteConfig['footer']>) => void;

  openLabelEditor: (key: string) => void;
  updateLabel: (key: string, text: string, lang: LanguageCode) => void;

  addPage: (page: Page) => void;
  updatePage: (page: Page) => void;
  deletePage: (id: string) => void;
  addContainer: (pageId: string, container: Container) => void;
  updateContainer: (pageId: string, container: Container) => void;
  deleteContainer: (pageId: string, cId: string) => void;
  reorderContainers: (pageId: string, newOrder: Container[]) => void;
  loadFromApi: () => Promise<void>;
  translationSources: string[];
  // Helper functions for managing taggedItems
  removeItemFromContainers: (itemId: string) => Promise<void>;
  validateContainerTaggedItems: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({

      /* ================= STATE ================= */

      viewMode: ViewMode.PREVIEW,
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

      /* =========================================================
         🚀 LOAD FROM NODE API
      ========================================================== */

      loadFromApi: async () => {
        try {
          set({ isLoading: true });
          console.log("🔄 Loading data from Node API...");

          const API = "http://localhost:3001/api";

          const [
            spPages,
            spNav,
            spNews,
            spEvents,
            spDocs,
            spSettings,
            spTranslations,
            spContainerItems,
            spContactQueries,
            spContacts,
            spSliderItems,
            spContainers,
            allImagesRaw
          ] = await Promise.all([
            fetch(`${API}/smartPages`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/topNavigation`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/news`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/events`).then((r: any) => r.json()).catch(() => []),
            fetchAllItems("/api/publishing-documents", "documents").catch(() => []),
            fetch(`${API}/globalSettings`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/translationDictionary`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/containerItems`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/contactQueries`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/contacts`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/imageSlider`).then((r: any) => r.json()).catch(() => []),
            fetch(`${API}/containers`).then((r: any) => r.json()).catch(() => []),
            fetchAllItems("/api/publishing-images", "images").catch(() => [])
          ]);

          /* ================= MEDIA BINDING ================= */

          const { imageMap, documentMap } = buildMediaMaps(allImagesRaw, spDocs);

          const resolveImage = (item: any): string => {
            if (!item) return "";

            // 1️⃣ Try ImageName from imageMap
            const imageName = typeof item.ImageName === "string"
              ? item.ImageName.toLowerCase().trim()
              : "";

            if (imageName && imageMap?.[imageName]?.url) {
              return imageMap[imageName].url;
            }

            // 2️⃣ Handle different ImageUrl shapes safely
            const imageUrl = item.ImageUrl;

            if (!imageUrl) return "";

            if (typeof imageUrl === "string") {
              return imageUrl;
            }

            if (typeof imageUrl === "object") {
              return (
                imageUrl.Url ||
                imageUrl.url ||
                imageUrl?.value?.Url ||
                imageUrl?.value?.url ||
                ""
              );
            }

            return "";
          };

          const resolveDocument = (item: any) => {
            const key = (item.Name || item.FileLeafRef || "").toLowerCase();
            return documentMap[key]?.url || item.FileRef || item.url || "";
          };

          const safeParse = (val: any, fallback: any = {}) => {
            try { return val ? JSON.parse(val) : fallback; }
            catch { return fallback; }
          };

          const normalizeId = (val: any) => String(val ?? "").trim();

          const cleanTranslations = (obj: any) => {
            const parsed = safeParse(obj, {});
            Object.keys(parsed).forEach(lang => {
              if (parsed[lang]?.description) {
                parsed[lang].description = unescapeHtml(parsed[lang].description);
              }
            });
            return parsed;
          };

          /* ================= GLOBAL SETTINGS ================= */

          let loadedTheme = DEFAULT_THEME;
          let loadedSiteConfig = get().siteConfig;
          let loadedUiLabels = INITIAL_UI_LABELS;

          if (spSettings.length > 0) {
            const themeItem = spSettings.find((i: any) => i.Title === 'THEME_CONFIG');
            if (themeItem?.ConfigData)
              loadedTheme = { ...DEFAULT_THEME, ...safeParse(themeItem.ConfigData) };

            const siteItem = spSettings.find((i: any) => i.Title === 'SITE_CONFIG');
            if (siteItem?.ConfigData)
              loadedSiteConfig = { ...loadedSiteConfig, ...safeParse(siteItem.ConfigData) };

            const labelsItem = spSettings.find((i: any) => i.Title === 'UI_LABELS');
            if (labelsItem?.ConfigData)
              loadedUiLabels = { ...loadedUiLabels, ...safeParse(labelsItem.ConfigData) };

            const appItem = spSettings.find((i: any) => i.Title === 'APP_STATE');
            if (appItem?.ConfigData) {
              const parsedApp = safeParse(appItem.ConfigData);
              if (parsedApp.currentPageId) set({ currentPageId: parsedApp.currentPageId });
              if (parsedApp.currentLanguage) set({ currentLanguage: parsedApp.currentLanguage });
              if (parsedApp.editingContainerId) set({ editingContainerId: parsedApp.editingContainerId });
            }

            const sourcesItem = spSettings.find((i: any) => i.Title === 'TRANSLATION_SOURCES');
            if (sourcesItem?.ConfigData) {
              const parsedSources = safeParse(sourcesItem.ConfigData, []);
              if (Array.isArray(parsedSources)) set({ translationSources: parsedSources });
            }
          }

          /* ================= TRANSLATIONS ================= */

          if (spTranslations?.length > 0) {
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

          const loadedTranslationItems =
            spTranslations?.length > 0
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

          /* ================= CONTAINERS ================= */

          const transformedContainers = spContainers.map((c: any) => {
            const extractImageName = (url: string): string => {
              if (!url || typeof url !== "string") return "";

              try {
                const decoded = decodeURIComponent(url);
                const parts = decoded.split("/");
                return parts[parts.length - 1].toLowerCase().trim();
              } catch {
                return "";
              }
            };
            const parsedSettings = safeParse(c.Settings, {});

            if (parsedSettings?.bgImage) {
              const imageName = extractImageName(parsedSettings.bgImage);

              const resolvedUrl = resolveImage({
                ImageName: imageName
              });

              if (resolvedUrl) {
                parsedSettings.bgImage = resolvedUrl;
              }
            }
            if (c.BtnEnabled !== undefined && c.BtnEnabled !== null) parsedSettings.btnEnabled = c.BtnEnabled;
            if (c.BtnName) parsedSettings.btnName = c.BtnName;
            if (c.BtnUrl) parsedSettings.btnUrl = c.BtnUrl;

            const parsedContent = safeParse(c.ContainerContent, {});
            if (parsedContent.translations) {
              Object.keys(parsedContent.translations).forEach(lang => {
                if (parsedContent.translations[lang]?.description) {
                  parsedContent.translations[lang].description = unescapeHtml(parsedContent.translations[lang].description);
                }
              });
            }

            return {
              id: normalizeId(c.id),
              pageId: c.PageLookupId,
              type: c.ContainerType,
              order: c.SortOrder || 0,
              isVisible: c.IsVisible !== false,
              settings: parsedSettings,
              content: parsedContent,
              title: c.Title || ''
            };
          });

          const containerMap: Record<string, any[]> = {};
          transformedContainers.forEach((c: any) => {
            const pid = normalizeId(c.pageId);
            if (!containerMap[pid]) containerMap[pid] = [];
            containerMap[pid].push(c);
          });

          /* ================= PAGES ================= */

          const transformedPages = spPages.map((p: any) => ({
            id: p.id,
            title: p.MultilingualTitle ? safeParse(p.MultilingualTitle) : { en: p.Title },
            slug: p.Slug || '/',
            status: p.PageStatus || 'Draft',
            createdBy: p.Author?.Title || 'System',
            modifiedBy: p.Editor?.Title || 'System',
            modifiedDate: p.Modified || new Date().toISOString(),
            description: unescapeHtml(p.Description || ''),
            isHomePage: p.IsHomePage || false,
            seo: p.SEOConfig ? safeParse(p.SEOConfig) : undefined,
            containers: containerMap[normalizeId(p.id)] || []
          }));

          /* ================= NAVIGATION ================= */

          const transformedNav = spNav.map((item: any) => ({
            id: normalizeId(item.id),
            parentId: item.ParentLookupId ? normalizeId(item.ParentLookupId) : 'root',
            title: item.Title,
            type: item.NavType || 'Page',
            pageId: item.SmartPageLookupId ? normalizeId(item.SmartPageLookupId) : undefined,
            url: item.ExternalURL,
            isVisible: item.IsVisible !== false,
            openInNewTab: item.OpenInNewTab || false,
            order: item.SortOrder || 0,
            translations: safeParse(item.Translations, {}),
            modified: item.Modified
          }));

          /* ================= NEWS ================= */

          const transformedNews = spNews.map((item: any) => ({
            id: normalizeId(item.id),
            title: item.Title,
            status: item.Status || 'Draft',
            publishDate: item.PublishDate || new Date().toISOString(),
            description: unescapeHtml(item.Description || ''),
            imageUrl: resolveImage(item) || '',
            imageName: item.ImageName || '',
            readMore: {
              enabled: item.ReadMoreEnabled || false,
              text: item.ReadMoreText || '',
              url: item.ReadMoreURL || ''
            },
            seo: item.SEOConfig ? safeParse(item.SEOConfig) : { title: '', description: '', keywords: '' },
            translations: cleanTranslations(item.Translations),
            createdBy: item.Author?.Title || 'System',
            modifiedBy: item.Editor?.Title || 'System',
            createdDate: item.Created,
            modifiedDate: item.Modified || item.Created
          }));

          /* ================= EVENTS ================= */

          const transformedEvents = spEvents.map((item: any) => ({
            id: normalizeId(item.id),
            title: item.Title,
            status: item.Status || 'Draft',
            startDate: item.StartDate || new Date().toISOString(),
            endDate: item.EndDate || '',
            location: item.Location || '',
            category: item.Category || 'General',
            description: unescapeHtml(item.Description || ''),
            imageUrl: resolveImage(item) || '',
            imageName: item.ImageName || '',
            readMore: {
              enabled: item.ReadMoreEnabled || false,
              text: item.ReadMoreText || '',
              url: item.ReadMoreURL || ''
            },
            seo: item.SEOConfig ? safeParse(item.SEOConfig) : { title: '', description: '', keywords: '' },
            translations: cleanTranslations(item.Translations),
            createdBy: item.Author?.Title || 'System',
            modifiedBy: item.Editor?.Title || 'System',
            createdDate: item.Created,
            modifiedDate: item.Modified || item.Created
          }));

          /* ================= DOCUMENTS ================= */

          const transformedDocs = spDocs.map((item: any) => ({
            id: normalizeId(item.id),
            title: item.Title,
            name: item.Name,
            status: item.DocStatus || 'Draft',
            date: item.Modified || new Date().toISOString(),
            type: item.DocType || 'PDF',
            year: item.DocumentYear || new Date().getFullYear().toString(),
            description: unescapeHtml(item.DocumentDescriptions || ''),
            itemRank: item.ItemRank || 5,
            sortOrder: item.SortOrder || 0,
            url: resolveDocument(item) || item.FileRef || '',
            imageUrl: resolveImage(item) || '',
            imageName: item.ImageName || '',
            translations: cleanTranslations(item.Translations),
            createdBy: item.AuthorName || item.Author?.Title || 'System',
            modifiedBy: item.EditorName || item.Editor?.Title || 'System',
            createdDate: item.Created,
            modifiedDate: item.Modified || item.Created
          }));

          /* ================= IMAGES ================= */

          const transformedImages = allImagesRaw.map((img: any) => ({
            id: normalizeId(img.id),
            name: img.FileName,
            url: img.Url,
            folderId: img.AssetCategory || 'all',
            title: img.Title || img.FileName,
            description: img.Description || '',
            copyright: img.CopyrightInfo || '',
            createdDate: img.Created,
            createdBy: img.AuthorName || 'Unknown'
          }));

          const imageFolders = [
            { id: 'all', name: 'All Images', count: transformedImages.length }
          ];

          /* ================= CONTAINER ITEMS ================= */

          const transformedContainerItems = spContainerItems.map((item: any) => ({
            id: normalizeId(item.id),
            title: item.Title,
            status: item.Status || 'Draft',
            sortOrder: item.SortOrder || 0,
            description: unescapeHtml(item.Description || ''),
            imageUrl: resolveImage(item) || '',
            imageName: item.ImageName || '',
            translations: cleanTranslations(item.Translations),
            createdBy: item.Author?.Title || 'System',
            modifiedBy: item.Editor?.Title || 'System',
            createdDate: item.Created,
            modifiedDate: item.Modified || item.Created
          }));

          /* ================= CONTACTS ================= */

          const transformedContacts = spContacts.map((item: any) => ({
            id: normalizeId(item.id),
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
            imageUrl: resolveImage(item) || '',
            imageName: item.ImageName || '',
            translations: cleanTranslations(item.Translations),
            createdBy: item.Author?.Title || 'System',
            modifiedBy: item.Editor?.Title || 'System',
            createdDate: item.Created,
            modifiedDate: item.Modified || item.Created
          }));

          /* ================= CONTACT QUERIES ================= */

          const transformedContactQueries = spContactQueries.map((item: any) => {
            const formData = safeParse(item.FormData, {});
            return {
              id: normalizeId(item.id),
              pageId: item.SourcePageLookupId,
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

          /* ================= SLIDER ITEMS ================= */

          const transformedSliderItems = spSliderItems.map((item: any) => ({
            id: normalizeId(item.id),
            title: item.Title || '',
            subtitle: item.Subtitle || '',
            description: item.Description || '',
            status: item.Status || 'Draft',
            sortOrder: item.SortOrder || 0,
            ctaText: item.CtaText || '',
            ctaUrl: item.CtaUrl || '',
            imageUrl: resolveImage(item) || '',
            imageName: item.ImageName || '',
            translations: cleanTranslations(item.Translations),
            createdDate: item.Created,
            modifiedDate: item.Modified || item.Created,
            createdBy: item.Author?.Title || 'System',
            modifiedBy: item.Editor?.Title || item.Author?.Title || 'System'
          }));

          /* ================= DEFAULT NAVIGATION ================= */

          let defaultPageId = '';
          const homeNavItem = transformedNav.find((n: any) => n.title?.toUpperCase() === 'HOME' && n.pageId);

          if (homeNavItem?.pageId) {
            defaultPageId = homeNavItem.pageId;
          } else {
            const rootItems = transformedNav.filter((n: any) => n.parentId === 'root').sort((a: any, b: any) => a.order - b.order);
            const firstRootPage = rootItems.find((n: any) => n.type === 'Page' && n.pageId);

            if (firstRootPage?.pageId) {
              defaultPageId = firstRootPage.pageId;
            } else {
              const sortedNav = [...transformedNav].sort((a: any, b: any) => a.order - b.order);
              const firstPageNav = sortedNav.find((n: any) => n.type === 'Page' && n.pageId);
              if (firstPageNav?.pageId) {
                defaultPageId = firstPageNav.pageId;
              } else if (transformedPages.length > 0) {
                defaultPageId = transformedPages[0].id;
              }
            }
          }

          const defaultPageExists = transformedPages.find((p: any) => p.id === defaultPageId);
          if (defaultPageExists && (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#')) {
            window.location.hash = defaultPageExists.slug;
          }

          /* ================= FINAL STORE UPDATE ================= */

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
            currentPageId: defaultPageId || '1',
            isLoading: false
          });

          await get().validateContainerTaggedItems();

          console.log("✅ Node API fully matched with SharePoint mapping + media binding");

        } catch (error) {
          console.error("❌ Error loading Node API data:", error);
          set({ isLoading: false });
        }
      },

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
          }
        } catch (error) {
          console.error('Error removing item from containers:', error);
        }
      },

      validateContainerTaggedItems: async () => {
        try {
          const state = get();
          const allItemIds = new Set([
            ...state.news.map(n => n.id),
            ...state.events.map(e => e.id),
            ...state.documents.map(d => d.id),
            ...state.containerItems.map(ci => ci.id),
            ...state.contacts.map(c => c.id),
            ...state.sliderItems.map(s => s.id),
            ...state.pages.map(p => p.id)
          ]);

          let hasGlobalChanges = false;

          const updatedPages = state.pages.map(page => {
            let pageHasChanges = false;
            const updatedContainers = page.containers.map(container => {
              const taggedItems = container.settings?.taggedItems;
              if (taggedItems && Array.isArray(taggedItems)) {
                const validItems = taggedItems.filter((id: any) => allItemIds.has(String(id)));

                if (validItems.length !== taggedItems.length) {
                  console.warn(`🧼 Cleaning up ${taggedItems.length - validItems.length} invalid taggedItems in container ${container.id}`);
                  pageHasChanges = true;
                  hasGlobalChanges = true;
                  return {
                    ...container,
                    settings: {
                      ...container.settings,
                      taggedItems: validItems
                    }
                  };
                }
              }
              return container;
            });

            return pageHasChanges ? { ...page, containers: updatedContainers } : page;
          });

          if (hasGlobalChanges) {
            set({ pages: updatedPages });
          }
        } catch (error) {
          console.error('Error validating container items:', error);
        }
      },

      /* ================= EXISTING ACTIONS (UNCHANGED) ================= */

      toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === ViewMode.PREVIEW ? ViewMode.EDIT : ViewMode.PREVIEW })),
      openModal: (type) => set({ activeModal: type }),
      closeModal: () => set({ activeModal: ModalType.NONE, editingLabelKey: null, editingContainerId: null }),
      updateThemeVar: (key, value) => set((state) => ({ themeConfig: { ...state.themeConfig, [key]: value } })),
      setThemeConfig: (config) => set({ themeConfig: config }),
      setCurrentPage: (id) => set({ currentPageId: id }),
      resetTheme: () => set({ themeConfig: DEFAULT_THEME }),
      setLanguage: (lang) => set({ currentLanguage: lang }),
      setEditingContainerId: (id) => set({ editingContainerId: id }),

      updateNavPosition: (pos) => set((state) => ({ siteConfig: { ...state.siteConfig, navPosition: pos } })),
      updateNavAlignment: (align) => set((state) => ({ siteConfig: { ...state.siteConfig, navAlignment: align } })),
      updateHeaderConfig: (config) => set((state) => ({ siteConfig: { ...state.siteConfig, ...config } })),
      updateLogo: (logo) => set((state) => ({ siteConfig: { ...state.siteConfig, logo } })),
      addNavItem: (item) => set((state) => ({ siteConfig: { ...state.siteConfig, navigation: [...state.siteConfig.navigation, item] } })),
      updateNavItem: (item) => set((state) => ({ siteConfig: { ...state.siteConfig, navigation: state.siteConfig.navigation.map(n => n.id === item.id ? item : n) } })),
      deleteNavItem: (id) => set((state) => ({ siteConfig: { ...state.siteConfig, navigation: state.siteConfig.navigation.filter(n => n.id !== id && n.parentId !== id) } })),

      addNews: (item) => set((state) => ({ news: [...state.news, item] })),
      updateNews: (item) => set((state) => ({ news: state.news.map(n => n.id === item.id ? item : n) })),
      deleteNews: async (id) => {
        set((state) => ({ news: state.news.filter(n => n.id !== id) }));
        await get().removeItemFromContainers(id);
      },

      addEvent: (item) => set((state) => ({ events: [...state.events, item] })),
      updateEvent: (item) => set((state) => ({ events: state.events.map(n => n.id === item.id ? item : n) })),
      deleteEvent: async (id) => {
        set((state) => ({ events: state.events.filter(n => n.id !== id) }));
        await get().removeItemFromContainers(id);
      },

      addDocument: (item) => set((state) => ({ documents: [...state.documents, item] })),
      updateDocument: (item) => set((state) => ({ documents: state.documents.map(n => n.id === item.id ? item : n) })),
      deleteDocument: async (id) => {
        set((state) => ({ documents: state.documents.filter(n => n.id !== id) }));
        await get().removeItemFromContainers(id);
      },

      addImage: (item) => set((state) => {
        const newImages = [...state.images, item];
        return {
          images: newImages,
          imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
        };
      }),
      updateImage: (item) => set((state) => {
        const newImages = state.images.map(i => i.id === item.id ? item : i);
        return {
          images: newImages,
          imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
        };
      }),
      deleteImage: async (id) => {
        const state = get();
        const newImages = state.images.filter(i => i.id !== id);
        set({
          images: newImages,
          imageFolders: recalculateFolderCounts(state.imageFolders, newImages)
        });
        await get().removeItemFromContainers(id);
      },

      updateContainerItem: (item) => set((state) => ({ containerItems: state.containerItems.map(i => i.id === item.id ? item : i) })),
      deleteContainerItem: async (id) => {
        set((state) => ({ containerItems: state.containerItems.filter(i => i.id !== id) }));
        await get().removeItemFromContainers(id);
      },

      updateContact: (item) => set((state) => ({ contacts: state.contacts.map(i => i.id === item.id ? item : i) })),
      deleteContact: async (id) => {
        set((state) => ({ contacts: state.contacts.filter(i => i.id !== id) }));
        await get().removeItemFromContainers(id);
      },

      updateSliderItem: (item) => set((state) => ({ sliderItems: state.sliderItems.map(i => i.id === item.id ? item : i) })),
      deleteSliderItem: async (id) => {
        set((state) => ({ sliderItems: state.sliderItems.filter(i => i.id !== id) }));
        await get().removeItemFromContainers(id);
      },

      updateTranslationItem: (id, sourceList, original, lang, value) => set((state) => {
        const existingIndex = state.translationItems.findIndex(item => item.id === id);
        if (existingIndex >= 0) {
          const newItems = [...state.translationItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            translations: { ...newItems[existingIndex].translations, [lang]: value },
            lastUpdated: new Date().toLocaleDateString('en-GB')
          };
          return { translationItems: newItems };
        } else {
          const newItem: TranslationItem = {
            id,
            sourceList,
            original,
            translations: { [lang]: value },
            lastUpdated: new Date().toLocaleDateString('en-GB')
          };
          return { translationItems: [...state.translationItems, newItem] };
        }
      }),

      // Permission Actions
      createPermissionGroup: (group) => set((state) => ({ permissionGroups: [...state.permissionGroups, group] })),
      updatePermissionGroup: (group) => set((state) => ({ permissionGroups: state.permissionGroups.map(g => g.id === group.id ? group : g) })),
      addMemberToGroup: (groupId, userId) => set((state) => ({
        permissionGroups: state.permissionGroups.map(g => g.id === groupId ? { ...g, memberIds: [...g.memberIds, userId] } : g)
      })),
      removeMemberFromGroup: (groupId, userId) => set((state) => ({
        permissionGroups: state.permissionGroups.map(g => g.id === groupId ? { ...g, memberIds: g.memberIds.filter(id => id !== userId) } : g)
      })),

      // Contact Query Actions
      addContactQuery: (query) => set((state) => ({ contactQueries: [query, ...state.contactQueries] })),
      deleteContactQuery: (ids) => set((state) => ({ contactQueries: state.contactQueries.filter(q => !ids.includes(q.id)) })),

      updateFooterConfig: (config) => set((state) => ({ siteConfig: { ...state.siteConfig, footer: { ...state.siteConfig.footer, ...config } } })),

      openLabelEditor: (key) => set({ activeModal: ModalType.LABEL_EDITOR, editingLabelKey: key }),
      updateLabel: (key, text, lang) => set((state) => ({ uiLabels: { ...state.uiLabels, [key]: { ...state.uiLabels[key], [lang]: text } }, activeModal: ModalType.NONE, editingLabelKey: null })),

      addPage: (page) => set((state) => ({ pages: [...state.pages, { ...page, containers: page.containers && page.containers.length > 0 ? page.containers : createDefaultContainers(page.id) }] })),
      updatePage: (page) => set((state) => ({ pages: state.pages.map(p => p.id === page.id ? page : p) })),
      deletePage: async (id) => {
        set((state) => ({ pages: state.pages.filter(p => p.id !== id) }));
        await get().removeItemFromContainers(id);
      },
      addContainer: (pageId, container) => set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: [...p.containers, { ...container, pageId }] } : p) })),
      updateContainer: (pageId, container) => set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: p.containers.map(c => c.id === container.id ? container : c) } : p) })),
      deleteContainer: (pageId, cId) => set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: p.containers.filter(c => c.id !== cId) } : p) })),
      reorderContainers: (pageId, newOrder) => set((state) => ({ pages: state.pages.map(p => p.id === pageId ? { ...p, containers: newOrder } : p) })),
    }),
    {
      name: 'web-studio-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ themeConfig: state.themeConfig, siteConfig: state.siteConfig, pages: state.pages, news: state.news, events: state.events, documents: state.documents, containerItems: state.containerItems, contacts: state.contacts, sliderItems: state.sliderItems, images: state.images, currentLanguage: state.currentLanguage, uiLabels: state.uiLabels, translationItems: state.translationItems, permissionGroups: state.permissionGroups, permissionUsers: state.permissionUsers, contactQueries: state.contactQueries }),
    }
  )
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
const fetchAllItems = async (
  endpoint: string,
  driveType: "images" | "documents",
  folderId: string | null = null
): Promise<any[]> => {

  const url = folderId
    ? `${API_BASE}${endpoint}?folderId=${folderId}`
    : `${API_BASE}${endpoint}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`⚠️ ${url} returned ${response.status}`);
    return [];
  }

  const data: any[] = await response.json();

  let collectedItems: any[] = [];

  for (const item of data) {
    if (item.type === "folder") {
      const childItems = await fetchAllItems(
        endpoint,
        driveType,
        item.id
      );
      collectedItems = [...collectedItems, ...childItems];
    } else {
      collectedItems.push({
        ...item,
        url: `${API_BASE}/api/view-file/${driveType}/${item.id}` // ✅ fixed
      });
    }
  }

  return collectedItems;
};

const buildMediaMaps = (images: ImageItem[], documents: any[]) => {
  const imageMap = Object.fromEntries(
    images.map(i => [i.name?.toLowerCase(), i])
  );

  const documentMap = Object.fromEntries(
    documents.map(d => [d.name?.toLowerCase() || d.title?.toLowerCase(), d])
  );

  return { imageMap, documentMap };
};