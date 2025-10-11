import React from "react";
import { Text, VStack, HStack, Checkbox, Pressable } from "native-base";
import LabelBadge from "../layout/LabelBadge";
import InfoRow from "../layout/InfoRow";
import { getStatusDetails } from "../../utils/statusConfig";
import { formatDate, formatOrderDetailTitle } from "../../utils/formatters";
import { ItemPrintBatch } from "../../types/prints";
import { useAppColors } from "../../hooks/useAppColors";

interface Props extends ItemPrintBatch {
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export default function PrintItemCard({
    id,
    order_id,
    status,
    due_date,
    is_printed,
    order_detail,
    customer,
    isSelected,
    onSelect,
}: Props) {
    const { borderColor, whiteColor, secondaryColor, blackColor } =
        useAppColors();

    const statusDetails = getStatusDetails(status);

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
            onPress={() => onSelect(id)}
        >
            <VStack mb={1} space={2}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <HStack alignItems="center" space={2}>
                        <Checkbox
                            value={id}
                            isChecked={isSelected}
                            onChange={() => onSelect(id)}
                            colorScheme="secondary"
                        />
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={secondaryColor}
                        >
                            {customer.name}
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
                        {formatOrderDetailTitle(order_detail)}
                    </Text>
                    <InfoRow
                        iconName="document-text"
                        label="Obs."
                        value={order_detail.notes || "..."}
                    />
                    <InfoRow
                        iconName="calendar"
                        label="Data"
                        value={formatDate(due_date)}
                    />
                    <InfoRow
                        iconName="call"
                        label="Telefone"
                        value={customer.phone}
                    />
                    <InfoRow
                        iconName="print"
                        label="Impresso"
                        value={is_printed ? "Sim" : "Não"}
                    />
                </VStack>
            </VStack>
        </Pressable>
    );
}
