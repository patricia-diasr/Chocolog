import { Employee } from "./employee";
import { OrderItemResponse } from "./order";

export type PrintBatch = {
    id: number;
    createdAt: string;
    printedBy: Employee;
    itemsCount: number;
};

export type PrintBatchItem = {
    id: number;
    orderItem: OrderItemResponse;
};

export type PrintBatchDetail = {
    id: number;
    createdAt: string;
    printedBy: Employee;
    fileSystemPath: string;
    items: PrintBatchItem[];
}

export type PrintBatchRequest = {
    orderItemIds: number[];
};
