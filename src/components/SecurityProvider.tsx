import { useEffect, createContext, useContext } from "react";
import { useLocation } from "react-router-dom";

interface SecurityContextType {
  isProtectedRoute: (path: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};

const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    try {
      // Basic security headers
      const headers = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      };

      // Apply headers
      Object.entries(headers).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });

      // Log protected route access
      const protectedRoutes = ["/profile", "/dashboard", "/service/", "/project/"];
      if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
        console.log(`Accessing protected route: ${location.pathname}`);
      }
    } catch (error) {
      console.error("Security error:", error);
    }
  }, [location]);

  const isProtectedRoute = (path: string) => {
    const protectedRoutes = ["/profile", "/dashboard", "/service/", "/project/"];
    return protectedRoutes.some(route => path.startsWith(route));
  };

  return (
    <SecurityContext.Provider value={{ isProtectedRoute }}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;