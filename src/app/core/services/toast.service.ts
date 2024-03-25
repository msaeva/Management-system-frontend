import {MessageService} from "primeng/api";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private messageService: MessageService) {
  }

  showMessage(message: { severity: string, summary: string, detail: string, life?: number }) {
    this.messageService.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life
    });
  }

  confirm(message: string, accept: () => void) {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirm',
      severity: 'warn',
      summary: 'Confirm',
      detail: message,
      sticky: true,
      life: 10000,
      closable: true,
      data: {
        accept
      }
    });
  }
}
