import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getFilterParameterValue, createFilterParameterValue, updateFilterParameterValue } from '../services/filterParameterValueAdminService';
import { getFilterParameters } from '../services/filterParameterAdminService';
import { getProductsByFilterValue, getProduct, patchProduct } from '../services/productAdminService';
import FilterParameterValueForm from '../components/FilterParameterValueForm';
import AdminProductSearch from '../components/AdminProductSearch';

const FilterParameterValueEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const [filterParameterValue, setFilterParameterValue] = useState({
    name: '',
    active: true,
    filterParameterId: location.state?.filterParameterId || ''
  });
  const [filterParameters, setFilterParameters] = useState([]);
  const [assignedProducts, setAssignedProducts] = useState([]);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const data = await getFilterParameters(0, 'name,asc', 1000);
        setFilterParameters(data.content || []);
      } catch (error) {
        console.error("Failed to fetch filter parameters", error);
      }
    };
    fetchParameters();
  }, []);

  const fetchAssignedProducts = async () => {
    if (!id) return;
    try {
      const data = await getProductsByFilterValue(id);
      setAssignedProducts(data);
    } catch (error) {
      console.error("Failed to fetch assigned products", error);
    }
  };

  useEffect(() => {
    if (isEdit) {
      const fetchValue = async () => {
        try {
          const data = await getFilterParameterValue(id);
          setFilterParameterValue(data);
        } catch (error) {
          console.error("Failed to fetch filter parameter value", error);
        }
      };
      fetchValue();
      fetchAssignedProducts();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFilterParameterValue((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateFilterParameterValue(id, filterParameterValue);
      } else {
        await createFilterParameterValue(filterParameterValue);
      }
      navigate('/filter-parameter-values');
    } catch (error) {
      console.error('Failed to save filter parameter value', error);
      alert('Failed to save filter parameter value');
    }
  };

  const handleAssignProduct = async (product) => {
    try {
      const fullProduct = await getProduct(product.id);
      const currentParams = fullProduct.productFilterParameters || [];

      const alreadyAssigned = currentParams.some(p => p.filterParameterValueId === id);
      if (alreadyAssigned) {
        alert("Product already assigned to this value.");
        return;
      }

      if (!filterParameterValue.filterParameterId) {
          alert("Filter parameter ID missing on value.");
          return;
      }

      const newParam = {
          filterParameterId: filterParameterValue.filterParameterId,
          filterParameterValueId: id
      };

      const updatedParams = [...currentParams, newParam];

      await patchProduct(product.id, { productFilterParameters: updatedParams });

      fetchAssignedProducts();
    } catch (error) {
      console.error("Failed to assign product", error);
      alert("Failed to assign product");
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this product assignment?")) return;
    try {
        const fullProduct = await getProduct(productId);
        const currentParams = fullProduct.productFilterParameters || [];
        const updatedParams = currentParams.filter(p => p.filterParameterValueId !== id);

        await patchProduct(productId, { productFilterParameters: updatedParams });
        fetchAssignedProducts();
    } catch (error) {
        console.error("Failed to remove assignment", error);
        alert("Failed to remove assignment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Filter Parameter Value' : 'Create Filter Parameter Value'}</h2>
      <FilterParameterValueForm
        filterParameterValue={filterParameterValue}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        filterParameters={filterParameters}
      />

      {isEdit && (
        <div className="mt-8 border-t pt-8">
          <h3 className="text-xl font-bold mb-4">Assigned Products</h3>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Assign new product</label>
            <AdminProductSearch onSelect={handleAssignProduct} />
          </div>

          {assignedProducts.length > 0 ? (
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU/ID</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.images && product.images.length > 0 ? (
                              <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku || product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleRemoveProduct(product.id)} className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No products assigned to this value yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterParameterValueEdit;
