import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore, getLocalizedText, getItemTranslation, getGlobalTranslation, getTranslation, GLOBAL_DEFAULT_IMAGE } from '../store';
import { useSPContext } from '../contexts/SPServiceContext';
import { ContainerType, ViewMode, NavItem, ModalType, ContactQuery, LanguageCode } from '../types';
import {
    Pencil, Type as TypeIcon, CheckCircle, Check,
    AlertTriangle, ChevronDown, MapPin, Mail, Phone,
    Linkedin, Facebook, Twitter, Instagram, ChevronLeft, ChevronRight,
    RefreshCw, FileText, FileSpreadsheet, Presentation, Link as LinkIcon, File,
    Globe, Search, ArrowUp, ArrowDown, X, Info
} from 'lucide-react';
import { ReadMoreModal } from './modals/ReadMoreModal';
import { EditTrigger } from './modals/SharedModals';
import { NewsEditor } from './modals/NewsManager';
import { EventEditor } from './modals/EventManager';
import { DocumentEditor } from './modals/DocumentManager';
import { ContactEditor } from './modals/ContactManager';
import { ContainerItemEditor } from './modals/ContainerItemManager';
import { SliderItemEditor, SliderManager } from './modals/SliderManager';


const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

// --- GEOCHART COMPONENT ---
const COUNTRY_ISO: Record<string, string> = {
    'USA': 'US', 'Germany': 'DE', 'France': 'FR', 'UK': 'GB', 'India': 'IN', 'China': 'CN'
};
const CONTINENT_CODE: Record<string, string> = {
    'Europe': '150', 'Asia': '142', 'North America': '021', 'South America': '005', 'Africa': '002', 'Oceania': '009'
};
const CONTINENT_COUNTRIES: Record<string, string[]> = {
    'Europe': ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'PL', 'SE', 'NO', 'FI', 'DK', 'AT', 'BE', 'CH', 'PT', 'GR', 'CZ', 'HU', 'RO', 'UA'],
    'Asia': ['CN', 'IN', 'JP', 'KR', 'ID', 'TH', 'VN', 'MY', 'PH', 'BD', 'PK', 'IR', 'TR', 'SA', 'AE'],
    'North America': ['US', 'CA', 'MX', 'CU', 'GT', 'PA', 'CR', 'DO'],
    'South America': ['BR', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'BO', 'PY', 'UY'],
    'Africa': ['ZA', 'NG', 'ET', 'EG', 'KE', 'TZ', 'GH', 'DZ', 'MA', 'MZ', 'CI', 'MG'],
    'Oceania': ['AU', 'NZ', 'PG', 'FJ', 'SB']
};

const buildChartData = (mapType: string, selectedRegion?: string, selectedState?: string) => {
    if (mapType === 'Country' && selectedRegion) {
        const iso = COUNTRY_ISO[selectedRegion] || selectedRegion;
        // If a specific state is selected, highlight only that state
        if (selectedState) {
            return [['Region', 'Value'], [selectedState, 100]];
        }
        return [['Country', 'Value'], [iso, 100]];
    }
    if (mapType === 'Continent' && selectedRegion) {
        const countries = CONTINENT_COUNTRIES[selectedRegion] || [];
        return [['Country', 'Value'], ...countries.map((c, i) => [c, 80 + i * 5])];
    }
    // World: all major countries
    return [
        ['Country', 'Value'],
        ['DE', 200], ['FR', 150], ['GB', 180], ['IN', 220], ['US', 300],
        ['CN', 260], ['BR', 140], ['AU', 110], ['CA', 130], ['ZA', 90],
        ['JP', 170], ['RU', 160], ['IT', 145], ['ES', 135], ['AR', 120]
    ];
};

const GeoChartMap = ({ mapType, selectedRegion, selectedState, height = 400 }: {
    mapType: string; selectedRegion?: string; selectedState?: string; height?: number;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const getRegion = () => {
        if (mapType === 'Country' && selectedRegion) return COUNTRY_ISO[selectedRegion] || 'world';
        if (mapType === 'Continent' && selectedRegion) return CONTINENT_CODE[selectedRegion] || 'world';
        return 'world';
    };

    const drawChart = () => {
        const g = (window as any).google;
        if (!containerRef.current || !g?.visualization) return;
        // Resolve CSS variable to actual hex — GeoChart does NOT support CSS variables
        const rawColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color').trim();
        const resolvedColor = rawColor.startsWith('#') || rawColor.startsWith('rgb') ? rawColor : '#2563eb';
        const region = getRegion();

        // Use 'provinces' resolution for state-level mapping within a country
        const resolution = (mapType === 'Country' && selectedRegion) ? 'provinces' : 'countries';

        const data = g.visualization.arrayToDataTable(buildChartData(mapType, selectedRegion, selectedState));
        const options = {
            region,
            displayMode: 'region',
            resolution,
            colorAxis: { minValue: 0, colors: ['#dbeafe', resolvedColor] },
            backgroundColor: '#f0f4ff',
            datalessRegionColor: '#e2e8f0',
            defaultColor: '#e2e8f0',
            legend: 'none',
        };
        const chart = new g.visualization.GeoChart(containerRef.current);
        chart.draw(data, options);
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
                const wait = setInterval(() => {
                    if ((window as any).google?.visualization) { clearInterval(wait); drawChart(); }
                }, 200);
                return () => clearInterval(wait);
            }
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/charts/loader.js';
            script.onload = () => {
                (window as any).google.charts.load('current', { packages: ['geochart'] });
                (window as any).google.charts.setOnLoadCallback(drawChart);
            };
            document.head.appendChild(script);
        }
    }, [mapType, selectedRegion, selectedState]);

    return <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} />;
};

