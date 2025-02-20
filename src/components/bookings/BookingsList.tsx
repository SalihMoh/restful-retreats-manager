
import { Booking, Hotel } from '@/types/hotel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingsListProps {
  bookings: Booking[];
  hotels: Hotel[];
}

export const BookingsList = ({ bookings, hotels }: BookingsListProps) => {
  if (bookings.length === 0) return null;

  return (
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
  );
};
