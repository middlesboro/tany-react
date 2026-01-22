import React, { useState, useEffect, useRef } from 'react';

const MultiSearchSelect = ({ label, options, value = [], onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Filter options: exclude already selected ones and match search term
  const filteredOptions = options
    .filter(option => !value.includes(option.id))
    .filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelect = (option) => {
    onChange([...value, option.id]);
    setSearchTerm('');
    // Keep open to allow selecting multiple
    // setIsOpen(false);
  };

  const handleRemove = (idToRemove) => {
    onChange(value.filter(id => id !== idToRemove));
  };

  const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
      setIsOpen(true);
  }

  const getOptionName = (id) => {
      const opt = options.find(o => o.id === id);
      return opt ? opt.name : id;
  }

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <label className="block text-gray-700">{label}</label>

      {/* Selected Items Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
          {value.map(id => (
              <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm">
                  {getOptionName(id)}
                  <button
                    type="button"
                    onClick={() => handleRemove(id)}
                    className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                  >
                      &times;
                  </button>
              </span>
          ))}
      </div>

      <input
        type="text"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">
                {searchTerm ? 'No results found' : 'Type to search...'}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSearchSelect;
