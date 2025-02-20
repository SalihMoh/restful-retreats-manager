
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchHotels());
    if (user) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [dispatch, user]);

  const calculateTotalCost = (hotelId: number, start: Date, end: Date) => {
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return 0;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return hotel.price * days;
  };

  const handleBooking = async () => {
    if (!selectedHotel || !startDate || !endDate || !user) return;

    const totalCost = calculateTotalCost(selectedHotel, startDate, endDate);

    try {
      await dispatch(createBooking({
        userId: user.id,
        hotelId: selectedHotel,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalCost,
        guestName: guestName || user.name,
      })).unwrap();

      toast({
        title: "Success",
        description: "Booking confirmed successfully!",
      });

      setSelectedHotel(null);
      setStartDate(null);
      setEndDate(null);
      setGuestName('');
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
                    selected={startDate}
                    onChange={setStartDate}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholderText="Select check-in date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full rounded-md border border-input px-3 py-2"
                    placeholderText="Select check-out date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Guest Name</label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest name (if booking for someone else)"
                />
              </div>
              {startDate && endDate && (
                <div className="text-lg font-semibold">
                  Total Cost: ${calculateTotalCost(selectedHotel, startDate, endDate)}
                </div>
              )}
              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={!startDate || !endDate}
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
                            Guest: {booking.guestName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${booking.totalCost}</p>
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
