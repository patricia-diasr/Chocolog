import React, { useEffect, useState } from "react";
import {
    Modal,
    FormControl,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    Icon,
    Divider,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import {
    Flavor,
    FlavorFormData,
    FlavorSize,
    InputData,
} from "../../types/flavor";
import { PriceInputRow } from "./PriceInputRow";

interface FlavorFormModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Flavor) => void;
    formData: FlavorFormData;
    setFormData: (data: FlavorFormData) => void;
    editingFlavor?: Flavor | null;
    isLoading: boolean;
}

const SIZES = ["350g", "500g", "Coração", "1Kg"];

export default function FlavorFormModal({
    isOpen,
    onClose,
    onSave,
    title,
    formData,
    setFormData,
    editingFlavor,
    isLoading,
}: FlavorFormModalProps) {
    const toast = useCustomToast();
    const {
        primaryColor,
        secondaryColor,
        tertiaryColor,
        borderColor,
        backgroundColor,
        whiteColor,
        lightGreyColor,
        darkGreyColor,
        invalidColor,
    } = useAppColors();

    const [hasAttemptedSave, setHasAttemptedSave] = useState<boolean>(false);

    const [inputData, setInputData] = useState<InputData>({
        flavor: "",
        prices: [],
    });

    useEffect(() => {
        if (isOpen) {
            const initialPrices = SIZES.map((size) => {
                const existingPrice = formData.prices.find(
                    (p) => p.size === size,
                );
                return {
                    size: size,
                    salePrice: existingPrice?.salePrice || 0,
                    costPrice: existingPrice?.costPrice || 0,
                };
            });

            const initialInputPrices = initialPrices.map((p) => ({
                size: p.size,
                salePrice: p.salePrice > 0 ? p.salePrice.toString() : "",
                costPrice: p.costPrice > 0 ? p.costPrice.toString() : "",
            }));

            setFormData({ flavor: formData.flavor, prices: initialPrices });
            setInputData({
                flavor: formData.flavor,
                prices: initialInputPrices,
            });
        } else {
            setHasAttemptedSave(false);
            setInputData({ flavor: "", prices: [] });
        }
    }, [isOpen]);

    const handleFlavorChange = (text: string) => {
        setInputData((prev) => ({ ...prev, flavor: text }));
        setFormData((prev) => ({ ...prev, flavor: text }));
    };

    const handlePriceChange = (
        size: string,
        priceType: "salePrice" | "costPrice",
        text: string,
    ) => {
        const cleanedText = text
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");

        const numericValue = parseFloat(cleanedText) || 0;

        setInputData((prev) => {
            const newPrices = [...prev.prices];
            const priceIndex = newPrices.findIndex((p) => p.size === size);
            if (priceIndex > -1) {
                newPrices[priceIndex] = {
                    ...newPrices[priceIndex],
                    [priceType]: cleanedText,
                };
            }
            return { ...prev, prices: newPrices };
        });

        setFormData((prev) => {
            const newPrices = [...prev.prices];
            const priceIndex = newPrices.findIndex((p) => p.size === size);
            if (priceIndex > -1) {
                newPrices[priceIndex] = {
                    ...newPrices[priceIndex],
                    [priceType]: numericValue,
                };
            }
            return { ...prev, prices: newPrices };
        });
    };

    const handleSubmit = () => {
        setHasAttemptedSave(true);

        const isFlavorValid = formData.flavor.trim() !== "";
        const areAllPricesValid = formData.prices.every(
            (p) => p.salePrice > 0 && p.costPrice > 0,
        );

        if (!isFlavorValid || !areAllPricesValid) {
            toast.showToast({
                title: "Ops! Campos obrigatórios",
                description:
                    "Por favor, preencha o nome do sabor e todos os preços de custo e venda.",
                status: "warning",
            });
            return;
        }

        const newSizes: FlavorSize[] = formData.prices.map((price, index) => {
            const originalSize = editingFlavor?.sizes.find(
                (s) => s.name === price.size,
            );

            return {
                sizeId: originalSize?.sizeId ?? index + 1,
                name: price.size,
                salePrice: price.salePrice,
                costPrice: price.costPrice,
                totalQuantity: originalSize?.totalQuantity ?? 0,
                remainingQuantity: originalSize?.remainingQuantity ?? 0,
            };
        });

        const flavorToSave: Flavor = {
            id: editingFlavor?.id ?? 0,
            name: formData.flavor.trim(),
            sizes: newSizes,
        };

        onSave(flavorToSave);
    };

    const isFlavorInvalid = hasAttemptedSave && !formData.flavor.trim();

    if (!formData) return null;

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
                        <FormControl isRequired isInvalid={isFlavorInvalid}>
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon as={Ionicons} name="text" size="sm" />
                                    <Text fontWeight="medium">
                                        Nome do Sabor
                                    </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={inputData.flavor}
                                onChangeText={handleFlavorChange}
                                placeholder="Ex: Brigadeiro"
                                bg={backgroundColor}
                                borderColor={
                                    isFlavorInvalid
                                        ? invalidColor
                                        : backgroundColor
                                }
                                fontSize="md"
                                py={2}
                                size="lg"
                                variant="filled"
                                _focus={{
                                    borderColor: isFlavorInvalid
                                        ? invalidColor
                                        : primaryColor,
                                    bg: backgroundColor,
                                }}
                            />
                        </FormControl>

                        <Divider my={2} bg={lightGreyColor} />

                        <VStack space={4}>
                            <FormControl isRequired>
                                <FormControl.Label>
                                    <HStack alignItems="center" space={2}>
                                        <Icon
                                            as={Ionicons}
                                            name="pricetag"
                                            size="sm"
                                        />
                                        <Text fontWeight="medium">
                                            Preços de Venda
                                        </Text>
                                    </HStack>
                                </FormControl.Label>
                                <VStack space={3}>
                                    {SIZES.map((size) => {
                                        const priceItem = formData.prices.find(
                                            (p) => p.size === size,
                                        );
                                        const inputItem = inputData.prices.find(
                                            (p) => p.size === size,
                                        );
                                        const isInvalid =
                                            hasAttemptedSave &&
                                            (!priceItem ||
                                                priceItem.salePrice <= 0);

                                        return (
                                            <PriceInputRow
                                                key={`${size}-sale`}
                                                size={size}
                                                value={
                                                    inputItem?.salePrice || ""
                                                }
                                                onChange={(text) =>
                                                    handlePriceChange(
                                                        size,
                                                        "salePrice",
                                                        text,
                                                    )
                                                }
                                                isInvalid={isInvalid}
                                                themeColors={{
                                                    backgroundColor,
                                                    invalidColor,
                                                    primaryColor,
                                                    darkGreyColor,
                                                }}
                                            />
                                        );
                                    })}
                                </VStack>
                            </FormControl>

                            <Divider my={2} bg={lightGreyColor} />

                            <FormControl isRequired>
                                <FormControl.Label>
                                    <HStack alignItems="center" space={2}>
                                        <Icon
                                            as={Ionicons}
                                            name="wallet"
                                            size="sm"
                                        />
                                        <Text fontWeight="medium">
                                            Preços de Custo
                                        </Text>
                                    </HStack>
                                </FormControl.Label>
                                <VStack space={3}>
                                    {SIZES.map((size) => {
                                        const priceItem = formData.prices.find(
                                            (p) => p.size === size,
                                        );
                                        const inputItem = inputData.prices.find(
                                            (p) => p.size === size,
                                        );
                                        const isInvalid =
                                            hasAttemptedSave &&
                                            (!priceItem ||
                                                priceItem.costPrice <= 0);

                                        return (
                                            <PriceInputRow
                                                key={`${size}-cost`}
                                                size={size}
                                                value={
                                                    inputItem?.costPrice || ""
                                                }
                                                onChange={(text) =>
                                                    handlePriceChange(
                                                        size,
                                                        "costPrice",
                                                        text,
                                                    )
                                                }
                                                isInvalid={isInvalid}
                                                themeColors={{
                                                    backgroundColor,
                                                    invalidColor,
                                                    primaryColor,
                                                    darkGreyColor,
                                                }}
                                            />
                                        );
                                    })}
                                </VStack>
                            </FormControl>
                        </VStack>
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
                            onPress={handleSubmit}
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
