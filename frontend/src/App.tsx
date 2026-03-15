import React, { useState, useEffect } from 'react';
import './App.css';

interface Cell {
  type: string;
  occupied: boolean;
  shape: string | null;
  rotation: number;
  guestName: string | null;
}

function App() {
  const [map, setMap] = useState<Cell[][]>([]);
  const [booking, setBooking] = useState<{row: number, col: number} | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/map');
      const data = await res.json();
      setMap(data);
    } catch (error) {
      setMessage('Failed to load map');
    }
  };

  const handleClick = (row: number, col: number, cell: Cell) => {
    if (cell.type === 'W' && !cell.occupied) {
      setBooking({row, col});
      setMessage('');
    } else if (cell.type === 'W' && cell.occupied) {
      setBooking(null);
      setMessage('This chair is already occupied.');
    }
  };

  const handleBook = async (room: string, guestName: string) => {
    if (!booking) return;
    try {
      const res = await fetch('http://localhost:3001/api/book', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({row: booking.row, col: booking.col, room, guestName})
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Booking successful!');
        fetchMap();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Booking failed');
    }
    setBooking(null);
  };

  const getImage = (cell: Cell): string | null => {
    switch (cell.type) {
      case 'W': return 'cabana.png';
      case 'p': return 'textureWater.png';
      case 'c': return 'houseChimney.png';
      case '#': 
        switch (cell.shape) {
          case 'straight': return 'arrowStraight.png';
          case 'corner': return 'arrowCornerSquare.png';
          case 't': return 'arrowSplit.png';
          case 'cross': return 'arrowCrossing.png';
          case 'end': return 'arrowEnd.png';
          default: return 'arrowEnd.png';
        }
      default: return null;
    }
  };

  return (
    <div className="App">
      <h1>Resort Map</h1>
      <div className="map">
        {map.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => {
              const image = getImage(cell);
              return (
                <div
                  key={j}
                  className="cell"
                  onClick={() => handleClick(i, j, cell)}
                >
                  {image && (
                    <img
                      src={`/assets/${image}`}
                      alt={cell.type}
                      className={cell.type === 'W' ? (cell.occupied ? 'occupied' : 'available') : ''}
                      style={{transform: `rotate(${cell.rotation}deg)`}}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {message && <p className="message">{message}</p>}
      <div className="booking-form">
        {booking ? (
          <>
            <h2>Book Chair</h2>
            <input type="text" placeholder="Room Number" id="room" />
            <input type="text" placeholder="Guest Name" id="name" />
            <button onClick={() => {
              const room = (document.getElementById('room') as HTMLInputElement).value;
              const name = (document.getElementById('name') as HTMLInputElement).value;
              handleBook(room, name);
            }}>Book</button>
            <button onClick={() => setBooking(null)}>Cancel</button>
          </>
        ) : (
          <p>Click on an available cabana to book it.</p>
        )}
      </div>
    </div>
  );
}

export default App;