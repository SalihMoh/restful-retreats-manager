
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchHotels } from '../store/hotelSlice';
import { createBooking, fetchUserBookings } from '../store/bookingSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
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

  const handleBooking = async () => {
    if (!selectedHotel || !checkInDate || !checkOutDate || !user) return;

    const totalPrice = calculateTotalPrice(selectedHotel, checkInDate, checkOutDate);

    try {
      await dispatch(createBooking({
        userId: user.id,
        hotelId: selectedHotel,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        totalPrice,
        guestCount,
        specialRequests
      })).unwrap();

      toast({
        title: "Success",
        description: "Booking confirmed successfully!",
      });

      setSelectedHotel(null);
      setCheckInDate(null);
      setCheckOutDate(null);
      setGuestCount(1);
      setSpecialRequests('');
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
            <Card key={hotel.id} className="hoverable-card overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{hotel.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{hotel.description}</p>
                <p className="text-lg font-semibold">${hotel.price} / night</p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <Button
                  onClick={() => setSelectedHotel(hotel.id)}
                  className="w-full"
                  variant={selectedHotel === hotel.id ? "secondary" : "default"}
                >
                  {selectedHotel === hotel.id ? 'Selected' : 'Select Hotel'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedHotel && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Book Your Stay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={setCheckInDate}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={new Date()}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholderText="Select check-in date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={setCheckOutDate}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={checkInDate}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholderText="Select check-out date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Guests</label>
                <Input
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  placeholder="Enter number of guests"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Special Requests</label>
                <Input
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requests?"
                />
              </div>
              {checkInDate && checkOutDate && (
                <div className="text-lg font-semibold">
                  Total Cost: ${calculateTotalPrice(selectedHotel, checkInDate, checkOutDate)}
                </div>
              )}
              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={!checkInDate || !checkOutDate}
              >
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        )}

        {bookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const hotel = hotels.find(h => h.id === booking.hotelId);
                  return (
                    <div
                      key={booking.id}
                      className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{hotel?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Guests: {booking.guestCount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                          {booking.specialRequests && (
                            <p className="text-sm text-muted-foreground">
                              Special Requests: {booking.specialRequests}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${booking.totalPrice}</p>
                          <p className="text-sm text-muted-foreground">Status: {booking.status}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
