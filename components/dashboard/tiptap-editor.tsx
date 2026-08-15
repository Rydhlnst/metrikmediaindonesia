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

  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = plainText.length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="rounded-none border border-black/10 bg-white shadow-2xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-muted/20 p-1.5">
        {/* Text Format */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <TextB className="size-4" weight="bold" />
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
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <Highlighter className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6 bg-black/10" />

        {/* Headings */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <TextHOne className="size-4" weight="bold" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <TextHTwo className="size-4" weight="bold" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <TextHThree className="size-4" weight="bold" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6 bg-black/10" />

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

        <Separator orientation="vertical" className="mx-1 h-6 bg-black/10" />

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

        <Separator orientation="vertical" className="mx-1 h-6 bg-black/10" />

        {/* Quotes & Code */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quotes className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code className="size-4" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6 bg-black/10" />

        {/* Media & Links */}
        <ToolButton
          onClick={() => setLinkDialogOpen(true)}
          active={editor.isActive("link")}
        >
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
            <CircleNotch className="size-4 animate-spin text-primary" />
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

        <Separator orientation="vertical" className="mx-1 h-6 bg-black/10" />

        {/* History */}
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

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="min-h-[420px] p-2" />

      {/* Live Status Bar / Word Counter & Reading Time */}
      <div className="flex items-center justify-between border-t border-black/10 bg-[#fafafa] px-4 py-2 text-[11px] font-medium text-muted-foreground select-none">
        <div className="flex items-center gap-3">
          <span><strong className="text-foreground font-bold">{wordCount}</strong> Kata</span>
          <span>•</span>
          <span><strong className="text-foreground font-bold">{charCount}</strong> Karakter</span>
          <span>•</span>
          <span className="text-primary font-bold">~{readingMinutes} Menit Baca</span>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground hidden sm:block">
          Rich Text & Media Markdown
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none border border-black/10 bg-white">
          <DialogHeader className="border-b border-black/5 pb-3">
            <DialogTitle className="text-sm font-bold text-foreground">Sisipkan Tautan Web (Link)</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://metrikmedia.id/berita/..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="rounded-none border-black/15 text-xs"
          />
          <DialogFooter className="pt-2">
            <Button variant="outline" className="rounded-none text-xs" onClick={() => setLinkDialogOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-4 py-2" onClick={addLink}>
              Simpan Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image URL Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none border border-black/10 bg-white">
          <DialogHeader className="border-b border-black/5 pb-3">
            <DialogTitle className="text-sm font-bold text-foreground">Sisipkan Gambar dari URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://example.com/foto-berita.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="rounded-none border-black/15 text-xs"
          />
          <DialogFooter className="pt-2">
            <Button variant="outline" className="rounded-none text-xs" onClick={() => setImageDialogOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-4 py-2" onClick={addImage}>
              Sisipkan Foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-none border border-black/10 bg-white">
          <DialogHeader className="border-b border-black/5 pb-3">
            <DialogTitle className="text-sm font-bold text-foreground">Sematkan Video YouTube (Embed)</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="rounded-none border-black/15 text-xs"
          />
          <DialogFooter className="pt-2">
            <Button variant="outline" className="rounded-none text-xs" onClick={() => setYoutubeDialogOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-none bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-4 py-2" onClick={addYoutube}>
              Sematkan Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
