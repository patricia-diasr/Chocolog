import { useCallback, useEffect, useMemo, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Box, Center, Text, ScrollView, Spinner, VStack } from "native-base";

import InfoList from "../components/layout/InfoList";
import FabButton from "../components/layout/FabButton";
import CustomerInfoCard from "../components/customer/CustomerInfoCard";
import CustomerFormModal from "../components/customer/CustomerFormModal";
import OrderFormModal from "../components/order/OrderFormModal";
import OrderDetailFormModal from "../components/order/OrderDetailFormModal";

import { useAppColors } from "../hooks/useAppColors";
import { Customer } from "../types/customer";
import {
    ChargeResponse,
    OrderItemRequest,
    OrderRequest,
    OrderResponse,
} from "../types/order";
import { getStatusDetails } from "../utils/statusConfig";
import { formatDate, formatPrice } from "../utils/formatters";
import { useCustomToast } from "../contexts/ToastProvider";
import { CustomerStackParamList } from "../types/navigation";
import { getCustomer, updateCustomer } from "../services/customerService";
import { createOrder, getOrders } from "../services/orderService";

type VisibleModal = "editCustomer" | "addOrder" | "addOrderDetail";
type CustomerScreenRouteProp = RouteProp<CustomerStackParamList, "Customer">;

interface Props {
    route: CustomerScreenRouteProp;
}

export default function CustomerScreen({ route }: Props) {
    const { backgroundColor, secondaryColor, mediumGreyColor } = useAppColors();
    const toast = useCustomToast();

    const navigation = useNavigation();
    const { customerId } = route.params;

    const [customerData, setCustomerData] = useState<Customer>();
    const [ordersData, setOrdersData] = useState<OrderResponse[]>([]);
    const [chargesData, setChargesData] = useState<ChargeResponse[]>([]);
    const [pendingOrder, setPendingOrder] = useState<OrderRequest | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);
    const [visibleModal, setVisibleModal] = useState<VisibleModal | null>(null);

    const fetchCustomer = useCallback(async () => {
        setIsLoading(true);

        try {
            const customerData = await getCustomer(customerId);
            setCustomerData(customerData);

            const ordersData = await getOrders(customerId);
            setOrdersData(ordersData);

            const allCharges = ordersData.flatMap((order) => order.charges);
            setChargesData(allCharges);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar o cliente. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, customerId]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    const handleUpdateCustomer = async (updatedData: Customer) => {
        setIsSavingLoading(true);

        try {
            const updated = await updateCustomer(updatedData.id, updatedData);
            setCustomerData(updated);

            toast.showToast({
                title: "Sucesso!",
                description: "Cliente atualizado.",
                status: "success",
            });
            setVisibleModal(null);
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível atualizar o cliente.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const handleSaveOrder = useCallback((newOrder: OrderRequest) => {
        setPendingOrder(newOrder);
        setVisibleModal("addOrderDetail");
    }, []);

    const handleSaveOrderDetail = async (newOrderDetail: OrderItemRequest) => {
        setIsSavingLoading(true);
        if (!pendingOrder) {
            toast.showToast({
                title: "Erro!",
                description: "Os dados do pedido principal não foram encontrados.",
                status: "error",
            });
            setVisibleModal(null);
            return;
        }

        try {
            pendingOrder?.orderItems?.push(newOrderDetail);
            const newOrder = await createOrder(customerId, pendingOrder);
            setOrdersData((prev) => [...prev, newOrder]);

            toast.showToast({
                title: "Sucesso!",
                description: "O pedido foi criado.",
                status: "success",
            });

            setVisibleModal(null);
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível criar o pedido.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const handleNavigateToOrder = (orderId: number) => {
        navigation.navigate("Order", {
            customerId: customerId,
            orderId: orderId,
        });
    };

    const orderItems = useMemo(() => {
        return ordersData.map((order) => {
            const status = getStatusDetails(order.status);
            return {
                id: order.id,
                title: `Pedido #${order.id}`,
                info: formatDate(order.expectedPickupDate),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [ordersData]);

    const chargeItems = useMemo(() => {
        return chargesData.map((charge) => {
            const status = getStatusDetails(charge.status);
            return {
                id: charge.orderId,
                title: `Cobrança #${charge.id}`,
                info: formatDate(charge.date),
                aditionalInfo: formatPrice(charge.totalAmount),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [chargesData]);

    if (isLoading || customerData === undefined) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando cliente...
                </Text>
            </Center>
        );
    }

    return (
        <>
            <ScrollView
                flex={1}
                bg={backgroundColor}
                showsVerticalScrollIndicator={false}
            >
                <Center>
                    <Box
                        w="100%"
                        maxW={{ md: "960px", lg: "1100px" }}
                        px={4}
                        pt={6}
                    >
                        <VStack space={4}>
                            <CustomerInfoCard customer={customerData} />

                            <InfoList
                                title="Pedidos"
                                icon="cart"
                                items={orderItems}
                                addText="Adicionar"
                                emptyStateText="Nenhum pedido encontrado"
                                onAddItem={() => setVisibleModal("addOrder")}
                                onItemPress={handleNavigateToOrder}
                            />

                            <InfoList
                                title="Cobranças"
                                icon="card"
                                items={chargeItems}
                                emptyStateText="Nenhuma cobrança encontrada"
                                onItemPress={handleNavigateToOrder}
                            />
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton
                action={() => setVisibleModal("editCustomer")}
                icon="create-outline"
            />

            <CustomerFormModal
                title="Editar Cliente"
                isOpen={visibleModal === "editCustomer"}
                onClose={() => setVisibleModal(null)}
                onSave={handleUpdateCustomer}
                customerData={customerData}
                isLoading={isSavingLoading}
            />

            <OrderFormModal
                title="Adicionar Pedido"
                isOpen={visibleModal === "addOrder"}
                onClose={() => setVisibleModal(null)}
                onSave={handleSaveOrder}
                orderData={null}
                isLoading={isSavingLoading}
            />

            <OrderDetailFormModal
                title="Adicionar Item"
                isOpen={visibleModal === "addOrderDetail"}
                onClose={() => setVisibleModal(null)}
                onSave={handleSaveOrderDetail}
                orderItemRequestData={null}
                isLoading={isSavingLoading}
            />
        </>
    );
}
