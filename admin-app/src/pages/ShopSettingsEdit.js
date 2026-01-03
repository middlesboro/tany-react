import React from 'react';
import { useParams } from 'react-router-dom';
import ShopSettingsForm from '../components/ShopSettingsForm';

const ShopSettingsEdit = () => {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Shop Settings' : 'New Shop Settings'}</h1>
      <ShopSettingsForm id={id} />
    </div>
  );
};

export default ShopSettingsEdit;
