import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class LayoutService {
  showSidebarSubject = new BehaviorSubject<boolean>(true);

  toggleSidebar(): void {
    this.showSidebarSubject.next(!this.showSidebarSubject.value);
  }

  getValue(): Observable<boolean> {
    return this.showSidebarSubject.asObservable();
  }
}
