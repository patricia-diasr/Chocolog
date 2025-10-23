import api from "./api";
import {
    OrderItemRequest,
    OrderItemResponse,
    OrderRequest,
    OrderResponse,
    PaymentRequest,
    PaymentResponse
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

export const getOrdersByDate = async (
    date: string,
): Promise<OrderResponse[]> => {
    const response = await api.get(`/orders?date=${date}`);
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


export const createPayment = async (
    customerId: number,
    orderId: number,
    paymentData: PaymentRequest,
): Promise<PaymentResponse> => {
    const response = await api.post(
        `/customers/${customerId}/orders/${orderId}/payments`,
        paymentData,
    );
    return response.data;
};

export const updatePayment = async (
    customerId: number,
    orderId: number,
    paymentId: number,
    paymentData: PaymentRequest,
): Promise<PaymentResponse> => {
    const response = await api.patch(
        `/customers/${customerId}/orders/${orderId}/payments/${paymentId}`,
        paymentData,
    );
    return response.data;
};

export const deletePayment = async (
    customerId: number,
    orderId: number,
    paymentId: number,
): Promise<void> => {
    await api.delete(
        `/customers/${customerId}/orders/${orderId}/payments/${paymentId}`,
    );
};
