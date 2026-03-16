import React, { useState, useEffect } from 'react';
import './App.css';

interface Cell {
  type: string;
  occupied: boolean;
  shape: string | null;
  rotation: number;
  guestName: string | null;
}

type Colors = 'red' | 'green' | 'blue';


function App() {
  const [map, setMap] = useState<Cell[][]>([]);
  const [booking, setBooking] = useState<{row: number, col: number} | null>(null);
  const [message, setMessage] = useState<{text: string, color: Colors}>({text: '', color: 'blue'});

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/map');
      const data = await res.json();
      setMap(data);
    } catch (error) {
      setMessage({text:'Failed to load map', color: 'red'});
    }
  };

  const handleClick = (row: number, col: number, cell: Cell) => {
    if (cell.type === 'W' && !cell.occupied) {
      setBooking({row, col});
      setMessage({text: '', color: 'blue'});
    } else if (cell.type === 'W' && cell.occupied) {
      setBooking(null);
      setMessage({text: 'This cabana is already occupied.', color: 'red'});
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
        setMessage({text: 'Booking successful!', color: 'green'});
        fetchMap();
      } else {
        setMessage({text: data.error, color: 'red'});
      }
    } catch (error) {
      setMessage({text: 'Booking failed', color: 'red'});
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
      <h1>CABANA BOOKING</h1>
      <div className="map">
        {map.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => {
              const image = getImage(cell);
              const isSelected = booking?.row === i && booking?.col === j;
              const imgClass = cell.type === 'W'
                ? (cell.occupied ? 'occupied' : (isSelected ? 'selected' : 'available'))
                : '';

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
                      className={imgClass}
                      style={{transform: `rotate(${cell.rotation}deg)`}}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {message.text && <p className="message" style={{color: message.color}}>
        {message.text}
      </p>}
      <div className="booking-form">
        {booking ? (
          <div className="booking-details">
            <h2>BOOK CABANA</h2>
            <input type="text" placeholder="Room Number" id="room" />
            <input type="text" placeholder="Guest Name" id="name" />
            <button onClick={() => {
              const room = (document.getElementById('room') as HTMLInputElement).value;
              const name = (document.getElementById('name') as HTMLInputElement).value;
              handleBook(room, name);
            }}>Book</button>
            <button onClick={() => setBooking(null)}>Cancel</button>
          </div>
        ) : (
          <p>Click on an available cabana to book it.</p>
        )}
      </div>
    </div>
  );
}

export default App;