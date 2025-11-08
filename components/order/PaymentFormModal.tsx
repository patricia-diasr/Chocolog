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
    useToken,
    Pressable,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { DateData } from "react-native-calendars";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import { formatDate } from "../../utils/formatters";
import {
    getFirstDayOfMonth,
    getInitialDate,
    getMonthString,
} from "../../utils/dates";
import { PAYMENT_METHODS } from "../../configs/order";
import { PaymentRequest } from "../../types/order";
import Select from "../layout/Select";
import ModalCalendar from "../schedule/ModalCalendar";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PaymentRequest) => void;
    paymentData: PaymentRequest | null;
    isLoading: boolean;
}

const createDefaultPayment = (): PaymentRequest => ({
    paidAmount: 0,
    paymentMethod: "",
    paymentDate: "",
});

export default function PaymentFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    paymentData,
    isLoading,
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
    const [resolvedSecondaryColor] = useToken("colors", [secondaryColor]);

    const [formData, setFormData] = useState<PaymentRequest>(
        createDefaultPayment(),
    );
    const [valueText, setValueText] = useState<string>("");
    const [dateText, setDateText] = useState<string>("");
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const initialDate = useMemo(() => getInitialDate(), []);
    const [currentMonth, setCurrentMonth] = useState<string>(
        getMonthString(initialDate),
    );

    const isValueInvalid = useMemo(
        () =>
            hasAttemptedSave &&
            (!formData.paidAmount || formData.paidAmount <= 0),
        [hasAttemptedSave, formData.paidAmount],
    );

    const isDateInvalid = useMemo(
        () => hasAttemptedSave && !formData.paymentDate,
        [hasAttemptedSave, formData.paymentDate],
    );

    const isMethodInvalid = useMemo(
        () => hasAttemptedSave && !formData.paymentMethod,
        [hasAttemptedSave, formData.paymentMethod],
    );

    const markedDates = useMemo(() => {
        const marks: any = {};

        if (formData.paymentDate) {
            const selectedDate = formData.paymentDate.split("T")[0];
            marks[selectedDate] = {
                selected: true,
                selectedColor: resolvedSecondaryColor,
            };
        }

        return marks;
    }, [formData.paymentDate, initialDate, resolvedSecondaryColor]);

    const displayDateForCalendar = getFirstDayOfMonth(currentMonth);

    useEffect(() => {
        if (isOpen) {
            const initialData = paymentData
                ? { ...paymentData }
                : createDefaultPayment();

            if (initialData.paymentDate) {
                setDateText(formatDate(initialData.paymentDate));
            } else {
                setDateText("");
            }

            setFormData(initialData);
            setValueText(
                initialData.paidAmount > 0
                    ? String(initialData.paidAmount)
                    : "",
            );
        } else {
            setHasAttemptedSave(false);
            setFormData(createDefaultPayment());
            setValueText("");
        }
    }, [isOpen, paymentData]);

    const handleInputChange = useCallback(
        (field: keyof PaymentRequest, value: any) => {
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
            handleInputChange("paidAmount", parseFloat(cleanedText) || 0);
        },
        [handleInputChange],
    );

    const handleDayPress = useCallback(
        (day: DateData) => {
            const isoString = new Date(
                `${day.dateString}T12:00:00Z`,
            ).toISOString();

            handleInputChange("paymentDate", isoString);
            setDateText(formatDate(isoString));
            setIsCalendarOpen(false);
        },
        [handleInputChange],
    );

    const handleSave = useCallback(() => {
        setHasAttemptedSave(true);

        const isFormValid =
            formData.paidAmount > 0 &&
            !!formData.paymentDate &&
            formData.paymentMethod;

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
            paymentDate: new Date(formData.paymentDate!).toISOString(),
        };

        onSave(dataToSave as unknown as PaymentRequest);
    }, [formData, onSave, toast]);

    const handleMonthChange = useCallback((monthString: string) => {
        setCurrentMonth(monthString);
    }, []);

    return (
        <>
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
                                        <Icon
                                            as={Ionicons}
                                            name="cash"
                                            size="sm"
                                        />
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
                                <Pressable
                                    onPress={() => setIsCalendarOpen(true)}
                                >
                                    <Input
                                        value={dateText}
                                        placeholder="DD/MM/AAAA"
                                        isReadOnly
                                        bg={backgroundColor}
                                        variant="filled"
                                        size="lg"
                                        borderColor={
                                            isDateInvalid
                                                ? invalidColor
                                                : backgroundColor
                                        }
                                    />
                                </Pressable>
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
                                    modalTitle="Selecione o Método"
                                    placeholder="Selecione um método"
                                    data={PAYMENT_METHODS}
                                    selectedValue={formData.paymentMethod}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "paymentMethod",
                                            value,
                                        )
                                    }
                                    isInvalid={isMethodInvalid}
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
                                _text={{ fontSize: "md", fontWeight: "medium" }}
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

            <ModalCalendar
                handleDayPress={handleDayPress}
                markedDates={markedDates}
                isOpen={isCalendarOpen}
                handleClose={() => setIsCalendarOpen(false)}
                currentDisplayMonth={displayDateForCalendar}
                onMonthChange={handleMonthChange}
            />
        </>
    );
}
