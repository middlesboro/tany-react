import { useEffect } from 'react';

const useNoIndex = (content = 'noindex') => {
  useEffect(() => {
    // Select existing meta tag
    let meta = document.querySelector('meta[name="robots"]');
    let originalContent = null;
    let created = false;

    if (meta) {
      originalContent = meta.getAttribute('content');
      meta.setAttribute('content', content);
    } else {
      meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = content;
      document.head.appendChild(meta);
      created = true;
    }

    return () => {
      if (created) {
        if (document.head.contains(meta)) {
          document.head.removeChild(meta);
        }
      } else if (originalContent !== null) {
        meta.setAttribute('content', originalContent);
      }
    };
  }, [content]);
};

export default useNoIndex;
