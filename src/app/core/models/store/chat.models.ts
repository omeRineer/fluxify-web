import { computed, signal } from "@angular/core";

export class AppChat {
    id: string;
    title: string;
    type: string;
    createDate: Date;
    lastMessage?:string;

    private typingCounter = signal<number>(0)
    readonly isTyping = computed(() => this.typingCounter() > 0);
    readonly activeTypingCount = this.typingCounter.asReadonly();

    onTyping(isTyping: boolean) {
        if (isTyping) {
            this.typingCounter.update(prev => prev + 1);
        } else {
            this.typingCounter.update(prev => Math.max(0, prev - 1));
        }
    }
}