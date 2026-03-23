"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Selection } from "@tiptap/extensions"
import { Placeholder } from "@tiptap/extension-placeholder"

// --- UI Primitives ---
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import { Button } from "@/components/tiptap-ui-primitive/button"

// ─── Types ───────────────────────────────────────────────────────────

export interface TiptapEditorProps {
  initialContent?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
  autoFocus?: boolean
  onImageUpload?: (file: File) => Promise<string>
}

// ─── Toolbar ─────────────────────────────────────────────────────────

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => (
  <>
    <Spacer />

    <ToolbarGroup>
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal />
      <ListDropdownMenu
        types={["bulletList", "orderedList", "taskList"]}
        portal
      />
      <BlockquoteButton />
      <CodeBlockButton />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="strike" />
      <MarkButton type="code" />
      <MarkButton type="underline" />
      {!isMobile ? (
        <ColorHighlightPopover />
      ) : (
        <ColorHighlightPopoverButton onClick={onHighlighterClick} />
      )}
      {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <TextAlignButton align="left" />
      <TextAlignButton align="center" />
      <TextAlignButton align="right" />
      <TextAlignButton align="justify" />
    </ToolbarGroup>

    <ToolbarSeparator />

    <ToolbarGroup>
      <ImageUploadButton text="Add" />
    </ToolbarGroup>

    <Spacer />
  </>
)

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

// ─── Main Component ──────────────────────────────────────────────────

export function TiptapEditor({
  initialContent = "",
  onChange,
  placeholder: placeholderText = "Start writing...",
  className,
  readOnly = false,
  autoFocus = false,
  onImageUpload: customImageUpload,
}: TiptapEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = useRef<HTMLDivElement>(null)

  const uploadFn = customImageUpload
    ? async (
        file: File,
        onProgress?: (event: { progress: number }) => void,
        abortSignal?: AbortSignal
      ) => {
        if (abortSignal?.aborted) throw new Error("Upload cancelled")
        onProgress?.({ progress: 50 })
        const url = await customImageUpload(file)
        onProgress?.({ progress: 100 })
        return url
      }
    : handleImageUpload

  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Selection,
      Placeholder.configure({ placeholder: placeholderText }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadFn,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent || undefined,
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML())
    },
    autofocus: autoFocus ? "end" : false,
  })

  // Sync initialContent into editor when it arrives after mount (e.g. form.reset)
  const hasSetInitialContent = useRef(false)
  useEffect(() => {
    if (
      editor &&
      initialContent &&
      !hasSetInitialContent.current
    ) {
      const currentHTML = editor.getHTML()
      // Only set if editor is empty and we have real content to load
      if (currentHTML === "<p></p>" || currentHTML === "") {
        editor.commands.setContent(initialContent, false)
        hasSetInitialContent.current = true
      }
    }
  }, [editor, initialContent])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  if (readOnly) {
    return (
      <div className={className}>
        <EditorContent editor={editor} role="presentation" />
      </div>
    )
  }

  return (
    <div className={`simple-editor-wrapper ${className ?? ""}`}>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={isMobile ? { bottom: `calc(100% - ${height - rect.y}px)` } : undefined}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}
