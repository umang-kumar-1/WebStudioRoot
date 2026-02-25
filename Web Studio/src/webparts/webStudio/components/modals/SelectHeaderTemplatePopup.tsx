
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store';
import { translateText } from '../../services/geminiService';
import { Container, ContainerType, MultilingualText } from '../../types';
import { GenericModal, TabButton } from './SharedModals';
import { JoditRichTextEditor } from '../JoditEditor';
import {
    LayoutGrid, List as ListIcon, Play,
    ChevronLeft, ChevronRight, Check, RefreshCw, Plus, Edit3,
    Upload, ArrowUp, ArrowDown, Globe, Wand2, FileText,
    Search, MapPin, X, Smartphone, Tablet, Monitor, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    MoreHorizontal, Circle, Square, Trash2, Settings, Image as ImageIcon
} from 'lucide-react';

// --- GEOCHART PREVIEW COMPONENT ---
const GEO_COUNTRY_ISO: Record<string, string> = {
    'USA': 'US', 'Germany': 'DE', 'France': 'FR', 'UK': 'GB', 'India': 'IN', 'China': 'CN'
};
const GEO_CONTINENT_CODE: Record<string, string> = {
    'Europe': '150', 'Asia': '142', 'North America': '021', 'South America': '005', 'Africa': '002', 'Oceania': '009'
};
const GEO_CONTINENT_COUNTRIES: Record<string, string[]> = {
    'Europe': ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'PL', 'SE', 'NO', 'FI', 'DK', 'AT', 'BE', 'CH', 'PT', 'GR', 'CZ', 'HU', 'RO', 'UA'],
    'Asia': ['CN', 'IN', 'JP', 'KR', 'ID', 'TH', 'VN', 'MY', 'PH', 'BD', 'PK', 'IR', 'TR', 'SA', 'AE'],
    'North America': ['US', 'CA', 'MX', 'CU', 'GT', 'PA', 'CR', 'DO'],
    'South America': ['BR', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'BO', 'PY', 'UY'],
    'Africa': ['ZA', 'NG', 'ET', 'EG', 'KE', 'TZ', 'GH', 'DZ', 'MA', 'MZ', 'CI', 'MG'],
    'Oceania': ['AU', 'NZ', 'PG', 'FJ', 'SB']
};

const buildPreviewData = (mapType: string, selectedRegion?: string) => {
    if (mapType === 'Country' && selectedRegion) {
        const iso = GEO_COUNTRY_ISO[selectedRegion] || selectedRegion;
        return [['Country', 'Value'], [iso, 100]];
    }
    if (mapType === 'Continent' && selectedRegion) {
        const countries = GEO_CONTINENT_COUNTRIES[selectedRegion] || [];
        return [['Country', 'Value'], ...countries.map((c, i) => [c, 80 + i * 5])];
    }
    return [
        ['Country', 'Value'],
        ['DE', 200], ['FR', 150], ['GB', 180], ['IN', 220], ['US', 300],
        ['CN', 260], ['BR', 140], ['AU', 110], ['CA', 130], ['ZA', 90],
        ['JP', 170], ['RU', 160], ['IT', 145], ['ES', 135], ['AR', 120]
    ];
};

const GeoChartPreview = ({ mapType, selectedRegion }: { mapType: string; selectedRegion?: string }) => {
    const divRef = useRef<HTMLDivElement>(null);

    const getRegion = () => {
        if (mapType === 'Country' && selectedRegion) return GEO_COUNTRY_ISO[selectedRegion] || 'world';
        if (mapType === 'Continent' && selectedRegion) return GEO_CONTINENT_CODE[selectedRegion] || 'world';
        return 'world';
    };

    const drawChart = () => {
        const g = (window as any).google;
        if (!divRef.current || !g?.visualization) return;
        const data = g.visualization.arrayToDataTable(buildPreviewData(mapType, selectedRegion));
        const options = {
            region: getRegion(),
            displayMode: 'region',
            resolution: 'countries',
            colorAxis: { minValue: 0, colors: ['#dbeafe', '#2563eb'] },
            backgroundColor: '#f0f4ff',
            datalessRegionColor: '#e2e8f0',
            legend: 'none',
        };
        new g.visualization.GeoChart(divRef.current).draw(data, options);
    };

    useEffect(() => {
        const g = (window as any).google;
        if (g?.visualization?.GeoChart) {
            drawChart();
        } else if (g?.charts) {
            g.charts.setOnLoadCallback(drawChart);
        } else {
            const existing = document.querySelector('script[src*="gstatic.com/charts/loader"]');
            if (existing) {
                const t = setInterval(() => { if ((window as any).google?.visualization) { clearInterval(t); drawChart(); } }, 200);
                return () => clearInterval(t);
            }
            const s = document.createElement('script');
            s.src = 'https://www.gstatic.com/charts/loader.js';
            s.onload = () => {
                (window as any).google.charts.load('current', { packages: ['geochart'] });
                (window as any).google.charts.setOnLoadCallback(drawChart);
            };
            document.head.appendChild(s);
        }
    }, [mapType, selectedRegion]);

    return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
};

const SkeletonPreview = ({ previewId }: { previewId: string }) => {
    const { themeConfig } = useStore();



    switch (previewId) {
        case 'HERO':
            return (
                <div
                    className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
                    style={{ backgroundColor: themeConfig['--primary-color'] }}
                >
                    <div className="relative z-10 w-full flex flex-col items-center gap-1.5 ">
                        <div className="w-3/4 h-2 bg-white opacity-40 rounded-full"></div>
                        <div className="w-2/3 h-2 bg-white opacity-40 rounded-full"></div>
                        <div className="w-16 h-12 border-2 border-white/20 rounded-md flex items-center justify-center my-2">
                            <ImageIcon className="w-6 h-6 text-white/30" />
                        </div>
                        <div className="w-3/5 h-1.5 bg-white opacity-30 rounded-full"></div>
                        <div className="w-1/2 h-1.5 bg-white opacity-30 rounded-full"></div>
                    </div>
                </div>
            );
        case 'CONTENT':
            return (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 gap-3">
                    <div className="w-3/5 h-3 rounded-full bg-slate-400"></div>
                    <div className="w-full h-2 rounded-full bg-slate-200 mt-2"></div>
                    <div className="w-full h-2 rounded-full bg-slate-200"></div>
                    <div className="w-4/5 h-2 rounded-full bg-slate-200"></div>
                </div>
            );
        case 'VISUAL':
            return (
                <div className="w-full h-full bg-white flex items-stretch p-4 gap-3">
                    <div className="w-[45%] rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${themeConfig['--primary-color']}12` }}>
                        <ImageIcon className="w-10 h-10" style={{ color: `${themeConfig['--primary-color']}33` }} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-2.5 py-2">
                        <div className="h-2.5 rounded-full w-full bg-slate-300"></div>
                        <div className="h-2 rounded-full w-full bg-slate-200"></div>
                        <div className="h-2 rounded-full w-full bg-slate-200"></div>
                        <div className="h-2 rounded-full w-3/4 bg-slate-200"></div>
                    </div>
                </div>
            );
        case 'GALLERY':
            return (
                <div className="w-full h-full bg-white p-4 flex flex-col gap-3">
                    <div className="flex-1 border border-gray-100 rounded-md flex items-center justify-center" style={{ backgroundColor: `${themeConfig['--bg-body']}` }}>
                        <ImageIcon className="w-8 h-8" style={{ color: `${themeConfig['--text-secondary']}44` }} />
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-6 h-6 border border-gray-100 rounded-md" style={{ backgroundColor: `${themeConfig['--bg-surface']}` }}></div>
                        ))}
                    </div>
                </div>
            );
        case 'SLIDER':
            return (
                <div className="w-full h-full flex items-center justify-between p-4 relative" style={{ backgroundColor: themeConfig['--bg-body'] }}>
                    <ChevronLeft className="w-4 h-4" style={{ color: themeConfig['--text-secondary'] }} />
                    <div className="flex-1 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-md flex items-center justify-center mb-3 shadow-sm">
                            <ImageIcon className="w-8 h-8" style={{ color: `${themeConfig['--primary-color']}44` }} />
                        </div>
                        <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: `${themeConfig['--primary-color']}33` }}></div>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: themeConfig['--text-secondary'] }} />
                </div>
            );
        default:
            return <div className="w-full h-full bg-gray-50 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-200" /></div>;
    }
};

