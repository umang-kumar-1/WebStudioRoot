
import React, { useState } from 'react';
import { useStore } from '../../store';
import { generateThemeFromPrompt } from '../../services/geminiService';
import {
  Wand2, Save, RefreshCw, Palette, Type,
  Layout, MousePointer2, AlertCircle, Maximize, HelpCircle, CheckCircle, AlertTriangle, XCircle, LayoutTemplate
} from 'lucide-react';
import { getLocalizedText, getTranslation } from '../../store';

// Extended Grouping with new categories
const GROUPS = {
  BRANDING: {
    label: 'Colors & Brand',
    icon: Palette,
    vars: [
      '--primary-color', '--secondary-color', '--brand-light', '--brand-dark', '--gradient-primary',
      '--text-primary', '--text-secondary', '--text-on-primary',
      '--link-color', '--link-hover-color'
    ]
  },
  TYPOGRAPHY: {
    label: 'Typography',
    icon: Type,
    vars: [
      '--font-import-url',
      '--font-family-base', '--font-family-secondary',
      '--font-size-base',
      '--heading-color',
      '--heading-h1-color', '--heading-h2-color', '--heading-h3-color',
      '--heading-h4-color', '--heading-h5-color', '--heading-h6-color',
      '--font-size-h1', '--font-size-h2', '--font-size-h3',
      '--font-size-h4', '--font-size-h5', '--font-size-h6',
      '--font-weight-bold'
    ]
  },
  BUTTONS: {
    label: 'Buttons & UI',
    icon: MousePointer2,
    vars: [
      '--btn-primary-bg', '--btn-primary-text', '--btn-primary-hover-bg',
      '--btn-secondary-bg', '--btn-secondary-text',
      '--btn-padding-x', '--btn-padding-y', '--btn-font-size'
    ]
  },
  LAYOUT: {
    label: 'Layout & Borders',
    icon: Layout,
    vars: [
      '--bg-body', '--bg-surface', '--bg-hover',
      '--border-radius-sm', '--border-radius-md', '--border-radius-lg',
      '--border-color'
    ]
  },
  STATUS: {
    label: 'Status & Alerts',
    icon: AlertCircle,
    vars: ['--status-success', '--status-warning', '--status-error']
  },
  ICONS: {
    label: 'Icons & Actions',
    icon: MousePointer2,
    vars: ['--icon-color', '--edit-icon-bg', '--edit-icon-color', '--edit-icon-hover-bg']
  },
  SIDEBAR: {
    label: 'Sidebar Navigation',
    icon: LayoutTemplate,
    vars: [
      '--sidebar-bg', '--sidebar-text', '--sidebar-text-muted', '--sidebar-border-color',
      '--sidebar-icon-color', '--sidebar-active-bg', '--sidebar-active-text-color',
      '--sidebar-active-indicator-color', '--sidebar-hover-bg', '--sidebar-button-color',
      '--sidebar-link-color', '--sidebar-link-hover-color'
    ]
  },
  HELP: {
    label: 'Help & Guide',
    icon: HelpCircle,
    vars: [] // Special case
  }
};

