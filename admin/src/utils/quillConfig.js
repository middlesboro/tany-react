export const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      video: function() {
        let url = prompt("Enter Video URL or Iframe Code:");
        if (url) {
          // Regex to extract src from iframe tag
          // Matches src="value" or src='value'
          const iframeSrcMatch = url.match(/src\s*=\s*["']([^"']+)["']/);
          if (iframeSrcMatch && iframeSrcMatch[1]) {
            url = iframeSrcMatch[1];
          }

          // Convert YouTube watch URL to embed URL
          const youtubeWatchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
          if (youtubeWatchMatch && youtubeWatchMatch[1]) {
            url = `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`;
          }

          const range = this.quill.getSelection(true);
          this.quill.insertEmbed(range.index, 'video', url, 'user');
        }
      }
    }
  }
};

export const quillModulesTable = {
  table: true,
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['table'],
      ['clean']
    ],
    handlers: {
      video: function() {
        let url = prompt("Enter Video URL or Iframe Code:");
        if (url) {
          // Regex to extract src from iframe tag
          // Matches src="value" or src='value'
          const iframeSrcMatch = url.match(/src\s*=\s*["']([^"']+)["']/);
          if (iframeSrcMatch && iframeSrcMatch[1]) {
            url = iframeSrcMatch[1];
          }

          // Convert YouTube watch URL to embed URL
          const youtubeWatchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
          if (youtubeWatchMatch && youtubeWatchMatch[1]) {
            url = `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`;
          }

          const range = this.quill.getSelection(true);
          this.quill.insertEmbed(range.index, 'video', url, 'user');
        }
      },
      table: function() {
        const table = this.quill.getModule('table');
        table.insertTable(3, 3);
      }
    }
  }
};
