import type { Booking } from '../loaders/bookingLoader.ts';

const bookingsCache = new Map<string, Booking[]>();

export function getCachedBookings(path: string): Booking[] | null {
  return bookingsCache.get(path) || null;
}

export function setCachedBookings(path: string, data: Booking[]): void {
  bookingsCache.set(path, data);
}

export function clearBookingsCache(path?: string): void {
  if (path) {
    bookingsCache.delete(path);
  } else {
    bookingsCache.clear();
  }
}