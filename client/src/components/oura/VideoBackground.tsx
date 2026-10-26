import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  videoSrc: string;
  posterSrc?: string;
  overlayOpacity?: number;
}

export function VideoBackground({ videoSrc, posterSrc, overlayOpacity = 0.4 }: VideoBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for text readability */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
