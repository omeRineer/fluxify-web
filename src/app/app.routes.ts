import { Routes } from '@angular/router';
import { Chat } from './pages/chat/chat';
import { Dashboard } from './pages/dashboard/dashboard';
import { ChatHistory } from './pages/chat/components/chat-history/chat-history';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
    {
        path: 'chat',
        component: Chat,
        children: [
            { path: ':roomId', loadComponent: () => import('./pages/chat/components/chat-history/chat-history').then(m => m.ChatHistory) },
        ]
    }
];
    