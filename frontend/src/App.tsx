import React, { useEffect } from 'react';
import './App.css';
import { useBooking } from './hooks/useBooking.ts'; 
import { MapGrid } from './components/MapGrid.tsx';    
import { BookingForm } from './components/BookingForm.tsx'; 
import { MessageDisplay } from './components/MessageDisplay.tsx';

function App() {
  const { 
    map, 
    selectedCell, 
    setSelectedCell, 
    status, 
    loadMap, 
    handleBooking,
    handleSelectCell
  } = useBooking();

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  return (
    <div className="App">
      <header>
        <h1>CABANA BOOKING</h1>
      </header>

      <main>
        <MapGrid 
          map={map} 
          selectedCell={selectedCell} 
          onCellClick={handleSelectCell}
        />

        <MessageDisplay message={status.text} color={status.color} />

        <section className="booking-form">
          {selectedCell ? (
            <BookingForm 
              onBook={handleBooking} 
              onCancel={() => setSelectedCell(null)} 
            />
          ) : (
            <p className="hint">Click on an available cabana to book it.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;