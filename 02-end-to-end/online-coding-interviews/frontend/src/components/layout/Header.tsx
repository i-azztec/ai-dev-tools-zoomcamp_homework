import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

interface HeaderProps {
  showNavigation?: boolean;
}

export default function Header({ showNavigation = true }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold">CodeInterview</span>
        </Link>
        
        {showNavigation && (
          <nav className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
