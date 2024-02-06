// employee.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: any[] = [];
  private employeesSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.generateDummyData();
  }

  generateDummyData() {
    for (let i = 1; i <= 100; i++) {
      const dummyEmployee = {
        username: `user ${i}`,
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
        email: `user${i}@gmail.com`,
        birthDate: new Date(1990, 0, 1),
        status: 'Aktif',
        group: 'IT',
        basicSalary: 50000 + i * 1000
      };
      this.employees.push(dummyEmployee);
    }
    this.employeesSubject.next([...this.employees]);
  }

  getEmployees(): any[] {
    return this.employeesSubject.value;
  }

  getEmployeeByUsername(username: string): any {
    return this.employees.find(employee => employee.username === username);
  }

  updateEmployee(updatedEmployee: any): void {
    const existingEmployeeIndex = this.employees.findIndex(
      (employee) => employee.username === updatedEmployee.username
    );

    if (existingEmployeeIndex !== -1) {
      this.employees[existingEmployeeIndex] = updatedEmployee;
    } else {
      this.employees.push(updatedEmployee);
    }

    this.employeesSubject.next([...this.employees]);
  }

  deleteEmployee(username: string): void {
    this.employees = this.employees.filter((employee) => employee.username !== username);
    this.employeesSubject.next([...this.employees]);
  }
}
