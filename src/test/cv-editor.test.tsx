import { useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CVEditor } from '@/components/cv-editor';
import { createSample, type CV, type Language } from '@/lib/cv-model';

afterEach(cleanup);

describe('CV editor drag context regression', () => {
  it.each(['en', 'ar'] as const)('keeps entry data intact while moving entries in %s', (language: Language) => {
    const original = createSample().documents[language];
    const changed = vi.fn();
    function Editor() {
      const [cv, setCV] = useState<CV>(original);
      return <CVEditor cv={cv} language={language} onChange={next => { changed(next); setCV(next); }} onError={vi.fn()} />;
    }
    render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: language === 'en' ? /Work experience/ : /الخبرة العملية/ }));
    const first = screen.getAllByRole('button', { name: /^Reorder:|^إعادة ترتيب:/ })[0]?.closest('.entry-editor');
    if (!(first instanceof HTMLElement)) throw new Error('Missing first sortable entry');
    fireEvent.click(within(first).getByRole('button', { name: language === 'en' ? 'Move down' : 'نقل لأسفل' }));
    expect(changed).toHaveBeenLastCalledWith({ ...original, experience: [original.experience[1], original.experience[0]] });
  });
});