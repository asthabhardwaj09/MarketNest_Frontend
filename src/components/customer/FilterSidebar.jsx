import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/productService';

const FilterSidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // ═══════════════════════════════════════════════
  // FETCH CATEGORIES FROM BACKEND
  // ═══════════════════════════════════════════════
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      }
    };
    fetchCats();
  }, []);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    console.log('🔍 Filter by category ID:', newCategory);
    onFilterChange({ category: newCategory });
  };

  const handlePriceChange = () => {
    console.log('🔍 Filter by price:', minPrice, '-', maxPrice);
    onFilterChange({ minPrice, maxPrice });
  };

  return (
    <div className="w-64 card h-fit sticky top-20">
      <h3 className="text-xl font-bold mb-4">🔍 Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Category</label>
        <select 
          value={category}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
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
            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 10000)}
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