import { Box, Center, ScrollView, VStack } from "native-base";
import { useAppColors } from "../hooks/useAppColors";
import { useCallback, useMemo, useState } from "react";

import FabButton from "../components/layout/FabButton";
import OrderInfoCard from "../components/order/OrderInfoCard";
import ChargeInfoCard from "../components/order/ChargeInfoCard";
import InfoSwipeList from "../components/layout/InfoSwipeList";
import DeleteAlert from "../components/layout/DeleteAlert";
import OrderFormModal from "../components/order/OrderFormModal";
import OrderDetailFormModal from "../components/order/OrderDetailFormModal";
import PaymentFormModal from "../components/order/PaymentFormModal";

import { Order, OrderDetail, Payment } from "../types/order";
import { getStatusDetails } from "../utils/statusConfig";
import {
    formatDate,
    formatOrderDetailTitle,
    formatPrice,
} from "../utils/formatters";

const orderDataMock: Order = {
    id: "1",
    created_date: "2025-02-15",
    due_date: "2025-03-11",
    pickup_date: "2025-03-12",
    status: "completed",
    notes: "Observação que pode ser relevante sobre o pedido.",
    details: [
        {
            id: "1",
            size: "500g",
            flavor1: "Sensação",
            flavor2: "Prestígio",
            quantity: 2,
            unit_price: 60,
            total_price: 120,
            notes: "Embalagem rosa",
            status: "pending",
            custom_made: true,
        },
        {
            id: "2",
            size: "500g",
            flavor1: "Maracujá",
            quantity: 1,
            unit_price: 60,
            total_price: 60,
            status: "completed",
            custom_made: false,
        },
        {
            id: "3",
            size: "350g",
            flavor1: "Brigadeiro",
            quantity: 4,
            unit_price: 40,
            total_price: 160,
            status: "completed",
            custom_made: false,
        },
    ],
    charge: {
        id: "1",
        date: "2025-02-15",
        status: "paid",
        subtotal: 180,
        discount: 10,
        total: 170,
        payments: [
            { id: "1", value: 85, date: "2025-02-15", method: "Dinheiro" },
            { id: "2", value: 85, date: "2025-03-12", method: "Pix" },
        ],
    },
};

type ModalType =
    | "editOrder"
    | "addOrderDetail"
    | "editOrderDetail"
    | "addPayment"
    | "editPayment"
    | "deleteItem";

type ModalState = {
    type: ModalType | null;
    data?:
        | Order
        | OrderDetail
        | Payment
        | { id: string; name: string; type: "payment" | "orderDetail" };
};

