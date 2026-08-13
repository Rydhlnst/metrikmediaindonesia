"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TextB,
  TextItalic,
  TextUnderline as UnderlineIcon,
  TextStrikethrough,
  Code,
  TextHOne,
  TextHTwo,
  TextHThree,
  List,
  ListNumbers,
  ListChecks,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  LinkSimpleHorizontal as LinkIcon,
  Image as ImageIcon,
  VideoCamera,
  Code as Code2,
  Quotes,
  Minus,
  Highlighter,
  ArrowCounterClockwise,
  ArrowClockwise,
  Table as TableIcon,
  UploadSimple,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
}: TiptapEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-news-red underline" },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: "w-full aspect-video" },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none min-h-[400px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setLinkDialogOpen(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setImageDialogOpen(false);
  }, [editor, imageUrl]);

  const addYoutube = useCallback(() => {
    if (!editor || !youtubeUrl) return;
    editor.commands.setYoutubeVideo({ src: youtubeUrl });
    setYoutubeUrl("");
    setYoutubeDialogOpen(false);
  }, [editor, youtubeUrl]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        editor.chain().focus().setImage({ src: data.data.url }).run();
        toast.success("Gambar berhasil diunggah");
      } catch (error: any) {
        toast.error(error.message || "Gagal mengunggah gambar");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor]
  );

  if (!editor) return null;

  const ToolButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`size-8 rounded-none ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );

  return (
    <div className="rounded-none border border-border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1">
        {/* Text Format */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <TextB className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <TextItalic className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <TextStrikethrough className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          <Code className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <Highlighter className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Headings */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <TextHOne className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <TextHTwo className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <TextHThree className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Lists */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListNumbers className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive("taskList")}
        >
          <ListChecks className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Alignment */}
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <TextAlignLeft className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <TextAlignCenter className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <TextAlignRight className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Block */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quotes className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code2 className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Insert */}
        <ToolButton onClick={() => setLinkDialogOpen(true)}>
          <LinkIcon className="size-4" />
        </ToolButton>
        <ToolButton onClick={() => setImageDialogOpen(true)}>
          <ImageIcon className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <CircleNotch className="size-4 animate-spin" />
          ) : (
            <UploadSimple className="size-4" />
          )}
        </ToolButton>
        <ToolButton onClick={() => setYoutubeDialogOpen(true)}>
          <VideoCamera className="size-4" />
        </ToolButton>
        <ToolButton onClick={addTable}>
          <TableIcon className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Undo/Redo */}
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <ArrowCounterClockwise className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <ArrowClockwise className="size-4" />
        </ToolButton>
      </div>

      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Tambah Link</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="rounded-none"
          />
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setLinkDialogOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-none bg-news-red text-white" onClick={addLink}>
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image URL Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Tambah Gambar dari URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="rounded-none"
          />
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setImageDialogOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-none bg-news-red text-white" onClick={addImage}>
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Embed YouTube</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="rounded-none"
          />
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setYoutubeDialogOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-none bg-news-red text-white" onClick={addYoutube}>
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
