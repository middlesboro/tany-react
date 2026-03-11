import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentSnippet, createContentSnippet, updateContentSnippet } from '../services/contentSnippetAdminService';
import ContentSnippetForm from '../components/ContentSnippetForm';
import ErrorAlert from '../components/ErrorAlert';

const ContentSnippetEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [contentSnippet, setContentSnippet] = useState({
    name: '',
    placeholder: '',
    content: '',
  });

  useEffect(() => {
    if (id) {
      const fetchContentSnippetData = async () => {
        try {
          const data = await getContentSnippet(id);
          setContentSnippet(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchContentSnippetData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContentSnippet((prevContentSnippet) => ({ ...prevContentSnippet, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateContentSnippet(id, contentSnippet);
      } else {
        await createContentSnippet(contentSnippet);
      }
      navigate('/content-snippets');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveAndStay = async () => {
    setError(null);
    try {
      if (id) {
        await updateContentSnippet(id, contentSnippet);
      } else {
        const newContentSnippet = await createContentSnippet(contentSnippet);
        navigate(`/content-snippets/${newContentSnippet.id}`, { replace: true });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Content Snippet' : 'Create Content Snippet'}</h1>
      <ErrorAlert message={error} />
      <ContentSnippetForm
        contentSnippet={contentSnippet}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default ContentSnippetEdit;
