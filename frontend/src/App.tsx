import React, { useEffect } from 'react';
import './App.css';
import { useBooking } from './hooks/useBooking.ts'; // Logika biznesowa
import { MapGrid } from './components/MapGrid.tsx';     // Wydzielony komponent mapy
import { BookingForm } from './components/BookingForm.tsx'; // Wydzielony formularz
import { MessageDisplay } from './components/MessageDisplay.tsx'; // UI komunikatów

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

  // Pobranie danych przy montowaniu - czyste i czytelne
  useEffect(() => {
    loadMap();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>CABANA BOOKING</h1>
      </header>

      <main>
        {/* Mapa jako osobny komponent - czysty props drilling */}
        <MapGrid 
          map={map} 
          selectedCell={selectedCell} 
          onCellClick={handleSelectCell}
        />

        {/* Komunikaty o błędach/sukcesie */}
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