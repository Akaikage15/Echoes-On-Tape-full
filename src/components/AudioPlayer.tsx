import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider'; // Assuming you have a Slider component

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  artwork?: string;
  requiredTier?: 'lite' | 'fan' | 'pro'; // Optional: for integration with subscription
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title = 'Неизвестный трек', artist = 'Неизвестный исполнитель', artwork }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const togglePlay = () => setIsPlaying(!audio.paused);
    const handleLoading = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', togglePlay);
    audio.addEventListener('pause', togglePlay);
    audio.addEventListener('loading', handleLoading);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleLoading);
    audio.addEventListener('playing', handleCanPlay);

    // Initial loading state
    if (audio.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
      setAudioData();
    } else {
      setIsLoading(true);
    }

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', togglePlay);
      audio.removeEventListener('pause', togglePlay);
      audio.removeEventListener('loading', handleLoading);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleLoading);
      audio.removeEventListener('playing', handleCanPlay);
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    if (isMuted && value[0] > 0) setIsMuted(false);
    if (!isMuted && value[0] === 0) setIsMuted(true);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-card/80 backdrop-blur-md p-4 rounded-lg flex flex-col space-y-4 relative z-10">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center space-x-4">
        {artwork && (
          <img src={artwork} alt="Artwork" className="w-16 h-16 rounded-md object-cover" />
        )}
        <div className="flex-1">
          <h4 className="text-lg font-['Bebas_Neue'] tracking-wide">{title}</h4>
          <p className="text-sm text-muted-foreground">{artist}</p>
        </div>
        
        <Button onClick={togglePlayPause} variant="ghost" size="icon" disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin" /> : (isPlaying ? <Pause /> : <Play />)}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="flex-1"
          disabled={isLoading}
        />
        <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <Button onClick={toggleMute} variant="ghost" size="icon">
          {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};
