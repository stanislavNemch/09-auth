export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
}

// Тип для данных регистрации/логина
export type UserCredentials = Pick<User, "email"> & { password?: string };

// Тип для обновления профиля
export type UserProfileUpdate = Partial<Pick<User, "username">>;
