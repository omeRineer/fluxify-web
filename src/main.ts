import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { MainLayout } from './app/shared/layouts/main-layout/main-layout';
import { Login } from './app/pages/auth/login/login';
import { AuthLayout } from './app/shared/layouts/auth-layout/auth-layout';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
