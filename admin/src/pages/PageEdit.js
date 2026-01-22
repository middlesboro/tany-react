import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPage, createPage, updatePage } from '../services/pageAdminService';
import PageForm from '../components/PageForm';

const PageEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState({
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    visible: true,
  });

  useEffect(() => {
    if (id) {
      const fetchPageData = async () => {
        const data = await getPage(id);
        setPage(data);
      };
      fetchPageData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setPage((prevPage) => ({ ...prevPage, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updatePage(id, page);
    } else {
      await createPage(page);
    }
    navigate('/pages');
  };

  const handleSaveAndStay = async () => {
    if (id) {
      await updatePage(id, page);
    } else {
      const newPage = await createPage(page);
      navigate(`/pages/${newPage.id}`, { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Page' : 'Create Page'}</h1>
      <PageForm
        page={page}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default PageEdit;
