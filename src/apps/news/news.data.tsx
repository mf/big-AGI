import * as React from 'react';
import { StaticImageData } from 'next/image';

import { Box, Chip, SvgIconProps, Typography } from '@mui/joy';
import GoogleIcon from '@mui/icons-material/Google';

import { AnthropicIcon } from '~/common/components/icons/vendors/AnthropicIcon';
import { ChatBeamIcon } from '~/common/components/icons/ChatBeamIcon';
import { ExternalLink } from '~/common/components/ExternalLink';
import { GroqIcon } from '~/common/components/icons/vendors/GroqIcon';
import { LocalAIIcon } from '~/common/components/icons/vendors/LocalAIIcon';
import { MistralIcon } from '~/common/components/icons/vendors/MistralIcon';
import { PerplexityIcon } from '~/common/components/icons/vendors/PerplexityIcon';

import { Brand } from '~/common/app.config';
import { Link } from '~/common/components/Link';
import { clientUtmSource } from '~/common/util/pwaUtils';
import { platformAwareKeystrokes } from '~/common/components/KeyStroke';


// Cover Images
// (not exactly) Imagine a futuristic, holographically bounded space. Inside this space, four capybaras stand. Three of them are in various stages of materialization, their forms made up of thousands of tiny, vibrant particles of electric blues, purples, and greens. These particles represent the merging of different intelligent inputs, symbolizing the concept of 'Beaming'. Positioned slightly towards the center and ahead of the others, the fourth capybara is fully materialized and composed of shimmering golden cotton candy, representing the optimal solution the 'Beam' feature seeks to achieve. The golden capybara gazes forward confidently, embodying a target achieved. Illuminated grid lines softly glow on the floor and walls of the setting, amplifying the futuristic aspect. In front of the golden capybara, floating, holographic interfaces depict complex networks of points and lines symbolizing the solution space 'Beaming' explores. The capybara interacts with these interfaces, implying the user's ability to control and navigate towards the best outcomes.
import coverV115 from '../../../public/images/covers/release-cover-v1.15.0.png';

import { beamBlogUrl } from './beam.data';

interface NewsItem {
  versionCode: string;
  versionName?: string;
  versionMoji?: string;
  versionDate?: Date;
  versionCoverImage?: StaticImageData;
  text?: string | React.JSX.Element;
  items?: {
    text: React.ReactNode;
    dev?: boolean;
    issue?: number;
    icon?: React.FC<SvgIconProps>;
    noBullet?: boolean;
  }[];
}

