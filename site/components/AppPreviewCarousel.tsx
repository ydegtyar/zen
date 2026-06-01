'use client';

import { useEffect, useState } from 'react';

type AppPreviewSlide = {
  src: string;
  alt: string;
  label: string;
};

const slides: AppPreviewSlide[] = [
  {
    src: '/zen-101-home-screenshot.png',
    alt: 'Zen 101 app home screen showing the story list and search interface',
    label: 'Home',
  },
  {
    src: '/zen-101-search-screenshot.png',
    alt: 'Zen 101 app search results for stories containing days',
    label: 'Search',
  },
  {
    src: '/zen-101-favorites-screenshot.png',
    alt: 'Zen 101 app empty favorites screen with a calm pond message',
    label: 'Favorites',
  },
  {
    src: '/zen-101-story-screenshot.png',
    alt: 'Zen 101 app dark reading screen for If You Love, Love Openly',
    label: 'Reading',
  },
  {
    src: '/zen-101-settings-screenshot.png',
    alt: 'Zen 101 app settings screen with language and theme controls',
    label: 'Settings',
  },
];

const autoAdvanceMs = 3600;

export function AppPreviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    const id = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, autoAdvanceMs);

    return () => window.clearInterval(id);
  }, [hasMultipleSlides]);

  return (
    <div className="previewCarousel" aria-label="Zen 101 app screenshots">
      <div className="phoneFrame">
        <div className="screenshotStage">
          {slides.map((slide, index) => (
            <img
              key={slide.src}
              className="appScreenshot"
              src={slide.src}
              alt={slide.alt}
              width="1320"
              height="2868"
              aria-hidden={index === activeIndex ? undefined : true}
              data-active={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
