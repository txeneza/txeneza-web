"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = "",
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalItems = React.Children.count(children);

  // Responsividade: calcular itens por página
  useEffect(() => {
    const updatePerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setPerView(itemsPerView.desktop || 3);
      } else if (width >= 640) {
        setPerView(itemsPerView.tablet || 2);
      } else {
        setPerView(itemsPerView.mobile || 1);
      }
    };

    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, totalItems - perView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || isPaused || maxIndex <= 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, nextSlide, maxIndex]);

  // Gestos Táteis (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Suporte a Teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full overflow-hidden focus:outline-none ${className}`}
      aria-label="Carrossel de conteúdo"
    >
      {/* Controlo de Navegação Lateral (Desktop & Tablet) */}
      {showArrows && maxIndex > 0 && (
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={prevSlide}
            aria-label="Item anterior"
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-grey900/80 backdrop-blur-md border border-forestGreen/15 dark:border-white/10 text-forestGreen dark:text-limeGreen hover:bg-forestGreen/10 dark:hover:bg-limeGreen/10 transition-all shadow-sm active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Item seguinte"
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-grey900/80 backdrop-blur-md border border-forestGreen/15 dark:border-white/10 text-forestGreen dark:text-limeGreen hover:bg-forestGreen/10 dark:hover:bg-limeGreen/10 transition-all shadow-sm active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Slider Window */}
      <div className="w-full overflow-hidden">
        <motion.div
          animate={{ x: `-${currentIndex * (100 / perView)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex w-full"
        >
          {childrenArray.map((child, idx) => (
            <div
              key={idx}
              style={{ width: `${100 / perView}%` }}
              className="shrink-0 px-2 sm:px-3"
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pontos de Paginação (Dots) */}
      {showDots && maxIndex > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para a página ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? "w-7 h-2.5 bg-forestGreen dark:bg-limeGreen"
                  : "w-2.5 h-2.5 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
