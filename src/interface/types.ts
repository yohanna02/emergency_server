export interface User {
    fullName: string;
    email: string;
    password: string;
};

export interface Request {
    longitude: number,
    latitude: number,
    note?: string,
    userId: string,
    resolved: boolean
};