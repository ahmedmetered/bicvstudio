import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { FileText, Download, Check, ShieldCheck, Palette, Eye, PenLine, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVEditor } from '@/components/cv-editor';
import { CVPreview } from '@/components/cv-preview';
import { copy } from '@/lib/cv-copy';
import { accents, createSample, restoreStudio, storageKey, type Language, type Template } from '@/lib/cv-model';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'CV Studio — Create your next chapter' },
    { name: 'description', content: 'Build a beautiful bilingual CV in English and Arabic. Personalize three templates, save privately on your device, and export to PDF.' },
    { property: 'og:title', content: 'CV Studio — Create your next chapter' },
    { property: 'og:description', content: 'Your story, beautifully presented. Create an English or Arabic CV with live editing and private, on-device saving.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Index,
});

function TemplateThumbnail({ template }: { template: Template }) {
  return <span className={`template-thumbnail thumbnail-${template}`} aria-hidden="true"><span className="thumbnail-header"><i /><i /></span><span className="thumbnail-body"><span className="thumbnail-side"><i /><i /><i /><i /><i /></span><span className="thumbnail-lines"><i /><i /><i /><i /><i /><i /><i /><i /></span></span></span>;
}

function Index() {
  const [studio, setStudio] = useState(createSample); const [ready, setReady] = useState(false); const [saveStatus, setSaveStatus] = useState('saved');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit'); const [notice, setNotice] = useState(''); const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pageTurn, setPageTurn] = useState(false); const [markerStroke, setMarkerStroke] = useState(0);
  const accentLabels = { indigo: 'Cobalt', coral: 'Tomato', emerald: 'Forest', teal: 'Teal', amber: 'Orange', rose: 'Ink' };
  const { language, template, accent } = studio; const t = copy[language]; const cv = studio.documents[language];
  useEffect(() => { try { setStudio(restoreStudio(localStorage.getItem(storageKey))); } catch { setSaveStatus('error'); } setReady(true); }, []);
  useEffect(() => { if (!ready) return; setSaveStatus('saving'); const timeout = setTimeout(() => { try { localStorage.setItem(storageKey, JSON.stringify(studio)); setSaveStatus('saved'); } catch { setSaveStatus('error'); } }, 350); return () => clearTimeout(timeout); }, [studio, ready]);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; }, [language]);
  useEffect(() => { setNotice(''); }, [language]);
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);
  const notify = (message: string) => { setNotice(message); if (noticeTimer.current) clearTimeout(noticeTimer.current); noticeTimer.current = setTimeout(() => setNotice(''), 6000); };
  const download = () => { notify(t.exportSuccess); setTimeout(() => window.print(), 250); };
  return <div className={`studio-app accent-${accent}`} dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
    <header className="app-header"><div className="header-inner"><a className="wordmark" href="/" aria-label={t.brand}><span className="brand-icon"><FileText size={23} /></span><span>{t.brand}<small>{t.tagline}</small></span></a><div className="header-actions"><div className="language-toggle" aria-label="Language"><Button variant="ghost" className={language === 'en' ? 'selected' : ''} aria-pressed={language === 'en'} onClick={() => setStudio(s => ({ ...s, language: 'en' as Language }))}>English</Button><Button variant="ghost" className={language === 'ar' ? 'selected' : ''} aria-pressed={language === 'ar'} onClick={() => setStudio(s => ({ ...s, language: 'ar' as Language }))}>العربية</Button></div><span className="header-divider" /><span className="private-badge"><ShieldCheck size={16} />{language === 'en' ? 'Private by design' : 'خصوصيتك أولاً'}</span></div></div></header>
    <main className="workspace">
      <div className="workspace-heading"><div><h1>{t.headline}</h1><p>{t.subhead}</p></div><div className="heading-actions"><span className={`save-status ${saveStatus === 'error' ? 'save-error' : ''}`} role="status"><span className="save-dot" />{saveStatus === 'saved' ? t.saved : saveStatus === 'saving' ? t.saving : t.saveError}</span><Button variant="brand" className="download-button" onClick={download}><Download size={17} />{t.download}</Button></div></div>
      <div className="mobile-tabs"><Button variant="ghost" className={mobileTab === 'edit' ? 'selected' : ''} aria-pressed={mobileTab === 'edit'} onClick={() => setMobileTab('edit')}><PenLine />{t.edit}</Button><Button variant="ghost" className={mobileTab === 'preview' ? 'selected' : ''} aria-pressed={mobileTab === 'preview'} onClick={() => setMobileTab('preview')}><Eye />{t.preview}</Button></div>
      <div className={`workspace-columns mobile-${mobileTab}`}>
        <div className="edit-panel"><section className="design-panel"><div className="design-heading"><span className="design-title"><Palette size={18} />{t.design}</span></div><div className="design-content"><span className="control-label">{t.template}</span><div className="template-options">{(['modern', 'classic', 'creative'] as const).map(item => <Button key={item} variant="template" className={item === template ? 'selected' : ''} aria-pressed={item === template} onClick={() => { if (item !== template) setPageTurn(true); setStudio(s => ({ ...s, template: item })); }}><TemplateThumbnail template={item} /><span>{item === 'creative' ? language === 'en' ? 'Bold' : 'جريء' : t[item]}</span>{item === template && <span className="template-check"><Check size={10} /></span>}</Button>)}</div><div className="accent-row"><span className="control-label">{t.accent}</span><div className="accent-options">{accents.map(color => <Button key={color} variant="swatch" size="icon" className={`swatch-${color} ${color === accent ? 'selected' : ''}`} title={accentLabels[color]} aria-label={accentLabels[color]} aria-pressed={color === accent} onClick={() => { if (color !== accent) setMarkerStroke(s => s + 1); setStudio(s => ({ ...s, accent: color })); }}>{color === accent && <Check size={13} />}</Button>)}</div></div></div></section>
          <CVEditor cv={cv} language={language} onChange={next => setStudio(s => ({ ...s, documents: { ...s.documents, [language]: next } }))} onError={notify} />
          <div className="editor-footer"><span><ShieldCheck size={14} />{t.privacy}</span><Button variant="ghost" size="icon" title={t.reset} aria-label={t.reset} onClick={() => { if (window.confirm(t.resetConfirm)) setStudio(createSample()); }}><RotateCcw size={14} /></Button></div>
        </div>
        <div className="preview-panel"><div className="preview-toolbar"><span><Eye size={16} />{t.live}<span className="live-dot" /></span><span className="page-format">{t.a4}</span></div><div className="paper-stage"><div key={template} className={`paper-motion ${pageTurn ? 'page-turned' : ''}`}><CVPreview cv={cv} language={language} template={template} accent={accent} />{markerStroke > 0 && <div key={markerStroke} className="marker-wipe" aria-hidden="true" />}</div></div><div className="preview-footer"><span><FileText size={13} />{t.page}</span><span>{t.a4}</span></div></div>
      </div>
      <footer className="workspace-footer"><span>{t.local}</span><span>CV Studio <span className="footer-dot">·</span> {language === 'en' ? 'Your story, beautifully told.' : 'قصتك، بأجمل صورة.'}</span></footer>
    </main>
    <Button variant="brand" className="mobile-download" onClick={download}><Download />{t.download}</Button>
    {notice && <div className="notice" role="status">{notice === t.exportSuccess ? <strong className="done-stamp">DONE</strong> : <CheckCircle2 size={19} />}<span>{notice}</span></div>}
  </div>;
}