const renderRichText = (html: string, className?: string) => {
    if (!html) return null;
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

// --- HELPER: DOCUMENT ICONS ---
const getDocIcon = (type: string) => {
    switch (type) {
        case 'Word': return <FileText className="w-16 h-16 text-blue-600 opacity-80" />;
        case 'Excel': return <FileSpreadsheet className="w-16 h-16 text-green-600 opacity-80" />;
        case 'PDF': return <File className="w-16 h-16 text-red-500 opacity-80" />;
        case 'PPT':
        case 'Presentations': return <Presentation className="w-16 h-16 text-orange-500 opacity-80" />;
        case 'Link': return <LinkIcon className="w-16 h-16 text-sky-500 opacity-80" />;
        default: return <File className="w-16 h-16 text-gray-400 opacity-80" />;
    }
};

interface ComponentRendererProps {
    container: any;
    lang: LanguageCode;
    pageTitle?: string;
}

// --- RENDERER 1: HEADER / HERO ---
const HeaderRenderer = ({ container, lang }: ComponentRendererProps) => {
    const { settings, content } = container;

    // Resolve color for a given color setting (site/black/white/custom)
    const resolveColor = (colorSetting: string, customHex?: string): { className?: string; style?: React.CSSProperties } => {
        if (colorSetting === 'custom' && customHex) return { style: { color: customHex } };
        if (colorSetting === 'white') return { className: 'text-white' };
        if (colorSetting === 'black') return { className: 'text-black' };
        return { className: 'text-[var(--primary-color)]' }; // 'site' or default
    };

    const titleColor = resolveColor(settings.titleColor, settings.titleCustomColor);
    const subtitleColor = resolveColor(settings.subtitleColor || settings.titleColor, settings.subtitleCustomColor || settings.titleCustomColor);
    const descColor = resolveColor(settings.descColor || settings.titleColor, settings.descCustomColor || settings.titleCustomColor);
    const textAlign = settings.align === 'left' ? 'text-left' : (settings.align === 'right' ? 'text-right' : 'text-center');
    const letterCase = settings.letterCase === 'uppercase' ? 'uppercase' : (settings.letterCase === 'lowercase' ? 'lowercase' : (settings.letterCase === 'capitalize' ? 'capitalize' : 'normal-case'));

    const ContentBlock = () => (
        <div className={`relative z-10 max-w-5xl mx-auto w-full ${settings.align === 'center' ? 'items-center' : ''} ${settings.bgType === 'layout' ? 'px-8' : ''}`}>
            <h1
                className={`font-bold mb-6 tracking-tight drop-shadow-md ${titleColor.className || ''} ${letterCase}`}
                style={titleColor.style}
            >
                {getLocalizedText(content.title, lang)}
            </h1>

            {getLocalizedText(content.subtitle, lang) && (
                <h2
                    className={`font-medium opacity-95 mb-4 ${subtitleColor.className || ''}`}
                    style={subtitleColor.style}
                >
                    {getLocalizedText(content.subtitle, lang)}
                </h2>
            )}

            <div
                className={`text-lg opacity-90 max-w-3xl leading-relaxed ${settings.align === 'center' ? 'mx-auto' : ''} ${descColor.className || ''}`}
                style={descColor.style}
                dangerouslySetInnerHTML={{ __html: getLocalizedText(content.description, lang) || '' }}
            />

            {settings.btnEnabled && settings.btnName && (
                <div className={`mt-8 ${settings.align === 'center' ? 'flex justify-center' : (settings.align === 'right' ? 'flex justify-end' : '')}`}>
                    {settings.btnUrl ? (
                        <a
                            href={settings.btnUrl}
                            target={settings.btnUrl.startsWith('http') ? '_blank' : '_self'}
                            rel={settings.btnUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="inline-block px-8 py-3 bg-[var(--primary-color)] text-white font-bold text-sm rounded-sm shadow-md hover:opacity-90 transition-all hover:shadow-lg active:scale-[0.98] uppercase tracking-wider no-underline"
                        >
                            {settings.btnName}
                        </a>
                    ) : (
                        <button className="px-8 py-3 bg-[var(--primary-color)] text-white font-bold text-sm rounded-sm shadow-md hover:opacity-90 transition-all hover:shadow-lg active:scale-[0.98] uppercase tracking-wider">
                            {settings.btnName}
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    // New "Layout Design Section" support (Split Screen)
    if (settings.bgType === 'layout') {
        const isImgLeft = settings.layoutVariant === 'img_left';

        return (
            <div className={`w-full flex flex-col md:flex-row min-h-[600px] ${isImgLeft ? '' : 'flex-row-reverse'}`}>
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative bg-gray-200">
                    {settings.bgImage ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${settings.bgImage})` }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-sm font-bold uppercase tracking-widest">No Image Selected</span>
                        </div>
                    )}
                </div>
                {/* Text Side */}
                <div className={`w-full md:w-1/2 flex items-center justify-center p-12 ${settings.bgColor ? '' : 'bg-white'}`} style={{ backgroundColor: settings.bgColor || 'white' }}>
                    <div className={textAlign}>
                        <ContentBlock />
                    </div>
                </div>
            </div>
        );
    }

    // Standard Styles
    const bgStyle: React.CSSProperties = {
        backgroundColor: settings.bgType === 'color' ? settings.bgColor : (settings.bgType === 'none' ? 'transparent' : 'gray'),
        backgroundImage: settings.bgType === 'image' && settings.bgImage ? `url(${settings.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: settings.minHeight === 'full' ? '100vh' : '600px',
    };

    return (
        <div className={`w-full relative flex flex-col justify-center py-20 px-6 ${textAlign}`} style={bgStyle}>
            {settings.bgType === 'image' && <div className="absolute inset-0 bg-black/40 z-0"></div>}
            <ContentBlock />
        </div>
    );
};

// --- RENDERER 2: SLIDER ---
const SliderRenderer = ({ container, lang }: ComponentRendererProps) => {
    const tmplId = container.settings.templateId;
    const [current, setCurrent] = useState(0);
    const [editingSlide, setEditingSlide] = useState<any | null>(null);
    const [showSliderManager, setShowSliderManager] = useState(false);
    const { sliderItems, updateSliderItem, deleteSliderItem, viewMode } = useStore();

    const taggedIds = container.settings.taggedItems || [];
    const taggedSliderItems = taggedIds
        .map((id: string) => sliderItems.find(item => item.id === id))
        .filter(Boolean) as any[];

    // Dynamic slides from tagged ImageSlider items, fallback to container slides
    const dynamicSlides = taggedSliderItems.length > 0
        ? taggedSliderItems.map((item: any) => ({
            id: item.id,
            title: getItemTranslation(item, lang, 'title') || item.title || '',
            sub: getItemTranslation(item, lang, 'subtitle') || item.subtitle || '',
            subtitle: getItemTranslation(item, lang, 'subtitle') || item.subtitle || '',
            desc: getItemTranslation(item, lang, 'description') || item.description || '',
            cta: getItemTranslation(item, lang, 'ctaText') || item.ctaText || '',
            url: item.ctaUrl || '',
            img: item.imageUrl || '',
            image: item.imageUrl || '',
            originalItem: item
        }))
        : (container.settings.slides && container.settings.slides.length > 0 ? container.settings.slides : []);

    // Ensure current index is valid
    useEffect(() => {
        if (current >= dynamicSlides.length) {
            setCurrent(0);
        }
    }, [dynamicSlides.length, current]);

    const activeSlide = dynamicSlides[current] || dynamicSlides[0];
    const sliderTitle = getLocalizedText(container.content.title, lang);
    const sliderSubheading = container.settings.subheading
        ? (getLocalizedText(container.settings.subheading, lang) || container.settings.subheading)
        : '';

    const next = () => setCurrent((p) => dynamicSlides.length ? (p + 1) % dynamicSlides.length : 0);
    const prev = () => setCurrent((p) => dynamicSlides.length ? (p - 1 + dynamicSlides.length) % dynamicSlides.length : 0);

    // Auto Play Logic
    useEffect(() => {
        if (container.settings.autoplay && dynamicSlides.length > 1) {
            const timer = setInterval(next, (container.settings.speed || 5) * 1000);
            return () => clearInterval(timer);
        }
    }, [container.settings.autoplay, container.settings.speed, dynamicSlides.length]);

    if (!activeSlide) return <div className="p-10 text-center">No slides available</div>;

    // Image Gallery Carousel
    if (tmplId === 'img_gallery' || container.settings.templateVariant === 1) {
        const showTitle = container.settings.showSlideTitle !== false;
        const showDesc = container.settings.showSlideDescription !== false;
        const sectionSubheading = container.settings.subheading;
        const slideSubtitle = getLocalizedText(activeSlide.sub || activeSlide.subtitle, lang);
        const slideDesc = getLocalizedText(activeSlide.desc, lang);
        // Avoid duplicate: show subtitle separately only when it's different from desc
        const showSubtitleSeparately = slideSubtitle && slideSubtitle !== slideDesc;

        return (
            <div className="w-full bg-white relative py-16 flex items-center justify-center">
                {editingSlide && (
                    <SliderItemEditor
                        item={editingSlide}
                        onSave={async (updated: any) => { await updateSliderItem(updated); setEditingSlide(null); }}
                        onCancel={() => setEditingSlide(null)}
                        onDelete={async (id: string) => { await deleteSliderItem(id); setEditingSlide(null); }}
                    />
                )}
                <div className="w-full max-w-6xl px-8">
                    <div className="mb-8">
                        {sliderTitle && (
                            <h1 className="text-3xl font-bold text-[var(--primary-color)]">{sliderTitle}</h1>
                        )}
                        {sectionSubheading && (
                            <p className="text-base text-gray-500 mt-2">{getLocalizedText(sectionSubheading, lang) || sectionSubheading}</p>
                        )}
                    </div>
                    <div className="flex flex-col lg:flex-row gap-12 items-center bg-white">
                        <div className="flex-1 space-y-6">
                            {showTitle && (
                                <div className="flex items-center gap-2 group/slide">
                                    <h2 className="text-2xl font-bold text-gray-800">{getLocalizedText(activeSlide.title, lang)}</h2>
                                    {activeSlide.originalItem && (
                                        <button
                                            onClick={() => setEditingSlide(activeSlide.originalItem)}
                                            className="opacity-0 group-hover/slide:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                                            title="Edit slide"
                                        >
                                            <Pencil className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            )}
                            {showDesc && (
                                <>
                                    {showSubtitleSeparately && renderRichText(slideSubtitle, "text-lg text-gray-500 font-medium")}
                                    {slideDesc && renderRichText(slideDesc, "text-sm text-gray-600 leading-relaxed")}
                                </>
                            )}
                            {activeSlide.cta && (
                                <button className="px-6 py-2 bg-[var(--primary-color)] text-white font-bold rounded-sm shadow-sm">{getLocalizedText(activeSlide.cta, lang)}</button>
                            )}
                            <div className="flex gap-2 pt-4">
                                <button onClick={prev} className="p-2 bg-gray-200 rounded-sm hover:bg-gray-300"><ChevronLeft className="w-4 h-4" style={{ color: 'var(--icon-color)' }} /></button>
                                <button onClick={next} className="p-2 bg-[var(--primary-color)] text-white rounded-sm hover:opacity-90"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="flex-1 w-full h-[400px] relative">
                            <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl relative">
                                <img src={activeSlide.img || activeSlide.image || GLOBAL_DEFAULT_IMAGE} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    {/* Slide nav tabs */}
                    <div className="flex gap-6 mt-8 border-t border-gray-100 pt-4">
                        {dynamicSlides.map((slide: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`flex items-start gap-2 text-left transition-colors ${idx === current ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <span className="text-xl font-bold">{String(idx + 1).padStart(2, '0')}</span>
                                <span className="text-xs font-bold uppercase tracking-wider mt-1">{getLocalizedText(slide.title, lang)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }




    return (
        <div className="w-full bg-white">
            {/* SliderManager Modal */}
            {showSliderManager && (
                <SliderManager onClose={() => setShowSliderManager(false)} />
            )}

            {/* Section Header */}
            {(sliderTitle || sliderSubheading) && (
                <div className="px-8 pt-10 pb-4 max-w-7xl mx-auto">
                    {sliderTitle && (
                        <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-1">{sliderTitle}</h2>
                    )}
                    {sliderSubheading && (
                        <p className="text-sm text-gray-500">{sliderSubheading}</p>
                    )}
                </div>
            )}

            {/* Full-width Slider with outside arrows */}
            <div className="relative flex items-center">
                {/* Left Arrow — outside image */}
                {container.settings.arrows !== false && (
                    <button
                        onClick={prev}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 shadow rounded-full hover:bg-gray-50 transition-colors z-10 ml-2"
                    >
                        <ChevronLeft className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    </button>
                )}

                {/* Image Area */}
                <div className="flex-1 relative overflow-hidden bg-gray-900" style={{ height: '480px' }}>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                        style={{
                            backgroundImage: `url(${activeSlide.img || activeSlide.image || GLOBAL_DEFAULT_IMAGE})`,
                        }}
                    />
                    {/* Dark gradient at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Slide title + pencil at bottom overlay */}
                    <div className="absolute bottom-0 inset-x-0 px-6 pb-5 flex items-end justify-between">
                        <div className="flex items-center gap-2">
                            {container.settings.showSlideTitle !== false && (
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                                    {getLocalizedText(activeSlide.title, lang)}
                                </h3>
                            )}
                            {viewMode === ViewMode.EDIT && (
                                <button
                                    onClick={() => setShowSliderManager(true)}
                                    className="text-white/70 hover:text-white transition-colors"
                                    title="Manage slides"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {/* Dots navigation */}
                        <div className="flex items-center gap-1.5">
                            {dynamicSlides.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`rounded-full transition-all ${i === current
                                        ? 'w-4 h-2 bg-white'
                                        : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Arrow — outside image */}
                {container.settings.arrows !== false && (
                    <button
                        onClick={next}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 shadow rounded-full hover:bg-gray-50 transition-colors z-10 mr-2"
                    >
                        <ChevronRight className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    </button>
                )}
            </div>
        </div>
    );
};

// --- RENDERER 3: DATA GRID ---
const DataGridRenderer = ({ container, lang }: ComponentRendererProps) => {
    const { settings } = container;
    const {
        news, events, documents, pages, containerItems, contacts,
        updateNews, updateEvent, updateDocument, updateContainerItem, updateContact,
        deleteNews, deleteEvent, deleteDocument, deleteContainerItem, deleteContact,
        setCurrentPage,
        viewMode
    } = useStore();
    const isSlider = settings.layout === 'slider';
    const cols = settings.columns || 3;
    const scrollContainer = useRef<HTMLDivElement>(null);
    const [activeReadMoreItem, setActiveReadMoreItem] = useState<{ item: any, index: number } | null>(null);
    const [editingItem, setEditingItem] = useState<{ item: any, type: string } | null>(null);

    let allItems: any[] = [];

    if (settings.source === 'News') {
        allItems = news.map(n => ({
            id: n.id,
            title: getItemTranslation(n, lang, 'title'),
            desc: getItemTranslation(n, lang, 'description'),
            date: n.publishDate,
            img: n.imageUrl,
            status: n.status,
            readMoreText: getItemTranslation(n, lang, 'readMoreText'),
            translations: n.translations,
            originalItem: n
        }));
    } else if (settings.source === 'Event') {
        allItems = events.map(e => ({
            id: e.id,
            title: getItemTranslation(e, lang, 'title'),
            desc: getItemTranslation(e, lang, 'description'),
            date: e.startDate,
            endDate: e.endDate,
            img: e.imageUrl,
            status: e.status,
            readMoreText: getItemTranslation(e, lang, 'readMoreText'),
            translations: e.translations,
            originalItem: e
        }));
    } else if (settings.source === 'Document') {
        allItems = documents.map(d => ({
            id: d.id,
            title: getItemTranslation(d, lang, 'title'),
            desc: getItemTranslation(d, lang, 'description'),
            date: d.date,
            img: '',
            status: d.status,
            type: d.type,
            readMoreText: getItemTranslation(d, lang, 'readMoreText'),
            translations: d.translations,
            originalItem: d
        }));
    } else if (settings.source === 'Smart Pages') {
        allItems = pages.map(p => ({
            id: p.id,
            title: getLocalizedText(p.title, lang),
            desc: p.description || '',
            date: p.modifiedDate,
            img: '',
            status: p.status,
            originalItem: p
        }));
    } else if (settings.source === 'Contacts' || settings.source === 'Contact') {
        allItems = contacts.map(c => ({
            id: c.id,
            title: getItemTranslation(c, lang, 'fullName'),
            desc: getItemTranslation(c, lang, 'description') || (getItemTranslation(c, lang, 'jobTitle') + (c.company ? ` - ${getItemTranslation(c, lang, 'company')} ` : '')),
            date: c.createdDate,
            img: c.imageUrl || GLOBAL_DEFAULT_IMAGE,
            status: c.status,
            readMoreText: '',
            translations: c.translations,
            originalItem: c
        }));
    } else if (settings.source === 'Container Items') {
        allItems = containerItems.map(item => ({
            id: item.id,
            title: getItemTranslation(item, lang, 'title'),
            desc: getItemTranslation(item, lang, 'description'),
            date: item.createdDate || new Date().toISOString(),
            img: item.imageUrl || '',
            status: item.status,
            originalItem: item
        }));
    } else {
        allItems = [];
    }

    const taggedIds = settings.taggedItems || [];
    const items = taggedIds.map((id: string) => allItems.find(i => i.id === id)).filter(Boolean);

    const gapSize = settings.spacing === 'compact' ? 1 : (settings.spacing === 'wide' ? 3 : 2);
    const spacingClass = settings.spacing === 'compact' ? 'gap-4' : (settings.spacing === 'wide' ? 'gap-12' : 'gap-8');

    const cardWidth = isSlider
        ? `calc((100% - ${(cols - 1) * gapSize}rem) / ${cols})`
        : 'auto';

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainer.current) {
            const containerWidth = scrollContainer.current.clientWidth;
            const scrollAmount = containerWidth + (gapSize * 16);

            scrollContainer.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (isSlider && settings.autoplay) {
            const interval = setInterval(() => {
                if (scrollContainer.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
                    if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
                        scrollContainer.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scroll('right');
                    }
                }
            }, (settings.speed || 5) * 1000);
            return () => clearInterval(interval);
        }
    }, [isSlider, settings.autoplay, settings.speed]);

    const borderClass = settings.border === 'rounded' ? 'rounded-md' : (settings.border === 'circle' ? 'rounded-xl' : 'rounded-none');

    // Helper: Convert number to Roman Numeral
    const toRoman = (num: number): string => {
        const lookup: [string, number][] = [["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90], ["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]];
        let roman = "";
        for (const [letter, value] of lookup) {
            while (num >= value) {
                roman += letter;
                num -= value;
            }
        }
        return roman;
    };

    // Helper: Get Label based on ordering type
    const getOrderedLabel = (index: number): string => {
        const n = index + 1;
        switch (settings.ordering) {
            case '123': return n.toString().padStart(2, '0');
            case 'III': return toRoman(n);
            case 'IIIII': return 'I'.repeat(n);
            case 'ABC': return String.fromCharCode(64 + n); // A, B, C...
            case 'abc': return String.fromCharCode(96 + n); // a, b, c...
            case 'dots': return '...';
            default: return '';
        }
    };

    const isNumbered = settings.ordering && settings.ordering !== 'none';
    const bgStyle = { backgroundColor: settings.bgColor || 'transparent' };

    // Strict Layout Classes Calculation
    const getLayoutClasses = () => {
        const pos = settings.imgPos || 'top';
        switch (pos) {
            case 'left': return { card: 'flex-row items-center', img: 'w-24 h-24 m-4' };
            case 'right': return { card: 'flex-row-reverse items-center', img: 'w-24 h-24 m-4' };
            case 'none': return { card: 'flex-col', img: 'hidden' };
            default: return { card: 'flex-col', img: 'w-full h-48' }; // Top
        }
    };
    const layout = getLayoutClasses();

    return (
        <div className={`py-16 px-6 max-w-7xl mx-auto relative group/slider`} style={bgStyle}>

            <div className={`mb-10 border-b border-gray-100 pb-4`}>
                <div className={`flex items-end ${settings.align === 'center' ? 'justify-center relative' :
                    settings.align === 'right' ? 'justify-end relative' :
                        'justify-between'
                    }`}>
                    <div className={`${settings.align === 'center' ? 'text-center w-full' :
                        settings.align === 'right' ? 'text-right' :
                            'text-left'
                        }`}>
                        <h2 className="font-bold text-[var(--primary-color)] tracking-tight" style={{ fontFamily: 'var(--font-family-secondary)' }}>
                            {getLocalizedText(container.content.title, lang)}
                        </h2>
                        {(settings.showSubheading !== false) && settings.subheading && (
                            <p className={`text-lg text-gray-500 font-medium mt-2 ${settings.align === 'center' ? 'mx-auto' : ''}`}>
                                {getLocalizedText(settings.subheading, lang) || settings.subheading}
                            </p>
                        )}
                        {(settings.showDescription !== false) && settings.description && (
                            renderRichText(
                                getLocalizedText(settings.description, lang) || settings.description,
                                `text-sm text-gray-600 leading-relaxed mt-3 max-w-4xl ${settings.align === 'center' ? 'mx-auto' : ''}`
                            )
                        )}
                    </div>

                    {isSlider && items.length > cols && (
                        <div className={`flex gap-2 ${settings.align === 'center' ? 'absolute right-0' : ''}`}>
                            <button onClick={() => scroll('left')} className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-sm transition-colors shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => scroll('right')} className="w-8 h-8 flex items-center justify-center bg-[var(--primary-color)] text-white hover:opacity-90 rounded-sm transition-colors shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={scrollContainer}
                className={`
                ${isSlider ? 'flex flex-nowrap overflow-x-hidden snap-x snap-mandatory' : 'grid'} 
                ${spacingClass}
`}
                style={{
                    gridTemplateColumns: isSlider ? undefined : `repeat(${cols}, minmax(0, 1fr))`,
                    scrollBehavior: 'smooth'
                }}
            >
                {items.map((item: any, idx: number) => {
                    const hasVisual = item.img || settings.source === 'Document';

                    return (
                        <div
                            key={item.id}
                            className={`bg-white ${settings.border !== 'none' ? 'border border-gray-200 shadow-sm' : ''} overflow-hidden group flex relative
                                ${layout.card}
                                ${borderClass} 
                                ${isSlider ? 'snap-start flex-shrink-0' : ''}`} style={{ width: isSlider ? cardWidth : 'auto', flex: isSlider ? `0 0 ${cardWidth}` : undefined }}>
                            {/* Image Area - Responsive & Conditional */}
                            {settings.imgPos !== 'none' && hasVisual && (() => {
                                const isCircle = settings.imgBorder === 'circle';
                                const isRounded = settings.imgBorder === 'rounded';

                                if (isCircle) {
                                    // Circle mode: fixed centered avatar
                                    return (
                                        <div className="w-full flex justify-center pt-6 pb-2">
                                            <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-gray-200">
                                                {item.img ? (
                                                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                                        {getDocIcon(item.type)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                const imgBorderClass = isRounded ? 'rounded-xl overflow-hidden' : 'overflow-hidden';
                                return (
                                    <div className={`${layout.img} bg-gray-100 relative flex-shrink-0 flex items-center justify-center ${imgBorderClass}`}>
                                        {item.img ? (
                                            <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                                {getDocIcon(item.type)}
                                                <div className="text-[10px] font-bold uppercase mt-2 opacity-60 tracking-wider">{item.type || 'Item'}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* No absolute pencil here, we'll put it inline for contacts or title-based items */}

                            {(settings.source === 'Contacts' || settings.source === 'Contact' || settings.imgBorder === 'circle') ? (
                                /* ---- CONTACT / CIRCLE CARD: center-aligned ---- */
                                <div className="p-5 flex-1 flex flex-col items-center text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-800 text-base group-hover:text-[var(--primary-color)] transition-colors">
                                            {item.title}
                                        </h3>
                                        {viewMode === ViewMode.EDIT && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingItem({ item: item.originalItem, type: 'Contact' });
                                                }}
                                                className="text-[var(--primary-color)] opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    {item.desc && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                                            {stripHtml(item.desc)}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setActiveReadMoreItem({ item, index: idx })}
                                        className="text-[var(--primary-color)] font-bold text-xs flex items-center gap-1.5 hover:underline group/btn mt-auto"
                                    >
                                        <span>{getTranslation('BTN_READ_MORE', lang)}</span>
                                        <div className="flex items-center gap-0.5 opacity-80 group-hover/btn:opacity-100">
                                            {viewMode === ViewMode.EDIT ? <EditTrigger labelKey="BTN_READ_MORE" /> : <Info className="w-3 h-3" />}
                                            <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                /* ---- REGULAR CARD: left-aligned, numbered layout ---- */
                                <div className="p-4 flex-1 flex flex-col text-left">
                                    {!isNumbered && (
                                        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            <span>{new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    )}

                                    {/* Number + Title row — horizontal for numbered mode */}
                                    <div className={`mb-3 ${isNumbered ? 'flex flex-row items-start gap-3' : ''}`}>
                                        {isNumbered && (
                                            <div className={`font-bold text-gray-200 font-mono select-none leading-none flex-shrink-0 mt-0.5 ${settings.ordering === 'IIIII' ? 'text-xl tracking-tighter' : 'text-4xl'}`}>
                                                {getOrderedLabel(idx)}
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2 flex-1">
                                            <h3 className={`font-bold text-gray-800 text-sm uppercase tracking-wide group-hover:text-[var(--primary-color)] transition-colors leading-snug flex-1 ${isNumbered ? '' : 'text-base'}`}>
                                                {item.title}
                                            </h3>
                                            {viewMode === ViewMode.EDIT && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (settings.source === 'Smart Pages') {
                                                            setCurrentPage(item.id);
                                                        } else {
                                                            setEditingItem({ item: item.originalItem, type: settings.source });
                                                        }
                                                    }}
                                                    className="text-[var(--primary-color)] opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {item.desc && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">{stripHtml(item.desc)}</p>
                                    )}

                                    <button
                                        onClick={() => setActiveReadMoreItem({ item, index: idx })}
                                        className="text-[var(--primary-color)] font-bold text-xs flex items-center gap-1.5 hover:underline group/btn mt-auto"
                                    >
                                        <span>{getTranslation('BTN_READ_MORE', lang)}</span>
                                        <div className="flex items-center gap-0.5 opacity-80 group-hover/btn:opacity-100">
                                            {viewMode === ViewMode.EDIT ? <EditTrigger labelKey="BTN_READ_MORE" /> : <Info className="w-3 h-3" />}
                                            <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {items.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-sm bg-gray-50/50 w-full flex flex-col items-center justify-center">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--icon-color)' }} />
                        <p className="text-gray-500 font-medium">No items tagged for display.</p>
                        <p className="text-xs text-gray-400">Edit the container to connect items.</p>
                    </div>
                )}
            </div>

            {
                activeReadMoreItem && (
                    <ReadMoreModal
                        item={activeReadMoreItem.item}
                        index={activeReadMoreItem.index}
                        isNumbered={isNumbered}
                        onClose={() => setActiveReadMoreItem(null)}
                    />
                )
            }

            {
                editingItem && editingItem.type === 'News' && (
                    <NewsEditor
                        item={editingItem.item}
                        onSave={(updated: any) => { updateNews(updated); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                        onDelete={(id: string) => { deleteNews(id); setEditingItem(null); }}
                    />
                )
            }

            {
                editingItem && editingItem.type === 'Event' && (
                    <EventEditor
                        item={editingItem.item}
                        onSave={(updated: any) => { updateEvent(updated); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                        onDelete={(id: string) => { deleteEvent(id); setEditingItem(null); }}
                    />
                )
            }

            {
                editingItem && editingItem.type === 'Document' && (
                    <DocumentEditor
                        item={editingItem.item}
                        onSave={(updated: any) => { updateDocument(updated); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                        onDelete={(id: string) => { deleteDocument(id); setEditingItem(null); }}
                    />
                )
            }
            {
                editingItem && editingItem.type === 'Contact' && (
                    <ContactEditor
                        item={editingItem.item}
                        onSave={(updated: any) => { updateContact(updated); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                        onDelete={(id: string) => { deleteContact(id); setEditingItem(null); }}
                    />
                )
            }
            {
                editingItem && (editingItem.type === 'Container Items' || editingItem.type === 'ContainerItems') && (
                    <ContainerItemEditor
                        item={editingItem.item}
                        onSave={(updated: any) => { updateContainerItem(updated); setEditingItem(null); }}
                        onCancel={() => setEditingItem(null)}
                        onDelete={(id: string) => { deleteContainerItem(id); setEditingItem(null); }}
                    />
                )
            }
        </div >
    );
};

// --- RENDERER 4: CONTACT FORM (UPDATED) ---
const ContactFormRenderer = ({ container, lang, pageTitle }: ComponentRendererProps) => {
    const { addContactQuery } = useStore();
    const { settings } = container;
    const fields = settings.fields || [];

    // Helper function to generate random CAPTCHA
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    };

    // State for form data and UI feedback
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [captchaValue, setCaptchaValue] = useState('');
    const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());

    // Refresh CAPTCHA when component mounts or when manually triggered
    React.useEffect(() => {
        setGeneratedCaptcha(generateCaptcha());
    }, []);

    const handleRefreshCaptcha = () => {
        setGeneratedCaptcha(generateCaptcha());
        setCaptchaValue('');
        if (errors.captcha) {
            setErrors(prev => ({ ...prev, captcha: false }));
        }
    };

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error when user types/changes
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleSubmit = () => {
        // 1. Validation
        const newErrors: Record<string, boolean> = {};
        let hasError = false;

        fields.forEach((f: any) => {
            const val = formData[f.id];
            // Check for empty string, or false for required checkboxes
            if (f.required) {
                if (f.type === 'checkbox') {
                    if (!val) {
                        newErrors[f.id] = true;
                        hasError = true;
                    }
                } else if (!val || (typeof val === 'string' && !val.trim())) {
                    newErrors[f.id] = true;
                    hasError = true;
                }
            }
        });

        if (!privacyAccepted) {
            newErrors['privacy'] = true;
            hasError = true;
        }

        // Case-insensitive CAPTCHA validation
        if (captchaValue.toUpperCase() !== generatedCaptcha.toUpperCase()) {
            newErrors['captcha'] = true;
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setStatus('ERROR');
            return;
        }

        // 2. Extract Metadata (Best Effort)
        // Try to find email field for primary identifier
        const emailField = fields.find((f: any) => f.type === 'email' || f.label.toLowerCase().includes('email'));
        const userEmail = emailField ? formData[emailField.id] : 'Anonymous';

        // Find Names for display if possible (best effort)
        const firstNameField = fields.find((f: any) => f.label.toLowerCase().includes('first name'));
        const lastNameField = fields.find((f: any) => f.label.toLowerCase().includes('last name'));

        // 3. Construct Payload (DYNAMICALLY COLLECT ALL FIELDS)
        const query: ContactQuery = {
            id: `cq_${Date.now()}`,
            pageId: container.pageId,
            pageName: pageTitle || 'Unknown Page',
            containerId: container.id,
            created: new Date().toISOString(),
            status: 'New',
            email: userEmail,
            firstName: firstNameField ? formData[firstNameField.id] : undefined,
            lastName: lastNameField ? formData[lastNameField.id] : undefined,
            smartPage: pageTitle, // Legacy support
            fields: [
                ...fields.map((f: any) => {
                    // Normalize value for string storage
                    let storedValue = formData[f.id];
                    if (f.type === 'checkbox') {
                        storedValue = storedValue ? 'Yes' : 'No';
                    } else if (Array.isArray(storedValue)) {
                        storedValue = storedValue.join(', ');
                    } else if (!storedValue) {
                        storedValue = '';
                    }

                    return {
                        id: f.id,
                        label: f.label,
                        value: String(storedValue),
                        type: f.type
                    };
                }),
                {
                    id: 'privacy_policy',
                    label: 'Privacy Policy',
                    value: 'Accepted',
                    type: 'checkbox'
                }
            ]
        };

        // 4. Save to Store
        addContactQuery(query);
        setStatus('SUCCESS');
        setFormData({}); // Reset form
        setPrivacyAccepted(false);
        setCaptchaValue('');
        setGeneratedCaptcha(generateCaptcha()); // Generate new CAPTCHA
        setErrors({});

        // Reset status after delay
        setTimeout(() => setStatus('IDLE'), 5000);
    };

    return (
        <div className="w-full py-16 px-6"
            style={{
                backgroundColor: settings.bgType === 'color' ? settings.bgColor : (settings.bgType === 'none' ? 'transparent' : 'transparent'),
                backgroundImage: settings.bgType === 'image' && settings.bgImage ? `url(${settings.bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>

            <div className={`max-w-xl mx-auto bg-white p-10 shadow-xl border border-gray-200 rounded-sm relative ${settings.bgType === 'image' ? 'backdrop-blur-sm bg-white/95' : ''}`}>

                {/* Success Message Overlay */}
                {status === 'SUCCESS' ? (
                    <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
                            <CheckCircle className="w-10 h-10" style={{ color: 'var(--status-success, #16a34a)' }} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Received!</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">We've received your inquiry and will get back to you within 24 hours.</p>
                        <button
                            onClick={() => setStatus('IDLE')}
                            className="mt-8 px-6 py-2 border border-gray-200 text-gray-500 font-bold text-xs uppercase hover:bg-gray-50 rounded-sm"
                        >
                            Send another message
                        </button>
                    </div>
                ) : null}

                <div className={`text-${settings.alignment === 'center' ? 'center' : 'left'} mb-8`}>
                    {settings.heading && <h2 className="font-bold text-[var(--primary-color)] mb-2">{getLocalizedText(settings.heading, lang)}</h2>}
                    {settings.subheading && <p className="text-gray-500 text-sm font-medium">{getLocalizedText(settings.subheading, lang)}</p>}
                    {settings.description && renderRichText(getLocalizedText(settings.description, lang), "text-gray-400 text-xs mt-2")}
                </div>

                <div className="space-y-4">
                    {fields.map((f: any) => (
                        <div key={f.id}>
                            {f.type !== 'checkbox' && (
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {f.label} {f.required && <span className="text-red-500">*</span>}
                                </label>
                            )}

                            {f.type === 'textarea' ? (
                                <textarea
                                    className={`w-full border p-2 text-sm bg-white rounded-sm resize-none h-24 outline-none focus:ring-1 focus:ring-[var(--primary-color)] ${errors[f.id] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder={f.placeholder}
                                    value={formData[f.id] || ''}
                                    onChange={(e) => handleInputChange(f.id, e.target.value)}
                                />
                            ) : f.type === 'checkbox' ? (
                                <label className="flex items-start gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5 w-4 h-4 flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            className={`h-4 w-4 cursor-pointer appearance-none rounded-sm border ${errors[f.id] ? 'border-red-500' : 'border-gray-300'} bg-white transition-all focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none ${formData[f.id] ? 'border-[var(--primary-color)] bg-[var(--primary-color)]' : ''}`}
                                            checked={!!formData[f.id]}
                                            onChange={(e) => handleInputChange(f.id, e.target.checked)}
                                        />
                                        {formData[f.id] && (
                                            <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-700 leading-tight select-none group-hover:text-black">
                                        {f.label} {f.required && <span className="text-red-500">*</span>}
                                    </span>
                                </label>
                            ) : f.type === 'select' ? (
                                /* Assuming future editor might support 'options' or default to basic select */
                                <select
                                    className={`w-full border p-2 text-sm bg-white rounded-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)] ${errors[f.id] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    value={formData[f.id] || ''}
                                    onChange={(e) => handleInputChange(f.id, e.target.value)}
                                >
                                    <option value="" disabled>{f.placeholder || 'Select an option'}</option>
                                    {/* Fallback options if none provided, or simple split if placeholder has commas? 
                                        For robust default behavior without explicit options array: */}
                                    <option value="Option 1">Option 1</option>
                                    <option value="Option 2">Option 2</option>
                                    <option value="Option 3">Option 3</option>
                                </select>
                            ) : (
                                <input
                                    className={`w-full border p-2 text-sm bg-white rounded-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)] ${errors[f.id] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'}
                                    placeholder={f.placeholder}
                                    value={formData[f.id] || ''}
                                    onChange={(e) => handleInputChange(f.id, e.target.value)}
                                />
                            )}

                            {errors[f.id] && <p className="text-[10px] text-red-500 mt-1 font-bold">This field is required.</p>}
                        </div>
                    ))}

                    <label className="flex items-start gap-2 mt-4 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5 w-4 h-4 flex-shrink-0">
                            <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded-sm border border-gray-300 focus:ring-1 focus:ring-[var(--primary-color)] focus:outline-none"
                                checked={privacyAccepted}
                                onChange={(e) => {
                                    setPrivacyAccepted(e.target.checked);
                                    if (e.target.checked) setErrors(prev => ({ ...prev, privacy: false }));
                                }}
                            />
                            {privacyAccepted && (
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white" />
                            )}
                        </div>
                        <span className="text-xs text-gray-500 leading-tight select-none group-hover:text-gray-700">
                            I have read the Privacy Policy note. I agree that my contact details and questions will be stored permanently.
                        </span>
                    </label>
                    {errors.privacy && <p className="text-[10px] text-red-500 mt-1 font-bold">You must accept the privacy policy.</p>}

                    <div className="pt-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            CAPTCHA: <span className="text-blue-600 select-none" style={{ userSelect: 'none' }}>{generatedCaptcha}</span>
                            <button
                                type="button"
                                onClick={handleRefreshCaptcha}
                                className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                                title="Refresh CAPTCHA"
                            >
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </label>
                        <input
                            className={`w-full border p-2 text-sm bg-white rounded-sm outline-none focus:ring-1 focus:ring-[var(--primary-color)] ${errors.captcha ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                            placeholder="Enter Captcha"
                            value={captchaValue}
                            onChange={(e) => {
                                setCaptchaValue(e.target.value);
                                if (errors.captcha) setErrors(prev => ({ ...prev, captcha: false }));
                            }}
                        />
                        {errors.captcha && <p className="text-[10px] text-red-500 mt-1 font-bold">Incorrect Captcha.</p>}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-[var(--primary-color)] text-white py-3 font-bold text-sm shadow-md hover:opacity-90 uppercase tracking-wider rounded-sm mt-4 transition-opacity"
                    >
                        {getLocalizedText(settings.buttonText || 'Send Message', lang)}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- RENDERER 5: TABLE VIEW ---
const TableRenderer = ({ container, lang }: ComponentRendererProps) => {
    const { settings, content } = container;
    const columns = settings.columns || [];
    const rows = content.rows || [];

    // State for global search, column filters, and sorting
    const [searchQuery, setSearchQuery] = useState('');
    const [colFilters, setColFilters] = useState<Record<string, string>>({});
    const [sortState, setSortState] = useState<{ columnId: string | null, direction: 'asc' | 'desc' | null }>({ columnId: null, direction: null });

    // Handle column filter change
    const handleFilterChange = (colId: string, value: string) => {
        setColFilters(prev => ({ ...prev, [colId]: value }));
    };

    // Handle sort toggle (None -> Asc -> Desc -> None)
    const handleSort = (key: string) => {
        setSortState(current => {
            if (current.columnId !== key) return { columnId: key, direction: 'asc' };
            if (current.direction === 'asc') return { columnId: key, direction: 'desc' };
            return { columnId: null, direction: null };
        });
    };

    const processedRows = useMemo(() => {
        let result = [...rows];

        // 1. Column Filters
        Object.keys(colFilters).forEach(colId => {
            const term = colFilters[colId].toLowerCase();
            if (term) {
                result = result.filter(row => String(row[colId] || '').toLowerCase().includes(term));
            }
        });

        // 2. Global Search
        if (settings.enableGlobalSearch && searchQuery) {
            const term = searchQuery.toLowerCase();
            result = result.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(term)));
        }

        // 3. Sort
        if (sortState.columnId && sortState.direction) {
            result.sort((a, b) => {
                const valA = String(a[sortState.columnId!] || '').toLowerCase();
                const valB = String(b[sortState.columnId!] || '').toLowerCase();
                if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [rows, colFilters, searchQuery, sortState, settings.enableGlobalSearch]);

    return (
        <div className="py-16 px-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="font-bold text-[var(--primary-color)] mb-2">
                    {getLocalizedText(content.title, lang)}
                </h2>
                {settings.enableGlobalSearch && (
                    <div className="relative max-w-md mt-4">
                        <input
                            className="w-full border border-gray-300 pl-10 pr-10 p-2.5 text-sm rounded-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none"
                            placeholder="Global Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Clear search"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                {columns.map((col: any) => {
                                    const isSorted = sortState.columnId === col.id;
                                    const isAsc = isSorted && sortState.direction === 'asc';
                                    const isDesc = isSorted && sortState.direction === 'desc';

                                    return (
                                        <th key={col.id} className="p-4 align-top w-auto min-w-[150px]">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-sm py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-[var(--primary-color)] font-normal text-gray-600 placeholder-gray-400"
                                                    placeholder={col.header}
                                                    value={colFilters[col.id] || ''}
                                                    onChange={(e) => handleFilterChange(col.id, e.target.value)}
                                                />
                                                {/* Sort Icons Inside Input */}
                                                <div
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col cursor-pointer gap-0.5"
                                                    onClick={() => handleSort(col.id)}
                                                    title={`Sort by ${col.header} `}
                                                >
                                                    <ArrowUp className={`w-2 h-2 ${isAsc ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`} />
                                                    <ArrowDown className={`w-2 h-2 ${isDesc ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'}`} />
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {processedRows.map((row: any, idx: number) => (
                                <tr key={row.id || idx} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col: any) => (
                                        <td key={col.id} className="p-4 text-gray-700 font-medium border-r border-transparent">
                                            {row[col.id]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {processedRows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="p-12 text-center text-gray-400">
                                        No data found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- RENDERER 6: MAP ---
const MapRenderer = ({ container, lang }: ComponentRendererProps) => {
    const { settings, content } = container;

    return (
        <div className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="font-bold text-[var(--primary-color)] mb-8">
                {getLocalizedText(content.title, lang)}
            </h2>

            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
                {/* GeoChart Map */}
                <GeoChartMap
                    mapType={settings.mapType || 'World'}
                    selectedRegion={settings.selectedRegion}
                    selectedState={settings.selectedState}
                    height={480}
                />

                {/* Label Overlay */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-sm shadow-md border-l-4 border-[var(--primary-color)] flex items-center gap-3">
                        {settings.mapType === 'World' ? (
                            <Globe className="w-5 h-5 text-gray-500" />
                        ) : (
                            <MapPin className="w-5 h-5 text-[var(--primary-color)]" />
                        )}
                        <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">{settings.mapType || 'World'} View</span>
                            <span className="block text-sm font-bold text-gray-800 leading-none">
                                {settings.selectedState ? settings.selectedState.split('-')[1] : (settings.selectedRegion || settings.mapType || 'World')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN WRAPPER ---
const ContainerWrapper = ({ container, viewMode, lang, pageTitle }: { container: any, viewMode: ViewMode, lang: LanguageCode, pageTitle: string }) => {
    const { openModal, setEditingContainerId } = useStore();

    const handleEdit = () => {
        setEditingContainerId(container.id);
        const isCarouselSlider =
            container.type === ContainerType.SLIDER &&
            container.settings?.templateId !== 'img_gallery' &&
            container.settings?.templateVariant !== 1;
        openModal(isCarouselSlider ? ModalType.SLIDER_MANAGER : ModalType.CONTAINER_EDITOR);
    };

    return (
        <div className={`relative group ${viewMode === ViewMode.EDIT ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer' : ''}`}>
            {viewMode === ViewMode.EDIT && (
                <div className="absolute top-4 right-4 z-40 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleEdit}
                        className="p-2 rounded-none shadow-md hover:opacity-90 transition-all"
                        style={{
                            backgroundColor: 'var(--edit-icon-bg, #2563eb)',
                            color: 'var(--edit-icon-color, #ffffff)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--edit-icon-hover-bg, #1d4ed8)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--edit-icon-bg, #2563eb)')}
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Strict Rendering based on Type */}
            {container.type === ContainerType.HERO && <HeaderRenderer container={container} lang={lang} />}
            {container.type === ContainerType.SLIDER && <SliderRenderer container={container} lang={lang} />}
            {container.type === ContainerType.CARD_GRID && <DataGridRenderer container={container} lang={lang} />}
            {container.type === ContainerType.CONTACT_FORM && <ContactFormRenderer container={container} lang={lang} pageTitle={pageTitle} />}
            {container.type === ContainerType.TABLE && <TableRenderer container={container} lang={lang} />}
            {container.type === ContainerType.MAP && <MapRenderer container={container} lang={lang} />}

            {/* Fallback for other types if any (e.g. IMAGE_TEXT) */}
            {container.type === ContainerType.IMAGE_TEXT && (
                <div className="p-20 text-center text-gray-400 border-2 border-dashed">Standard Image Text Section (Default)</div>
            )}
        </div>
    );
};

// --- RECURSIVE NAV ITEMS ---
interface TopNavItemProps {
    item: NavItem;
    allItems: NavItem[];
    onNavigate: (pageId: string) => void;
}

const TopNavDropdownItem: React.FC<TopNavItemProps> = ({ item, allItems, onNavigate }) => {
    const { currentLanguage } = useStore();
    const children = allItems.filter(n => n.parentId === item.id && n.isVisible).sort((a, b) => a.order - b.order);
    const hasChildren = children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
        if (item.type === 'Page' && item.pageId) {
            e.preventDefault();
            onNavigate(item.pageId);
        }
    };

    const localizedTitle = getItemTranslation(item, currentLanguage, 'title');

    return (
        <div className="relative group/menuitem h-full flex items-center">
            <a
                href={item.url || '#'}
                onClick={handleClick}
                target={item.openInNewTab ? '_blank' : '_self'}
                className="text-sm font-bold uppercase tracking-wide hover:opacity-70 transition-opacity flex items-center gap-1 py-2"
                style={{ color: 'var(--text-primary)' }}
            >
                {localizedTitle}
                {hasChildren && <ChevronDown className="w-3 h-3 opacity-50" />}
            </a>

            {/* Dropdown Menu */}
            {hasChildren && (
                <div className="absolute top-full left-0 hidden group-hover/menuitem:block pt-2 z-50 min-w-[200px]">
                    <div className="bg-white border border-gray-200 shadow-xl rounded-none py-2">
                        {children.map(child => (
                            <TopNavSubItem key={child.id} item={child} allItems={allItems} onNavigate={onNavigate} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TopNavSubItem: React.FC<TopNavItemProps> = ({ item, allItems, onNavigate }) => {
    const { currentLanguage } = useStore();
    const children = allItems.filter(n => n.parentId === item.id && n.isVisible).sort((a, b) => a.order - b.order);
    const hasChildren = children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
        if (item.type === 'Page' && item.pageId) {
            e.preventDefault();
            onNavigate(item.pageId);
        }
    };

    const localizedTitle = getItemTranslation(item, currentLanguage, 'title');

    return (
        <div className="relative group/submenu px-4 py-2 hover:bg-gray-100">
            <a
                href={item.url || '#'}
                onClick={handleClick}
                target={item.openInNewTab ? '_blank' : '_self'}
                className="text-sm font-medium text-gray-700 flex justify-between items-center"
            >
                {localizedTitle}
                {hasChildren && <span className="text-xs">›</span>}
            </a>

            {/* Flyout Menu */}
            {hasChildren && (
                <div className="absolute left-full top-0 hidden group-hover/submenu:block pl-1 z-50 min-w-[200px]">
                    <div className="bg-white border border-gray-200 shadow-xl rounded-none py-2">
                        {children.map(child => (
                            <TopNavSubItem key={child.id} item={child} allItems={allItems} onNavigate={onNavigate} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const PreviewArea: React.FC = () => {
    const { pages, currentPageId, setCurrentPage, viewMode, siteConfig, currentLanguage, translationItems } = useStore();
    const { context } = useSPContext();
    const activePage = pages.find(p => p.id === currentPageId);
    const footerConfig = siteConfig.footer;

    const siteUrl = context.pageContext.web.absoluteUrl;

    const handleInternalLink = (e: React.MouseEvent, url: string) => {
        if (!url) return;
        // Normalize URL for check
        const normalizedUrl = url.startsWith('/') ? `${siteUrl}${url === '/' ? '' : url}` : url;
        if (normalizedUrl.startsWith(siteUrl)) {
            const path = normalizedUrl.replace(siteUrl, '') || '/';
            const targetPage = pages.find(p => p.slug === path || (path === '/' && p.slug === '/'));
            if (targetPage) {
                e.preventDefault();
                setCurrentPage(targetPage.id);
            }
        }
    };

    // Resolve Background Color
    const getFooterBg = () => {
        switch (footerConfig.backgroundColor) {
            case 'white': return '#ffffff';
            case 'light-grey': return '#f3f4f6';
            case 'site-color': return 'var(--brand-dark)';
            default: return footerConfig.backgroundColor;
        }
    };

    const getFooterTextColor = () => {
        const bg = getFooterBg();
        if (bg === '#ffffff' || bg === '#f3f4f6') return 'var(--text-primary)';
        return '#ffffff';
    };

    // Render Navigation Items based on visibility
    const renderNavItems = () => (
        <nav className={`flex items-center gap-6 ${siteConfig.navPosition === 'below_logo' ? `justify-${siteConfig.navAlignment}` : ''} w-full h-full`}>
            {siteConfig.navigation
                .filter(n => n.parentId === 'root' && n.isVisible)
                .sort((a, b) => a.order - b.order)
                .map(link => (
                    <TopNavDropdownItem key={link.id} item={link} allItems={siteConfig.navigation} onNavigate={setCurrentPage} />
                ))}
        </nav>
    );

    const LogoComponent = () => (
        <div className="flex-shrink-0 cursor-pointer" onClick={(e) => handleInternalLink(e as any, '/')}>
            {siteConfig.logo.url ? (
                <img
                    src={siteConfig.logo.url}
                    alt={siteConfig.name}
                    style={{ width: siteConfig.logo.width || '150px' }}
                    className="object-contain"
                />
            ) : (
                <div className="font-bold text-xl tracking-tight" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family-base)' }}>
                    {siteConfig.name}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex-1 bg-gray-200 overflow-hidden flex flex-col relative">

            {/* Main Website Frame */}
            <div className="flex-1 overflow-y-auto admin-scroll bg-white relative" style={{ backgroundColor: 'var(--bg-body)' }}>

                {/* Site Header */}
                <header
                    className="sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-90 transition-all"
                    style={{
                        backgroundColor: siteConfig.headerBackgroundColor || 'var(--bg-surface)',
                        borderBottom: '1px solid var(--border-color)'
                    }}
                >
                    <div className={`mx-auto px-6 flex ${siteConfig.navPosition === 'below_logo' ? 'flex-col py-4 gap-4' : 'h-16 items-center justify-between'}`}
                        style={{ maxWidth: siteConfig.headerWidth === 'standard' ? '80rem' : '100%' }}
                    >

                        {/* Case: Below Logo (Stacked) */}
                        {siteConfig.navPosition === 'below_logo' && (
                            <>
                                <div className={`flex w-full justify-${siteConfig.logo.position}`}>
                                    <LogoComponent />
                                </div>
                                <div className="w-full border-t border-gray-100 pt-2">
                                    {renderNavItems()}
                                </div>
                            </>
                        )}

                        {/* Case: Right or Near Logo */}
                        {siteConfig.navPosition !== 'below_logo' && (
                            <div className="flex w-full items-center relative h-16">

                                {/* 1. Logo Section (Absolute for Center, Standard flex for others) */}
                                <div className={`
                        flex items-center gap-8 
                        ${siteConfig.logo.position === 'center' ? 'absolute left-1/2 transform -translate-x-1/2' : ''}
                        ${siteConfig.logo.position === 'right' ? 'ml-auto order-last' : 'mr-auto order-first'}
                     `}>
                                    <LogoComponent />

                                    {/* Nav Near Logo - ONLY if enabled and Logo NOT Center */}
                                    {siteConfig.navPosition === 'near_logo' && siteConfig.logo.position !== 'center' && (
                                        <div className="hidden md:block">{renderNavItems()}</div>
                                    )}
                                </div>

                                {/* 2. Nav Right of Page Section */}
                                {/* This container pushes itself to the right via ml-auto if Logo isn't already taking that space */}
                                {siteConfig.navPosition === 'right' && (
                                    <div className={`flex items-center gap-6 hidden md:flex ${siteConfig.logo.position === 'right' ? 'mr-6' : 'ml-auto mr-6'}`}>
                                        {renderNavItems()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {activePage ? (
                    <div className="min-h-[calc(100vh - 64px)] flex flex-col">
                        {activePage.containers.length > 0 ? (
                            activePage.containers.map(container => (
                                <ContainerWrapper
                                    key={container.id}
                                    container={container}
                                    viewMode={viewMode}
                                    lang={currentLanguage}
                                    pageTitle={getLocalizedText(activePage.title, currentLanguage)}
                                />
                            ))
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <TypeIcon className="w-12 h-12 mb-4 opacity-20" style={{ color: 'var(--icon-color, #2563eb)' }} />
                                <p>This page is empty. Add containers to start building.</p>
                            </div>
                        )}

                        <footer
                            style={{
                                backgroundColor: getFooterBg(),
                                color: getFooterTextColor(),
                                padding: '4rem 2rem',
                                textAlign: footerConfig.template === 'Table' ? footerConfig.alignment : 'left'
                            }}
                        >
                            {footerConfig.template === 'Table' && (
                                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <div className="col-span-1 md:col-span-1">
                                        <h4 className="font-bold mb-4" style={{ fontSize: footerConfig.fontSettings.headingSize }}>{siteConfig.name}</h4>
                                        <p className="opacity-70 max-w-sm" style={{ fontSize: footerConfig.fontSettings.subHeadingSize }}>
                                            {getGlobalTranslation('footer_sub', translationItems, currentLanguage, footerConfig.subFooterText)}
                                        </p>
                                    </div>
                                    {footerConfig.columns.map(col => (
                                        <div key={col.id}>
                                            <h5 className="font-bold mb-4 uppercase tracking-wider opacity-80" style={{ fontSize: footerConfig.fontSettings.headingSize }}>
                                                {getGlobalTranslation(`footer_col_${col.id}`, translationItems, currentLanguage, col.title)}
                                            </h5>
                                            <ul className="space-y-2 opacity-70" style={{ fontSize: footerConfig.fontSettings.subHeadingSize }}>
                                                {col.links.map(link => (
                                                    <li key={link.id}><a
                                                        href={link.url}
                                                        className="hover:underline"
                                                        onClick={(e) => handleInternalLink(e, link.url)}
                                                    >
                                                        {getGlobalTranslation(`footer_link_${link.id}`, translationItems, currentLanguage, link.label)}
                                                    </a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {footerConfig.template === 'Corporate' && (
                                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                                    <div className="space-y-4">
                                        <h4 className="font-bold" style={{ fontSize: footerConfig.fontSettings.headingSize }}>{siteConfig.name}</h4>
                                        <div className="space-y-1 opacity-80" style={{ fontSize: footerConfig.fontSettings.subHeadingSize }}>
                                            {footerConfig.contactInfo.address && <p className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: 'var(--icon-color)' }} /> {footerConfig.contactInfo.address}</p>}
                                            {footerConfig.contactInfo.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: 'var(--icon-color)' }} /> {footerConfig.contactInfo.email}</p>}
                                            {footerConfig.contactInfo.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: 'var(--icon-color)' }} /> {footerConfig.contactInfo.phone}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        {footerConfig.socialLinks.linkedin && <a href={footerConfig.socialLinks.linkedin} className="hover:opacity-80"><Linkedin className="w-6 h-6" style={{ color: 'var(--icon-color)' }} /></a>}
                                        {footerConfig.socialLinks.facebook && <a href={footerConfig.socialLinks.facebook} className="hover:opacity-80"><Facebook className="w-6 h-6" style={{ color: 'var(--icon-color)' }} /></a>}
                                        {footerConfig.socialLinks.twitter && <a href={footerConfig.socialLinks.twitter} className="hover:opacity-80"><Twitter className="w-6 h-6" style={{ color: 'var(--icon-color)' }} /></a>}
                                        {footerConfig.socialLinks.instagram && <a href={footerConfig.socialLinks.instagram} className="hover:opacity-80"><Instagram className="w-6 h-6" style={{ color: 'var(--icon-color)' }} /></a>}
                                    </div>
                                </div>
                            )}

                            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm opacity-50">
                                {getLocalizedText(footerConfig.copyright, currentLanguage)}
                                {footerConfig.template === 'Corporate' && <div className="mt-2">{getGlobalTranslation('footer_sub', translationItems, currentLanguage, footerConfig.subFooterText)}</div>}
                            </div>
                        </footer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Select a page to view</div>
                )}
            </div>

            {/* Editor HUD */}
            {/* {viewMode === ViewMode.EDIT && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-none shadow-2xl backdrop-blur flex items-center gap-4 border border-white/10 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-none animate-pulse" style={{ backgroundColor: 'var(--status-success, #16a34a)' }}></div>
                        <span className="text-xs font-bold uppercase tracking-wider">Editor Active</span>
                    </div>
                    <div className="h-4 w-px bg-white/20"></div>
                    <span className="text-sm font-medium">{getLocalizedText(activePage?.title ?? '', currentLanguage)}</span>
                </div>
            )} */}
        </div>
    );
};
