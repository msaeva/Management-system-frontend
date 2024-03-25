import {Component, Input} from '@angular/core';
import {User} from "@core/types/User";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  @Input() user!: User;

  deleteUser(id: number) {
    // Implement deletion logic
  }
}
