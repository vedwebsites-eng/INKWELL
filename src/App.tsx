/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Eraser,
  Upload,
  Printer,
  Trash2,
  Sparkles,
  BookOpen,
  Grid,
  FileText,
  X,
  Check,
  Undo2,
  Redo2,
  Copy,
  Download,
  Info,
  Scale,
  Code,
  Quote,
  Minus,
  Lightbulb,
  Plus,
  Mic,
  MicOff,
  History,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Theme configuration
interface Theme {
  id: string;
  name: string;
  bgClass: string;
  paperClass: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
}

const THEMES: Theme[] = [
  {
    id: 'cream',
    name: 'Ivory Cream',
    bgClass: 'bg-[#F3F2EE]', // warm sand/beige desk background from Frosted Glass
    paperClass: 'bg-white text-slate-800 shadow-2xl border border-white/50',
    borderColor: 'border-stone-200/50',
    accentColor: 'indigo',
    textColor: 'text-slate-800',
  },
  {
    id: 'cotton',
    name: 'Pure Cotton',
    bgClass: 'bg-slate-50', // minimal light grey desk
    paperClass: 'bg-white text-zinc-800 shadow-xl shadow-slate-200/60 border border-slate-100',
    borderColor: 'border-slate-200',
    accentColor: 'blue',
    textColor: 'text-zinc-800',
  },
  {
    id: 'sepia',
    name: 'Warm Sepia',
    bgClass: 'bg-[#EFE9DB]', // classic sepia paper desk
    paperClass: 'bg-[#F9F1E1] text-amber-950 shadow-lg shadow-amber-950/5 border border-amber-900/10',
    borderColor: 'border-amber-200/30',
    accentColor: 'amber',
    textColor: 'text-amber-950',
  },
  {
    id: 'forest',
    name: 'Sage Forest',
    bgClass: 'bg-[#ECEFE6]', // soft sage green desk
    paperClass: 'bg-[#F4F6F0] text-emerald-950 shadow-xl shadow-emerald-900/5 border border-emerald-900/10',
    borderColor: 'border-[#CBD4C2]',
    accentColor: 'emerald',
    textColor: 'text-emerald-950',
  },
  {
    id: 'lavender',
    name: 'Royal Lavender',
    bgClass: 'bg-[#F1EEF5]', // soft lilac desk
    paperClass: 'bg-[#F6F4FA] text-indigo-950 shadow-xl shadow-indigo-950/5 border border-indigo-900/10',
    borderColor: 'border-indigo-200/30',
    accentColor: 'purple',
    textColor: 'text-indigo-950',
  },
  {
    id: 'nordic',
    name: 'Nordic Blue',
    bgClass: 'bg-[#E8EEF5]', // clean arctic desk
    paperClass: 'bg-[#F3F7FA] text-sky-950 shadow-xl shadow-sky-950/5 border border-sky-900/10',
    borderColor: 'border-sky-200/30',
    accentColor: 'sky',
    textColor: 'text-sky-950',
  },
  {
    id: 'obsidian',
    name: 'Midnight Quill',
    bgClass: 'bg-zinc-950', // night mode
    paperClass: 'bg-zinc-900 text-zinc-100 shadow-xl shadow-black/80 border border-zinc-800',
    borderColor: 'border-zinc-800',
    accentColor: 'indigo',
    textColor: 'text-zinc-100',
  },
  {
    id: 'charcoal',
    name: 'Charcoal Quill',
    bgClass: 'bg-[#1E2022]', // dark matte charcoal desk
    paperClass: 'bg-[#25282A] text-stone-200 shadow-xl shadow-black/60 border border-stone-800',
    borderColor: 'border-stone-800',
    accentColor: 'stone',
    textColor: 'text-stone-200',
  }
];

// Document layout lines
interface LayoutPattern {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Available typography themes
interface FontOption {
  id: string;
  name: string;
  className: string;
  styleName: string;
}

const FONTS: FontOption[] = [
  { id: 'serif', name: 'Warm Book (Lora)', className: 'font-serif', styleName: "'Lora', Georgia, serif" },
  { id: 'editorial', name: 'Classic Editorial', className: 'font-cormorant', styleName: "'Cormorant Garamond', serif" },
  { id: 'playfair', name: 'Display Serif', className: 'font-playfair', styleName: "'Playfair Display', serif" },
  { id: 'sans', name: 'Modern Sans (Inter)', className: 'font-sans', styleName: "'Inter', sans-serif" },
  { id: 'grotesk', name: 'Eclectic Sans', className: 'font-grotesk', styleName: "'Space Grotesk', sans-serif" },
  { id: 'mono', name: 'Tech Mono', className: 'font-mono', styleName: "'JetBrains Mono', monospace" }
];

// Aesthetic text colors
interface TextColorOption {
  name: string;
  hex: string;
  bgClass: string;
}

const TEXT_COLORS: TextColorOption[] = [
  { name: 'Default', hex: '', bgClass: 'bg-slate-800 border-slate-600' },
  { name: 'Warm Amber', hex: '#78350f', bgClass: 'bg-amber-800 border-amber-600' },
  { name: 'Indigo Deep', hex: '#1e1b4b', bgClass: 'bg-indigo-900 border-indigo-700' },
  { name: 'Crimson Red', hex: '#991b1b', bgClass: 'bg-red-800 border-red-600' },
  { name: 'Forest Green', hex: '#065f46', bgClass: 'bg-emerald-800 border-emerald-600' },
  { name: 'Slate Gray', hex: '#334155', bgClass: 'bg-slate-600 border-slate-500' }
];

// Highlighter colors
interface HighlightColorOption {
  id: string;
  name: string;
  bgClass: string;
}

const HIGHLIGHTS: HighlightColorOption[] = [
  { id: 'yellow', name: 'Mellow Yellow', bgClass: 'bg-yellow-200' },
  { id: 'mint', name: 'Fresh Mint', bgClass: 'bg-emerald-200' },
  { id: 'pink', name: 'Blossom Pink', bgClass: 'bg-pink-200' },
  { id: 'blue', name: 'Sky Blue', bgClass: 'bg-blue-200' }
];

const DEFAULT_DOC_TITLE = "Aesthetic Musings";

const DEFAULT_CONTENT = `<h1>The Art of Clean Writing</h1>
<p class="text-stone-500">Your sanctuary for beautiful, distraction-free document formatting.</p>
<blockquote>
  “Simplicity is the ultimate sophistication. Inkwell turns plain, uninspired texts into clean, visually delightful documents that speak with clarity and elegance.”
</blockquote>
<h2>How to Use Inkwell</h2>
<p>Inkwell is designed to be completely distraction-free, with a centered "paper sheet" editable canvas that replicates high-quality physical writing paper.</p>
<ul>
  <li><strong>Formatting Toolbar:</strong> Simply highlight any text to summon the floating formatting bar, or use the top control panel to adjust headings, lists, alignments, and typography.</li>
  <li><strong>Soft Highlighter:</strong> Choose between <mark class="inkwell-highlight-yellow">Mellow Yellow</mark>, <mark class="inkwell-highlight-mint">Fresh Mint</mark>, <mark class="inkwell-highlight-pink">Blossom Pink</mark>, or <mark class="inkwell-highlight-blue">Sky Blue</mark> to bring texture and character to your annotations.</li>
  <li><strong>Wavy Underlines:</strong> Words styled with <u>underline formatting</u> will automatically render with a smooth, organic wavy line rather than a rigid default browser line.</li>
</ul>
<h3>Getting Started</h3>
<p>To begin, simply select this text and delete it, paste plain text from another source, or <strong>drag and drop a plain text .txt file</strong> anywhere onto this paper sheet. Your draft is automatically backed up via LocalStorage so you can close the tab with absolute peace of mind.</p>`;

interface TextTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
}

