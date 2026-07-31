import { computed, Injectable, signal } from "@angular/core";
import { AppNotification } from "../../models/store/notification.models";
import { AppChat } from "../../models/store/chat.models";
import { AppMessage } from "../../models/store/message.models";
import { BaseStore } from "../common/store.service";



@Injectable({ providedIn: 'root' })
export class MessageStore extends BaseStore<AppMessage> {
    
}