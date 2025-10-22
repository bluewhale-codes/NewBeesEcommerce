import ReactPaginate from "react-paginate";

function PaginationComponent({ pageCount, onPageChange }) {
  return (
    <div className="flex justify-center my-6">
      <ReactPaginate
        previousLabel={"← Prev"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={onPageChange}
        containerClassName="flex space-x-2"
        pageClassName="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
        activeClassName="bg-blue-600 text-white"
        previousClassName="px-3 py-1 border border-gray-300 rounded-md"
        nextClassName="px-3 py-1 border border-gray-300 rounded-md"
      />
    </div>
  );
}

export default PaginationComponent;
