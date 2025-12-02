import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-6xl">😕</div>
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Page not found</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          🏠 Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
