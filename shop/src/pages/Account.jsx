import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomer, updateCustomer } from '../services/customerService';
import { getWishlist } from '../services/wishlistService';
import { removeToken } from '../services/authService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import ProductCard from '../components/ProductCard';
import CustomerOrderList from '../components/CustomerOrderList';
import CustomerOrderDetail from '../components/CustomerOrderDetail';
import usePageMeta from '../hooks/usePageMeta';

const Account = () => {
  usePageMeta("Môj účet", "Správa vášho účtu a objednávok.");
  const navigate = useNavigate();
  const { tab, orderId } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();

  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    invoiceAddress: { street: '', city: '', zip: '' },
    deliveryAddress: { street: '', city: '', zip: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Derived state
  const activeTab = tab === 'personal-data' ? 'profile' :
                    tab === 'wishlist' ? 'wishlist' :
                    tab === 'orders' || orderId ? 'orders' : 'profile';

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Domov', path: '/' },
      { label: 'Môj účet', path: null }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomer();
        // Ensure addresses are not null
        const invoiceAddress = data.invoiceAddress || { street: '', city: '', zip: '' };
        const deliveryAddress = data.deliveryAddress || { street: '', city: '', zip: '' };
        setCustomer({ ...data, invoiceAddress, deliveryAddress });
      } catch (err) {
        setError('Failed to load customer data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, []);

  useEffect(() => {
    if (activeTab === 'wishlist') {
      const fetchWishlist = async () => {
        setWishlistLoading(true);
        try {
          const data = await getWishlist();
          // Assuming the backend returns a Page<ProductClientDto>
          // data.content contains the list of products
          setWishlist(data.content || []);
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
        } finally {
          setWishlistLoading(false);
        }
      };
      fetchWishlist();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomer((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCustomer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await updateCustomer(customer);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Môj účet</h1>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Odhlásiť sa
        </button>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          <li className="mr-2">
            <button
              onClick={() => navigate('/account/personal-data')}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'profile'
                  ? 'text-tany-green border-tany-green'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              Osobné údaje
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => navigate('/account/wishlist')}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'wishlist'
                  ? 'text-tany-green border-tany-green'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              Obľúbené produkty
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => navigate('/account/orders')}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'orders'
                  ? 'text-tany-green border-tany-green'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              Moje objednávky
            </button>
          </li>
        </ul>
      </div>

      {activeTab === 'profile' && (
        <>
          {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Osobné údaje</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                    Meno
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="firstname"
                    type="text"
                    name="firstname"
                    value={customer.firstname || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                    Priezvisko
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="lastname"
                    type="text"
                    name="lastname"
                    value={customer.lastname || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                    id="email"
                    type="email"
                    name="email"
                    value={customer.email || ''}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Telefón
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="text"
                    name="phone"
                    value={customer.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Fakturačná adresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="invoiceAddress.street">
                    Ulica a číslo
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="invoiceAddress.street"
                    type="text"
                    name="invoiceAddress.street"
                    value={customer.invoiceAddress.street || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="invoiceAddress.city">
                    Mesto
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="invoiceAddress.city"
                    type="text"
                    name="invoiceAddress.city"
                    value={customer.invoiceAddress.city || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="invoiceAddress.zip">
                    PSČ
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="invoiceAddress.zip"
                    type="text"
                    name="invoiceAddress.zip"
                    value={customer.invoiceAddress.zip || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="invoiceAddress.country">
                    Krajina
                  </label>
                  <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="invoiceAddress.country"
                      type="text"
                      name="invoiceAddress.country"
                      value={customer.invoiceAddress.country || ''}
                      readOnly
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Dodacia adresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryAddress.street">
                    Ulica a číslo
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="deliveryAddress.street"
                    type="text"
                    name="deliveryAddress.street"
                    value={customer.deliveryAddress.street || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryAddress.city">
                    Mesto
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="deliveryAddress.city"
                    type="text"
                    name="deliveryAddress.city"
                    value={customer.deliveryAddress.city || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryAddress.zip">
                    PSČ
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="deliveryAddress.zip"
                    type="text"
                    name="deliveryAddress.zip"
                    value={customer.deliveryAddress.zip || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryAddress.country">
                    Krajina
                  </label>
                  <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="deliveryAddress.country"
                      type="text"
                      name="deliveryAddress.country"
                      value={customer.deliveryAddress.country || ''}
                      readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-tany-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Uložiť zmeny
              </button>
            </div>
          </form>
        </>
      )}

      {activeTab === 'wishlist' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
           {wishlistLoading ? (
             <div className="text-center py-8">Načítavam obľúbené produkty...</div>
           ) : wishlist.length === 0 ? (
             <div className="text-center py-8 text-gray-500">
               Váš zoznam prianí je prázdny.
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
             </div>
           )}
        </div>
      )}

      {activeTab === 'orders' && (
        <>
          {orderId ? (
            <CustomerOrderDetail orderId={orderId} onBack={() => navigate('/account/orders')} />
          ) : (
            <CustomerOrderList onOrderSelect={(id) => navigate(`/account/orders/${id}`)} />
          )}
        </>
      )}
    </div>
  );
};

export default Account;
