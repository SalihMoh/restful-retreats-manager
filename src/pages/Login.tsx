
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RootState, AppDispatch } from '../store/store';
import { User, Lock, Hotel, Info } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur votre tableau de bord',
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Échec de la connexion',
        description: 'Email ou mot de passe incorrect',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center hero-pattern py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white hero-title mb-4">
          <span className="red-text-gradient">Bienvenue sur Réservation d'Hôtel</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          La plateforme premium pour réserver votre séjour idéal dans les meilleurs hôtels
        </p>
      </div>

      <div className="w-full max-w-md">
        <Card className="w-full shadow-xl dark-gradient border-red-500/20 overflow-hidden card-hover">
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-700"></div>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-primary/10 red-glow">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                    className="pl-3 transition-all focus:border-primary hover:border-primary/70"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-3 transition-all focus:border-primary hover:border-primary/70"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <Button 
                type="submit" 
                className="w-full btn-red-gradient font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continuer avec</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" type="button" className="flex items-center gap-2 hover:bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                  <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                  <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                  <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" className="flex items-center gap-2 hover:bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                </svg>
                Facebook
              </Button>
            </div>
            <p className="text-sm text-center mt-4">
              Pas encore de compte?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all card-hover">
          <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
            <Hotel className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Large sélection d'hôtels</h3>
          <p className="text-gray-400">Accédez à des milliers d'hôtels à travers le monde avec des tarifs exclusifs.</p>
        </div>
        
        <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all card-hover">
          <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Meilleurs prix garantis</h3>
          <p className="text-gray-400">Nous vous garantissons les meilleurs tarifs pour vos séjours hôteliers.</p>
        </div>
        
        <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all card-hover">
          <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-4">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Support 24/7</h3>
          <p className="text-gray-400">Notre équipe de support est disponible 24/7 pour répondre à toutes vos questions.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Prêt à découvrir votre prochain séjour?</h2>
        <p className="text-gray-300 mb-6">Inscrivez-vous dès maintenant et obtenez 10% de réduction sur votre première réservation!</p>
        <Button 
          onClick={() => navigate('/register')} 
          className="btn-red-gradient py-6 px-8 text-lg font-medium"
        >
          Commencer maintenant
        </Button>
      </div>
    </div>
  );
};

export default Login;
