import { VStack, HStack, Box, Text, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { maskPhone } from "../../utils/formatters";
import { Customer } from "../../types/customer";
import LabelBadge from "../layout/LabelBadge";

interface Props {
    customer: Customer;
}

export default function CustomerInfoCard({ customer }: Props) {
    const {
        whiteColor,
        lightGreyColor,
        darkGreyColor,
        blackColor,
        borderColor,
    } = useAppColors();

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
                            {customer.name}
                        </Text>
                        {customer.isReseller && (
                            <LabelBadge
                                color="green"
                                icon="business"
                                label="Revendedor"
                            />
                        )}
                    </HStack>

                    <HStack alignItems="center" space={2}>
                        <Icon
                            as={Ionicons}
                            name="call"
                            size="sm"
                            color={darkGreyColor}
                        />
                        <Text fontSize="md" color={darkGreyColor}>
                            {maskPhone(customer.phone)}
                        </Text>
                    </HStack>
                </VStack>

                {customer.notes && (
                    <Text
                        fontSize="sm"
                        color={darkGreyColor}
                        borderTopWidth={1}
                        borderTopColor={lightGreyColor}
                        paddingTop={2.5}
                    >
                        {customer.notes}
                    </Text>
                )}
            </VStack>
        </Box>
    );
}
