import { VStack, HStack, Box, Text } from "native-base";
import { useAppColors } from "../../hooks/useAppColors";
import { formatDate } from "../../utils/formatters";
import { getStatusDetails } from "../../utils/statusConfig";
import { Order } from "../../types/order";
import LabelBadge from "../layout/LabelBadge";
import InfoRow from "../layout/InfoRow";

interface Props {
    order: Order;
}

export default function OrderInfoCard({ order }: Props) {
    const {
        whiteColor,
        lightGreyColor,
        darkGreyColor,
        blackColor,
        borderColor,
    } = useAppColors();

    const statusInfo = getStatusDetails(order.status);

    return (
        <Box
            bg={whiteColor}
            p={4}
            rounded="2xl"
            shadow={2}
            borderWidth={1}
            borderColor={borderColor}
        >
            <VStack space={3}>
                <VStack space={1.5}>
                    <HStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={blackColor}
                        >
                            Pedido #{order.id}
                        </Text>
                        <LabelBadge
                            color={statusInfo.colorScheme}
                            icon={statusInfo.icon}
                            label={statusInfo.label}
                        />
                    </HStack>
                    <VStack space={1.5}>
                        <InfoRow
                            iconName="calendar"
                            label="Criado em"
                            value={formatDate(order.created_date)}
                        />
                        <InfoRow
                            iconName="hourglass"
                            label="Prazo"
                            value={formatDate(order.due_date)}
                        />
                        {order.pickup_date && (
                            <InfoRow
                                iconName="checkmark-done"
                                label="Retirado em"
                                value={formatDate(order.pickup_date)}
                            />
                        )}
                    </VStack>
                </VStack>

                {order.notes && (
                    <Text
                        fontSize="sm"
                        color={darkGreyColor}
                        borderTopWidth={1}
                        borderTopColor={lightGreyColor}
                        paddingTop={2.5}
                    >
                        {order.notes}
                    </Text>
                )}
            </VStack>
        </Box>
    );
}
