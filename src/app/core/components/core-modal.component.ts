import { Component, inject, Directive, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogResult } from '../models/common/dialog.models';

@Directive()
export abstract class CoreModalComponent<TData = any, TResult = any> {
  protected dialogRef = inject(DialogRef<DialogResult<TResult>>);
  public data = inject<TData>(DIALOG_DATA, { optional: true }) as TData;
  protected isLoading = signal<boolean>(false)

  confirm(data?: TResult): void {
    this.dialogRef.close({
      action: 'confirm',
      data: data
    });
  }

  cancel(): void {
    this.dialogRef.close({
      action: 'cancel'
    });
  }

  close(): void {
    this.dialogRef.close({
      action: 'close'
    });
  }
}