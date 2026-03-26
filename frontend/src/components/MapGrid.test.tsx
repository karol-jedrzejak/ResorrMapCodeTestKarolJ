import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapGrid } from './MapGrid';
import { Cell } from '../models/types';

describe('MapGrid Component - Unit Tests', () => {
  describe('Rendering', () => {
    it('should render all cells from the map', () => {
      // ARRANGE
      const mockMap: Cell[][] = [
        [
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null },
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
        ],
        [
          { type: '#', occupied: false, shape: 'straight', rotation: 0, guestName: null },
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
        ]
      ];

      // ACT
      render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={jest.fn()} />
      );

      // ASSERT
      const cells = screen.getAllByRole('img');
      expect(cells.length).toBe(4);
    });

    it('should render map with correct structure', () => {
      // ARRANGE
      const mockMap: Cell[][] = [
        [
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null },
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
        ]
      ];

      // ACT
      const { container } = render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={jest.fn()} />
      );

      // ASSERT
      const rows = container.querySelectorAll('.row');
      expect(rows.length).toBe(1);
      expect(rows[0].children.length).toBe(2);
    });
  });

  describe('Cell Selection', () => {
    it('should call onCellClick when cabana cell is clicked', async () => {
      // ARRANGE
      const mockOnCellClick = jest.fn();
      const mockMap: Cell[][] = [
        [
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
        ]
      ];

      render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={mockOnCellClick} />
      );

      // ACT
      const cells = screen.getAllByRole('img');
      fireEvent.click(cells[0].parentElement!);

      // ASSERT
      expect(mockOnCellClick).toHaveBeenCalledWith(0, 0, mockMap[0][0]);
    });

    it('should highlight selected cell with selected class', () => {
      // ARRANGE
      const mockMap: Cell[][] = [
        [
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null },
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
        ]
      ];

      // ACT
      const { container } = render(
        <MapGrid 
          map={mockMap} 
          selectedCell={{ row: 0, col: 1 }} 
          onCellClick={jest.fn()} 
        />
      );

      // ASSERT
      const images = screen.getAllByRole('img');
      expect(images[1]).toHaveClass('selected');
      expect(images[0]).not.toHaveClass('selected');
    });

    it('should show occupied class for occupied cabanas', () => {
      // ARRANGE
      const mockMap: Cell[][] = [
        [
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null },
          { type: 'W', occupied: true, shape: null, rotation: 0, guestName: 'John' }
        ]
      ];

      // ACT
      render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={jest.fn()} />
      );

      // ASSERT
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveClass('available');
      expect(images[1]).toHaveClass('occupied');
    });
  });

  describe('Cell Type Handling', () => {
    it('should not apply cabana class to non-W cells', () => {
      // ARRANGE
      const mockMap: Cell[][] = [
        [
          { type: '#', occupied: false, shape: 'straight', rotation: 0, guestName: null },
          { type: '.', occupied: false, shape: null, rotation: 0, guestName: null }
        ]
      ];

      const { container } = render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={jest.fn()} />
      );

      // ASSERT
      const cells = container.querySelectorAll('.cell');
      expect(cells[0]).not.toHaveClass('cabana');
      expect(cells[1]).not.toHaveClass('cabana');
    });

    it('should apply cabana class to W cells', () => {
      // ARRANGE
      const mockMap: Cell[][] = [
        [
          { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
        ]
      ];

      const { container } = render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={jest.fn()} />
      );

      // ASSERT
      const cell = container.querySelector('.cell');
      expect(cell).toHaveClass('cabana');
    });
  });

  describe('Empty Map', () => {
    it('should render empty map gracefully', () => {
      // ARRANGE
      const mockMap: Cell[][] = [];

      // ACT
      const { container } = render(
        <MapGrid map={mockMap} selectedCell={null} onCellClick={jest.fn()} />
      );

      // ASSERT
      const rows = container.querySelectorAll('.row');
      expect(rows.length).toBe(0);
    });
  });
});
