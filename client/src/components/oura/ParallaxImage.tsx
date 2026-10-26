import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ParallaxImage({ src, alt, className = "" }: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-2xl ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center"
        />
      </motion.div>
    </div>
  );
}
