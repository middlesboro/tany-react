import React from 'react';
import { Link } from 'react-router-dom';
import EmailCampaignList from '../components/EmailCampaignList';

const EmailCampaigns = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Campaigns</h1>
        <Link to="/email-campaigns/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Add Email Campaign
        </Link>
      </div>
      <EmailCampaignList />
    </div>
  );
};

export default EmailCampaigns;
