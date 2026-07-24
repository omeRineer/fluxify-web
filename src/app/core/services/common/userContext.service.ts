import { inject, Injectable, signal } from "@angular/core";
import { UserContextInfo, INITIAL_USER_CONTEXT } from "../../models/common/user-context.models";
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageKeys } from "../../constants/local-storage-keys";



@Injectable({
    providedIn: 'root'
})
export class UserContextService {
    jwtHelper = inject(JwtHelperService)

    private user = signal<UserContextInfo>(INITIAL_USER_CONTEXT)

    public user$ = this.user.asReadonly();

    constructor() {
        this.initializeFromStorage();
    }


    set(context: UserContextInfo): void {
        this.user.set({
            ...context,
            isAuthenticated: true
        });
    }

    clear(): void {
        this.user.set(INITIAL_USER_CONTEXT);
    }

    private initializeFromStorage(): void {
        const token = localStorage.getItem(StorageKeys.TOKEN_KEY);
        if (token) {
            const claims = this.jwtHelper.decodeToken<UserContextInfo>(token);
            if (claims && !this.jwtHelper.isTokenExpired(token)) {
                this.set(claims);
            } else {
                this.clear();
            }
        }
    }
}