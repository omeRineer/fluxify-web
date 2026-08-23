import { computed, Injectable, signal } from "@angular/core";
import { AppNotification } from "../../models/store/notification.models";
import { AppUser, AppUserStatus } from "../../models/store/users.models";
import { BaseStore } from "../common/store.service";



@Injectable({ providedIn: 'root' })
export class UserStore extends BaseStore<AppUser> {
    readonly onlineCount = computed(() => this.entities().filter(n => n.status === 'online').length);
}