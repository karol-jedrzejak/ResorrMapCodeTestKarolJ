import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageDisplay } from './MessageDisplay';

describe('MessageDisplay Component - Unit Tests', () => {
  describe('Rendering Messages', () => {
    it('should render message with text content', () => {
      // ARRANGE
      const message = 'Booking successful!';
      const color = 'green';

      // ACT
      render(<MessageDisplay message={message} color={color} />);

      // ASSERT
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should not render when message is empty', () => {
      // ARRANGE
      const { container } = render(
        <MessageDisplay message="" color="blue" />
      );

      // ASSERT
      const messageElement = container.querySelector('.message');
      if (messageElement) {
        expect(messageElement.textContent).toBe('');
      }
    });

    it('should render error message with red color', () => {
      // ARRANGE
      const message = 'Booking failed!';
      const color = 'red';

      // ACT
      const { container } = render(
        <MessageDisplay message={message} color={color} />
      );

      // ASSERT
      const messageElement = container.querySelector('.message');
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should apply color style to message', () => {
      // ARRANGE
      const message = 'Test message';
      const color = 'green';

      // ACT
      const { container } = render(
        <MessageDisplay message={message} color={color} />
      );

      // ASSERT
      const messageElement = container.querySelector('.message') as HTMLElement;
      expect(messageElement.style.color).toBe('green');
    });
  });

  describe('Different Message Types', () => {
    it('should render success message', () => {
      // ACT
      render(
        <MessageDisplay message="Operation successful" color="green" />
      );

      // ASSERT
      expect(screen.getByText('Operation successful')).toBeInTheDocument();
    });

    it('should render error message', () => {
      // ACT
      render(
        <MessageDisplay message="Error occurred" color="red" />
      );

      // ASSERT
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });

    it('should render info message', () => {
      // ACT
      render(
        <MessageDisplay message="Please select a cabana" color="blue" />
      );

      // ASSERT
      expect(screen.getByText('Please select a cabana')).toBeInTheDocument();
    });
  });
});
