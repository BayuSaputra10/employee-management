import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../add-employee/employee-service';
import { ToastrService } from 'ngx-toastr';

import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  animations:[
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  displayedEmployees: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchTerm: string = '';
  sortField: string = 'username';
  sortDirection: string = 'asc';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastr: ToastrService
    
  ) {}

  ngOnInit() {
    this.initializeData();
    this.updateDisplayedEmployees();
  }

  initializeData() {
    this.employees = this.employeeService.getEmployees();

    this.route.params.subscribe((params) => {
      const employeeData = params['employeeData'];

      if (employeeData) {
        const savedEmployee = JSON.parse(employeeData);
        this.employeeService.updateEmployee(savedEmployee);
        this.employees = this.employeeService.getEmployees();
        this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
        this.updateDisplayedEmployees();
      } else {
        this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
        this.updateDisplayedEmployees();
      }
    });
  }

  updateDisplayedEmployees() {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    this.displayedEmployees = this.filterAndSortEmployees().slice(startIdx, endIdx);
  }

  filterAndSortEmployees(): any[] {
    let filteredEmployees = this.employees;

    if (this.searchTerm.trim() !== '') {
      filteredEmployees = this.employees.filter((employee) =>
        Object.values(employee).some((value) =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }

    filteredEmployees.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      if (this.sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filteredEmployees;
  }

  sort(field: string) {
    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.updateDisplayedEmployees();
  }

  search() {
    this.currentPage = 1;
    this.updateDisplayedEmployees();
  }

  editEmployee(employee: any) {
     this.toastr.success(`Editing employee: ${employee.username}`, 'Success');

     this.router.navigate(['/employee-list']);
  }

  deleteEmployee(employee: any) {
    const confirmDelete = confirm(`Are you sure you want to delete employee: ${employee.username}?`);
    if (confirmDelete) {
      this.employeeService.deleteEmployee(employee.username);

      this.employees = this.employeeService.getEmployees();
      this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
      this.updateDisplayedEmployees();

      this.toastr.success(`Delete employee: ${employee.username}`, 'Success');
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedEmployees();
    }
  }
    goToAddEmployeePage() {
    this.router.navigate(['/add-employee']);
  }

    formatSalary(salary: number): string {
    const formattedSalary = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(salary);

    return formattedSalary;
  }
}
