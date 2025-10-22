import React, { useState } from "react";
import {
    Pressable,
    Text,
    Modal,
    FlatList,
    HStack,
    Icon,
    CheckIcon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";

interface Props<T> {
    data: T[];
    selectedValue: string | number | undefined;
    onValueChange: (value: string | number) => void;
    placeholder: string;
    modalTitle: string;
    isInvalid?: boolean;
    isDisabled?: boolean;
    itemValue?: (item: T) => string | number;
    itemLabel?: (item: T) => string;
}

export default function Select<T>({
    data,
    selectedValue,
    onValueChange,
    placeholder,
    modalTitle,
    isInvalid = false,
    isDisabled = false,
    itemValue = (item: any) => item,
    itemLabel = (item: any) => item,
}: Props<T>) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {
        backgroundColor,
        primaryColor,
        mediumGreyColor,
        darkGreyColor,
        borderColor,
        blackColor,
        invalidColor,
    } = useAppColors();

    const handleSelect = (value: string | number) => {
        onValueChange(value);
        setIsModalVisible(false);
    };

    const selectedItem = data.find((item) => itemValue(item) === selectedValue);
    const displayText = selectedItem ? itemLabel(selectedItem) : placeholder;

    return (
        <>
            <Pressable onPress={() => !isDisabled && setIsModalVisible(true)}>
                <HStack
                    bg={backgroundColor}
                    py={3}
                    px={3}
                    borderRadius="md"
                    borderWidth={2}
                    borderColor={isInvalid ? invalidColor : backgroundColor}
                    alignItems="center"
                    justifyContent="space-between"
                    opacity={isDisabled ? 0.6 : 1}
                >
                    <Text
                        fontSize="md"
                        color={selectedValue ? blackColor : mediumGreyColor}
                    >
                        {displayText}
                    </Text>
                    <Icon
                        as={Ionicons}
                        name="chevron-down"
                        color={darkGreyColor}
                        size="sm"
                    />
                </HStack>
            </Pressable>

            <Modal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            >
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header bg="transparent" borderBottomWidth={0} pb={2}>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={blackColor}
                        >
                            {modalTitle}
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => String(itemValue(item))}
                            renderItem={({ item }) => {
                                const value = itemValue(item);
                                const label = itemLabel(item);
                                return (
                                    <Pressable
                                        onPress={() => handleSelect(value)}
                                        _hover={{ bg: borderColor }}
                                        _pressed={{ bg: borderColor }}
                                    >
                                        <HStack
                                            w="100%"
                                            py={3}
                                            px={2}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            borderBottomWidth={1}
                                            borderBottomColor={borderColor}
                                        >
                                            <Text fontSize="md">{label}</Text>
                                            {selectedValue === value && (
                                                <CheckIcon
                                                    size="5"
                                                    color={primaryColor}
                                                />
                                            )}
                                        </HStack>
                                    </Pressable>
                                );
                            }}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
}
