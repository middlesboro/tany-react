import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategory, createCategory, updateCategory, getCategories } from '../services/categoryAdminService';
import { getFilterParameters } from '../services/filterParameterAdminService';
import CategoryForm from '../components/CategoryForm';
import ErrorAlert from '../components/ErrorAlert';
import { restoreIframes } from '../utils/videoUtils';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [allFilterParameters, setAllFilterParameters] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState({
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    parentId: '',
    defaultCategory: false,
    active: true,
    visible: true,
    filterParameters: [],
    excludedFilterParameters: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories(0, 'title,asc', 1000);
      setAllCategories(data.content);
    };
    fetchCategories();

    const fetchFilterParameters = async () => {
      const data = await getFilterParameters(0, 'name,asc', 1000);
      setAllFilterParameters(data.content);
    };
    fetchFilterParameters();

    if (id) {
      const fetchCategory = async () => {
        const data = await getCategory(id);
        if (data && data.description) {
            data.description = restoreIframes(data.description);
        }
        setCategory({
          ...data,
          active: data.active !== undefined ? data.active : true,
          visible: data.visible !== undefined ? data.visible : true,
          filterParameters: data.filterParameters || [],
          excludedFilterParameters: data.excludedFilterParameters || [],
        });
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleParentChange = (parentId) => {
    setCategory((prevCategory) => ({ ...prevCategory, parentId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateCategory(id, category);
      } else {
        await createCategory(category);
      }
      navigate('/categories');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Category' : 'Create Category'}</h1>
      <ErrorAlert message={error} />
      <CategoryForm
        category={category}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        categories={allCategories.filter((c) => c.id !== id)}
        handleParentChange={handleParentChange}
        filterParameters={allFilterParameters}
      />
    </div>
  );
};

export default CategoryEdit;