export default function OrderScreen() {
    const { backgroundColor } = useAppColors();

    const [orderData, setOrderData] = useState<Order>(orderDataMock);
    const [modalState, setModalState] = useState<ModalState>({ type: null });

    const handleCloseModals = useCallback(
        () => setModalState({ type: null }),
        [],
    );

    const handleSaveOrder = useCallback(
        (order: Order) => {
            setOrderData(order);
            handleCloseModals();
        },
        [handleCloseModals],
    );

    const handleSaveOrderDetail = useCallback(
        (detail: OrderDetail) => {
            console.log("Salvando item:", detail);
            handleCloseModals();
        },
        [handleCloseModals],
    );

    const handleSavePayment = useCallback(
        (payment: Payment) => {
            console.log("Salvando pagamento:", payment);
            handleCloseModals();
        },
        [handleCloseModals],
    );

    const handleConfirmDelete = useCallback(() => {
        if (modalState.type !== "deleteItem" || !modalState.data) return;
        const { id, type } = modalState.data as { id: string; type: string };

        handleCloseModals();
    }, [modalState, handleCloseModals]);

    const orderDetailItems = useMemo(
        () =>
            orderData.details.map((detail) => {
                const status = getStatusDetails(detail.status);
                return {
                    id: detail.id,
                    title: formatOrderDetailTitle(detail),
                    info: detail.notes,
                    aditionalInfo: formatPrice(detail.total_price),
                    badgeColor: status.colorScheme,
                    badgeIcon: status.icon,
                    badgeLabel: status.label,
                };
            }),
        [orderData.details, formatOrderDetailTitle],
    );

    const paymentItems = useMemo(
        () =>
            orderData.charge.payments.map((payment) => ({
                id: payment.id,
                title: `${formatDate(payment.date)} - ${payment.method}`,
                info: formatPrice(payment.value),
            })),
        [orderData.charge.payments],
    );

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
                            <OrderInfoCard order={orderData} />

                            <InfoSwipeList
                                title="Itens"
                                icon="list"
                                items={orderDetailItems}
                                addText="Adicionar"
                                emptyStateText="Nenhum item encontrado"
                                onAddItem={() =>
                                    setModalState({ type: "addOrderDetail" })
                                }
                                onEditItem={(id) =>
                                    setModalState({
                                        type: "editOrderDetail",
                                        data: orderData.details.find(
                                            (d) => d.id === id,
                                        ),
                                    })
                                }
                                onDeleteItem={(id) => {
                                    const item = orderDetailItems.find(
                                        (i) => i.id === id,
                                    );
                                    if (item) {
                                        setModalState({
                                            type: "deleteItem",
                                            data: {
                                                id,
                                                name: item.title,
                                                type: "orderDetail",
                                            },
                                        });
                                    }
                                }}
                            />

                            <ChargeInfoCard charge={orderData.charge} />

                            <InfoSwipeList
                                title="Pagamentos"
                                icon="cash"
                                items={paymentItems}
                                addText="Adicionar"
                                emptyStateText="Nenhum pagamento realizado"
                                onAddItem={() =>
                                    setModalState({ type: "addPayment" })
                                }
                                onEditItem={(id) =>
                                    setModalState({
                                        type: "editPayment",
                                        data: orderData.charge.payments.find(
                                            (p) => p.id === id,
                                        ),
                                    })
                                }
                                onDeleteItem={(id) => {
                                    const item = paymentItems.find(
                                        (p) => p.id === id,
                                    );
                                    if (item) {
                                        setModalState({
                                            type: "deleteItem",
                                            data: {
                                                id,
                                                name: item.title,
                                                type: "payment",
                                            },
                                        });
                                    }
                                }}
                            />
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton
                action={() =>
                    setModalState({ type: "editOrder", data: orderData })
                }
                icon="create-outline"
            />

            <OrderFormModal
                title={"Editar Pedido"}
                isOpen={modalState.type === "editOrder"}
                onClose={handleCloseModals}
                onSave={handleSaveOrder}
                orderData={
                    modalState.type === "editOrder"
                        ? (modalState.data as Order)
                        : null
                }
            />

            <OrderDetailFormModal
                title={
                    modalState.type === "editOrderDetail"
                        ? "Editar Item"
                        : "Adicionar Item"
                }
                isOpen={
                    modalState.type === "addOrderDetail" ||
                    modalState.type === "editOrderDetail"
                }
                onClose={handleCloseModals}
                onSave={handleSaveOrderDetail}
                orderDetailData={
                    modalState.type === "editOrderDetail"
                        ? (modalState.data as OrderDetail)
                        : null
                }
            />

            <PaymentFormModal
                title={
                    modalState.type === "editPayment"
                        ? "Editar Pagamento"
                        : "Adicionar Pagamento"
                }
                isOpen={
                    modalState.type === "addPayment" ||
                    modalState.type === "editPayment"
                }
                onClose={handleCloseModals}
                onSave={handleSavePayment}
                paymentData={
                    modalState.type === "editPayment"
                        ? (modalState.data as Payment)
                        : null
                }
            />

            <DeleteAlert
                isOpen={modalState.type === "deleteItem"}
                onClose={handleCloseModals}
                onConfirm={handleConfirmDelete}
                prefixMessage={`Tem certeza que deseja excluir ${
                    (modalState.data as any)?.type === "payment"
                        ? "o pagamento"
                        : "o item"
                }`}
                itemName={(modalState.data as any)?.name ?? ""}
            />
        </>
    );
}
