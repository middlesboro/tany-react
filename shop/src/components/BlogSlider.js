import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const BlogSlider = ({ blogs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine how many blogs to show based on screen size (handled via CSS/rendering logic mostly, but we need to know for sliding)
  // For now, let's assume 3 on desktop, 1 on mobile.
  // Ideally we should listen to window resize, but for simplicity let's just make the "view window" variable.
  const itemsPerPage = 3;

  // Auto-slide logic
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
        // If we have fewer items than perPage, don't slide.
        if (blogs.length <= itemsPerPage) return 0;
        // Slide by 1. Loop back if at end.
        // If we want infinite loop, standard carousel logic.
        // Let's implement a simple slide by 1.
        return (prevIndex + 1) % blogs.length;
    });
  }, [blogs.length, itemsPerPage]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
        if (blogs.length <= itemsPerPage) return 0;
        return (prevIndex - 1 + blogs.length) % blogs.length;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (blogs.length > itemsPerPage) {
        const interval = setInterval(() => {
        nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [nextSlide, blogs.length, itemsPerPage]);

  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Calculate visible blogs
  // We want to show 3 items starting from currentIndex.
  // We need to handle wrapping.
  const getVisibleBlogs = () => {
      // If fewer than 3, just return all
      if (blogs.length <= itemsPerPage) return blogs;

      const visible = [];
      for (let i = 0; i < itemsPerPage; i++) {
          const index = (currentIndex + i) % blogs.length;
          visible.push(blogs[index]);
      }
      return visible;
  };

  const visibleBlogs = getVisibleBlogs();

  // Format date
  const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('sk-SK');
  };

  return (
    <div className="container mx-auto px-4 mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase">Naše články</h2>

      <div className="relative group">

        {/* Grid for items - 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleBlogs.map((blog, idx) => (
                <div key={`${blog.id}-${idx}`} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                    {/* Image Section */}
                    <div className="h-48 relative overflow-hidden">
                        <Link to={`/blog/${blog.id}`} className="block w-full h-full">
                            {blog.image ? (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    Bez obrázku
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                        <Link to={`/blog/${blog.id}`} className="text-xl font-bold text-gray-800 hover:text-tany-green transition-colors mb-2 line-clamp-2">
                            {blog.title}
                        </Link>

                        <div className="text-sm text-gray-500 mb-3">
                            {blog.author && <span className="mr-2">Pridala: {blog.author},</span>}
                            <span>{formatDate(blog.createdDate)}</span>
                        </div>

                        <div className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                            {blog.shortDescription}
                        </div>

                        <div className="mt-auto">
                             <Link to={`/blog/${blog.id}`} className="inline-block bg-tany-green text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors uppercase text-sm">
                                Prečítať
                             </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Navigation Arrows (only if enough items to slide) */}
        {blogs.length > itemsPerPage && (
            <>
                <div className="hidden md:block absolute top-[50%] -translate-y-1/2 -left-12 z-10">
                    <button
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none"
                        aria-label="Previous Slide"
                    >
                        &#10094;
                    </button>
                </div>
                <div className="hidden md:block absolute top-[50%] -translate-y-1/2 -right-12 z-10">
                    <button
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none"
                        aria-label="Next Slide"
                    >
                        &#10095;
                    </button>
                </div>
            </>
        )}
      </div>

      {/* Mobile navigation (simplified, maybe just dots or swipe? For now keeping it simple as grid handles 1 col stack naturally, but slider logic still runs.
          If we want slider on mobile too, we should just show 1 item.
          The current logic `getVisibleBlogs` returns 3 items always.
          On mobile, grid-cols-1 stacks them. So user sees 3 items stacked. This is acceptable "List of blogs".
          If they want a carousel on mobile (1 item visible), I'd need to change `itemsPerPage` based on screen width.

          For simplicity and since the requirement is "show in one row 3 blogs", likely referring to desktop.
          Stacking 3 on mobile is fine.
      */}

    </div>
  );
};

export default BlogSlider;
