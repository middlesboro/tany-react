import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { getReviewsByProduct, createReview } from '../services/reviewService';
import { getCategories } from '../services/categoryService';
import { findCategoryPath, findCategoryById } from '../utils/categoryUtils';
import { getUserEmail, isAuthenticated } from '../services/authService';
import { createEmailNotification } from '../services/customerService';
import { useCart } from '../context/CartContext';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import { useModal } from '../context/ModalContext';
import AddToCartButton from '../components/AddToCartButton';
import ProductLabel from '../components/ProductLabel';
import ProductCard from '../components/ProductCard';
import ProductJsonLd from '../components/ProductJsonLd';
import StarRating from '../components/StarRating';
import { addToWishlist, removeFromWishlist } from '../services/wishlistService';
import { VAT_RATE } from '../utils/constants';
import SeoHead from '../components/SeoHead';

const REASONS = [
  "Sme malá Slovenská spoločnosť. Každú objednávku si vážime rovnako a tak k nej aj pristupujeme",
  "Nakúpite u nás všetky henna produkty na jednom mieste",
  "Najlacnejšia doprava už od 2€",
  "Blesková doprava. Objednávky sa snažíme odosielať ešte v ten istý (pracovný) deň",
  "Viac ako 320 odberných miest po celom Slovensku",
  "Doprava zadarmo už od 30€"
];

