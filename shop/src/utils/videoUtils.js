
export const restoreIframes = (htmlContent) => {
  if (!htmlContent) return '';

  // Pattern to find standard YouTube links (embed, watch, or shortened)
  // This regex matches <a href="...">URL</a> OR just the URL if it's in text.
  // However, simpler approach: Find URLs that look like YouTube and replace the surrounding anchor tag (if any) with iframe.

  // 1. Convert "Linkified" anchors back to iframes.
  // Matches: <a ... href="...youtube...">...</a>
  const anchorRegex = /<a[^>]*href=["']((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^" '&?]+)[^"']*)["'][^>]*>(.*?)<\/a>/gi;

  let processed = htmlContent.replace(anchorRegex, (match, url, videoId) => {
     // If the link text is also the URL, or generic "link", we assume it should be an embed.
     return `<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/${videoId}"></iframe>`;
  });

  // 2. (Optional) Convert plain text URLs if they are on their own line or inside <p> tags but NOT inside <a> or attributes.
  // This is riskier so we'll stick to the Anchor tag replacement first as that's what the user described ("it appear now like link").

  return processed;
};
