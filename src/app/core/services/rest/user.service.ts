import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse } from "../../models/common/api.models";
import { UserDto } from "../../models/rest/user.models";
import { DataList } from "../../models/common/data.models";

@Injectable({
    providedIn:"root"
})
export class UserService extends BaseHttpService{
    constructor(){
        super("users")
    }

    getList():Observable<ApiDataResponse<DataList<UserDto.List>>>{
        return this.get<ApiDataResponse<DataList<UserDto.List>>>("")
    }
}