const TEXT_TEMPLATES: TextTemplate[] = [
  {
    id: 'guide',
    name: 'Inkwell Guide',
    title: 'Aesthetic Musings',
    content: DEFAULT_CONTENT
  },
  {
    id: 'poetry',
    name: 'Poetry Draft',
    title: 'Ode on Solitude',
    content: `<h1>Ode on Solitude</h1>
<p class="text-stone-500">A meditative poem by Alexander Pope.</p>
<blockquote>
  “Happy the man, whose wish and care<br>
  A few paternal acres bound,<br>
  Content to breathe his native air,<br>
  In his own ground.”
</blockquote>
<p>Whose herds with milk, whose fields with bread,<br>
Whose flocks supply him with attire,<br>
Whose trees in summer yield him shade,<br>
In winter fire.</p>
<p>Blest, who can unconcern’dly find<br>
Hours, days, and years slide soft away,<br>
In health of body, <mark class="inkwell-highlight-yellow">peace of mind</mark>,<br>
Quiet by day,</p>
<p>Sound sleep by night; study and ease<br>
Together mix’d; <u>sweet recreation</u>;<br>
And innocence, which most does please<br>
With meditation.</p>
<p>Thus let me live, unseen, unknown;<br>
Thus unlamented let me die;<br>
Steal from the world, and not a stone<br>
Tell where I lie.</p>`
  },
  {
    id: 'journal',
    name: 'Journal Entry',
    title: 'Sanctuary of Mind',
    content: `<h1>Journal: June 24, 2026</h1>
<p class="text-stone-500">Morning reflection on focus, clarity, and slow living.</p>
<div class="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg my-4 text-sm italic">
  Take three deep breaths. Let go of the digital noise. What is one truth you want to write down today?
</div>
<h2>The Quality of Attention</h2>
<p>Today, I want to practice the art of <u>deep attention</u>. The modern world fragments our focus into infinite notifications, likes, and feed scrolls. But here on this clean page, there are no tabs, no pop-ups, and no indicators. Just a peaceful canvas.</p>
<ul>
  <li><strong>Gratitude 01:</strong> The sound of rain against the window glass.</li>
  <li><strong>Gratitude 02:</strong> Freshly brewed black tea in a heavy ceramic mug.</li>
  <li><strong>Gratitude 03:</strong> The physical weight of books on the wooden shelf.</li>
</ul>
<blockquote>
  “To be passive is to let others design your life. To write is to take back the ink.”
</blockquote>
<p>I will leave this window open as my primary desktop space today. Writing slowly is not a waste of time; it is a declaration of mental independence.</p>`
  },
  {
    id: 'essay',
    name: 'Literary Essay',
    title: 'The Typographic Balance',
    content: `<h1>The Architecture of the Written Word</h1>
<p class="text-stone-500 font-mono text-xs">An inquiry into margins, white space, and the geometry of reading.</p>
<p>Typography is not merely the mechanics of printing; it is the physical medium through which thoughts find form. When we look at a beautifully formatted manuscript, we are experiencing a delicate dialogue between <mark class="inkwell-highlight-mint">black ink</mark> and <mark class="inkwell-highlight-yellow">white paper</mark>.</p>
<h2>1. The Geometry of the Page</h2>
<p>The standard modern word processor treats the page as an endless, clinical coordinate grid. Margins are minimized to fit more content. This efficiency, however, is a disservice to the human mind. High-quality editorial design has always respected the <strong>golden ratio of negative space</strong>.</p>
<blockquote>
  “White space is not empty space; it is the space that allows the form to exist.”
</blockquote>
<p>By giving our columns generous margins, we provide a visual frame. The eye does not have to strain or jump long lines. It glides effortlessly from paragraph to paragraph.</p>
<h2>2. The Rhythm of the Serif</h2>
<p>While sans-serif fonts dominate screens because of low pixel densities of the past, <u>serif typefaces</u> remain the ultimate vehicle for long-form narrative. The tiny details, the brackets, the varied stroke weight—they act as guide rails for reading, creating a horizontal flow that coordinates eye movement.</p>
<pre>
// Layout metrics for optimal reading
const lineSpacing = 1.75;
const optimalColumnWidth = "640px";
const serifFactor = "Lora / Cormorant";
</pre>
<p>Thus, by marrying traditional typography rules with modern minimalist software, we create a sanctuary for writers who seek both focus and aesthetic delight.</p>`
  },
  {
    id: 'meeting',
    name: 'Meeting Minutes',
    title: 'Tactile App Sync',
    content: `<h1>Tactile App Project Sync</h1>
<p class="text-stone-500 font-mono text-xs">Date: June 24, 2026 | Attendees: Design & Engineering Team</p>
<div class="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-lg my-4 text-sm">
  <strong>Strategic Focus:</strong> Elevate the physical sensation of digital document creation through premium glassmorphism and tactile feedback.
</div>
<h2>Agenda & Discussion</h2>
<p>We gathered to review the beta build of the <strong>Inkwell</strong> formatter. The goal is to move away from bloated office suites toward a single, responsive writing sheet that resembles luxury heavy cotton paper.</p>
<h3>Key Product Milestones</h3>
<ul>
  <li><strong>Tactile Highlighting:</strong> Implemented irregular hand-marker highlights (<mark class="inkwell-highlight-yellow">Mellow Yellow</mark>, <mark class="inkwell-highlight-mint">Fresh Mint</mark>, <mark class="inkwell-highlight-pink">Blossom Pink</mark>).</li>
  <li><strong>Wavy Underlines:</strong> Replaced default rigid underlines with organic <u>wavy strokes</u>.</li>
  <li><strong>Export pipeline:</strong> Configured a direct CSS print engine to export pixel-perfect PDFs from any web browser without server delay.</li>
</ul>
<pre>
/* Chrome scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
}
</pre>
<h2>Next Action Items</h2>
<ol>
  <li><strong>Design Team:</strong> Add a <em>Soft Lavender</em> theme and <em>Nordic Blue</em> theme to the styling panel.</li>
  <li><strong>Engineering Team:</strong> Include more font sizes, including Micro Prose (12px) and Grand Display (30px).</li>
  <li><strong>QA Team:</strong> Verify ruled and dot grid notebook paper alignments on widescreen monitors.</li>
</ol>`
  }
];

