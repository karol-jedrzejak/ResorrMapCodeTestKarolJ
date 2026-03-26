import { renderHook, act, waitFor } from '@testing-library/react';
import { useBooking } from './useBooking';
import { bookingApi } from '../api/bookingApi';
import { Cell } from '../models/types';

// Mock the bookingApi module
jest.mock('../api/bookingApi', () => ({
  bookingApi: {
    fetchMap: jest.fn(),
    bookCabana: jest.fn()
  }
}));

const mockBookingApi = bookingApi as jest.Mocked<typeof bookingApi>;

describe('useBooking Hook - Unit Tests', () => {
  const mockMap: Cell[][] = [
    [
      { type: '.', occupied: false, shape: null, rotation: 0, guestName: null },
      { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
    ],
    [
      { type: '#', occupied: false, shape: 'straight', rotation: 0, guestName: null },
      { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
    ]
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadMap', () => {
    it('should load map and set state', async () => {
      // ARRANGE
      mockBookingApi.fetchMap.mockResolvedValue(mockMap);

      // ACT
      const { result } = renderHook(() => useBooking());
      await act(async () => {
        await result.current.loadMap();
      });

      // ASSERT
      expect(result.current.map).toEqual(mockMap);
      expect(mockBookingApi.fetchMap).toHaveBeenCalled();
    });

    it('should set error status when map loading fails', async () => {
      // ARRANGE
      const errorMessage = 'Failed to load map';
      mockBookingApi.fetchMap.mockRejectedValue(new Error(errorMessage));

      // ACT
      const { result } = renderHook(() => useBooking());
      await act(async () => {
        await result.current.loadMap();
      });

      // ASSERT
      expect(result.current.status.text).toBe(errorMessage);
      expect(result.current.status.color).toBe('red');
    });
  });

  describe('handleSelectCell', () => {
    it('should select available cabana cell', async () => {
      // ARRANGE
      const { result } = renderHook(() => useBooking());
      const availableCell: Cell = { 
        type: 'W', 
        occupied: false, 
        shape: null, 
        rotation: 0, 
        guestName: null 
      };

      // ACT
      act(() => {
        result.current.handleSelectCell(0, 1, availableCell);
      });

      // ASSERT
      expect(result.current.selectedCell).toEqual({ row: 0, col: 1 });
      expect(result.current.status.text).toBe('');
    });

    it('should show error for occupied cabana', async () => {
      // ARRANGE
      const { result } = renderHook(() => useBooking());
      const occupiedCell: Cell = { 
        type: 'W', 
        occupied: true, 
        shape: null, 
        rotation: 0, 
        guestName: 'John' 
      };

      // ACT
      act(() => {
        result.current.handleSelectCell(0, 1, occupiedCell);
      });

      // ASSERT
      expect(result.current.selectedCell).toBeNull();
      expect(result.current.status.text).toMatch(/already occupied/i);
      expect(result.current.status.color).toBe('red');
    });

    it('should ignore non-cabana cells', async () => {
      // ARRANGE
      const { result } = renderHook(() => useBooking());
      const roadCell: Cell = { 
        type: '#', 
        occupied: false, 
        shape: 'straight', 
        rotation: 0, 
        guestName: null 
      };

      // ACT
      act(() => {
        result.current.handleSelectCell(1, 0, roadCell);
      });

      // ASSERT
      // Should not change selection or status for non-cabana cells
      expect(result.current.selectedCell).toBeNull();
    });
  });

  describe('handleBooking', () => {
    it('should successfully book a cabana', async () => {
      // ARRANGE
      mockBookingApi.bookCabana.mockResolvedValue({ success: true });
      mockBookingApi.fetchMap.mockResolvedValue(mockMap);

      const { result } = renderHook(() => useBooking());
      
      act(() => {
        result.current.setSelectedCell({ row: 0, col: 1 });
      });

      // ACT
      await act(async () => {
        await result.current.handleBooking('101', 'John Doe');
      });

      // ASSERT
      expect(mockBookingApi.bookCabana).toHaveBeenCalledWith({
        row: 0,
        col: 1,
        room: '101',
        guestName: 'John Doe'
      });
      expect(result.current.status.text).toBe('Booking successful!');
      expect(result.current.status.color).toBe('green');
      expect(result.current.selectedCell).toBeNull();
    });

    it('should show error message when booking fails', async () => {
      // ARRANGE
      const errorMessage = 'Invalid room number';
      mockBookingApi.bookCabana.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBooking());
      
      act(() => {
        result.current.setSelectedCell({ row: 0, col: 1 });
      });

      // ACT
      await act(async () => {
        await result.current.handleBooking('999', 'Unknown Guest');
      });

      // ASSERT
      expect(result.current.status.text).toBe(errorMessage);
      expect(result.current.status.color).toBe('red');
      expect(result.current.selectedCell).toEqual({ row: 0, col: 1 });
    });

    it('should reload map after successful booking', async () => {
      // ARRANGE
      mockBookingApi.bookCabana.mockResolvedValue({ success: true });
      mockBookingApi.fetchMap.mockResolvedValue(mockMap);

      const { result } = renderHook(() => useBooking());
      
      act(() => {
        result.current.setSelectedCell({ row: 0, col: 1 });
      });

      // ACT
      await act(async () => {
        await result.current.handleBooking('101', 'John Doe');
      });

      // ASSERT
      expect(mockBookingApi.fetchMap).toHaveBeenCalledTimes(1);
      expect(result.current.map).toEqual(mockMap);
    });

    it('should not book if no cell is selected', async () => {
      // ARRANGE
      const { result } = renderHook(() => useBooking());

      // ACT
      await act(async () => {
        await result.current.handleBooking('101', 'John Doe');
      });

      // ASSERT
      expect(mockBookingApi.bookCabana).not.toHaveBeenCalled();
    });
  });

  describe('Initial State', () => {
    it('should have empty initial map', () => {
      // ACT
      const { result } = renderHook(() => useBooking());

      // ASSERT
      expect(result.current.map).toEqual([]);
    });

    it('should have null initial selected cell', () => {
      // ACT
      const { result } = renderHook(() => useBooking());

      // ASSERT
      expect(result.current.selectedCell).toBeNull();
    });

    it('should have empty initial status', () => {
      // ACT
      const { result } = renderHook(() => useBooking());

      // ASSERT
      expect(result.current.status.text).toBe('');
      expect(result.current.status.color).toBe('blue');
    });
  });
});
