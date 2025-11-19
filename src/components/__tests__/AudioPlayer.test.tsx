import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AudioPlayer } from '../AudioPlayer';

describe('AudioPlayer Component', () => {
  let playSpy: jest.SpyInstance;
  let pauseSpy: jest.SpyInstance;
  const mockSrc = 'http://example.com/test.mp3';

  beforeAll(() => {
    playSpy = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    pauseSpy = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});

    Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
        writable: true,
        value: 180,
    });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
        writable: true,
        value: 0,
    });
    Object.defineProperty(window.HTMLMediaElement.prototype, 'paused', {
        writable: true,
        value: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    playSpy.mockRestore();
    pauseSpy.mockRestore();
  });

  it('renders with initial loading state then becomes ready', async () => {
    render(<AudioPlayer src={mockSrc} title="Test Title" artist="Test Artist" />);

    // Initially, it should show a disabled loader
    const button = screen.getByRole('button', { name: 'Play' }); // It has aria-label="Play" but is disabled
    expect(button).toBeDisabled();
    expect(button.querySelector('.lucide-loader')).toBeInTheDocument();

    const audio = screen.getByTestId('audio-element');
    // Simulate audio is ready
    act(() => {
        fireEvent(audio, new Event('canplay'));
    });

    // Now the button should be enabled and show the Play icon
    const playButton = await screen.findByRole('button', { name: 'Play' });
    expect(playButton).not.toBeDisabled();
    expect(playButton.querySelector('.lucide-play')).toBeInTheDocument();
  });
  
  it('toggles play/pause when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src={mockSrc} />);
    const audio = screen.getByTestId('audio-element');

    // Make the player ready
    act(() => {
      fireEvent(audio, new Event('canplay'));
    });
    const playButton = await screen.findByRole('button', { name: 'Play' });
    
    // 1. Click to Play
    await user.click(playButton);
    expect(playSpy).toHaveBeenCalled();
    
    // 2. Simulate the audio element starting to play
    act(() => {
        audio.paused = false;
        fireEvent(audio, new Event('play'));
    });
    
    // 3. Assert the UI updated to a "Pause" button
    const pauseButton = await screen.findByRole('button', { name: 'Pause' });
    expect(pauseButton).toBeInTheDocument();

    // 4. Click to Pause
    await user.click(pauseButton);
    expect(pauseSpy).toHaveBeenCalled();

    // 5. Simulate the audio element pausing
    act(() => {
        audio.paused = true;
        fireEvent(audio, new Event('pause'));
    });
    
    // 6. Assert the UI updated back to a "Play" button
    expect(await screen.findByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('updates the current time as the audio plays', () => {
    render(<AudioPlayer src={mockSrc} />);
    const audio = screen.getByTestId('audio-element');

    act(() => {
        fireEvent.timeUpdate(audio, { target: { currentTime: 30 } });
    });

    expect(screen.getByText('0:30')).toBeInTheDocument();
  });
  
  it('updates the duration when metadata loads', () => {
    render(<AudioPlayer src={mockSrc} />);
    const audio = screen.getByTestId('audio-element');

    act(() => {
        fireEvent.loadedData(audio);
    });
    
    expect(screen.getAllByText('3:00').length).toBeGreaterThan(0);
  });
});
