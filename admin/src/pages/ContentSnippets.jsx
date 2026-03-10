import React from 'react';
import { Link } from 'react-router-dom';
import ContentSnippetList from '../components/ContentSnippetList';

const ContentSnippets = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Content Snippets</h1>
        <Link to="/content-snippets/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Content Snippet
        </Link>
      </div>
      <ContentSnippetList />
    </div>
  );
};

export default ContentSnippets;
