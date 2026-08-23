
export interface DialogOptions<TData = any> {
  width?: string;
  maxWidth?: string;
  data?: TData;
  disableClose?: boolean;
}

export interface DialogResult<R = any> {
  action: 'confirm' | 'cancel' | 'close';
  data?: R;
}