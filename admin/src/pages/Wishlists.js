import React, { useState, useEffect } from 'react';
import { getAdminWishlists, deleteWishlist } from '../services/wishlistAdminService';
import WishlistList from '../components/WishlistList';

const Wishlists = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  const fetchWishlists = async (pageParam) => {
    setLoading(true);
    try {
      const data = await getAdminWishlists(pageParam);
      setWishlists(data.content || []); // Handle potential undefined content
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch wishlists", error);
      setError("Failed to load wishlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists(page);
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await deleteWishlist(id);
      fetchWishlists(page);
    } catch (error) {
      console.error("Failed to delete wishlist", error);
      alert("Failed to delete wishlist");
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Wishlists</h1>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {loading ? (
            <div>Loading...</div>
        ) : (
            <>
                <WishlistList wishlists={wishlists} onDelete={handleDelete} />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 mx-1">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </>
        )}
    </div>
  );
};

export default Wishlists;
