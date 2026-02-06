import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, disabled }) => {
  const editorRef = useRef(null);

  return (
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      disabled={disabled}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help | image media table link',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        // Note: For real image upload to server, we would need images_upload_handler
        // For now, we rely on base64 or URL inputs which is default behavior if no handler
      }}
      onEditorChange={(content, editor) => {
        onChange(content);
      }}
    />
  );
};

export default RichTextEditor;
