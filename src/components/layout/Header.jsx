
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { Button } from '../ui/button';
import { Users, Building2 } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">Hotel Booking</h1>
          </div>
          
          <nav className="hidden sm:flex space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate(user.role === 'admin' ? '/admin/hotels' : '/dashboard')}
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  {user.role === 'admin' ? 'Hotel Management' : 'Dashboard'}
                </Button>
                {user.role === 'admin' && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    User Management
                  </Button>
                )}
                {user.role === 'user' && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/my-bookings')}
                  >
                    My Bookings
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
