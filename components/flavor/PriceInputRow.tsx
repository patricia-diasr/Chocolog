import { Box, HStack, Input, Text } from "native-base";
import { memo } from "react";

interface Props {
    size: string;
    value: string;
    onChange: (text: string) => void;
    isInvalid: boolean;
    themeColors: {
        backgroundColor: string;
        invalidColor: string;
        primaryColor: string;
        darkGreyColor: string;
    };
}

export const PriceInputRow = memo(
    ({ size, value, onChange, isInvalid, themeColors }: Props) => (
        <Box>
            <HStack
                alignItems="center"
                justifyContent="space-between"
                space={3}
            >
                <Text
                    flex={1}
                    fontSize="sm"
                    fontWeight="medium"
                    color={themeColors.darkGreyColor}
                >
                    {size}
                </Text>
                <Box flex={2}>
                    <Input
                        value={value}
                        onChangeText={onChange}
                        placeholder="0.00"
                        keyboardType="numeric"
                        bg={themeColors.backgroundColor}
                        borderColor={
                            isInvalid
                                ? themeColors.invalidColor
                                : themeColors.backgroundColor
                        }
                        borderWidth={2}
                        fontSize="md"
                        py={2}
                        size="lg"
                        variant="filled"
                        textAlign="right"
                        _focus={{
                            borderColor: isInvalid
                                ? themeColors.invalidColor
                                : themeColors.primaryColor,
                            bg: themeColors.backgroundColor,
                        }}
                    />
                </Box>
            </HStack>
        </Box>
    ),
);
