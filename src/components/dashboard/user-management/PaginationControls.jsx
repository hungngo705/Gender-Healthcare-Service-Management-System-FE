import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  filteredUsers,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const handleItemsPerPageChange = (newItemsPerPage) => {
    onItemsPerPageChange(newItemsPerPage);
  };

  if (filteredUsers.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Mobile Pagination Summary */}
      <div className="px-4 py-3 border-b border-gray-200 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} của{" "}
            {filteredUsers.length}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:flex sm:items-center sm:justify-between px-6 py-4">
        {/* Left side - Results info and items per page */}
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold">{startIndex + 1}</span> đến{" "}
            <span className="font-semibold">
              {Math.min(endIndex, filteredUsers.length)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold">{filteredUsers.length}</span> kết
            quả
          </div>

          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Hiển thị:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">mục</span>
          </div>
        </div>

        {/* Right side - Page navigation */}
        <div className="flex items-center space-x-2">
          {/* First page button */}
          {currentPage > 3 && totalPages > 5 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="px-2 py-1 text-sm text-gray-500">...</span>
              )}
            </>
          )}

          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trước
          </button>

          {/* Page numbers */}
          <div className="flex space-x-1">
            {(() => {
              const pages = [];
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, currentPage + 2);

              // Adjust range to always show 5 pages if possible
              if (endPage - startPage < 4) {
                if (startPage === 1) {
                  endPage = Math.min(totalPages, startPage + 4);
                } else {
                  startPage = Math.max(1, endPage - 4);
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === i
                        ? "bg-indigo-600 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          >
            Tiếp
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>

          {/* Last page button */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 py-1 text-sm text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick jump to page */}
      {totalPages > 10 && (
        <div className="hidden lg:flex items-center justify-center px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Chuyển đến trang:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="text-sm text-gray-600">/ {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
