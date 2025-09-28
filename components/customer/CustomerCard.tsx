import React from "react";
import { Text, VStack, HStack, Icon, Pressable } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Customer } from "../../types/customer";
import LabelBadge from "../layout/LabelBadge";
import { useAppColors } from "../../hooks/useAppColors";
import { maskPhone } from "../../utils/formatters";

const CustomerCard: React.FC<Customer> = ({ name, phone, isReseller }) => {
    const {
        borderColor,
        whiteColor,
        secondaryColor,
        darkGreyColor,
    } = useAppColors();

    const handleNavigate = () => {};

    return (
        <Pressable
            bg={whiteColor}
            px={5}
            py={3}
            rounded="2xl"
            shadow={4}
            borderWidth={1}
            borderColor={borderColor}
            onPress={handleNavigate}
            _hover={{ bg: borderColor }}
            _pressed={{ bg: borderColor }}
        >
            <VStack mb={1} space={1}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <HStack alignItems="center" space={2}>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={secondaryColor}
                        >
                            {name}
                        </Text>
                    </HStack>
                    {isReseller && (
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
                        {maskPhone(phone)}
                    </Text>
                </HStack>
            </VStack>
        </Pressable>
    );
};

export default CustomerCard;
