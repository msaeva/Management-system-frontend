import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: 'root'})
export class LayoutService {
  showSidebarSubject= new BehaviorSubject<boolean>(true);

  toggleSidebar() {
    this.showSidebarSubject.next(!this.showSidebarSubject.value);
  }
  getValue() {
    return this.showSidebarSubject.asObservable();
  }
}
