import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Italic, Underline, Strikethrough, Link, List, Paragraph, Essentials } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor-container border border-slate-200 rounded-lg overflow-hidden bg-white ${className || ''}`}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [Essentials, Paragraph, Bold, Italic, Underline, Strikethrough, Link, List],
          toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'link', 'bulletedList', 'numberedList'],
          placeholder: placeholder || 'Type here',
        }}
        data={value || ''}
        onChange={(_, editor) => {
          const data = editor.getData();
          if (data !== value) {
            onChange(data);
          }
        }}
      />
    </div>
  );
}
