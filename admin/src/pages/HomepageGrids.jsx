import React from 'react';
import { Link } from 'react-router-dom';
import HomepageGridList from '../components/HomepageGridList';

const HomepageGrids = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Homepage Grids</h1>
        <Link to="/homepage-grids/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Homepage Grid
        </Link>
      </div>
      <HomepageGridList />
    </div>
  );
};

export default HomepageGrids;
