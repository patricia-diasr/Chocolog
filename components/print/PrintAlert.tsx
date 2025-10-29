import { useRef } from "react";
import { AlertDialog, Button, VStack, Text } from "native-base";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedCount: number;
    isLoading: boolean;
}

export default function PrintAlert({
    isOpen,
    onClose,
    onConfirm,
    selectedCount,
    isLoading,
}: Props) {
    const cancelRef = useRef(null);
    const {
        whiteColor,
        lightGreyColor,
        mediumGreyColor,
        darkGreyColor,
        secondaryColor,
        tertiaryColor,
        borderColor,
    } = useAppColors();

    const message =
        selectedCount === 1 ? "Deseja imprimir o" : "Deseja imprimir os";

    const itemName =
        selectedCount === 1
            ? `${selectedCount} pedido selecionado`
            : `${selectedCount} pedidos selecionados`;

    return (
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <AlertDialog.Content
                width="90%"
                maxWidth="400px"
                bg={whiteColor}
                rounded="2xl"
                shadow={6}
                borderWidth={1}
                borderColor={borderColor}
            >
                <AlertDialog.CloseButton
                    rounded="full"
                    _icon={{
                        size: "sm",
                    }}
                />

                <AlertDialog.Header
                    bg="transparent"
                    borderBottomWidth={0}
                    pb={2}
                >
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={secondaryColor}
                    >
                        Confirmar Exclusão
                    </Text>
                </AlertDialog.Header>
                <AlertDialog.Body
                    px={6}
                    py={5}
                    borderTopWidth={1.5}
                    borderBottomWidth={1.5}
                    borderColor={lightGreyColor}
                >
                    <VStack space={5}>
                        <Text
                            fontSize="md"
                            color={darkGreyColor}
                            textAlign="center"
                            lineHeight="md"
                        >
                            {message}{" "}
                            <Text fontWeight="bold" color={secondaryColor}>
                                {itemName}
                            </Text>
                            ?
                        </Text>

                        <Text
                            fontSize="sm"
                            color={mediumGreyColor}
                            textAlign="center"
                        >
                            Um arquivo PDF com os pedidos será gerado e o
                            download iniciará em seguida.
                        </Text>
                    </VStack>
                </AlertDialog.Body>

                <AlertDialog.Footer bg="transparent" pt={4} borderTopWidth={0}>
                    <Button.Group space={3} flex={1}>
                        <Button
                            variant="ghost"
                            colorScheme="gray"
                            onPress={onClose}
                            ref={cancelRef}
                            rounded="xl"
                            flex={1}
                            py={3}
                            _text={{
                                fontSize: "md",
                                fontWeight: "medium",
                            }}
                            isDisabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onPress={onConfirm}
                            size="lg"
                            colorScheme="secondary"
                            rounded="xl"
                            _pressed={{ bg: tertiaryColor }}
                            _hover={{ bg: tertiaryColor }}
                            flex={1}
                            py={3}
                            shadow={2}
                            _text={{
                                fontSize: "md",
                                fontWeight: "medium",
                            }}
                            isLoading={isLoading}
                            isLoadingText="Carregando..."
                            _loading={{ bg: tertiaryColor, opacity: 0.8 }}
                        >
                            Imprimir
                        </Button>
                    </Button.Group>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}
