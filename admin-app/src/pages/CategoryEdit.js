import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategory, createCategory, updateCategory } from '../services/categoryService';
import CategoryForm from '../components/CategoryForm';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        const data = await getCategory(id);
        setCategory(data);
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateCategory(id, category);
    } else {
      await createCategory(category);
    }
    navigate('/admin/categories');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Category' : 'Create Category'}</h1>
      <CategoryForm category={category} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
};

export default CategoryEdit;
