import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSupplierInvoice, createSupplierInvoice, updateSupplierInvoice } from '../services/supplierInvoiceAdminService';
import SupplierInvoiceForm from '../components/SupplierInvoiceForm';
import ErrorAlert from '../components/ErrorAlert';

const SupplierInvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState({});

  useEffect(() => {
    if (id) {
      const fetchInvoiceData = async () => {
        try {
          const data = await getSupplierInvoice(id);
          setInvoice(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchInvoiceData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateSupplierInvoice(id, invoice);
      } else {
        await createSupplierInvoice(invoice);
      }
      navigate('/supplier-invoices');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveAndStay = async () => {
    setError(null);
    try {
      if (id) {
        await updateSupplierInvoice(id, invoice);
        alert('Saved successfully!');
      } else {
        const newInvoice = await createSupplierInvoice(invoice);
        navigate(`/supplier-invoices/${newInvoice.id}`, { replace: true });
        alert('Created successfully!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Supplier Invoice' : 'Create Supplier Invoice'}</h1>
      <ErrorAlert message={error} />
      <SupplierInvoiceForm
        invoice={invoice}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default SupplierInvoiceEdit;
