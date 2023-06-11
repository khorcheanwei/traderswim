import React, { useState } from "react";
import { FixedSizeList } from "react-window";

export default function Autocomplete({ items }) {
  const [prefix, setPrefix] = useState("");
  
  const handleChange = (event) => {
    setPrefix(event.target.value);
  };
  
  const filteredItems = items.filter(item => item.startsWith(prefix));
  
  return (
    <div style={{ position: "relative" }}>
      <input type="text" value={prefix} onChange={handleChange} />
      {prefix && (
        <div
            style={{
            position: "absolute",
            top: "100%",
            maxHeight: "200px",
            overflowY: "scroll",
            background: "#fff",
            width: "100%",
            zIndex: 9999, // Adjust the z-index value
          }}
        >
          <FixedSizeList
            height={filteredItems.length * 30}
            itemCount={filteredItems.length}
            itemSize={30}
            width={300}
          >
            {({ index, style }) => (
              <div style={style}>{filteredItems[index]}</div>
            )}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
};