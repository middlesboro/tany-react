import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const BlogSlider = ({ blogs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === blogs.length - 1 ? 0 : prevIndex + 1));
  }, [blogs.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? blogs.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (blogs.length > 1) {
        const interval = setInterval(() => {
        nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [nextSlide, blogs.length]);

  if (!blogs || blogs.length === 0) {
    return null;
  }

  const currentBlog = blogs[currentIndex];

  // Format date
  const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('sk-SK');
  };

  return (
    <div className="container mx-auto px-4 mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase">Naše články</h2>

      <div className="relative group bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 h-64 md:h-80 relative overflow-hidden">
                {currentBlog.image ? (
                    <img
                        src={currentBlog.image}
                        alt={currentBlog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        Bez obrázku
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <Link to={`/blog/${currentBlog.slug}`} className="text-2xl font-bold text-gray-800 hover:text-tany-green transition-colors mb-2">
                    {currentBlog.title}
                </Link>

                <div className="text-sm text-gray-500 mb-4">
                    {currentBlog.author && <span className="mr-2">Pridala: {currentBlog.author},</span>}
                    <span>{formatDate(currentBlog.createdDate)}</span>
                </div>

                <div className="text-gray-600 mb-6 line-clamp-3">
                    {currentBlog.shortDescription}
                </div>

                <div>
                     <Link to={`/blog/${currentBlog.slug}`} className="inline-block bg-tany-green text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors uppercase text-sm">
                        Prečítať
                     </Link>
                </div>
            </div>
        </div>

        {/* Navigation Arrows (only if > 1 slide) */}
        {blogs.length > 1 && (
            <>
                <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-4 z-10">
                    <button
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none"
                        aria-label="Previous Slide"
                    >
                        &#10094;
                    </button>
                </div>
                <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-4 z-10">
                    <button
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none"
                        aria-label="Next Slide"
                    >
                        &#10095;
                    </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {blogs.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full focus:outline-none transition-colors ${
                                currentIndex === index ? 'bg-tany-green' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default BlogSlider;
