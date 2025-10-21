export type Employee = {
    id: number;
    name: string;
    login: string;
    password?: string;
    role: "ADMIN" | "STAFF";
};
