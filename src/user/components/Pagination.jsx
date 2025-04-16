import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-4 space-x-2  p-4 rounded-md   border-gray-300  "> 
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-l-md bg-gray-200 hover:bg-gray-300 border-purple-600"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 border ${currentPage === index + 1 ? "bg-blue-500 text-black" : "bg-gray-200 hover:bg-gray-300 "}`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-r-md bg-gray-200 hover:bg-gray-300 border-purple-600"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;