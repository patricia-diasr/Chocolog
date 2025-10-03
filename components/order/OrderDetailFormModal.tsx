import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    CheckIcon,
    FormControl,
    Select,
    VStack,
    Text,
    useToast,
    Input,
    HStack,
    Icon,
    Modal,
    TextArea,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { OrderDetail } from "../../types/order";
import { flavors, sizes } from "../../constants/order";

interface OrderDetailFormModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OrderDetail) => void;
    orderDetailData: OrderDetail | null;
}

const createDefaultOrderDetail = (): OrderDetail => ({
    id: "",
    quantity: 0,
    size: "",
    flavor1: "",
    flavor2: "",
    notes: "",
    unit_price: 0,
    total_price: 0,
    status: "pending",
    custom_made: false,
});

export default function OrderDetailFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    orderDetailData,
}: OrderDetailFormModalProps) {
    const toast = useToast();
    const {
        backgroundColor,
        whiteColor,
        lightGreyColor,
        primaryColor,
        secondaryColor,
        borderColor,
        invalidColor,
    } = useAppColors();

    const [formData, setFormData] = useState<OrderDetail>(
        createDefaultOrderDetail,
    );
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialData = orderDetailData
                ? orderDetailData
                : createDefaultOrderDetail();
            setFormData(initialData);
        } else {
            setHasAttemptedSave(false);
            setFormData(createDefaultOrderDetail());
        }
    }, [isOpen, orderDetailData]);

    const isQuantityInvalid = useMemo(
        () =>
            hasAttemptedSave && (!formData.quantity || formData.quantity <= 0),
        [hasAttemptedSave, formData.quantity],
    );

    const isFlavor1Invalid = useMemo(
        () => hasAttemptedSave && !formData.flavor1,
        [hasAttemptedSave, formData.flavor1],
    );

    const isSizeInvalid = useMemo(
        () => hasAttemptedSave && !formData.size,
        [hasAttemptedSave, formData.size],
    );

    const handleInputChange = useCallback(
        (field: keyof OrderDetail, value: any) => {
            setFormData((prevData) => ({ ...prevData, [field]: value }));
        },
        [],
    );

    const handleSave = useCallback(() => {
        setHasAttemptedSave(true);

        const isFormValid =
            formData.quantity > 0 && formData.flavor1 && formData.size;

        if (!isFormValid) {
            toast.show({
                title: "Ops! Algo está faltando",
                description: "Por favor, preencha todos os campos obrigatórios",
                status: "warning",
                duration: 3000,
                placement: "top",
            });

            return;
        }

        onSave(formData as unknown as OrderDetail);
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
                        <FormControl isRequired isInvalid={isQuantityInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="calculator"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Quantidade </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                keyboardType="numeric"
                                value={formData.quantity}
                                onChangeText={(text) => {
                                    const onlyNumbers = text.replace(
                                        /[^0-9]/g,
                                        "",
                                    );
                                    handleInputChange("quantity", onlyNumbers);
                                }}
                                placeholder="Ex: 10"
                                bg={backgroundColor}
                                borderColor={
                                    isQuantityInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                fontSize="md"
                                py={2}
                                size="lg"
                                variant="filled"
                                _focus={{
                                    borderColor: isQuantityInvalid
                                        ? invalidColor
                                        : primaryColor,
                                    bg: backgroundColor,
                                }}
                            />
                        </FormControl>

                        <FormControl isRequired isInvalid={isSizeInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="resize"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Tamanho </Text>
                                </HStack>
                            </FormControl.Label>
                            <Select
                                selectedValue={formData.size}
                                onValueChange={(value) =>
                                    handleInputChange("size", value)
                                }
                                placeholder="Escolha o tamanho"
                                bg={backgroundColor}
                                borderColor={
                                    isSizeInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                fontSize="md"
                                py={2}
                                size="lg"
                                variant="filled"
                                _focus={{
                                    borderColor: isSizeInvalid
                                        ? invalidColor
                                        : primaryColor,
                                    bg: backgroundColor,
                                }}
                                _selectedItem={{
                                    bg: "primary.100",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                _input={{
                                    showSoftInputOnFocus: false,
                                }}
                            >
                                {sizes.map((sizeOption) => (
                                    <Select.Item
                                        key={sizeOption}
                                        label={sizeOption}
                                        value={sizeOption}
                                    />
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired isInvalid={isFlavor1Invalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="ice-cream"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Sabor 1 </Text>
                                </HStack>
                            </FormControl.Label>
                            <Select
                                selectedValue={formData.flavor1}
                                onValueChange={(value) =>
                                    handleInputChange("flavor1", value)
                                }
                                placeholder="Escolha o primeiro sabor"
                                bg={backgroundColor}
                                borderColor={
                                    isFlavor1Invalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                fontSize="md"
                                py={2}
                                size="lg"
                                variant="filled"
                                _focus={{
                                    borderColor: isFlavor1Invalid
                                        ? invalidColor
                                        : primaryColor,
                                    bg: backgroundColor,
                                }}
                                _selectedItem={{
                                    bg: "primary.100",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                _input={{
                                    showSoftInputOnFocus: false,
                                }}
                            >
                                {flavors.map((flavorOption) => (
                                    <Select.Item
                                        key={flavorOption}
                                        label={flavorOption}
                                        value={flavorOption}
                                    />
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="ice-cream-outline"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Sabor 2 </Text>
                                </HStack>
                            </FormControl.Label>
                            <Select
                                selectedValue={formData.flavor2}
                                onValueChange={(value) =>
                                    handleInputChange("flavor2", value)
                                }
                                placeholder="Escolha o segundo sabor"
                                bg={backgroundColor}
                                borderColor={backgroundColor}
                                fontSize="md"
                                py={2}
                                size="lg"
                                variant="filled"
                                _focus={{
                                    borderColor: primaryColor,
                                    bg: backgroundColor,
                                }}
                                _selectedItem={{
                                    bg: primaryColor,
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                _input={{
                                    showSoftInputOnFocus: false,
                                }}
                            >
                                {flavors.map((flavorOption) => (
                                    <Select.Item
                                        key={flavorOption}
                                        label={flavorOption}
                                        value={flavorOption}
                                    />
                                ))}
                            </Select>
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
                                onChangeText={(value) =>
                                    handleInputChange("notes", value)
                                }
                                placeholder="Informações adicionais..."
                                bg={backgroundColor}
                                variant="filled"
                                h={20}
                            />
                        </FormControl>
                    </VStack>
                </Modal.Body>
                <Modal.Footer bg="transparent" pt={4} borderTopWidth={0}>
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
                            _pressed={{ bg: "tertiary.600" }}
                            _hover={{ bg: "tertiary.600" }}
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
