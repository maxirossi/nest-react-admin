import { useState } from 'react';

interface UsePaginationProps {
  totalItems: number;
  defaultPageSize?: number;
  maxPageSize?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

// Get environment variables safely
const getDefaultPageSize = (): number => {
  if (typeof window !== 'undefined' && (window as any).process?.env?.REACT_APP_DEFAULT_PAGE_SIZE) {
    return parseInt((window as any).process.env.REACT_APP_DEFAULT_PAGE_SIZE, 10);
  }
  return 10;
};

const getMaxPageSize = (): number => {
  if (typeof window !== 'undefined' && (window as any).process?.env?.REACT_APP_MAX_PAGE_SIZE) {
    return parseInt((window as any).process.env.REACT_APP_MAX_PAGE_SIZE, 10);
  }
  return 100;
};

export default function usePagination({
  totalItems,
  defaultPageSize = getDefaultPageSize(),
  maxPageSize = getMaxPageSize(),
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSetPageSize = (size: number) => {
    const validSize = Math.min(Math.max(size, 1), maxPageSize);
    setPageSize(validSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    setCurrentPage,
    setPageSize: handleSetPageSize,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
}
