// Seed Data for SmartPages
export const SEED_SMART_PAGES = [
    {
        Title: 'Home',
        MultilingualTitle: JSON.stringify({ en: 'Home', de: 'Startseite', fr: 'Accueil', es: 'Inicio' }),
        Slug: '/',
        PageStatus: 'Draft',
        IsHomePage: true,
        Description: 'Welcome to our corporate intranet home page',
        SEOConfig: JSON.stringify({
            title: 'Home - Web Studio',
            description: 'Corporate Intranet Home',
            keywords: 'home, intranet, corporate, news'
        }),
        VersionNote: 'Initial version'
    },
    {
        Title: 'What We Offer',
        MultilingualTitle: JSON.stringify({ en: 'What We Offer', de: 'Was wir bieten', fr: 'Ce que nous offrons', es: 'Lo que ofrecemos' }),
        Slug: '/what-we-offer',
        PageStatus: 'Draft',
        IsHomePage: false,
        Description: 'Overview of our services and products',
        SEOConfig: JSON.stringify({
            title: 'Services - Web Studio',
            description: 'Our offerings',
            keywords: 'services, products'
        }),
        VersionNote: 'Initial version'
    },
    {
        Title: 'How We Work',
        MultilingualTitle: JSON.stringify({ en: 'How We Work', de: 'Wie wir arbeiten', fr: 'Notre méthode', es: 'Cómo trabajamos' }),
        Slug: '/how-we-work',
        PageStatus: 'Draft',
        IsHomePage: false,
        Description: 'Our methodology and processes',
        SEOConfig: JSON.stringify({ title: 'How We Work', description: 'Our processes', keywords: 'agile, methodology' }),
        VersionNote: 'Initial version'
    },
    {
        Title: 'Who We Are',
        MultilingualTitle: JSON.stringify({ en: 'Who We Are', de: 'Wer wir sind', fr: 'Qui nous sommes', es: 'Quiénes somos' }),
        Slug: '/who-we-are',
        PageStatus: 'Draft',
        IsHomePage: false,
        Description: 'About our company and team',
        SEOConfig: JSON.stringify({ title: 'About Us', description: 'Our story', keywords: 'about, team, company' }),
        VersionNote: 'Initial version'
    },
    {
        Title: 'Careers',
        MultilingualTitle: JSON.stringify({ en: 'Careers', de: 'Karriere', fr: 'Carrières', es: 'Carreras' }),
        Slug: '/careers',
        PageStatus: 'Draft',
        IsHomePage: false,
        Description: 'Join our team',
        SEOConfig: JSON.stringify({ title: 'Careers', description: 'Job opportunities', keywords: 'jobs, careers, hiring' }),
        VersionNote: 'Initial version'
    },
    {
        Title: 'Contact',
        MultilingualTitle: JSON.stringify({ en: 'Contact', de: 'Kontakt', fr: 'Contact', es: 'Contacto' }),
        Slug: '/contact',
        PageStatus: 'Draft',
        IsHomePage: false,
        Description: 'Get in touch with us',
        SEOConfig: JSON.stringify({ title: 'Contact Us', description: 'Contact information', keywords: 'contact, support' }),
        VersionNote: 'Initial version'
    }
];

// Seed Data for TopNavigation
// export const SEED_TOP_NAVIGATION = [
//     { Title: 'HOME', Parent: null, NavType: 'Page', SmartPage: null, ExternalURL: '', SortOrder: 0, IsVisible: true, OpenInNewTab: false },
//     { Title: 'WHAT WE OFFER', Parent: null, NavType: 'Page', SmartPage: null, ExternalURL: '', SortOrder: 1, IsVisible: true, OpenInNewTab: false },
//     { Title: 'HOW WE WORK', Parent: null, NavType: 'Page', SmartPage: null, ExternalURL: '', SortOrder: 2, IsVisible: true, OpenInNewTab: false },
//     { Title: 'WHO WE ARE', Parent: null, NavType: 'Page', SmartPage: null, ExternalURL: '', SortOrder: 3, IsVisible: true, OpenInNewTab: false },
//     { Title: 'CAREERS', Parent: null, NavType: 'Page', SmartPage: null, ExternalURL: '', SortOrder: 4, IsVisible: true, OpenInNewTab: false },
//     { Title: 'CONTACT', Parent: null, NavType: 'Page', SmartPage: null, ExternalURL: '', SortOrder: 5, IsVisible: true, OpenInNewTab: false }
// ];

// Seed Data for News
export const SEED_NEWS = [
    {
        Title: 'New Office Opening in Berlin',
        Status: 'Draft',
        PublishDate: new Date('2025-01-10'),
        Description: 'We are thrilled to announce the opening of our new regional headquarters.',
        Thumbnail: null,
        ReadMoreURL: '#',
        ReadMoreText: 'Read Full Story',
        ReadMoreEnabled: true,
        SEOConfig: JSON.stringify({ title: 'New Office Opening', description: 'Opening of new office in Berlin', keywords: 'office, berlin, opening' }),
        Translations: JSON.stringify({
            de: { title: 'Neues Büro', description: 'Wir freuen uns...' },
            fr: { title: 'Nouveau bureau', description: 'Nous sommes ravis...' }
        })
    },
    {
        Title: 'Global Expansion Strategy 2025',
        Status: 'Draft',
        PublishDate: new Date('2025-03-10'),
        Description: 'Our comprehensive plan to enter new markets in Asia and South America.',
        Thumbnail: null,
        ReadMoreURL: '',
        ReadMoreText: '',
        ReadMoreEnabled: false,
        SEOConfig: JSON.stringify({ title: 'Global Expansion', description: 'Strategy for 2025', keywords: 'expansion, strategy, global' }),
        Translations: JSON.stringify({})
    },
    {
        Title: 'Employee Wellness Week Highlights',
        Status: 'Draft',
        PublishDate: new Date('2025-02-28'),
        Description: 'A look back at the activities and workshops from our successful wellness week.',
        Thumbnail: null,
        ReadMoreURL: '',
        ReadMoreText: '',
        ReadMoreEnabled: false,
        SEOConfig: JSON.stringify({ title: 'Wellness Week', description: 'Highlights form wellness week', keywords: 'wellness, employee, health' }),
        Translations: JSON.stringify({})
    },
    {
        Title: 'Sustainability Report 2024',
        Status: 'Draft',
        PublishDate: new Date('2024-12-20'),
        Description: 'Download the full report on our environmental impact and future goals.',
        Thumbnail: null,
        ReadMoreURL: '',
        ReadMoreText: '',
        ReadMoreEnabled: false,
        SEOConfig: JSON.stringify({ title: 'Sustainability 2024', description: 'Annual sustainability report', keywords: 'sustainability, partial, environment' }),
        Translations: JSON.stringify({})
    }
];

// Seed Data for GlobalSettings
export const SEED_GLOBAL_SETTINGS = [
    {
        Title: 'THEME_CONFIG',
        ConfigData: JSON.stringify({
            '--primary-color': '#2f5596',
            '--secondary-color': '#1f3f73',
            '--brand-light': '#e6ecf7',
            '--brand-dark': '#1c355f',
            '--gradient-primary': 'linear-gradient(135deg, #2f5596 0%, #1f3f73 100%)',
            '--sidebar-bg': '#ffffff',
            '--sidebar-text': '#1f2937',
            '--border-radius-sm': '0px',
            '--border-radius-md': '0px',
            '--border-radius-lg': '0px'
        })
    },
    {
        Title: 'SITE_CONFIG',
        ConfigData: JSON.stringify({
            name: 'My Enterprise Site',
            languages: ['en', 'de', 'fr', 'es'],
            defaultLanguage: 'en',
            navPosition: 'right',
            headerBackgroundColor: '#ffffff'
        })
    },
    {
        Title: 'UI_LABELS',
        ConfigData: JSON.stringify({
            APP_TITLE: { en: 'Web Studio', de: 'Web Studio', fr: 'Web Studio', es: 'Web Studio' },
            APP_SUBTITLE: { en: 'Enterprise CMS', de: 'Unternehmens-CMS', fr: 'CMS d\'entreprise', es: 'CMS empresarial' },
            SITE_GLOBALS: { en: 'Site Globals', de: 'Globale Einstellungen', fr: 'Paramètres globaux', es: 'Configuración global' },
            PAGES: { en: 'Pages', de: 'Seiten', fr: 'Pages', es: 'Páginas' },
            SECTION_PAGE_INFO: { en: 'Page Info', de: 'Seiteninfo', fr: 'Info page', es: 'Info página' },
            LABEL_TITLE: { en: 'Title', de: 'Titel', fr: 'Titre', es: 'Título' },
            LABEL_STATUS: { en: 'Status', de: 'Status', fr: 'Statut', es: 'Estado' },
            LABEL_MODIFIED: { en: 'Modified', de: 'Geändert', fr: 'Modifié', es: 'Modificado' },
            PAGE_PREVIEW: { en: 'Page Preview', de: 'Seitenvorschau', fr: 'Aperçu de la page', es: 'Vista previa' },
            EDIT_MODE: { en: 'Edit Mode', de: 'Bearbeitungsmodus', fr: 'Mode édition', es: 'Modo edición' },
            NAV_MGMT: { en: 'Navigation Management', de: 'Navigationsverwaltung', fr: 'Gestion de navigation', es: 'Gestión de navegación' },
            NEWS_MGMT: { en: 'News Management', de: 'Nachrichtenverwaltung', fr: 'Gestion des actualités', es: 'Gestión de noticias' },
            EVENT_MGMT: { en: 'Event Management', de: 'Veranstaltungsverwaltung', fr: 'Gestion des événements', es: 'Gestión de eventos' },
            DOC_MGMT: { en: 'Document Management', de: 'Dokumentenverwaltung', fr: 'Gestion documentaire', es: 'Gestión de documentos' },
            FOOTER_MGMT: { en: 'Footer Management', de: 'Fußzeilenverwaltung', fr: 'Gestion de pied de page', es: 'Gestión de pie de página' },
            SITE_MGMT: { en: 'Site Management', de: 'Seitenverwaltung', fr: 'Gestion du site', es: 'Gestión del sitio' },
            IMG_MGMT: { en: 'Image Management', de: 'Bildverwaltung', fr: 'Gestion des images', es: 'Gestión de imágenes' },
            CONTENT_TRANS: { en: 'Content Translator', de: 'Inhaltsübersetzer', fr: 'Traducteur de contenu', es: 'Traductor de contenido' },
            PERM_MGMT: { en: 'Permission Management', de: 'Berechtigungsverwaltung', fr: 'Gestion des permissions', es: 'Gestión de permisos' },
            CONTACT_Q: { en: 'Contact Form Queries', de: 'Kontaktanfragen', fr: 'Demandes de contact', es: 'Consultas de contacto' },
            STYLING: { en: 'Styling Configuration', de: 'Design-Konfiguration', fr: 'Configuration du style', es: 'Configuración de estilo' },
            BTN_SAVE: { en: 'Save', de: 'Speichern', fr: 'Enregistrer', es: 'Guardar' },
            BTN_CREATE: { en: 'Create', de: 'Erstellen', fr: 'Créer', es: 'Crear' },
            BTN_CANCEL: { en: 'Cancel', de: 'Abbrechen', fr: 'Annuler', es: 'Cancelar' },
            BTN_DELETE: { en: 'Delete', de: 'Löschen', fr: 'Supprimer', es: 'Eliminar' },
            BTN_EDIT: { en: 'Edit', de: 'Bearbeiten', fr: 'Éditer', es: 'Editar' },
            BTN_UPDATE: { en: 'Update', de: 'Aktualisieren', fr: 'Mettre à jour', es: 'Actualizar' },
            BTN_REMOVE: { en: 'Remove', de: 'Entfernen', fr: 'Retirer', es: 'Quitar' },
            BTN_ADD: { en: 'Add', de: 'Hinzufügen', fr: 'Ajouter', es: 'Añadir' },
            BTN_CLOSE: { en: 'Close', de: 'Schließen', fr: 'Fermer', es: 'Cerrar' },
            BTN_BACK: { en: 'Back', de: 'Zurück', fr: 'Retour', es: 'Atrás' },
            BTN_NEXT: { en: 'Next', de: 'Weiter', fr: 'Suivant', es: 'Siguiente' },
            BTN_PREV: { en: 'Previous', de: 'Zurück', fr: 'Précédent', es: 'Anterior' },
            BTN_VIEW: { en: 'View', de: 'Ansehen', fr: 'Voir', es: 'Ver' },
            BTN_PUBLISH: { en: 'Publish', de: 'Veröffentlichen', fr: 'Publier', es: 'Publicar' },
            BTN_UNPUBLISH: { en: 'Unpublish', de: 'Veröffentlichung aufheben', fr: 'Dépublier', es: 'Despublicar' },
            LBL_SEARCH: { en: 'Search', de: 'Suche', fr: 'Recherche', es: 'Buscar' },
            LBL_FILTER: { en: 'Filter', de: 'Filtern', fr: 'Filtrer', es: 'Filtrar' },
            LBL_SORT: { en: 'Sort', de: 'Sortieren', fr: 'Trier', es: 'Ordenar' },
            LBL_CONFIRM: { en: 'Confirm', de: 'Bestätigen', fr: 'Confirmer', es: 'Confirmar' },
            LBL_YES: { en: 'Yes', de: 'Ja', fr: 'Oui', es: 'Sí' },
            LBL_NO: { en: 'No', de: 'Nein', fr: 'Non', es: 'No' },
            LBL_LOADING: { en: 'Loading...', de: 'Lädt...', fr: 'Chargement...', es: 'Cargando...' },
            LBL_SAVING: { en: 'Saving...', de: 'Speichert...', fr: 'Enregistrement...', es: 'Guardando...' },
            LBL_ERROR: { en: 'Error', de: 'Fehler', fr: 'Erreur', es: 'Error' },
            LBL_SUCCESS: { en: 'Success', de: 'Erfolg', fr: 'Succès', es: 'Éxito' },
            LBL_NAME: { en: 'Name', de: 'Name', fr: 'Nom', es: 'Nombre' },
            LBL_DESCRIPTION: { en: 'Description', de: 'Beschreibung', fr: 'Description', es: 'Descripción' },
            LBL_DATE: { en: 'Date', de: 'Datum', fr: 'Date', es: 'Fecha' },
            LBL_ACTIONS: { en: 'Actions', de: 'Aktionen', fr: 'Actions', es: 'Acciones' },

            // Navigation Manager - Header Configuration
            NAV_HEADER_CONFIG: { en: 'Header Configuration', de: 'Kopfzeilen-Konfiguration', fr: 'Configuration de l\'en-tête', es: 'Configuración de encabezado' },
            NAV_MENU_PLACEMENT: { en: 'Menu Placement', de: 'Menü-Platzierung', fr: 'Placement du menu', es: 'Posición del menú' },
            NAV_RIGHT_OF_PAGE: { en: 'Right of Page', de: 'Rechts auf der Seite', fr: 'Droite de la page', es: 'Derecha de la página' },
            NAV_NEAR_LOGO: { en: 'Near Logo', de: 'Neben dem Logo', fr: 'Près du logo', es: 'Cerca del logo' },
            NAV_NEXT_LINE: { en: 'Next Line', de: 'Nächste Zeile', fr: 'Ligne suivante', es: 'Línea suivante' },
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
        })
    },
    {
        Title: 'TRANSLATION_SOURCES',
        ConfigData: JSON.stringify([
            'TopNavigation',
            'SmartPages',
            'News',
            'Events',
            'Documents',
            'Containers',
            'GlobalSettings',
            'ContactQueries',
            'TranslationDictionary',
            'Images'
        ])
    }
];

