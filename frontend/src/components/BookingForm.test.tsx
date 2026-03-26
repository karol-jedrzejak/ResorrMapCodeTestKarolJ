import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from './BookingForm';

describe('BookingForm Component - Unit Tests', () => {
  describe('Rendering', () => {
    it('should render form with all input fields', () => {
      // ARRANGE
      const mockOnBook = jest.fn();
      const mockOnCancel = jest.fn();

      // ACT
      render(
        <BookingForm onBook={mockOnBook} onCancel={mockOnCancel} />
      );

      // ASSERT
      expect(screen.getByPlaceholderText(/room number/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/guest name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /book/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should render form title', () => {
      // ACT
      render(
        <BookingForm onBook={jest.fn()} onCancel={jest.fn()} />
      );

      // ASSERT
      expect(screen.getByText(/book cabana/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onBook with form data when submitted', async () => {
      // ARRANGE
      const mockOnBook = jest.fn();
      const mockOnCancel = jest.fn();

      render(
        <BookingForm onBook={mockOnBook} onCancel={mockOnCancel} />
      );

      // ACT
      const roomInput = screen.getByPlaceholderText(/room number/i);
      const guestInput = screen.getByPlaceholderText(/guest name/i);
      const bookButton = screen.getByRole('button', { name: /book$/i });

      await userEvent.type(roomInput, '101');
      await userEvent.type(guestInput, 'John Doe');
      fireEvent.click(bookButton);

      // ASSERT
      expect(mockOnBook).toHaveBeenCalledWith('101', 'John Doe');
    });

    it('should clear form after submission', async () => {
      // ARRANGE
      const mockOnBook = jest.fn();

      render(
        <BookingForm onBook={mockOnBook} onCancel={jest.fn()} />
      );

      // ACT
      const roomInput = screen.getByPlaceholderText(/room number/i) as HTMLInputElement;
      const guestInput = screen.getByPlaceholderText(/guest name/i) as HTMLInputElement;
      const bookButton = screen.getByRole('button', { name: /book$/i });

      await userEvent.type(roomInput, '101');
      await userEvent.type(guestInput, 'John Doe');
      fireEvent.click(bookButton);

      // ASSERT
      expect(roomInput.value).toBe('');
      expect(guestInput.value).toBe('');
    });

    it('should not submit when room or guest name is empty', async () => {
      // ARRANGE
      const mockOnBook = jest.fn();

      render(
        <BookingForm onBook={mockOnBook} onCancel={jest.fn()} />
      );

      // ACT
      const bookButton = screen.getByRole('button', { name: /book$/i });
      fireEvent.click(bookButton);

      // ASSERT
      expect(mockOnBook).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', () => {
      // ARRANGE
      const mockOnCancel = jest.fn();

      render(
        <BookingForm onBook={jest.fn()} onCancel={mockOnCancel} />
      );

      // ACT
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // ASSERT
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should clear form when canceled', async () => {
      // ARRANGE
      render(
        <BookingForm onBook={jest.fn()} onCancel={jest.fn()} />
      );

      // ACT
      const roomInput = screen.getByPlaceholderText(/room number/i) as HTMLInputElement;
      const guestInput = screen.getByPlaceholderText(/guest name/i) as HTMLInputElement;
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      await userEvent.type(roomInput, '101');
      await userEvent.type(guestInput, 'John Doe');
      fireEvent.click(cancelButton);

      // ASSERT
      expect(roomInput.value).toBe('');
      expect(guestInput.value).toBe('');
    });
  });
});
