import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search products by name..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
      />
    </div>
  );
};

export default SearchBar;