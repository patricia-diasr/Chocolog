import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, VStack, HStack, Pressable } from "native-base";
import InfoRow from "../layout/InfoRow";
import { useAppColors } from "../../hooks/useAppColors";
import { PrintBatch } from "../../types/prints";
import { formatDate } from "../../utils/formatters";

export default function PrintCard({
    id,
    printed_by_employee,
    created_at,
    items,
}: PrintBatch) {
    const { borderColor, whiteColor, secondaryColor } =
        useAppColors();

    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate("PrintBatch" as never);
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
            <VStack space={3}>
                <VStack space={1.5}>
                    <HStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={secondaryColor}
                        >
                            Lote #{id}
                        </Text>
                    </HStack>
                    <VStack space={1.5}>
                        <InfoRow
                            iconName="calendar"
                            label="Criado em"
                            value={formatDate(created_at)}
                        />
                        <InfoRow
                            iconName="people"
                            label="Criado por"
                            value={printed_by_employee}
                        />
                        <InfoRow
                            iconName="cube"
                            label="Quantidade de itens"
                            value={items.length.toString()}
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Pressable>
        
    );
}
