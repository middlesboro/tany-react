import React, { useState, useEffect, useCallback } from 'react';

/**
 * ImageSlider Component
 *
 * Recommended Image Resolutions:
 * - Desktop: 1600x350 px
 * - Mobile: 800x400 px
 */
const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative group mb-8">
      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] relative overflow-hidden rounded-md shadow-sm">
         <a href={slides[currentIndex].link} className="block w-full h-full">
            <picture className="w-full h-full block">
                {slides[currentIndex].mobileUrl && (
                    <source media="(max-width: 768px)" srcSet={slides[currentIndex].mobileUrl} />
                )}
                <img
                    src={slides[currentIndex].desktopUrl || slides[currentIndex].url}
                    alt={`Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover block"
                />
            </picture>
         </a>
      </div>

      {/* Text Overlay */}
      {slides[currentIndex].title && (
        <div className="absolute bottom-8 right-8 md:right-16 bg-white/90 p-4 md:p-6 max-w-md md:max-w-lg rounded-sm shadow-lg z-20 text-left hidden sm:block pointer-events-auto">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 uppercase border-b-2 border-tany-green inline-block pb-1">{slides[currentIndex].title}</h2>
            {slides[currentIndex].text && <p className="text-gray-600 mb-4 text-xs md:text-sm leading-relaxed">{slides[currentIndex].text}</p>}
            <a href={slides[currentIndex].link} className="inline-block bg-tany-green text-white font-bold py-2 px-4 rounded-sm hover:bg-green-700 transition-colors uppercase text-xs tracking-wider">
                Zistiť viac
            </a>
        </div>
      )}

      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-4 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors z-10">
        <button onClick={prevSlide} className="w-8 h-8 flex items-center justify-center focus:outline-none pb-1" aria-label="Previous Slide">
             &#10094;
        </button>
      </div>

      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-4 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors z-10">
        <button onClick={nextSlide} className="w-8 h-8 flex items-center justify-center focus:outline-none pb-1" aria-label="Next Slide">
             &#10095;
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center py-2 absolute bottom-2 w-full z-10">
        {slides.map((slide, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            className={`text-4xl cursor-pointer mx-1 leading-none focus:outline-none ${currentIndex === slideIndex ? 'text-tany-green' : 'text-white/70 hover:text-white'}`}
          >
            &#8226;
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
