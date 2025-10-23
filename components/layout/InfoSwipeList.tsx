import React from "react";
import { Animated } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
    VStack,
    HStack,
    Box,
    Text,
    Icon,
    Center,
    Pressable,
    Divider,
    Button,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import LabelBadge from "./LabelBadge";
import { useAppColors } from "../../hooks/useAppColors";

interface ListItem {
    id: number;
    title: string;
    info: string;
    aditionalInfo?: string;
    badgeColor: string;
    badgeIcon: string;
    badgeLabel: string;
    itemActionsDisabled?: boolean;
}

interface Props {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    items: ListItem[];
    addText?: string;
    emptyStateText: string;
    onAddItem?: () => void;
    onEditItem: (id: number) => void;
    onDeleteItem: (id: number) => void;
    isActionsDisabled?: boolean;
    isAddDisabled?: boolean;
    disableDeleteOnSingleItem?: boolean;
}

export default function InfoSwipeList({
    title,
    icon,
    items,
    addText,
    emptyStateText,
    onAddItem,
    onEditItem,
    onDeleteItem,
    isActionsDisabled,
    isAddDisabled,
    disableDeleteOnSingleItem,
}: Props) {
    const {
        whiteColor,
        lightGreyColor,
        mediumGreyColor,
        darkGreyColor,
        blackColor,
        secondaryColor,
        tertiaryColor,
        borderColor,
    } = useAppColors();

    const renderHiddenItem = (data: any, rowMap: any) => {
        const isItemDisabled = data.item.itemActionsDisabled; 
        const isSingleItemDeleteDisabled =
            disableDeleteOnSingleItem && items.length === 1; 
        const isEditDisabled = !!isItemDisabled;
        const isDeleteDisabled = !!isItemDisabled || isSingleItemDeleteDisabled;

        return (
            <HStack flex={1} justifyContent="flex-end">
                <Pressable
                    w={75}
                    bg="blue.200"
                    justifyContent="center"
                    alignItems="center"
                    onPress={() => {
                        rowMap[data.item.id]?.closeRow();
                        onEditItem(data.item.id);
                    }}
                    _hover={{
                        bg:
                            isEditDisabled || isActionsDisabled
                                ? "blue.200"
                                : "blue.300",
                    }}
                    _pressed={{
                        bg:
                            isEditDisabled || isActionsDisabled
                                ? "blue.200"
                                : "blue.3400",
                    }}
                    disabled={isEditDisabled || isActionsDisabled}
                    opacity={isEditDisabled || isActionsDisabled ? 0.5 : 1}
                >
                    <Icon
                        as={Ionicons}
                        name="create-outline"
                        color="blue.600"
                    />
                    <Text color="blue.600" fontSize="xs" fontWeight="medium">
                        Editar
                    </Text>
                </Pressable>

                <Pressable
                    w={75}
                    bg="red.100"
                    justifyContent="center"
                    alignItems="center"
                    onPress={() => {
                        rowMap[data.item.id]?.closeRow();
                        onDeleteItem(data.item.id);
                    }}
                    _hover={{
                        bg:
                            isDeleteDisabled || isActionsDisabled
                                ? "red.100"
                                : "red.200",
                    }}
                    _pressed={{
                        bg:
                            isDeleteDisabled || isActionsDisabled
                                ? "red.100"
                                : "red.300",
                    }}
                    disabled={isDeleteDisabled || isActionsDisabled}
                    opacity={isDeleteDisabled || isActionsDisabled ? 0.5 : 1}
                >
                    <Icon as={Ionicons} name="trash-outline" color="red.600" />
                    <Text color="red.600" fontSize="xs" fontWeight="medium">
                        Deletar
                    </Text>
                </Pressable>
            </HStack>
        );
    };

    const renderItem = (data: any, rowMap: any) => {
        const swipeAnimatedValue = rowMap[data.item.id]?.swipeAnimatedValue;

        const opacity = swipeAnimatedValue
            ? swipeAnimatedValue.interpolate({
                  inputRange: [-150, 0],
                  outputRange: [0, 1],
                  extrapolate: "clamp",
              })
            : 1;

        return (
            <Animated.View style={{ opacity }}>
                <Pressable
                    bg={whiteColor}
                    _hover={{ bg: borderColor }}
                    _pressed={{ bg: borderColor }}
                    px={4}
                    py={2}
                    rounded="sm"
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
                                {data.item.title}
                            </Text>
                            {data.item.badgeLabel && (
                                <LabelBadge
                                    color={data.item.badgeColor}
                                    icon={data.item.badgeIcon}
                                    label={data.item.badgeLabel}
                                />
                            )}
                        </HStack>
                        <HStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="md" color={darkGreyColor}>
                                {data.item.info}
                            </Text>
                            <Text fontSize="sm" color={darkGreyColor}>
                                {data.item.aditionalInfo}
                            </Text>
                        </HStack>
                    </VStack>
                </Pressable>
            </Animated.View>
        );
    };

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
                            isDisabled={isActionsDisabled || isAddDisabled}
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
                    <SwipeListView
                        data={items}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-150}
                        disableRightSwipe
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => (
                            <Divider bg={lightGreyColor} />
                        )}
                        closeOnRowPress
                        closeOnScroll
                    />
                )}
            </VStack>
        </Box>
    );
}
