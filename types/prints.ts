import { Customer } from "./customer";
import { OrderDetail } from "./order";

export type ItemPrintBatch = {
    id: number;
    order_id: number;
    status: "pending" | "completed" | "cancelled";
    due_date: string;
    order_detail: OrderDetail;
    customer: Customer;
    is_printed?: boolean;
};

export type PrintBatch = {
    id: number;
    printed_by_employee: string;
    created_at: string;
    items: ItemPrintBatch[];
};
