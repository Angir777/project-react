import { useEffect, useState } from 'react';
import { marked } from 'marked';
import i18next from 'i18next';

/**
 * Changelog rendered from assets/changelog/CHANGELOG.{lang}.md
 * (Angular: ngx-markdown `<markdown [src]>`).
 */
export function ChangelogDetailsModal() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const lang = i18next.language || 'pl';
    const changelogFile = `/assets/changelog/CHANGELOG.${lang}.md?t=${Date.now()}`;

    let active = true;

    fetch(changelogFile)
      .then((res) => (res.ok ? res.text() : ''))
      .then((markdown) => marked.parse(markdown))
      .then((parsed) => {
        if (active) {
          setHtml(parsed);
        }
      })
      .catch(() => setHtml(''));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-4">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
