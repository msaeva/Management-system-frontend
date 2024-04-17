import {Component} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
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
import {Pagination} from "@core/types/pagination";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {last} from "rxjs";
import {RouterLink} from "@angular/router";

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
    ProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './user.list.component.html',
  styleUrl: './user.list.component.scss'
})
export class UserListComponent {

  users: DetailedUser[] = [];
  clonedUsers: Map<number, DetailedUser> = new Map<number, DetailedUser>();
  forms: FormGroup[] = [];

  visible: boolean = false;

  pagination: Pagination = {
    page: 0,
    size: 5,
    sort: "id",
    order: "asc",
    totalRecords: -1
  }

  loading: { users: boolean } = {
    users: true,
  }

  constructor(private userService: UserService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService,
              private formBuilder: FormBuilder) {
  }

  showCreateNewUserDialog(): void {
    this.visible = true;
  }

  newUserHandler(user: DetailedUser): void {
    this.initializeForms([...this.users, user]);
    this.users.push(user);
    this.visible = false;
  }

  showConfirmation(userId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(userId);
      }
    });
  }

  loadUsers($event: TableLazyLoadEvent): void {
    const rowsPerPage = $event.rows != null ? $event.rows as number : this.pagination.page;
    const pageNumber = Math.ceil(($event.first as number) / rowsPerPage);

    this.pagination.sort = $event.sortField as string;
    this.pagination.order = $event.sortOrder === 1 ? 'asc' : 'desc' as string;

    this.loading.users = true;
    this.userService.getAllUsers({...this.pagination, page: pageNumber + 1}).subscribe(
      {
        next: (response) => {
          this.pagination.totalRecords = response.totalRecords;
          this.initializeForms(response.data);
          this.users = response.data;
          this.loading.users = false;
        },
        error: () => {
          console.log("Error loading users");
        }
      })
    // } else {
    //   // this.pagination.sort = $event.sortField as string;
    //   // this.pagination.order = $event.sortOrder === 1 ? 'asc' : 'desc' as string;
    //
    //   this.users = this.users.sort((a, b) => {
    //     const titleA = a.projects?.[0]?.title || '';
    //     const titleB = b.projects?.[0]?.title || '';
    //
    //     if (titleA === '' && titleB === '') return 0;
    //     if (titleA === '') return -1;
    //     if (titleB === '') return 1;
    //
    //     return titleA.localeCompare(titleB);
    //   });
    //
    //   console.log(this.users);
    //   this.initializeForms(this.users);
    // }
  }

  private initializeForms(users: DetailedUser[]): void {
    this.forms = users.map(user => {
      return this.formBuilder.group({
        id: [user.id, [Validators.required]],
        firstName: [user.firstName, [Validators.required, Validators.minLength(3)]],
        lastName: [user.lastName, [Validators.required, Validators.minLength(3)]],
        role: [user.role, [Validators.required]]
      });
    });
  }

  onRowEditInit(user: DetailedUser): void {
    this.clonedUsers.set(user.id, {...user});
  }

  onRowEditSave(user: DetailedUser): void {

    this.userService.updateAdmin(user).subscribe({
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

  onRowEditCancel(user: DetailedUser, index: number): void {
    this.users[index] = <DetailedUser>this.clonedUsers.get(user.id);
    this.clonedUsers.delete(user.id);
  }

  deleteUser(id: number): void {
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
  protected readonly last = last;
}