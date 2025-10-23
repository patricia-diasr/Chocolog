import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Modal,
    FormControl,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    Icon,
    TextArea,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import {
    ORDER_STATUS_MAP,
    OrderRequest,
    OrderStatus,
} from "../../types/order";
import {
    applyDateMask,
    formatDate,
    parseInputDate,
} from "../../utils/formatters";
import Select from "../layout/Select";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OrderRequest) => void;
    orderData: OrderRequest | null;
    isLoading: boolean;
}

const createDefaultOrder = (): OrderRequest => ({
    employeeId: 1,
    expectedPickupDate: "",
    status: undefined,
    notes: null,
    orderItems: [],
    discount: 0,
});

export default function OrderFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    orderData,
    isLoading,
}: Props) {
    const toast = useCustomToast();
    const {
        borderColor,
        backgroundColor,
        whiteColor,
        secondaryColor,
        tertiaryColor,
        lightGreyColor,
        invalidColor,
    } = useAppColors();

    const [formData, setFormData] = useState<OrderRequest>(
        createDefaultOrder(),
    );

    const [discountText, setDiscountText] = useState<string>("");
    const [dateText, setDateText] = useState<string>("");
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

    const isEditing = !!orderData;
    const initialStatus = orderData?.status;

    useEffect(() => {
        if (isOpen) {
            const initialData = orderData
                ? { ...orderData }
                : createDefaultOrder();

            if (initialData.expectedPickupDate) {
                setDateText(formatDate(initialData.expectedPickupDate));
            } else {
                setDateText("");
            }

            setFormData(initialData);
            setDiscountText(
                initialData.discount > 0 ? String(initialData.discount) : "",
            );
        } else {
            setHasAttemptedSave(false);
            setFormData(createDefaultOrder());
            setDiscountText("");
        }
    }, [isOpen, orderData]);

    const isFormDisabled = useMemo(
        () =>
            isEditing &&
            (initialStatus === "COMPLETED" || initialStatus === "CANCELLED"),
        [isEditing, initialStatus],
    );

    const statusOptions = useMemo(() => {
        const options: { value: OrderStatus; label: string }[] = [];
        if (!isEditing) {
            return options;
        }

        const items = formData.orderItems || [];

        if (initialStatus === "PENDING") {
            options.push({ value: "PENDING", label: ORDER_STATUS_MAP.PENDING });
            const canCancel = !items.some(
                (item) => item.status === "COMPLETED",
            );

            if (canCancel) {
                options.push({
                    value: "CANCELLED",
                    label: ORDER_STATUS_MAP.CANCELLED,
                });
            }
        } else if (initialStatus === "READY_FOR_PICKUP") {
            options.push({
                value: "READY_FOR_PICKUP",
                label: ORDER_STATUS_MAP.READY_FOR_PICKUP,
            });

            const canComplete = !items.some(
                (item) => item.status === "PENDING",
            );
            if (canComplete) {
                options.push({
                    value: "COMPLETED",
                    label: ORDER_STATUS_MAP.COMPLETED,
                });
            }

            const canCancel = !items.some(
                (item) => item.status === "COMPLETED",
            );
            if (canCancel) {
                options.push({
                    value: "CANCELLED",
                    label: ORDER_STATUS_MAP.CANCELLED,
                });
            }
        } else if (initialStatus) {
            options.push({
                value: initialStatus,
                label: ORDER_STATUS_MAP[initialStatus],
            });
        }

        return options;
    }, [isEditing, initialStatus, formData.orderItems]);

    const isExpectedPickupDateInvalid = useMemo(
        () =>
            hasAttemptedSave && !formData.expectedPickupDate && !isFormDisabled,
        [hasAttemptedSave, formData.expectedPickupDate, isFormDisabled],
    );

    const isStatusInvalid = useMemo(
        () =>
            hasAttemptedSave &&
            isEditing &&
            !formData.status &&
            !isFormDisabled,
        [hasAttemptedSave, isEditing, formData.status, isFormDisabled],
    );

    const handleInputChange = useCallback(
        (field: keyof OrderRequest, value: any) => {
            setFormData((prevData) => ({ ...prevData, [field]: value }));
        },
        [],
    );

    const handleDateChange = useCallback((text: string) => {
        const maskedText = applyDateMask(text);
        setDateText(maskedText);

        const isoDateString = parseInputDate(maskedText);
        setFormData((prevData) => ({
            ...prevData,
            expectedPickupDate: isoDateString,
        }));
    }, []);

    const handleDiscountChange = useCallback((text: string) => {
        const cleanedText = text
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");

        setDiscountText(cleanedText);
        setFormData((prevData) => ({
            ...prevData,
            discount: parseFloat(cleanedText) || 0,
        }));
    }, []);

    const handleSave = useCallback(() => {
        setHasAttemptedSave(true);

        const isDueDateValid = !!formData.expectedPickupDate || isFormDisabled;
        const isStatusValid =
            (isEditing ? !!formData.status : true) || isFormDisabled;
        const isFormValid = isDueDateValid && isStatusValid;

        if (!isFormValid) {
            toast.showToast({
                title: "Ops! Campos obrigatórios",
                description:
                    "Por favor, preencha todos os campos corretamente.",
                status: "warning",
            });
            return;
        }

        if (isEditing && isFormDisabled) {
            const partialData = {
                discount: formData.discount,
                notes: formData.notes,
            };
            onSave(partialData);
            return; 
        }

        const dataToSave: OrderRequest = {
            ...formData,
            expectedPickupDate: new Date(
                formData.expectedPickupDate!,
            ).toISOString(),
            status: isEditing ? formData.status : undefined,
            orderItems: isEditing ? formData.orderItems : [],
        };

        onSave(dataToSave);
    }, [formData, onSave, toast, isEditing, isFormDisabled]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <Modal.Content
                maxWidth="400px"
                bg={whiteColor}
                rounded="2xl"
                shadow={6}
                borderWidth={1}
                borderColor={borderColor}
            >
                <Modal.CloseButton rounded="full" _icon={{ size: "sm" }} />
                <Modal.Header bg="transparent" borderBottomWidth={0} pb={2}>
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={secondaryColor}
                    >
                        {title}
                    </Text>
                </Modal.Header>
                <Modal.Body
                    px={6}
                    py={5}
                    borderTopWidth={1.5}
                    borderBottomWidth={1.5}
                    borderColor={lightGreyColor}
                >
                    <VStack space={5}>
                        {isEditing && (
                            <FormControl isRequired isInvalid={isStatusInvalid}>
                                <FormControl.Label>
                                    <HStack alignItems="center" space={2}>
                                        <Icon
                                            as={Ionicons}
                                            name="checkmark-done"
                                            size="sm"
                                        />
                                        <Text fontWeight="medium">Status </Text>
                                    </HStack>
                                </FormControl.Label>
                                <Select
                                    modalTitle="Selecione o Status"
                                    placeholder="Selecione um status"
                                    data={statusOptions}
                                    itemValue={(item) => item.value}
                                    itemLabel={(item) => item.label}
                                    selectedValue={formData.status || ""}
                                    onValueChange={(value) =>
                                        handleInputChange("status", value)
                                    }
                                    isInvalid={isStatusInvalid}
                                    isDisabled={isFormDisabled}
                                />
                            </FormControl>
                        )}

                        <FormControl
                            isRequired
                            isInvalid={isExpectedPickupDateInvalid}
                        >
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="hourglass"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Prazo </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={dateText}
                                placeholder="DD/MM/AAAA"
                                onChangeText={handleDateChange}
                                keyboardType="numeric"
                                maxLength={10}
                                bg={backgroundColor}
                                variant="filled"
                                size="lg"
                                borderColor={
                                    isExpectedPickupDateInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                isDisabled={isFormDisabled}
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon as={Ionicons} name="gift" size="sm" />
                                    <Text fontWeight="medium">Desconto</Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={discountText}
                                onChangeText={handleDiscountChange}
                                placeholder="0.00"
                                keyboardType="numeric"
                                bg={backgroundColor}
                                variant="filled"
                                size="lg"
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="document-text"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Observação</Text>
                                </HStack>
                            </FormControl.Label>
                            <TextArea
                                value={formData.notes || ""}
                                onChangeText={(text) =>
                                    handleInputChange("notes", text)
                                }
                                placeholder="Alguma observação sobre o pedido..."
                                bg={backgroundColor}
                                variant="filled"
                                h={20}
                            />
                        </FormControl>
                    </VStack>
                </Modal.Body>
                <Modal.Footer bg="transparent" pt={4}>
                    <Button.Group space={3} flex={1}>
                        <Button
                            variant="ghost"
                            colorScheme="gray"
                            onPress={onClose}
                            rounded="xl"
                            flex={1}
                            py={3}
                            isDisabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onPress={handleSave}
                            size="lg"
                            colorScheme="secondary"
                            rounded="xl"
                            _pressed={{ bg: tertiaryColor }}
                            _hover={{ bg: tertiaryColor }}
                            flex={1}
                            py={3}
                            shadow={2}
                            _text={{ fontSize: "md", fontWeight: "medium" }}
                            isLoading={isLoading}
                            isLoadingText="Salvando..."
                            _loading={{ bg: tertiaryColor }}
                        >
                            Salvar
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
