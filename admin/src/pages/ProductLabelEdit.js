import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductLabelForm from '../components/ProductLabelForm';
import { getProductLabel, createProductLabel, updateProductLabel } from '../services/productLabelAdminService';

const ProductLabelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productLabel, setProductLabel] = useState({
    title: '',
    color: '#000000',
    backgroundColor: '#ffffff',
    position: 'TOP_RIGHT',
    active: true
  });

  useEffect(() => {
    if (id) {
      const fetchProductLabel = async () => {
        const data = await getProductLabel(id);
        setProductLabel(data);
      };
      fetchProductLabel();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductLabel((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateProductLabel(id, productLabel);
    } else {
      await createProductLabel(productLabel);
    }
    navigate('/product-labels');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Product Label' : 'Add Product Label'}</h2>
      <ProductLabelForm
        productLabel={productLabel}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductLabelEdit;
