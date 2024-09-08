// pagination.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export interface PaginationInterface<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  nextPage?: number;
  previousPage?: number;
}

export class PaginatedResponseDto<T> implements PaginationInterface<T> {
  @ApiProperty({
    type: [Object],
    description: 'The items in the current page',
  })
  items: T[];

  @ApiProperty({
    type: Number,
    description: 'The total number of items',
  })
  totalItems: number;

  @ApiProperty({
    type: Number,
    description: 'The current page number',
  })
  currentPage: number;

  @ApiProperty({
    type: Number,
    description: 'The total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    type: Number,
    description: 'The next page number',
    required: false,
  })
  nextPage?: number;

  @ApiProperty({
    type: Number,
    description: 'The previous page number',
    required: false,
  })
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
