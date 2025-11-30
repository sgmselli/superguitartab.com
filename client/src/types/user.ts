export interface UserCreateRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}