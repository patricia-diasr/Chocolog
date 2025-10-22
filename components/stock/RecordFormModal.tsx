import { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    VStack,
    Text,
    Input,
    HStack,
    Pressable,
    Icon,
    Modal,
    Center,
    Spinner,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { RecordItem } from "../../types/stock";
import { useAppColors } from "../../hooks/useAppColors";
import { SIZES } from "../../configs/order";
import { useCustomToast } from "../../contexts/ToastProvider";
import Select from "../layout/Select";
import { Flavor } from "../../types/flavor";
import { getFlavors } from "../../services/flavorService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: RecordItem) => void;
    title: string;
    isLoading: boolean;
}

export default function RecordFormModal({
    isOpen,
    onClose,
    onSave,
    title,
    isLoading,
}: Props) {
    const {
        borderColor,
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        lightGreyColor,
        mediumGreyColor,
        darkGreyColor,
        invalidColor,
    } = useAppColors();
    const toast = useCustomToast();

    const [type, setType] = useState<"INBOUND" | "OUTBOUND" | "">("");
    const [quantity, setQuantity] = useState<string>("");
    const [flavorId, setFlavorId] = useState<number | undefined>();
    const [sizeId, setSizeId] = useState<number | undefined>();
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
    const [flavors, setFlavors] = useState<Flavor[]>([]);
    const [isSearchLoading, setIsSearchingLoading] = useState<boolean>(false);

    const isQuantityInvalid =
        hasAttemptedSave && (!quantity || parseInt(quantity) <= 0);
    const isFlavorInvalid = hasAttemptedSave && flavorId === undefined;
    const isSizeInvalid = hasAttemptedSave && sizeId === undefined;

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
        setHasAttemptedSave(false);
    }, [isOpen]);

    const handleSave = () => {
        setHasAttemptedSave(true);

        if (!type || isQuantityInvalid || isFlavorInvalid || isSizeInvalid) {
            toast.showToast({
                title: "Ops! Algo está faltando",
                description: "Por favor, preencha todos os campos obrigatórios",
                status: "warning",
            });
            return;
        }

        const quantityToMove = parseInt(quantity!);

        if (type === "OUTBOUND") {
            const selectedFlavor = flavors.find((f) => f.id === flavorId);
            const selectedSize = selectedFlavor?.sizes.find(
                (s) => s.sizeId === sizeId,
            );

            const stockAvailable = selectedSize?.totalQuantity;

            if (
                stockAvailable !== undefined &&
                quantityToMove > stockAvailable
            ) {
                toast.showToast({
                    title: "Estoque insuficiente",
                    description: `A saída (${quantityToMove}) é maior que o estoque disponível (${stockAvailable}).`,
                    status: "error",
                });

                return;
            }
        }

        const newRecord: RecordItem = {
            sizeId: sizeId!,
            flavorId: flavorId!,
            quantity: parseInt(quantity!),
            movementType: type,
        };

        setType("");
        setQuantity("");
        setFlavorId(undefined);
        setSizeId(undefined);
        setHasAttemptedSave(false);

        onSave(newRecord);
    };

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
                        <FormControl isRequired>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="swap-horizontal"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">
                                        Tipo de Operação{" "}
                                    </Text>
                                </HStack>
                            </FormControl.Label>
                            <HStack space={3} mt={2}>
                                <Pressable
                                    flex={1}
                                    onPress={() => setType("INBOUND")}
                                >
                                    <Box
                                        bg={
                                            type === "INBOUND"
                                                ? "green.100"
                                                : "gray.100"
                                        }
                                        p={4}
                                        rounded="lg"
                                        borderWidth={2}
                                        borderColor={
                                            type === "INBOUND"
                                                ? "green.600"
                                                : "gray.200"
                                        }
                                    >
                                        <VStack alignItems="center" space={1}>
                                            <Icon
                                                as={Ionicons}
                                                name="add-circle"
                                                size="lg"
                                                color={
                                                    type === "INBOUND"
                                                        ? "green.600"
                                                        : "gray.400"
                                                }
                                            />
                                            <Text
                                                color={
                                                    type === "INBOUND"
                                                        ? "green.600"
                                                        : darkGreyColor
                                                }
                                                fontWeight="medium"
                                            >
                                                Entrada
                                            </Text>
                                        </VStack>
                                    </Box>
                                </Pressable>

                                <Pressable
                                    flex={1}
                                    onPress={() => setType("OUTBOUND")}
                                >
                                    <Box
                                        bg={
                                            type === "OUTBOUND"
                                                ? "red.100"
                                                : "gray.100"
                                        }
                                        p={4}
                                        rounded="lg"
                                        borderWidth={2}
                                        borderColor={
                                            type === "OUTBOUND"
                                                ? "red.600"
                                                : "gray.200"
                                        }
                                    >
                                        <VStack alignItems="center" space={1}>
                                            <Icon
                                                as={Ionicons}
                                                name="remove-circle"
                                                size="lg"
                                                color={
                                                    type === "OUTBOUND"
                                                        ? "red.600"
                                                        : "gray.400"
                                                }
                                            />
                                            <Text
                                                color={
                                                    type === "OUTBOUND"
                                                        ? "red.600"
                                                        : darkGreyColor
                                                }
                                                fontWeight="medium"
                                            >
                                                Saída
                                            </Text>
                                        </VStack>
                                    </Box>
                                </Pressable>
                            </HStack>
                        </FormControl>

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
                                value={quantity}
                                onChangeText={(text) => {
                                    const onlyNumbers = text.replace(
                                        /[^0-9]/g,
                                        "",
                                    );
                                    setQuantity(onlyNumbers);
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
                                modalTitle="Selecione um Tamanho"
                                placeholder="Escolha o tamanho"
                                data={SIZES}
                                selectedValue={sizeId}
                                onValueChange={setSizeId}
                                isInvalid={isSizeInvalid}
                                itemValue={(item) => item.id}
                                itemLabel={(item) => item.name}
                            />
                        </FormControl>

                        <FormControl isRequired isInvalid={isFlavorInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="ice-cream"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Sabor </Text>
                                </HStack>
                            </FormControl.Label>
                            <Select
                                modalTitle="Selecione um Sabor"
                                placeholder="Escolha o sabor"
                                data={flavors}
                                selectedValue={flavorId}
                                onValueChange={setFlavorId}
                                isInvalid={isFlavorInvalid}
                                itemValue={(item) => item.id}
                                itemLabel={(item) => item.name}
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
    );
}
