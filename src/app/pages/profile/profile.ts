import { Component, inject, OnInit, signal } from '@angular/core';
import { MeService } from '../../core/services/rest/me.service';
import { UserDto } from '../../core/models/dto/user.models';
import { CoreComponent } from '../../core/components/core.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateProfileRequest } from '../../core/models/api/me.models';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile extends CoreComponent implements OnInit {
  readonly meService = inject(MeService)

  profile = signal<UserDto.Profile | null>(null)
  form = new FormGroup({
    title: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    email: new FormControl('', [Validators.email])
  })

  ngOnInit(): void {
    this.isLoading.set(true)
    this.meService.getProfile().subscribe(res => {
      if (res.success) {
        this.profile.set(res.data)

        this.form.patchValue({
          name: res.data.name,
          email: res.data.email,
          title: res.data.title,
          phone: res.data.phone
        });
      }

      this.isLoading.set(false)

    })
  }

  save() {
    if (!this.form.valid) {
      return;
    }

    let toastInstance = this.toastService.fire({
      type: 'loading',
      message: 'Kaydediliyor'
    })

    this.meService.save(this.form.value as UpdateProfileRequest)
      .pipe(
        finalize(() => { toastInstance.close() }),
        catchError((err) => {
          this.toastService.error(err);
          return EMPTY;
        })
      )
      .subscribe(res => {
        if (res.success)
          this.toastService.success(res.message || "Profil bilgileri başarıyla kaydedildi")
        else
          this.toastService.error(res.message || "Bir hata meydana geldi")
      })
  }
}
