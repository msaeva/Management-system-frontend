import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {User} from "@core/types/User";
import {Observable, of} from "rxjs";
import {UserComponent} from "@feature/admin/user/user.component";
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {ConfirmationService, SelectItem} from "primeng/api";
import {UserService} from "@core/services/user-service";
import {DetailedUser} from "@core/types/DetailedUser";
import {ToastService} from "@core/services/toast.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    UserComponent,
    ToastModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    RippleModule,
    ChipsModule,
    ConfirmDialogModule,
    NgStyle
  ],
  templateUrl: './user.list.component.html',
  styleUrl: './user.list.component.scss'
})
export class UserListComponent implements OnInit {

  protected users: DetailedUser[] = [];
  clonedUsers: Map<number, DetailedUser> = new Map<number, DetailedUser>();

  constructor(private userService: UserService,
              private authService: AuthService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService) {
  }

  showConfirmation(userId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(userId);
      },
      reject: () => {
        // Message if user cancel
        // this.toastService.showMessage({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      {
        next: (users) => {
          this.users = users;
          console.log(users);
        },
        error: () => {
          console.log("Error loading users");
        }

      })
  }

  onRowEditInit(user: DetailedUser) {
    this.clonedUsers.set(user.id, {...user});
    console.log(this.clonedUsers);
  }

  onRowEditSave(user: DetailedUser) {
    this.userService.update(user).subscribe({
      next: () => {
        this.clonedUsers.delete(user.id);
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  onRowEditCancel(user: DetailedUser, index: number) {
    this.users[index] = <DetailedUser>this.clonedUsers.get(user.id);
    this.clonedUsers.delete(user.id);
  }

  deleteUser(id: number) {
    this.userService.deleteById(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
          life: 3000
        });
      }, error: (err) => {
        console.log(err)
      }
    });
  }

  createNewUser() {
    // this.authService.createAccount(user).subscribe({
    //   next: (response) => {
    //     this.users.push(...this.users, user)
    //   },
    //   error: (err) => {
    //     console.log(err)
    //   }
    // })
  }

  getUsers(): Observable<User[]> {
    return of(this.users);
  }
}
