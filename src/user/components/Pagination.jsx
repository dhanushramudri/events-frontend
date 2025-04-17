import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-6 space-x-2 p-4 rounded-md bg-[19105b]">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2 bg-[19105b] text-white rounded-md hover:bg-[#4f2a7f] transition-all duration-200 disabled:bg-gray-500 cursor-pointer"
      >
        Previous
      </button>

      {/* Page Number Buttons */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-5 py-2 border-2 rounded-md text-white 
            ${currentPage === index + 1 
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-[#19105b] hover:bg-[#4f2a7f]"}`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2 bg-[#19105b] text-white rounded-md hover:bg-[#4f2a7f] transition-all duration-200 disabled:bg-gray-500 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
