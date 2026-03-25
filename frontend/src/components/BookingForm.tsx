import { useState } from "react";

interface Props {
  onBook: (room: string, name: string) => void;
  onCancel: () => void;
}

export const BookingForm = ({ onBook, onCancel }: Props) => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="booking-details">
      <h2>BOOK CABANA</h2>
      <input value={room} onChange={e => setRoom(e.target.value)} placeholder="Room Number" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Guest Name" />
      <button onClick={() => onBook(room, name)} disabled={!room || !name}>Book</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};