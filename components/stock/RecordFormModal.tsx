import { useEffect, useState } from "react";
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
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { StockRecord, RecordItem } from "../../types/stock";
import { useAppColors } from "../../hooks/useAppColors";
import { flavors, sizes } from "../../configs/order";
import { useCustomToast } from "../../contexts/ToastProvider";
import Select from "../layout/Select";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: RecordItem) => void;
    title: string;
}

export default function RecordFormModal({
    isOpen,
    onClose,
    onSave,
    title,
}: Props) {
    const {
        borderColor,
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        lightGreyColor,
        darkGreyColor,
        invalidColor,
    } = useAppColors();

    const [type, setType] = useState<"+" | "-" | "">("");
    const [quantity, setQuantity] = useState("");
    const [flavor, setFlavor] = useState("");
    const [size, setSize] = useState("");
    const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
    const toast = useCustomToast();

    const isQuantityInvalid =
        hasAttemptedSave && (!quantity || parseInt(quantity) <= 0);
    const isFlavorInvalid = hasAttemptedSave && !flavor;
    const isSizeInvalid = hasAttemptedSave && !size;

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

        const newRecord: StockRecord = {
            date: new Date().toISOString(),
            type: type,
            quantity: Number(quantity),
            flavor: flavor,
            size: size,
        };

        setType("");
        setQuantity("");
        setFlavor("");
        setSize("");
        setHasAttemptedSave(false);

        toast.showToast({
            title: "Sucesso!",
            description: `Registro de ${
                type === "+" ? "entrada" : "saída"
            } adicionado`,
            status: "success"
        });

        onSave(newRecord);
    };

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
                                    onPress={() => setType("+")}
                                >
                                    <Box
                                        bg={
                                            type === "+"
                                                ? "green.100"
                                                : "gray.100"
                                        }
                                        p={4}
                                        rounded="lg"
                                        borderWidth={2}
                                        borderColor={
                                            type === "+"
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
                                                    type === "+"
                                                        ? "green.600"
                                                        : "gray.400"
                                                }
                                            />
                                            <Text
                                                color={
                                                    type === "+"
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
                                    onPress={() => setType("-")}
                                >
                                    <Box
                                        bg={
                                            type === "-"
                                                ? "red.100"
                                                : "gray.100"
                                        }
                                        p={4}
                                        rounded="lg"
                                        borderWidth={2}
                                        borderColor={
                                            type === "-"
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
                                                    type === "-"
                                                        ? "red.600"
                                                        : "gray.400"
                                                }
                                            />
                                            <Text
                                                color={
                                                    type === "-"
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
                                selectedValue={flavor}
                                onValueChange={setFlavor}
                                isInvalid={isFlavorInvalid}
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
                                data={sizes}
                                selectedValue={size}
                                onValueChange={setSize}
                                isInvalid={isSizeInvalid}
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
