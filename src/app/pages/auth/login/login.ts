import { Component, inject, signal } from '@angular/core';
import { CoreComponent } from '../../../core/components/core-component';
import { AuthService } from '../../../core/services/rest/auth-service';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login extends CoreComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  apiKey = signal<string>('');
  errorMessage = signal<string | null>(null);

  onLogin(): void {
    const key = this.apiKey().trim();
    if (!key) {
      this.errorMessage.set('Lütfen geçerli bir API Key giriniz.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithApiKey(key).pipe(
      finalize(() => {
        this.isLoading.set(false)
      })
    ).subscribe(res => {
      if (res.success)
        this.router.navigate(['/']);
    })
  }
}
