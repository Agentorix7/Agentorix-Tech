"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Quote,
  Code,
  Image as ImageIcon,
  List,
  ListOrdered,
  Eye,
  EyeOff,
  Minus,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  label,
  required,
  placeholder,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to grow with content (so parent can scroll)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && !showPreview) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 500)}px`;
    }
  }, [value, showPreview]);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newValue =
      value.substring(0, start) + before + textToInsert + after + value.substring(end);

    onChange(newValue);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtStart = (text: string) => {
    const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const lines = value.split("\n");
    const cursorLine = value.substring(0, textarea.selectionStart).split("\n").length - 1;
    lines[cursorLine] = text + lines[cursorLine];
    onChange(lines.join("\n"));

    setTimeout(() => {
      textarea.focus();
      const newPos = textarea.selectionStart + text.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      onClick: () => insertText("**", "**", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      onClick: () => insertText("*", "*", "italic text"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      onClick: () => insertText("~~", "~~", "strikethrough text"),
    },
    { separator: true },
    {
      icon: Heading1,
      label: "Heading 1",
      onClick: () => insertAtStart("# "),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      onClick: () => insertAtStart("## "),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      onClick: () => insertAtStart("### "),
    },
    { separator: true },
    {
      icon: Link,
      label: "Link",
      onClick: () => insertText("[", "](https://example.com)", "link text"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      onClick: () => insertText("![", "](image-url)", "alt text"),
    },
    {
      icon: Quote,
      label: "Blockquote",
      onClick: () => insertAtStart("> "),
    },
    {
      icon: Code,
      label: "Code Block",
      onClick: () => {
        const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const codeBlock = selectedText
          ? `\`\`\`\n${selectedText}\n\`\`\``
          : "```\ncode here\n```";
        const newValue = value.substring(0, start) + codeBlock + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.focus();
          const newPos = selectedText ? start + codeBlock.length : start + 4;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      },
    },
    { separator: true },
    {
      icon: List,
      label: "Unordered List",
      onClick: () => insertAtStart("- "),
    },
    {
      icon: ListOrdered,
      label: "Ordered List",
      onClick: () => insertAtStart("1. "),
    },
    {
      icon: Minus,
      label: "Horizontal Rule",
      onClick: () => {
        const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const newValue = value.substring(0, start) + "\n---\n" + value.substring(start);
        onChange(newValue);
        setTimeout(() => {
          textarea.focus();
          const newPos = start + 5;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      },
    },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="border border-border rounded-lg max-h-[800px] flex flex-col overflow-y-auto bg-background">
        {/* Toolbar - Sticky */}
        <div className="sticky top-0 z-20 flex items-center gap-1 p-2 bg-background border-b border-border flex-wrap shadow-sm">
          {toolbarButtons.map((btn, idx) => {
            if (btn.separator || !btn.icon) {
              return <div key={idx} className="w-px h-6 bg-border mx-1" />;
            }
            const Icon = btn.icon;
            return (
              <Button
                key={idx}
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={btn.onClick}
                title={btn.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? "Show Editor" : "Show Preview"}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Content Area - Container scrolls, not textarea */}
        {showPreview ? (
          <div className="min-h-[500px] p-6 bg-background">
            {value ? (
              <div className="max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }: any) => (
                      <h1 className="text-3xl font-bold mb-4 mt-6 text-foreground" {...props} />
                    ),
                    h2: ({ node, ...props }: any) => (
                      <h2 className="text-2xl font-bold mb-3 mt-5 text-foreground" {...props} />
                    ),
                    h3: ({ node, ...props }: any) => (
                      <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props} />
                    ),
                    p: ({ node, ...props }: any) => (
                      <p className="mb-4 leading-relaxed text-foreground" {...props} />
                    ),
                    ul: ({ node, ...props }: any) => (
                      <ul className="list-disc pl-6 mb-4 text-foreground" {...props} />
                    ),
                    ol: ({ node, ...props }: any) => (
                      <ol className="list-decimal pl-6 mb-4 text-foreground" {...props} />
                    ),
                    li: ({ node, ...props }: any) => (
                      <li className="mb-1 text-foreground" {...props} />
                    ),
                    blockquote: ({ node, ...props }: any) => (
                      <blockquote
                        className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                          {...props}
                        />
                      ) : (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                          <code className="text-sm font-mono text-foreground" {...props} />
                        </pre>
                      ),
                    a: ({ node, ...props }: any) => (
                      <a
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }: any) => (
                      <img className="rounded-lg my-4 max-w-full" {...props} />
                    ),
                    hr: ({ node, ...props }: any) => (
                      <hr className="my-6 border-border" {...props} />
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No content to preview. Start typing to see the preview.</p>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-[1200px] bg-background">
            <Textarea
              ref={textareaRef}
              id="markdown-content"
              required={required}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                // Auto-resize on change
                const target = e.target;
                target.style.height = 'auto';
                target.style.height = `${Math.max(target.scrollHeight, 500)}px`;
              }}
              className="h-full overflow-hidden font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none w-full bg-background"
              style={{ 
                minHeight: '500px',
                height: 'auto',
                backgroundColor: 'transparent',
              }}
              placeholder={placeholder}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Use the toolbar buttons to format your content, or type Markdown directly.
        </p>
        <p className="text-xs text-muted-foreground">
          {value.split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </div>
  );
}

