
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const restoreIframes = (htmlContent) => {
  if (!htmlContent) return '';

  // Use JSDOM to simulate DOMParser in Node environment
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  const anchors = Array.from(doc.querySelectorAll('a'));
  let modified = false;

  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href) return;

    // Matches youtube links
    const match = href.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^&?]+)/);

    if (match && match[1]) {
       const videoId = match[1];
       const iframe = doc.createElement('iframe');
       iframe.className = 'ql-video';
       iframe.setAttribute('frameborder', '0');
       iframe.setAttribute('allowfullscreen', 'true');
       iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);

       const parent = anchor.parentElement;

       // Replace anchor with iframe
       anchor.replaceWith(iframe);
       modified = true;

       // Unwrap from P if parent is P
       if (parent && parent.tagName === 'P') {
          // Check if P is effectively empty (ignoring the iframe we just put in)
          // We can't check parent.textContent because it includes iframe content? No iframe has no text content.
          // But there might be whitespace.

          // Let's see if there are other element nodes or non-whitespace text nodes.
          const hasOtherContent = Array.from(parent.childNodes).some(node => {
              if (node === iframe) return false;
              if (node.nodeType === 3 && node.textContent.trim() === '') return false; // Text node with just whitespace
              return true;
          });

          if (!hasOtherContent) {
              parent.replaceWith(iframe);
          } else {
             // If P has other content, we should probably split the P?
             // But for now, let's just leave it. If Quill sees Block Embed in P, it might split it itself.
             // But users usually have the link on a separate line.
             // If the link was on its own line in Quill, it was likely wrapped in P.
          }
       }
    }
  });

  return doc.body.innerHTML;
};

const input1 = '<p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Link</a></p>';
console.log("Input 1:", input1);
console.log("Output 1:", restoreIframes(input1));

const input2 = '<p>Some text <a href="https://youtu.be/dQw4w9WgXcQ">Link</a> other text</p>';
console.log("Input 2:", input2);
console.log("Output 2:", restoreIframes(input2));
