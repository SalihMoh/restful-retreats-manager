
export interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
  amenities: string[];
  availableRooms: number;
}

export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  guestCount: number;
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  userId: number;
  hotelId: number;
  rating: number;
  comment: string;
  date: string;
}

export interface Favorite {
  id: number;
  userId: number;
  hotelId: number;
}
