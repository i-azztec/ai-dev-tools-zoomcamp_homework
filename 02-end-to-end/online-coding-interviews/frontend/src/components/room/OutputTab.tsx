import type { CodeExecutionResult } from '@/api/apiClient';

interface OutputTabProps {
  result: CodeExecutionResult | null;
  isRunning: boolean;
}

export default function OutputTab({ result, isRunning }: OutputTabProps) {
  return (
    <div className="p-4 h-full">
      <div className="bg-[hsl(var(--editor-background))] rounded-md p-4 h-full overflow-auto font-mono text-sm">
        {isRunning ? (
          <div className="text-muted-foreground">Running code...</div>
        ) : result ? (
          <div className="space-y-3">
            {result.error ? (
              <div className="text-destructive whitespace-pre-wrap">{result.error}</div>
            ) : (
              <div className="text-success whitespace-pre-wrap">{result.output}</div>
            )}
            
            {result.executionTime > 0 && (
              <div className="text-muted-foreground text-xs mt-3 pt-3 border-t border-border">
                Completed in {result.executionTime}ms
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">
            Click "Run" to execute code
          </div>
        )}
      </div>
    </div>
  );
}
