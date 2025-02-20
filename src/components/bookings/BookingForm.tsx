
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookingFormProps {
  selectedHotel: number;
  onSubmit: (bookingData: {
    checkInDate: Date;
    checkOutDate: Date;
    guestCount: number;
    specialRequests: string;
    totalPrice: number;
  }) => void;
  calculateTotalPrice: (hotelId: number, start: Date, end: Date) => number;
}

export const BookingForm = ({ selectedHotel, onSubmit, calculateTotalPrice }: BookingFormProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = () => {
    if (!checkInDate || !checkOutDate) return;
    
    const totalPrice = calculateTotalPrice(selectedHotel, checkInDate, checkOutDate);
    
    onSubmit({
      checkInDate,
      checkOutDate,
      guestCount,
      specialRequests,
      totalPrice
    });

    // Reset form
    setCheckInDate(null);
    setCheckOutDate(null);
    setGuestCount(1);
    setSpecialRequests('');
  };

  return (
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
          onClick={handleSubmit}
          className="w-full"
          disabled={!checkInDate || !checkOutDate}
        >
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
};
