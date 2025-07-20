import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage';

// Mock the config
jest.mock('../../../config', () => ({
  urlConfig: {
    backendUrl: 'http://localhost:3060'
  }
}));

// Mock fetch
global.fetch = jest.fn();

// Wrapper component to provide router context
const MainPageWithRouter = () => (
  <BrowserRouter>
    <MainPage />
  </BrowserRouter>
);

describe('MainPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders loading state initially', () => {
    render(<MainPageWithRouter />);
    expect(document.querySelector('.container')).toBeInTheDocument();
  });

  test('fetches and displays gifts', async () => {
    const mockGifts = [
      {
        _id: '1',
        name: 'Test Gift 1',
        condition: 'New',
        date_added: Math.floor(Date.now() / 1000),
        image: 'test-image-1.jpg'
      },
      {
        _id: '2',
        name: 'Test Gift 2',
        condition: 'Used',
        date_added: Math.floor(Date.now() / 1000),
        image: null
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGifts
    });

    render(<MainPageWithRouter />);

    await waitFor(() => {
      expect(screen.getByText('Test Gift 1')).toBeInTheDocument();
      expect(screen.getByText('Test Gift 2')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3060/api/gifts');
  });

  test('handles fetch error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<MainPageWithRouter />);

    // Should not crash and should still render the container
    await waitFor(() => {
      expect(document.querySelector('.container')).toBeInTheDocument();
    });
  });

  test('displays condition classes correctly', async () => {
    const mockGifts = [
      {
        _id: '1',
        name: 'New Gift',
        condition: 'New',
        date_added: Math.floor(Date.now() / 1000)
      },
      {
        _id: '2',
        name: 'Used Gift',
        condition: 'Used',
        date_added: Math.floor(Date.now() / 1000)
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGifts
    });

    render(<MainPageWithRouter />);

    await waitFor(() => {
      const newGiftElement = screen.getByText('New Gift').closest('.card');
      const usedGiftElement = screen.getByText('Used Gift').closest('.card');
      
      expect(newGiftElement.querySelector('.list-group-item-success')).toBeInTheDocument();
      expect(usedGiftElement.querySelector('.list-group-item-warning')).toBeInTheDocument();
    });
  });

  test('displays no image placeholder when image is null', async () => {
    const mockGifts = [
      {
        _id: '1',
        name: 'Gift without image',
        condition: 'New',
        date_added: Math.floor(Date.now() / 1000),
        image: null
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGifts
    });

    render(<MainPageWithRouter />);

    await waitFor(() => {
      expect(screen.getByText('No Image Available')).toBeInTheDocument();
    });
  });
});