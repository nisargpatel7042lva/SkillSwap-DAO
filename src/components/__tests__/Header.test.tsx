import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Header from '../Header';

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <WagmiConfig config={config}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </WagmiConfig>
  );
};

describe('Header', () => {
  it('renders logo', () => {
    renderWithProviders(<Header />);
    const logo = screen.getByAltText('SkillSwap DAO Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    renderWithProviders(<Header />);
    const searchInput = screen.getByPlaceholderText('Search skills... 🔍');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders profile button', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders connect wallet button', () => {
    renderWithProviders(<Header />);
    // Note: This test might need adjustment based on how RainbowKit renders its button
    expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument();
  });

  it('opens mobile menu when menu button is clicked', () => {
    renderWithProviders(<Header />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    // Add assertions for mobile menu content
  });

  it('handles search submission', () => {
    renderWithProviders(<Header />);
    const searchInput = screen.getByPlaceholderText('Search skills... 🔍');
    const searchForm = searchInput.closest('form');
    
    fireEvent.change(searchInput, { target: { value: 'web development' } });
    fireEvent.submit(searchForm!);
    
    // Add assertions for search behavior
  });
}); 