import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, VStack, HStack, Icon, Pressable } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";
import { maskPhone } from "../../utils/formatters";
import { Customer } from "../../types/customer";
import { CustomerStackParamList } from "../../types/navigation";
import LabelBadge from "../layout/LabelBadge";

type CustomersScreenNavigationProp = NativeStackNavigationProp<
    CustomerStackParamList,
    "CustomersList"
>;

export default function CustomerCard({
    id,
    name,
    phone,
    isReseller,
}: Customer) {
    const { borderColor, whiteColor, secondaryColor, darkGreyColor } =
        useAppColors();
    const navigation = useNavigation<CustomersScreenNavigationProp>();

    const handleNavigate = () => {
        navigation.navigate("Customer", { customerId: id });
    };

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
}
