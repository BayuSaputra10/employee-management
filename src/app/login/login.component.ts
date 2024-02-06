import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword:boolean = false;

  constructor(private router: Router) {}

//username = user and password = rahasia

  login() {
 
    if (this.username === 'user' && this.password === 'rahasia') {
      this.router.navigate(['/employee-list']);
    } else {
      alert('Invalid credentials');
    }
  }

    toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
