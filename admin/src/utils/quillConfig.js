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

      image: function() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            try {
              const { uploadImage } = await import('../services/productAdminService.js');
              const data = await uploadImage(file);
              const url = data.url;

              const range = this.quill.getSelection(true);
              this.quill.insertEmbed(range.index, 'image', url);
            } catch (error) {
              console.error('Failed to upload image:', error);
              alert('Failed to upload image. Please try again.');
            }
          }
        };
      },

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

      image: function() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            try {
              const { uploadImage } = await import('../services/productAdminService.js');
              const data = await uploadImage(file);
              const url = data.url;

              const range = this.quill.getSelection(true);
              this.quill.insertEmbed(range.index, 'image', url);
            } catch (error) {
              console.error('Failed to upload image:', error);
              alert('Failed to upload image. Please try again.');
            }
          }
        };
      },
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
