import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getPageBySlug } from '../services/pageService';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import SeoHead from '../components/SeoHead';
import NotFound from './NotFound';
import { restoreIframes } from '../utils/videoUtils';

const PublicPage = () => {
  const { slug } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();
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
          setBreadcrumbs([
            { label: 'Domov', path: '/' },
            { label: data.title, path: null }
          ]);
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
    // Check if the slug matches the legacy category pattern: {id}-{slug}
    // If so, redirect to /kategoria/{slug}
    const legacyMatch = slug?.match(/^(\d+)-(.*)$/);
    if (legacyMatch) {
      return <Navigate to={`/kategoria/${legacyMatch[2]}`} replace />;
    }
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      {page && (
        <>
          <SeoHead
            title={page.metaTitle || page.title}
            description={page.metaDescription}
          />
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{page.title}</h1>
          <div
            className="prose text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.description ? restoreIframes(page.description).replace(/&nbsp;|\u00A0/g, ' ') : '' }}
          />
        </>
      )}
    </div>
  );
};

export default PublicPage;
