import { inject, Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable, tap } from "rxjs";
import { ApiDataResponse } from "../../models/common/api.models";
import { AccessToken, LoginRequest } from "../../models/common/auth.models";
import { UserContextInfo } from "../../models/common/user-context.models";
import { UserContextService } from "../common/userContext.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageKeys } from "../../constants/local-storage-keys";
import { Login } from "../../../pages/auth/login/login";


@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseHttpService {
    userContext = inject(UserContextService)
    jwtHelper = inject(JwtHelperService)

    constructor() {
        super("auth");
    }

    login(model: LoginRequest): Observable<ApiDataResponse<AccessToken>> {
        return this.post<ApiDataResponse<AccessToken>>("/login", model).pipe(
                tap((res) => {
                    if (!res.success) {
                        console.log(res.message)
                        return;
                    }

                    localStorage.setItem(StorageKeys.TOKEN_KEY, res.data.token)

                    const claims = this.jwtHelper.decodeToken<UserContextInfo>(res.data.token)
                    if (claims){
                        claims.Token = res.data.token;
                        this.userContext.set(claims)
                    }
                        
                })
            )
    }    

    logout(){
        this.userContext.clear();
        localStorage.removeItem(StorageKeys.TOKEN_KEY)
    }
}