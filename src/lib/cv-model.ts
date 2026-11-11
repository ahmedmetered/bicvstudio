export type Language = 'en' | 'ar';
export type Template = 'modern' | 'classic' | 'creative';
export const accents = ['indigo', 'teal', 'coral', 'emerald', 'amber', 'rose'] as const;
export type Accent = typeof accents[number];
export type Entry = { id: string; title: string; subtitle: string; start: string; end: string; description: string };
export type Skill = { id: string; name: string; level: string };
export type CV = { name: string; title: string; email: string; phone: string; city: string; link: string; photo: string; summary: string; experience: Entry[]; education: Entry[]; skills: Skill[]; languages: Skill[]; courses: Entry[] };
export type Studio = { language: Language; template: Template; accent: Accent; documents: Record<Language, CV> };
export const storageKey = 'cv-studio-v1';
export function moveEntry<T>(items: T[], index: number, direction: number): T[] {
  const next = [...items]; const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  const current = next[index]; const other = next[target];
  if (current === undefined || other === undefined) return next;
  next[index] = other; next[target] = current;
  return next;
}
export function formatDate(value: string, language: Language) {
  if (!value) return language === 'ar' ? 'حتى الآن' : 'Present';
  const date = new Date(`${value}-01T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}
export function createSample(): Studio {
  return { language: 'en', template: 'modern', accent: 'indigo', documents: {
    en: { name: 'Alex Morgan', title: 'Senior Product Designer', email: 'alex.morgan@example.com', phone: '+1 (415) 555-0123', city: 'San Francisco, CA', link: 'alexmorgan.design', photo: '', summary: 'Thoughtful product designer with 6+ years of experience turning complex problems into simple, meaningful digital experiences. I bring a blend of strategic thinking, curiosity, and a love for the little details.',
      experience: [{ id: 'e1', title: 'Senior Product Designer', subtitle: 'Studio North · San Francisco', start: '2022-03', end: '', description: 'Led the design of a customer platform used by 50,000+ people.\nPartnered with engineering and product teams to ship accessible, intuitive experiences.\nBuilt a design system that reduced design-to-development time by 30%.' }, { id: 'e2', title: 'Product Designer', subtitle: 'Layers Digital · New York', start: '2019-06', end: '2022-02', description: 'Designed end-to-end experiences for web and mobile products.\nConducted user research and translated insights into high-impact improvements.' }],
      education: [{ id: 'ed1', title: 'BFA in Interaction Design', subtitle: 'California College of the Arts', start: '2015-09', end: '2019-05', description: 'Graduated with honors' }],
      skills: [{ id: 's1', name: 'Product design', level: 'Expert' }, { id: 's2', name: 'Figma', level: 'Expert' }, { id: 's3', name: 'User research', level: 'Advanced' }, { id: 's4', name: 'Prototyping', level: 'Advanced' }, { id: 's5', name: 'Design systems', level: 'Expert' }],
      languages: [{ id: 'l1', name: 'English', level: 'Native' }, { id: 'l2', name: 'Arabic', level: 'Intermediate' }],
      courses: [{ id: 'c1', title: 'Google UX Design Certificate', subtitle: 'Google · Coursera', start: '2021-06', end: '2021-12', description: '' }] },
    ar: { name: 'أليكس مورغان', title: 'مصمم منتجات أول', email: 'alex.morgan@example.com', phone: '+1 (415) 555-0123', city: 'سان فرانسيسكو، كاليفورنيا', link: 'alexmorgan.design', photo: '', summary: 'مصمم منتجات بخبرة تزيد عن ٦ سنوات في تحويل التحديات المعقدة إلى تجارب رقمية بسيطة وملهمة. أجمع بين التفكير الاستراتيجي والفضول والاهتمام بالتفاصيل لتصميم منتجات تتمحور حول المستخدم.',
      experience: [{ id: 'e1', title: 'مصمم منتجات أول', subtitle: 'ستوديو نورث · سان فرانسيسكو', start: '2022-03', end: '', description: 'قدت تصميم منصة يستخدمها أكثر من ٥٠ ألف شخص.\nتعاونت مع فرق الهندسة والمنتجات لتقديم تجارب سهلة الاستخدام.\nطورت نظام تصميم قلل وقت التنفيذ بنسبة ٣٠٪.' }, { id: 'e2', title: 'مصمم منتجات', subtitle: 'لايرز ديجيتال · نيويورك', start: '2019-06', end: '2022-02', description: 'صممت تجارب متكاملة لمنتجات الويب والهاتف.\nأجريت أبحاث المستخدمين وحولت نتائجها إلى تحسينات ملموسة.' }],
      education: [{ id: 'ed1', title: 'بكالوريوس تصميم التفاعل', subtitle: 'كلية كاليفورنيا للفنون', start: '2015-09', end: '2019-05', description: 'تخرجت بمرتبة الشرف' }],
      skills: [{ id: 's1', name: 'تصميم المنتجات', level: 'خبير' }, { id: 's2', name: 'Figma', level: 'خبير' }, { id: 's3', name: 'أبحاث المستخدمين', level: 'متقدم' }, { id: 's4', name: 'النماذج الأولية', level: 'متقدم' }, { id: 's5', name: 'أنظمة التصميم', level: 'خبير' }],
      languages: [{ id: 'l1', name: 'الإنجليزية', level: 'اللغة الأم' }, { id: 'l2', name: 'العربية', level: 'متوسط' }],
      courses: [{ id: 'c1', title: 'شهادة Google في تصميم تجربة المستخدم', subtitle: 'Google · Coursera', start: '2021-06', end: '2021-12', description: '' }] }
  } };
}
export function restoreStudio(raw: string | null): Studio {
  if (!raw) return createSample();
  try { const value = JSON.parse(raw) as Studio;
    if (!['en', 'ar'].includes(value.language) || !['modern', 'classic', 'creative'].includes(value.template) || !accents.includes(value.accent)) return createSample();
    for (const lang of ['en', 'ar'] as const) {
      const cv = value.documents?.[lang];
      if (!cv || !['name', 'title', 'email', 'phone', 'city', 'link', 'photo', 'summary'].every(k => typeof cv[k as keyof CV] === 'string') || !['experience', 'education', 'skills', 'languages', 'courses'].every(k => Array.isArray(cv[k as keyof CV]))) return createSample();
    }
    return value;
  } catch { return createSample(); }
}