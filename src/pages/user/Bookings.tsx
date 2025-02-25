
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AppDispatch, RootState } from '@/store/store';
import { Calendar, MapPin, Home, Star } from 'lucide-react';

const Bookings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState([
    {
      id: 1,
      hotelId: 1,
      hotelName: "Grand Luxury Resort",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      checkIn: "2023-12-20",
      checkOut: "2023-12-25",
      guests: 2,
      roomType: "Suite",
      totalPrice: 2250,
      status: "completed",
      rating: 4.5
    },
    {
      id: 2,
      hotelId: 2,
      hotelName: "Mountain View Lodge",
      location: "Swiss Alps",
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop",
      checkIn: "2024-06-15",
      checkOut: "2024-06-20",
      guests: 3,
      roomType: "Deluxe",
      totalPrice: 1400,
      status: "upcoming",
      rating: null
    }
  ]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
            À venir
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium dark:bg-green-900 dark:text-green-200">
            En cours
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-200">
            Terminé
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium dark:bg-red-900 dark:text-red-200">
            Annulé
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Vous n'êtes pas connecté</h2>
        <Button>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>
      
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h2>
            <p className="text-muted-foreground mb-6">Vous n'avez pas encore effectué de réservation.</p>
            <Button>Explorer les hôtels</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {currentBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3">
                  <img 
                    src={booking.image} 
                    alt={booking.hotelName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="w-full md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{booking.hotelName}</h2>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.location}
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium">Arrivée</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDate(booking.checkIn)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Départ</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDate(booking.checkOut)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Type de chambre</div>
                      <div>{booking.roomType}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Voyageurs</div>
                      <div>{booking.guests} personne(s)</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="font-bold text-lg">
                      {booking.totalPrice} €
                    </div>
                    
                    <div className="flex space-x-2">
                      {booking.status === 'completed' && !booking.rating && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Évaluer
                        </Button>
                      )}
                      
                      {booking.status === 'upcoming' && (
                        <Button variant="destructive" size="sm">
                          Annuler
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {pageNumbers.map(number => (
                  <PaginationItem key={number}>
                    <PaginationLink 
                      href="#"
                      isActive={currentPage === number}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(number);
                      }}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;
