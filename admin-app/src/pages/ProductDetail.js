import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { useCart } from '../context/CartContext';

// Mock Reviews Data
const MOCK_REVIEWS = [
  { id: 1, user: 'Saniya', date: '23.01.2025', rating: 5, text: 'Vlasy zafarbil veľmi dobre, môžem odporučiť.' },
  { id: 2, user: 'Daniela', date: '15.10.2023', rating: 5, text: 'Hennu na farbenie vlasov používam už roky a objednaný tovar mi vyhovuje momentálne najviac. Hadam najviac pre mňa zavážilo, že mi prestali vlasy padať a henna spolu s indigom celkom dobre zakryjú šediny. Som spokojná.' },
  { id: 3, user: 'Zuzana', date: '05.10.2023', rating: 5, text: 'Zdravé a lesklé vlasy! Prestali vypadávať' },
  { id: 4, user: 'Tatiana', date: '13.02.2023', rating: 4, text: '+ Po opakovanom pouziti jemnejsie vlasy, lesk, kvalita.\n- Na sedive vlasy treba viac x opakovat pouzitie, kedy sa dostavi adekvatny vysledok.' },
];

const StarRating = ({ rating, size = "w-4 h-4" }) => {
  return (
    <div className="flex text-tany-yellow">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${size} ${i < rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

const ProductReviews = () => {
  const averageRating = MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / MOCK_REVIEWS.length;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Hodnotenia</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">{averageRating.toFixed(2)}/5</div>
          <div className="flex justify-center mb-2">
            <StarRating rating={Math.round(averageRating)} size="w-6 h-6" />
          </div>
          <p className="text-gray-500">Počet hodnotení: {MOCK_REVIEWS.length}</p>
        </div>

        <div className="md:col-span-2">
           {/* Visual "Write Review" Form - purely visual as requested */}
           <div className="bg-white border rounded-lg p-6">
             <h4 className="font-semibold text-lg mb-4">Napísať hodnotenie</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <input type="text" placeholder="Meno" className="border p-2 rounded w-full" />
               <input type="email" placeholder="Email" className="border p-2 rounded w-full" />
             </div>
             <textarea placeholder="Text hodnotenia" className="border p-2 rounded w-full h-24 mb-4"></textarea>
             <button className="bg-tany-green text-white px-6 py-2 rounded hover:bg-green-700 transition">
               Pridať hodnotenie
             </button>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {MOCK_REVIEWS.map(review => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="font-semibold text-gray-800">od {review.user}</span>
              </div>
              <span className="text-sm text-gray-500">dňa {review.date}</span>
            </div>
            <p className="text-gray-600 whitespace-pre-line">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      // Optional: Add a toast notification here
      alert("Product added to cart");
    } catch (err) {
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

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
      {/* Breadcrumb-ish Link */}
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-tany-green mb-6 transition-colors text-sm font-medium">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Späť na produkty
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left Column: Image */}
          <div className="flex items-center justify-center bg-white p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-300 text-6xl">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="p-8 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 leading-tight">{product.title}</h1>

            <div className="flex items-center mb-6">
                <StarRating rating={5} />
                <span className="text-sm text-gray-500 ml-2">(25 hodnotení)</span>
            </div>

            <div className="mb-6">
                <span className="text-3xl font-bold text-tany-green">
                    {product.price ? product.price.toFixed(2).replace('.', ',') : '0,00'} €
                </span>
                <span className="text-sm text-gray-500 ml-2">S DPH</span>
            </div>

            <div className="mb-8">
                <div className="flex items-center text-tany-green font-medium mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                    Skladom > 5 ks
                </div>
                <div className="text-sm text-gray-500">
                    Odosielame približne do 24 hodín
                </div>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-8">
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
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="flex-1 bg-tany-green text-white font-bold py-3 px-6 rounded hover:bg-green-700 transition-colors shadow-sm flex justify-center items-center gap-2 uppercase tracking-wide disabled:opacity-70"
                    >
                        {adding ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                Vložiť do košíka
                            </>
                        )}
                    </button>
                </div>
            </div>
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

          <ProductReviews />
      </div>
    </div>
  );
};

export default ProductDetail;
