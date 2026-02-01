import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReviewsByBrand } from '../services/reviewService';
import StarRating from '../components/StarRating';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

const BrandReviews = ({ brandIds: propBrandIds, brandId: propBrandId, title, description }) => {
  const { brandId: paramBrandId } = useParams();

  let brandIds = [];
  if (propBrandIds && Array.isArray(propBrandIds) && propBrandIds.length > 0) {
    brandIds = propBrandIds;
  } else if (propBrandId) {
    brandIds = [propBrandId];
  } else if (paramBrandId) {
    brandIds = [paramBrandId];
  }

  const brandIdsKey = brandIds.join(',');
  const { setBreadcrumbs } = useBreadcrumbs();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReviews = React.useCallback(async () => {
    if (brandIds.length === 0) return;
    setLoading(true);
    try {
      const data = await getReviewsByBrand(brandIds, page);
      setReviews(data.reviews.content);
      setTotalPages(data.reviews.totalPages);
      setStats({
        averageRating: data.averageRating || 0,
        reviewsCount: data.reviewsCount || 0
      });
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  }, [brandIdsKey, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setBreadcrumbs([
        { label: 'Domov', path: '/' },
        { label: title || 'Hodnotenia značky', path: null }
    ]);
  }, [title, setBreadcrumbs]);

  if (brandIds.length === 0) {
    return <div className="container mx-auto px-4 py-12 text-center text-gray-500">Brand ID not provided.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       {/* Breadcrumb-ish Link */}
       <Link to="/" className="inline-flex items-center text-gray-500 hover:text-tany-green mb-6 transition-colors text-sm font-medium">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Späť na domov
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">{title}</h1>

        <div className="mb-10 text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg text-center mb-10 max-w-sm mx-auto">
          <div className="text-4xl font-bold text-gray-800 mb-2">{stats.averageRating ? stats.averageRating.toFixed(2) : '0.00'}/5</div>
          <div className="flex justify-center mb-2">
            <StarRating rating={stats.averageRating} size="w-8 h-8" />
          </div>
          <p className="text-gray-500">{stats.reviewsCount} hodnotení</p>
        </div>

        <div className="space-y-6">
            {loading && <p className="text-center text-gray-500">Načítavam hodnotenia...</p>}
            {!loading && reviews.length === 0 && (
                <p className="text-center text-gray-500 italic">Zatiaľ žiadne hodnotenia pre túto značku.</p>
            )}

            {!loading && reviews.map(review => (
            <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex gap-4">
                    {review.productImage && (
                        <div className="flex-shrink-0">
                            <Link to={`/product/${review.productSlug || '#'}`}>
                                <img
                                    src={review.productImage}
                                    alt={review.productName || review.productTitle || 'Product'}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-100"
                                />
                            </Link>
                        </div>
                    )}
                    <div className="flex-grow">
                        <div className="flex flex-col mb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <StarRating rating={review.rating} />
                                    <span className="font-semibold text-gray-800">
                                        {review.title && <span className="mr-2">{review.title}</span>}
                                        <span className="text-gray-500 font-normal text-sm">od {review.customerName ? review.customerName : 'Anonym'}</span>
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 whitespace-nowrap ml-2">dňa {new Date(review.createDate).toLocaleDateString('sk-SK')}</span>
                            </div>
                        </div>

                        {(review.productName || review.productTitle) && (
                            <Link to={`/product/${review.productSlug || '#'}`} className="text-sm text-tany-green hover:underline mb-2 block font-medium">
                                {review.productName || review.productTitle}
                            </Link>
                        )}
                        <p className="text-gray-600 whitespace-pre-line">{review.text}</p>
                    </div>
                </div>
            </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2 text-sm">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className={`px-3 py-2 rounded-sm border ${
                page === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:bg-tany-green hover:text-white hover:border-tany-green'
              }`}
            >
              Predchádzajúca
            </button>
            <span className="text-gray-700 font-bold mx-2">
              Strana {page + 1} z {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className={`px-3 py-2 rounded-sm border ${
                page + 1 >= totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:bg-tany-green hover:text-white hover:border-tany-green'
              }`}
            >
              Ďalšia
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandReviews;
