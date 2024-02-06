import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../add-employee/employee-service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
    dummyGroups: string[] = ['Pemasaran', 'Personalia', 'Produksi', 'HRD', 'Pembelanjaan', 'Umum', 'Direktur', 'Manager', 'IT', 'Keuangan'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      basicSalary: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  saveEmployee() {
    if (this.employeeForm.valid) {
      const newEmployee = this.employeeForm.value;
      this.employeeService.updateEmployee(newEmployee);
      this.router.navigate(['/employee-list']);
    }
  }

  cancel() {
    this.router.navigate(['/employee-list']);
  }
}
