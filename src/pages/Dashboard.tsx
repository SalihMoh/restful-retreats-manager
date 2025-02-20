
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchHotels } from '../store/hotelSlice';
import { createBooking, fetchUserBookings } from '../store/bookingSlice';
import { HotelCard } from '@/components/hotels/HotelCard';
import { BookingForm } from '@/components/bookings/BookingForm';
import { BookingsList } from '@/components/bookings/BookingsList';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchHotels());
    if (user) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [dispatch, user]);

  const calculateTotalPrice = (hotelId: number, start: Date, end: Date) => {
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return 0;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return hotel.price * days;
  };

  const handleBooking = async (bookingData: {
    checkInDate: Date;
    checkOutDate: Date;
    guestCount: number;
    specialRequests: string;
    totalPrice: number;
  }) => {
    if (!selectedHotel || !user) return;

    try {
      await dispatch(createBooking({
        userId: user.id,
        hotelId: selectedHotel,
        checkIn: bookingData.checkInDate.toISOString().split('T')[0],
        checkOut: bookingData.checkOutDate.toISOString().split('T')[0],
        totalPrice: bookingData.totalPrice,
        guestCount: bookingData.guestCount,
        specialRequests: bookingData.specialRequests
      })).unwrap();

      toast({
        title: "Success",
        description: "Booking confirmed successfully!",
      });

      setSelectedHotel(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Welcome, {user?.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              selectedHotel={selectedHotel}
              onSelect={setSelectedHotel}
            />
          ))}
        </div>

        {selectedHotel && (
          <BookingForm
            selectedHotel={selectedHotel}
            onSubmit={handleBooking}
            calculateTotalPrice={calculateTotalPrice}
          />
        )}

        <BookingsList bookings={bookings} hotels={hotels} />
      </div>
    </div>
  );
};

export default Dashboard;
