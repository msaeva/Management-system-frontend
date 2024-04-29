import {MessageService} from "primeng/api";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private messageService: MessageService) {
  }

  showMessage(message: { severity: string, summary: string, detail: string, life?: number }): void {
    this.messageService.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life
    });
  }

  showErrorMessage() {
    this.showMessage({
      severity: 'error',
      summary: 'Error',
      detail: 'ERROR!',
      life: 3000
    });
  }

  showBadRequestMessage() {
    this.showMessage({
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid request. Please try again.!',
      life: 3000
    });
  }

  showForbiddenMessage() {
    this.showMessage({
      severity: 'error',
      summary: 'Error',
      detail: 'Forbidden: Access denied!',
      life: 3000
    });
  }
}
