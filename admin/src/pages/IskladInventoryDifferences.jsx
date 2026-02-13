import React, { useEffect, useState } from 'react';
import { getInventoryDifferences } from '../services/iskladAdminService';
import { patchProduct } from '../services/productAdminService';

const IskladInventoryDifferences = () => {
  const [differences, setDifferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchDifferences();
  }, []);

  const fetchDifferences = async () => {
    setLoading(true);
    try {
      const data = await getInventoryDifferences();
      setDifferences(data);
    } catch (error) {
      console.error('Failed to fetch inventory differences', error);
      alert('Failed to fetch inventory differences');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (difference) => {
    const { productId, iskladQuantity } = difference;
    setUpdating(productId);
    try {
      await patchProduct(productId, { quantity: iskladQuantity });

      setDifferences(prev => prev.map(item =>
        item.productId === productId
          ? { ...item, dbQuantity: iskladQuantity }
          : item
      ));

    } catch (error) {
      console.error('Failed to update product quantity', error);
      alert('Failed to update product quantity');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Isklad Inventory Differences</h1>

      {differences.length === 0 ? (
        <p>No differences found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left">Product Name</th>
                <th className="py-2 px-4 border-b text-left">DB Quantity</th>
                <th className="py-2 px-4 border-b text-left">Isklad Quantity</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {differences.map((diff) => (
                <tr key={diff.productId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{diff.productName}</td>
                  <td className="py-2 px-4 border-b font-medium text-red-600">
                    {diff.dbQuantity}
                  </td>
                  <td className="py-2 px-4 border-b font-medium text-green-600">
                    {diff.iskladQuantity}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleUpdate(diff)}
                      disabled={updating === diff.productId || diff.dbQuantity === diff.iskladQuantity}
                      className={`px-3 py-1 rounded text-white ${
                        diff.dbQuantity === diff.iskladQuantity
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {updating === diff.productId ? 'Updating...' : 'Update'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IskladInventoryDifferences;
