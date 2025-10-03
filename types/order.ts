import { Customer } from "./customer";

export type OrderDetail = {
    id: string;
    size: string;
    flavor1: string;
    flavor2?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes?: string;
    status: "pending" | "completed" | "cancelled";
    custom_made: boolean;
};

export type Order = {
    id: string;
    created_date: string;
    due_date: string;
    pickup_date?: string;
    notes?: string;
    status: "pending" | "completed" | "cancelled";
    details: OrderDetail[];
    charge: Charge;
    customer?: Customer;
};

export type Payment = {
    id: string;
    value: number;
    date: string;
    method: string;
};

export type Charge = {
    id: string;
    date: string;
    status: "pending" | "paid" | "overdue";
    subtotal: number;
    discount: number;
    total: number;
    payments: Payment[];
};

export type OrderStatus = "pending" | "completed" | "cancelled";

export const ORDER_STATUS: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pendente" },
    { value: "completed", label: "Concluído" },
    { value: "cancelled", label: "Cancelado" },
];
