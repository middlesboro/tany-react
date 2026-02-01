import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategory, createCategory, updateCategory, getCategories } from '../services/categoryAdminService';
import CategoryForm from '../components/CategoryForm';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState({
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    parentId: '',
    defaultCategory: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories(0, 'title,asc', 1000);
      setAllCategories(data.content);
    };
    fetchCategories();

    if (id) {
      const fetchCategory = async () => {
        const data = await getCategory(id);
        setCategory(data);
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory({ ...category, [name]: type === 'checkbox' ? checked : value });
  };

  const handleParentChange = (parentId) => {
    setCategory((prevCategory) => ({ ...prevCategory, parentId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateCategory(id, category);
    } else {
      await createCategory(category);
    }
    navigate('/categories');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Category' : 'Create Category'}</h1>
      <CategoryForm
        category={category}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        categories={allCategories.filter((c) => c.id !== id)}
        handleParentChange={handleParentChange}
      />
    </div>
  );
};

export default CategoryEdit;
