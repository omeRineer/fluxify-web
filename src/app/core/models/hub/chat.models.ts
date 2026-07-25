export interface MessagePayload {
    chatId: string;
    userId: string;
    name:string;
    text: string;
    date: Date;
}

export class TypingCounterPayload{
    [key:string]:number;
}