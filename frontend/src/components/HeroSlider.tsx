import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Star } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1732631486925-8f7e9924f993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbmVvbiUyMGNpdHl8ZW58MXx8fHwxNzY5MDgyNTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Discover Unique NFTs',
    subtitle: 'Explore the Future of Digital Art',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1765445773870-9064bca380b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBkaWdpdGFsJTIwYXJ0fGVufDF8fHx8MTc2OTE1OTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Collect & Trade',
    subtitle: 'Join the Digital Revolution',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1762279388957-c6ed514d3353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBmdXR1cmV8ZW58MXx8fHwxNzY5MTU5MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Create Your Legacy',
    subtitle: 'Mint Your Own NFTs Today',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1635657987551-1ff6d5a7efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjkxNTkzNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Secure & Transparent',
    subtitle: 'Powered by Blockchain Technology',
  },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 3 + 2,
}));

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[50vh] mt-[72px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
        </motion.div>
      </AnimatePresence>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-20 text-purple-400"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <motion.div
        className="absolute top-32 right-32 text-cyan-400"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Zap className="w-10 h-10" />
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-1/4 text-pink-400"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Star className="w-6 h-6" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center px-6"
        >
          <motion.h1
            className="text-5xl md:text-7xl mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {slides[currentSlide].title}
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-300">
            {slides[currentSlide].subtitle}
          </p>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm border border-purple-500/30 transition-all hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm border border-purple-500/30 transition-all hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-purple-500 w-8'
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
