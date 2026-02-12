import React, { useState, useEffect } from 'react';
import { getAdminWishlists, deleteWishlist } from '../services/wishlistAdminService';
import WishlistList from '../components/WishlistList';
import usePersistentTableState from '../hooks/usePersistentTableState';

const Wishlists = () => {
  const {
    page, setPage,
    size, setSize,
    sort
  } = usePersistentTableState('admin_wishlists_list_state', {}, 'id,desc', 20);

  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const data = await getAdminWishlists(page, size, sort);
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
    fetchWishlists();
  }, [page, size, sort]);

  const handleDelete = async (id) => {
    try {
      await deleteWishlist(id);
      fetchWishlists();
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
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                        <span className="mr-2">Items per page:</span>
                        <select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="border rounded p-1"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="mr-2">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page + 1 >= totalPages}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default Wishlists;
