import React from 'react';
import { Link } from 'react-router-dom';
import EmailTemplateList from '../components/EmailTemplateList';

const EmailTemplates = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Link to="/email-templates/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Add Email Template
        </Link>
      </div>
      <EmailTemplateList />
    </div>
  );
};

export default EmailTemplates;
