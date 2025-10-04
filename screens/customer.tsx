import { useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, Center, ScrollView, VStack } from "native-base";

import InfoList from "../components/layout/InfoList";
import FabButton from "../components/layout/FabButton";
import CustomerInfoCard from "../components/customer/CustomerInfoCard";
import CustomerFormModal from "../components/customer/CustomerFormModal";
import OrderFormModal from "../components/order/OrderFormModal";
import OrderDetailFormModal from "../components/order/OrderDetailFormModal";

import { useAppColors } from "../hooks/useAppColors";
import { Customer } from "../types/customer";
import { Charge, Order, OrderDetail } from "../types/order";
import { getStatusDetails } from "../utils/statusConfig";
import { formatDate, formatPrice } from "../utils/formatters";

const customerDataMock: Customer = {
    id: "1",
    name: "Maria Silva",
    phone: "11999999999",
    notes: "Observação adicional sobre o cliente. Pode conter informações relevantes para o atendimento.",
    isReseller: true,
};

const ordersDataMock: Order[] = [
    {
        id: "1",
        created_date: "2025-02-25",
        due_date: "2025-03-10",
        status: "completed",
        details: [],
        charge: {
            id: "1",
            date: "2025-03-02",
            status: "paid",
            subtotal: 260.0,
            discount: 10,
            total: 250.0,
            payments: [],
        },
    },
    {
        id: "2",
        created_date: "2025-03-01",
        due_date: "2025-03-09",
        status: "pending",
        details: [],
        charge: {
            id: "2",
            date: "2025-02-10",
            status: "pending",
            subtotal: 180,
            discount: 0,
            total: 180.0,
            payments: [],
        },
    },
    {
        id: "3",
        created_date: "2025-02-28",
        due_date: "2025-03-12",
        status: "cancelled",
        details: [],
        charge: {
            id: "3",
            date: "2025-02-20",
            status: "overdue",
            subtotal: 120,
            discount: 0,
            total: 120.0,
            payments: [],
        },
    },
];

const chargesDataMock: Charge[] = [
    {
        id: "1",
        date: "2025-03-02",
        status: "paid",
        subtotal: 260.0,
        discount: 10,
        total: 250.0,
        payments: [],
    },
    {
        id: "2",
        date: "2025-02-10",
        status: "pending",
        subtotal: 180,
        discount: 0,
        total: 180.0,
        payments: [],
    },
    {
        id: "3",
        date: "2025-02-20",
        status: "overdue",
        subtotal: 120,
        discount: 0,
        total: 120.0,
        payments: [],
    },
];

type VisibleModal = "editCustomer" | "addOrder" | "addOrderDetail";

export default function CustomerScreen() {
    const { backgroundColor } = useAppColors();
    const navigation = useNavigation();

    const [customerData, setCustomerData] =
        useState<Customer>(customerDataMock);
    const [ordersData, setOrdersData] = useState<Order[]>(ordersDataMock);
    const [chargesData, setChargesData] = useState<Charge[]>(chargesDataMock);

    const [visibleModal, setVisibleModal] = useState<VisibleModal | null>(null);

    const handleUpdateCustomer = useCallback((updatedCustomer: Customer) => {
        setCustomerData(updatedCustomer);
        setVisibleModal(null);
    }, []);

    const handleSaveOrder = useCallback((newOrder: Order) => {
        setVisibleModal("addOrderDetail");
    }, []);

    const handleSaveOrderDetail = useCallback((newOrderDetail: OrderDetail) => {
        setVisibleModal(null);
    }, []);

    const handleNavigateToOrder = () => {
        navigation.navigate("Order" as never);
    };

    const handleNavigateToCharge = () => {
        navigation.navigate("Customer" as never);
    };

    const orderItems = useMemo(() => {
        return ordersData.map((order) => {
            const status = getStatusDetails(order.status);
            return {
                id: order.id,
                title: `Pedido #${order.id}`,
                info: formatDate(order.due_date),
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
                id: charge.id,
                title: `Cobrança #${charge.id}`,
                info: formatDate(charge.date),
                aditionalInfo: formatPrice(charge.total),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [chargesData]);

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
                                onItemPress={handleNavigateToCharge}
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
            />

            <OrderFormModal
                title="Adicionar Pedido"
                isOpen={visibleModal === "addOrder"}
                onClose={() => setVisibleModal(null)}
                onSave={handleSaveOrder}
                orderData={null}
            />

            <OrderDetailFormModal
                title="Adicionar Item"
                isOpen={visibleModal === "addOrderDetail"}
                onClose={() => setVisibleModal(null)}
                onSave={handleSaveOrderDetail}
                orderDetailData={null}
            />
        </>
    );
}
