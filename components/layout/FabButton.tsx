import { Fab, HStack, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    action: () => void;
    icon?: string;
}

export default function FabButton({ action, icon = "add" }: Props) {
    const { secondaryColor, tertiaryColor, whiteColor } = useAppColors();

    return (
        <Fab
            onPress={action}
            renderInPortal={false}
            shadow={6}
            size="lg"
            bg={secondaryColor}
            _hover={{ bg: tertiaryColor }}
            _pressed={{ bg: tertiaryColor }}
            icon={
                <HStack alignItems="center" space={1}>
                    <Icon
                        as={Ionicons}
                        name={icon}
                        color={whiteColor}
                        size={6}
                    />
                </HStack>
            }
            placement="bottom-right"
        />
    );
}
