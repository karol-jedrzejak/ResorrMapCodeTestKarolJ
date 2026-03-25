const BASE_URL = 'http://localhost:3001/api';

export const bookingApi = {
  fetchMap: async () => {
    const res = await fetch(`${BASE_URL}/map`);
    if (!res.ok) throw new Error('Failed to load map');
    return res.json();
  },
  bookCabana: async (bookingData: { row: number, col: number, room: string, guestName: string }) => {
    const res = await fetch(`${BASE_URL}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Booking failed');
    }
    return res.json();
  }
};