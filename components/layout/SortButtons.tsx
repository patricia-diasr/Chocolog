import { HStack, Text, Pressable, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";

export interface SortOption {
    value: string;
    label: string;
    icon: string;
}

interface Props {
    sortBy: string;
    onSortChange: (sortBy: string) => void;
    options: SortOption[];
    label?: string;
}

export default function SortButtons({
    sortBy,
    onSortChange,
    options,
    label = "Ordenar por:",
}: Props) {
    const { whiteColor, secondaryColor, mediumGreyColor, borderColor } =
        useAppColors();

    const SortButton = ({ value, label: buttonLabel, icon }: SortOption) => (
        <Pressable
            onPress={() => onSortChange(value)}
            bg={sortBy === value ? secondaryColor : borderColor}
            px={3}
            py={2}
            rounded="lg"
        >
            <HStack alignItems="center" space={1}>
                <Icon
                    as={Ionicons}
                    name={icon as any}
                    size="xs"
                    color={sortBy === value ? whiteColor : mediumGreyColor}
                />
                <Text
                    fontSize="xs"
                    color={sortBy === value ? whiteColor : mediumGreyColor}
                    fontWeight="medium"
                >
                    {buttonLabel}
                </Text>
            </HStack>
        </Pressable>
    );

    return (
        <HStack space={3} alignItems="center" flexWrap="wrap">
            <Text fontSize="sm" color={mediumGreyColor}>
                {label}
            </Text>
            <HStack space={2} my={{base: 1, md:0}}>
                {options.map((option) => (
                    <SortButton
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        icon={option.icon}
                    />
                ))}
            </HStack>
        </HStack>
    );
}
