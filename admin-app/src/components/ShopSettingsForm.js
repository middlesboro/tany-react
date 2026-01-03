import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShopSettings, getShopSetting, updateShopSettings } from '../services/shopSettingsService';

const ShopSettingsForm = ({ id }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bankName: '',
    bankAccount: '',
    bankBic: '',
    shopStreet: '',
    shopZip: '',
    shopCity: '',
    shopPhoneNumber: '',
    shopEmail: '',
    organizationName: '',
    ico: '',
    dic: '',
    vatNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const data = await getShopSetting(id);
        // Ensure all fields are present to control the inputs
        setFormData({
          bankName: data.bankName || '',
          bankAccount: data.bankAccount || '',
          bankBic: data.bankBic || '',
          shopStreet: data.shopStreet || '',
          shopZip: data.shopZip || '',
          shopCity: data.shopCity || '',
          shopPhoneNumber: data.shopPhoneNumber || '',
          shopEmail: data.shopEmail || '',
          organizationName: data.organizationName || '',
          ico: data.ico || '',
          dic: data.dic || '',
          vatNumber: data.vatNumber || '',
        });
      } catch (err) {
        setError('Failed to fetch shop setting');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSetting();
    }
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await updateShopSettings(id, formData);
        alert('Settings updated successfully');
      } else {
        const newSetting = await createShopSettings(formData);
        alert('Settings created successfully');
        navigate(`/admin/shop-settings/${newSetting.id}`, { replace: true });
      }
    } catch (err) {
      setError('Failed to save shop settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id && !formData.organizationName) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organizationName">
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              id="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopEmail">
              Shop Email
            </label>
            <input
              type="email"
              name="shopEmail"
              id="shopEmail"
              value={formData.shopEmail}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopPhoneNumber">
              Shop Phone Number
            </label>
            <input
              type="text"
              name="shopPhoneNumber"
              id="shopPhoneNumber"
              value={formData.shopPhoneNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopStreet">
              Shop Street
            </label>
            <input
              type="text"
              name="shopStreet"
              id="shopStreet"
              value={formData.shopStreet}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopCity">
              Shop City
            </label>
            <input
              type="text"
              name="shopCity"
              id="shopCity"
              value={formData.shopCity}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopZip">
              Shop Zip
            </label>
            <input
              type="text"
              name="shopZip"
              id="shopZip"
              value={formData.shopZip}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankName">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              id="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankAccount">
              Bank Account
            </label>
            <input
              type="text"
              name="bankAccount"
              id="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankBic">
              Bank BIC
            </label>
            <input
              type="text"
              name="bankBic"
              id="bankBic"
              value={formData.bankBic}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ico">
              ICO
            </label>
            <input
              type="text"
              name="ico"
              id="ico"
              value={formData.ico}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dic">
              DIC
            </label>
            <input
              type="text"
              name="dic"
              id="dic"
              value={formData.dic}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vatNumber">
              VAT Number
            </label>
            <input
              type="text"
              name="vatNumber"
              id="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Settings' : 'Create Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopSettingsForm;