const TABS = [
    { id: 'HEADER', label: 'Header' },
    { id: 'SLIDER', label: 'Slider' },
    { id: 'DATA_GRID', label: 'Data Grid' },
    { id: 'CONTACT_FORM', label: 'Contact Form' },
    { id: 'TABLE_VIEW', label: 'Table View' },
    { id: 'MAP', label: 'Map' }
];

const DATA_SOURCES = [
    'News', 'Event', 'Document', 'Smart Pages', 'Container Items', 'Contact'
];

interface TemplateItem {
    id: string;
    label: string;
    desc: string;
    type: ContainerType;
    previewId: string;
}

const TEMPLATES: Record<string, TemplateItem[]> = {
    HEADER: [
        { id: 'hero_img', label: 'Hero Image Section', desc: 'Create a captivating, full-width hero section. Perfect for grabbing attention on landing pages.', type: ContainerType.HERO, previewId: 'HERO' },
        { id: 'page_content', label: 'Page Content Section', desc: 'A clean and straightforward approach. Use this for direct communication or important updates.', type: ContainerType.HERO, previewId: 'CONTENT' },
        { id: 'visual_text', label: 'Visual & Text', desc: 'Balance visuals and copy effectively. Ideal for feature highlights, user testimonials, or service introductions where both elements are equally important.', type: ContainerType.HERO, previewId: 'VISUAL' },
    ],
    SLIDER: [
        { id: 'img_gallery', label: 'Image Gallery Carousel', desc: 'A gallery-style carousel with a main image and thumbnail navigation.', type: ContainerType.SLIDER, previewId: 'GALLERY' },
        { id: 'img_text', label: 'Image / Text Slider', desc: 'A classic slider that showcases one item at a time with navigation arrows.', type: ContainerType.SLIDER, previewId: 'SLIDER' },
    ],
    DATA_GRID: [],
    CONTACT_FORM: [],
    TABLE_VIEW: [],
    MAP: []
};

// --- TYPES ---
interface ContactField {
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'email' | 'textarea' | 'number';
    required: boolean;
}

interface ContactConfigType {
    heading: string;
    subheading: string;
    description: string;
    alignment: 'center' | 'left';
    bgType: 'none' | 'color' | 'image';
    bgColor: string;
    bgImage: string;
    fields: ContactField[];
    buttonText: string;
}

interface HeaderConfigType {
    containerTitle: string;
    heading: string;
    translations: Record<string, { containerTitle: string; heading: string }>;
}

interface TableColumn {
    id: string;
    header: string;
}

interface TableConfigType {
    title: string;
    columns: TableColumn[];
    enableGlobalSearch: boolean;
    enableColumnSearch: boolean;
    enableSorting: boolean;
}

interface MapConfigType {
    title: string;
    mapType: 'World' | 'Continent' | 'Country';
    selectedRegion: string;
    locationSearch: string;
}

// --- VISUAL CONFIGURATION HELPERS ---
interface ToggleOption {
    value: string | number;
    label: string;
    icon?: React.ElementType;
}

interface VisualToggleProps {
    options: ToggleOption[];
    value: string | number;
    onChange: (value: any) => void;
    label?: string;
}

