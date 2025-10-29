import React from "react";
import { Text, VStack, HStack, Checkbox, Pressable } from "native-base";
import LabelBadge from "../layout/LabelBadge";
import InfoRow from "../layout/InfoRow";
import { getStatusDetails } from "../../utils/statusConfig";
import { formatDate, formatOrderDetailTitle } from "../../utils/formatters";
import { OrderItemResponse } from "../../types/order";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    item: OrderItemResponse;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export default function PrintItemCard({
    item,
    isSelected,
    onSelect,
}: Props) {
    const { borderColor, whiteColor, secondaryColor, blackColor } =
        useAppColors();

    const statusDetails = getStatusDetails(item.status);

    return (
        <Pressable
            bg={whiteColor}
            px={5}
            py={3}
            rounded="2xl"
            shadow={4}
            borderWidth={1}
            borderColor={isSelected ? secondaryColor : borderColor}
            _hover={{ bg: borderColor }}
            _pressed={{ bg: borderColor }}
            onPress={() => onSelect(item.id)}
        >
            <VStack mb={1} space={2}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <HStack alignItems="center" space={2}>
                        <Checkbox
                            value={item.id.toString()}
                            isChecked={isSelected}
                            onChange={() => onSelect(item.id)}
                            colorScheme="secondary"
                        />
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={secondaryColor}
                        >
                            {item.customerName}
                        </Text>
                    </HStack>
                    <LabelBadge
                        color={statusDetails.colorScheme}
                        icon={statusDetails.icon}
                        label={statusDetails.label}
                    />
                </HStack>
                <VStack space={1.5}>
                    <Text fontWeight="bold" fontSize="md" color={blackColor}>
                        {formatOrderDetailTitle(item)}
                    </Text>
                    <InfoRow
                        iconName="document-text"
                        label="Obs."
                        value={item.notes || "..."}
                    />
                    <InfoRow
                        iconName="calendar"
                        label="Data"
                        value={formatDate(item.expectedPickupDate || "")}
                    />
                    <InfoRow
                        iconName="call"
                        label="Telefone"
                        value={item.customerPhone || ""}
                    />
                    <InfoRow
                        iconName="print"
                        label="Impresso"
                        value={item.isPrinted ? "Sim" : "Não"}
                    />
                </VStack>
            </VStack>
        </Pressable>
    );
}
