import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmailTemplate, createEmailTemplate, updateEmailTemplate } from '../services/emailTemplateAdminService';
import EmailTemplateForm from '../components/EmailTemplateForm';
import ErrorAlert from '../components/ErrorAlert';

const EmailTemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [emailTemplate, setEmailTemplate] = useState({
    name: '',
    content: '',
    active: false,
  });

  useEffect(() => {
    if (id) {
      const fetchEmailTemplateData = async () => {
        try {
          const data = await getEmailTemplate(id);
          setEmailTemplate(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmailTemplateData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    setEmailTemplate((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e, updatedTemplate = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    const templateToSave = updatedTemplate || emailTemplate;
    try {
      if (id) {
        await updateEmailTemplate(id, templateToSave);
      } else {
        await createEmailTemplate(templateToSave);
      }
      navigate('/email-templates');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveAndStay = async (e, updatedTemplate = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    const templateToSave = updatedTemplate || emailTemplate;
    try {
      if (id) {
        await updateEmailTemplate(id, templateToSave);
      } else {
        const newEmailTemplate = await createEmailTemplate(templateToSave);
        navigate(`/email-templates/${newEmailTemplate.id}`, { replace: true });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Email Template' : 'Add Email Template'}</h1>
      <ErrorAlert message={error} />
      <EmailTemplateForm
        emailTemplate={emailTemplate}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleSaveAndStay={handleSaveAndStay}
      />
    </div>
  );
};

export default EmailTemplateEdit;
