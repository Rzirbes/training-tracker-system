export class PaginateResponseDto<T> {
  data: T[];
  page: number;
  size: number;
  lastPage: number;
  total: number;

  constructor(paginate: Omit<PaginateResponseDto<T>, 'lastPage'>) {
    this.data = paginate.data;
    this.page = paginate.page;
    this.size = paginate.size;
    this.total = paginate.total;
    this.lastPage = Math.ceil(this.total / this.size);
  }
}
