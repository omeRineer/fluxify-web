import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http-service";
import { Observable } from "rxjs";
import { ApiDataResponse } from "../../models/common/api-response";
import { UserDto } from "../../models/entity/user-dto";
import { DataList } from "../../models/common/data-list";

@Injectable({
    providedIn:"root"
})
export class UserService extends BaseHttpService{
    constructor(){
        super("Users")
    }

    getList():Observable<ApiDataResponse<DataList<UserDto.List>>>{
        return this.get<ApiDataResponse<DataList<UserDto.List>>>("", {
            headers: {
                "Fluxify-Api-Key": "bVNONIPtXjY9U2S_1w7yTmzG02Yui5w4wfH1v5dFQletj3vFms9gdPJEy3USx8pO"
            }
        })
    }
}