import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

const mockMap = [
  [
    { type: '.', occupied: false, shape: null, rotation: 0, guestName: null },
    { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
  ],
  [
    { type: '#', occupied: false, shape: 'straight', rotation: 0, guestName: null },
    { type: 'W', occupied: false, shape: null, rotation: 0, guestName: null }
  ]
];

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (typeof url === 'string' && url.endsWith('/api/map')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMap)
        } as any);
      }
      return Promise.reject(new Error('Unexpected fetch'));
    });
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  test('renders map and allows booking a chair', async () => {
    render(<App />);

    // Wait for map render
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/map'));

    // Wait for the map to render image tiles
    await waitFor(() => expect(screen.getAllByRole('img').length).toBeGreaterThan(0));

    const imgElements = screen.getAllByRole('img');
    const cells = imgElements.map(img => img.parentElement);

    // Click on the first available W cell
    fireEvent.click(cells[0]);

    // Booking form should be visible
    expect(screen.getByText(/book cabana/i)).toBeInTheDocument();

    // Mock booking request and map refresh
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (typeof url === 'string' && url.endsWith('/api/book')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Booking successful!' }) } as any);
      }
      if (typeof url === 'string' && url.endsWith('/api/map')) {
        const bookedMap = JSON.parse(JSON.stringify(mockMap));
        bookedMap[0][1].occupied = true;
        bookedMap[0][1].guestName = 'Alice';
        return Promise.resolve({ ok: true, json: () => Promise.resolve(bookedMap) } as any);
      }
      return Promise.reject(new Error('Unexpected fetch'));
    });

    fireEvent.change(screen.getByPlaceholderText(/room number/i), { target: { value: '101' } });
    fireEvent.change(screen.getByPlaceholderText(/guest name/i), { target: { value: 'Alice' } });

    fireEvent.click(screen.getByRole('button', {name: /book$/i}));

    await waitFor(() => expect(screen.getByText(/booking successful/i)).toBeInTheDocument());

    // After booking, the map should have been refreshed and the booked chair marked occupied.
    await waitFor(() => {
      const bookedImages = screen.getAllByRole('img', {name: 'W'});
      expect(bookedImages[0]).toHaveClass('occupied');
    });
  });
});
