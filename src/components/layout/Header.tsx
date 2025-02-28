
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { RootState } from "@/store/store";
import { useState } from "react";
import { Menu, X, User, Hotel, LogOut, Shield, Info } from "lucide-react";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hotel className="h-6 w-6 text-primary" />
            <Link to="/" className="font-bold text-xl red-text-gradient">HotelApp</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-muted-foreground hover:text-foreground flex items-center space-x-1 transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>À propos</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-muted-foreground hover:text-foreground flex items-center space-x-1 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Tableau de bord</span>
                </Link>
                
                {user.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="text-muted-foreground hover:text-foreground flex items-center space-x-1 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="text-muted-foreground hover:text-foreground flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-red-gradient" size="sm">Inscription</Button>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-muted space-y-4 animate-fade-in">
            <Link 
              to="/about" 
              className="flex items-center space-x-2 text-foreground hover:text-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span>À propos</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-foreground hover:text-primary py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Tableau de bord</span>
                </Link>
                
                {user.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 text-foreground hover:text-primary py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-foreground hover:text-primary w-full justify-start p-0 py-2"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full btn-red-gradient">Inscription</Button>
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
