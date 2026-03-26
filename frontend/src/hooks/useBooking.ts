import { bookingApi } from "../api/bookingApi.ts";
import { useState } from "react";
import { Cell } from "../models/types";

export const useBooking = () => {
  const [map, setMap] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [status, setStatus] = useState({ text: '', color: 'blue' });

  const loadMap = async () => {
    try {
      const data = await bookingApi.fetchMap();
      setMap(data);
    } catch (err: any) {
      setStatus({ text: err.message, color: 'red' });
    }
  };

  const handleBooking = async (room: string, guestName: string) => {
    if (!selectedCell) return;
    try {
      await bookingApi.bookCabana({ ...selectedCell, room, guestName });
      setStatus({ text: 'Booking successful!', color: 'green' });
      setSelectedCell(null);
      await loadMap();
    } catch (err: any) {
      setStatus({ text: err.message, color: 'red' });
    }
  };

  const handleSelectCell = (row: number, col: number, cell: Cell) => {
    if (cell.type === 'W') {
      if (cell.occupied) {
        setSelectedCell(null);
        setStatus({ text: 'This cabana is already occupied.', color: 'red' });
      } else {
        setSelectedCell({ row, col });
        setStatus({ text: '', color: 'blue' });
      }
    }
  };

  return { map, selectedCell, setSelectedCell, status, loadMap, handleBooking,handleSelectCell };
};