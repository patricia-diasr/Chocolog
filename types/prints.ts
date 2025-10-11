import { Customer } from "./customer";
import { OrderDetail } from "./order";

export type ItemPrintBatch = {
    id: string;
    order_id: string;
    status: "pending" | "completed" | "cancelled";
    due_date: string;
    order_detail: OrderDetail;
    customer: Customer;
    is_printed?: boolean;
};

export type PrintBatch = {
    id: string;
    printed_by_employee: string;
    created_at: string;
    items: ItemPrintBatch[];
};