const StockNotificationForm = ({ productId }) => {
  const [email, setEmail] = useState(getUserEmail() || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Zadajte prosím email');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createEmailNotification({ productId, email });
      setSuccess(true);
    } catch (err) {
      setError('Nepodarilo sa vytvoriť upozornenie. Skúste to neskôr.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Budeme vás informovať, keď bude produkt naskladnený.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-2">Strážiť dostupnosť</h4>
      <p className="text-sm text-gray-600 mb-3">Zadajte váš email a my vám dáme vedieť, keď bude produkt opäť skladom.</p>

      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Váš email"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tany-green"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-tany-green text-white px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap disabled:opacity-70"
        >
          {submitting ? 'Odosielam...' : 'Strážiť'}
        </button>
      </div>
    </form>
  );
};

const ProductReviews = ({ productId }) => {
  const reviewsRef = React.useRef(null);
  const isFirstRun = React.useRef(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Review Form State
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    email: getUserEmail() || '',
    text: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchReviews = React.useCallback(async (pageParam) => {
    const currentPage = typeof pageParam === 'number' ? pageParam : page;
    setLoading(true);
    try {
      const data = await getReviewsByProduct(productId, currentPage);
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
  }, [productId, page]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.email || !newReview.title || !newReview.text) {
        setError('Vyplňte všetky polia.');
        return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createReview({
        productId,
        ...newReview
      });
      setSuccess(true);
      setNewReview({
        rating: 5,
        title: '',
        email: getUserEmail() || '',
        text: ''
      });
      setPage(0);
      if (page === 0) fetchReviews(0);
    } catch (err) {
      setError('Nepodarilo sa odoslať hodnotenie. Skúste to prosím neskôr.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12" ref={reviewsRef}>
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Hodnotenia</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">{stats.averageRating ? stats.averageRating.toFixed(2) : '0.00'}/5</div>
          <div className="flex justify-center mb-2">
            <StarRating rating={stats.averageRating} size="w-6 h-6" />
          </div>
          <p className="text-gray-500">Počet hodnotení: {stats.reviewsCount}</p>
        </div>

        <div className="md:col-span-2">
           <form onSubmit={handleReviewSubmit} className="bg-white border rounded-lg p-6">
             <h4 className="font-semibold text-lg mb-4">Napísať hodnotenie</h4>

             {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
             {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">Hodnotenie bolo úspešne pridané!</div>}

             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hodnotenie</label>
                <StarRating rating={newReview.rating} onClick={handleRatingChange} interactive={true} size="w-6 h-6" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nadpis</label>
                   <input
                    type="text"
                    name="title"
                    value={newReview.title}
                    onChange={handleReviewChange}
                    placeholder="Zhrnutie hodnotenia"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-tany-green"
                    required
                   />
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input
                    type="email"
                    name="email"
                    value={newReview.email}
                    onChange={handleReviewChange}
                    placeholder="Váš email"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-tany-green"
                    required
                   />
               </div>
             </div>

             <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Text hodnotenia</label>
                 <textarea
                    name="text"
                    value={newReview.text}
                    onChange={handleReviewChange}
                    placeholder="Napíšte nám vaše skúsenosti..."
                    className="border p-2 rounded w-full h-24 focus:outline-none focus:ring-1 focus:ring-tany-green"
                    required
                 ></textarea>
             </div>

             <button
                type="submit"
                disabled={submitting}
                className="bg-tany-green text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
             >
               {submitting ? 'Odosielam...' : 'Pridať hodnotenie'}
             </button>
           </form>
        </div>
      </div>

      <div className="space-y-6">
        {loading && <p className="text-gray-500">Načítavam hodnotenia...</p>}
        {!loading && reviews.length === 0 && (
          <p className="text-gray-500 italic">Zatiaľ žiadne hodnotenia.</p>
        )}
        {!loading && reviews.map(review => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex flex-col mb-2">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <StarRating rating={review.rating} />
                   <span className="font-semibold text-gray-800">
                     {review.title && <span className="mr-2">{review.title}</span>}
                     <span className="text-gray-500 font-normal text-sm">od {review.customerName ? review.customerName : 'Anonym'}</span>
                   </span>
                 </div>
                 <span className="text-sm text-gray-500">dňa {new Date(review.createDate).toLocaleDateString('sk-SK')}</span>
              </div>
            </div>
            <p className="text-gray-600 whitespace-pre-line">{review.text}</p>
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2 text-sm">
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

const ReasonsToBuy = () => (
    <div className="mt-10 border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">6 dôvodov prečo nakúpiť na Tany.sk</h3>
        <ul className="space-y-3">
            {REASONS.map((reason, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                    <svg className="w-5 h-5 text-tany-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{reason}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { openLoginModal, openMessageModal } = useModal();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setInWishlist(data.inWishlist || false);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }

        // Set Breadcrumbs
        const categories = await getCategories();
        const crumbs = [{ label: 'Domov', path: '/' }];

        if (data.defaultCategoryTitle && data.defaultCategoryId) {
          const defaultCategory = findCategoryById(categories, data.defaultCategoryId);
          crumbs.push({
            label: data.defaultCategoryTitle,
            path: defaultCategory ? `/category/${defaultCategory.slug}` : null
          });
        } else {
          let path = [];
          if (data.category && data.category.slug) {
            path = findCategoryPath(categories, data.category.slug);
          } else if (data.categoryId) {
            const cat = findCategoryById(categories, data.categoryId);
            if (cat) {
              path = findCategoryPath(categories, cat.slug);
            }
          }

          if (path) {
            path.forEach(p => {
              crumbs.push({ label: p.title, path: `/category/${p.slug}` });
            });
          }
        }

        crumbs.push({ label: data.title, path: null }); // Current product
        setBreadcrumbs(crumbs);

        try {
          const related = await getRelatedProducts(data.id);
          setRelatedProducts(Array.isArray(related) ? related.slice(0, 5) : []);
        } catch (relatedErr) {
          console.error("Failed to load related products", relatedErr);
          setRelatedProducts([]);
        }

      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      // Optional: Add a toast notification here
    } catch (err) {
      if (err.status === 400) {
        openMessageModal("Upozornenie", "Pre tento produkt nie je na sklade dostatočné množstvo.");
      } else {
        console.error("Failed to add to cart", err);
        // Fallback for other errors if needed, or just log
      }
    } finally {
      setAdding(false);
    }
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const toggleWishlist = async () => {
    if (!isAuthenticated()) {
        openLoginModal('Pre pridanie do obľúbených sa musíte prihlásiť.');
        return;
    }
    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
        if (inWishlist) {
            await removeFromWishlist(product.id);
            setInWishlist(false);
        } else {
            await addToWishlist(product.id);
            setInWishlist(true);
        }
    } catch (error) {
        console.error("Wishlist action failed", error);
    } finally {
        setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-xl text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-tany-red text-xl mb-4">{error || "Product not found"}</div>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SeoHead
        title={product.metaTitle || product.title}
        description={product.metaDescription || product.description}
        type="product"
        image={product.images && product.images.length > 0 ? product.images[0] : null}
        product={product}
      />
      <ProductJsonLd product={product} />
      {/* Breadcrumb-ish Link */}
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-tany-green mb-6 transition-colors text-sm font-medium">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Späť na produkty
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left Column: Image */}
          <div className="flex flex-col bg-white p-8 border-b md:border-b-0 md:border-r border-gray-100 relative">
            {product.productLabels && product.productLabels.map((label, index) => (
                <ProductLabel key={index} label={label} />
            ))}

            {product.discountPercentualValue && (
                <div className="absolute top-10 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10 rounded shadow-sm">
                    -{product.discountPercentualValue}%
                </div>
            )}

            <div
              className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center mb-6 cursor-zoom-in"
              onClick={() => selectedImage && setIsFullViewOpen(true)}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-300 text-6xl">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 justify-center thumbnail-gallery">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`border-2 rounded-lg p-1 w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-tany-green shadow-md'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} - ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-800 leading-tight mr-4">{product.title}</h1>
                 <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${inWishlist ? 'text-red-500 bg-red-50' : 'text-red-500 hover:text-red-600 hover:bg-gray-50'}`}
                    title={inWishlist ? "Odobrať z obľúbených" : "Pridať do obľúbených"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill={inWishlist ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center mb-6">
                <StarRating rating={product.averageRating || 0} />
                {product.reviewsCount !== undefined && (
                    <span className="text-sm text-gray-500 ml-2">({product.reviewsCount} hodnotení)</span>
                )}
            </div>

            <div className="mb-6">
                {product.discountPrice ? (
                    <>
                        <div className="flex items-baseline">
                             <span className="text-xl text-gray-400 line-through mr-3">
                                {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'} €
                             </span>
                             <span className="text-3xl font-bold text-red-600">
                                {product.discountPrice.toFixed(2).replace('.', ',')} €
                             </span>
                             <span className="text-sm text-gray-500 ml-2">S DPH</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Cena bez DPH: {(product.discountPrice / VAT_RATE).toFixed(2).replace('.', ',')} €
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <span className="text-3xl font-bold text-tany-green">
                                {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'} €
                            </span>
                            <span className="text-sm text-gray-500 ml-2">S DPH</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Cena bez DPH: {product.price ? (product.price / VAT_RATE).toFixed(2).replace('.', ',') : '0,00'} €
                        </div>
                    </>
                )}
            </div>

            <div className="mb-8">
                <div className={`flex items-center font-medium mb-2 ${product.externalStock ? 'text-tany-green' : (product.quantity > 0 ? 'text-tany-green' : 'text-red-500')}`}>
                    {product.externalStock ? (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                            Skladom u dodávateľa
                        </>
                    ) : (
                        product.quantity > 0 ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                                {product.quantity > 5 ? 'Skladom > 5 ks' : `Skladom ${product.quantity} ks`}
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                                Vypredané
                            </>
                        )
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    {product.externalStock ? 'Odosielam zvyčajne do 3-5 pracovných dní' : 'Odosielame približne do 24 hodín'}
                </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
                {product.quantity > 0 || product.externalStock ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded">
                          <button onClick={decreaseQty} className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition">-</button>
                          <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 text-center focus:outline-none text-gray-800 font-semibold"
                          />
                          <button onClick={increaseQty} className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition">+</button>
                      </div>

                      {/* Add to Cart Button */}
                      <AddToCartButton
                          onClick={handleAddToCart}
                          adding={adding}
                          className="flex-1 py-3 px-6"
                      />
                  </div>
                ) : (
                  <StockNotificationForm productId={product.id} />
                )}
            </div>

            {/* Reasons to Buy Section */}
            <ReasonsToBuy />
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Popis</h2>
            <div
                className="prose prose-green max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || "Žiadny popis k produktu." }}
            />
          </div>

          <ProductReviews productId={product.id} />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Súvisiace produkty</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Full View Modal */}
      {isFullViewOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsFullViewOpen(false)}
        >
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
             <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
                onClick={() => setIsFullViewOpen(false)}
             >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
             <img
               src={selectedImage}
               alt={product.title}
               className="max-w-full max-h-full object-contain"
               onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
