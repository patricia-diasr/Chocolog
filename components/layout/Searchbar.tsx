import { Input, Icon, Pressable } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export default function SearchInput({
    value,
    onChangeText,
    placeholder = "Buscar...",
    onClear,
}: Props) {
    const {
        whiteColor,
        mediumGreyColor,
        primaryColor,
        borderColor,
    } = useAppColors();
    const handleClear = () => {
        onChangeText("");
        onClear?.();
    };

    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            variant="filled"
            borderRadius="xl"
            py={2}
            px={3}
            fontSize="sm"
            shadow={1}
            bg={whiteColor}
            borderWidth={1}
            borderColor={borderColor}
            width={{
                base: "100%",
                lg: "600px",
            }}
            _hover={{
                borderColor: primaryColor,
                backgroundColor: borderColor,
            }}
            _focus={{
                borderColor: primaryColor,
                backgroundColor: borderColor,
            }}
            InputLeftElement={
                <Icon
                    ml={3}
                    size={5}
                    color={mediumGreyColor}
                    as={<Ionicons name="search" />}
                />
            }
            InputRightElement={
                value ? (
                    <Pressable onPress={handleClear} mr={3}>
                        <Icon
                            as={Ionicons}
                            name="close-circle"
                            size={5}
                            color={mediumGreyColor}
                        />
                    </Pressable>
                ) : undefined
            }
        />
    );
}
