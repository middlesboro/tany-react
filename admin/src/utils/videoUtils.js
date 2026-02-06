
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
      const p = iframe.parentElement;
      if (p && p.tagName === 'P') {
          const parentParent = p.parentElement;
          if (!parentParent) return;

          // Split the P into Before and After parts
          const nodes = Array.from(p.childNodes);
          const index = nodes.indexOf(iframe);

          const beforeNodes = nodes.slice(0, index);
          const afterNodes = nodes.slice(index + 1);

          // Helper to check if nodes have content
          const hasContent = (nodeList) => {
              return nodeList.some(node => {
                  if (node.nodeType === 3) { // Text node
                      // Check for non-whitespace, including nbsp
                      return node.textContent.replace(/\u00A0/g, ' ').trim().length > 0;
                  }
                  if (node.nodeType === 1) { // Element
                      if (node.tagName === 'BR') return false; // Ignore BR? Or keep it? Quill might need it for empty line.
                      // If it's a BR, it signifies a line break, so effectively an empty line.
                      // If we create a P with just BR, Quill is happy.
                      return true;
                  }
                  return false;
              });
          };

          // Create P for content before
          if (beforeNodes.length > 0) {
             const pBefore = doc.createElement('p');
             beforeNodes.forEach(node => pBefore.appendChild(node));
             // If it has content or is just a BR (empty line), insert it.
             // If it's pure whitespace text, ignore.
             if (hasContent(Array.from(pBefore.childNodes))) {
                 parentParent.insertBefore(pBefore, p);
             } else if (pBefore.innerHTML.toLowerCase().includes('<br>')) {
                 parentParent.insertBefore(pBefore, p);
             }
          }

          // Move iframe out
          parentParent.insertBefore(iframe, p);

          // Create P for content after
          if (afterNodes.length > 0) {
             const pAfter = doc.createElement('p');
             afterNodes.forEach(node => pAfter.appendChild(node));
             if (hasContent(Array.from(pAfter.childNodes))) {
                 parentParent.insertBefore(pAfter, p);
             } else if (pAfter.innerHTML.toLowerCase().includes('<br>')) {
                 parentParent.insertBefore(pAfter, p);
             }
          }

          // Remove the original P
          parentParent.removeChild(p);
      }
  });

  return doc.body.innerHTML;
};
