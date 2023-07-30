import React, { useState, useRef  } from 'react';

const AutocompleteList = ({list, onData}) => {
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
        className="border bg-black text-white border-gray-300 p-2 rounded-md mb-4"
      />

      {isListVisible && suggestions.length > 0 && (
        <div ref={listContainerRef} className="bg-black absolute w-full z-50 max-h-40 overflow-y-auto">
          <ul className="bg-black border text-white rounded-md divide-y divide-gray-300">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="p-2 hover:bg-white hover:text-black cursor-pointer"
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

export default AutocompleteList;
