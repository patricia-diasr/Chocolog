import api from "./api";
import { Employee } from "../types/employee";

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await api.get("/employees");
    return response.data;
};

export const getEmployee = async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (
    employeeData: Omit<Employee, "id">,
): Promise<Employee> => {
    const response = await api.post("/employees", employeeData);
    return response.data;
};

export const updateEmployee = async (
    id: number,
    employeeData: Employee,
): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}`, employeeData);
    return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
};
