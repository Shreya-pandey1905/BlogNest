"use client";

import { useEffect, useState, type ComponentType } from "react";

type CkEditorFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

type MinimalEditor = {
  getData: () => string;
};

type CKEditorProps = {
  editor: unknown;
  data: string;
  config?: Record<string, unknown>;
  onChange: (event: unknown, editor: MinimalEditor) => void;
  onReady?: (editor: unknown) => void;
};

type LoadedCkEditor = {
  CKEditor: ComponentType<CKEditorProps>;
  ClassicEditor: unknown;
};

export default function CkEditorField({ value, onChange }: CkEditorFieldProps) {
  const [loadedEditor, setLoadedEditor] = useState<LoadedCkEditor | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadEditor = async () => {
      const [{ CKEditor }, classicEditorModule] = await Promise.all([
        import("@ckeditor/ckeditor5-react"),
        import("@ckeditor/ckeditor5-build-classic"),
      ]);

      if (!mounted) return;

      setLoadedEditor({
        CKEditor: CKEditor as ComponentType<CKEditorProps>,
        ClassicEditor: classicEditorModule.default,
      });
    };

    void loadEditor();

    return () => {
      mounted = false;
    };
  }, []);

  if (!loadedEditor) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white text-sm text-zinc-500">
        Loading editor...
      </div>
    );
  }

  const { CKEditor, ClassicEditor } = loadedEditor;

  return (
    <div className="ck-editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "|",
            "undo",
            "redo",
          ],
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            ],
          },
          mediaEmbed: {
            previewsInData: true,
          },
        }}
        onReady={(editor: any) => {
          // Focus the editor when it is ready
          editor.editing.view.focus();
        }}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
      />

      {/* Media deletion hint */}
      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3 animate-in fade-in slide-in-from-top-1 duration-500">
        <p className="flex items-start gap-2.5 text-xs leading-relaxed text-amber-800">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 w-4 h-4 text-amber-500 shrink-0">
            <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 5Zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <span>
            <strong className="font-bold">To remove a video/image:</strong> Click directly on the video area. You will see a blue border appear. Once it's highlighted, press 
            <kbd className="mx-1 rounded border border-amber-200 bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm text-amber-900 font-bold">Backspace</kbd> 
            or 
            <kbd className="mx-1 rounded border border-amber-200 bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm text-amber-900 font-bold">Delete</kbd> 
            on your keyboard.
          </span>
        </p>
      </div>
    </div>
  );
}
