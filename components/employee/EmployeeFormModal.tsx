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
    Switch,
    Pressable,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import { Employee } from "../../types/employee";
import { isLoading } from "expo-font";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Employee) => void;
    employeeData: Employee | null;
    isLoading: boolean;
}

export default function EmployeeFormModal({
    title,
    isOpen,
    onClose,
    onSave,
    employeeData,
    isLoading
}: Props) {
    const toast = useCustomToast();
    const {
        whiteColor,
        borderColor,
        backgroundColor,
        secondaryColor,
        tertiaryColor,
        lightGreyColor,
        mediumGreyColor,
    } = useAppColors();

    const [formData, setFormData] = useState<Employee | null>(employeeData);
    const [hasAttemptedSave, setHasAttemptedSave] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(employeeData);
        } else {
            setHasAttemptedSave(false);
        }
    }, [isOpen, employeeData]);

    const handleInputChange = (field: keyof Employee, value: any) => {
        setFormData((prevData) => {
            if (!prevData) return null;
            return { ...prevData, [field]: value };
        });
    };

    const handleSubmit = () => {
        setHasAttemptedSave(true);

        const isNewEmployee = !formData?.id;
        const passwordIsRequired = isNewEmployee && !formData?.password?.trim();

        if (
            !formData ||
            !formData.name.trim() ||
            !formData.login.trim() ||
            !formData.role.trim() ||
            passwordIsRequired
        ) {
            toast.showToast({
                title: "Ops! Campos obrigatórios",
                description:
                    "Por favor, preencha nome, login, função e senha (para novos funcionários).",
                status: "warning",
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
                                        Nome do Funcionário
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
                                hasAttemptedSave && !formData.login.trim()
                            }
                        >
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon as={Ionicons} name="at" size="sm" />
                                    <Text fontWeight="medium">Login </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={formData.login}
                                onChangeText={(text) =>
                                    handleInputChange("login", text)
                                }
                                placeholder="Ex: maria.silva"
                                bg={backgroundColor}
                                size="lg"
                                variant="filled"
                                autoCapitalize="none"
                            />
                        </FormControl>

                        <FormControl
                            isRequired={!formData.id}
                            isInvalid={
                                hasAttemptedSave &&
                                !formData.id &&
                                !formData.password?.trim()
                            }
                        >
                            <FormControl.Label>
                                <HStack alignItems="center" space={2}>
                                    <Icon
                                        as={Ionicons}
                                        name="lock-closed"
                                        size="sm"
                                    />
                                    <Text fontWeight="medium">Senha </Text>
                                </HStack>
                            </FormControl.Label>
                            <Input
                                value={formData.password || ""}
                                onChangeText={(text) =>
                                    handleInputChange("password", text)
                                }
                                placeholder={
                                    formData.id
                                        ? "Deixe em branco para não alterar"
                                        : "Senha do usuario"
                                }
                                bg={backgroundColor}
                                size="lg"
                                variant="filled"
                                type={showPassword ? "text" : "password"}
                                InputRightElement={
                                    <Pressable
                                        onPress={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        pr={3}
                                    >
                                        <Icon
                                            as={Ionicons}
                                            name={
                                                showPassword ? "eye-off" : "eye"
                                            }
                                            size="sm"
                                            color={mediumGreyColor}
                                        />
                                    </Pressable>
                                }
                            />
                        </FormControl>

                        <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="100%"
                        >
                            <HStack alignItems="center" space={2}>
                                <Icon as={Ionicons} name="key" size="sm" />
                                <Text fontWeight="medium">
                                    É administrador?
                                </Text>
                            </HStack>
                            <Switch
                                size="md"
                                isChecked={formData.role === "ADMIN"}
                                onToggle={(isToggled) =>
                                    handleInputChange(
                                        "role",
                                        isToggled ? "ADMIN" : "STAFF",
                                    )
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
