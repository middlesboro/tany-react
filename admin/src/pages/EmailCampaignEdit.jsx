import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmailCampaign, createEmailCampaign, updateEmailCampaign } from '../services/emailCampaignAdminService';
import EmailCampaignForm from '../components/EmailCampaignForm';
import ErrorAlert from '../components/ErrorAlert';

const EmailCampaignEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [emailCampaign, setEmailCampaign] = useState({
    name: '',
    templateId: '',
    active: false,
    tags: [],
    batchSize: 100
  });

  useEffect(() => {
    if (id) {
      const fetchEmailCampaignData = async () => {
        try {
          const data = await getEmailCampaign(id);
          setEmailCampaign(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchEmailCampaignData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'batchSize') {
      val = parseInt(val, 10) || 0;
    }

    setEmailCampaign((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    try {
      if (id) {
        await updateEmailCampaign(id, emailCampaign);
      } else {
        await createEmailCampaign(emailCampaign);
      }
      navigate('/email-campaigns');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveAndStay = async () => {
    setError(null);
    try {
      if (id) {
        await updateEmailCampaign(id, emailCampaign);
      } else {
        const newEmailCampaign = await createEmailCampaign(emailCampaign);
        navigate(`/email-campaigns/${newEmailCampaign.id}`, { replace: true });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Email Campaign' : 'Add Email Campaign'}</h1>
      <ErrorAlert message={error} />
      <EmailCampaignForm
        emailCampaign={emailCampaign}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default EmailCampaignEdit;
