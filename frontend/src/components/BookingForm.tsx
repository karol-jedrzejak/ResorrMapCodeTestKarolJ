import { useState } from "react";

interface Props {
  onBook: (room: string, name: string) => void;
  onCancel: () => void;
}

export const BookingForm = ({ onBook, onCancel }: Props) => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');

  const handleBook = () => {
    if (room && name) {
      onBook(room, name);
      // Clear form after booking
      setRoom('');
      setName('');
    }
  };

  const handleCancel = () => {
    // Clear form before canceling
    setRoom('');
    setName('');
    onCancel();
  };

  return (
    <div className="booking-details">
      <h2>BOOK CABANA</h2>
      <input value={room} onChange={e => setRoom(e.target.value)} placeholder="Room Number" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Guest Name" />
      <button onClick={handleBook} disabled={!room || !name}>Book</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};