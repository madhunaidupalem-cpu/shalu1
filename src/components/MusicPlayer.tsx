import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "DIGITAL PULSE",
    artist: "NEON DREAMS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff",
    duration: "03:42"
  },
  {
    id: 2,
    title: "CYBER RUNNER",
    artist: "SYNTH ECHO",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
    duration: "04:15"
  },
  {
    id: 3,
    title: "GLITCH CITY",
    artist: "DATA GHOST",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#00f3ff",
    duration: "02:58"
  }
];

interface MusicPlayerProps {
  simpleMode?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ simpleMode }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (simpleMode) {
    return (
      <div className="flex flex-col gap-4">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />
        
        {/* Track List */}
        <div className="space-y-1">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id}
              onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
              className={`p-3 rounded-[4px] flex flex-col cursor-pointer transition-colors ${idx === currentTrackIndex ? 'active-track' : 'hover:bg-gray-900'}`}
            >
              <span className={`text-sm font-bold ${idx === currentTrackIndex ? 'text-white' : 'text-gray-400'}`}>
                {track.title}
              </span>
              <span className={`text-[10px] ${idx === currentTrackIndex ? 'text-blue-400' : 'text-gray-500'}`}>
                {track.artist} • {track.duration}
              </span>
            </div>
          ))}
        </div>

        {/* mini-player at bottom of sidebar */}
        <div className="mt-4 pt-4 border-t border-gray-800">
           <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden mb-2">
             <div 
               className="bg-pink-500 h-full shadow-[0_0_8px_#ff00ff]" 
               style={{ width: `${progress}%` }}
             />
           </div>
           <div className="flex justify-between w-full text-[10px] text-gray-500 uppercase">
             <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
             <span>{currentTrack.duration}</span>
           </div>
           
           <div className="flex justify-center items-center gap-6 mt-4">
             <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors">
               <SkipBack size={18} />
             </button>
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="text-pink-500 hover:scale-110 active:scale-95 transition-all"
             >
               {isPlaying ? <Pause size={32} /> : <Play size={32} />}
             </button>
             <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors">
               <SkipForward size={18} />
             </button>
           </div>
        </div>
      </div>
    );
  }

  // Base mode (fallback/default) - using high density styling too
  return (
    <div className="panel w-full">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 border border-[#00f3ff] flex items-center justify-center text-[#00f3ff]">
           <Music size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm truncate text-white">{currentTrack.title}</h3>
          <p className="text-[10px] text-gray-500 uppercase">{currentTrack.artist}</p>
        </div>
      </div>
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-pink-500 shadow-[0_0_8px_#ff00ff]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
