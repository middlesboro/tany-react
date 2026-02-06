
export const restoreIframes = (htmlContent) => {
  if (!htmlContent) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // 1. Convert specific YouTube anchors to iframes
  const anchors = Array.from(doc.querySelectorAll('a'));
  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Matches youtube links: youtube.com/watch?v=ID, youtube.com/embed/ID, youtu.be/ID
    const match = href.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^&?]+)/);

    if (match && match[1]) {
       const videoId = match[1];
       const iframe = doc.createElement('iframe');
       iframe.className = 'ql-video';
       iframe.setAttribute('frameborder', '0');
       iframe.setAttribute('allowfullscreen', 'true');
       iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);

       anchor.replaceWith(iframe);
    }
  });

  // 2. Unwrap iframes from paragraphs (invalid for Quill Block Embeds)
  // We check all iframes, including ones we just created and existing ones.
  const iframes = Array.from(doc.querySelectorAll('iframe'));
  iframes.forEach(iframe => {
      const parent = iframe.parentElement;
      if (parent && parent.tagName === 'P') {
          // Check if parent P has other significant content
          const hasSignificantContent = Array.from(parent.childNodes).some(node => {
              if (node === iframe) return false;
              if (node.nodeType === 3 && node.textContent.trim() === '') return false; // whitespace text
              if (node.nodeType === 1 && node.tagName === 'BR') return false;
              return true;
          });

          if (!hasSignificantContent) {
              parent.replaceWith(iframe);
          }
      }
  });

  return doc.body.innerHTML;
};
