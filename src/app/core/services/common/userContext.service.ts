import { inject, Injectable, signal } from "@angular/core";
import { UserContextInfo, INITIAL_USER_CONTEXT } from "../../models/common/user-context.models";
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageKeys } from "../../constants/local-storage-keys";
import { Subject } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class UserContextService {
    private jwtHelper = inject(JwtHelperService)
    private user = signal<UserContextInfo>(INITIAL_USER_CONTEXT)
    private onSet = new Subject<void>();
    private onClear = new Subject<void>();

    user$ = this.user.asReadonly();
    onSet$ = this.onSet.asObservable()
    onClear$ = this.onClear.asObservable()

    

    constructor() {
        this.initializeFromStorage();
    }


    set(context: UserContextInfo): void {
        this.user.set({
            ...context,
            isAuthenticated: true
        });

        this.onSet.next();
    }

    clear(): void {
        this.user.set(INITIAL_USER_CONTEXT);

        this.onClear.next();
    }

    private initializeFromStorage(): void {
        const token = localStorage.getItem(StorageKeys.TOKEN_KEY);
        if (token) {
            const claims = this.jwtHelper.decodeToken<UserContextInfo>(token);
            if (claims && !this.jwtHelper.isTokenExpired(token)) {
                claims.Token = token;
                this.set(claims);
            } else {
                this.clear();
            }
        }
    }
}