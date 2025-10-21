import api from "./api";
import { Flavor } from "../types/flavor";

export const getFlavors = async (): Promise<Flavor[]> => {
    const response = await api.get("/flavors");
    return response.data;
};

export const getFlavor = async (id: number): Promise<Flavor> => {
    const response = await api.get(`/flavors/${id}`);
    return response.data;
};

export const createFlavor = async (
    flavorData: Omit<Flavor, "id">,
): Promise<Flavor> => {
    const response = await api.post("/flavors", flavorData);
    return response.data;
};

export const updateFlavor = async (
    id: number,
    flavorData: Flavor,
): Promise<Flavor> => {
    const response = await api.patch(`/flavors/${id}`, flavorData);
    return response.data;
};

export const deleteFlavor = async (id: number): Promise<void> => {
    await api.delete(`/flavors/${id}`);
};
