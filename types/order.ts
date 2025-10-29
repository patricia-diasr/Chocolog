import { Customer } from "./customer";
import { Employee } from "./employee";

export type OrderStatus =
    | "PENDING"
    | "READY_FOR_PICKUP"
    | "COMPLETED"
    | "CANCELLED";
export type ChargeStatus = "PAID" | "UNPAID" | "PARTIAL" | "OVERDUE";

export type OrderItemResponse = {
    id: number;
    orderId: number;
    sizeId: number;
    sizeName: string;
    flavor1Id: number;
    flavor1Name: string;
    flavor2Id: number | null;
    flavor2Name: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    onDemand: boolean;
    isPrinted?: boolean;
    status: OrderStatus;
    notes: string | null;
    customerId?: number;
    customerName?: string;
    customerPhone?: string;
    expectedPickupDate?: string;
};

export type OrderItemRequest = {
    sizeId: number;
    flavor1Id: number;
    flavor2Id: number | null;
    quantity: number;
    status?: OrderStatus;
    notes: string | null;
};

export type OrderResponse = {
    id: number;
    customer: Customer;
    employee: Employee;
    creationDate: string;
    expectedPickupDate: string;
    pickupDate: string | null;
    status: OrderStatus;
    notes: string | null;
    orderItems: OrderItemResponse[];
    charges: ChargeResponse;
};

export type OrderRequest = {
    employeeId?: number;
    expectedPickupDate?: string;
    status?: OrderStatus;
    notes: string | null;
    orderItems?: OrderItemRequest[];
    discount: number;
};

export type PaymentResponse = {
    id: number;
    chargeId: number;
    employeeId: number;
    paidAmount: number;
    paymentDate: string;
    paymentMethod: string;
};

export type PaymentRequest = {
    employeeId: number;
    paidAmount: number;
    paymentMethod: string;
    paymentDate: string;
};

export type ChargeResponse = {
    id: number;
    orderId: number;
    subtotalAmount: number;
    discount: number;
    totalAmount: number;
    dueAmount: number;
    status: ChargeStatus;
    date: string;
    payments: PaymentResponse[];
};

export const ORDER_STATUS: { value: OrderStatus; label: string }[] = [
    { value: "PENDING", label: "Pendente" },
    { value: "READY_FOR_PICKUP", label: "Pronto" },
    { value: "COMPLETED", label: "Concluído" },
    { value: "CANCELLED", label: "Cancelado" },
];

export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
    PENDING: "Pendente",
    READY_FOR_PICKUP: "Pronto para Retirada",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
};
