import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../services/pageService';

const PublicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPageBySlug(slug);
        if (data) {
          setPage(data);
        } else {
          setError('Stránka neexistuje.');
        }
      } catch (err) {
        console.error("Failed to fetch page", err);
        setError('Nastala chyba pri načítaní stránky.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Načítavam...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Chyba</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {page && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{page.title}</h1>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.description }}
          />
        </>
      )}
    </div>
  );
};

export default PublicPage;
