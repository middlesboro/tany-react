import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../services/productAdminService';
import { getBrands } from '../services/brandAdminService';
import { getSuppliers } from '../services/supplierAdminService';
import ProductForm from '../components/ProductForm';
import ProductImageManager from '../components/ProductImageManager';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    quantity: '',
    images: [],
    brandId: '',
    supplierId: '',
  });

  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchBrandsAndSuppliers = async () => {
      const brandsData = await getBrands(0, 'name,asc', 1000);
      setBrands(brandsData.content);
      const suppliersData = await getSuppliers(0, 'name,asc', 1000);
      setSuppliers(suppliersData.content);
    };
    fetchBrandsAndSuppliers();

    if (id) {
      const fetchProductData = async () => {
        const data = await getProduct(id);
        setProduct({
          ...data,
          images: data.images || [],
          brandId: data.brandId || '',
          supplierId: data.supplierId || ''
        });
      };
      fetchProductData();
    }
  }, [id]);

  const refreshImages = async () => {
    if (id) {
      const data = await getProduct(id);
      setProduct(prevProduct => ({ ...prevProduct, images: data.images || [] }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImagesChange = (newImages) => {
    setProduct({ ...product, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateProduct(id, product);
    } else {
      await createProduct(product);
    }
    navigate('/admin/products');
  };

  const handleSaveAndStay = async () => {
    if (id) {
      await updateProduct(id, product);
    } else {
      const newProduct = await createProduct(product);
      navigate(`/admin/products/${newProduct.id}`, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Create Product'}</h1>
      <ProductForm
        product={product}
        brands={brands}
        suppliers={suppliers}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
      {id && (
        <ProductImageManager
          productId={id}
          images={product.images}
          onImagesChange={handleImagesChange}
          onUploadSuccess={refreshImages}
        />
      )}
    </div>
  );
};

export default ProductEdit;
