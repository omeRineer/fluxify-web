import { Component, inject, signal } from '@angular/core';
import { CoreComponent } from '../../../core/components/core.component';
import { AuthService } from '../../../core/services/rest/auth.service';
import { Router } from '@angular/router';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/common/toast.service';
import { LoginRequest } from '../../../core/models/common/auth.models';
import { ButtonComponent } from "../../../shared/components/button.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login extends CoreComponent {
  private authService = inject(AuthService);

  username = signal('');
  password = signal('');
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onLogin(): void {
    const userNameVal = this.username().trim();
    const passwordVal = this.password().trim();

    if (!userNameVal || !passwordVal) {
      this.errorMessage.set('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    const loginPayload: LoginRequest = {
      userName: userNameVal,
      password:  passwordVal
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(loginPayload).pipe(
      catchError((err)=>{
        this.toastService.error(err.message)

        return throwError(()=> new Error())
      }),
      finalize(() => {
        this.isLoading.set(false)
      })
    ).subscribe(res => {
      if (res.success)
        this.router.navigate(['/']);
      else
        this.toastService.error(res.message)
    })
  }
}
