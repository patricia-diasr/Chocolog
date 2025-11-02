import React, { useState } from "react";
import {
    FormControl,
    Input,
    Button,
    VStack,
    HStack,
    Text,
    Icon,
    Pressable,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { useCustomToast } from "../../contexts/ToastProvider";
import { LoginRequest } from "../../types/login";

interface Props {
    onLoginSubmit: (credentials: LoginRequest) => void;
    isLoading: boolean;
}

export default function LoginForm({ onLoginSubmit, isLoading }: Props) {
    const toast = useCustomToast();

    const {
        primaryColor,
        secondaryColor,
        tertiaryColor,
        borderColor,
        backgroundColor,
        whiteColor,
        mediumGreyColor,
    } = useAppColors();

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [hasAttemptedSubmit, setHasAttemptedSubmit] =
        useState<boolean>(false);

    const isLoginInvalid = hasAttemptedSubmit && !login.trim();
    const isPasswordInvalid = hasAttemptedSubmit && !password.trim();

    const handleSubmit = () => {
        setHasAttemptedSubmit(true);

        if (!login.trim() || !password.trim()) {
            toast.showToast({
                title: "Campos obrigatórios",
                description: "Por favor, preencha o e-mail e a senha.",
                status: "warning",
            });
            return;
        }

        onLoginSubmit({ login, password });
    };

    return (
        <VStack
            space={8}
            w="100%"
            maxWidth="400px"
            bg={whiteColor}
            rounded="2xl"
            shadow={6}
            borderWidth={1}
            borderColor={borderColor}
            p={{ base: 6, md: 12 }}
        >
            <VStack space={2} alignItems="center">
                <Icon
                    as={Ionicons}
                    name="lock-closed"
                    size="3xl"
                    color={primaryColor}
                />
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    color={secondaryColor}
                >
                    Bem-vindo(a) de volta!
                </Text>
                <Text color={mediumGreyColor} textAlign="center">
                    Acesse sua conta para continuar.
                </Text>
            </VStack>

            <VStack space={5}>
                <FormControl isRequired isInvalid={isLoginInvalid}>
                    <FormControl.Label>
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="person" size="sm" />
                            <Text fontWeight="medium">Login </Text>
                        </HStack>
                    </FormControl.Label>
                    <Input
                        value={login}
                        onChangeText={setLogin}
                        placeholder="Seu login"
                        bg={backgroundColor}
                        size="lg"
                        variant="filled"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </FormControl>

                <FormControl isRequired isInvalid={isPasswordInvalid}>
                    <FormControl.Label>
                        <HStack alignItems="center" space={2}>
                            <Icon as={Ionicons} name="lock-closed" size="sm" />
                            <Text fontWeight="medium">Senha </Text>
                        </HStack>
                    </FormControl.Label>
                    <Input
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Sua senha"
                        bg={backgroundColor}
                        size="lg"
                        variant="filled"
                        type={showPassword ? "text" : "password"}
                        InputRightElement={
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                pr={3}
                            >
                                <Icon
                                    as={Ionicons}
                                    name={showPassword ? "eye-off" : "eye"}
                                    size="sm"
                                    color={mediumGreyColor}
                                />
                            </Pressable>
                        }
                    />
                </FormControl>
            </VStack>

            <VStack space={6}>
                <Button
                    onPress={handleSubmit}
                    size="lg"
                    colorScheme="secondary"
                    rounded="xl"
                    _pressed={{ bg: tertiaryColor }}
                    _hover={{ bg: tertiaryColor }}
                    py={3}
                    shadow={2}
                    _text={{ fontSize: "md", fontWeight: "medium" }}
                    isLoading={isLoading}
                    isLoadingText="Entrando..."
                    _loading={{ bg: tertiaryColor }}
                >
                    Entrar
                </Button>
            </VStack>
        </VStack>
    );
}
