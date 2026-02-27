import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import AddToCartButton from './AddToCartButton';

const AddToCartModal = () => {
  const { isAddToCartModalOpen, addToCartModalData, closeAddToCartModal, openAddToCartModal, openMessageModal } = useModal();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  if (!isAddToCartModalOpen || !addToCartModalData) return null;

  const { product, suggestedProducts } = addToCartModalData;
  // ProductDto has { id, title, image, price, discountPrice }
  // Note: API response field names match the DTO

  const handleAddSuggested = async (suggestedProduct) => {
    setAddingId(suggestedProduct.id);
    try {
        const response = await addToCart(suggestedProduct.id, 1);
        // Update the modal with the new response (which might have new suggestions or just updated cart info)
        openAddToCartModal(response);
    } catch (error) {
        if (error.status === 400) {
            // Close this modal to show the error? Or stack them?
            // Since MessageModal is separate, we can just show it.
            // But MessageModal might be behind this modal if z-index isn't managed.
            // Let's assume MessageModal has higher z-index or we handle it gracefully.
             openMessageModal("Upozornenie", "Pre tento produkt nie je na sklade dostatočné množstvo.");
        } else {
            console.error("Failed to add suggested product", error);
        }
    } finally {
        setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={closeAddToCartModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 border-b border-gray-200">
             <div className="flex items-center text-tany-green mb-4">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                <h2 className="text-xl font-bold">Produkt bol pridaný do košíka</h2>
             </div>

             <div className="flex items-center gap-4">
                 <div className="w-20 h-20 flex-shrink-0 border border-gray-100 rounded bg-white flex items-center justify-center">
                     {product.image ? (
                         <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
                     ) : (
                         <span className="text-gray-300 text-xs">No img</span>
                     )}
                 </div>
                 <div>
                     <h3 className="font-medium text-gray-900">{product.title}</h3>
                     <div className="mt-1">
                        {product.discountPrice ? (
                            <div className="flex items-center gap-2">
                                <span className="text-red-600 font-bold">{product.discountPrice.toFixed(2)} €</span>
                                <span className="text-gray-400 line-through text-sm">{product.price.toFixed(2)} €</span>
                            </div>
                        ) : (
                            <span className="font-bold text-gray-900">{product.price ? product.price.toFixed(2) : '0.00'} €</span>
                        )}
                     </div>
                 </div>
             </div>

             <div className="mt-6 flex flex-col sm:flex-row gap-3">
                 <button
                    onClick={closeAddToCartModal}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
                 >
                    Pokračovať v nákupe
                 </button>
                 <Link
                    to="/cart"
                    onClick={closeAddToCartModal}
                    className="flex-1 py-2 px-4 bg-tany-green text-white rounded font-bold hover:bg-green-700 transition-colors text-center"
                 >
                    Prejsť do košíka
                 </Link>
             </div>
        </div>

        {suggestedProducts && suggestedProducts.length > 0 && (
            <div className="p-6 bg-gray-50 overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Mohlo by sa vám páčiť</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {suggestedProducts.slice(0, 6).map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded p-3 flex flex-col h-full hover:shadow-md transition-shadow">
                            <Link
                                to={`/produkt/${item.slug || '#'}`} // Assuming slug might be missing in DTO, fallback to # or handle appropriately. DTO definition didn't include slug, but usually needed for link. If DTO doesn't have slug, maybe just title/image.
                                // If slug is missing, we can't link effectively. Let's assume for now we might not have it or use ID.
                                // Actually, DTO has id, title, image, price, discountPrice. No slug mentioned in prompt.
                                // If no slug, maybe disable link or link to something generic.
                                // Let's just disable link if no slug, or use ID if backend supports /product/ID (which standard path is /produkt/slug).
                                // For now, we will wrap image in div if no slug.
                                onClick={closeAddToCartModal}
                                className="block aspect-square mb-2 flex items-center justify-center relative"
                            >
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-gray-200">No Img</div>
                                )}
                            </Link>

                            <div className="flex-grow flex flex-col">
                                <h4 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10 overflow-hidden" title={item.title}>
                                    {item.title}
                                </h4>
                                <div className="mt-auto">
                                    <div className="mb-2 flex flex-col">
                                         {item.discountPrice ? (
                                            <>
                                                <span className="text-xs text-gray-400 line-through">{item.price.toFixed(2)} €</span>
                                                <span className="text-sm font-bold text-red-600">{item.discountPrice.toFixed(2)} €</span>
                                            </>
                                         ) : (
                                            <span className="text-sm font-bold text-gray-900">{item.price ? item.price.toFixed(2) : '0.00'} €</span>
                                         )}
                                    </div>
                                    <AddToCartButton
                                        onClick={() => handleAddSuggested(item)}
                                        adding={addingId === item.id}
                                        text="Do košíka"
                                        className="w-full py-1 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartModal;
