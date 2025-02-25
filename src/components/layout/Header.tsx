
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { Button } from '../ui/button';
import { RootState } from '../../store/store';
import { ThemeToggle } from '../theme/ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">Réservation d'Hôtel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <nav className="hidden sm:flex space-x-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                  >
                    {user.role === 'admin' ? 'Administration' : 'Tableau de bord'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/register')}
                  >
                    Inscription
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
