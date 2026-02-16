import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSupplier, createSupplier, updateSupplier } from '../services/supplierAdminService';
import SupplierForm from '../components/SupplierForm';
import ErrorAlert from '../components/ErrorAlert';

const SupplierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [supplier, setSupplier] = useState({
    name: '',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (id) {
      const fetchSupplierData = async () => {
        const data = await getSupplier(id);
        setSupplier(data);
      };
      fetchSupplierData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateSupplier(id, supplier);
      } else {
        await createSupplier(supplier);
      }
      navigate('/suppliers');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveAndStay = async () => {
    setError(null);
    try {
      if (id) {
        await updateSupplier(id, supplier);
      } else {
        const newSupplier = await createSupplier(supplier);
        navigate(`/suppliers/${newSupplier.id}`, { replace: true });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Supplier' : 'Create Supplier'}</h1>
      <ErrorAlert message={error} />
      <SupplierForm
        supplier={supplier}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default SupplierEdit;
