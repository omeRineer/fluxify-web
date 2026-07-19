import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { DashboardLayout } from './app/core/layouts/dashboard-layout/dashboard-layout';

bootstrapApplication(DashboardLayout, appConfig)
  .catch((err) => console.error(err));
