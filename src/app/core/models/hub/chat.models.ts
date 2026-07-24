export interface MessagePayload {
    chatId: string;
    userId: string;
    name:string;
    text: string;
    date: Date;
}

export class TypingCounterPayload{
    chatId:string;
    counter: number = 0;
}