// news and feature surfaces
export const NewsItems: NewsItem[] = [
  /*{
    versionCode: '1.16.0',
    items: [
      Draw
      ...
      Screen Capture (when removed from labs)
    ]
  }*/
  {
    versionCode: '1.0.1',
    versionName: 'Zeus',
    versionDate: new Date('2024-04-26T08:00:00Z'),
    versionCoverImage: coverV115,
    items: [
      { text: <>BEAM Find better answers with multi-model AI reasoning</>, issue: 443, icon: ChatBeamIcon },
      { text: <>Auto-configure models for managed deployments</>, issue: 436 },
      { text: <>Message starring ⭐, filtering and attachment</>, issue: 476 },
      { text: <>Default persona improvements</> },
      { text: <>Fixes to Gemini models and SVGs, improvements to UI and icons, and more</> },
      { text: <>Developers: imperative LLM models discovery</>, dev: true },
      { text: <>1.15.1: Support for <B>Gemini Pro 1.5</B> and <B>OpenAI 2024-04-09</B> models</> },
      { text: <>Anthropic <B href='https://www.anthropic.com/news/claude-3-family'>Claude-3</B> support for smarter chats</>, issue: 443, icon: AnthropicIcon },
      { text: <>Perplexity support, including Online models</>, issue: 407, icon: PerplexityIcon },
      { text: <>Groq support, with speeds up to 500 tok/s</>, issue: 427, icon: GroqIcon },
      { text: <>Support for new Mistral-Large models</>, icon: MistralIcon },
      { text: <>Support for Google Gemini 1.5 models and various improvements</>, icon: GoogleIcon as any },
      { text: <>Deeper LocalAI integration including support for model galleries</>, icon: LocalAIIcon },
      { text: <>Major performance optimizations: runs faster, saves power, saves memory</> },
      { text: <>Improvements: auto-size charts, search and folder experience</> },
      { text: <>Perfect chat scaling, with rapid keyboard shortcuts</> },
      { text: <>Also: diagrams auto-resize, open code with StackBlitz and JSFiddle, quick model visibility toggle, open links externally, docs on the web</> },
      { text: <>Fixes: standalone LaTeX blocks, close views by dragging, knowledge cutoff dates, crashes on Google translate (thanks dad)</> },
      { text: <>Side-by-Side split windows: multitask with parallel conversations</>, issue: 208 },
      { text: <>Multi-Chat mode: message all, all at once</>, issue: 388 },
      { text: <>Adjustable <B>text size</B>: denser chats</>, issue: 399 },
      { text: <>Export tables as CSV files</>, issue: 392 },
      { text: <><B>Dev2</B> persona technology preview</> },
      { text: <>Better looking chats, spacing, fonts, menus</> },
      { text: <>More: video player, LM Studio tutorial, speedups, MongoDB (docs)</> },
      { text: <>Voice Call Personas: save time, recap conversations</>, issue: 354 },
      { text: <>Updated OpenAI Models to the 0125 release</>, issue: 364 },
      { text: <>Chats: Auto-Rename and assign folders</>, issue: 222 },
      { text: <>Link Sharing makeover and control</>, issue: 356 },
      { text: <>Accessibility for screen readers</>, issue: 358 },
      { text: <>Export chats to <B>Markdown</B></>, issue: 337 },
      { text: <>Paste <B>tables from Excel</B></>, issue: 286 },
      { text: <>Large optimizations</> },
      { text: <>Ollama updates</>, issue: 309 },
      { text: <>Over <B>150 commits</B> and <B>7,000+ lines changed</B> for development enhancements</>, dev: true },
      { text: <><B issue={329} wow>Search chats</B> (@joriskalz)</>, issue: 329 },
      { text: <>Quick <B issue={327}>commands pane</B> (open with &apos;/&apos;)</>, issue: 327 },
      { text: <><B>Together AI</B> Inference platform support</>, issue: 346 },
      { text: <>Persona creation: <B issue={301}>history</B></>, issue: 301 },
      { text: <>Persona creation: fix <B issue={328}>API timeouts</B></>, issue: 328 },
      { text: <>Support up to five <B issue={323}>OpenAI-compatible</B> endpoints</>, issue: 323 },
      { text: <><B issue={212} wow>DALL·E 3</B> support (/draw), with advanced control</>, issue: 212 },
      { text: <><B issue={304} wow>Perfect scrolling</B> UX, on all devices</>, issue: 304 },
      { text: <>Create personas <B issue={287}>from text</B></>, issue: 287 },
      { text: <>Openrouter: auto-detect models, support free-tiers and rates</>, issue: 291 },
      { text: <>Image drawing: unified UX, including auto-prompting</> },
      { text: <>Fix layout on Firefox</>, issue: 255 },
      { text: <>Developers: new Text2Image subsystem, Optima layout subsystem, ScrollToBottom library, using new Panes library, improved Llms subsystem</>, dev: true },
      { text: <><B issue={201} wow>New UI</B> for desktop and mobile, enabling future expansions</>, issue: 201 },
      { text: <><B issue={321} wow>Folder categorization</B> for conversation management</>, issue: 321 },
      { text: <><B>LM Studio</B> support and refined token management</> },
      { text: <>Draggable panes in split screen mode</>, issue: 308 },
      { text: <>Bug fixes and UI polish</> },
      { text: <>Developers: document proxy settings on docker</>, issue: 318, dev: true },
      { text: <>New <B issue={251} wow>attachments system</B>: drag, paste, link, snap, images, text, pdfs</> },
      { text: <>Desktop <B issue={253}>webcam access</B> for direct image capture (Labs option)</> },
      { text: <>Independent browsing with <B code='/docs/config-feature-browse.md'>Browserless</B> support</> },
      { text: <><B issue={256}>Overheat</B> LLMs with higher temperature limits</> },
      { text: <>Enhanced security via <B code='/docs/deploy-authentication.md'>password protection</B></> },
      { text: <>{platformAwareKeystrokes('Ctrl+Shift+O')}: quick access to model options</> },
      { text: <>Optimized voice input and performance</> },
      { text: <>Latest Ollama and Oobabooga models</> },
      { text: <>Web Browsing support, see the <B code='/docs/config-feature-browse.md'>browsing user guide</B></> },
      { text: <>Branching Discussions at any message</> },
      { text: <>Keyboard Navigation: use {platformAwareKeystrokes('Ctrl+Shift+Left/Right')} to navigate chats</> },
      { text: <>Added support for Anthropic Claude 2.1</> },
      { text: <>Large rendering performance optimization</> },
      { text: <>More: <Chip>/help</Chip>, import ChatGPT from source, new Flattener</> },
      { text: <>Devs: improved code quality, snackbar framework</>, dev: true },
      { text: <><B issue={190} wow>Continued Voice</B> for hands-free interaction</> },
      { text: <><B issue={192}>Visualization</B> Tool for data representations</> },
      { text: <><B code='/docs/config-local-ollama.md'>Ollama (guide)</B> local models support</> },
      { text: <><B issue={194}>Text Tools</B> including highlight differences</> },
      { text: <><B href='https://mermaid.js.org/'>Mermaid</B> Diagramming Rendering</> },
      { text: <><B>OpenAI 1106</B> Chat Models</> },
      { text: <><B>SDXL</B> support with Prodia</> },
      { text: <>Cloudflare OpenAI API Gateway</> },
      { text: <>Helicone for Anthropic</> },
    ],
  },
];


function B(props: {
  // one-of
  href?: string,
  issue?: number,
  code?: string,

  wow?: boolean,
  children: React.ReactNode
}) {
  const href =
    props.issue ? `${Brand.URIs.OpenRepo}/issues/${props.issue}`
      : props.code ? `${Brand.URIs.OpenRepo}/blob/main/${props.code}`
        : props.href;
  const boldText = (
    <Typography component='span' color={!!href ? 'primary' : 'neutral'} sx={{ fontWeight: 'lg' }}>
      {props.children}
    </Typography>
  );
  if (!href)
    return boldText;
  return (
    <ExternalLink href={href + clientUtmSource()} highlight={props.wow} icon={props.issue ? 'issue' : undefined}>
      {boldText}
    </ExternalLink>
  );
}