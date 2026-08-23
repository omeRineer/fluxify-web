import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:"smartDate",
    standalone: true
})
export class SmartDatePipe implements PipeTransform{
    transform(value: string | Date | number | null | undefined, locale: string = 'en-US'): string {
    if (!value) return '';

    const date = new Date(value);
    
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return locale.startsWith('tr') ? 'Bugün' : 'Today';
    }

    if (diffDays === 1) {
      return locale.startsWith('tr') ? 'Dün' : 'Yesterday';
    }

    if (diffDays > 1 && diffDays < 7) {
      return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
}