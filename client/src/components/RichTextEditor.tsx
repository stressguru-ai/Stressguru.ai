import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Image as ImageIcon,
  Code,
  Minus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your blog post...",
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#7BDDE5] underline hover:text-[#5BC4CC]",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[400px] focus:outline-none p-4 prose-blockquote:border-l-4 prose-blockquote:border-[#7BDDE5] prose-blockquote:bg-sky-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:rounded-r-lg prose-blockquote:my-4 [&_.callout-box]:bg-sky-50 [&_.callout-box]:border-l-4 [&_.callout-box]:border-[#7BDDE5] [&_.callout-box]:p-4 [&_.callout-box]:my-4 [&_.callout-box]:rounded-r-lg [&_.callout-title]:text-[#7BDDE5] [&_.callout-title]:font-bold [&_.callout-title]:text-lg [&_.callout-title]:mb-2",
      },
    },
  });

  // Update editor content when prop changes (e.g., when AI generates content)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();

    setLinkUrl("");
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-[#7BDDE5]/20 text-[#7BDDE5]"
          : "text-slate-600 hover:bg-slate-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Link */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                title="Add Link"
                className={`p-2 rounded-lg transition-colors ${
                  editor.isActive("link")
                    ? "bg-[#7BDDE5]/20 text-[#7BDDE5]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Link URL
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setLink();
                      }
                    }}
                  />
                  <Button onClick={setLink} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Image */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                title="Add Image"
                className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-100"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                  />
                  <Button onClick={addImage} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Character Count */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 flex justify-between">
        <span>
          {editor.storage.characterCount?.characters?.() || 0} characters
        </span>
        <span>{editor.storage.characterCount?.words?.() || 0} words</span>
      </div>
    </div>
  );
}
