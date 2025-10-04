import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import {
    Modal,
    FormControl,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    Icon,
    useToast,
    Select,
    CheckIcon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { Payment } from "../../types/order";
import { formatDate } from "../../utils/formatters";
import { PAYMENT_METHODS } from "../../configs/order";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Payment) => void;
    paymentData: Payment | null;
}

const createDefaultPayment = (): Payment => ({
    id: "",
    value: 0,
    date: formatDate(`${new Date()}`),
    method: "",
});

export default function PaymentFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    paymentData,
}: Props) {
    const toast = useToast();
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

    const [formData, setFormData] = useState<Payment>(createDefaultPayment());
    const [valueText, setValueText] = useState<string>("");
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialData = paymentData
                ? { ...paymentData, date: new Date(paymentData.date) }
                : createDefaultPayment();

            setFormData(initialData);
            setValueText(
                initialData.value > 0 ? String(initialData.value) : "",
            );
        } else {
            setHasAttemptedSave(false);
            setFormData(createDefaultPayment());
            setValueText("");
        }
    }, [isOpen, paymentData]);

    const isValueInvalid = useMemo(
        () => hasAttemptedSave && (!formData.value || formData.value <= 0),
        [hasAttemptedSave, formData.value],
    );

    const isDateInvalid = useMemo(
        () => hasAttemptedSave && !formData.date,
        [hasAttemptedSave, formData.date],
    );

    const isMethodInvalid = useMemo(
        () => hasAttemptedSave && !formData.method,
        [hasAttemptedSave, formData.method],
    );

    const handleInputChange = useCallback(
        (field: keyof Payment, value: any) => {
            setFormData((prevData) => ({ ...prevData, [field]: value }));
        },
        [],
    );

    const handleValueChange = useCallback(
        (text: string) => {
            const cleanedText = text
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*)\./g, "$1");
            setValueText(cleanedText);
            handleInputChange("value", parseFloat(cleanedText) || 0);
        },
        [handleInputChange],
    );

    const handleSave = useCallback(() => {
        setHasAttemptedSave(true);

        const isFormValid =
            formData.value > 0 && formData.date && formData.method;

        if (!isFormValid) {
            toast.show({
                title: "Ops! Campos obrigatórios",
                description:
                    "Por favor, preencha todos os campos corretamente.",
                placement: "top",
            });
            return;
        }

        const dataToSave = {
            ...formData,
            date: formatDate(formData.date),
        };

        onSave(dataToSave as unknown as Payment);
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
                        <FormControl isRequired isInvalid={isValueInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon as={Ionicons} name="cash" size="sm" />
                                    <Text fontWeight="medium">Valor </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={valueText}
                                onChangeText={handleValueChange}
                                placeholder="0.00"
                                keyboardType="numeric"
                                bg={backgroundColor}
                                variant="filled"
                                size="lg"
                                borderColor={
                                    isValueInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                _focus={{
                                    borderColor: isValueInvalid
                                        ? invalidColor
                                        : primaryColor,
                                    bg: backgroundColor,
                                }}
                            />
                        </FormControl>

                        <FormControl isRequired isInvalid={isDateInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="calendar"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Data </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={formatDate(formData.date)}
                                placeholder="Selecione uma data"
                                onChangeText={(text) =>
                                    handleInputChange("date", formatDate(text))
                                }
                                bg={backgroundColor}
                                variant="filled"
                                size="lg"
                                borderColor={
                                    isDateInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                            />
                        </FormControl>

                        <FormControl isRequired isInvalid={isMethodInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="wallet"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Método </Text>
                                </HStack>
                            </FormControl.Label>
                            <Select
                                selectedValue={formData.method}
                                onValueChange={(value) =>
                                    handleInputChange("method", value)
                                }
                                placeholder="Selecione um método"
                                bg={backgroundColor}
                                variant="filled"
                                size="lg"
                                borderColor={
                                    isMethodInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                _focus={{
                                    borderColor: isMethodInvalid
                                        ? invalidColor
                                        : primaryColor,
                                    bg: backgroundColor,
                                }}
                                _selectedItem={{
                                    bg: "primary.100",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                            >
                                {PAYMENT_METHODS.map((method) => (
                                    <Select.Item
                                        key={method}
                                        label={method}
                                        value={method}
                                    />
                                ))}
                            </Select>
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
                            _text={{ fontSize: "md", fontWeight: "medium" }}
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
