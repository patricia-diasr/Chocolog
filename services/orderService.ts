import api from "./api";
import {
    OrderItemRequest,
    OrderItemResponse,
    OrderRequest,
    OrderResponse,
} from "../types/order";

export const getOrders = async (
    customerId: number,
): Promise<OrderResponse[]> => {
    const response = await api.get(`/customers/${customerId}/orders`);
    return response.data;
};

export const getOrder = async (
    customerId: number,
    orderId: number,
): Promise<OrderResponse> => {
    const response = await api.get(
        `/customers/${customerId}/orders/${orderId}`,
    );
    return response.data;
};

export const createOrder = async (
    customerId: number,
    orderData: OrderRequest,
): Promise<OrderResponse> => {
    const response = await api.post(
        `/customers/${customerId}/orders`,
        orderData,
    );
    return response.data;
};

export const updateOrder = async (
    customerId: number,
    orderId: number,
    orderData: OrderRequest,
): Promise<OrderResponse> => {
    const response = await api.patch(
        `/customers/${customerId}/orders/${orderId}`,
        orderData,
    );
    return response.data;
};

export const createItem = async (
    customerId: number,
    orderId: number,
    itemData: OrderItemRequest,
): Promise<OrderItemResponse> => {
    const response = await api.post(
        `/customers/${customerId}/orders/${orderId}/items`,
        itemData,
    );
    return response.data;
};

export const updateItem = async (
    customerId: number,
    orderId: number,
    itemId: number,
    itemData: OrderItemRequest,
): Promise<OrderItemResponse> => {
    const response = await api.patch(
        `/customers/${customerId}/orders/${orderId}/items/${itemId}`,
        itemData,
    );
    return response.data;
};

export const deleteItem = async (
    customerId: number,
    orderId: number,
    itemId: number,
): Promise<void> => {
    await api.delete(
        `/customers/${customerId}/orders/${orderId}/items/${itemId}`
    );
};
