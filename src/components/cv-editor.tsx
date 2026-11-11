import { useState, type ReactNode } from 'react';
import { UserRound, AlignLeft, BriefcaseBusiness, GraduationCap, Zap, Languages, Award, ChevronDown, Plus, Trash2, ArrowUp, ArrowDown, Camera, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copy } from '@/lib/cv-copy';
import { moveEntry, type CV, type Language, type Entry, type Skill } from '@/lib/cv-model';

export function CVEditor({ cv, language, onChange, onError }: { cv: CV; language: Language; onChange: (cv: CV) => void; onError: (message: string) => void }) {
  const t = copy[language]; const [open, setOpen] = useState<string[]>(['personal']);
  const [skillName, setSkillName] = useState(''); const [skillLevel, setSkillLevel] = useState('');
  const [languageName, setLanguageName] = useState(''); const [languageLevel, setLanguageLevel] = useState('');
  const set = <K extends keyof CV>(key: K, value: CV[K]) => onChange({ ...cv, [key]: value });
  const field = (label: string, value: string, change: (value: string) => void, type = 'text', placeholder = '', hint?: string) => <label className="form-field"><span>{label}</span><input type={type} value={value} onChange={e => change(e.target.value)} placeholder={placeholder} dir={['email', 'tel', 'month'].includes(type) ? 'ltr' : 'auto'} />{hint && <small>{hint}</small>}</label>;
  const section = (key: string, Icon: typeof UserRound, title: string, hint: string, children: ReactNode, count?: number) => {
    const expanded = open.includes(key);
    return <section className={`editor-section ${expanded ? 'is-open' : ''}`} key={key}>
      <Button variant="ghost" className="section-toggle" aria-expanded={expanded} aria-controls={`section-${key}`} onClick={() => setOpen(expanded ? open.filter(k => k !== key) : [...open, key])}>
        <span className={`section-icon section-icon-${key}`}><Icon size={18} /></span><span className="section-title">{title}</span>{count !== undefined && <span className="entry-count">{new Intl.NumberFormat(language).format(count)}</span>}<ChevronDown className="section-chevron" size={17} />
      </Button>
      <div className="section-collapse" id={`section-${key}`} inert={!expanded}><div className="section-inner"><div className="section-content"><p className="section-hint">{hint}</p>{children}</div></div></div>
    </section>;
  };
  const entrySection = (key: 'experience' | 'education' | 'courses', Icon: typeof UserRound, label: string, hint: string, titleLabel: string, subtitleLabel: string, addLabel: string) => {
    const update = (index: number, prop: keyof Entry, value: string) => set(key, cv[key].map((item, i) => i === index ? { ...item, [prop]: value } : item));
    return section(key, Icon, label, hint, <>
      {cv[key].map((item, index) => <div className="entry-editor" key={item.id}>
        <div className="entry-toolbar"><GripVertical size={14} /><span>{titleLabel} {new Intl.NumberFormat(language).format(index + 1)}</span><div className="entry-actions">
          <Button variant="ghost" size="icon" title={t.up} aria-label={t.up} disabled={index === 0} onClick={() => set(key, moveEntry(cv[key], index, -1))}><ArrowUp /></Button>
          <Button variant="ghost" size="icon" title={t.down} aria-label={t.down} disabled={index === cv[key].length - 1} onClick={() => set(key, moveEntry(cv[key], index, 1))}><ArrowDown /></Button>
          <Button variant="ghost" size="icon" title={t.remove} aria-label={t.remove} onClick={() => set(key, cv[key].filter((_, i) => i !== index))}><Trash2 /></Button>
        </div></div>
        <div className="field-grid">{field(titleLabel, item.title, v => update(index, 'title', v))}{field(subtitleLabel, item.subtitle, v => update(index, 'subtitle', v))}{field(t.start, item.start, v => update(index, 'start', v), 'month')}{field(t.end, item.end, v => update(index, 'end', v), 'month', '', t.current)}</div>
        <label className="form-field"><span>{t.description}</span><textarea rows={3} dir="auto" value={item.description} onChange={e => update(index, 'description', e.target.value)} /></label>
      </div>)}
      <Button variant="outline" className="add-entry" onClick={() => set(key, [...cv[key], { id: crypto.randomUUID(), title: '', subtitle: '', start: '', end: '', description: '' }])}><Plus />{addLabel}</Button>
    </>, cv[key].length);
  };
  const chipSection = (key: 'skills' | 'languages', Icon: typeof UserRound, label: string, hint: string) => {
    const skills = key === 'skills'; const name = skills ? skillName : languageName; const level = skills ? skillLevel : languageLevel; const levels = skills ? t.levels : t.languageLevels;
    const add = () => { if (!name.trim()) return; set(key, [...cv[key], { id: crypto.randomUUID(), name: name.trim(), level: level || levels[0] || '' }]); if (skills) setSkillName(''); else setLanguageName(''); };
    return section(key, Icon, label, hint, <><div className="editor-chips">{cv[key].map((item: Skill) => <span className="editor-chip" key={item.id}><span dir="auto">{item.name}</span><small dir="auto">{item.level}</small><Button variant="ghost" size="icon" title={`${t.remove}: ${item.name}`} aria-label={`${t.remove}: ${item.name}`} onClick={() => set(key, cv[key].filter(s => s.id !== item.id))}><X /></Button></span>)}</div>
      <div className="chip-form">{field(skills ? t.skillName : t.languageName, name, skills ? setSkillName : setLanguageName)}<label className="form-field"><span>{t.level}</span><select value={levels.includes(level) ? level : levels[0]} onChange={e => (skills ? setSkillLevel : setLanguageLevel)(e.target.value)}>{levels.map(l => <option key={l}>{l}</option>)}</select></label></div>
      <Button variant="outline" className="add-entry" disabled={!name.trim()} onClick={add}><Plus />{skills ? t.addSkill : t.addLanguage}</Button></>, cv[key].length);
  };
  return <div className="editor-sections">
    {section('personal', UserRound, t.personal, t.personalHint, <>
      <div className="photo-upload"><label className="photo-target" title={t.photo}><input type="file" accept="image/jpeg,image/png" aria-label={t.photo} onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) { onError(t.photoError); return; } const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') set('photo', reader.result); }; reader.onerror = () => onError(t.photoError); reader.readAsDataURL(file); event.target.value = ''; }} />{cv.photo ? <img src={cv.photo} alt={cv.name} /> : <Camera size={22} />}<span className="photo-plus"><Plus size={11} /></span></label><div><strong>{t.photo}<span className="optional">{t.optional}</span></strong><p>{t.photoHint}</p>{cv.photo && <Button variant="link" size="sm" onClick={() => set('photo', '')}>{t.removePhoto}</Button>}</div></div>
      <div className="field-grid">{field(t.name, cv.name, v => set('name', v))}{field(t.title, cv.title, v => set('title', v))}{field(t.email, cv.email, v => set('email', v), 'email')}{field(t.phone, cv.phone, v => set('phone', v), 'tel')}{field(t.city, cv.city, v => set('city', v))}{field(t.link, cv.link, v => set('link', v))}</div>
    </>)}
    {section('summary', AlignLeft, t.summary, t.summaryHint, <label className="form-field"><span>{t.summary}</span><textarea rows={5} dir="auto" value={cv.summary} onChange={e => set('summary', e.target.value)} /></label>)}
    {entrySection('experience', BriefcaseBusiness, t.experience, t.experienceHint, t.role, t.company, t.addExperience)}
    {entrySection('education', GraduationCap, t.education, t.educationHint, t.degree, t.school, t.addEducation)}
    {chipSection('skills', Zap, t.skills, t.skillsHint)}
    {chipSection('languages', Languages, t.languages, t.languagesHint)}
    {entrySection('courses', Award, t.courses, t.coursesHint, t.course, t.provider, t.addCourse)}
  </div>;
}