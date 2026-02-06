import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const RichTextEditor = ({ value, onChange, disabled }) => {
  return (
    <SunEditor
      setContents={value}
      onChange={onChange}
      disable={disabled}
      setOptions={{
        height: '500px',
        buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image', 'video', 'audio'], // video handles youtube iframes
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview', 'print']
        ],
        // Additional options for handling video
        youtubeQuery: 'autoplay=0&controls=1',
      }}
    />
  );
};

export default RichTextEditor;
