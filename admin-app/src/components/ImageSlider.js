import React, { useState, useEffect, useCallback } from 'react';

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
      <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] relative overflow-hidden rounded-md shadow-sm">
         <a href={slides[currentIndex].link} className="block w-full h-full">
            <img
                src={slides[currentIndex].url}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover block"
            />
         </a>
      </div>

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
