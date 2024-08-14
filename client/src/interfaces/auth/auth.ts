import { User } from "../user/user"

export interface AuthState {
    isAuthenticated: boolean
    user: User | null
}

export interface AuthResponse {
    lastName: string;
    email: string;
    name: string;
    authority: string;
    id: string;
    token: string;
    refreshToken: string;
}

export interface AuthError {
    error: string;
    message: string;
    code: number;
}