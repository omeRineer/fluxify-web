import { inject, Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable, tap } from "rxjs";
import { ApiDataResponse } from "../../models/common/api.models";
import { AccessToken } from "../../models/common/auth.models";
import { UserContextInfo } from "../../models/common/user-context.models";
import { UserContextService } from "../common/userContext.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageKeys } from "../../constants/local-storage-keys";


@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseHttpService {
    userContext = inject(UserContextService)
    jwtHelper = inject(JwtHelperService)

    constructor() {
        super("auth");
    }

    loginWithApiKey(apiKey: string): Observable<ApiDataResponse<AccessToken>> {
        return this.post<ApiDataResponse<AccessToken>>("/api-key/token", JSON.stringify(apiKey)).pipe(
                tap((res) => {
                    if (!res.success) {
                        console.log(res.message)
                        return;
                    }

                    localStorage.setItem(StorageKeys.TOKEN_KEY, res.data.token)

                    const claims = this.jwtHelper.decodeToken<UserContextInfo>(res.data.token)
                    if (claims)
                        this.userContext.set(claims)
                })
            )
    }    

    logout(){
        this.userContext.clear();
        localStorage.removeItem(StorageKeys.TOKEN_KEY)
    }
}