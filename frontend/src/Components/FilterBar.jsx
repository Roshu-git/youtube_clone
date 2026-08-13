import React from "react";

const filters = [
  "All",
  "React",
  "JavaScript",
  "MERN",
  "CSS",
  "Node.js",
];

const FilterBar = ({ category, setCategory }) => {
  return (
    <div className="vc-filterbar">
      {filters.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setCategory(item)}
          className={`vc-filterbtn ${
            category === item
              ? "active bg-white text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;