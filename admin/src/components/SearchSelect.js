import React, { useState, useEffect, useRef } from 'react';

const SearchSelect = ({ label, options, value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // When value updates externally (or on initial load), set the search term to the name
  useEffect(() => {
    const selectedOption = options.find(opt => opt.id === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.name);
    } else if (!isOpen) {
       // Only clear if not currently open/typing.
       // Actually, if value becomes null, we should clear it.
       // But if we are typing, we don't want to reset it.
       if (value === '' || value === null) {
         setSearchTerm('');
       }
    }
  }, [value, options, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term to current value if not selected
        const selectedOption = options.find(opt => opt.id === value);
        if (selectedOption) {
          setSearchTerm(selectedOption.name);
        } else {
            setSearchTerm('');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, value, options]);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option.id);
    setSearchTerm(option.name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
      setIsOpen(true);
      // If user clears the input, clear the selection
      if (e.target.value === '') {
          onChange('');
      }
  }

  return (
    <div className="mb-4 relative" ref={wrapperRef}>
      <label className="block text-gray-700">{label}</label>
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
            <li className="px-3 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchSelect;