// Seed Data for TranslationDictionary
export const SEED_TRANSLATIONS = [
    { Title: 'APP_TITLE', SourceList: 'General', EN: 'Web Studio', DE: 'Web Studio', FR: 'Web Studio', ES: 'Web Studio' },
    { Title: 'APP_SUBTITLE', SourceList: 'General', EN: 'Enterprise CMS', DE: 'Unternehmens-CMS', FR: 'CMS d\'entreprise', ES: 'CMS empresarial' },
    { Title: 'SITE_GLOBALS', SourceList: 'General', EN: 'Site Globals', DE: 'Globale Einstellungen', FR: 'Paramètres globaux', ES: 'Configuración global' },
    { Title: 'PAGES', EN: 'Pages', DE: 'Seiten', FR: 'Pages', ES: 'Páginas' },
    { Title: 'SECTION_PAGE_INFO', EN: 'Page Info', DE: 'Seiteninfo', FR: 'Info page', ES: 'Info página' },
    { Title: 'LABEL_TITLE', EN: 'Title', DE: 'Titel', FR: 'Titre', ES: 'Título' },
    { Title: 'LABEL_STATUS', EN: 'Status', DE: 'Status', FR: 'Statut', ES: 'Estado' },
    { Title: 'LABEL_MODIFIED', EN: 'Modified', DE: 'Geändert', FR: 'Modifié', ES: 'Modificado' },
    { Title: 'PAGE_PREVIEW', EN: 'Page Preview', DE: 'Seitenvorschau', FR: 'Aperçu de la page', ES: 'Vista previa' },
    { Title: 'EDIT_MODE', EN: 'Edit Mode', DE: 'Bearbeitungsmodus', FR: 'Mode édition', ES: 'Modo edición' },
    { Title: 'NAV_MGMT', EN: 'Navigation Management', DE: 'Navigationsverwaltung', FR: 'Gestion de navigation', ES: 'Gestión de navegación' },
    { Title: 'NEWS_MGMT', EN: 'News Management', DE: 'Nachrichtenverwaltung', FR: 'Gestion des actualités', ES: 'Gestión de noticias' },
    { Title: 'EVENT_MGMT', EN: 'Event Management', DE: 'Veranstaltungsverwaltung', FR: 'Gestion des événements', ES: 'Gestión de eventos' },
    { Title: 'DOC_MGMT', EN: 'Document Management', DE: 'Dokumentenverwaltung', FR: 'Gestion documentaire', ES: 'Gestión de documentos' },
    { Title: 'FOOTER_MGMT', EN: 'Footer Management', DE: 'Fußzeilenverwaltung', FR: 'Gestion de pied de page', ES: 'Gestión de pie de página' },
    { Title: 'SITE_MGMT', EN: 'Site Management', DE: 'Seitenverwaltung', FR: 'Gestion du site', ES: 'Gestión del sitio' },
    { Title: 'IMG_MGMT', EN: 'Image Management', DE: 'Bildverwaltung', FR: 'Gestion des images', ES: 'Gestión de imágenes' },
    { Title: 'CONTENT_TRANS', EN: 'Content Translator', DE: 'Inhaltsübersetzer', FR: 'Traducteur de contenu', ES: 'Traductor de contenu' },
    { Title: 'PERM_MGMT', EN: 'Permission Management', DE: 'Berechtigungsverwaltung', FR: 'Gestion des permissions', ES: 'Gestión de permisos' },
    { Title: 'CONTACT_Q', EN: 'Contact Form Queries', DE: 'Kontaktanfragen', FR: 'Demandes de contact', ES: 'Consultas de contacto' },
    { Title: 'STYLING', EN: 'Styling Configuration', DE: 'Design-Konfiguration', FR: 'Configuration du style', ES: 'Configuración de estilo' },
    { Title: 'BTN_SAVE', EN: 'Save', DE: 'Speichern', FR: 'Enregistrer', ES: 'Guardar' },
    { Title: 'BTN_CREATE', EN: 'Create', DE: 'Erstellen', FR: 'Créer', ES: 'Crear' },
    { Title: 'BTN_CANCEL', EN: 'Cancel', DE: 'Abbrechen', FR: 'Annuler', ES: 'Cancelar' },
    { Title: 'BTN_DELETE', EN: 'Delete', DE: 'Löschen', FR: 'Supprimer', ES: 'Eliminar' },
    { Title: 'BTN_EDIT', EN: 'Edit', DE: 'Bearbeiten', FR: 'Éditer', ES: 'Editar' },
    { Title: 'BTN_UPDATE', EN: 'Update', DE: 'Aktualisieren', FR: 'Mettre à jour', ES: 'Actualizar' },
    { Title: 'BTN_REMOVE', EN: 'Remove', DE: 'Entfernen', FR: 'Retirer', ES: 'Quitar' },
    { Title: 'BTN_ADD', EN: 'Add', DE: 'Hinzufügen', FR: 'Ajouter', ES: 'Añadir' },
    { Title: 'BTN_CLOSE', EN: 'Close', DE: 'Schließen', FR: 'Fermer', ES: 'Cerrar' },
    { Title: 'BTN_BACK', EN: 'Back', DE: 'Zurück', FR: 'Retour', ES: 'Atrás' },
    { Title: 'BTN_NEXT', EN: 'Next', DE: 'Weiter', FR: 'Suivant', ES: 'Siguiente' },
    { Title: 'BTN_PREV', EN: 'Previous', DE: 'Zurück', FR: 'Précédent', ES: 'Anterior' },
    { Title: 'BTN_VIEW', EN: 'View', DE: 'Ansehen', FR: 'Voir', ES: 'Ver' },
    { Title: 'BTN_PUBLISH', EN: 'Publish', DE: 'Veröffentlichen', FR: 'Publier', ES: 'Publicar' },
    { Title: 'BTN_UNPUBLISH', EN: 'Unpublish', DE: 'Veröffentlichung aufheben', FR: 'Dépublier', ES: 'Despublicar' },
    { Title: 'LBL_SEARCH', EN: 'Search', DE: 'Suche', FR: 'Recherche', ES: 'Buscar' },
    { Title: 'LBL_FILTER', EN: 'Filter', DE: 'Filtern', FR: 'Filtrer', ES: 'Filtrar' },
    { Title: 'LBL_SORT', EN: 'Sort', DE: 'Sortieren', FR: 'Trier', ES: 'Ordenar' },
    { Title: 'LBL_CONFIRM', EN: 'Confirm', DE: 'Bestätigen', FR: 'Confirmer', ES: 'Confirmar' },
    { Title: 'LBL_YES', EN: 'Yes', DE: 'Ja', FR: 'Oui', ES: 'Sí' },
    { Title: 'LBL_NO', EN: 'No', DE: 'Nein', FR: 'Non', ES: 'No' },
    { Title: 'LBL_LOADING', EN: 'Loading...', DE: 'Lädt...', FR: 'Chargement...', ES: 'Cargando...' },
    { Title: 'LBL_SAVING', EN: 'Saving...', DE: 'Speichert...', FR: 'Enregistrement...', ES: 'Guardando...' },
    { Title: 'LBL_ERROR', EN: 'Error', DE: 'Fehler', FR: 'Erreur', ES: 'Error' },
    { Title: 'LBL_SUCCESS', EN: 'Success', DE: 'Erfolg', FR: 'Succès', ES: 'Éxito' },
    { Title: 'LBL_NAME', EN: 'Name', DE: 'Name', FR: 'Nom', ES: 'Nombre' },
    { Title: 'LBL_DESCRIPTION', EN: 'Description', DE: 'Beschreibung', FR: 'Description', ES: 'Descripción' },
    { Title: 'LBL_DATE', EN: 'Date', DE: 'Datum', FR: 'Date', ES: 'Fecha' },
    { Title: 'LBL_ACTIONS', EN: 'Actions', DE: 'Aktionen', FR: 'Actions', ES: 'Acciones' },
    { Title: 'TITLE_EDIT_TRANSLATION', EN: 'Edit Translation', DE: 'Übersetzung bearbeiten', FR: 'Modifier la traduction', ES: 'Editar traducción' },
    { Title: 'LABEL_ORIGINAL_EN', EN: 'Original (English)', DE: 'Original (Englisch)', FR: 'Original (Anglais)', ES: 'Original (Inglés)' },
    { Title: 'LABEL_TRANSLATION_TARGET', EN: 'Translation', DE: 'Übersetzung', FR: 'Traduction', ES: 'Traducción' },
    { Title: 'BTN_SUGGESTION_AI', EN: 'Suggestion with AI', DE: 'Vorschlag mit KI', FR: 'Suggestion avec l\'IA', ES: 'Sugerencia con IA' },
    { Title: 'LABEL_TRANSLATED_TITLE_FIELD', EN: 'Translated Title', DE: 'Übersetzter Titel', FR: 'Titre traduit', ES: 'Título traducido' },
    { Title: 'BTN_DISCARD', EN: 'Discard', DE: 'Verwerfen', FR: 'Abandonner', ES: 'Descartar' },
    { Title: 'LBL_SELECT_LIST', EN: 'Select List', DE: 'Liste auswählen', FR: 'Sélectionner la liste', ES: 'Seleccionar lista' },
    { Title: 'LBL_SOURCE_TEXT', EN: 'Source Text', DE: 'Quelltext', FR: 'Texte source', ES: 'Texto de origen' },
    { Title: 'BTN_AUTO_TRANSLATE_ALL', EN: 'Auto-translate All', DE: 'Alle automatisch übersetzen', FR: 'Tout traduire automatiquement', ES: 'Traducir todo automáticamente' },
    { Title: 'MSG_NO_ITEMS_FOUND', EN: 'No items found for the selected criteria.', DE: 'Keine Elemente für die ausgewählten Kriterien gefunden.', FR: 'Aucun élément trouvé pour les critères sélectionnés.', ES: 'No se encontraron elementos para los criterios seleccionados.' },

    // Missing Add Buttons
    { Title: 'BTN_ADD_NEWS', EN: 'Add News', DE: 'Nachricht hinzufügen', FR: 'Ajouter une actualité', ES: 'Agregar noticia' },
    { Title: 'BTN_ADD_DOCUMENT', EN: 'Add Document', DE: 'Dokument hinzufügen', FR: 'Ajouter un document', ES: 'Agregar documento' },
    { Title: 'BTN_ADD_PAGE', EN: 'Add Page', DE: 'Seite hinzufügen', FR: 'Ajouter une page', ES: 'Agregar página' },
    { Title: 'BTN_ADD_IMAGE', EN: 'Add Image', DE: 'Bild hinzufügen', FR: 'Ajouter une image', ES: 'Agregar image' },
    { Title: 'BTN_ADD_GROUP', EN: 'Create Group', DE: 'Gruppe erstellen', FR: 'Créer un groupe', ES: 'Crear grupo' },

    // Missing Search Labels
    { Title: 'LABEL_SEARCH_NEWS', EN: 'Search news...', DE: 'Nachrichten suchen...', FR: 'Rechercher des actualités...', ES: 'Buscar noticias...' },
    { Title: 'LABEL_SEARCH_DOCS', EN: 'Search documents...', DE: 'Dokumente suchen...', FR: 'Rechercher des documents...', ES: 'Buscar documentos...' },
    { Title: 'LABEL_SEARCH_IMAGES', EN: 'Search images...', DE: 'Bilder suchen...', FR: 'Rechercher des images...', ES: 'Buscar imágenes...' },
    { Title: 'LABEL_SEARCH_PAGES', EN: 'Search pages...', DE: 'Seiten suchen...', FR: 'Rechercher des pages...', ES: 'Buscar páginas...' },
    { Title: 'LABEL_SEARCH_USERS', EN: 'Search users...', DE: 'Benutzer suchen...', FR: 'Rechercher des utilisateurs...', ES: 'Buscar usuarios...' },

    // Missing Modals Titles
    { Title: 'MODAL_CREATE_NEWS', EN: 'Create News', DE: 'Nachricht erstellen', FR: 'Créer une actualité', ES: 'Crear noticia' },
    { Title: 'MODAL_EDIT_NEWS', EN: 'Edit News', DE: 'Nachricht bearbeiten', FR: 'Modifier l\'actualité', ES: 'Editar noticia' },
    { Title: 'MODAL_CREATE_DOC', EN: 'Upload Document', DE: 'Dokument hochladen', FR: 'Télécharger un document', ES: 'Subir documento' },
    { Title: 'MODAL_EDIT_DOC', EN: 'Edit Document', DE: 'Dokument bearbeiten', FR: 'Modifier le document', ES: 'Editar documento' },
    { Title: 'MODAL_CREATE_PAGE', EN: 'Create Page', DE: 'Seite erstellen', FR: 'Créer une page', ES: 'Crear página' },

    // Common Fields
    { Title: 'LABEL_AUTHOR', EN: 'Author', DE: 'Autor', FR: 'Auteur', ES: 'Autor' },
    { Title: 'LABEL_PUBLISH_DATE', EN: 'Publish Date', DE: 'Veröffentlichungsdatum', FR: 'Date de publication', ES: 'Fecha de publicación' },
    { Title: 'LABEL_FILE_TYPE', EN: 'File Type', DE: 'Dateityp', FR: 'Type de fichier', ES: 'Tipo de archivo' },

    // Document Manager
    { Title: 'TITLE_ADD_DOC', EN: 'Add New Document', DE: 'Neues Dokument hinzufügen', FR: 'Ajouter un nouveau document', ES: 'Agregar nuevo documento' },
    { Title: 'TAB_DRAG_DROP', EN: 'DRAG & DROP', DE: 'DRAG & DROP', FR: 'GLISSER-DÉPOSER', ES: 'ARRASTRAR Y SOLTAR' },
    { Title: 'TAB_LINK', EN: 'LINK', DE: 'LINK', FR: 'LIEN', ES: 'ENLACE' },
    { Title: 'LABEL_ITEM_RANK', EN: 'Item Rank', DE: 'Element-Rang', FR: 'Rang de l\'élément', ES: 'Rango del elemento' },
    { Title: 'BTN_CHOOSE_FILE', EN: 'Choose file', DE: 'Datei auswählen', FR: 'Choisir un fichier', ES: 'Elegir archivo' },
    { Title: 'MSG_NO_FILE_CHOSEN', EN: 'No file chosen', DE: 'Keine Datei ausgewählt', FR: 'Aucun fichier choisi', ES: 'Ningún archivo seleccionado' },
    { Title: 'LABEL_DOC_NAME', EN: 'Document Name', DE: 'Dokumentname', FR: 'Nom du document', ES: 'Nombre del documento' },
    { Title: 'PLACEHOLDER_RENAME_DOC', EN: 'Rename The Document', DE: 'Das Dokument umbenennen', FR: 'Renommer le document', ES: 'Renombrar el documento' },
    { Title: 'MSG_DROP_FILE', EN: 'Drop file to upload', DE: 'Datei zum Hochladen ablegen', FR: 'Déposez le fichier pour télécharger', ES: 'Suelte el archivo para subir' },
    { Title: 'MSG_DRAG_DROP', EN: 'Drag & Drop files here', DE: 'Dateien hierher ziehen', FR: 'Glissez et déposez des fichiers ici', ES: 'Arrastre y suelte archivos aquí' },
    { Title: 'MSG_SUPPORTED_FILES', EN: 'Supported: PDF, Word, Excel, PPT', DE: 'Unterstützt: PDF, Word, Excel, PPT', FR: 'Pris en charge : PDF, Word, Excel, PPT', ES: 'Soportado: PDF, Word, Excel, PPT' },
    { Title: 'LABEL_EXTERNAL_URL', EN: 'External URL', DE: 'Externe URL', FR: 'URL externe', ES: 'URL externa' },
    { Title: 'LABEL_LINK_NAME', EN: 'Link Name', DE: 'Link-Name', FR: 'Nom du lien', ES: 'Nombre del enlace' },
    { Title: 'PLACEHOLDER_DISPLAY_NAME', EN: 'Display Name', DE: 'Anzeigename', FR: 'Nom d\'affichage', ES: 'Nombre para mostrar' },
    { Title: 'BTN_UPLOAD', EN: 'Upload', DE: 'Hochladen', FR: 'Télécharger', ES: 'Subir' },
    { Title: 'TITLE_EDIT_DOC', EN: 'Edit Document Metadata', DE: 'Dokument-Metadaten bearbeiten', FR: 'Modifier les métadonnées du document', ES: 'Editar metadatos del documento' },
    { Title: 'LABEL_FILE_NAME', EN: 'Name (File Name)', DE: 'Name (Dateiname)', FR: 'Nom (Nom de fichier)', ES: 'Nombre (Nombre de archivo)' },
    { Title: 'MSG_RENAME_WARNING', EN: '⚠️ Changing this will rename the file', DE: '⚠️ Das Ändern dieses Namens benennt die Datei um', FR: '⚠️ Modifier ceci renommera le fichier', ES: '⚠️ Cambiar esto renombrará el archivo' },
    { Title: 'LABEL_YEAR', EN: 'Year', DE: 'Jahr', FR: 'Année', ES: 'Año' },
    { Title: 'LABEL_SORT_ORDER', EN: 'Sort Order', DE: 'Sortierreihenfolge', FR: 'Ordre de tri', ES: 'Orden de clasificación' },
    { Title: 'PLACEHOLDER_DESC', EN: 'Write Description', DE: 'Beschreibung schreiben', FR: 'Écrire une description', ES: 'Escribir descripción' },
    { Title: 'LABEL_CHARS', EN: 'CHARS', DE: 'ZEICHEN', FR: 'CHARS', ES: 'CHARS' },
    { Title: 'LABEL_WORDS', EN: 'WORDS', DE: 'WÖRTER', FR: 'MOTS', ES: 'PALABRAS' },
    { Title: 'DESC_DOC_MGMT', EN: 'Create, edit, and manage all your documents.', DE: 'Erstellen, bearbeiten und verwalten Sie alle Ihre Dokumente.', FR: 'Créez, modifiez et gérez tous vos documents.', ES: 'Cree, edite y gestione todos sus documentos.' },
    { Title: 'BTN_FILTERS', EN: 'Filters', DE: 'Filter', FR: 'Filtres', ES: 'Filtros' },
    { Title: 'LABEL_DOC_TYPES', EN: 'Document Types', DE: 'Dokumenttypen', FR: 'Types de documents', ES: 'Tipos de documentos' },
    { Title: 'BTN_CLEAR_FILTERS', EN: 'Clear Filters', DE: 'Filter löschen', FR: 'Effacer les filtres', ES: 'Borrar filtros' },
    { Title: 'TITLE_DELETE_DOC', EN: 'Delete Document', DE: 'Dokument löschen', FR: 'Supprimer le document', ES: 'Eliminar documento' },
    { Title: 'MSG_CONFIRM_DELETE_DOC', EN: 'Are you sure you want to delete this document? This action cannot be undone.', DE: 'Möchten Sie dieses Dokument wirklich löschen? Dies kann nicht rückgängig gemacht werden.', FR: 'Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.', ES: '¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.' },
    { Title: 'LABEL_TYPE_PRESENTATIONS', EN: 'Presentations', DE: 'Präsentationen', FR: 'Présentations', ES: 'Presentaciones' },
    { Title: 'LABEL_TYPE_OTHERS', EN: 'Others', DE: 'Andere', FR: 'Autres', ES: 'Otros' },
    { Title: 'LABEL_TYPE_LINK', EN: 'Link', DE: 'Link', FR: 'Lien', ES: 'Enlace' },
    { Title: 'LABEL_RANK_CRITICAL', EN: 'Critical Item', DE: 'Kritisches Element', FR: 'Élément critique', ES: 'Elemento crítico' },
    { Title: 'LABEL_RANK_RELEVANT', EN: 'Relevant Item', DE: 'Relevantes Element', FR: 'Élément pertinent', ES: 'Elemento relevante' },
    { Title: 'LABEL_RANK_STANDARD', EN: 'Standard Item', DE: 'Standardelement', FR: 'Élément standard', ES: 'Elemento estándar' },
    { Title: 'PLACEHOLDER_TRANSLATED_TITLE', EN: 'Enter translated title...', DE: 'Übersetzten Titel eingeben...', FR: 'Entrez le titre traduit...', ES: 'Ingrese el título traducido...' },
    { Title: 'PLACEHOLDER_TRANSLATED_READ_MORE', EN: 'Enter translated read more text...', DE: 'Übersetzten Weiterlesen-Text eingeben...', FR: 'Entrez le texte "Lire la suite" traduit...', ES: 'Ingrese el texto "Leer más" traducido...' },
    { Title: 'PLACEHOLDER_TRANSLATED_DESC', EN: 'Enter translated description...', DE: 'Übersetzte Beschreibung eingeben...', FR: 'Entrez la description traduite...', ES: 'Ingrese la descripción traducida...' },

    // News Manager
    { Title: 'TITLE_CREATE_NEWS', EN: 'Create News', DE: 'Nachrichten erstellen', FR: 'Créer des nouvelles', ES: 'Crear noticias' },
    { Title: 'MSG_REQ_TITLE', EN: 'Please enter a Title to continue.', DE: 'Bitte geben Sie einen Titel ein, um fortzufahren.', FR: 'Veuillez saisir un titre pour continuer.', ES: 'Ingrese un título para continuar.' },
    { Title: 'PLACEHOLDER_NEWS_TITLE', EN: 'Enter a News Title', DE: 'Geben Sie einen Nachrichtentitel ein', FR: 'Entrez un titre de nouvelle', ES: 'Ingrese un título de noticia' },
    { Title: 'TAB_BASIC_INFO_NEWS', EN: 'Basic Info', DE: 'Basisinfo', FR: 'Info de base', ES: 'Info básica' },
    { Title: 'TAB_IMAGE', EN: 'Image', DE: 'Bild', FR: 'Image', ES: 'Imagen' },
    { Title: 'TAB_TRANSLATION_NEWS', EN: 'Translation', DE: 'Übersetzung', FR: 'Traduction', ES: 'Traducción' },
    { Title: 'TITLE_EDIT_NEWS', EN: 'Edit News', DE: 'Nachrichten bearbeiten', FR: 'Modifier les nouvelles', ES: 'Editar noticias' },
    { Title: 'TAB_COPY_PASTE', EN: 'COPY & PASTE', DE: 'KOPIEREN & EINFÜGEN', FR: 'COPIER & COLLER', ES: 'COPIAR Y PEGAR' },
    { Title: 'TAB_UPLOAD_UPPER', EN: 'UPLOAD', DE: 'HOCHLADEN', FR: 'TÉLÉCHARGER', ES: 'SUBIR' },
    { Title: 'TAB_CHOOSE_EXISTING', EN: 'CHOOSE FROM EXISTING', DE: 'AUS VORHANDENEN WÄHLEN', FR: 'CHOISIR PARMI LES EXISTANTS', ES: 'ELEGIR DE EXISTENTES' },
    { Title: 'MSG_PASTE_INSTRUCTION', EN: 'Click here & Press Ctrl+V (Cmd+V) to Paste', DE: 'Hier klicken & Strg+V (Cmd+V) drücken zum Einfügen', FR: 'Cliquez ici et appuyez sur Ctrl+V (Cmd+V) pour coller', ES: 'Haga clic aquí y presione Ctrl+V (Cmd+V) para pegar' },
    { Title: 'MSG_UPLOADING', EN: 'Uploading...', DE: 'Wird hochgeladen...', FR: 'Téléchargement...', ES: 'Subiendo...' },
    { Title: 'PLACEHOLDER_SEARCH_IMAGES', EN: 'Search images...', DE: 'Bilder suchen...', FR: 'Rechercher des images...', ES: 'Buscar imágenes...' },
    { Title: 'LABEL_TRANSLATION', EN: 'Translation', DE: 'Übersetzung', FR: 'Traduction', ES: 'Traducción' },
    { Title: 'MSG_TRANSLATING', EN: 'Translating...', DE: 'Übersetzen...', FR: 'Traduction...', ES: 'Traduciendo...' },
    { Title: 'LABEL_TRANSLATED_TITLE', EN: 'Translated Title', DE: 'Übersetzter Titel', FR: 'Titre traduit', ES: 'Título traducido' },
    { Title: 'LABEL_TRANSLATED_READ_MORE', EN: 'Translated Read More Text', DE: 'Übersetzter Weiterlesen-Text', FR: 'Texte "Lire la suite" traduit', ES: 'Texto "Leer más" traducido' },
    { Title: 'LABEL_TRANSLATED_DESC', EN: 'Translated Description', DE: 'Übersetzte Beschreibung', FR: 'Description traduite', ES: 'Descripción traducida' },
    { Title: 'MSG_NEWS_DESC', EN: 'Create, edit, and manage all your news articles.', DE: 'Erstelle, bearbeite und verwalte alle deine Nachrichtenartikel.', FR: 'Créez, modifiez et gérez tous vos articles d\'actualités.', ES: 'Crea, edita y gestiona todos tus artículos de noticias.' },
    { Title: 'LABEL_VISUAL_VIEW', EN: 'Visual View', DE: 'Visuelle Ansicht', FR: 'Vue visuelle', ES: 'Vista visual' },
    { Title: 'LABEL_LIST_VIEW', EN: 'List View', DE: 'Listenansicht', FR: 'Vue en liste', ES: 'Vista de lista' },
    { Title: 'BTN_CLEAR_SEARCH', EN: 'Clear Search', DE: 'Suche löschen', FR: 'Effacer la recherche', ES: 'Borrar búsqueda' },

    // Slider & Slides
    { Title: 'SLIDER_MGMT', EN: 'Slider Management', DE: 'Slider-Verwaltung', FR: 'Gestion du curseur', ES: 'Gestión del control deslizante' },
    { Title: 'TAB_SLIDES', EN: 'Slides', DE: 'Folien', FR: 'Diapositives', ES: 'Diapositivas' },
    { Title: 'TAB_SETTINGS', EN: 'Settings', DE: 'Einstellungen', FR: 'Paramètres', ES: 'Configuración' },
    { Title: 'LABEL_SLIDE_QUEUE', EN: 'Slide Queue', DE: 'Folienwarteschlange', FR: 'File d\'attente des diapositives', ES: 'Cola de diapositivas' },
    { Title: 'BTN_ADD_SLIDE', EN: 'Add New Slide', DE: 'Neue Folie hinzufügen', FR: 'Ajouter une nouvelle diapositive', ES: 'Agregar nueva diapositiva' },
    { Title: 'MSG_NO_SLIDES', EN: 'No slides added yet.', DE: 'Noch keine Folien hinzugefügt.', FR: 'Aucune diapositive ajoutée.', ES: 'Aún no se han agregado diapositivas.' },
    { Title: 'SECTION_GENERAL_SETTINGS', EN: 'General Settings', DE: 'Allgemeine Einstellungen', FR: 'Paramètres généraux', ES: 'Configuración general' },
    { Title: 'LABEL_SLIDER_TITLE', EN: 'Slider Title', DE: 'Slider-Titel', FR: 'Titre du curseur', ES: 'Título del control deslizante' },
    { Title: 'SECTION_AUTOPLAY', EN: 'Autoplay Settings', DE: 'Autoplay-Einstellungen', FR: 'Paramètres de lecture automatique', ES: 'Configuración de reproducción automática' },
    { Title: 'LABEL_ENABLE_AUTOPLAY', EN: 'Enable Autoplay', DE: 'Autoplay aktivieren', FR: 'Activer la lecture automatique', ES: 'Habilitar reproducción automática' },
    { Title: 'LABEL_SLIDER_SPEED', EN: 'Slider Speed', DE: 'Slider-Geschwindigkeit', FR: 'Vitesse du curseur', ES: 'Velocidad del control deslizante' },
    { Title: 'SECTION_TEXT_OVERLAY', EN: 'Text Overlay Settings', DE: 'Textüberlagerungseinstellungen', FR: 'Paramètres de superposition de texte', ES: 'Configuración de superposición de texto' },
    { Title: 'LABEL_SHOW_TITLE', EN: 'Show Title', DE: 'Titel anzeigen', FR: 'Afficher le titre', ES: 'Mostrar título' },
    { Title: 'LABEL_SHOW_DESC', EN: 'Show Description', DE: 'Beschreibung anzeigen', FR: 'Afficher la description', ES: 'Mostrar descripción' },
    { Title: 'LABEL_OVERLAY_POS', EN: 'Overlay Position', DE: 'Überlagerungsposition', FR: 'Position de superposition', ES: 'Posición de superposición' },
    { Title: 'BTN_DELETE_SLIDER', EN: 'Delete Slider', DE: 'Slider löschen', FR: 'Supprimer le curseur', ES: 'Eliminar control deslizante' },
    { Title: 'BTN_SAVE_CHANGES', EN: 'Save Changes', DE: 'Änderungen speichern', FR: 'Sauvegarder les modifications', ES: 'Guardar cambios' },
    { Title: 'TITLE_EDIT_SLIDE', EN: 'Edit Slide', DE: 'Folie bearbeiten', FR: 'Modifier la diapositive', ES: 'Editar diapositiva' },
    { Title: 'SECTION_SLIDE_IDENTITY', EN: 'Slide Identity', DE: 'Folienidentität', FR: 'Identité de la diapositive', ES: 'Identidad de la diapositiva' },
    { Title: 'LABEL_SLIDE_NAME', EN: 'Slide Name', DE: 'Folienname', FR: 'Nom de la diapositive', ES: 'Nombre de la diapositiva' },
    { Title: 'SECTION_LAYOUT', EN: 'Layout Selection', DE: 'Layout-Auswahl', FR: 'Sélection de mise en page', ES: 'Selección de diseño' },
    { Title: 'SECTION_CONTENT', EN: 'Content & Details', DE: 'Inhalt & Details', FR: 'Contenu et détails', ES: 'Contenido y detalles' },
    { Title: 'LABEL_HEADER_TITLE', EN: 'Header Title', DE: 'Kopftitel', FR: 'Titre de l\'en-tête', ES: 'Título del encabezado' },
    { Title: 'LABEL_SUBTITLE', EN: 'Subtitle', DE: 'Untertitel', FR: 'Sous-titre', ES: 'Subtítulo' },
    { Title: 'LABEL_CTA_BUTTON', EN: 'CTA Button', DE: 'Call-to-Action-Button', FR: 'Bouton CTA', ES: 'Botón CTA' },
    { Title: 'LABEL_CONTENT_TEXT', EN: 'Content Text', DE: 'Inhaltstext', FR: 'Texte du contenu', ES: 'Texto del contenido' },
    { Title: 'LABEL_URL_OPTIONAL', EN: 'URL (Optional)', DE: 'URL (Optional)', FR: 'URL (Facultatif)', ES: 'URL (Opcional)' },
    { Title: 'SECTION_LIVE_PREVIEW', EN: 'Live Preview', DE: 'Live-Vorschau', FR: 'Aperçu en direct', ES: 'Vista previa en vivo' },
    { Title: 'MSG_CONFIRM_DELETE_SLIDE', EN: 'Are you sure you want to remove this slide? This action cannot be undone.', DE: 'Möchten Sie diese Folie wirklich entfernen? Dies kann nicht rückgängig gemacht werden.', FR: 'Êtes-vous sûr de vouloir supprimer cette diapositive ? Cette action est irréversible.', ES: '¿Está seguro de que desea eliminar esta diapositiva? Esta acción no se puede deshacer.' },
    { Title: 'LABEL_NO_DESCRIPTION', EN: 'No description', DE: 'Keine Beschreibung', FR: 'Pas de description', ES: 'Sin descripción' },

    // Theme Editor
    { Title: 'TITLE_THEME_EDITOR', EN: 'Global Style Editor', DE: 'Globaler Stil-Editor', FR: 'Moteur de style global', ES: 'Motor de estilo global' },
    { Title: 'DESC_THEME_EDITOR', EN: 'Configure CSS variables for document.documentElement.', DE: 'Konfiguriert CSS-Variablen für document.documentElement.', FR: 'Configure les variables CSS document.documentElement.', ES: 'Configura variables CSS de document.documentElement.' },
    { Title: 'TAB_VISUAL_DESIGNER', EN: 'Visual Designer', DE: 'Visueller Designer', FR: 'Concepteur visuel', ES: 'Diseñador visual' },
    { Title: 'TAB_CODE_EXPORT', EN: 'Code Export', DE: 'Code-Export', FR: 'Exportation de code', ES: 'Exportación de código' },
    { Title: 'BTN_RESET_DEFAULTS', EN: 'Reset Defaults', DE: 'Standardwerte zurücksetzen', FR: 'Réinitialiser les valeurs par défaut', ES: 'Restablecer valores predeterminados' },
    { Title: 'TITLE_HOW_IT_WORKS', EN: 'How Global Styling Works', DE: 'Wie globales Styling funktioniert', FR: 'Comment fonctionne le style global', ES: 'Cómo funciona el estilo global' },
    { Title: 'DESC_HOW_IT_WORKS', EN: 'This engine uses CSS variables to instantly control your entire site\'s look.', DE: 'Diese Engine verwendet CSS-Variablen, um das Aussehen Ihrer gesamten Website sofort zu steuern.', FR: 'Ce moteur utilise des variables CSS pour contrôler instantanément l\'apparence de votre site entier.', ES: 'Este motor utiliza variables CSS para controlar la apariencia de todo su sitio al instante.' },
    { Title: 'TITLE_KEY_CONCEPTS', EN: 'Key Concepts', DE: 'Schlüsselkonzepte', FR: 'Concepts clés', ES: 'Conceptos clave' },
    { Title: 'DESC_PERSISTENCE', EN: 'Persistence: Your changes are saved automatically.', DE: 'Persistenz: Ihre Änderungen werden automatisch gespeichert.', FR: 'Persistance : Vos modifications sont enregistrées automatiquement.', ES: 'Persistencia: Sus cambios se guardan automáticamente.' },
    { Title: 'DESC_LIVE_PREVIEW', EN: 'Live Preview: The panel updates in real-time.', DE: 'Live-Vorschau: Das Panel wird in Echtzeit aktualisiert.', FR: 'Aperçu en direct : Le panneau se met à jour en temps réel.', ES: 'Vista previa en vivo: El panel se actualiza en tiempo real.' },
    { Title: 'DESC_SPFX_EXPORT', EN: 'SPFx Export: Generate TypeScript code for SharePoint.', DE: 'SPFx-Export: Generieren Sie TypeScript-Code für SharePoint.', FR: 'Exportation SPFx : Générez du code TypeScript pour SharePoint.', ES: 'Exportación SPFx: Genere código TypeScript para SharePoint.' },
    { Title: 'TITLE_AI_THEME', EN: 'AI Theme Generation', DE: 'KI-Theme-Generierung', FR: 'Génération de thème IA', ES: 'Generación de temas con IA' },
    { Title: 'PLACEHOLDER_AI_PROMPT', EN: 'Describe your mood (e.g. \'Cyberpunk Dark Mode\')', DE: 'Beschreiben Sie Ihre Stimmung (z. B. \'Cyberpunk Dark Mode\')', FR: 'Décrivez votre humeur (par ex. \'Mode sombre Cyberpunk\')', ES: 'Describa su estado de ánimo (ej. \'Modo oscuro cyberpunk\')' },
    { Title: 'BTN_DREAMING', EN: 'Dreaming...', DE: 'Träumen...', FR: 'Rêver...', ES: 'Soñando...' },
    { Title: 'BTN_GENERATE', EN: 'Generate', DE: 'Generieren', FR: 'Générer', ES: 'Generar' },
    { Title: 'MSG_CHANGES_APPLIED', EN: 'Changes are applied immediately to :root', DE: 'Änderungen werden sofort auf :root angewendet', FR: 'Les modifications sont appliquées immédiatement à :root', ES: 'Los cambios se aplican inmediatamente a :root' },
    { Title: 'BTN_SAVE_CONFIG', EN: 'Save Configuration', DE: 'Konfiguration speichern', FR: 'Enregistrer la configuration', ES: 'Guardar配置' },

    // Event Modal
    { Title: 'MODAL_CREATE_EVENT', EN: 'Create Event', DE: 'Veranstaltung erstellen', FR: 'Créer un événement', ES: 'Crear evento' },
    { Title: 'MODAL_EDIT_EVENT', EN: 'Edit Event', DE: 'Veranstaltung bearbeiten', FR: 'Modifier l\'événement', ES: 'Editar evento' },
    { Title: 'PH_ENTER_TITLE', EN: 'Enter an Event Title', DE: 'Veranstaltungstitel eingeben', FR: 'Entrez un titre d\'événement', ES: 'Ingrese un título de evento' },
    { Title: 'MSG_ERR_ENTER_TITLE', EN: 'Please enter a Title to continue.', DE: 'Bitte geben Sie einen Titel ein, um fortzufahren.', FR: 'Veuillez entrer un titre pour continuer.', ES: 'Por favor, ingrese un título para continuar.' },
    { Title: 'MSG_NO_DESC', EN: 'No description provided.', DE: 'Keine Beschreibung angegeben.', FR: 'Aucune description fournie.', ES: 'No se proporcionó descripción.' },

    // Event Editor Tabs
    { Title: 'TAB_BASIC_INFO', EN: 'BASIC INFORMATION', DE: 'GRUNDINFORMATIONEN', FR: 'INFORMATIONS DE BASE', ES: 'INFORMACIÓN BÁSICA' },
    { Title: 'TAB_IMAGE_INFO', EN: 'IMAGE INFORMATION', DE: 'BILDINFORMATIONEN', FR: 'INFORMATIONS SUR L\'IMAGE', ES: 'INFORMACIÓN DE IMAGEN' },
    { Title: 'TAB_SEO', EN: 'SEO', DE: 'SEO', FR: 'SEO', ES: 'SEO' },
    { Title: 'TAB_TRANSLATION', EN: 'TRANSLATION', DE: 'ÜBERSETZUNG', FR: 'TRADUCTION', ES: 'TRADUCCIÓN' },

    // Event Fields
    { Title: 'LABEL_START_DATE', EN: 'Start Date', DE: 'Startdatum', FR: 'Date de début', ES: 'Fecha de inicio' },
    { Title: 'LABEL_END_DATE', EN: 'End Date', DE: 'Enddatum', FR: 'Date de fin', ES: 'Fecha de finalización' },
    { Title: 'LABEL_CATEGORY', EN: 'Category', DE: 'Kategorie', FR: 'Catégorie', ES: 'Categoría' },
    { Title: 'LABEL_ORIGINAL', EN: 'Original', DE: 'Original', FR: 'Original', ES: 'Original' },
    { Title: 'LABEL_TRANSLATION_STATE', EN: 'Translation', DE: 'Übersetzung', FR: 'Traduction', ES: 'Traducción' },
    { Title: 'LABEL_ORIGINAL_DESC', EN: 'Original Language Description', DE: 'Originalsprachliche Beschreibung', FR: 'Description en langue originale', ES: 'Descripción en idioma original' },
    { Title: 'LABEL_LOCATION', EN: 'Location', DE: 'Standort', FR: 'Lieu', ES: 'Ubicación' },
    { Title: 'LABEL_ADD_READ_MORE', EN: 'Add Read More Link', DE: 'Link "Mehr lesen" hinzufügen', FR: 'Ajouter un lien "Lire la suite"', ES: 'Agregar enlace "Leer más"' },
    { Title: 'LABEL_DESC', EN: 'Description', DE: 'Beschreibung', FR: 'Description', ES: 'Descripción' },
    { Title: 'LABEL_LINK_URL', EN: 'Link URL', DE: 'Link-URL', FR: 'URL du lien', ES: 'URL del enlace' },
    { Title: 'LABEL_LINK_TEXT', EN: 'Link Text', DE: 'Link-Text', FR: 'Texte du lien', ES: 'Texto del enlace' },
    { Title: 'LABEL_READ_MORE', EN: 'Read More Text', DE: 'Mehr lesen Text', FR: 'Texte Lire plus', ES: 'Texto Leer más' },
    { Title: 'LABEL_IMAGE_URL', EN: 'Image-Url', DE: 'Bild-URL', FR: 'URL de l\'image', ES: 'URL de imagen' },
    { Title: 'LABEL_IMAGE_NAME', EN: 'Image name', DE: 'Bildname', FR: 'Nom de l\'image', ES: 'Nombre de imagen' },
    { Title: 'BTN_CLEAR_IMAGE', EN: 'Clear Image', DE: 'Bild löschen', FR: 'Effacer l\'image', ES: 'Borrar imagen' },

    // Image Tabs
    { Title: 'TAB_IMG_COPY', EN: 'COPY & PASTE', DE: 'KOPIEREN & EINFÜGEN', FR: 'COPIER & COLLER', ES: 'COPIAR Y PEGAR' },
    { Title: 'TAB_IMG_UPLOAD', EN: 'UPLOAD', DE: 'HOCHLADEN', FR: 'TÉLÉCHARGER', ES: 'SUBIR' },
    { Title: 'TAB_IMG_CHOOSE', EN: 'CHOOSE FROM EXISTING', DE: 'AUS VORHANDENEN WÄHLEN', FR: 'CHOISIR PARMI EXISTANTS', ES: 'ELEGIR DE EXISTENTES' },
    { Title: 'MSG_PASTE_HERE', EN: 'Click here & Press Ctrl+V (Cmd+V) to Paste', DE: 'Hier klicken & Strg+V (Cmd+V) drücken zum Einfügen', FR: 'Cliquez ici & Appuyez sur Ctrl+V (Cmd+V) pour coller', ES: 'Haga clic aquí y presione Ctrl+V (Cmd+V) para pegar' },
    { Title: 'BTN_UPLOAD_IMAGE', EN: 'Upload Image', DE: 'Bild hochladen', FR: 'Télécharger une image', ES: 'Subir imagen' },
    { Title: 'PH_SEARCH_IMAGES', EN: 'Search images...', DE: 'Bilder suchen...', FR: 'Rechercher des images...', ES: 'Buscar imágenes...' },
    { Title: 'MSG_NO_IMAGES', EN: 'No images found matching your search.', DE: 'Keine Bilder gefunden.', FR: 'Aucune image trouvée.', ES: 'No se encontraron imágenes.' },

    // SEO Tab
    { Title: 'LABEL_SEO_TITLE', EN: 'SEO Title', DE: 'SEO-Titel', FR: 'Titre SEO', ES: 'Título SEO' },
    { Title: 'LABEL_META_DESC', EN: 'Meta Description', DE: 'Meta-Beschreibung', FR: 'Méta-description', ES: 'Meta descripción' },
    { Title: 'LABEL_KEYWORDS', EN: 'Keywords (comma-separated)', DE: 'Stichworte (kommagetrennt)', FR: 'Mots-clés (séparés par des virgules)', ES: 'Palabras clave (separadas por comas)' },
    { Title: 'BTN_SUGGEST_AI', EN: 'Suggest with AI', DE: 'Mit KI vorschlagen', FR: 'Suggérer avec IA', ES: 'Sugerir con IA' },

    // Translation Tab
    { Title: 'LABEL_TRANS_TITLE', EN: 'Translated Title', DE: 'Übersetzter Titel', FR: 'Titre traduit', ES: 'Título traducido' },
    { Title: 'LABEL_TRANS_CAT', EN: 'Translated Category', DE: 'Übersetzte Kategorie', FR: 'Catégorie traduite', ES: 'Categoría traducida' },
    { Title: 'LABEL_TRANS_LOC', EN: 'Translated Location', DE: 'Übersetzter Standort', FR: 'Lieu traduit', ES: 'Ubicación traducida' },
    { Title: 'LABEL_TRANS_READ_MORE', EN: 'Translated Read More Text', DE: 'Übersetzter Mehr lesen Text', FR: 'Texte Lire plus traduit', ES: 'Texto Leer más traducido' },
    { Title: 'LABEL_TRANS_DESC', EN: 'Translated Description', DE: 'Übersetzte Beschreibung', FR: 'Description traduite', ES: 'Descripción traducida' },

    // Event Manager Main
    { Title: 'TITLE_EVENT_MGMT', EN: 'Event Management', DE: 'Veranstaltungsverwaltung', FR: 'Gestion des événements', ES: 'Gestión de eventos' },
    { Title: 'DESC_EVENT_MGMT', EN: 'Manage corporate events, webinars, and meetings.', DE: 'Verwalten Sie Firmenveranstaltungen, Webinare und Meetings.', FR: 'Gérez les événements d\'entreprise, les webinaires et les réunions.', ES: 'Gestione eventos corporativos, seminarios web y reuniones.' },
    { Title: 'LABEL_SEARCH_EVENTS', EN: 'Search events...', DE: 'Veranstaltungen suchen...', FR: 'Rechercher des événements...', ES: 'Buscar eventos...' },
    { Title: 'LABEL_SORT_BY', EN: 'Sort By', DE: 'Sortieren nach', FR: 'Trier par', ES: 'Ordenar por' },
    { Title: 'BTN_VISUAL_VIEW', EN: 'Visual View', DE: 'Visuelle Ansicht', FR: 'Vue visuelle', ES: 'Vista visual' },
    { Title: 'BTN_LIST_VIEW', EN: 'List View', DE: 'Listenansicht', FR: 'Vue liste', ES: 'Vista de lista' },
    { Title: 'BTN_ADD_EVENT', EN: 'Add New Event', DE: 'Neue Veranstaltung hinzufügen', FR: 'Ajouter un nouvel événement', ES: 'Agregar nuevo evento' },

    // Table Headers
    { Title: 'TH_IMAGE', EN: 'Image', DE: 'Bild', FR: 'Image', ES: 'Imagen' },
    { Title: 'TH_TITLE_DATE', EN: 'Title & Date', DE: 'Titel & Datum', FR: 'Titre & Date', ES: 'Título y Fecha' },
    { Title: 'TH_STATUS', EN: 'Status', DE: 'Status', FR: 'Statut', ES: 'Estado' },
    { Title: 'TH_ACTIONS', EN: 'Actions', DE: 'Aktionen', FR: 'Actions', ES: 'Acciones' },

    // Navigation Manager
    { Title: 'BTN_ADD_NAV_ITEM', EN: 'Add Navigation Item', DE: 'Navigationselement hinzufügen', FR: 'Ajouter un élément de navigation', ES: 'Agregar elemento de navegación' },
    { Title: 'BTN_ADD_NEW', EN: 'Add New', DE: 'Neu hinzufügen', FR: 'Ajouter nouveau', ES: 'Agregar nuevo' },
    { Title: 'BTN_ADD_LEVEL', EN: 'Add Level', DE: 'Ebene hinzufügen', FR: 'Ajouter un niveau', ES: 'Agregar nivel' },
    { Title: 'LABEL_URL_PAGE', EN: 'URL / SmartPage', DE: 'URL / SmartPage', FR: 'URL / SmartPage', ES: 'URL / SmartPage' },

    // Navigation Manager - Header Configuration
    { Title: 'NAV_HEADER_CONFIG', EN: 'Header Configuration', DE: 'Kopfzeilen-Konfiguration', FR: 'Configuration de l\'en-tête', ES: 'Configuración de encabezado' },
    { Title: 'NAV_MENU_PLACEMENT', EN: 'Menu Placement', DE: 'Menü-Platzierung', FR: 'Placement du menu', ES: 'Posición del menú' },
    { Title: 'NAV_RIGHT_OF_PAGE', EN: 'Right of Page', DE: 'Rechts auf der Seite', FR: 'Droite de la page', ES: 'Derecha de la página' },
    { Title: 'NAV_NEAR_LOGO', EN: 'Near Logo', DE: 'Neben dem Logo', FR: 'Près du logo', ES: 'Cerca del logo' },
    { Title: 'NAV_NEXT_LINE', EN: 'Next Line', DE: 'Nächste Zeile', FR: 'Ligne suivante', ES: 'Ligne suivante' },
    { Title: 'NAV_ROW_ALIGNMENT', EN: 'Row Alignment', DE: 'Zeilen-Ausrichtung', FR: 'Alignement de la ligne', ES: 'Alineación de fila' },
    { Title: 'NAV_PAGE_WIDTH', EN: 'Page Width', DE: 'Seitenbreite', FR: 'Largeur de la page', ES: 'Ancho de página' },
    { Title: 'NAV_FULL_WIDTH', EN: 'Full Width', DE: 'Volle Breite', FR: 'Pleine largeur', ES: 'Ancho completo' },
    { Title: 'NAV_STANDARD_BOXED', EN: 'Standard (Boxed)', DE: 'Standard (Gerahmt)', FR: 'Standard (encadré)', ES: 'Estándar (enmarcado)' },
    { Title: 'NAV_BG_COLOR', EN: 'Background Color', DE: 'Hintergrundfarbe', FR: 'Couleur de fond', ES: 'Color de fondo' },
    { Title: 'NAV_LOGO_SETTINGS', EN: 'Logo Settings', DE: 'Logo-Einstellungen', FR: 'Paramètres du logo', ES: 'Configuración del logo' },
    { Title: 'NAV_LOGO_POSITION', EN: 'Position', DE: 'Position', FR: 'Position', ES: 'Posición' },
    { Title: 'BTN_VISUAL_VIEW', EN: 'Visual View', DE: 'Visuelle Ansicht', FR: 'Vue visuelle', ES: 'Vista visual' },
    { Title: 'BTN_LIST_VIEW', EN: 'List View', DE: 'Listenansicht', FR: 'Vue liste', ES: 'Vue liste' },
    { Title: 'TH_ACTIONS', EN: 'Actions', DE: 'Aktionen', FR: 'Actions', ES: 'Acciones' },

    // Site Manager
    { Title: 'LABEL_TOP_NAV', EN: 'Top Navigation', DE: 'Hauptnavigation', FR: 'Navigation principale', ES: 'Navegación principal' },
    { Title: 'LABEL_ORPHAN_PAGES', EN: 'Pages Not in Navigation', DE: 'Seiten nicht in der Navigation', FR: 'Pages non dans la navigation', ES: 'Páginas no en navigation' },
    { Title: 'LABEL_LAYOUT_FOR', EN: 'Layout for:', DE: 'Layout für:', FR: 'Mise en page pour :', ES: 'Diseño para:' },
    { Title: 'LABEL_CREATED', EN: 'Created', DE: 'Erstellt', FR: 'Créé', ES: 'Creado' },
    { Title: 'BTN_HISTORY', EN: 'Version History', DE: 'Versionsverlauf', FR: 'Historique des versions', ES: 'Historial de versiones' },
    { Title: 'BTN_ADD_CONTAINER', EN: 'Add Container', DE: 'Container hinzufügen', FR: 'Ajouter un conteneur', ES: 'Agregar contenedor' },
    { Title: 'MSG_NO_PAGE_SELECTED', EN: 'No page selected', DE: 'Keine Seite ausgewählt', FR: 'Aucune page sélectionnée', ES: 'Ninguna página seleccionada' },
    { Title: 'MSG_NAV_EMPTY', EN: 'Navigation is empty.', DE: 'Navigation ist leer.', FR: 'La navigation est vide.', ES: 'Navegación vacía.' },
    { Title: 'MSG_ALL_PAGES_ASSIGNED', EN: 'All pages assigned.', DE: 'Alle Seiten zugewiesen.', FR: 'Toutes les pages assignées.', ES: 'Todas las páginas asignadas.' },
    { Title: 'LABEL_PUBLIC_URL', EN: 'Public URL', DE: 'Öffentliche URL', FR: 'URL publique', ES: 'URL pública' },
    { Title: 'MSG_NO_CONTAINERS', EN: 'This page has no containers.', DE: 'Diese Seite hat keine Container.', FR: 'Cette page n\'a pas de conteneurs.', ES: 'Esta página no tiene contenedores.' },
    { Title: 'MSG_SELECT_PAGE_EDIT', EN: 'Select a page on the left.', DE: 'Wählen Sie links eine Seite aus.', FR: 'Sélectionnez une page à gauche pour commencer.', ES: 'Seleccione una página a la izquierda para comenzar.' },

    // Contact Query Manager
    { Title: 'TITLE_CONTACT_QUERIES', EN: 'Contact Form Queries', DE: 'Kontaktformular-Anfragen', FR: 'Requêtes de formulaire de contact', ES: 'Consultas de formulario de contacto' },
    { Title: 'TITLE_SUBMISSION_DETAILS', EN: 'Submission Details', DE: 'Einsendedetails', FR: 'Détails de la soumission', ES: 'Detalles de envío' },
    { Title: 'LABEL_SUBMITTED_ON', EN: 'Submitted On', DE: 'Eingereicht am', FR: 'Soumis le', ES: 'Enviado el' },
    { Title: 'LABEL_SOURCE_PAGE', EN: 'Source Page', DE: 'Quellseite', FR: 'Page source', ES: 'Página de origen' },
    { Title: 'LABEL_SENDER_EMAIL', EN: 'Sender Email', DE: 'Absender-E-Mail', FR: 'E-mail de l\'expéditeur', ES: 'Correo del remitente' },
    { Title: 'LABEL_FORM_DATA', EN: 'Form Data', DE: 'Formulardaten', FR: 'Données du formulaire', ES: 'Datos del formulario' },
    { Title: 'LABEL_EMPTY', EN: 'Empty', DE: 'Leer', FR: 'Vide', ES: 'Vacío' },
    { Title: 'BTN_MARK_READ', EN: 'Mark as Read', DE: 'Als gelesen markieren', FR: 'Marquer comme lu', ES: 'Marcar como leído' },
    { Title: 'MSG_SHOWING', EN: 'Showing', DE: 'Zeige', FR: 'Affichage de', ES: 'Mostrando' },
    { Title: 'PLACEHOLDER_SEARCH_CONTACT', EN: 'Search by email, page or content...', DE: 'Suche nach E-Mail, Seite oder Inhalt...', FR: 'Rechercher par e-mail, page ou contenu...', ES: 'Buscar por correo, página o contenido...' },
    { Title: 'BTN_EXPORT', EN: 'Export', DE: 'Exportieren', FR: 'Exporter', ES: 'Exportar' },
    { Title: 'LABEL_ID', EN: 'ID', DE: 'ID', FR: 'ID', ES: 'ID' },
    { Title: 'LABEL_PAGE_NAME', EN: 'Page Name', DE: 'Seitenname', FR: 'Nom de la page', ES: 'Nombre de la página' },
    { Title: 'LABEL_SUBMITTED_BY', EN: 'Submitted By', DE: 'Eingereicht von', FR: 'Soumis par', ES: 'Enviado por' },
    { Title: 'MSG_NO_SUBMISSIONS', EN: 'No submissions found.', DE: 'Keine Einsendungen gefunden.', FR: 'Aucune soumission trouvée.', ES: 'No se encontraron envíos.' },
    { Title: 'BTN_REFRESH', EN: 'Refresh', DE: 'Aktualisieren', FR: 'Rafraîchir', ES: 'Actualizar' },
    { Title: 'BTN_VIEW_DETAILS', EN: 'View Details', DE: 'Details anzeigen', FR: 'Voir les détails', ES: 'Ver detalles' },

    // Image Picker
    { Title: 'TAB_EXISTING_IMAGES', EN: 'Existing Images', DE: 'Vorhandene Bilder', FR: 'Images existantes', ES: 'Imágenes existentes' },
    { Title: 'TAB_IMAGE_URL', EN: 'Image URL', DE: 'Bild-URL', FR: 'URL de l\'image', ES: 'URL de la imagen' },
    { Title: 'TAB_UPLOAD_IMAGE', EN: 'Upload Image', DE: 'Bild hochladen', FR: 'Télécharger une image', ES: 'Subir imagen' },
    { Title: 'BTN_SELECT', EN: 'Select', DE: 'Auswählen', FR: 'Sélectionner', ES: 'Seleccionar' },
    { Title: 'MSG_NO_LIB_IMAGES', EN: 'No images in library', DE: 'Keine Bilder in der Bibliothek', FR: 'Aucune image dans la bibliothèque', ES: 'No hay imágenes en la biblioteca' },
    { Title: 'MSG_CLICK_TO_UPLOAD', EN: 'Click to upload', DE: 'Klicken zum Hochladen', FR: 'Cliquez pour télécharger', ES: 'Haga clic para subir' },

    // Footer Manager
    { Title: 'LBL_LAYOUT_BUILDER', EN: 'Layout Builder', DE: 'Layout-Builder', FR: 'Constructeur de mise en page', ES: 'Constructor de diseño' },
    { Title: 'LBL_FOOTER_CONFIG', EN: 'Footer Configuration', DE: 'Fußzeilen-Konfiguration', FR: 'Configuration du pied de page', ES: 'Configuración del pie de página' },
    { Title: 'LBL_VISUAL', EN: 'Visual', DE: 'Visuell', FR: 'Visuel', ES: 'Visual' },
    { Title: 'LBL_LIST', EN: 'List', DE: 'Liste', FR: 'Liste', ES: 'Lista' },
    { Title: 'LBL_BUILDER', EN: 'Builder', DE: 'Builder', FR: 'Constructeur', ES: 'Constructor' },
    { Title: 'SECTION_MAIN_NAV', EN: 'Main Navigation Section', DE: 'Hauptnavigationsbereich', FR: 'Section de navigation principale', ES: 'Sección de navegación principal' },
    { Title: 'SECTION_CONTACT_INFO', EN: 'Contact Information', DE: 'Kontaktinformationen', FR: 'Informations de contact', ES: 'Información de contacto' },
    { Title: 'SECTION_BOTTOM_BAR', EN: 'Footer Bottom Bar', DE: 'Fußzeilen-Abschlussleiste', FR: 'Barre inférieure du pied de page', ES: 'Barra inferior del pie de página' },
    { Title: 'MSG_SELECT_ELEMENT', EN: 'Select an element to edit properties.', DE: 'Wählen Sie ein Element aus, um die Eigenschaften zu bearbeiten.', FR: 'Sélectionnez un élément pour modifier les propriétés.', ES: 'Seleccione un elemento para editar las propiedades.' },
    { Title: 'MSG_CLICK_ELEMENT', EN: 'Click on any column, link, or section in the layout builder.', DE: 'Klicken Sie auf eine Spalte, einen Link oder einen Abschnitt im Layout-Builder.', FR: 'Cliquez sur n\'importe quelle colonne, lien ou section dans le constructeur de mise en page.', ES: 'Haga clic en cualquier columna, enlace o sección en el constructor de diseño.' },
    { Title: 'TITLE_EDIT_COLUMN', EN: 'Edit Column', DE: 'Spalte bearbeiten', FR: 'Modifier la colonne', ES: 'Editar columna' },
    { Title: 'LBL_COLUMN_HEADING', EN: 'Column Heading', DE: 'Spaltenüberschrift', FR: 'En-tête de colonne', ES: 'Encabezado de columna' },
    { Title: 'BTN_DELETE_COLUMN', EN: 'Delete Column', DE: 'Spalte löschen', FR: 'Supprimer la colonne', ES: 'Eliminar columna' },
    { Title: 'TITLE_EDIT_LINK', EN: 'Edit Link', DE: 'Link bearbeiten', FR: 'Modifier le lien', ES: 'Editar enlace' },
    { Title: 'LBL_LABEL_TEXT', EN: 'Label Text', DE: 'Beschriftungstext', FR: 'Texte de l\'étiquette', ES: 'Texto de la etiqueta' },
    { Title: 'LBL_DESTINATION_URL', EN: 'Destination URL', DE: 'Ziel-URL', FR: 'URL de destination', ES: 'URL de destino' },
    { Title: 'BTN_REMOVE_LINK', EN: 'Remove Link', DE: 'Link entfernen', FR: 'Supprimer le lien', ES: 'Eliminar enlace' },
    { Title: 'TITLE_COPYRIGHT', EN: 'Copyright', DE: 'Urheberrecht', FR: 'Droit d\'auteur', ES: 'Derechos de autor' },
    { Title: 'TITLE_SOCIAL_NETWORKS', EN: 'Social Networks', DE: 'Soziale Netzwerke', FR: 'Réseaux sociaux', ES: 'Redes sociales' },
    { Title: 'BTN_ADD_ITEM', EN: 'Add Item', DE: 'Element hinzufügen', FR: 'Ajouter un élément', ES: 'Agregar elemento' },
    { Title: 'BTN_ADD_COLUMN', EN: 'Add Column', DE: 'Spalte hinzufügen', FR: 'Ajouter une colonne', ES: 'Agregar columna' },
    { Title: 'LBL_SELECT_TEMPLATE', EN: 'Select a template', DE: 'Vorlage auswählen', FR: 'Sélectionner un modèle', ES: 'Seleccionar una plantilla' },
    { Title: 'LBL_TABLE_VIEW', EN: 'Table View', DE: 'Tabellenansicht', FR: 'Vue en tableau', ES: 'Vista de tabla' },
    { Title: 'LBL_CORPORATE_VIEW', EN: 'Corporate View', DE: 'Corporate-Ansicht', FR: 'Vue corporate', ES: 'Vista corporativa' },
    { Title: 'DESC_TABLE_VIEW', EN: 'Organized columns of links.', DE: 'Organisierte Spalten mit Links.', FR: 'Colonnes de liens organisées.', ES: 'Columnas organizadas de enlaces.' },
    { Title: 'DESC_CORPORATE_VIEW', EN: 'Professional layout with contact.', DE: 'Professionelles Layout mit Kontaktinformationen.', FR: 'Mise en page professionnelle avec contact.', ES: 'Diseño profesional con contacto.' },
    { Title: 'LBL_FOOTER_SETTINGS', EN: 'Footer Settings', DE: 'Fußzeilen-Einstellungen', FR: 'Paramètres du pied de page', ES: 'Configuración del pie de página' },
    { Title: 'LBL_BG_COLOR', EN: 'Background Color', DE: 'Hintergrundfarbe', FR: 'Couleur de fond', ES: 'Color de fondo' },
    { Title: 'LBL_COLOR_WHITE', EN: 'White', DE: 'Weiß', FR: 'Blanc', ES: 'Blanco' },
    { Title: 'LBL_COLOR_GREY', EN: 'Light grey', DE: 'Hellgrau', FR: 'Gris clair', ES: 'Gris claro' },
    { Title: 'LBL_COLOR_SITE', EN: 'Site color', DE: 'Seitenfarbe', FR: 'Couleur du site', ES: 'Color del sitio' },
    { Title: 'LBL_COLOR_OTHER', EN: 'Other', DE: 'Andere', FR: 'Autre', ES: 'Otro' },
    { Title: 'LBL_ALIGNMENT', EN: 'Footer Alignment', DE: 'Fußzeilen-Ausrichtung', FR: 'Alignement du pied de page', ES: 'Alineación del pie de página' },
    { Title: 'LBL_SUB_FOOTER_TEXT', EN: 'Sub Footer Text', DE: 'Sub-Fußzeilentext', FR: 'Texte du sous-pied de page', ES: 'Texto del subpié de página' },
    { Title: 'LBL_FONT_SIZE_SETTINGS', EN: 'Font Size Settings', DE: 'Schriftgrößen-Einstellungen', FR: 'Paramètres de taille de police', ES: 'Configuración del tamaño de fuente' },
    { Title: 'LBL_HEADING_SIZE', EN: 'Heading Size', DE: 'Überschriftengröße', FR: 'Taille du titre', ES: 'Tamaño del encabezado' },
    { Title: 'LBL_SUBHEADING_SIZE', EN: 'Subheading Size', DE: 'Unterüberschriftengröße', FR: 'Taille du sous-titre', ES: 'Tamaño del subencabezado' },
    { Title: 'TITLE_LIVE_FOOTER_PREVIEW', EN: 'Live Footer Preview', DE: 'Live-Fußzeilen-Vorschau', FR: 'Aperçu en direct du pied de page', ES: 'Vista previa en vivo del pie de página' },
    { Title: 'MSG_DELETE_COL_CONFIRM', EN: 'Delete this column?', DE: 'Diese Spalte löschen?', FR: 'Supprimer cette colonne ?', ES: '¿Eliminar esta columna?' },
    { Title: 'MSG_NO_LINKS', EN: 'No links yet.', DE: 'Noch keine Links.', FR: 'Aucun lien pour le moment.', ES: 'No hay enlaces aún.' },
    { Title: 'LBL_INSIDE', EN: 'Inside', DE: 'Innerhalb', FR: 'À l\'intérieur de', ES: 'Dentro de' },
    { Title: 'MSG_CORP_ONLY', EN: 'Corporate Template Only', DE: 'Nur Corporate-Vorlage', FR: 'Modèle Corporate uniquement', ES: 'Solo plantilla corporativa' },
    { Title: 'LABEL_FOOTER_AREA', EN: 'Footer Area', DE: 'Fußzeilen-Bereich', FR: 'Zone de pied de page', ES: 'Área del pie de página' },
    { Title: 'LABEL_PHONE', EN: 'Phone', DE: 'Telefon', FR: 'Téléphone', ES: 'Teléfono' },
    { Title: 'TITLE_CONTACT_US', EN: 'Contact Us', DE: 'Kontaktieren Sie uns', FR: 'Contactez-nous', ES: 'Contáctenos' },
    { Title: 'TITLE_CONNECT', EN: 'Connect', DE: 'Verbinden', FR: 'Se connecter', ES: 'Conectar' },
    { Title: 'LABEL_ADD_LINK', EN: 'Add Link', DE: 'Link hinzufügen', FR: 'Ajouter un lien', ES: 'Agregar enlace' },
    { Title: 'BTN_REMOVE_GROUP', EN: 'Remove Group', DE: 'Gruppe entfernen', FR: 'Supprimer le groupe', ES: 'Eliminar grupo' },
    { Title: 'BTN_ADD_LINK_GROUP', EN: 'Add Link Group', DE: 'Link-Gruppe hinzufügen', FR: 'Ajouter un groupe de liens', ES: 'Agregar grupo de enlaces' },

    // Shared Modals
    { Title: 'TH_NO', EN: 'No', DE: 'Nr.', FR: 'N°', ES: 'Nº' },
    { Title: 'LABEL_INFO', EN: 'Info', DE: 'Info', FR: 'Info', ES: 'Info' },
    { Title: 'LABEL_MODIFIED_BY', EN: 'Modified by', DE: 'Geändert von', FR: 'Modifié par', ES: 'Modificado por' },
    { Title: 'MSG_NO_DETAILS', EN: 'No details recorded', DE: 'Keine Details aufgezeichnet', FR: 'Aucun détail enregistré', ES: 'No se grabaron detalles' },
    { Title: 'BTN_CLOSE', EN: 'Close', DE: 'Schließen', FR: 'Fermer', ES: 'Cerrar' },
    { Title: 'MSG_EDITING_CONNECTED', EN: 'Editing Connected Item...', DE: 'Verbundenes Element wird bearbeitet...', FR: 'Modification de l\'élément connecté...', ES: 'Editando elemento conectado...' },
    { Title: 'TITLE_CONFIRM_DELETE', EN: 'Confirm Deletion', DE: 'Löschen bestätigen', FR: 'Confirmer la suppression', ES: 'Confirmar eliminación' },
    { Title: 'MSG_DELETE_CONFIRM', EN: 'Are you sure you want to delete this item? This action cannot be undone.', DE: 'Sind Sie sicher, dass Sie dieses Element löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.', FR: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.', ES: '¿Está seguro de que desea eliminar este elemento? Esta acción no se puede deshacer.' },
    { Title: 'TITLE_HELP_GUIDE', EN: 'Help Guide', DE: 'Hilfe-Leitfaden', FR: 'Guide d\'aide', ES: 'Guía de ayuda' },
    { Title: 'TITLE_INTRODUCTION', EN: 'Introduction', DE: 'Einführung', FR: 'Introduction', ES: 'Introducción' },
    { Title: 'MSG_HELP_WELCOME', EN: 'Welcome to the Management Module. Use this tool to organize your content effectively.', DE: 'Willkommen im Management-Modul. Verwenden Sie dieses Tool, um Ihre Inhalte effektiv zu organisieren.', FR: 'Bienvenue dans le module de gestion. Utilisez cet outil pour organiser efficacement votre contenu.', ES: 'Bienvenido al Módulo de gestión. Utilice esta herramienta para organizar su contenido de manera efectiva.' },

    // Image Management
    { Title: 'LABEL_ALL_IMAGES', EN: 'All Images', DE: 'Alle Bilder', FR: 'Toutes les images', ES: 'Todas las imágenes' },
    { Title: 'LABEL_FOLDERS', EN: 'Folders', DE: 'Ordner', FR: 'Dossiers', ES: 'Carpetas' },
    { Title: 'LABEL_LOADING_IMAGES', EN: 'Loading images...', DE: 'Bilder werden geladen...', FR: 'Chargement des images...', ES: 'Cargando imágenes...' },
    { Title: 'LABEL_GALLERY', EN: 'Gallery', DE: 'Galerie', FR: 'Galerie', ES: 'Galería' },
    { Title: 'PH_IMG_SEARCH', EN: 'Search by title or name...', DE: 'Nach Titel oder Name suchen...', FR: 'Rechercher par titre ou nom...', ES: 'Buscar por título o nombre...' },
    { Title: 'BTN_ADD_IMAGE', EN: 'Add Image', DE: 'Bild hinzufügen', FR: 'Ajouter une image', ES: 'Agregar imagen' },
    { Title: 'MSG_NO_RESULTS', EN: 'No results found for', DE: 'Keine Ergebnisse gefunden für', FR: 'Aucun résultat trouvé pour', ES: 'No se encontraron resultados para' },
    { Title: 'MSG_TRY_DIFFERENT_SEARCH', EN: 'Please try a different search term.', DE: 'Bitte versuchen Sie es mit einem anderen Suchbegriff.', FR: 'Veuillez essayer un autre terme de recherche.', ES: 'Por favor, intente con otro término de búsqueda.' },
    { Title: 'MSG_FOLDER_EMPTY', EN: 'This folder is empty!', DE: 'Dieser Ordner ist leer!', FR: 'Ce dossier est vide !', ES: '¡Esta carpeta está vacía!' },
    { Title: 'MSG_FOLDER_EMPTY_DESC', EN: 'Click "Add Image" to upload an image to this folder, or select another folder.', DE: 'Klicken Sie auf "Bild hinzufügen", um ein Bild in diesen Ordner hochzuladen, oder wählen Sie einen anderen Ordner aus.', FR: 'Cliquez sur "Ajouter une image" pour télécharger une image dans ce dossier, ou sélectionnez un autre dossier.', ES: 'Haga clic en "Agregar imagen" para subir una imagen a esta carpeta, o seleccione otra carpeta.' },
    { Title: 'TITLE_EDITING', EN: 'Editing', DE: 'Bearbeiten', FR: 'Modification', ES: 'Editando' },
    { Title: 'TITLE_ADD_NEW_IMAGE', EN: 'Add New Image', DE: 'Neues Bild hinzufügen', FR: 'Ajouter une nouvelle image', ES: 'Agregar nueva imagen' },
    { Title: 'LABEL_REPLACE_IMAGE', EN: 'Replace Image', DE: 'Bild ersetzen', FR: 'Remplacer l\'image', ES: 'Reemplazar imagen' },
    { Title: 'LABEL_STEP_UPLOAD', EN: '1. Upload an Image', DE: '1. Bild hochladen', FR: '1. Télécharger une image', ES: '1. Subir una imagen' },
    { Title: 'LABEL_STEP_ADJUST', EN: '2. Adjust & Edit', DE: '2. Anpassen & Bearbeiten', FR: '2. Ajuster et Modifier', ES: '2. Ajustar y Editar' },
    { Title: 'LABEL_RESIZE', EN: 'Resize', DE: 'Größe ändern', FR: 'Redimensionner', ES: 'Redimensionar' },
    { Title: 'LABEL_ROTATE', EN: 'Rotate', DE: 'Drehen', FR: 'Rotation', ES: 'Rotar' },
    { Title: 'LABEL_FILTERS', EN: 'Filters', DE: 'Filter', FR: 'Filtres', ES: 'Filtros' },
    { Title: 'LABEL_IMAGE_PROPERTIES', EN: 'Image Properties', DE: 'Bildeigenschaften', FR: 'Propriétés de l\'image', ES: 'Propiedades de la imagen' },
    { Title: 'PH_IMG_NAME_EXAMPLE', EN: 'e.g., my-vacation-photo.png', DE: 'z.B. mein-urlaubsfoto.png', FR: 'ex: ma-photo-de-vacances.png', ES: 'ej. mi-foto-de-vacaciones.png' },
    { Title: 'PH_IMG_TITLE_EXAMPLE', EN: 'e.g., Sunset at the Beach', DE: 'z.B. Sonnenuntergang am Strand', FR: 'ex: Coucher de soleil à la plage', ES: 'ej. Atardecer en la playa' },
    { Title: 'PH_IMG_DESC_EXAMPLE', EN: 'A brief description of the image.', DE: 'Eine kurze Beschreibung des Bildes.', FR: 'Une brève description de l\'image.', ES: 'Una breve descripción de la imagen.' },
    { Title: 'BTN_DELETE_ITEM', EN: 'Delete this item', DE: 'Dieses Element löschen', FR: 'Supprimer cet élément', ES: 'Eliminar este elemento' },
    { Title: 'BTN_COPY_SAVE_NEW', EN: 'Copy & Save as New', DE: 'Kopieren & als neu speichern', FR: 'Copier et Enregistrer comme nouveau', ES: 'Copiar y Guardar como nuevo' },
    { Title: 'BTN_SAVE_CHANGES', EN: 'Save Changes', DE: 'Änderungen speichern', FR: 'Enregistrer les modifications', ES: 'Guardar cambios' },
    { Title: 'BTN_SAVE_IMAGE', EN: 'Save Image', DE: 'Bild speichern', FR: 'Enregistrer l\'image', ES: 'Guardar imagen' },
    { Title: 'MSG_CHOOSE_ADD_METHOD', EN: 'How would you like to add an image?', DE: 'Wie möchten Sie ein Bild hinzufügen?', FR: 'Comment souhaitez-vous ajouter une image ?', ES: '¿Cómo le gustaría agregar una imagen?' },
    { Title: 'LABEL_UPLOAD', EN: 'Upload', DE: 'Hochladen', FR: 'Télécharger', ES: 'Subir' },
    { Title: 'DESC_UPLOAD_DEVICE', EN: 'From your device', DE: 'Von Ihrem Gerät', FR: 'Depuis votre appareil', ES: 'Desde su dispositivo' },
    { Title: 'LABEL_FROM_URL', EN: 'From URL', DE: 'Von URL', FR: 'Depuis une URL', ES: 'Desde URL' },
    { Title: 'DESC_IMPORT_LINK', EN: 'Import via link', DE: 'Über Link importieren', FR: 'Importer via un lien', ES: 'Importar mediante enlace' },
    { Title: 'LABEL_PASTE', EN: 'Paste', DE: 'Einfügen', FR: 'Coller', ES: 'Pegar' },
    { Title: 'DESC_FROM_CLIPBOARD', EN: 'From clipboard', DE: 'Aus der Zwischenablage', FR: 'Depuis le presse-papier', ES: 'Desde el portapapeles' },
    { Title: 'LABEL_FROM_GALLERY', EN: 'From Gallery', DE: 'Aus Galerie', FR: 'Depuis la galerie', ES: 'Desde la galería' },
    { Title: 'DESC_USE_EXISTING_IMG', EN: 'Use existing image', DE: 'Vorhandenes Bild verwenden', FR: 'Utiliser une image existante', ES: 'Usar imagen existente' },
    { Title: 'BTN_BACK_OPTIONS', EN: 'Back to options', DE: 'Zurück zu den Optionen', FR: 'Retour aux options', ES: 'Volver a las opciones' },
    { Title: 'TITLE_UPLOAD_IMAGE', EN: 'Upload Your Image', DE: 'Laden Sie Ihr Bild hoch', FR: 'Téléchargez votre image', ES: 'Suba su imagen' },
    { Title: 'MSG_DRAG_DROP_FILE', EN: 'Drag & drop a file here or click to select a file', DE: 'Datei hierher ziehen oder zum Auswählen klicken', FR: 'Glissez-déposez un fichier ici ou cliquez pour en sélectionner un', ES: 'Arrastre y suelte un archivo aquí o haga clic para seleccionar uno' },
    { Title: 'TITLE_LOAD_FROM_URL', EN: 'Load Image from a URL', DE: 'Bild von einer URL laden', FR: 'Charger une image depuis une URL', ES: 'Cargar imagen desde una URL' },
    { Title: 'BTN_LOAD', EN: 'Load', DE: 'Laden', FR: 'Charger', ES: 'Cargar' },
    { Title: 'TITLE_PASTE_IMAGE', EN: 'Paste Image', DE: 'Bild einfügen', FR: 'Coller l\'image', ES: 'Pegar imagen' },
    { Title: 'MSG_PASTE_DIRECTIONS', EN: 'Just press Ctrl+V (or Cmd+V) anywhere on the page.', DE: 'Drücken Sie einfach Strg+V (oder Cmd+V) an einer beliebigen Stelle auf der Seite.', FR: 'Appuyez simplement sur Ctrl+V (ou Cmd+V) n\'importe où sur la page.', ES: 'Simplemente presione Ctrl+V (o Cmd+V) en cualquier lugar de la página.' },
    { Title: 'TITLE_SELECT_GALLERY', EN: 'Select from your gallery', DE: 'Aus Ihrer Galerie auswählen', FR: 'Sélectionner depuis votre galerie', ES: 'Seleccionar de su galería' },
    { Title: 'LABEL_LOADING_IMAGE', EN: 'Loading image...', DE: 'Bild wird geladen...', FR: 'Chargement de l\'image...', ES: 'Cargando imagen...' },
    { Title: 'LABEL_SELECT_IMAGE', EN: 'Select image', DE: 'Bild auswählen', FR: 'Sélectionner l\'image', ES: 'Seleccionar imagen' },
    { Title: 'MSG_GALLERY_EMPTY', EN: 'Your gallery is empty.', DE: 'Ihre Galerie ist leer.', FR: 'Votre galerie est vide.', ES: 'Tu galería está vacía.' },
    { Title: 'TITLE_PHOTO_GALLERY', EN: 'Photo Gallery', DE: 'Fotogalerie', FR: 'Galerie de photos', ES: 'Galería de fotos' },
];

// Seed Data for Documents
export const SEED_DOCUMENTS = [
    {
        Title: 'Q1 Financial Report',
        DocumentYear: '2025',
        DocStatus: 'Draft',
        ItemRank: 1,
        DocType: 'Excel',
        DocumentDescriptions: 'Quarterly financial summary including revenue, expenses, and profit analysis for Q1 2025.',
        SortOrder: 1,
        Translations: JSON.stringify({ en: { title: 'Q1 Financial Report', description: 'Quarterly financial summary' }, de: { title: 'Q1 Finanzbericht', description: 'Vierteljährliche Finanzzusammenfassung' } })
    },
    {
        Title: 'Employee Handbook v2',
        DocumentYear: '2025',
        DocStatus: 'Draft',
        ItemRank: 5,
        DocType: 'PDF',
        DocumentDescriptions: 'Updated employee handbook covering company policies, benefits, and procedures.',
        SortOrder: 2,
        Translations: JSON.stringify({ en: { title: 'Employee Handbook v2', description: 'Updated employee handbook' }, de: { title: 'Mitarbeiterhandbuch v2', description: 'Aktualisiertes Mitarbeiterhandbuch' } })
    },
    {
        Title: 'Brand Guidelines',
        DocumentYear: '2022',
        DocStatus: 'Draft',
        ItemRank: 5,
        DocType: 'PDF',
        DocumentDescriptions: 'Comprehensive brand guidelines including logo usage, color palette, and typography standards.',
        SortOrder: 3,
        Translations: JSON.stringify({ en: { title: 'Brand Guidelines', description: 'Comprehensive brand guidelines' }, de: { title: 'Markenrichtlinien', description: 'Umfassende Markenrichtlinien' } })
    }
];

// Seed Data for Images (Picture Library metadata only)
export const SEED_IMAGES = [
    {
        AltText: 'Corporate team meeting',
        AssetCategory: 'Team',
        CopyrightInfo: 'Internal'
    },
    {
        AltText: 'Company logo',
        AssetCategory: 'Logos',
        CopyrightInfo: 'Web Studio Corp'
    }
];

// Seed Data for Events
export const SEED_EVENTS = [
    {
        Title: 'Annual Developer Conference',
        StartDate: new Date('2025-06-15T09:00:00'),
        EndDate: new Date('2025-06-17T17:00:00'),
        Location: 'Hybrid - Berlin & Online',
        Description: 'Join us for three days of coding, workshops, and networking.',
        Category: 'Conference',
        Translations: JSON.stringify({
            de: { title: 'Entwicklerkonferenz', description: 'Kommen Sie zu uns...' },
            fr: { title: 'Conférence des développeurs', description: 'Rejoignez-nous...' }
        })
    },
    {
        Title: 'Q2 All-Hands Meeting',
        StartDate: new Date('2025-04-10T14:00:00'),
        EndDate: new Date('2025-04-10T15:30:00'),
        Location: 'Main Auditorium',
        Description: 'Quarterly company update and Q&A session.',
        Category: 'Meeting',
        Translations: JSON.stringify({})
    },
    {
        Title: 'Summer Team Building',
        StartDate: new Date('2025-07-20T10:00:00'),
        EndDate: new Date('2025-07-20T18:00:00'),
        Location: 'Central Park',
        Description: 'A day of fun outdoor activities for the whole team.',
        Category: 'Social',
        Translations: JSON.stringify({})
    }
];

// Seed Data for Containers
export const SEED_CONTAINERS = [
    {
        PageSlug: '/',
        Title: 'Home Hero Slider',
        ContainerType: 'SLIDER',
        SortOrder: 0,
        IsVisible: true,
        Settings: JSON.stringify({
            templateId: 'img_text',
            speed: 5,
            autoplay: true,
            slides: [
                { id: 's1', title: 'Innovation Redefined', desc: 'Leading the future with smart solutions.', image: '' },
                { id: 's2', title: 'Global Connectivity', desc: 'Connecting teams across every continent.', image: '' }
            ]
        }),
        ContainerContent: JSON.stringify({ title: { en: 'Welcome to Web Studio', de: 'Willkommen', fr: 'Bienvenue', es: 'Bienvenido' } })
    },
    {
        PageSlug: '/',
        Title: 'Latest News Grid',
        ContainerType: 'CARD_GRID',
        SortOrder: 1,
        IsVisible: true,
        Settings: JSON.stringify({
            source: 'News',
            columns: 3,
            ordering: '123',
            layout: 'grid',
            imgPos: 'top',
            border: 'sharp',
            title: 'Latest News',
            taggedItems: []
        }),
        ContainerContent: JSON.stringify({ title: { en: 'Latest News', de: 'Aktuelle Nachrichten', fr: 'Dernières nouvelles', es: 'Últimas noticias' } })
    },
    {
        PageSlug: '/what-we-offer',
        Title: 'Offer Hero Banner',
        ContainerType: 'HERO',
        SortOrder: 0,
        IsVisible: true,
        Settings: JSON.stringify({ bgType: 'image', titleColor: 'white', align: 'center', bgImage: '' }),
        ContainerContent: JSON.stringify({
            title: { en: 'World Class Solutions', de: 'Weltklasse-Lösungen', fr: 'Solutions de classe mondiale', es: 'Soluciones de clase mundial' },
            subtitle: { en: 'Tailored for your business needs', de: 'Maßgeschneidert für Ihre Bedürfnisse', fr: 'Adapté à vos besoins', es: 'Adaptado a sus necesidades' },
            description: { en: 'We provide a wide range of digital services including consulting, development, and support.', de: 'Wir bieten eine breite Palette digitaler Dienste an.', fr: 'Nous proposons une large gamme de services numériques.', es: 'Ofrecemos una amplia gama de servicios digitales.' }
        })
    },
    {
        PageSlug: '/contact',
        Title: 'Contact Us Form',
        ContainerType: 'CONTACT_FORM',
        SortOrder: 0,
        IsVisible: true,
        Settings: JSON.stringify({
            heading: 'Get in Touch',
            subheading: 'We would love to hear from you',
            buttonText: 'Send Message',
            alignment: 'center',
            fields: [
                { id: 'f1', label: 'Full Name', type: 'text', required: true },
                { id: 'f2', label: 'Email Address', type: 'email', required: true },
                { id: 'f3', label: 'Message', type: 'textarea', required: true }
            ]
        }),
        ContainerContent: JSON.stringify({
            heading: { en: 'Get in Touch', de: 'Kontaktieren Sie uns' },
            subheading: { en: 'We would love to hear from you', de: 'Wir würden uns freuen, von Ihnen zu hören' }
        })
    }
];

// Note: ContactQueries starts empty
