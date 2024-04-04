import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ChipsModule} from "primeng/chips";
import {ConfirmationService} from "primeng/api";
import {UserService} from "@core/services/user-service";
import {DetailedUser} from "@core/types/users/detailed-user";
import {ToastService} from "@core/services/toast.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {PasswordModule} from "primeng/password";
import {CreateUserComponent} from "@feature/admin/create-user/create-user.component";
import {roleOptions} from "@core/constants";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ToastModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    RippleModule,
    ChipsModule,
    ConfirmDialogModule,
    NgStyle,
    DialogModule,
    PasswordModule,
    ReactiveFormsModule,
    CreateUserComponent,
  ],
  templateUrl: './user.list.component.html',
  styleUrl: './user.list.component.scss'
})
export class UserListComponent implements OnInit {

  users: DetailedUser[] = [];
  clonedUsers: Map<number, DetailedUser> = new Map<number, DetailedUser>();
  forms: FormGroup[] = [];

  visible: boolean = false;

  showCreateNewUserDialog() {
    this.visible = true;
  }


  constructor(private userService: UserService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService,
              private formBuilder: FormBuilder) {
  }

  newUserHandler(user: DetailedUser) {
    this.initializeForms([...this.users, user]);
    this.users.push(user);
    this.visible = false;
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
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      {
        next: (users) => {
          this.initializeForms(users);
          this.users = users;
        },
        error: () => {
          console.log("Error loading users");
        }
      })
  }

  private initializeForms(users: DetailedUser[]) {
    this.forms = users.map(user => {
      return this.formBuilder.group({
        id: [user.id, [Validators.required]],
        firstName: [user.firstName, [Validators.required, Validators.minLength(3)]],
        lastName: [user.lastName, [Validators.required, Validators.minLength(3)]],
        role: [user.role, [Validators.required]]
      });
    });
  }

  onRowEditInit(user: DetailedUser) {
    this.clonedUsers.set(user.id, {...user});
  }

  onRowEditSave(user: DetailedUser) {

    this.userService.update(user).subscribe({
      next: () => {
        const userToUpdate = this.users.find(u => u.id === user.id);
        userToUpdate!.role = user.role;
        userToUpdate!.firstName = user.firstName;
        userToUpdate!.lastName = user.lastName;

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

  protected readonly roleOptions = roleOptions;
}
