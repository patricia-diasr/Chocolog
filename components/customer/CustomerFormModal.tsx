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
    useToast,
    Switch,
    TextArea,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { Customer } from "../../types/customer";
import { maskPhone, unmaskPhone } from "../../utils/formatters";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Customer) => void;
    customerData: Customer | null;
}

export default function CustomerFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    customerData,
}: Props) {
    const toast = useToast();
    const {
        whiteColor,
        borderColor,
        backgroundColor,
        secondaryColor,
        tertiaryColor,
        lightGreyColor,
    } = useAppColors();

    const [formData, setFormData] = useState<Customer | null>(customerData);
    const [hasAttemptedSave, setHasAttemptedSave] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData((prevData) => {
                if (!prevData) return null;
                return { ...prevData, phone: maskPhone(prevData.phone) };
            });
        } else {
            setHasAttemptedSave(false);
        }
    }, [isOpen, customerData]);

    const handleInputChange = (field: keyof Customer, value: any) => {
        setFormData((prevData) => {
            if (!prevData) return null;

            const finalValue = field === "phone" ? maskPhone(value) : value;
            return { ...prevData, [field]: finalValue };
        });
    };

    const handleSave = () => {
        setHasAttemptedSave(true);

        const unmaskedPhone = unmaskPhone(formData?.phone ?? "");

        if (!formData || !formData.name.trim() || unmaskedPhone.length < 10) {
            toast.show({
                title: "Ops! Campos obrigatórios",
                description:
                    "Por favor, preencha o nome e o telefone do cliente.",
                status: "warning",
                duration: 3000,
                placement: "top",
            });
            return;
        }
        onSave(formData);
    };

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
                        <FormControl
                            isRequired
                            isInvalid={
                                hasAttemptedSave && !formData.name.trim()
                            }
                        >
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="person"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">
                                        Nome do Cliente{" "}
                                    </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={formData.name}
                                onChangeText={(text) =>
                                    handleInputChange("name", text)
                                }
                                placeholder="Ex: Maria Silva"
                                bg={backgroundColor}
                                size="lg"
                                variant="filled"
                            />
                        </FormControl>

                        <FormControl
                            isRequired
                            isInvalid={
                                hasAttemptedSave &&
                                unmaskPhone(formData.phone).length < 10
                            }
                        >
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon as={Ionicons} name="call" size="sm" />
                                    <Text fontWeight="medium">Telefone </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={formData.phone}
                                onChangeText={(text) =>
                                    handleInputChange("phone", text)
                                }
                                placeholder="Ex: (15) 99999-9999"
                                bg={backgroundColor}
                                keyboardType="phone-pad"
                                size="lg"
                                variant="filled"
                                maxLength={15}
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
                                placeholder="Informações adicionais..."
                                bg={backgroundColor}
                                variant="filled"
                                h={20}
                            />
                        </FormControl>

                        <HStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <HStack alignItems="center" space={2}>
                                <Icon as={Ionicons} name="business" size="sm" />
                                <Text fontWeight="medium">É revendedor?</Text>
                            </HStack>
                            <Switch
                                size="md"
                                isChecked={formData.isReseller}
                                onToggle={(value) =>
                                    handleInputChange("isReseller", value)
                                }
                                colorScheme="primary"
                            />
                        </HStack>
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
