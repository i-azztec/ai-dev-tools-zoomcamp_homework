export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CodeInterview
      </div>
    </footer>
  );
}
