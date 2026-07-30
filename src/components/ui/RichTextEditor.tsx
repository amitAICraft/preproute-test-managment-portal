import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Link as LinkIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

//Menu Bar
const MenuBar = ({ editor, disabled }: { editor: any; disabled?: boolean }) => {
  if (!editor || disabled) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 p-2 rounded-t-lg">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-slate-200')}
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-slate-200')}
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={cn('h-8 w-8 p-0', editor.isActive('underline') && 'bg-slate-200')}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-slate-200')}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-slate-200" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-slate-200')}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-slate-200" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-slate-200')}
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-slate-200')}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function RichTextEditor({ value, onChange, placeholder, className, error, disabled }: RichTextEditorProps) {
  // Stable ref to prevent unnecessary updates or feedback loops
  const lastPushedRef = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Type here',
      }),
    ],
    content: value || '',
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 text-slate-900',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If it's effectively empty, normalize to empty string to avoid saving <p></p>
      const normalizedHtml = html === '<p></p>' ? '' : html;
      lastPushedRef.current = normalizedHtml;
      onChange(normalizedHtml);
    },
  });

  // Sync external changes (like form.reset()) into the editor
  useEffect(() => {
    if (editor && value !== lastPushedRef.current) {
      // If the incoming value differs from our last pushed state, update it
      const currentHtml = editor.getHTML();
      const normalizedCurrentHtml = currentHtml === '<p></p>' ? '' : currentHtml;
      const normalizedValue = value || '';
      
      if (normalizedValue !== normalizedCurrentHtml) {
        editor.commands.setContent(normalizedValue);
        lastPushedRef.current = normalizedValue;
      }
    }
  }, [value, editor]);

  // Sync disabled prop changes to editor
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  return (
    <div className={cn("rich-text-editor-container flex flex-col rounded-lg border focus-within:ring-1 transition-all overflow-hidden",
      error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-slate-200 focus-within:border-[#7489FF] focus-within:ring-[#7489FF]",
      disabled && "bg-slate-50 border-slate-200 cursor-not-allowed opacity-75 focus-within:ring-0"
    )}>
      <MenuBar editor={editor} disabled={disabled} />
      {/* 
        Tiptap editor container.
        We apply a min-height directly on the ProseMirror editable element via editorProps, 
        and here we allow the container to grow naturally.
      */}
      <div className="flex-1 cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
