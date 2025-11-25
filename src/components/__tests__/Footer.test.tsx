import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the copyright notice', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    // Check for copyright text, using a regex to be flexible with the year
    const copyrightElement = screen.getByText(/© \d{4} Echoes On Tape/);
    expect(copyrightElement).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check for a link that would typically go to a social media site
    // This is a basic check, could be improved by checking specific hrefs
    const socialLinks = screen.getAllByRole('link');
    // Assuming there are other links, we just check that there is more than one (e.g. for Home)
    // A more specific test would be to add `aria-label` to the social links
    expect(socialLinks.length).toBeGreaterThan(1);
  });
});
