import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the config to avoid environment variable issues
jest.mock('./config', () => ({
  urlConfig: {
    backendUrl: 'http://localhost:3060'
  }
}));

// Wrapper component to provide router context
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<AppWithRouter />);
    // The app should render without throwing any errors
    expect(document.body).toBeInTheDocument();
  });

  test('renders navbar', () => {
    render(<AppWithRouter />);
    // Check if navbar is present (you might need to adjust this based on your navbar content)
    expect(document.querySelector('nav')).toBeInTheDocument();
  });

  test('has routing setup', () => {
    render(<AppWithRouter />);
    // Check if the main container is present
    expect(document.querySelector('.container')).toBeInTheDocument();
  });
});