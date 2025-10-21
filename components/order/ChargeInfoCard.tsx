import { VStack, HStack, Box, Text } from "native-base";
import { useAppColors } from "../../hooks/useAppColors";
import { formatPrice } from "../../utils/formatters";
import { getStatusDetails } from "../../utils/statusConfig";
import { ChargeResponse } from "../../types/order";
import LabelBadge from "../layout/LabelBadge";
import InfoRow from "../layout/InfoRow";

interface Props {
    charge: ChargeResponse;
}

export default function ChargeInfoCard({ charge }: Props) {
    const { whiteColor, blackColor, borderColor } = useAppColors();

    const statusInfo = getStatusDetails(charge.status);

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
                            Cobrança
                        </Text>
                        <LabelBadge
                            color={statusInfo.colorScheme}
                            icon={statusInfo.icon}
                            label={statusInfo.label}
                        />
                    </HStack>
                    <VStack space={1.5}>
                        <InfoRow
                            iconName="pricetag"
                            label="Subtotal"
                            value={formatPrice(charge.subtotalAmount)}
                        />
                        <InfoRow
                            iconName="gift"
                            label="Desconto"
                            value={formatPrice(charge.discount)}
                        />
                        <InfoRow
                            iconName="cash"
                            label="Total"
                            value={formatPrice(charge.totalAmount)}
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    );
}
