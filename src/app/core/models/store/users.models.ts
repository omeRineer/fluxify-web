export type AppUserStatus = 'online' | 'offline' | 'away'

export interface AppUser{
    id:string;
    key:string;
    status:string;
    date:Date;
}