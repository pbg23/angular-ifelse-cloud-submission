import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  columns: any[] = [];
  selectedRow: any;
  selectedRows: any[] = [];
  allSelected: boolean = false;
  data: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;
  pageSize = 5;
  teamMembers: any[] = [];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  yAxisLabels = ['100', '80', '60', '40', '20', '0'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      // Add your auth token here
      Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with your token
      'Content-Type': 'application/json',
    });

    this.http.get('https://01.fy25ey01.64mb.io/', { headers }).subscribe({
      next: (res: any) => {
        console.log('API response:', res);
        this.columns = res.grid_columns;
        this.data = res.grid_data;
        this.updatePagination();
      },
      error: (err) => {
        console.error('API error:', err);
        alert('Failed to load team data. Please try again later.');
      },
    });
  }
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.data.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onEdit(row: any): void {
    this.selectedRow = row;
  }

  closeModal(): void {
    this.selectedRow = null;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    this.selectedRows = checked ? [...this.paginatedData] : [];
  }

  toggleRowSelection(row: any, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter((r) => r !== row);
      this.allSelected = false;
    }
  }

  deleteRow(rowToDelete: any): void {
    const fullName = `${rowToDelete.name.first_name} ${rowToDelete.name.last_name}`;
    const confirmed = confirm(
      `Are you sure you want to delete the user "${fullName}"?`
    );

    if (confirmed) {
      this.data = this.data.filter((row) => row.id !== rowToDelete.id);
      this.updatePagination();
    }
  }
}
