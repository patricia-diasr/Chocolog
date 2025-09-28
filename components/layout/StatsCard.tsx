import { Box, VStack, HStack, Text, Icon, Divider } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { StatsCardProps } from "../../types/stats";
import { useAppColors } from "../../hooks/useAppColors";

export default function StatsCard({ title, icon, stats }: StatsCardProps) {
    const {
        whiteColor,
        secondaryColor,
        mediumGreyColor,
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
            width={{
                base: "100%",
                lg: "600px",
            }}
        >
            <VStack space={4}>
                <HStack alignItems="center" space={2}>
                    <Icon
                        as={Ionicons}
                        name={icon as any}
                        size="sm"
                        color={secondaryColor}
                    />
                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={secondaryColor}
                    >
                        {title}
                    </Text>
                </HStack>

                <HStack justifyContent="space-between">
                    {stats.map((stat, index) => (
                        <HStack
                            key={index}
                            flex={1}
                            borderRightWidth={
                                index === stats.length - 1 ? 0 : 1
                            }
                            borderRightColor={mediumGreyColor}
                        >
                            <VStack alignItems="center" flex={1}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    color={blackColor}
                                >
                                    {stat.value}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    color={mediumGreyColor}
                                    textAlign="center"
                                >
                                    {stat.label}
                                </Text>
                            </VStack>
                        </HStack>
                    ))}
                </HStack>
            </VStack>
        </Box>
    );
}
