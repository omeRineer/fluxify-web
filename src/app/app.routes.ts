import { Routes } from '@angular/router';
import { Chat } from './pages/chat/chat';
import { Dashboard } from './pages/dashboard/dashboard';
import { ChatHistory } from './pages/chat/components/chat-history/chat-history';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { Login } from './pages/auth/login/login';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { NotFoundComponent } from './shared/static/not-found.component';
import { NotificationList } from './pages/notification/notification-list/notification-list';
import { Profile } from './pages/profile/profile';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'me', component: Profile },
            { path: 'settings', component: Settings },
            { path: 'dashboard', component: Dashboard },
            { path: 'notifications', component: NotificationList },
            {
                path: 'chat',
                component: Chat,
                children: [
                    { path: ':roomId', loadComponent: () => import('./pages/chat/components/chat-history/chat-history').then(m => m.ChatHistory) },
                ]
            }
        ]
    },
    {
        path: '',
        component: AuthLayout,
        canActivate: [guestGuard],
        children: [
            { path: 'login', component: Login }
        ]
    },

    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' }
];
