import React, { useState, useRef  } from 'react';

const StockAutocompleteList = ({list, onData}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isListVisible, setListVisible] = useState(false);
  const listContainerRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter the list based on the search term
    const filteredList = list.filter((item) =>
      item.toLowerCase().startsWith(value.toLowerCase())
    );

    // Update the suggestions with a maximum of 5 items from the filtered list
    setSuggestions(filteredList);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    onData(suggestion);
    setListVisible(false);
  };

  const handleInputClick = () => {
    setSuggestions(list);
    setListVisible(true);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder="Type to search..."
        className="border border-gray-300 p-2 rounded-md mb-4"
      />

      {isListVisible && suggestions.length > 0 && (
        <div ref={listContainerRef} className="absolute w-full z-50 max-h-40 overflow-y-auto">
          <ul className="bg-white border border-gray-300 rounded-md divide-y divide-gray-300">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockAutocompleteList;
