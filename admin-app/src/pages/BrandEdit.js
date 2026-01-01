import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBrand, createBrand, updateBrand } from '../services/brandAdminService';
import BrandForm from '../components/BrandForm';
import BrandImageManager from '../components/BrandImageManager';

const BrandEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState({
    name: '',
    image: '',
  });

  useEffect(() => {
    if (id) {
      const fetchBrandData = async () => {
        const data = await getBrand(id);
        setBrand(data);
      };
      fetchBrandData();
    }
  }, [id]);

  const refreshImage = async () => {
    if (id) {
      const data = await getBrand(id);
      setBrand(prevBrand => ({ ...prevBrand, image: data.image }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateBrand(id, brand);
    } else {
      await createBrand(brand);
    }
    navigate('/admin/brands');
  };

  const handleSaveAndStay = async () => {
    if (id) {
      await updateBrand(id, brand);
    } else {
      const newBrand = await createBrand(brand);
      navigate(`/admin/brands/${newBrand.id}`, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Brand' : 'Create Brand'}</h1>
      <BrandForm
        brand={brand}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
      {id && (
        <BrandImageManager
          brandId={id}
          image={brand.image}
          onUploadSuccess={refreshImage}
        />
      )}
    </div>
  );
};

export default BrandEdit;
