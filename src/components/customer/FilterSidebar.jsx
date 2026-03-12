import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    onFilterChange({ category: newCategory });
  };

  const handlePriceChange = () => {
    onFilterChange({ minPrice, maxPrice });
  };

  return (
    <div className="w-64 card h-fit">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Category</label>
        <select 
          value={category}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Price Range</label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button 
            onClick={handlePriceChange}
            className="btn-primary w-full"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;