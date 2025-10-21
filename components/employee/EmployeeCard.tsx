import React from "react";
import { Text, VStack, HStack, Icon, Pressable, View } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Employee } from "../../types/employee";
import LabelBadge from "../layout/LabelBadge";
import { useAppColors } from "../../hooks/useAppColors";
import { Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";

interface Props {
    employee: Employee;
    onEdit?: (employee: Employee) => void;
    onDelete?: (id: number) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete }: Props) {
    const { borderColor, whiteColor, secondaryColor, darkGreyColor } =
        useAppColors();

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<any>,
    ) => {
        const scale = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
            extrapolate: "clamp",
        });

        return (
            <HStack>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Pressable
                        w={75}
                        h="100%"
                        bg="blue.200"
                        justifyContent="center"
                        alignItems="center"
                        onPress={() => onEdit && onEdit(employee)}
                        _hover={{ bg: "blue.300" }}
                        _pressed={{ bg: "blue.400" }}
                    >
                        <Icon
                            as={Ionicons}
                            name="create-outline"
                            color="blue.600"
                        />
                        <Text
                            color="blue.600"
                            fontSize="xs"
                            fontWeight="medium"
                        >
                            Editar
                        </Text>
                    </Pressable>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale }] }}>
                    <Pressable
                        w={75}
                        h="100%"
                        bg="red.100"
                        justifyContent="center"
                        alignItems="center"
                        onPress={() => onDelete && onDelete(employee.id)}
                        _hover={{ bg: "red.200" }}
                        _pressed={{ bg: "red.300" }}
                    >
                        <Icon
                            as={Ionicons}
                            name="trash-outline"
                            color="red.600"
                        />
                        <Text color="red.600" fontSize="xs" fontWeight="medium">
                            Deletar
                        </Text>
                    </Pressable>
                </Animated.View>
            </HStack>
        );
    };

    return (
        <View
            style={{ overflow: "hidden", borderRadius: 16 }}
            rounded="2xl"
            shadow={4}
            borderWidth={1}
            borderColor={borderColor}
        >
            <Swipeable renderRightActions={renderRightActions}>
                <Pressable
                    bg={whiteColor}
                    px={5}
                    py={3}
                    _hover={{ bg: borderColor }}
                    _pressed={{ bg: borderColor }}
                >
                    <VStack mb={1} space={1}>
                        <HStack
                            justifyContent="space-between"
                            alignItems="flex-start"
                        >
                            <HStack alignItems="center" space={2}>
                                <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={secondaryColor}
                                >
                                    {employee.name}
                                </Text>
                            </HStack>
                            {employee.role === "ADMIN" && (
                                <LabelBadge
                                    color="green"
                                    icon="key"
                                    label="Admin"
                                />
                            )}
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Icon
                                as={Ionicons}
                                name="at"
                                size="sm"
                                color={darkGreyColor}
                            />
                            <Text fontSize="md" color={darkGreyColor}>
                                {employee.login}
                            </Text>
                        </HStack>
                    </VStack>
                </Pressable>
            </Swipeable>
        </View>
    );
}
