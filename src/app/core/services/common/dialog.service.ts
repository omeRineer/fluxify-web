import { inject, Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { DialogOptions, DialogResult } from '../../models/common/dialog.models';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(Dialog);

  open<T, D = any, R = any>(
    componentClass: ComponentType<T>,
    options?: DialogOptions<D>
  ): DialogRef<DialogResult<R>, T> {
    return this.dialog.open<DialogResult<R>, D, T>(componentClass, {
      width: options?.width || '480px',
      maxWidth: options?.maxWidth || '90vw',
      disableClose: options?.disableClose ?? false,
      backdropClass: 'cdk-dark-slate-backdrop',
      panelClass: 'cdk-dark-slate-panel',
      data: options?.data
    });
  }

  // Modal kapandığında dönen sonucu RxJS Observable olarak almak için kısayol
  openAndGetResult<T, D = any, R = any>(
    componentClass: ComponentType<T>,
    options?: DialogOptions<D>
  ): Observable<DialogResult<R> | undefined> {
    const dialogRef = this.open<T, D, R>(componentClass, options);
    return dialogRef.closed;
  }
}