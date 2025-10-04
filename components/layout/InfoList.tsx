import React from "react";
import {
    VStack,
    HStack,
    Box,
    Text,
    Icon,
    Center,
    Pressable,
    Button,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import LabelBadge from "./LabelBadge";

interface ListItem {
    id: string;
    title: string;
    info: string;
    aditionalInfo?: string;
    badgeColor: string;
    badgeIcon: string;
    badgeLabel: string;
}

interface Props {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    items: ListItem[];
    addText?: string;
    emptyStateText: string;
    onItemPress: (id: string) => void;
    onAddItem?: () => void;
}

export default function InfoList({
    title,
    icon,
    items,
    addText,
    emptyStateText,
    onItemPress,
    onAddItem,
}: Props) {
    const { whiteColor, lightGreyColor, mediumGreyColor, darkGreyColor, blackColor, secondaryColor, tertiaryColor, borderColor } =
        useAppColors();

    return (
        <Box
            bg={whiteColor}
            py={4}
            px={1}
            rounded="2xl"
            shadow={2}
            borderWidth={1}
            borderColor={borderColor}
        >
            <VStack space={4}>
                <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    px={4}
                >
                    <HStack alignItems="center" space={2}>
                        <Icon
                            as={Ionicons}
                            name={icon}
                            size="md"
                            color={secondaryColor}
                        />
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={secondaryColor}
                        >
                            {title} ({items.length})
                        </Text>
                    </HStack>
                    {onAddItem && (
                        <Button
                            onPress={onAddItem}
                            size="xs"
                            colorScheme="secondary"
                            rounded="xl"
                            _pressed={{ bg: tertiaryColor }}
                            _hover={{ bg: tertiaryColor }}
                            py={2}
                            shadow={2}
                            _text={{
                                fontSize: "xs",
                                fontWeight: "medium",
                            }}
                            leftIcon={
                                <Icon
                                    as={Ionicons}
                                    name="add"
                                    color={whiteColor}
                                    size="xs"
                                />
                            }
                        >
                            {addText}
                        </Button>
                    )}
                </HStack>
                {items.length === 0 ? (
                    <Center py={8} px={4}>
                        <VStack alignItems="center" space={3}>
                            <Icon
                                as={Ionicons}
                                name={icon}
                                size={20}
                                color={mediumGreyColor}
                            />
                            <Text color={mediumGreyColor} fontSize="md">
                                {emptyStateText}
                            </Text>
                        </VStack>
                    </Center>
                ) : (
                    <VStack>
                        {items.map((item, index) => (
                            <Pressable
                                key={`${item.title}-${item.id}`}
                                onPress={() => onItemPress(item.id)}
                                _hover={{ bg: borderColor }}
                                _pressed={{ bg: borderColor }}
                                px={4}
                                py={2}
                                rounded="sm"
                                borderBottomWidth={
                                    index === items.length - 1 ? 0 : 1
                                }
                                borderBottomColor={lightGreyColor}
                            >
                                <VStack space={1}>
                                    <HStack
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Text
                                            fontWeight="bold"
                                            fontSize="md"
                                            color={blackColor}
                                        >
                                            {item.title}
                                        </Text>
                                        {item.badgeLabel && (
                                            <LabelBadge
                                                color={item.badgeColor}
                                                icon={item.badgeIcon}
                                                label={item.badgeLabel}
                                            />
                                        )}
                                    </HStack>
                                    <HStack
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Text fontSize="md" color={darkGreyColor}>
                                            {item.info}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            color={darkGreyColor}
                                        >
                                            {item.aditionalInfo}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Pressable>
                        ))}
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}
