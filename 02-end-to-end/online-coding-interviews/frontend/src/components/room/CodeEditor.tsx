import { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeEditorProps {
  code: string;
  language: 'javascript' | 'python';
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const highlight = (codeStr: string) => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.javascript;
      return Prism.highlight(codeStr, grammar, language);
    } catch (e) {
      return codeStr;
    }
  };

  if (!mounted) {
    return (
      <div className="h-full bg-[hsl(var(--editor-background))] flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-[hsl(var(--editor-background))]">
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        className={`code-editor min-h-full focus:outline-none language-${language}`}
        style={{
          fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
          fontSize: 14,
          lineHeight: 1.6,
          backgroundColor: 'hsl(var(--editor-background))',
          color: 'hsl(var(--editor-foreground))',
        }}
        textareaClassName="focus:outline-none"
      />
    </div>
  );
}
