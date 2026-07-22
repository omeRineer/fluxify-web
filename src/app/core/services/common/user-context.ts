import { inject, Injectable, signal } from "@angular/core";
import { UserContextInfo } from "../../models/common/user-context-info";
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageKeys } from "../../constants/local-storage-keys";

const INITIAL_USER_CONTEXT: UserContextInfo = {
    NameIdentifier: null,
    Key: null,
    ApiKey: null,
    Name: null,
    Device: null,
    Platform: null,
    NameSpaceId: null,
    NameSpace: null,
    isAuthenticated: false
};

@Injectable({
    providedIn: 'root'
})
export class UserContext {
    jwtHelper = inject(JwtHelperService)

    private state = signal<UserContextInfo>(INITIAL_USER_CONTEXT)

    public state$ = this.state.asReadonly();

    constructor() {
        this.initializeFromStorage();
    }


    set(context: UserContextInfo): void {
        this.state.set({
            ...context,
            isAuthenticated: true
        });
    }

    clear(): void {
        this.state.set(INITIAL_USER_CONTEXT);
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