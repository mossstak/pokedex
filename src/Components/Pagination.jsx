import React from "react";

const Pagination = ({ gotoNextPage, gotoPrevPage }) => {
  return (
    <div className="flex gap-4 justify-center">
      {gotoPrevPage && (
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={gotoPrevPage}
        >
          Previous
        </button>
      )}
      {gotoNextPage && (
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={gotoNextPage}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
