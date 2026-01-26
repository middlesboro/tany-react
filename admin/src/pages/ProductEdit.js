import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../services/productAdminService';
import { getBrands } from '../services/brandAdminService';
import { getSuppliers } from '../services/supplierAdminService';
import { getCategories } from '../services/categoryAdminService';
import { getFilterParameters } from '../services/filterParameterAdminService';
import { getFilterParameterValues } from '../services/filterParameterValueAdminService';
import { getAllProductLabels } from '../services/productLabelAdminService';
import ProductForm from '../components/ProductForm';
import ProductImageManager from '../components/ProductImageManager';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('main');
  const [product, setProduct] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    quantity: '',
    images: [],
    brandId: '',
    supplierId: '',
    categoryIds: [],
    productFilterParameters: [],
    productLabelIds: [],
    ean: '',
    productCode: '',
    weight: '',
    active: true,
    priceWithoutVat: '',
    discountPriceWithoutVat: '',
    wholesalePrice: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterParameters, setFilterParameters] = useState([]);
  const [filterParameterValues, setFilterParameterValues] = useState([]);
  const [productLabels, setProductLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const brandsData = await getBrands(0, 'name,asc', 1000);
      setBrands(brandsData.content || []);
      const suppliersData = await getSuppliers(0, 'name,asc', 1000);
      setSuppliers(suppliersData.content || []);
      const categoriesData = await getCategories(0, 'title,asc', 1000);
      // Map categories to have 'name' property for consistency with SearchSelect/MultiSearchSelect
      const mappedCategories = (categoriesData.content || []).map(c => ({
        ...c,
        name: c.title
      }));
      setCategories(mappedCategories);
      const filterParametersData = await getFilterParameters(0, 'name,asc', 1000);
      setFilterParameters(filterParametersData.content || []);
      const filterParameterValuesData = await getFilterParameterValues(0, 'name,asc', 1000);
      setFilterParameterValues(filterParameterValuesData.content || []);
      const productLabelsData = await getAllProductLabels();
      setProductLabels((productLabelsData || []).map(l => ({...l, name: l.title})));
    };
    fetchData();

    if (id) {
      const fetchProductData = async () => {
        const data = await getProduct(id);
        setProduct({
          ...data,
          images: data.images || [],
          brandId: data.brandId || '',
          supplierId: data.supplierId || '',
          categoryIds: data.categoryIds || [],
          productFilterParameters: data.productFilterParameters || [],
          productLabelIds: data.productLabelIds || [],
          ean: data.ean || '',
          productCode: data.productCode || '',
          weight: data.weight || '',
          active: data.active !== undefined ? data.active : true,
          priceWithoutVat: data.priceWithoutVat || '',
          discountPriceWithoutVat: data.discountPriceWithoutVat || '',
          wholesalePrice: data.wholesalePrice || '',
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
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
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleImagesChange = (newImages) => {
    setProduct(prevProduct => ({ ...prevProduct, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateProduct(id, product);
    } else {
      await createProduct(product);
    }

    navigate('/products');
  };

  const handleSaveAndStay = async () => {
    if (id) {
      await updateProduct(id, product);
    } else {
      const newProduct = await createProduct(product);
      navigate(`/products/${newProduct.id}`, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Create Product'}</h1>
      <ProductForm
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        product={product}
        brands={brands}
        suppliers={suppliers}
        categories={categories}
        filterParameters={filterParameters}
        filterParameterValues={filterParameterValues}
        productLabels={productLabels}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
      {activeTab === 'main' && id && (
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
