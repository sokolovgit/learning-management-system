// pagination.dto.ts
export interface PaginationInterface<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  nextPage?: number;
  previousPage?: number;
}

export class PaginatedResponseDto<T> implements PaginationInterface<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  nextPage?: number;
  previousPage?: number;

  constructor(
    items: T[],
    totalItems: number,
    currentPage: number,
    totalPages: number,
  ) {
    this.items = items;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.defineNavigationPages();
  }

  private defineNavigationPages() {
    if (this.currentPage < this.totalPages) {
      this.nextPage = this.currentPage + 1;
    }

    if (this.currentPage > 1) {
      this.previousPage = this.currentPage - 1;
    }
  }
}