const VisualToggle = ({ options, value, onChange, label }: VisualToggleProps) => {
    const { themeConfig } = useStore();
    return (
        <div className="mb-4">
            {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>}
            <div className="flex bg-gray-100 rounded-sm p-1 gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded-sm transition-all ${value === opt.value ? 'bg-white shadow-sm ring-1' : 'text-gray-500 hover:text-gray-700'}`}
                        style={{
                            color: value === opt.value ? themeConfig['--primary-color'] : undefined,
                            boxShadow: value === opt.value ? `0 0 0 1px ${themeConfig['--primary-color']}` : undefined
                        }}
                    >
                        {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- DUMMY ASSETS ---
const HERO_IMG = "";
const VISUAL_TEXT_IMG = "";
const SLIDER_IMGS = ["", "", ""];

// --- PREVIEW COMPONENTS ---
const HeaderPreview = ({ type, onClose }: { type: string, onClose: () => void }) => {
    const { themeConfig } = useStore();

    return (
        <div className="w-full h-full bg-white relative overflow-y-auto" style={{ fontFamily: themeConfig['--font-family-base'] }}>
            <button onClick={onClose} className="fixed top-6 right-6 z-50 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md p-2 rounded-full shadow-lg transition-colors border border-white/20">
                <X className="w-6 h-6" />
            </button>
            {type === 'hero_img' && (
                <div className="w-full h-full bg-white relative flex flex-col items-center pt-32">
                    <div className="absolute top-0 left-0 right-0 h-[60%] bg-[#8fa4b9] z-0" style={{ backgroundColor: themeConfig['--primary-color'] }}></div>
                    <div className="relative z-10 text-center px-4 max-w-4xl mt-20">
                        <h1 className="text-5xl font-bold mb-4 tracking-tight drop-shadow-sm" style={{ color: 'white', fontSize: themeConfig['--font-size-h1'] }}>Hero Image Section</h1>
                        <p className="text-lg font-medium max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>Create a captivating, full-width hero section. Perfect for grabbing attention on landing pages.</p>
                    </div>
                </div>
            )}
            {type === 'page_content' && (
                <div className="w-full h-full bg-white relative flex flex-col items-center pt-32">
                    <div className="absolute top-0 left-0 right-0 h-[45%] bg-[#8fa4b9] z-0" style={{ backgroundColor: themeConfig['--primary-color'] }}></div>
                    <div className="relative z-10 text-center px-4 max-w-4xl mt-10">
                        <h1 className="text-5xl font-bold mb-6 tracking-tight" style={{ color: 'white', fontSize: themeConfig['--font-size-h1'] }}>Page Content Section</h1>
                        <div className="space-y-4 font-medium text-gray-800 text-lg leading-relaxed bg-white p-8 shadow-lg rounded-sm" style={{ borderColor: themeConfig['--border-color'] }}>
                            <p className="font-bold opacity-100" style={{ color: themeConfig['--heading-color'] }}>A clean and straightforward approach. Use this for direct communication or important updates.</p>
                            <p className="text-base opacity-80" style={{ color: themeConfig['--text-secondary'] }}>Default Short Description : Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <button className="mt-10 px-8 py-3 text-white font-bold text-sm uppercase tracking-wider shadow-lg rounded-sm inline-flex items-center gap-2" style={{ backgroundColor: themeConfig['--btn-primary-bg'] }}>TEST <FileText className="w-4 h-4 opacity-50" /></button>
                    </div>
                </div>
            )}
            {type === 'visual_text' && (
                <div className="w-full h-full relative flex items-center justify-center bg-gray-900">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${VISUAL_TEXT_IMG})` }}></div>
                    <div className="absolute inset-0 bg-blue-900/40" style={{ backgroundColor: `${themeConfig['--primary-color']}66` }}></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-5xl">
                        <h1 className="text-6xl font-bold mb-6 tracking-tight drop-shadow-lg" style={{ fontSize: themeConfig['--font-size-h1'] }}>Visual & Text</h1>
                        <div className="text-2xl font-medium opacity-95 drop-shadow-md space-y-2">
                            <p>Balance visuals and copy effectively.</p>
                            <p className="text-base opacity-80 mt-4 max-w-3xl mx-auto">Default Short Description : Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SliderPreview = ({ type, onClose }: { type: string, onClose: () => void }) => {
    const { themeConfig } = useStore();
    const [current, setCurrent] = useState(0);
    const slides = [
        { title: 'Image Gallery Carousel', sub: 'Default Image Sub Heading', desc: 'A gallery-style carousel with a main image and thumbnail navigation.', img: SLIDER_IMGS[0] },
        { title: 'Corporate Strategy 2025', sub: 'Growth & Expansion', desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', img: SLIDER_IMGS[1] },
        { title: 'Employee Wellness Program', sub: 'Health & Balance', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', img: SLIDER_IMGS[2] },
    ];
    const next = () => setCurrent((p) => (p + 1) % slides.length);
    const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

    if (type === 'img_gallery') {
        return (
            <div className="w-full h-full bg-white relative overflow-y-auto flex items-center justify-center" style={{ fontFamily: themeConfig['--font-family-base'] }}>
                <button onClick={onClose} className="fixed top-6 right-6 z-50 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                <div className="w-full max-w-6xl px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold" style={{ color: themeConfig['--primary-color'], fontSize: themeConfig['--font-size-h2'] }}>Image Gallery Carousel</h1>
                        <p className="text-gray-500" style={{ color: themeConfig['--text-secondary'] }}>A gallery-style carousel with a main image and thumbnail navigation.</p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-12 items-center bg-white">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-2xl font-bold" style={{ color: themeConfig['--heading-color'], fontSize: themeConfig['--font-size-h3'] }}>{slides[current].title}</h2>
                            <h3 className="text-lg font-medium" style={{ color: themeConfig['--text-secondary'] }}>{slides[current].sub}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: themeConfig['--text-primary'] }}>{slides[current].desc}</p>
                            <div className="flex gap-2 pt-4">
                                <button onClick={prev} className="p-2 bg-gray-200 rounded-sm hover:bg-gray-300 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={next} className="p-2 text-white rounded-sm hover:opacity-90 transition-colors" style={{ backgroundColor: themeConfig['--primary-color'] }}><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="flex-1 w-full h-[400px] relative">
                            <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl relative bg-gray-100 flex items-center justify-center">
                                {slides[current].img ? <img src={slides[current].img} className="w-full h-full object-cover" /> : <div className="text-gray-300">Slide {current + 1} Image</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full h-full bg-white relative overflow-y-auto" style={{ fontFamily: themeConfig['--font-family-base'] }}>
            <button onClick={onClose} className="fixed top-6 right-6 z-50 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
            <div className="w-full h-[600px] relative overflow-hidden group bg-gray-900">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: slides[current].img ? `url(${slides[current].img})` : 'none' }}></div>
                <div className="absolute inset-0 bg-black/40" style={{ backgroundColor: `${themeConfig['--primary-color']}44` }}></div>
                <div className="absolute inset-0 flex items-center px-20">
                    <div className="max-w-4xl text-white space-y-4">
                        <h2 className="text-5xl font-bold" style={{ fontSize: themeConfig['--font-size-h1'] }}>{slides[current].title}</h2>
                        <h3 className="text-2xl font-semibold opacity-90">{slides[current].sub}</h3>
                        <p className="text-lg opacity-80 max-w-2xl leading-relaxed">{slides[current].desc}</p>
                    </div>
                </div>
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-sm hover:bg-white transition-colors" style={{ color: themeConfig['--primary-color'] }}><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-sm hover:bg-white transition-colors" style={{ color: themeConfig['--primary-color'] }}><ChevronRight className="w-6 h-6" /></button>
            </div>
        </div>
    );
};

// --- CONFIG WIZARDS ---

const HeaderConfigPanel = ({ config, setConfig, onBack }: { config: HeaderConfigType, setConfig: (c: HeaderConfigType) => void, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'TRANSLATION'>('CONTENT');
    const { currentLanguage, themeConfig } = useStore();
    const [isTranslating, setIsTranslating] = useState(false);

    const updateConfig = (key: keyof HeaderConfigType, value: any) => {
        setConfig({ ...config, [key]: value });
    };

    const updateTranslation = (field: 'containerTitle' | 'heading', value: string) => {
        setConfig({
            ...config,
            translations: {
                ...config.translations,
                [currentLanguage]: {
                    ...config.translations[currentLanguage],
                    [field]: value
                }
            }
        });
    };

    const getTranslatedValue = (field: 'containerTitle' | 'heading') => {
        return config.translations[currentLanguage]?.[field] || '';
    };

    const handleSuggestAI = async () => {
        setIsTranslating(true);
        try {
            const [translatedTitle, translatedHeading] = await Promise.all([
                config.containerTitle ? translateText(config.containerTitle, currentLanguage) : Promise.resolve(''),
                config.heading ? translateText(config.heading, currentLanguage) : Promise.resolve('')
            ]);

            setConfig({
                ...config,
                translations: {
                    ...config.translations,
                    [currentLanguage]: {
                        ...config.translations[currentLanguage],
                        containerTitle: translatedTitle || config.translations[currentLanguage]?.containerTitle || '',
                        heading: translatedHeading || config.translations[currentLanguage]?.heading || ''
                    }
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="px-8 pt-6 pb-2 border-b border-gray-100 bg-white flex justify-between items-center">
                <h3 className="text-xl font-bold" style={{ color: themeConfig['--primary-color'] }}>Configure Header</h3>
                <button onClick={onBack} className="text-xs text-gray-500 hover:text-gray-800 underline">Change Template</button>
            </div>

            <div className="flex border-b border-gray-200 px-8 bg-white">
                <TabButton active={activeTab === 'CONTENT'} label="Manage Content" onClick={() => setActiveTab('CONTENT')} />
                <TabButton active={activeTab === 'TRANSLATION'} label="Translation" onClick={() => setActiveTab('TRANSLATION')} />
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full space-y-8 bg-white p-8 shadow-sm border border-gray-200 rounded-sm">
                    {activeTab === 'CONTENT' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Container Title</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none transition-all"
                                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 1px ${themeConfig['--primary-color']}`}
                                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    value={config.containerTitle}
                                    onChange={(e) => updateConfig('containerTitle', e.target.value)}
                                    placeholder="Enter Container Title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
                                <input
                                    className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none transition-all"
                                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 1px ${themeConfig['--primary-color']}`}
                                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    value={config.heading}
                                    onChange={(e) => updateConfig('heading', e.target.value)}
                                    placeholder="Enter Main Heading"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'TRANSLATION' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    <Globe className="w-3 h-3" /> Target: {currentLanguage.toUpperCase()}
                                </div>
                                <button onClick={handleSuggestAI} disabled={isTranslating} className={`text-xs font-bold flex items-center gap-1.5 hover:bg-blue-50 px-3 py-1.5 rounded-sm transition-colors border border-transparent hover:border-blue-100 ${isTranslating ? 'opacity-50 cursor-wait' : ''}`} style={{ color: themeConfig['--primary-color'] }}>
                                    <Wand2 className={`w-3 h-3 ${isTranslating ? 'animate-pulse' : ''}`} /> {isTranslating ? 'Translating...' : 'Suggest with AI'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Originals */}
                                <div className="space-y-6 opacity-70 pointer-events-none">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Original Container Title</label>
                                        <div className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-sm">{config.containerTitle || <span className="italic">Empty</span>}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Original Heading</label>
                                        <div className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-sm">{config.heading || <span className="italic">Empty</span>}</div>
                                    </div>
                                </div>

                                {/* Translations */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Translated Container Title</label>
                                        <input
                                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none transition-all"
                                            onFocus={(e) => e.target.style.boxShadow = `0 0 0 1px ${themeConfig['--primary-color']}`}
                                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                                            value={getTranslatedValue('containerTitle')}
                                            onChange={(e) => updateTranslation('containerTitle', e.target.value)}
                                            placeholder={`Enter ${currentLanguage.toUpperCase()} translation`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Translated Heading</label>
                                        <input
                                            className="w-full border border-gray-300 p-2.5 text-sm rounded-sm outline-none transition-all"
                                            onFocus={(e) => e.target.style.boxShadow = `0 0 0 1px ${themeConfig['--primary-color']}`}
                                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                                            value={getTranslatedValue('heading')}
                                            onChange={(e) => updateTranslation('heading', e.target.value)}
                                            placeholder={`Enter ${currentLanguage.toUpperCase()} translation`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface DataGridConfigType {
    title: string;
    source: string;
    columns: number;
    ordering: string;
    layout: string;
    speed: number;
    autoplay: boolean;
    imgPos: string;
    border: string;
}

const DataGridConfigPanel = ({ config, setConfig }: { config: DataGridConfigType, setConfig: (c: DataGridConfigType) => void }) => {
    const { themeConfig } = useStore();
    const updateConfig = (key: keyof DataGridConfigType, value: any) => {
        setConfig({ ...config, [key]: value });
    };

    return (
        <div className="h-full overflow-y-auto p-8 bg-gray-50">
            <div className="w-full space-y-8 bg-white p-8 shadow-sm border border-gray-200 rounded-sm">

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Container Title <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input className="w-full border p-2 pl-3 text-sm border-gray-300" value={config.title} onChange={e => updateConfig('title', e.target.value)} placeholder="Enter Container Title" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Data Source <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full border p-2 text-sm border-gray-300" value={config.source} onChange={e => updateConfig('source', e.target.value)}>
                                {DATA_SOURCES.map(ds => <option key={ds} value={ds}>{ds}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <VisualToggle label="Columns" value={config.columns} onChange={(v: any) => updateConfig('columns', v)} options={[{ value: 1, label: '1 Column', icon: Smartphone }, { value: 2, label: '2 Columns', icon: Tablet }, { value: 3, label: '3 Columns', icon: Monitor }]} />
                </div>

                <div>
                    <VisualToggle
                        label="Ordering Type"
                        value={config.ordering}
                        onChange={(v: any) => updateConfig('ordering', v)}
                        options={[
                            { value: '123', label: '123' },
                            { value: 'III', label: 'I II III' },
                            { value: 'IIIII', label: 'IIIII', icon: AlignJustify },
                            { value: 'ABC', label: 'ABC' },
                            { value: 'abc', label: 'abc' },
                            { value: 'dots', label: '...', icon: MoreHorizontal },
                            { value: 'none', label: 'None', icon: X }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                    <VisualToggle label="Card Layout" value={config.layout} onChange={(v: any) => updateConfig('layout', v)} options={[{ value: 'grid', label: 'Grid', icon: LayoutGrid }, { value: 'slider', label: 'Slider', icon: ListIcon }]} />

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Slider Speed</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Autoplay</span>
                                <div onClick={() => updateConfig('autoplay', !config.autoplay)} className="w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors" style={{ backgroundColor: config.autoplay ? themeConfig['--primary-color'] : '#d1d5db' }}>
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${config.autoplay ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-sm">
                            <Play className="w-4 h-4 text-gray-400" />
                            <input
                                type="range" min="1" max="10" step="0.5" value={config.speed}
                                onChange={(e) => updateConfig('speed', parseFloat(e.target.value))}
                                className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    accentColor: themeConfig['--primary-color'],
                                    background: '#d1d5db'
                                }}
                            />
                            <span className="text-xs font-mono w-8 text-right">{config.speed}s</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Autoplay is {config.autoplay ? 'enabled' : 'disabled'}. Slider will {config.autoplay ? '' : 'not'} auto-advance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-4">
                    <VisualToggle
                        label="Image Position"
                        value={config.imgPos}
                        onChange={(v: any) => updateConfig('imgPos', v)}
                        options={[
                            { value: 'left', label: 'Left', icon: AlignLeft },
                            { value: 'top', label: 'Top', icon: AlignCenter },
                            { value: 'right', label: 'Right', icon: AlignRight },
                            { value: 'none', label: 'None', icon: X }
                        ]}
                    />
                </div>

                <div className="pt-4">
                    <VisualToggle label="Image Border Section" value={config.border} onChange={(v: any) => updateConfig('border', v)} options={[{ value: 'sharp', label: 'Sharp Corners', icon: Square }, { value: 'rounded', label: 'Rounded Corners', icon: Square }, { value: 'circle', label: 'Circle', icon: Circle }]} />
                </div>

            </div>
        </div>
    );
};

const TableConfigPanel = ({ config, setConfig }: { config: TableConfigType, setConfig: (c: TableConfigType) => void }) => {
    const { themeConfig } = useStore();
    const addColumn = () => {
        const newCol = { id: `col_${Date.now()}`, header: 'New Column' };
        setConfig({ ...config, columns: [...config.columns, newCol] });
    };

    const removeColumn = (id: string) => {
        setConfig({ ...config, columns: config.columns.filter(c => c.id !== id) });
    };

    const updateColumn = (id: string, header: string) => {
        setConfig({ ...config, columns: config.columns.map(c => c.id === id ? { ...c, header } : c) });
    };

    return (
        <div className="h-full overflow-y-auto p-8 bg-gray-50 flex flex-col gap-8">
            <div className="w-full w-full space-y-8 bg-white p-8 shadow-sm border border-gray-200 rounded-sm">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Container Title <span className="text-red-500">*</span></label>
                    <input className="w-full border p-2 pl-3 text-sm border-gray-300" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} placeholder="Enter Container Title" />
                </div>

                {/* Features */}
                <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                    <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Table Features</h5>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={config.enableGlobalSearch} onChange={e => setConfig({ ...config, enableGlobalSearch: e.target.checked })} className="focus:ring-1" style={{ color: themeConfig['--primary-color'] }} />
                            <span className="text-sm font-medium text-gray-700">Global Search</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={config.enableColumnSearch} onChange={e => setConfig({ ...config, enableColumnSearch: e.target.checked })} className="focus:ring-1" style={{ color: themeConfig['--primary-color'] }} />
                            <span className="text-sm font-medium text-gray-700">Column Search</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={config.enableSorting} onChange={e => setConfig({ ...config, enableSorting: e.target.checked })} className="focus:ring-1" style={{ color: themeConfig['--primary-color'] }} />
                            <span className="text-sm font-medium text-gray-700">Sorting Icons</span>
                        </label>
                    </div>
                </div>

                {/* Columns */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-xs font-bold text-gray-500 uppercase">Column Management</h5>
                        <button onClick={addColumn} className="text-xs font-bold hover:underline flex items-center gap-1" style={{ color: themeConfig['--primary-color'] }}><Plus className="w-3 h-3" /> Add Column</button>
                    </div>
                    <div className="space-y-2">
                        {config.columns.map((col, idx) => (
                            <div key={col.id} className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-mono w-6 text-center">{idx + 1}</span>
                                <input
                                    className="flex-1 border p-2 text-sm rounded-sm"
                                    value={col.header}
                                    onChange={(e) => updateColumn(col.id, e.target.value)}
                                    placeholder="Column Header Name"
                                />
                                <button onClick={() => removeColumn(col.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        {config.columns.length === 0 && <div className="text-sm text-gray-400 italic text-center p-4 border border-dashed border-gray-300 rounded-sm">No columns defined.</div>}
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="w-full w-full">
                <div className="bg-white border border-gray-300 shadow-sm rounded-sm overflow-hidden">
                    <div className="p-3 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">Table Preview</div>
                    <div className="p-4 overflow-x-auto">
                        <div className="flex justify-between mb-4">
                            {config.enableGlobalSearch && (
                                <div className="relative w-64">
                                    <input className="w-full border pl-8 p-1.5 text-sm rounded-sm" placeholder="Search..." disabled />
                                    <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-2.5" />
                                </div>
                            )}
                        </div>
                        <table className="w-full border-collapse text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    {config.columns.map(col => (
                                        <th key={col.id} className="p-3 border-r border-gray-200 last:border-0 whitespace-nowrap">
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{col.header}</span>
                                                {config.enableSorting && <ArrowUp className="w-3 h-3 text-gray-400" />}
                                            </div>
                                            {config.enableColumnSearch && <input className="w-full border mt-2 p-1 text-xs font-normal" placeholder={`Search ${col.header}`} disabled />}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100"><td colSpan={config.columns.length} className="p-3 text-gray-400 italic text-center">Data will appear here...</td></tr>
                                <tr className="border-b border-gray-100"><td colSpan={config.columns.length} className="p-3 text-gray-400 italic text-center">Data will appear here...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MapConfigPanel = ({ config, setConfig }: { config: MapConfigType, setConfig: (c: MapConfigType) => void }) => {
    // const { themeConfig } = useStore();
    return (
        <div className="h-full overflow-y-auto p-8 bg-gray-50 flex flex-col gap-8">
            <div className="w-full w-full space-y-8 bg-white p-8 shadow-sm border border-gray-200 rounded-sm">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Container Title <span className="text-red-500">*</span></label>
                        <input className="w-full border p-2 pl-3 text-sm border-gray-300" value={config.title} onChange={e => setConfig({ ...config, title: e.target.value })} placeholder="Enter Container Title" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Map Type</label>
                        <select className="w-full border p-2 text-sm border-gray-300" value={config.mapType} onChange={e => setConfig({ ...config, mapType: e.target.value as MapConfigType['mapType'] })}>
                            <option value="World">World Map</option>
                            <option value="Continent">Continent Map</option>
                            <option value="Country">Country Map</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {config.mapType === 'Continent' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Select Continent</label>
                            <select className="w-full border p-2 text-sm border-gray-300" value={config.selectedRegion} onChange={e => setConfig({ ...config, selectedRegion: e.target.value })}>
                                <option value="">-- Select --</option>
                                <option value="Europe">Europe</option>
                                <option value="Asia">Asia</option>
                                <option value="North America">North America</option>
                                <option value="South America">South America</option>
                                <option value="Africa">Africa</option>
                                <option value="Oceania">Oceania</option>
                            </select>
                        </div>
                    )}
                    {config.mapType === 'Country' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Select Country</label>
                            <select className="w-full border p-2 text-sm border-gray-300" value={config.selectedRegion} onChange={e => setConfig({ ...config, selectedRegion: e.target.value })}>
                                <option value="">-- Select --</option>
                                <option value="USA">United States</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="UK">United Kingdom</option>
                                <option value="India">India</option>
                                <option value="China">China</option>
                            </select>
                        </div>
                    )}
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Initial Location Search</label>
                        <div className="relative">
                            <input className="w-full border p-2 pl-8 text-sm border-gray-300" value={config.locationSearch} onChange={e => setConfig({ ...config, locationSearch: e.target.value })} placeholder="City, Place, etc." />
                            <MapPin className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Preview — live GeoChart */}
            <div className="w-full w-full bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm" style={{ height: '320px' }}>
                <GeoChartPreview mapType={config.mapType} selectedRegion={config.selectedRegion} />
            </div>
        </div>
    );
};

// --- CONTACT FORM RENDERER (Shared) ---
const ContactFormRenderer = ({ config }: { config: ContactConfigType }) => {
    const { themeConfig } = useStore();
    return (
        <div
            className="bg-white p-10 w-full max-w-xl shadow-xl border border-gray-200 rounded-sm relative transition-all duration-300 mx-auto"
            style={{
                backgroundColor: config.bgType === 'color' ? config.bgColor : 'white',
                backgroundImage: config.bgType === 'image' && config.bgImage ? `url(${config.bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay if image bg to ensure text readability */}
            {config.bgType === 'image' && <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-sm z-0"></div>}

            <div className={`relative z-10 text-${config.alignment === 'center' ? 'center' : 'left'} mb-8`}>
                {config.heading && <h2 className="text-3xl font-bold mb-2" style={{ color: themeConfig['--primary-color'] }}>{config.heading}</h2>}
                {config.subheading && <p className="text-gray-500 text-sm font-medium">{config.subheading}</p>}
                {config.description && <div className="text-gray-400 text-xs mt-2" dangerouslySetInnerHTML={{ __html: config.description }} />}
            </div>

            <div className="relative z-10 space-y-4">
                {config.fields.map((f: ContactField) => (
                    <div key={f.id}>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        {f.type === 'textarea' ? (
                            <textarea className="w-full border border-gray-300 p-2 text-sm bg-white rounded-sm resize-none h-24" placeholder={f.placeholder} disabled />
                        ) : (
                            <input className="w-full border border-gray-300 p-2 text-sm bg-white rounded-sm" placeholder={f.placeholder} disabled />
                        )}
                    </div>
                ))}

                <div className="flex items-start gap-2 mt-4">
                    <div className="w-4 h-4 border border-gray-300 bg-white mt-0.5 rounded-sm"></div>
                    <span className="text-xs text-gray-500 leading-tight">I have read the Privacy Policy note. I agree that my contact details and questions will be stored permanently.</span>
                </div>

                <div className="pt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Captcha: rcy9rg <RefreshCw className="inline w-3 h-3 ml-1" /></label>
                    <input className="w-full border border-gray-300 p-2 text-sm bg-white rounded-sm" placeholder="Enter Captcha" disabled />
                </div>

                <button
                    className="w-full text-white py-3 font-bold text-sm shadow-md opacity-80 cursor-not-allowed uppercase tracking-wider rounded-sm mt-4"
                    style={{ backgroundColor: themeConfig['--primary-color'] }}
                >
                    {config.buttonText || 'Send Message'}
                </button>
            </div>
        </div>
    );
};

// --- CONTACT FORM EDIT MODAL (New Popup) ---
const ContactFormEditModal = ({ initialConfig, onSave, onCancel }: { initialConfig: ContactConfigType, onSave: (c: ContactConfigType) => void, onCancel: () => void }) => {
    const { themeConfig } = useStore();
    const [activeTab, setActiveTab] = useState<'TEXT' | 'PREVIEW'>('TEXT');
    const [config, setConfig] = useState<ContactConfigType>(initialConfig);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

    // Field Management
    const addField = () => {
        const newField: ContactField = {
            id: `f_${Date.now()}`,
            label: 'New Field',
            placeholder: '',
            type: 'text',
            required: false
        };
        setConfig(prev => ({ ...prev, fields: [...prev.fields, newField] }));
    };

    const updateField = (id: string, updates: Partial<ContactField>) => {
        setConfig(prev => ({
            ...prev,
            fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
        }));
    };

    const deleteField = (id: string) => {
        setConfig(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== id) }));
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === config.fields.length - 1)) return;
        const newFields = [...config.fields];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]];
        setConfig(prev => ({ ...prev, fields: newFields }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setConfig(prev => ({ ...prev, bgImage: url }));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <GenericModal
                title="Edit Contact Form Template"
                onClose={onCancel}
                width="w-[80vw] min-w-[1000px]"
                noFooter={true}
            >
                <div className="flex flex-col h-[75vh] bg-white">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 px-6 mt-2">
                        <button
                            onClick={() => setActiveTab('TEXT')}
                            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'TEXT' ? '' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            style={{
                                color: activeTab === 'TEXT' ? themeConfig['--primary-color'] : undefined,
                                borderBottomColor: activeTab === 'TEXT' ? themeConfig['--primary-color'] : 'transparent'
                            }}
                        >
                            TEXT
                        </button>
                        <button
                            onClick={() => setActiveTab('PREVIEW')}
                            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PREVIEW' ? '' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            style={{
                                color: activeTab === 'PREVIEW' ? themeConfig['--primary-color'] : undefined,
                                borderBottomColor: activeTab === 'PREVIEW' ? themeConfig['--primary-color'] : 'transparent'
                            }}
                        >
                            PREVIEW
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                        {activeTab === 'TEXT' && (
                            <div className="w-full space-y-8 animate-in slide-in-from-left-4 duration-300">

                                {/* Heading Section */}
                                <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                    <h4 className="font-bold text-gray-700 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Heading Section</h4>
                                    <div className="grid grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heading</label>
                                            <input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={config.heading} onChange={(e) => setConfig({ ...config, heading: e.target.value })} placeholder="Form Title" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subheading</label>
                                            <input className="w-full border border-gray-300 p-2 text-sm rounded-sm" value={config.subheading} onChange={(e) => setConfig({ ...config, subheading: e.target.value })} placeholder="Optional Subtitle" />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                        <JoditRichTextEditor
                                            value={config.description}
                                            onChange={(val: string) => setConfig({ ...config, description: val })}
                                            placeholder="Short description..."
                                            height={160}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alignment</label>
                                        <div className="flex gap-4">
                                            {['Center', 'Left'].map(align => (
                                                <button
                                                    key={align}
                                                    onClick={() => setConfig({ ...config, alignment: align.toLowerCase() as ContactConfigType['alignment'] })}
                                                    className={`flex-1 py-2 text-sm font-medium border rounded-sm transition-colors ${config.alignment === align.toLowerCase() ? 'text-white' : 'bg-white text-gray-600'}`}
                                                    style={{ backgroundColor: config.alignment === align.toLowerCase() ? themeConfig['--primary-color'] : '#fff' }}
                                                >
                                                    {align}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Background Section */}
                                <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                    <h4 className="font-bold text-gray-700 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Background Section</h4>
                                    <div className="flex gap-2 mb-4">
                                        <button onClick={() => setConfig({ ...config, bgType: 'none' })} className="flex-1 py-2 text-sm font-bold border rounded-sm transition-colors" style={{ backgroundColor: config.bgType === 'none' ? themeConfig['--primary-color'] : '#fff', color: config.bgType === 'none' ? '#fff' : '#374151' }}>No Background</button>
                                        <button onClick={() => setConfig({ ...config, bgType: 'color' })} className="flex-1 py-2 text-sm font-bold border rounded-sm transition-colors" style={{ backgroundColor: config.bgType === 'color' ? themeConfig['--primary-color'] : '#fff', color: config.bgType === 'color' ? '#fff' : '#374151' }}>Color</button>
                                        <button onClick={() => setConfig({ ...config, bgType: 'image' })} className="flex-1 py-2 text-sm font-bold border rounded-sm transition-colors" style={{ backgroundColor: config.bgType === 'image' ? themeConfig['--primary-color'] : '#fff', color: config.bgType === 'image' ? '#fff' : '#374151' }}>Image</button>
                                    </div>
                                    {config.bgType === 'color' && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Color:</label>
                                            <input type="color" value={config.bgColor || '#ffffff'} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} className="h-8 w-8 border cursor-pointer" />
                                        </div>
                                    )}
                                    {config.bgType === 'image' && (
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50 w-full justify-center cursor-pointer">
                                                <Upload className="w-4 h-4" /> {config.bgImage ? 'Change Image' : 'Upload Image'}
                                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            </label>
                                            {config.bgImage && <img src={config.bgImage} alt="Preview" className="h-20 object-cover border border-gray-300 rounded-sm" />}
                                        </div>
                                    )}
                                </div>

                                {/* Input Fields Section */}
                                <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                                        <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Input Fields</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {config.fields.map((field, idx) => (
                                            <div key={field.id} className="border border-gray-200 bg-white rounded-sm">
                                                <div className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col gap-1">
                                                        <button onClick={() => moveField(idx, 'up')} disabled={idx === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                                                        <button onClick={() => moveField(idx, 'down')} disabled={idx === config.fields.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm text-gray-700">{field.label}</div>
                                                        <div className="text-xs text-gray-400 capitalize">{field.type} {field.required ? '(Required)' : ''}</div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingFieldId(editingFieldId === field.id ? null : field.id)} className="p-1 hover:bg-blue-50 rounded-sm transition-colors" style={{ color: themeConfig['--primary-color'] }}><Settings className="w-4 h-4" /></button>
                                                        <button onClick={() => deleteField(field.id)} className="text-red-500 p-1 hover:bg-red-50 rounded-sm"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>

                                                {/* Inline Field Editor */}
                                                {editingFieldId === field.id && (
                                                    <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-4">
                                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Label</label><input className="w-full border p-1.5 text-sm" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} /></div>
                                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Placeholder</label><input className="w-full border p-1.5 text-sm" value={field.placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })} /></div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                                            <select className="w-full border p-1.5 text-sm" value={field.type} onChange={e => updateField(field.id, { type: e.target.value as ContactField['type'] })}>
                                                                <option value="text">Text</option>
                                                                <option value="email">Email</option>
                                                                <option value="textarea">Text Area</option>
                                                                <option value="number">Number</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-end pb-2">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} />
                                                                <span className="text-sm text-gray-700">Required Field</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={addField}
                                            className="w-full py-2 border-2 border-dashed border-gray-300 font-bold text-sm flex items-center justify-center gap-2 transition-all mt-4"
                                            style={{ color: themeConfig['--text-secondary'] }}
                                        >
                                            <Plus className="w-4 h-4" /> Add New Field
                                        </button>
                                    </div>
                                </div>

                                {/* Button Text */}
                                <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Button Text</label>
                                    <input className="w-full border p-2 text-sm rounded-sm" value={config.buttonText} onChange={(e) => setConfig({ ...config, buttonText: e.target.value })} placeholder="Send Message" />
                                </div>

                            </div>
                        )}

                        {activeTab === 'PREVIEW' && (
                            <div className="flex justify-center p-8 min-h-full animate-in zoom-in-95 duration-300">
                                <ContactFormRenderer config={config} />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 z-10">
                        <button onClick={onCancel} className="px-6 py-2 border bg-white font-bold hover:bg-gray-100 rounded-sm" style={{ color: themeConfig['--text-primary'], borderColor: themeConfig['--border-color'] }}>Cancel</button>
                        <button
                            onClick={() => onSave(config)}
                            className="px-8 py-2 text-white text-sm font-bold rounded-sm shadow-sm hover:opacity-90 flex items-center gap-2 transition-opacity"
                            style={{ backgroundColor: themeConfig['--primary-color'] }}
                        >
                            <Check className="w-4 h-4" /> Save Configuration
                        </button>
                    </div>
                </div>
            </GenericModal>
        </div>,
        document.body
    );
};

// --- MAIN SELECTOR POPUP ---
export const SelectHeaderTemplatePopup = ({ pageId, onClose }: { pageId: string, onClose: () => void }) => {
    const { addContainer, themeConfig } = useStore();
    const [selectedCategory, setSelectedCategory] = useState('HEADER');
    const [previewType, setPreviewType] = useState<string | null>(null);
    const [selectedHeaderId, setSelectedHeaderId] = useState<string | null>(null);
    const [selectedSliderId, setSelectedSliderId] = useState<string | null>(null);
    const [isEditingContact, setIsEditingContact] = useState(false);

    // NEW: Header Configuration State
    const [isConfiguringHeader, setIsConfiguringHeader] = useState(false);
    const [headerConfig, setHeaderConfig] = useState<HeaderConfigType>({
        containerTitle: 'Hero Section',
        heading: '',
        translations: {}
    });

    // Config States
    const [dataGridConfig, setDataGridConfig] = useState({
        title: '',
        source: 'News',
        columns: 3,
        ordering: '123',
        layout: 'grid',
        speed: 5,
        autoplay: false,
        imgPos: 'top',
        border: 'sharp'
    });

    const [contactConfig, setContactConfig] = useState<ContactConfigType>({
        heading: 'Contact Us',
        subheading: 'We would love to hear from you',
        description: '',
        alignment: 'center',
        bgType: 'none',
        bgColor: '#ffffff',
        bgImage: '',
        fields: [
            { id: 'f1', label: 'First Name', placeholder: 'e.g. John', type: 'text', required: true },
            { id: 'f2', label: 'Last Name', placeholder: 'e.g. Doe', type: 'text', required: true },
            { id: 'f3', label: 'Email', placeholder: 'name@example.com', type: 'email', required: true },
            { id: 'f4', label: 'Message', placeholder: 'Your message...', type: 'textarea', required: true }
        ],
        buttonText: 'Send Message'
    });

    // --- NEW: Table View & Map Configurations ---
    const [tableConfig, setTableConfig] = useState<TableConfigType>({
        title: 'Table Container',
        columns: [
            { id: 'c1', header: 'ID' },
            { id: 'c2', header: 'Title' },
            { id: 'c3', header: 'Status' }
        ],
        enableGlobalSearch: true,
        enableColumnSearch: true,
        enableSorting: true
    });

    const [mapConfig, setMapConfig] = useState<MapConfigType>({
        title: 'Map Container',
        mapType: 'World',
        selectedRegion: '',
        locationSearch: ''
    });

    // Helper: Select Logic
    const handleSelect = (tmpl: TemplateItem) => {
        if (selectedCategory === 'HEADER') {
            setSelectedHeaderId(tmpl.id);
            setHeaderConfig(prev => ({ ...prev, heading: tmpl.label })); // Default heading
            setIsConfiguringHeader(true); // Switch to config view
            setSelectedSliderId(null);
        } else if (selectedCategory === 'SLIDER') {
            setSelectedSliderId(tmpl.id);
            setSelectedHeaderId(null);
        }
    };

    // Helper: Global Save Logic
    const handleGlobalSave = () => {
        const id = `c_${Date.now()}`;
        let newContainer: Container | null = null;

        if (selectedCategory === 'HEADER' && selectedHeaderId) {
            const tmpl = TEMPLATES.HEADER.find(t => t.id === selectedHeaderId);
            if (tmpl) {
                // FIXED: Explicitly set background type and image for persistence
                let bgType = 'none';
                let bgImage = '';
                let bgColor = '#ffffff';
                let minHeight = 'medium';

                if (tmpl.id === 'hero_img') {
                    bgType = 'image';
                    bgImage = HERO_IMG;
                } else if (tmpl.id === 'visual_text') {
                    bgType = 'image';
                    bgImage = VISUAL_TEXT_IMG;
                    minHeight = 'full';
                }

                // Construct Multilingual Text Objects
                const titleObj: MultilingualText = {
                    en: headerConfig.heading,
                    de: headerConfig.translations['de']?.heading || headerConfig.heading,
                    fr: headerConfig.translations['fr']?.heading || headerConfig.heading,
                    es: headerConfig.translations['es']?.heading || headerConfig.heading
                };

                const containerTitleObj: MultilingualText = {
                    en: headerConfig.containerTitle,
                    de: headerConfig.translations['de']?.containerTitle || headerConfig.containerTitle,
                    fr: headerConfig.translations['fr']?.containerTitle || headerConfig.containerTitle,
                    es: headerConfig.translations['es']?.containerTitle || headerConfig.containerTitle
                };

                newContainer = {
                    id,
                    pageId: pageId,
                    type: tmpl.type,
                    order: 99,
                    isVisible: true,
                    settings: {
                        templateId: tmpl.id,
                        templateVariant: tmpl.id === 'hero_img' ? 1 : (tmpl.id === 'page_content' ? 1 : 2),
                        minHeight,
                        bgType, // Important for persistence
                        bgImage, // Important for persistence
                        bgColor
                    },
                    content: {
                        title: titleObj,
                        containerTitle: containerTitleObj
                    }
                };
            }
        } else if (selectedCategory === 'SLIDER' && selectedSliderId) {
            const tmpl = TEMPLATES.SLIDER.find(t => t.id === selectedSliderId);
            if (tmpl) {
                newContainer = {
                    id,
                    pageId: pageId,
                    type: tmpl.type,
                    order: 99,
                    isVisible: true,
                    settings: {
                        templateId: tmpl.id,
                        templateVariant: tmpl.id === 'img_gallery' ? 1 : 0
                    },
                    content: { title: { en: tmpl.label, de: tmpl.label, fr: tmpl.label, es: tmpl.label } }
                };
            }
        } else if (selectedCategory === 'DATA_GRID') {
            if (!dataGridConfig.title) return;
            newContainer = {
                id,
                pageId: pageId,
                type: ContainerType.CARD_GRID,
                order: 99,
                isVisible: true,
                settings: dataGridConfig,
                content: { title: { en: dataGridConfig.title, de: dataGridConfig.title, fr: dataGridConfig.title, es: dataGridConfig.title } }
            };
        } else if (selectedCategory === 'CONTACT_FORM') {
            newContainer = {
                id,
                pageId: pageId,
                type: ContainerType.CONTACT_FORM,
                order: 99,
                isVisible: true,
                settings: contactConfig,
                content: { title: { en: contactConfig.heading, de: contactConfig.heading, fr: contactConfig.heading, es: contactConfig.heading } }
            };
        } else if (selectedCategory === 'TABLE_VIEW') {
            if (!tableConfig.title) return;
            newContainer = {
                id,
                pageId: pageId,
                type: ContainerType.TABLE,
                order: 99,
                isVisible: true,
                settings: tableConfig,
                content: { title: { en: tableConfig.title, de: tableConfig.title, fr: tableConfig.title, es: tableConfig.title } }
            };
        } else if (selectedCategory === 'MAP') {
            if (!mapConfig.title) return;
            newContainer = {
                id,
                pageId: pageId,
                type: ContainerType.MAP,
                order: 99,
                isVisible: true,
                settings: mapConfig,
                content: { title: { en: mapConfig.title, de: mapConfig.title, fr: mapConfig.title, es: mapConfig.title } }
            };
        }

        if (newContainer) {
            addContainer(pageId, newContainer);
            onClose();
        }
    };

    const isSelected = (tmpl: TemplateItem) => {
        if (selectedCategory === 'HEADER') return selectedHeaderId === tmpl.id;
        if (selectedCategory === 'SLIDER') return selectedSliderId === tmpl.id;
        return false;
    };

    const isSaveDisabled = () => {
        if (selectedCategory === 'HEADER') return !selectedHeaderId;
        if (selectedCategory === 'SLIDER') return !selectedSliderId;
        if (selectedCategory === 'DATA_GRID') return !dataGridConfig.title;
        if (selectedCategory === 'TABLE_VIEW') return !tableConfig.title || tableConfig.columns.length === 0;
        if (selectedCategory === 'MAP') return !mapConfig.title;
        return false; // Contact Form always selectable
    };

    // --- FULL SCREEN PREVIEW WRAPPER ---
    // --- FULL SCREEN PREVIEW WRAPPER ---
    const FullScreenPreviewWrapper = () => {
        if (!previewType) return null;
        return createPortal(
            <div className="fixed inset-0 z-[130] bg-black animate-in fade-in duration-200">
                {(selectedCategory === 'HEADER') && <HeaderPreview type={previewType} onClose={() => setPreviewType(null)} />}
                {(selectedCategory === 'SLIDER') && <SliderPreview type={previewType} onClose={() => setPreviewType(null)} />}
            </div>,
            document.body
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative z-50">
                <GenericModal
                    title={`Select ${TABS.find(t => t.id === selectedCategory)?.label} Template`}
                    onClose={onClose}
                    width="w-[85vw] min-w-[1000px] max-w-[1200px]"
                    noFooter={true}
                    headerIcons={null}
                >
                    <div className="flex flex-col h-[75vh] bg-white">
                        <div className="flex flex-1 overflow-hidden relative">
                            {/* LEFT SIDEBAR TABS */}
                            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col pt-6 flex-shrink-0">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setSelectedCategory(tab.id); setIsConfiguringHeader(false); }}
                                        className={`text-left px-6 py-4 text-sm font-bold flex justify-between items-center transition-all border-l-4 ${selectedCategory === tab.id ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 border-transparent hover:text-gray-700'}`}
                                        style={{
                                            color: selectedCategory === tab.id ? themeConfig['--primary-color'] : 'inherit',
                                            borderLeftColor: selectedCategory === tab.id ? themeConfig['--primary-color'] : 'transparent'
                                        }}
                                    >
                                        {tab.label}
                                        {selectedCategory === tab.id && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>

                            {/* CONTENT AREA */}
                            <div className="flex-1 bg-white overflow-hidden relative flex flex-col">
                                {/* Header & Slider: List Selection */}
                                {(selectedCategory === 'HEADER' || selectedCategory === 'SLIDER') && !isConfiguringHeader && (
                                    <div className="p-10 overflow-y-auto h-full bg-gray-50">
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                                            {TEMPLATES[selectedCategory].map((tmpl: TemplateItem) => (
                                                <div
                                                    key={tmpl.id}
                                                    onClick={() => handleSelect(tmpl)}
                                                    className={`
                                                        bg-white border rounded-sm shadow-sm transition-all flex flex-col h-full group overflow-hidden cursor-pointer
                                                        ${isSelected(tmpl) ? 'ring-2' : 'hover:shadow-xl hover:-translate-y-1'}
                                                    `}
                                                    style={{
                                                        borderColor: isSelected(tmpl) ? themeConfig['--primary-color'] : '#e5e7eb',
                                                        boxShadow: isSelected(tmpl) ? `0 0 0 2px ${themeConfig['--primary-color']}33` : 'none'
                                                    }}
                                                >
                                                    {/* Top: Show Preview link */}
                                                    <div className="px-5 pt-4 flex justify-end items-center">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setPreviewType(tmpl.id); }}
                                                            className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-80"
                                                            style={{ color: themeConfig['--primary-color'] }}
                                                        >
                                                            Show Preview <span className="text-[10px]">↗</span>
                                                        </button>
                                                        {isSelected(tmpl) && (
                                                            <div className="ml-2 text-white rounded-full p-1 shadow-md" style={{ backgroundColor: themeConfig['--primary-color'] }}><Check className="w-3.5 h-3.5" /></div>
                                                        )}
                                                    </div>

                                                    {/* Title & Description */}
                                                    <div className="px-5 pt-3 pb-2 text-center h-[120px] overflow-hidden">
                                                        <h4 className="font-bold text-sm mb-2" style={{ color: themeConfig['--primary-color'] }}>{tmpl.label}</h4>
                                                        <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs mx-auto">{tmpl.desc}</p>
                                                    </div>

                                                    {/* Skeleton Preview at bottom */}
                                                    <div className="bg-white relative overflow-hidden flex items-center justify-center p-4 mt-auto">
                                                        <div className="w-full h-[160px] border border-gray-100 rounded-md overflow-hidden relative">
                                                            <SkeletonPreview previewId={tmpl.previewId} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Header Config Wizard */}
                                {selectedCategory === 'HEADER' && isConfiguringHeader && (
                                    <HeaderConfigPanel
                                        config={headerConfig}
                                        setConfig={setHeaderConfig}
                                        onBack={() => setIsConfiguringHeader(false)}
                                    />
                                )}

                                {/* Data Grid */}
                                {selectedCategory === 'DATA_GRID' && (
                                    <DataGridConfigPanel config={dataGridConfig} setConfig={setDataGridConfig} />
                                )}

                                {/* Table View */}
                                {selectedCategory === 'TABLE_VIEW' && (
                                    <TableConfigPanel config={tableConfig} setConfig={setTableConfig} />
                                )}

                                {/* Map */}
                                {selectedCategory === 'MAP' && (
                                    <MapConfigPanel config={mapConfig} setConfig={setMapConfig} />
                                )}

                                {/* Contact Form */}
                                {selectedCategory === 'CONTACT_FORM' && (
                                    <div className="p-8 h-full bg-gray-50 flex flex-col items-center justify-center overflow-y-auto">
                                        <div className="relative group w-full max-w-xl mx-auto">
                                            <div className="absolute top-4 right-4 z-20">
                                                <button
                                                    onClick={() => setIsEditingContact(true)}
                                                    className="p-2 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: themeConfig['--primary-color'] }}
                                                    title="Edit Contact Form"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {/* Preview Card */}
                                            <ContactFormRenderer config={contactConfig} />
                                        </div>
                                        <p className="text-gray-400 text-xs mt-6">Click the pencil icon to customize the form.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* GLOBAL FOOTER */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 flex-shrink-0 z-10">
                            <button onClick={onClose} className="px-6 py-2 border bg-white font-bold hover:bg-gray-100 rounded-sm" style={{ color: themeConfig['--text-primary'], borderColor: themeConfig['--border-color'] }}>Cancel</button>
                            <button
                                onClick={handleGlobalSave}
                                disabled={isSaveDisabled()}
                                className={`px-8 py-2 text-white text-sm font-bold rounded-sm shadow-sm flex items-center gap-2 transition-opacity ${isSaveDisabled() ? 'bg-gray-300 cursor-not-allowed' : 'hover:opacity-90'}`}
                                style={{ backgroundColor: isSaveDisabled() ? undefined : themeConfig['--primary-color'] }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </GenericModal>
            </div>

            {/* Child Modals / Overlays */}
            <FullScreenPreviewWrapper />
            {isEditingContact && (
                <ContactFormEditModal
                    initialConfig={contactConfig}
                    onSave={(newConfig) => { setContactConfig(newConfig); setIsEditingContact(false); }}
                    onCancel={() => setIsEditingContact(false)}
                />
            )}
        </div>,
        document.body
    );
};

export const ContainerTemplateSelector = ({ pageId, onClose }: { pageId: string, onClose: () => void }) => {
    return <SelectHeaderTemplatePopup pageId={pageId} onClose={onClose} />;
};
