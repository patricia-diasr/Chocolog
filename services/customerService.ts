import api from "./api";
import { Customer } from "../types/customer";

export const getCustomers = async (): Promise<Customer[]> => {
    const response = await api.get("/customers");
    return response.data;
};

export const getCustomer = async (id: number): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

export const createCustomer = async (
    customerData: Omit<Customer, "id">,
): Promise<Customer> => {
    const response = await api.post("/customers", customerData);
    return response.data;
};

export const updateCustomer = async (
    id: number,
    customerData: Customer,
): Promise<Customer> => {
    const response = await api.patch(`/customers/${id}`, customerData);
    return response.data;
};
