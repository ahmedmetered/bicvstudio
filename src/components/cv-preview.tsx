import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { copy } from '@/lib/cv-copy';
import { formatDate, type CV, type Language, type Template, type Entry, type Accent } from '@/lib/cv-model';

export function CVPreview({ cv, language, template, accent }: { cv: CV; language: Language; template: Template; accent: Accent }) {
  const t = copy[language];
  const section = (title: string, children: React.ReactNode) => <section className="cv-section"><h3>{title}</h3>{children}</section>;
  const entries = (items: Entry[]) => items.map(entry => <div className="cv-entry" key={entry.id}>
    <div className="cv-entry-heading"><h4 dir="auto">{entry.title}</h4><span className="cv-date">{formatDate(entry.start, language)} — {formatDate(entry.end, language)}</span></div>
    <p className="cv-employer" dir="auto">{entry.subtitle}</p>
    {entry.description && <ul>{entry.description.split('\n').filter(Boolean).map((line, i) => <li key={i} dir="auto">{line}</li>)}</ul>}
  </div>);
  const contact = section(t.contact, <div className="cv-contact">{[{ Icon: Mail, value: cv.email, ltr: true }, { Icon: Phone, value: cv.phone, ltr: true }, { Icon: MapPin, value: cv.city, ltr: false }, { Icon: Globe, value: cv.link, ltr: true }].filter(x => x.value).map(({ Icon, value, ltr }) => <div key={Icon.displayName ?? value}><Icon size={12} /><bdi dir={ltr ? 'ltr' : 'auto'}>{value}</bdi></div>)}</div>);
  const skills = cv.skills.length > 0 && section(t.skills, <div className="cv-skills">{cv.skills.map(skill => <div key={skill.id}><span dir="auto">{skill.name}</span><div className="cv-skill-level"><span dir="auto">{skill.level}</span><div className="skill-meter"><i className={`meter-${Math.max(1, 4 - t.levels.indexOf(skill.level))}`} /></div></div></div>)}</div>);
  const languages = cv.languages.length > 0 && section(t.languages, <div className="cv-languages">{cv.languages.map(item => <div key={item.id}><strong dir="auto">{item.name}</strong><span dir="auto">{item.level}</span></div>)}</div>);
  return <article id="cv-document" className={`cv-document template-${template} accent-${accent}`} dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language} key={template}>
    <header className="cv-header">{cv.photo && <img src={cv.photo} alt={cv.name} className="cv-photo" />}<div><h2 dir="auto">{cv.name || t.empty}</h2><p dir="auto">{cv.title}</p><div className="cv-name-rule" /></div></header>
    <div className="cv-columns"><aside className="cv-sidebar">{contact}{skills}{languages}</aside><main className="cv-main">
      {cv.summary && section(t.profile, <p className="cv-summary" dir="auto">{cv.summary}</p>)}
      {cv.experience.length > 0 && section(t.experience, entries(cv.experience))}
      {cv.education.length > 0 && section(t.education, entries(cv.education))}
      {cv.courses.length > 0 && section(t.courses, entries(cv.courses))}
    </main></div>
  </article>;
}