import { University } from '../university.schema';

export interface IUniversityPagination {
  universities: University[];
  totalPages: number;
  currentPage: number;
}
