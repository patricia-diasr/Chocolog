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
import { Order, ORDER_STATUS } from "../../types/order";
import { formatDate } from "../../utils/formatters";
import Select from "../layout/Select";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Order) => void;
    orderData: Order | null;
}

const createDefaultOrder = (): Order => ({
    id: "",
    created_date: new Date().toString(),
    due_date: "",
    notes: "",
    status: "pending",
    pickup_date: undefined,
    details: [],
    charge: {
        id: "",
        date: new Date().toString(),
        status: "pending",
        discount: 0,
        subtotal: 0,
        total: 0,
        payments: [],
    },
});

export default function OrderFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    orderData,
}: Props) {
    const toast = useCustomToast();
    const {
        borderColor,
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        lightGreyColor,
        invalidColor,
    } = useAppColors();

    const [formData, setFormData] = useState<Order>(createDefaultOrder());
    const [discountText, setDiscountText] = useState<string>("");
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialData = orderData
                ? {
                      ...createDefaultOrder(),
                      ...orderData,
                      due_date: orderData.due_date
                          ? new Date(orderData.due_date).toString()
                          : "",
                      pickup_date: orderData.pickup_date
                          ? new Date(orderData.pickup_date).toString()
                          : undefined,
                  }
                : createDefaultOrder();

            setFormData(initialData);
            setDiscountText(
                initialData.charge.discount > 0
                    ? String(initialData.charge.discount)
                    : "",
            );
        } else {
            setHasAttemptedSave(false);
            setFormData(createDefaultOrder());
            setDiscountText("");
        }
    }, [isOpen, orderData]);

    const isDueDateInvalid = useMemo(
        () => hasAttemptedSave && !formData.due_date,
        [hasAttemptedSave, formData.due_date],
    );

    const isStatusInvalid = useMemo(
        () => hasAttemptedSave && !formData.status,
        [hasAttemptedSave, formData.status],
    );

    const isPickupDateInvalid = useMemo(
        () =>
            hasAttemptedSave &&
            formData.status === "completed" &&
            !formData.pickup_date,
        [hasAttemptedSave, formData.status, formData.pickup_date],
    );

    const handleInputChange = useCallback((field: keyof Order, value: any) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    }, []);

    const handleDiscountChange = useCallback((text: string) => {
        const cleanedText = text
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");

        setDiscountText(cleanedText);
        setFormData((prevData) => ({
            ...prevData,
            charge: {
                ...prevData.charge,
                discount: parseFloat(cleanedText) || 0,
            },
        }));
    }, []);

    const handleSave = useCallback(() => {
        setHasAttemptedSave(true);

        const isFormValid =
            formData.due_date &&
            formData.status &&
            (formData.status !== "completed" || formData.pickup_date);

        if (!isFormValid) {
            toast.showToast({
                title: "Ops! Campos obrigatórios",
                description:
                    "Por favor, preencha todos os campos corretamente.",
                status: "warning",
            });
            return;
        }

        const dataToSave = {
            ...formData,
            due_date: new Date(formData.due_date).toISOString(),
            pickup_date: formData.pickup_date
                ? new Date(formData.pickup_date).toISOString()
                : null,
        };

        onSave(dataToSave as any);
    }, [formData, onSave, toast]);

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
                                data={ORDER_STATUS}
                                itemValue={(item) => item.value}
                                itemLabel={(item) => item.label}
                                selectedValue={formData.status}
                                onValueChange={(value) =>
                                    handleInputChange("status", value)
                                }
                                isInvalid={isStatusInvalid}
                            />
                        </FormControl>

                        <FormControl isRequired isInvalid={isDueDateInvalid}>
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
                                value={formatDate(formData.due_date)}
                                placeholder="Selecione uma data"
                                onChangeText={(text) =>
                                    handleInputChange(
                                        "due_date",
                                        formatDate(text),
                                    )
                                }
                                bg={backgroundColor}
                                variant="filled"
                                size="lg"
                                borderColor={
                                    isDueDateInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                            />
                        </FormControl>

                        {formData.status === "completed" && (
                            <FormControl
                                isRequired
                                isInvalid={isPickupDateInvalid}
                            >
                                <FormControl.Label>
                                    <HStack alignItems="center" space={2}>
                                        <Icon
                                            as={Ionicons}
                                            name="calendar"
                                            size="sm"
                                        />
                                        <Text fontWeight="medium">
                                            Retirada{" "}
                                        </Text>
                                    </HStack>
                                </FormControl.Label>

                                <Input
                                    value={
                                        formData.pickup_date &&
                                        formatDate(formData.pickup_date)
                                    }
                                    placeholder="Selecione uma data"
                                    onChangeText={(text) =>
                                        handleInputChange(
                                            "pickup_date",
                                            formatDate(text),
                                        )
                                    }
                                    bg={backgroundColor}
                                    variant="filled"
                                    size="lg"
                                    borderColor={
                                        isPickupDateInvalid
                                            ? invalidColor
                                            : backgroundColor
                                    }
                                />
                            </FormControl>
                        )}

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
                                value={formData.notes}
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
                        >
                            Salvar
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
