import { Box, Center, ScrollView, Spinner, VStack, Text } from "native-base";
import { useAppColors } from "../hooks/useAppColors";
import { useCallback, useEffect, useMemo, useState } from "react";

import FabButton from "../components/layout/FabButton";
import OrderInfoCard from "../components/order/OrderInfoCard";
import ChargeInfoCard from "../components/order/ChargeInfoCard";
import InfoSwipeList from "../components/layout/InfoSwipeList";
import DeleteAlert from "../components/layout/DeleteAlert";
import OrderFormModal from "../components/order/OrderFormModal";
import OrderDetailFormModal from "../components/order/OrderDetailFormModal";
import PaymentFormModal from "../components/order/PaymentFormModal";

import {
    OrderItemRequest,
    OrderItemResponse,
    OrderRequest,
    OrderResponse,
    Payment,
} from "../types/order";
import { getStatusDetails } from "../utils/statusConfig";
import {
    formatDate,
    formatOrderDetailTitle,
    formatPrice,
} from "../utils/formatters";
import { useCustomToast } from "../contexts/ToastProvider";
import { RootStackParamList } from "../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { createItem, deleteItem, getOrder, updateItem, updateOrder } from "../services/orderService";

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
        | OrderRequest
        | OrderResponse
        | OrderItemRequest
        | OrderItemResponse
        | Payment
        | { id: number; name: string; type: "payment" | "orderDetail" };
};

type OrderScreenRouteProp = RouteProp<RootStackParamList, "Order">;

type Props = {
    route: OrderScreenRouteProp;
};

export default function OrderScreen({ route }: Props) {
    const { backgroundColor, secondaryColor, mediumGreyColor } = useAppColors();
    const { customerId, orderId } = route.params;
    const toast = useCustomToast();

    const [orderData, setOrderData] = useState<OrderResponse>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);
    const [isOrderFinalized, setIsOrderFinalized] = useState<boolean>(false);
    const [modalState, setModalState] = useState<ModalState>({ type: null });

    const fetchOrder = useCallback(async () => {
        setIsLoading(true);

        try {
            const orderData = await getOrder(customerId, orderId);
            setOrderData(orderData);

            const isOrderFinalized =
                orderData.status === "COMPLETED" ||
                orderData.status === "CANCELLED";

            setIsOrderFinalized(isOrderFinalized);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar o pedido. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, customerId, orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleCloseModals = useCallback(
        () => setModalState({ type: null }),
        [],
    );

    const handleSaveOrder = async (updatedData: OrderRequest) => {
        setIsSavingLoading(true);

        try {
            const updated = await updateOrder(
                customerId,
                orderId,
                updatedData,
            );
            fetchOrder();

            toast.showToast({
                title: "Sucesso!",
                description: "Pedido atualizado.",
                status: "success",
            });

            handleCloseModals();
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível atualizar o pedido.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const handleSaveOrderDetail = async (itemData: OrderItemRequest) => {
        setIsSavingLoading(true);
        
        const isEditing = modalState.type === "editOrderDetail";
        const itemId = isEditing ? (modalState.data as OrderItemResponse)?.id : null;
        
        if (!orderData) {
            toast.showToast({
                title: "Erro!",
                description: "Dados do pedido não encontrados.",
                status: "error",
            });
            setIsSavingLoading(false);
            return;
        }

        if (isEditing && !itemId) {
            toast.showToast({
                title: "Erro!",
                description: "ID do item não encontrado para editar.",
                status: "error",
            });
            setIsSavingLoading(false);
            return;
        }

        try {
            if (isEditing) {
                const updatedItem = await updateItem(
                    customerId,
                    orderId,
                    itemId!,
                    itemData,
                );
                
                setOrderData((prevData) => {
                    if (!prevData) return prevData;
                    const updatedItems = prevData.orderItems.map((item) =>
                        item.id === updatedItem.id ? updatedItem : item,
                    );

                    return { ...prevData, orderItems: updatedItems };
                });

                toast.showToast({
                    title: "Sucesso!",
                    description: "Item atualizado.",
                    status: "success",
                });
            } else {
                const newItem = await createItem(customerId, orderId, itemData);

                setOrderData((prevData) => {
                    if (!prevData) return prevData;

                    return {
                        ...prevData,
                        orderItems: [...prevData.orderItems, newItem],
                    };
                });

                toast.showToast({
                    title: "Sucesso!",
                    description: "Item criado.",
                    status: "success",
                });
            }

            fetchOrder();
            handleCloseModals();
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível salvar o item.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const handleSavePayment = useCallback(
        (payment: Payment) => {
            toast.showToast({
                title: "Sucesso!",
                description: "O pagamento foi salvo.",
                status: "success",
            });
            handleCloseModals();
        },
        [handleCloseModals, toast],
    );

    const handleConfirmDelete = useCallback(async () => {
        if (modalState.type !== "deleteItem" || !modalState.data) return;

        const { id, type } = modalState.data as {
            id: number;
            name: string;
            type: "payment" | "orderDetail";
        };

        setIsSavingLoading(true); 

        try {
            if (type === "orderDetail") {
                await deleteItem(customerId, orderId, id);

                setOrderData((prevData) => {
                    if (!prevData) return prevData;
                    const updatedItems = prevData.orderItems.filter(
                        (item) => item.id !== id,
                    );
                    return { ...prevData, orderItems: updatedItems };
                });
            } 
            toast.showToast({
                title: "Sucesso!",
                description: `O ${
                    type === "orderDetail" ? "item" : "pagamento"
                } foi excluído.`,
                status: "success",
            });

            fetchOrder();
            handleCloseModals();
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: `Não foi possível excluir o ${
                    type === "orderDetail" ? "item" : "pagamento"
                }.`,
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    }, [modalState, handleCloseModals, toast, customerId, orderId]);

    const orderDetailItems = useMemo(
        () =>
            orderData?.orderItems.map((item) => {
                const status = getStatusDetails(item.status);
                return {
                    id: item.id,
                    title: formatOrderDetailTitle(item),
                    info: item.notes,
                    aditionalInfo: formatPrice(item.totalPrice),
                    badgeColor: status.colorScheme,
                    badgeIcon: status.icon,
                    badgeLabel: status.label,
                    itemActionsDisabled: item.status === "COMPLETED" || item.status === "CANCELLED",
                };
            }),
        [orderData?.orderItems],
    );

    const paymentItems = useMemo(
        () =>
            orderData?.charges.payments.map((payment) => ({
                id: payment.id,
                title: `${formatDate(payment.date)} - ${payment.method}`,
                info: formatPrice(payment.value),
            })),
        [orderData?.charges.payments],
    );

    if (isLoading || orderData === undefined) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando pedido...
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
                                        data: orderData.orderItems.find(
                                            (d) => d.id === id,
                                        ),
                                    })
                                }
                                onDeleteItem={(id) => {
                                    const item = orderDetailItems?.find(
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
                                actionsDisabled={isOrderFinalized}
                                disableDeleteOnSingleItem={true}
                            />

                            <ChargeInfoCard charge={orderData.charges} />

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
                                        data: orderData.charges.payments.find(
                                            (p) => p.id === id,
                                        ),
                                    })
                                }
                                onDeleteItem={(id) => {
                                    const item = paymentItems?.find(
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
                        ? (modalState.data as OrderRequest)
                        : null
                }
                isLoading={isSavingLoading}
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
                        ? (modalState.data as OrderItemRequest)
                        : null
                }
                isLoading={isSavingLoading}
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
                isLoading={isSavingLoading}
            />
        </>
    );
}
