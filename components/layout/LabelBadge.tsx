import { Badge, HStack, Icon, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    color: string;
    icon: string;
    label: string;
}

export default function LabelBadge({ color, icon, label }: Props) {
    return (
        <Badge colorScheme={color} variant="subtle" rounded="full">
            <HStack alignItems="center" space={1}>
                <Icon as={Ionicons} name={icon} size="xs" />
                <Text fontSize="xs">{label}</Text>
            </HStack>
        </Badge>
    );
}
