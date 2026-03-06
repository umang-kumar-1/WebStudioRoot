import React, { useMemo, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
// Note: Jodit CSS is loaded dynamically in useEffect to avoid SPFx webpack issues
import './JoditEditor.css'; // Custom styles

export interface JoditRichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
    readonly?: boolean;
}

/**
 * A reusable Jodit Rich Text Editor component with custom configuration
 * Supports WYSIWYG editing, formatting tools, image upload (base64), tables, links, and more
 */
export const JoditRichTextEditor: React.FC<JoditRichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Start typing...',
    height = 300,
    readonly = false
}) => {
    const editor = useRef(null);

    // Dynamically load Jodit CSS from CDN to avoid SPFx webpack issues
    useEffect(() => {
        const joditCssId = 'jodit-editor-css';

        // Check if CSS is already loaded
        if (!document.getElementById(joditCssId)) {
            const link = document.createElement('link');
            link.id = joditCssId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/jodit@4.1.2/es2021/jodit.min.css';
            document.head.appendChild(link);
        }
    }, []);

    // Jodit configuration
    const config: any = useMemo(() => ({
        readonly,
        placeholder,
        height,

        // Toolbar configuration - optimized for descriptions, content, and HTML fields
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', '|',
            'align', '|',
            'image', 'link', 'table', '|',
            'hr', 'eraser', '|',
            'undo', 'redo', '|',
            'fullsize'
        ],

        // Enable custom accordion/collapse button in a future update if needed
        buttonsMD: [
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', '|',
            'align', '|',
            'image', 'link', '|',
            'source'
        ],

        buttonsSM: [
            'bold', 'italic', '|',
            'ul', 'ol', '|',
            'image', 'link', '|',
            'source'
        ],

        buttonsXS: [
            'bold', 'italic', '|',
            'image', 'link'
        ],

        // Image upload configuration - base64
        uploader: {
            insertImageAsBase64URI: true,
            imagesExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
        },

        // Remove dangerous tags and clean up HTML
        cleanHTML: {
            removeEmptyElements: true,
            fillEmptyParagraph: false,
            replaceNBSP: true,
            replaceOldTags: {
                i: 'em',
                b: 'strong'
            }
        },

        // Font sanitization
        controls: {
            font: {
                list: {
                    'Arial': 'Arial, Helvetica, sans-serif',
                    'Georgia': 'Georgia, serif',
                    'Tahoma': 'Tahoma, Geneva, sans-serif',
                    'Times New Roman': 'Times New Roman, Times, serif',
                    'Verdana': 'Verdana, Geneva, sans-serif',
                    'Courier New': 'Courier New, Courier, monospace',
                    'Comic Sans MS': 'Comic Sans MS, cursive',
                    'Impact': 'Impact, Charcoal, sans-serif'
                }
            }
        },

        // Other settings
        toolbarAdaptive: true,
        toolbarSticky: false,
        showCharsCounter: true,
        showWordsCounter: true,
        showXPathInStatusbar: false,
        beautifyHTML: true,

        // Prevent paste from Word formatting issues
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_clear_html',

        // Link settings
        link: {
            openInNewTabCheckbox: true,
            noFollowCheckbox: false,
            modeClassName: false
        },

        // Table settings
        table: {
            selectionCellStyle: 'border: 1px double #1e88e5 !important;',
            useExtraClassesOptions: false
        },

        // Disable iframe mode for better integration
        iframe: false,

        // License key - using free version
        // If you have a license, add it here: license: 'YOUR-LICENSE-KEY'

        // Events
        events: {
            // Sanitize font family on change
            afterSetMode: function () {
                // Optional: Add custom logic after mode change
            }
        },

        // Disable spell check for better performance
        spellcheck: false,

        // Direction
        direction: 'ltr',

        // Language
        language: 'en',

        // Allow resizing
        allowResizeX: false,
        allowResizeY: true,

        // Min/Max height
        minHeight: 200,
        maxHeight: 800,

        // Status bar
        statusbar: true,

        // Theme
        theme: 'default',

        // Color picker
        colorPickerDefaultTab: 'background',

        // Image default width
        imageDefaultWidth: 300

    }), [readonly, placeholder, height]);

    return (
        <div className="jodit-wrapper">
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                onBlur={onChange} // preferred to use onBlur instead of onChange for performance
                onChange={() => { }} // Use onBlur for actual changes
            />
        </div>
    );
};

export default JoditRichTextEditor;
