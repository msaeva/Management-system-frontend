import {Injectable} from "@angular/core";
import {JWT_LOCAL_STORAGE_KEY} from "@core/constants";
import {jwtDecode} from "jwt-decode";

@Injectable({providedIn: 'root'})
export class LocalStorageService {
  setToken(value: string): void {
    localStorage.setItem(JWT_LOCAL_STORAGE_KEY, value);
  }

  getToken(): string | null {
    return localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
  }

  getAuthUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.auth;
    }
    return null;
  }

  getAuthUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id as number;
    }
    return null;
  }

  clear(): void {
    localStorage.clear();
  }
}
