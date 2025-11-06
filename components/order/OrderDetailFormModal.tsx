import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    FormControl,
    VStack,
    Text,
    Input,
    HStack,
    Icon,
    Modal,
    TextArea,
    Center,
    Spinner,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import { getFlavors } from "../../services/flavorService";
import { SIZES } from "../../configs/order";
import {
    ORDER_STATUS_MAP,
    OrderItemRequest,
    OrderStatus,
} from "../../types/order";
import Select from "../layout/Select";
import { Flavor } from "../../types/flavor";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OrderItemRequest) => void;
    orderDetailData: OrderItemRequest | null;
    isLoading: boolean;
}

function createDefaultOrderItemRequest(): OrderItemRequest {
    return {
        quantity: 1,
        sizeId: 0,
        flavor1Id: 0,
        flavor2Id: null,
        notes: null,
    };
}

export default function OrderItemRequestFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    orderDetailData,
    isLoading,
}: Props) {
    const toast = useCustomToast();
    const {
        backgroundColor,
        whiteColor,
        lightGreyColor,
        mediumGreyColor,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        borderColor,
        invalidColor,
    } = useAppColors();

    const [formData, setFormData] = useState<OrderItemRequest>(
        createDefaultOrderItemRequest(),
    );
    const [flavors, setFlavors] = useState<Flavor[]>([]);
    const [isSearchLoading, setIsSearchingLoading] = useState<boolean>(false);
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

    const isEditing = !!orderDetailData;
    const initialStatus = orderDetailData?.status;

    const isFormDisabled = useMemo(
        () =>
            isEditing &&
            (initialStatus === "COMPLETED" || initialStatus === "CANCELLED"),
        [isEditing, initialStatus],
    );

    const statusOptions = useMemo(() => {
        if (!isEditing) return [];

        const options: { id: OrderStatus; name: string }[] = [];

        if (initialStatus === "PENDING") {
            options.push(
                { id: "PENDING", name: ORDER_STATUS_MAP.PENDING },
                {
                    id: "READY_FOR_PICKUP",
                    name: ORDER_STATUS_MAP.READY_FOR_PICKUP,
                },
            );
        } else if (initialStatus === "READY_FOR_PICKUP") {
            options.push(
                {
                    id: "READY_FOR_PICKUP",
                    name: ORDER_STATUS_MAP.READY_FOR_PICKUP,
                },
                { id: "COMPLETED", name: ORDER_STATUS_MAP.COMPLETED },
            );
        } else if (initialStatus) {
            options.push({
                id: initialStatus,
                name: ORDER_STATUS_MAP[initialStatus],
            });
        }

        return options;
    }, [isEditing, initialStatus]);

    const isQuantityInvalid = useMemo(
        () =>
            hasAttemptedSave && (!formData.quantity || formData.quantity <= 0),
        [hasAttemptedSave, formData.quantity],
    );

    const isFlavor1Invalid = useMemo(
        () => hasAttemptedSave && !formData.flavor1Id,
        [hasAttemptedSave, formData.flavor1Id],
    );

    const isSizeInvalid = useMemo(
        () => hasAttemptedSave && !formData.sizeId,
        [hasAttemptedSave, formData.sizeId],
    );

    const fetchFlavors = useCallback(async () => {
        setIsSearchingLoading(true);

        try {
            const flavorsData = await getFlavors();
            setFlavors(flavorsData);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os sabores. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsSearchingLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchFlavors();
    }, [fetchFlavors]);

    useEffect(() => {
        if (isOpen) {
            const initialData = orderDetailData
                ? { ...orderDetailData }
                : createDefaultOrderItemRequest();
            setFormData(initialData);
        } else {
            setHasAttemptedSave(false);
            setFormData(createDefaultOrderItemRequest());
        }
    }, [isOpen, orderDetailData]);

    const handleInputChange = useCallback(
        (field: keyof OrderItemRequest, value: any) => {
            setFormData((prevData) => ({ ...prevData, [field]: value }));
        },
        [],
    );

    const handleSave = useCallback(() => {
        setHasAttemptedSave(true);

        const isFormValid =
            formData.quantity > 0 && !!formData.flavor1Id && !!formData.sizeId;

        if (!isFormValid) {
            toast.showToast({
                title: "Ops! Algo está faltando",
                description: "Por favor, preencha todos os campos obrigatórios",
                status: "warning",
            });
            return;
        }

        const dataToSave: OrderItemRequest = {
            ...formData,
            status: isEditing ? formData.status : undefined,
        };

        onSave(dataToSave);
    }, [formData, onSave, toast, isEditing]);

    if (isSearchLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando sabores...
                </Text>
            </Center>
        );
    }

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
                        {isEditing && statusOptions.length > 0 && (
                            <FormControl>
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
                                    modalTitle="Selecione um Status"
                                    placeholder="Escolha o status"
                                    data={statusOptions}
                                    selectedValue={formData.status || ""}
                                    onValueChange={(value) =>
                                        handleInputChange("status", value)
                                    }
                                    isDisabled={isFormDisabled}
                                    itemValue={(item) => item.id}
                                    itemLabel={(item) => item.name}
                                />
                            </FormControl>
                        )}

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
                                isDisabled={isFormDisabled}
                                keyboardType="numeric"
                                value={formData.quantity.toString()}
                                onChangeText={(text) => {
                                    const onlyNumbers = text.replace(
                                        /[^0-9]/g,
                                        "",
                                    );
                                    handleInputChange(
                                        "quantity",
                                        Number(onlyNumbers) || 0,
                                    );
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
                                isDisabled={isFormDisabled}
                                modalTitle="Selecione um Tamanho"
                                placeholder="Escolha o tamanho"
                                data={SIZES}
                                selectedValue={formData.sizeId || 0}
                                onValueChange={(value) =>
                                    handleInputChange("sizeId", value)
                                }
                                isInvalid={isSizeInvalid}
                                itemValue={(item) => item.id}
                                itemLabel={(item) => item.name}
                            />
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
                                isDisabled={isFormDisabled}
                                modalTitle="Selecione um Sabor"
                                placeholder="Escolha o primeiro sabor"
                                data={flavors.filter(
                                    (f) => f.id !== formData.flavor2Id,
                                )}
                                selectedValue={formData.flavor1Id}
                                onValueChange={(value) =>
                                    handleInputChange(
                                        "flavor1Id",
                                        Number(value),
                                    )
                                }
                                isInvalid={isFlavor1Invalid}
                                itemValue={(item) => item.id}
                                itemLabel={(item) => item.name}
                            />
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
                                isDisabled={isFormDisabled}
                                modalTitle="Selecione um Sabor"
                                placeholder="Escolha o segundo sabor (opcional)"
                                data={flavors.filter(
                                    (f) => f.id !== formData.flavor1Id,
                                )}
                                selectedValue={formData.flavor2Id || ""}
                                onValueChange={(value) =>
                                    handleInputChange(
                                        "flavor2Id",
                                        value ? Number(value) : null,
                                    )
                                }
                                itemValue={(item) => item.id}
                                itemLabel={(item) => item.name}
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
                                isDisabled={isFormDisabled}
                                value={formData.notes || ""}
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
                            isDisabled={isFormDisabled}
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
