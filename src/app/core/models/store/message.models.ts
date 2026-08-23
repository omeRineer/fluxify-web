export interface AppMessage {
    id:string;
    chatId: string;
    userId: string;
    name:string;
    text: string;
    date: Date;
}