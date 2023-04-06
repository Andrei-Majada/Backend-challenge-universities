import { University } from '../university.schema';

export interface UniversityPagination {
  universities: University[];
  totalPages: number;
  currentPage: number;
}
