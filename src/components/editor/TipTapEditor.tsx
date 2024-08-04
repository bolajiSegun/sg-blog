import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import MenuBar from "./MenuBar";

// define your extension array
const extensions = [
  StarterKit,
  Image,
  Underline,
  Link.configure({
    openOnClick: false,
  }),
];

interface Pros {
  content: string;
  handleSetContent: (value: string) => void;
}

const TipTapEditor = ({ content, handleSetContent }: Pros) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }: any) => {
      //   const json = editor.getJSON();
      handleSetContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <label
        htmlFor="editor"
        className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
      >
        Content
      </label>
      <MenuBar editor={editor} />
      <div
        className="border border-[rgba(59,130,246,0.5)] hover:border-pri-hover rounded-md rounded-t-none transition-all duration-300 px-2 focus-within:border-2 focus-within:border-pri"
        id="editor"
      >
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TipTapEditor;
