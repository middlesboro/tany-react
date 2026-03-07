import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrands } from '../services/brandAdminService';
import { getSuppliers } from '../services/supplierAdminService';
import { importProductFromUrl } from '../services/productAdminService';
import SearchSelect from '../components/SearchSelect';
import ErrorAlert from '../components/ErrorAlert';

const ProductImport = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [brandId, setBrandId] = useState('');
  const [supplierId, setSupplierId] = useState('');

  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsData = await getBrands(0, 'name,asc', 1000);
        setBrands(brandsData.content || []);
        const suppliersData = await getSuppliers(0, 'name,asc', 1000);
        setSuppliers(suppliersData.content || []);
      } catch (err) {
        setError('Failed to load brands and suppliers.');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!url || !brandId || !supplierId) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const importedProduct = await importProductFromUrl({ url, brandId, supplierId });
      navigate('/products/new', { state: { importedProduct } });
    } catch (err) {
      setError(err.message || 'Failed to import product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Import Product From URL</h1>
      <ErrorAlert message={error} />

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-ps-primary"
              placeholder="https://..."
              required
            />
          </div>

          <SearchSelect
            label="Brand"
            options={brands}
            value={brandId}
            onChange={setBrandId}
            placeholder="Select Brand"
          />

          <SearchSelect
            label="Supplier"
            options={suppliers}
            value={supplierId}
            onChange={setSupplierId}
            placeholder="Select Supplier"
          />

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Importing...' : 'Import'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="ml-4 text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductImport;
