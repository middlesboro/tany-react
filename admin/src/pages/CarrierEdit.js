import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarrier, createCarrier, updateCarrier } from '../services/carrierAdminService';
import CarrierImageManager from '../components/CarrierImageManager';

const CarrierEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carrier, setCarrier] = useState({
    name: '',
    description: '',
    image: '',
    order: 0,
    type: 'PACKETA',
    ranges: [],
  });

  const [newRange, setNewRange] = useState({ price: '', weightFrom: '', weightTo: '' });

  useEffect(() => {
    if (id) {
      const fetchCarrierData = async () => {
        const data = await getCarrier(id);
        setCarrier(data);
      };
      fetchCarrierData();
    }
  }, [id]);

  const refreshImage = async () => {
    if (id) {
      const data = await getCarrier(id);
      setCarrier(prev => ({ ...prev, image: data.image }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarrier({ ...carrier, [name]: value });
  };

  const handleAddRange = () => {
    if (newRange.price && newRange.weightFrom && newRange.weightTo) {
      setCarrier({
        ...carrier,
        ranges: [...(carrier.ranges || []), {
            price: Number(newRange.price),
            weightFrom: Number(newRange.weightFrom),
            weightTo: Number(newRange.weightTo)
        }]
      });
      setNewRange({ price: '', weightFrom: '', weightTo: '' });
    }
  };

  const handleRemoveRange = (index) => {
    const updatedRanges = [...carrier.ranges];
    updatedRanges.splice(index, 1);
    setCarrier({ ...carrier, ranges: updatedRanges });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (id) {
            await updateCarrier(id, carrier);
        } else {
            await createCarrier(carrier);
        }
        navigate('/carriers');
    } catch (error) {
        console.error("Error saving carrier:", error);
        alert("Error saving carrier");
    }
  };

  const handleSaveAndStay = async () => {
    try {
        if (id) {
            await updateCarrier(id, carrier);
        } else {
            const newCarrier = await createCarrier(carrier);
            navigate(`/carriers/${newCarrier.id}`, { replace: true });
        }
    } catch (error) {
        console.error("Error saving carrier:", error);
        alert("Error saving carrier");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Carrier' : 'Create Carrier'}</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={carrier.name || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={carrier.description || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
            Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={carrier.order || 0}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={carrier.type || 'PACKETA'}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="PACKETA">Packeta</option>
            <option value="COURIER">Courier</option>
          </select>
        </div>

        <div className="mb-4 border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Price Ranges</h3>
            {carrier.ranges && carrier.ranges.length > 0 && (
                <ul className="mb-4">
                    {carrier.ranges.map((range, index) => (
                        <li key={index} className="flex items-center mb-2">
                            <span className="mr-2">Price: {range.price}, Weight: {range.weightFrom} - {range.weightTo}</span>
                            <button type="button" onClick={() => handleRemoveRange(index)} className="text-red-500 hover:text-red-700">Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="Price"
                    value={newRange.price}
                    onChange={(e) => setNewRange({...newRange, price: e.target.value})}
                    className="border rounded p-1"
                />
                <input
                    type="number"
                    placeholder="Weight From"
                    value={newRange.weightFrom}
                    onChange={(e) => setNewRange({...newRange, weightFrom: e.target.value})}
                    className="border rounded p-1"
                />
                <input
                    type="number"
                    placeholder="Weight To"
                    value={newRange.weightTo}
                    onChange={(e) => setNewRange({...newRange, weightTo: e.target.value})}
                    className="border rounded p-1"
                />
                <button type="button" onClick={handleAddRange} className="bg-blue-500 text-white px-3 py-1 rounded">Add Range</button>
            </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSaveAndStay}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save and stay
          </button>
          <button
            type="button"
            onClick={() => navigate('/carriers')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
      {id && (
        <CarrierImageManager
          carrierId={id}
          image={carrier.image}
          onUploadSuccess={refreshImage}
        />
      )}
    </div>
  );
};

export default CarrierEdit;