const InternalPreview = ({ uiLabels, currentLanguage }: { uiLabels: any, currentLanguage: any }) => (
  <div className="bg-gray-100 p-4 rounded-none border border-gray-200 h-full flex flex-col gap-6 overflow-y-auto">
    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
      <Maximize className="w-3 h-3" /> {getTranslation('DESC_LIVE_PREVIEW', currentLanguage)?.split(':')[0]}
    </div>

    {/* Typography Card */}
    <div className="bg-[var(--bg-surface)] p-6 rounded-[var(--border-radius-lg)] shadow-sm border border-[var(--border-color)]">
      <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">Typography</h3>
      <h1 style={{ fontFamily: 'var(--font-family-secondary)', color: 'var(--heading-h1-color)', fontSize: 'var(--font-size-h1)', fontWeight: 'var(--font-weight-bold)' }}>Heading 1</h1>
      <h2 style={{ fontFamily: 'var(--font-family-secondary)', color: 'var(--heading-h2-color)', fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)' }}>Heading 2</h2>
      <p style={{ fontFamily: 'var(--font-family-base)', color: 'var(--text-primary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
        This is a sample paragraph showing <strong>bold text</strong> and standard body copy.
        It reacts to global font settings.
      </p>
      <div className="mt-2">
        <a href="#" style={{ color: 'var(--link-color)', textDecoration: 'underline' }}>Normal Link</a>
        <span className="mx-2 text-gray-300">|</span>
        <a href="#" style={{ color: 'var(--link-hover-color)', textDecoration: 'underline' }}>Hover State Link</a>
      </div>
    </div>

    {/* Buttons Card */}
    <div className="bg-[var(--bg-surface)] p-6 rounded-[var(--border-radius-lg)] shadow-sm border border-[var(--border-color)]">
      <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">Interactions</h3>
      <div className="flex gap-3 flex-wrap">
        <button style={{
          backgroundColor: 'var(--btn-primary-bg)',
          color: 'var(--btn-primary-text)',
          padding: 'var(--btn-padding-y) var(--btn-padding-x)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: 'var(--btn-font-size)'
        }}>Primary Action</button>

        <button style={{
          backgroundColor: 'var(--btn-secondary-bg)',
          color: 'var(--btn-secondary-text)',
          border: '1px solid var(--border-color)',
          padding: 'var(--btn-padding-y) var(--btn-padding-x)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: 'var(--btn-font-size)'
        }}>Secondary</button>
      </div>
    </div>

    {/* Status Card */}
    <div className="bg-[var(--bg-surface)] p-6 rounded-[var(--border-radius-lg)] shadow-sm border border-[var(--border-color)]">
      <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">Status Indicators</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 rounded-none" style={{ backgroundColor: 'color-mix(in srgb, var(--status-success), white 90%)', borderLeft: '4px solid var(--status-success)' }}>
          <CheckCircle className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.9em' }}>Operation Successful</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-none" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning), white 90%)', borderLeft: '4px solid var(--status-warning)' }}>
          <AlertTriangle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.9em' }}>System Warning</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-none" style={{ backgroundColor: 'color-mix(in srgb, var(--status-error), white 90%)', borderLeft: '4px solid var(--status-error)' }}>
          <XCircle className="w-4 h-4" style={{ color: 'var(--status-error)' }} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.9em' }}>Critical Error</span>
        </div>
      </div>
    </div>

    {/* Sidebar Preview */}
    <div className="rounded-[var(--border-radius-lg)] shadow-sm border border-[var(--sidebar-border-color)] overflow-hidden"
      style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      <h3 className="px-4 py-2 text-xs font-bold uppercase tracking-wide border-b border-[var(--sidebar-border-color)]"
        style={{ color: 'var(--sidebar-text)' }}>
        {getTranslation('THEME_GROUP_SIDEBAR', currentLanguage)}
      </h3>
      <div className="p-2 space-y-1">
        {/* Active Item */}
        <div className="flex items-center gap-2 px-3 py-2 text-sm border-l-2"
          style={{
            backgroundColor: 'var(--sidebar-active-bg)',
            color: 'var(--sidebar-active-text-color)',
            borderLeftColor: 'var(--sidebar-active-indicator-color)'
          }}>
          <LayoutTemplate className="w-4 h-4" />
          <span className="font-bold">Active Page</span>
        </div>
        {/* Inactive Item */}
        <div className="flex items-center gap-2 px-3 py-2 text-sm border-l-2 border-transparent"
          style={{ color: 'var(--sidebar-text)' }}>
          <LayoutTemplate className="w-4 h-4" style={{ color: 'var(--sidebar-icon-color)' }} />
          <span>Inactive Page</span>
        </div>
        {/* Hover Item Mock */}
        <div className="flex items-center gap-2 px-3 py-2 text-sm border-l-2 border-transparent"
          style={{ backgroundColor: 'var(--sidebar-hover-bg)', color: 'var(--sidebar-text)' }}>
          <LayoutTemplate className="w-4 h-4" style={{ color: 'var(--sidebar-icon-color)' }} />
          <span>Hovered Item</span>
        </div>
      </div>
    </div>
  </div>
);

export const ThemeEditor: React.FC = () => {
  const { themeConfig, updateThemeVar, setThemeConfig, resetTheme, closeModal, saveGlobalSettings, uiLabels, currentLanguage } = useStore();
  const [activeTab, setActiveTab] = useState<'DESIGN' | 'EXPORT'>('DESIGN');
  const [activeGroup, setActiveGroup] = useState<keyof typeof GROUPS>('BRANDING');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const newTheme = await generateThemeFromPrompt(aiPrompt);
    if (newTheme) {
      setThemeConfig(newTheme);
    }
    setIsGenerating(false);
  };

  const getSpfxCode = () => {
    const vars = Object.entries(themeConfig)
      .map(([k, v]) => `    root.style.setProperty('${k}', '${v}');`)
      .join('\n');

    return `
/**
 * SPFx Application Customizer
 * ---------------------------
 * Copy this class to your SharePoint Framework project.
 * This injects the CMS variables at the root level of the site.
 */
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';

export default class WebStudioThemeInjector {
  constructor(private context: ApplicationCustomizerContext) {}

  public onInit(): Promise<void> {
    this.applyTheme();
    return Promise.resolve();
  }

  private applyTheme(): void {
    const root = document.documentElement;
    // -- Generated Variables --
${vars}
    
    // Dynamic Font Loading
    const fontUrl = '${themeConfig['--font-import-url']}';
    if(fontUrl) {
       const link = document.createElement('link');
       link.rel = 'stylesheet';
       link.href = fontUrl;
       document.head.appendChild(link);
    }
    
    console.log("Web Studio Theme Applied Successfully");
  }
}
    `.trim();
  };

  const renderInput = (key: string) => {
    const val = themeConfig[key];
    const isColor = key.toLowerCase().includes('color') || key.includes('bg') || key.includes('hover') || key.includes('gradient');
    const isSize = key.includes('size') || key.includes('padding') || key.includes('radius');
    const isUrl = key.includes('url');

    return (
      <div key={key} className="flex flex-col gap-1 mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{key.replace('--', '').replace(/-/g, ' ')}</label>
        <div className="flex gap-2 items-center">
          {isColor && !key.includes('gradient') && (
            <div className="relative group cursor-pointer">
              <div
                className="w-10 h-10 rounded-none border border-gray-300 shadow-sm"
                style={{ background: val }}
              />
              <input
                type="color"
                value={val.startsWith('#') ? val : '#000000'}
                onChange={(e) => updateThemeVar(key, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
          <input
            type="text"
            value={val}
            onChange={(e) => updateThemeVar(key, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-none text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder={isUrl ? "https://fonts.googleapis.com/..." : "Value"}
          />
          {isSize && <span className="text-xs text-gray-400 font-mono w-8 text-right">px/rem</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[85vh] w-[80vw] min-w-[80vw] max-w-[80vw] bg-white rounded-none shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-none">
            <Palette className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{getTranslation('TITLE_THEME_EDITOR', currentLanguage)}</h2>
            <p className="text-xs text-gray-500"><code>document.documentElement</code> CSS variables.</p>
          </div>
        </div>
        <div className="flex bg-gray-200 rounded-none p-1 gap-1">
          <button
            onClick={() => setActiveTab('DESIGN')}
            className={`px-4 py-2 text-sm font-medium rounded-none transition-all ${activeTab === 'DESIGN' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {getTranslation('TAB_VISUAL_DESIGNER', currentLanguage)}
          </button>
          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`px-4 py-2 text-sm font-medium rounded-none transition-all ${activeTab === 'EXPORT' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {getTranslation('TAB_CODE_EXPORT', currentLanguage)}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'DESIGN' ? (
          <div className="flex w-full">
            {/* Sidebar Categories */}
            <div className="w-64 min-w-[16rem] bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">

              <div className="p-4 space-y-1 overflow-y-auto flex-1">
                {Object.entries(GROUPS).map(([key, group]) => {
                  const Icon = group.icon;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveGroup(key as any)}
                      className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all text-left
            ${activeGroup === key
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {getLocalizedText(
                          uiLabels[`THEME_GROUP_${key}` as keyof typeof uiLabels],
                          currentLanguage
                        ) || key}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (confirm('Are you sure? This will revert all styles to the default system theme.')) {
                      resetTheme();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  {getTranslation('BTN_RESET_DEFAULTS', currentLanguage)}
                </button>
              </div>

            </div>

            {/* Config Area */}
            <div className="flex-1 overflow-y-auto bg-white p-8 border-r border-gray-200">

              {/* Special Help Tab Content */}
              {activeGroup === 'HELP' ? (
                <div className="space-y-6 w-full">
                  <div className="p-6 bg-blue-50 rounded-none border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5" /> {getTranslation('TITLE_HOW_IT_WORKS', currentLanguage)}</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {getTranslation('DESC_HOW_IT_WORKS', currentLanguage)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 border-b pb-2">{getTranslation('TITLE_KEY_CONCEPTS', currentLanguage)}</h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> <span><strong>{getTranslation('DESC_PERSISTENCE', currentLanguage)}</strong></span></li>
                      <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> <span><strong>{getTranslation('DESC_LIVE_PREVIEW', currentLanguage)}</strong></span></li>
                      <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> <span><strong>{getTranslation('DESC_SPFX_EXPORT', currentLanguage)}</strong></span></li>
                    </ul>
                  </div>
                </div>
              ) : (
                /* Standard Config Inputs */
                <>
                  {/* AI Prompt */}
                  <div className="mb-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-none p-6 border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Wand2 className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">{getTranslation('TITLE_AI_THEME', currentLanguage)}</h3>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={getTranslation('PLACEHOLDER_AI_PROMPT', currentLanguage)}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="flex-1 px-4 py-2 border border-purple-200 rounded-none focus:ring-2 focus:ring-purple-400 outline-none text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                      />
                      <button
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className="px-6 py-2 bg-purple-600 text-white rounded-none hover:bg-purple-700 font-medium disabled:opacity-50 text-sm shadow-sm transition-transform active:scale-95"
                      >
                        {isGenerating ? getTranslation('BTN_DREAMING', currentLanguage) : getTranslation('BTN_GENERATE', currentLanguage)}
                      </button>
                    </div>
                  </div>

                  {/* Variable Inputs */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {GROUPS[activeGroup].vars.map(renderInput)}
                  </div>
                </>
              )}
            </div>

            {/* Live Preview Panel */}
            <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 hidden xl:block flex-shrink-0">
              <InternalPreview uiLabels={uiLabels} currentLanguage={currentLanguage} />
            </div>
          </div>
        ) : (
          /* Export View */
          <div className="flex-1 bg-gray-900 p-0 overflow-hidden flex flex-col">
            <div className="flex border-b border-gray-700">
              <div className="px-6 py-3 text-gray-300 text-xs font-mono border-r border-gray-700 bg-gray-800">SPFx Application Customizer</div>
              <div className="px-6 py-3 text-gray-500 text-xs font-mono hover:text-gray-300 cursor-pointer">theme.json</div>
              <div className="px-6 py-3 text-gray-500 text-xs font-mono hover:text-gray-300 cursor-pointer">style.css</div>
            </div>
            <pre className="flex-1 p-6 text-green-400 font-mono text-xs overflow-auto leading-relaxed">
              {getSpfxCode()}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-400">{getTranslation('MSG_CHANGES_APPLIED', currentLanguage)}</span>
        <div className="flex gap-3">
          <button onClick={closeModal} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-none hover:bg-gray-50 text-sm font-medium">
            {getTranslation('BTN_CANCEL', currentLanguage)}
          </button>
          <button onClick={() => { saveGlobalSettings('theme'); closeModal(); }} className="px-6 py-2 bg-blue-600 text-white rounded-none hover:bg-blue-700 shadow-md text-sm font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> {getTranslation('BTN_SAVE_CONFIG', currentLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};