export default function App() {
  const [docTitle, setDocTitle] = useState<string>(DEFAULT_DOC_TITLE);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [pattern, setPattern] = useState<string>('blank');
  const [baseFont, setBaseFont] = useState<FontOption>(FONTS[0]);
  const [baseFontSize, setBaseFontSize] = useState<string>('text-lg');
  const [kerning, setKerning] = useState<string>('tracking-normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  
  // Floating toolbar state
  const [floatingToolbarCoords, setFloatingToolbarCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    h1: false,
    h2: false,
    h3: false,
    bulletList: false,
    numberList: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
  });

  // Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Stats
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    readTime: 0,
    scoreClass: 'Raw Draft',
    scoreColor: 'text-stone-500 bg-stone-100',
    totalFeatures: 0
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Close toast after delay
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load saved content and settings on mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('inkwell_content');
      if (savedContent && editorRef.current) {
        editorRef.current.innerHTML = savedContent;
      } else if (editorRef.current) {
        editorRef.current.innerHTML = DEFAULT_CONTENT;
      }

      const savedTitle = localStorage.getItem('inkwell_title');
      if (savedTitle) setDocTitle(savedTitle);

      const savedThemeId = localStorage.getItem('inkwell_theme');
      if (savedThemeId) {
        const foundTheme = THEMES.find(t => t.id === savedThemeId);
        if (foundTheme) setTheme(foundTheme);
      }

      const savedPattern = localStorage.getItem('inkwell_pattern');
      if (savedPattern) setPattern(savedPattern);

      const savedFontId = localStorage.getItem('inkwell_font');
      if (savedFontId) {
        const foundFont = FONTS.find(f => f.id === savedFontId);
        if (foundFont) setBaseFont(foundFont);
      }

      const savedFontSize = localStorage.getItem('inkwell_fontsize');
      if (savedFontSize) setBaseFontSize(savedFontSize);

      const savedKerning = localStorage.getItem('inkwell_kerning');
      if (savedKerning) setKerning(savedKerning);

      const savedHighContrast = localStorage.getItem('inkwell_high_contrast');
      if (savedHighContrast === 'true') setHighContrast(true);

      const savedVersions = localStorage.getItem('inkwell_versions');
      if (savedVersions) {
        try {
          setVersions(JSON.parse(savedVersions));
        } catch (e) {
          console.error('Error parsing saved versions', e);
        }
      }

      updateStats();
    } catch (e) {
      console.error('Error reading localStorage data', e);
      showToast('Could not load cached preferences.', 'error');
    }
  }, []);

  // Update live statistics based on current content
  const updateStats = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    
    // Clean text extraction
    const plainText = editorRef.current.innerText || '';
    const wordMatches = plainText.trim().match(/\b\w+\b/g);
    const words = wordMatches ? wordMatches.length : 0;
    const chars = plainText.replace(/\s/g, '').length;
    const readTime = Math.max(1, Math.ceil(words / 220)); // reading speed ~220wpm

    // Style Score calculation (gamifying aesthetic formatting!)
    const headingsCount = (html.match(/<h[1-3]/g) || []).length;
    const highlightsCount = (html.match(/inkwell-highlight-/g) || []).length;
    const underlinesCount = (html.match(/<u>/g) || []).length;
    const listItemsCount = (html.match(/<li>/g) || []).length;
    const blockquotesCount = (html.match(/<blockquote>/g) || []).length;

    const totalFeatures = headingsCount + highlightsCount + underlinesCount + listItemsCount + blockquotesCount;

    let scoreClass = 'Raw Text';
    let scoreColor = 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400';

    if (words > 10 && totalFeatures >= 12) {
      scoreClass = 'Exquisite Masterpiece';
      scoreColor = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30';
    } else if (words > 8 && totalFeatures >= 6) {
      scoreClass = 'Highly Aesthetic';
      scoreColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
    } else if (words > 5 && totalFeatures >= 2) {
      scoreClass = 'Elegantly Structured';
      scoreColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    } else if (words > 0) {
      scoreClass = 'Initial Draft';
      scoreColor = 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300';
    }

    setStats({ words, chars, readTime, scoreClass, scoreColor, totalFeatures });
  };

  // Autosave content to localStorage
  const saveContent = () => {
    if (!editorRef.current) return;
    setSaveStatus('saving');
    try {
      localStorage.setItem('inkwell_content', editorRef.current.innerHTML);
      localStorage.setItem('inkwell_title', docTitle);
      localStorage.setItem('inkwell_theme', theme.id);
      localStorage.setItem('inkwell_pattern', pattern);
      localStorage.setItem('inkwell_font', baseFont.id);
      localStorage.setItem('inkwell_fontsize', baseFontSize);
      localStorage.setItem('inkwell_kerning', kerning);
      localStorage.setItem('inkwell_high_contrast', highContrast ? 'true' : 'false');
      
      setTimeout(() => {
        setSaveStatus('saved');
        updateStats();
      }, 400);
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    }
  };

  // Save content whenever base settings change
  useEffect(() => {
    saveContent();
  }, [docTitle, theme, pattern, baseFont, baseFontSize, kerning, highContrast]);

  // Handle document typing and key events
  const handleEditorInput = () => {
    saveContent();
  };

  // Format pasting to clean plain paragraphs
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    // Convert multi-line plain text to beautifully separated HTML paragraphs
    const paragraphs = text
      .split(/\n{2,}/) // split on double newlines
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        // Handle simple list syntax if found (hyphens, asterisks, numbers)
        if (p.startsWith('- ') || p.startsWith('* ')) {
          const items = p.split(/\n[-*]\s+/).map(li => `<li>${escapeHtml(li.replace(/^[-*]\s+/, ''))}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        if (/^\d+\.\s+/.test(p)) {
          const items = p.split(/\n\d+\.\s+/).map(li => `<li>${escapeHtml(li.replace(/^\d+\.\s+/, ''))}</li>`).join('');
          return `<ol>${items}</ol>`;
        }
        
        // Return simple lines broken with <br> inside paragraphs if single line breaks
        const innerLines = p.split('\n').map(line => escapeHtml(line)).join('<br>');
        return `<p>${innerLines}</p>`;
      })
      .join('');

    const formattedHTML = paragraphs || `<p>${escapeHtml(text)}</p>`;
    document.execCommand('insertHTML', false, formattedHTML);
    saveContent();
    showToast('Pasted plain text formatted aesthetically.', 'success');
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Core rich-formatting execution
  const executeFormat = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    try {
      document.execCommand(command, false, value);
      saveContent();
      updateFloatingToolbar();
    } catch (e) {
      console.error(e);
      showToast('Formatting command failed', 'error');
    }
  };

  // Set selected header levels safely
  const toggleBlockType = (type: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    
    // Check if we are already inside that block type, if so toggle to <p>
    const anchorNode = selection.anchorNode;
    let parent = anchorNode ? anchorNode.parentNode : null;
    let isAlreadyType = false;
    
    while (parent && parent !== editorRef.current) {
      if (parent.nodeName.toLowerCase() === type.toLowerCase()) {
        isAlreadyType = true;
        break;
      }
      parent = parent.parentNode;
    }

    if (isAlreadyType) {
      executeFormat('formatBlock', '<p>');
    } else {
      executeFormat('formatBlock', `<${type}>`);
    }
  };

  // Apply custom hand-drawn marker highlight style
  const applyHighlighter = (colorId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      showToast('Select text first to highlight it', 'info');
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();
    if (!selectedText) return;

    // Create custom styled highlight mark
    const mark = document.createElement('mark');
    mark.className = `inkwell-highlight-${colorId}`;
    mark.id = `hl-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
      
      // Clear selection so the highlight is immediately visible
      selection.removeAllRanges();
      saveContent();
      showToast(`Text highlighted in soft ${colorId}`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Could not highlight this selection.', 'error');
    }
  };

  // Eraser to remove highlights and inline styles
  const clearSelectionHighlights = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      showToast('Select text to erase styling', 'info');
      return;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Traverse upwards to see if selected text is inside a mark or u tag
    let node: Node | null = container;
    let removed = false;

    while (node && node !== editorRef.current) {
      if (node.nodeName === 'MARK') {
        const parent = node.parentNode;
        if (parent) {
          while (node.firstChild) {
            parent.insertBefore(node.firstChild, node);
          }
          parent.removeChild(node);
          removed = true;
        }
        break;
      }
      node = node.parentNode;
    }

    if (!removed) {
      // Standard browser format removal
      document.execCommand('removeFormat', false);
      showToast('Standard text formatting cleared.', 'success');
    } else {
      showToast('Highlighter styling removed successfully.', 'success');
    }

    saveContent();
    updateFloatingToolbar();
  };

  const insertHorizontalRule = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand('insertHorizontalRule', false);
      saveContent();
      showToast('Inserted Divider Line', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const insertBlockquote = () => {
    toggleBlockType('blockquote');
    showToast('Toggled Blockquote', 'success');
  };

  const insertCodeBlock = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || 'const inkwell = "beauty";';
    
    const pre = document.createElement('pre');
    pre.innerText = selectedText;
    
    try {
      range.deleteContents();
      range.insertNode(pre);
      
      const newRange = document.createRange();
      newRange.setStartAfter(pre);
      newRange.setEndAfter(pre);
      selection.removeAllRanges();
      selection.addRange(newRange);
      saveContent();
      showToast('Inserted Code Block', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const insertCalloutBox = (type: 'info' | 'warn' | 'idea') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || 'Insert your callout text here...';
    
    const div = document.createElement('div');
    if (type === 'warn') {
      div.className = 'p-4 bg-red-50/50 dark:bg-red-950/20 border-l-4 border-red-400 dark:border-red-500 rounded-r-lg my-4 text-sm font-sans';
    } else if (type === 'idea') {
      div.className = 'p-4 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg my-4 text-sm font-sans';
    } else {
      div.className = 'p-4 bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg my-4 text-sm font-sans';
    }
    
    div.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${selectedText}`;
    
    try {
      range.deleteContents();
      range.insertNode(div);
      
      const newRange = document.createRange();
      newRange.setStartAfter(div);
      newRange.setEndAfter(div);
      selection.removeAllRanges();
      selection.addRange(newRange);
      saveContent();
      showToast(`Inserted ${type} Callout`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const loadTemplate = (tpl: TextTemplate) => {
    setDocTitle(tpl.title);
    if (editorRef.current) {
      editorRef.current.innerHTML = tpl.content;
      saveContent();
      showToast(`Loaded "${tpl.name}" template`, 'success');
    }
  };

  const createVersionSnapshot = (isAuto = false) => {
    if (!editorRef.current) return;
    const content = editorRef.current.innerHTML;
    const title = docTitle || 'Untitled Draft';
    
    // Read current saved list from localStorage
    const saved = localStorage.getItem('inkwell_versions');
    let list: any[] = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch(e) {}
    }
    
    // Check if the content is different from the most recent version
    if (list.length > 0 && list[0].content === content) {
      if (!isAuto) {
        showToast('Current content is identical to the latest snapshot.', 'info');
      }
      return;
    }
    
    // Plain text statistics
    const plainText = editorRef.current.innerText || '';
    const wordMatches = plainText.trim().match(/\b\w+\b/g);
    const words = wordMatches ? wordMatches.length : 0;
    const chars = plainText.replace(/\s/g, '').length;
    
    const newVersion = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }) + ' ' + new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      title,
      content,
      words,
      chars,
      isAuto
    };
    
    const updated = [newVersion, ...list].slice(0, 10); // cap at 10 to keep it lightweight and fast
    setVersions(updated);
    localStorage.setItem('inkwell_versions', JSON.stringify(updated));
    if (!isAuto) {
      showToast('Created historical version snapshot!', 'success');
    }
  };

  const restoreVersion = (version: any) => {
    if (!editorRef.current) return;
    
    // Take a quick auto-backup of the CURRENT state before overriding, just in case!
    createVersionSnapshot(true);
    
    editorRef.current.innerHTML = version.content;
    setDocTitle(version.title);
    saveContent();
    showToast(`Restored to version from ${version.timestamp}`, 'success');
  };

  const deleteVersion = (id: string) => {
    const updated = versions.filter(v => v.id !== id);
    setVersions(updated);
    localStorage.setItem('inkwell_versions', JSON.stringify(updated));
    showToast('Version deleted from history.', 'info');
  };

  const clearVersionHistory = () => {
    setVersions([]);
    localStorage.removeItem('inkwell_versions');
    showToast('Cleared all historical versions.', 'info');
  };

  // Background version auto-saver snapshot
  useEffect(() => {
    const interval = setInterval(() => {
      createVersionSnapshot(true); // silent auto snapshot
    }, 90 * 1000); // every 90 seconds
    return () => clearInterval(interval);
  }, [docTitle]);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  const toggleListening = () => {
    if (!isSpeechSupported) {
      showToast('Speech recognition is not supported in this browser. Try Chrome/Safari!', 'error');
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }
    
    try {
      if (!recognitionRef.current) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';
        
        rec.onstart = () => {
          setIsListening(true);
          showToast('Voice dictation active. Speak clearly...', 'success');
        };
        
        rec.onresult = (event: any) => {
          const currentResultIndex = event.resultIndex;
          const transcript = event.results[currentResultIndex][0].transcript;
          
          if (transcript && editorRef.current) {
            editorRef.current.focus();
            
            // Insert transcript at cursor position if possible
            try {
              document.execCommand('insertText', false, ' ' + transcript);
              saveContent();
            } catch (err) {
              // Fallback: append text if execCommand fails
              editorRef.current.innerHTML += ' ' + transcript;
              saveContent();
            }
          }
        };
        
        rec.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            showToast('Microphone permission denied.', 'error');
          } else {
            showToast(`Voice input error: ${event.error}`, 'error');
          }
        };
        
        rec.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current = rec;
      }
      
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
      showToast('Could not initialize Speech Recognition.', 'error');
      setIsListening(false);
    }
  };

  // Update floating toolbar position and states based on selection
  const updateFloatingToolbar = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      setIsToolbarVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const editor = editorRef.current;

    // Ensure range is inside our editable paper sheet
    if (!editor || !editor.contains(range.commonAncestorContainer)) {
      setIsToolbarVisible(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    
    // Position toolbar centered horizontally above the selected text bounds
    const x = rect.left + window.scrollX + rect.width / 2;
    const y = rect.top + window.scrollY - 12; // 12px padding above selection

    setFloatingToolbarCoords({ x, y });
    setIsToolbarVisible(true);

    // Read current formatting states to toggle toolbar button styles
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      h1: document.queryCommandValue('formatBlock') === 'h1',
      h2: document.queryCommandValue('formatBlock') === 'h2',
      h3: document.queryCommandValue('formatBlock') === 'h3',
      bulletList: document.queryCommandState('insertUnorderedList'),
      numberList: document.queryCommandState('insertOrderedList'),
      alignLeft: document.queryCommandState('justifyLeft') || document.queryCommandValue('justifyLeft') === 'true',
      alignCenter: document.queryCommandState('justifyCenter') || document.queryCommandValue('justifyCenter') === 'true',
      alignRight: document.queryCommandState('justifyRight') || document.queryCommandValue('justifyRight') === 'true',
      alignJustify: document.queryCommandState('justifyFull') || document.queryCommandValue('justifyFull') === 'true',
    });
  };

  // Global mouse up / selection monitor
  useEffect(() => {
    const handleSelectionChange = () => {
      updateFloatingToolbar();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Set inline span styling for font sizes / custom colors in selections
  const applyInlineSpanStyle = (property: string, value: string) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      showToast('Select text first to apply inline styles.', 'info');
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.setProperty(property, value);

    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      saveContent();
    } catch (e) {
      console.error(e);
    }
  };

  // Upload/Import plain text file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importTextFile(file);
    e.target.value = ''; // Reset input
  };

  const importTextFile = (file: File) => {
    // Error check for non-plain text files
    if (!file.name.toLowerCase().endsWith('.txt')) {
      showToast(`"${file.name}" is not a plain text file. Please copy-paste content from other doc types directly into the canvas.`, 'error');
      return;
    }

    // Size warning (1MB)
    if (file.size > 1024 * 1024) {
      showToast('File is too large. Inkwell supports plain text documents up to 1MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          showToast('The imported file is empty.', 'info');
          return;
        }

        // Parse plain text and map lines into aesthetic elements
        const html = text
          .split(/\r?\n/)
          .map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '<p><br></p>';
            if (trimmed.startsWith('# ')) return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
            if (trimmed.startsWith('## ')) return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
            if (trimmed.startsWith('### ')) return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
            return `<p>${escapeHtml(trimmed)}</p>`;
          })
          .join('');

        if (editorRef.current) {
          editorRef.current.innerHTML = html;
          setDocTitle(file.name.replace(/\.[^/.]+$/, "")); // Strip extension for document title
          saveContent();
          showToast(`Successfully loaded "${file.name}" into the sheet`, 'success');
        }
      } catch (err) {
        console.error(err);
        showToast('Error formatting plain text file content.', 'error');
      }
    };

    reader.onerror = () => {
      showToast('Failed to read the uploaded text file.', 'error');
    };

    reader.readAsText(file);
  };

  // Export Document as Plain Text File
  const handleExportText = () => {
    if (!editorRef.current) return;
    // Strip HTML elements cleanly to export as plain txt
    const plainText = editorRef.current.innerText || '';
    
    try {
      const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docTitle || 'Inkwell_Draft'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Draft downloaded as .txt file!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to export draft.', 'error');
    }
  };

  // Copy HTML source
  const handleCopyHtml = () => {
    if (!editorRef.current) return;
    try {
      navigator.clipboard.writeText(editorRef.current.innerHTML);
      showToast('Aesthetic HTML code copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy code.', 'error');
    }
  };

  // Clear Editor Content completely
  const handleClearEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '<h1></h1><p><br></p>';
      saveContent();
      showToast('Paper sheet cleared. Start fresh!', 'info');
    }
    setShowClearConfirm(false);
  };

  // Launch browser native print dialog (combines with @media print layout rules)
  const handlePrint = () => {
    window.print();
  };

  // File drag states
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      importTextFile(file);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out flex flex-col ${theme.bgClass} relative overflow-hidden`}>
      
      {/* Frosted Glass Background Blobs */}
      <div className="absolute inset-0 opacity-50 pointer-events-none z-0 overflow-hidden no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-300/30 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse duration-[12s]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-orange-200/30 dark:bg-amber-950/10 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[35%] left-[65%] w-[35%] h-[35%] bg-rose-200/25 dark:bg-rose-950/10 rounded-full blur-[100px]" />
      </div>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            id="inkwell-toast"
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-900/50'
                : toast.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-900/50'
                : 'bg-indigo-50 text-indigo-800 border-indigo-100 dark:bg-indigo-950/90 dark:text-indigo-300 dark:border-indigo-900/50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
            }`} />
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)} 
              className="text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors ml-2"
              id="close-toast-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Selection Formatting Toolbar */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 24,
              mass: 0.8
            }}
            id="floating-toolbar"
            className="absolute bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 dark:border-zinc-800/40 flex items-center p-2 gap-1 no-print"
            style={{
              left: `${floatingToolbarCoords.x}px`,
              top: `${floatingToolbarCoords.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 100,
            }}
          >
            {/* Inline Styles */}
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeFormat('bold')}
              title="Bold"
              className={`p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors ${
                activeFormats.bold ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40' : 'text-slate-600 dark:text-zinc-400'
              }`}
              id="float-bold-btn"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeFormat('italic')}
              title="Italic"
              className={`p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors ${
                activeFormats.italic ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40' : 'text-slate-600 dark:text-zinc-400'
              }`}
              id="float-italic-btn"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeFormat('underline')}
              title="Wavy Underline"
              className={`p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors ${
                activeFormats.underline ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40' : 'text-slate-600 dark:text-zinc-400'
              }`}
              id="float-underline-btn"
            >
              <Underline className="w-4 h-4" />
            </button>

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeFormat('strikeThrough')}
              title="Strikethrough"
              className={`p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors ${
                activeFormats.strikethrough ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40' : 'text-slate-600 dark:text-zinc-400'
              }`}
              id="float-strikethrough-btn"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-stone-200 dark:bg-zinc-800 mx-1" />

            {/* Aesthetic Colors Selection */}
            {TEXT_COLORS.slice(1, 5).map(col => (
              <button
                key={col.name}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => executeFormat('foreColor', col.hex)}
                title={col.name}
                className="p-1 rounded-full hover:scale-115 transition-transform"
                id={`float-color-${col.name.replace(/\s+/g, '-').toLowerCase()}-btn`}
              >
                <div className={`w-4.5 h-4.5 rounded-full ${col.bgClass} border border-white/20`} />
              </button>
            ))}

            <div className="w-[1px] h-5 bg-stone-200 dark:bg-zinc-800 mx-1" />

            {/* Hand-drawn Highlighters */}
            {HIGHLIGHTS.map(hl => (
              <button
                key={hl.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlighter(hl.id)}
                title={`Highlight in ${hl.name}`}
                className="p-1 rounded hover:scale-110 transition-transform"
                id={`float-hl-${hl.id}-btn`}
              >
                <div className={`w-5 h-4.5 rounded ${hl.bgClass} flex items-center justify-center`} />
              </button>
            ))}

            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearSelectionHighlights}
              title="Clear Highlights & Styles"
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-rose-500 transition-colors"
              id="float-eraser-btn"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header navigation */}
      <header className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-white/30 dark:border-zinc-800/30 px-6 py-4 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Document Title */}
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/15">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-grotesk font-semibold text-lg tracking-tight text-slate-900 dark:text-white">Inkwell</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-mono px-1.5 py-0.5 rounded-md">V1.2</span>
              </div>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Untitled Aesthetic Work"
                className="text-xs text-slate-500 dark:text-zinc-400 bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-zinc-700 focus:border-indigo-500 focus:outline-none py-0.5 transition-all w-48 font-medium font-sans"
                title="Click to rename document"
                id="doc-title-input"
              />
            </div>
          </div>

          {/* Quick Toolbar Settings: Fonts, Themes, Layout, Files */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Font Family selector */}
            <div className="flex items-center gap-1.5 bg-stone-100/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-stone-200/30 dark:border-zinc-700/50">
              <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">Font</span>
              <select
                value={baseFont.id}
                onChange={(e) => {
                  const selected = FONTS.find(f => f.id === e.target.value);
                  if (selected) setBaseFont(selected);
                }}
                className="text-xs bg-transparent focus:outline-none font-medium text-slate-700 dark:text-zinc-200 cursor-pointer"
                title="Select Base Font Theme"
                id="font-select"
              >
                {FONTS.map(f => (
                  <option key={f.id} value={f.id} className="dark:bg-zinc-900 dark:text-zinc-100">
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size selector */}
            <div className="flex items-center gap-1.5 bg-stone-100/80 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-stone-200/30 dark:border-zinc-700/50">
              <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">Size</span>
              <select
                value={baseFontSize}
                onChange={(e) => setBaseFontSize(e.target.value)}
                className="text-xs bg-transparent focus:outline-none font-medium text-slate-700 dark:text-zinc-200 cursor-pointer"
                title="Select Base Font Size"
                id="font-size-select"
              >
                <option value="text-xs" className="dark:bg-zinc-900">Micro Prose (Tiny)</option>
                <option value="text-sm" className="dark:bg-zinc-900">Fine Print (Small)</option>
                <option value="text-base" className="dark:bg-zinc-900">Standard Text</option>
                <option value="text-lg" className="dark:bg-zinc-900">Generous (Aesthetic)</option>
                <option value="text-xl" className="dark:bg-zinc-900">Large Reader</option>
                <option value="text-2xl" className="dark:bg-zinc-900">Grand Display (Title)</option>
                <option value="text-3xl" className="dark:bg-zinc-900">Immense (Dramatic)</option>
                <option value="text-4xl" className="dark:bg-zinc-900">Monumental (Max)</option>
              </select>
            </div>

            {/* Layout Grid pattern selector */}
            <div className="flex items-center gap-1 bg-stone-100/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-stone-200/30 dark:border-zinc-700/50">
              <button
                onClick={() => setPattern('blank')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  pattern === 'blank' ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                }`}
                title="Plain Blank Paper"
                id="pattern-blank-btn"
              >
                Blank
              </button>
              <button
                onClick={() => setPattern('ruled')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  pattern === 'ruled' ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                }`}
                title="Notebook Ruled Lines"
                id="pattern-ruled-btn"
              >
                Ruled
              </button>
              <button
                onClick={() => setPattern('grid')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  pattern === 'grid' ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                }`}
                title="Dot Grid Notebook"
                id="pattern-grid-btn"
              >
                Dot Grid
              </button>
            </div>

            {/* Voice Input dictation tool */}
            <button
              onClick={toggleListening}
              className={`p-2 transition-all relative rounded-xl flex items-center justify-center ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-stone-100 dark:hover:bg-zinc-800/60'
              }`}
              title={isListening ? 'Stop Voice Input' : 'Start Voice Input (Dictation)'}
              id="voice-input-btn"
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 border border-white rounded-full animate-ping" />
                </>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Help / Clear */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-stone-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
              title="Usage Guidelines"
              id="help-guide-btn"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8 justify-center items-stretch relative">
        
        {/* LEFT COLUMN: Sidebar with formatting, upload actions and metadata (no-print) */}
        <aside className="lg:w-72 flex flex-col gap-6 no-print">
          
          {/* Document Properties & Styling station */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-white/40 dark:border-zinc-800/40 p-5 rounded-2xl shadow-xl flex flex-col gap-5">
            <h3 className="font-grotesk font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Canvas Styling</span>
            </h3>

            {/* Visual Theme Choice */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">Workspace Themes</span>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(th => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                      theme.id === th.id
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm'
                        : 'border-stone-100 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-950/20'
                    }`}
                    id={`theme-select-${th.id}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      th.id === 'cream' ? 'bg-[#FCFAF2] border border-stone-300' :
                      th.id === 'cotton' ? 'bg-white border border-stone-200' :
                      th.id === 'sepia' ? 'bg-[#F9F1E1] border border-amber-200/60' :
                      th.id === 'forest' ? 'bg-[#F4F6F0] border border-emerald-300' :
                      th.id === 'lavender' ? 'bg-[#F6F4FA] border border-purple-200' :
                      th.id === 'nordic' ? 'bg-[#F3F7FA] border border-sky-200' :
                      th.id === 'obsidian' ? 'bg-zinc-900 border border-zinc-700' :
                      'bg-stone-800 border border-stone-700'
                    }`} />
                    <span className="text-xs font-medium text-slate-700 dark:text-zinc-200">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typographic & Contrast Controls */}
            <div className="flex flex-col gap-3 border-t border-stone-100 dark:border-zinc-800/60 pt-4">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">Aesthetic Adjustments</span>
              
              <div className="flex flex-col gap-2.5">
                {/* Font Kerning */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-zinc-300">Font Kerning</span>
                  <select
                    value={kerning}
                    onChange={(e) => setKerning(e.target.value)}
                    className="text-xs bg-stone-100 dark:bg-zinc-800 focus:outline-none font-medium text-slate-700 dark:text-zinc-200 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-stone-200 dark:hover:border-zinc-700 cursor-pointer"
                    title="Select letter spacing / font kerning"
                    id="kerning-select"
                  >
                    <option value="tracking-tighter">Compact-Tight</option>
                    <option value="tracking-tight">Tight</option>
                    <option value="tracking-normal">Standard</option>
                    <option value="tracking-wide">Spacious</option>
                    <option value="tracking-wider">Atmospheric</option>
                  </select>
                </div>

                {/* Dark Contrast toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-600 dark:text-zinc-300">High Contrast</span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-sans">Maximize text readability</span>
                  </div>
                  <button
                    onClick={() => {
                      setHighContrast(!highContrast);
                      showToast(!highContrast ? 'High contrast accessibility mode active.' : 'Standard contrast mode.', 'success');
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
                      highContrast ? 'bg-indigo-600' : 'bg-stone-200 dark:bg-zinc-800'
                    }`}
                    title="Toggle High Contrast Mode"
                    id="high-contrast-toggle-btn"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Formatting shortcuts */}
            <div className="flex flex-col gap-2 border-t border-stone-100 dark:border-zinc-800/60 pt-4">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider mb-1">Structural Formats</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => toggleBlockType('h1')}
                  className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Toggle Large Title (H1)"
                  id="btn-structure-h1"
                >
                  Title H1
                </button>
                <button
                  onClick={() => toggleBlockType('h2')}
                  className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Toggle Subheading (H2)"
                  id="btn-structure-h2"
                >
                  Header H2
                </button>
                <button
                  onClick={() => toggleBlockType('h3')}
                  className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-700 dark:text-zinc-300 transition-colors"
                  title="Toggle Section Header (H3)"
                  id="btn-structure-h3"
                >
                  Section H3
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => executeFormat('insertUnorderedList')}
                  className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                  title="Toggle Bullet List"
                  id="btn-structure-bullet"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Bullets</span>
                </button>
                <button
                  onClick={() => executeFormat('insertOrderedList')}
                  className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                  title="Toggle Numbered List"
                  id="btn-structure-number"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Numbers</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mt-1 border-t border-stone-50 dark:border-zinc-800/50 pt-2.5">
                <button
                  onClick={() => executeFormat('justifyLeft')}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-600 dark:text-zinc-300 flex justify-center"
                  title="Align Left"
                  id="btn-align-left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeFormat('justifyCenter')}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-600 dark:text-zinc-300 flex justify-center"
                  title="Align Center"
                  id="btn-align-center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeFormat('justifyRight')}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-600 dark:text-zinc-300 flex justify-center"
                  title="Align Right"
                  id="btn-align-right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => executeFormat('justifyFull')}
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 text-slate-600 dark:text-zinc-300 flex justify-center"
                  title="Justify Align"
                  id="btn-align-justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* More Structural Formats block */}
              <div className="flex flex-col gap-2 border-t border-stone-100 dark:border-zinc-800/60 pt-3 mt-1">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider mb-1">Aesthetic Layouts</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={insertBlockquote}
                    className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Insert Blockquote block"
                    id="btn-structure-quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Pull Quote</span>
                  </button>
                  <button
                    onClick={insertCodeBlock}
                    className="p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Insert Code Block block"
                    id="btn-structure-code"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Code block</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  <button
                    onClick={() => insertCalloutBox('info')}
                    className="p-2 text-[10px] font-semibold rounded-lg bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100/50 border border-blue-100 dark:border-blue-900/30 flex flex-col items-center gap-1 transition-all cursor-pointer"
                    title="Insert Info Callout"
                    id="btn-callout-info"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Info Box</span>
                  </button>
                  <button
                    onClick={() => insertCalloutBox('warn')}
                    className="p-2 text-[10px] font-semibold rounded-lg bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 hover:bg-red-100/50 border border-red-100 dark:border-red-900/30 flex flex-col items-center gap-1 transition-all cursor-pointer"
                    title="Insert Warn Callout"
                    id="btn-callout-warn"
                  >
                    <Info className="w-3.5 h-3.5 text-red-500" />
                    <span>Warn Box</span>
                  </button>
                  <button
                    onClick={() => insertCalloutBox('idea')}
                    className="p-2 text-[10px] font-semibold rounded-lg bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 border border-amber-100 dark:border-amber-900/30 flex flex-col items-center gap-1 transition-all cursor-pointer"
                    title="Insert Idea Callout"
                    id="btn-callout-idea"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Idea Box</span>
                  </button>
                </div>

                <button
                  onClick={insertHorizontalRule}
                  className="w-full mt-1 p-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Insert Elegant Divider Rule"
                  id="btn-structure-divider"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Insert Divider Line</span>
                </button>
              </div>
            </div>
          </div>

          {/* Aesthetic Text Templates & Presets (Inspirational Starters) */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-white/40 dark:border-zinc-800/40 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
            <h3 className="font-grotesk font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Inspirational Starters</span>
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed font-sans">
              Load an exquisitely structured text prompt preset to practice formatting or start a draft.
            </p>
            <div className="flex flex-col gap-1.5">
              {TEXT_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => loadTemplate(tpl)}
                  className="w-full text-left py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 transition-all font-sans text-xs flex items-center justify-between group border border-transparent hover:border-stone-200/50 dark:hover:border-zinc-700/50 cursor-pointer"
                  id={`tpl-load-${tpl.id}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="font-medium">{tpl.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Import/Export & Actions hub */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-white/40 dark:border-zinc-800/40 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
            <h3 className="font-grotesk font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-zinc-800 pb-2.5">
              <span>Document Actions</span>
            </h3>

            {/* Custom styled File Upload */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
                id="file-upload-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-300 hover:border-indigo-500 dark:border-zinc-700 dark:hover:border-indigo-400 bg-stone-50 hover:bg-indigo-50/10 dark:bg-zinc-950/30 dark:hover:bg-indigo-950/10 text-slate-600 dark:text-zinc-300 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Import content from .txt file"
                id="btn-upload-trigger"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Text Document</span>
              </button>
            </div>

            {/* Quick clean pasting helper instruction */}
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed font-sans">
              To format a <strong>PDF</strong>, simply copy its text, paste it onto the paper sheet, and Inkwell will tidy its paragraph spacing instantly!
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-zinc-800/60">
              <button
                onClick={handlePrint}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Print or Save to PDF via Browser"
                id="btn-print-doc"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={handleExportText}
                className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Export clean plain text draft"
                id="btn-download-text"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyHtml}
                className="py-2 px-3 rounded-xl border border-stone-200 hover:border-stone-300 dark:border-zinc-800 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Copy styled HTML markup code"
                id="btn-copy-html"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HTML</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="py-2 px-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/10 text-rose-500 hover:text-rose-600 font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Clear and erase draft"
                id="btn-clear-modal-open"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Paper</span>
              </button>
            </div>
          </div>

          {/* Historical Checkpoints / Version History hub */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-white/40 dark:border-zinc-800/40 p-5 rounded-2xl shadow-xl flex flex-col gap-3.5 no-print">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 pb-2.5">
              <h3 className="font-grotesk font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                <span>Version History</span>
              </h3>
              <button
                onClick={() => createVersionSnapshot(false)}
                className="py-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                title="Create a manual backup snapshot"
                id="btn-manual-snapshot"
              >
                <Plus className="w-3 h-3" />
                <span>Snapshot</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed font-sans">
              Inkwell takes background snapshots of your draft. Restore any previous checkpoint instantly.
            </p>

            <div className="max-h-56 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin">
              {versions.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl">
                  <Clock className="w-5 h-5 text-stone-300 dark:text-zinc-700 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans font-medium">No saved checkpoints yet</span>
                </div>
              ) : (
                versions.map(v => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-xl border border-stone-100 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-950/20 hover:bg-stone-100/50 dark:hover:bg-zinc-950/40 transition-all flex items-center justify-between group gap-2"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-300 truncate">
                          {v.timestamp}
                        </span>
                        {v.isAuto ? (
                          <span className="text-[8px] bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold px-1 rounded">Auto</span>
                        ) : (
                          <span className="text-[8px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold px-1 rounded">Manual</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono">
                        {v.words} words • {v.chars} chars
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => restoreVersion(v)}
                        className="p-1 rounded-md hover:bg-white dark:hover:bg-zinc-800 text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Restore this version"
                        id={`btn-restore-${v.id}`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteVersion(v.id)}
                        className="p-1 rounded-md hover:bg-white dark:hover:bg-zinc-800 text-rose-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete checkpoint"
                        id={`btn-delete-${v.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {versions.length > 0 && (
              <button
                onClick={clearVersionHistory}
                className="w-full py-1.5 text-[10px] font-semibold text-slate-400 hover:text-rose-500 hover:bg-rose-50/30 dark:hover:bg-rose-950/10 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20 cursor-pointer text-center"
                id="btn-clear-history"
              >
                Clear History Logs
              </button>
            )}
          </div>

          {/* Living Document Statistics Panel */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-white/40 dark:border-zinc-800/40 p-5 rounded-2xl shadow-xl flex flex-col gap-3.5">
            <h3 className="font-grotesk font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-zinc-800">
              <Scale className="w-4 h-4 text-emerald-500" />
              <span>Document Score</span>
            </h3>

            {/* Style Rating */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium font-sans">Aesthetic Status:</span>
              <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full transition-all ${stats.scoreColor}`} id="aesthetic-status-badge">
                {stats.scoreClass}
              </span>
            </div>

            {/* Counts */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-stone-50 dark:bg-zinc-950 p-2 rounded-xl">
                <span className="block text-sm font-mono font-bold text-slate-800 dark:text-zinc-100">{stats.words}</span>
                <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">Words</span>
              </div>
              <div className="bg-stone-50 dark:bg-zinc-950 p-2 rounded-xl">
                <span className="block text-sm font-mono font-bold text-slate-800 dark:text-zinc-100">{stats.chars}</span>
                <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">Chars</span>
              </div>
              <div className="bg-stone-50 dark:bg-zinc-950 p-2 rounded-xl">
                <span className="block text-sm font-mono font-bold text-slate-800 dark:text-zinc-100">{stats.readTime}m</span>
                <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">Read Time</span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: The Centered Physical "Paper Sheet" */}
        <section className="flex-1 flex flex-col items-center relative">
          
          {/* File drag-and-drop backdrop overlay */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-indigo-600/10 backdrop-blur-md rounded-3xl border-2 border-dashed border-indigo-500 z-40 flex flex-col items-center justify-center gap-4 text-indigo-600 dark:text-indigo-400 font-sans"
                id="drag-upload-overlay"
              >
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-full shadow-2xl flex items-center justify-center scale-110">
                  <FileText className="w-10 h-10 animate-bounce" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold font-grotesk">Drop Plain Text File Here</h4>
                  <p className="text-xs text-indigo-500/80 mt-1">Inkwell will instantly format it aesthetics-first</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paper Sheet Document Canvas Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full max-w-3xl min-h-[840px] px-8 sm:px-20 py-16 sm:py-24 rounded-3xl relative transition-all duration-300 print-paper ${
              highContrast
                ? (theme.id === 'obsidian' || theme.id === 'charcoal'
                  ? 'bg-black text-white shadow-2xl border-2 border-zinc-300 font-medium tracking-wide'
                  : 'bg-white text-stone-950 shadow-2xl border-2 border-stone-950 font-semibold')
                : theme.paperClass
            }`}
            style={{
              fontFamily: baseFont.styleName,
              ... (pattern === 'ruled' ? {
                backgroundImage: `linear-gradient(to right, transparent 55px, ${highContrast ? 'rgba(239, 68, 68, 0.45)' : (theme.id === 'obsidian' || theme.id === 'charcoal' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.25)')} 55px, ${highContrast ? 'rgba(239, 68, 68, 0.45)' : (theme.id === 'obsidian' || theme.id === 'charcoal' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.25)')} 57px, transparent 57px), linear-gradient(${highContrast ? (theme.id === 'obsidian' || theme.id === 'charcoal' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(99, 102, 241, 0.18)') : (theme.id === 'obsidian' || theme.id === 'charcoal' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.08)')} 1px, transparent 1px)`,
                backgroundSize: '100% 100%, 100% 2.3rem',
                lineHeight: '2.3rem',
              } : pattern === 'grid' ? {
                backgroundImage: `radial-gradient(${highContrast ? (theme.id === 'obsidian' || theme.id === 'charcoal' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(99, 102, 241, 0.18)') : (theme.id === 'obsidian' || theme.id === 'charcoal' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.08)')} 1.2px, transparent 1.2px)`,
                backgroundSize: '1.65rem 1.65rem',
              } : {})
            }}
            id="paper-sheet-container"
          >
            {/* Top Binder/Notebook aesthetics decoration (faint details to add absolute realism and quality!) */}
            <div className="absolute top-0 left-0 right-0 h-6 flex justify-between px-16 pointer-events-none no-print opacity-60">
              <div className="w-12 h-1.5 bg-stone-300/40 dark:bg-zinc-800/80 rounded-b-md" />
              <div className="w-12 h-1.5 bg-stone-300/40 dark:bg-zinc-800/80 rounded-b-md" />
              <div className="w-12 h-1.5 bg-stone-300/40 dark:bg-zinc-800/80 rounded-b-md" />
            </div>

            {/* Clean contenteditable area */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              onPaste={handlePaste}
              className={`inkwell-editor w-full h-full focus:outline-none min-h-[680px] text-justify ${baseFontSize} ${kerning}`}
              id="inkwell-contenteditable-canvas"
              style={{
                outline: 'none',
              }}
              suppressContentEditableWarning
            />

            {/* Bottom Paper status footer */}
            <div className="mt-16 pt-6 border-t border-dashed border-stone-200/50 dark:border-zinc-800/50 flex justify-between items-center no-print">
              <div className="text-[10px] font-mono text-slate-400 font-semibold flex items-center gap-2 uppercase">
                <span>{baseFont.name}</span>
                <span>•</span>
                <span>{baseFontSize.replace('text-', '')} scale</span>
              </div>
              
              {/* Tactile saving status */}
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-amber-500 font-semibold uppercase">Saving Draft...</span>
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-mono text-rose-500 font-semibold uppercase">Save Error</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold uppercase" id="saved-indicator">Draft Saved</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Help & Formatting Guidelines Guide modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              id="help-modal"
              className="backdrop-blur-xl bg-white/75 dark:bg-zinc-900/75 rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-white/40 dark:border-zinc-800/40 flex flex-col gap-4 font-sans text-slate-800 dark:text-zinc-200"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-zinc-800">
                <h3 className="font-grotesk font-bold text-base text-slate-950 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <span>The Inkwell Philosophy</span>
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 transition-colors"
                  id="close-help-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs leading-relaxed flex flex-col gap-4.5">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Aesthetic Typography Preset Themes
                  </h4>
                  <p className="text-slate-500 dark:text-zinc-400">
                    Inkwell values strict visual consistency. Selecting font styles in the top panel changes the base template instantly to guarantee heading hierarchies stay perfectly in alignment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Organic Wavy Underlining
                  </h4>
                  <p className="text-slate-500 dark:text-zinc-400">
                    Traditional underlines are sterile and mechanical. Inkwell modifies the standard browser text underline so any underlined text automatically renders with a hand-drawn, soft wavy ink stroke.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Hand-crafted highlighter marks
                  </h4>
                  <p className="text-slate-500 dark:text-zinc-400">
                    Select text on the paper sheet to call the floating highlight palette. Highlighting text wraps words in soft rounded highlighter blocks with organic border radii simulating real felt tips.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Draft Autosaving
                  </h4>
                  <p className="text-slate-500 dark:text-zinc-400">
                    Every keystroke updates the secure sandbox. LocalStorage takes care of the drafts so your latest revision is restored immediately upon reloading the page.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setShowHelp(false)}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-600/10 cursor-pointer"
                  id="help-dismiss-btn"
                >
                  Write On
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation modal for clearing document */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              id="clear-confirm-modal"
              className="backdrop-blur-xl bg-white/75 dark:bg-zinc-900/75 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-white/40 dark:border-zinc-800/40 flex flex-col gap-4 font-sans text-slate-800 dark:text-zinc-200"
            >
              <h3 className="font-grotesk font-bold text-sm text-rose-500 dark:text-rose-400">
                Erase Entire Draft?
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                You are about to completely wipe all content from the paper sheet. This action cannot be undone and will overwrite the localStorage cache.
              </p>
              <div className="flex gap-2.5 justify-end pt-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="py-2 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs font-semibold cursor-pointer"
                  id="clear-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearEditor}
                  className="py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/10 cursor-pointer"
                  id="clear-confirm-btn"
                >
                  Yes, Erase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
