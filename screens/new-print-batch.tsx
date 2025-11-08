import { useCallback, useMemo, useState } from "react";
import {
    Box,
    Center,
    Text,
    Icon,
    ScrollView,
    VStack,
    Pressable,
    HStack,
    Flex,
    Spinner,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import { getItems } from "../services/orderService";
import {
    createPrintBatch,
    downloadPrintBatch,
} from "../services/printBatchService";
import { OrderItemResponse } from "../types/order";
import { PrintBatchDetail } from "../types/prints";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import SearchInput from "../components/layout/Searchbar";
import FabButton from "../components/layout/FabButton";
import PrintItemCard from "../components/print/PrintItemCard";
import PrintAlert from "../components/print/PrintAlert";
import Breadcrumbs from "../components/navigation/Breadcrumbs";

export default function NewPrintBatchScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();
    const toast = useCustomToast();

    const [printItems, setPrintItems] = useState<OrderItemResponse[]>([]);
    const [selectedIds, setSelectedIds] = useState<Array<number>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "not-printed">("all");

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "people" },
        { value: "not-printed", label: "Não impressos", icon: "warning" },
    ];

    const processedPrintItems = useMemo(() => {
        let filtered = printItems;

        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item
                        .customerName!.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.customerPhone!.includes(searchTerm),
            );
        }

        if (filterBy === "not-printed") {
            filtered = filtered.filter((item) => !item.isPrinted);
        }

        return filtered;
    }, [printItems, searchTerm, filterBy]);

    const isEmpty = processedPrintItems.length === 0 && searchTerm !== "";
    const isEmptyInitial = printItems.length === 0;

    const fetchItems = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getItems();
            setPrintItems(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os itens. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [fetchItems]),
    );

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === processedPrintItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(processedPrintItems.map((item) => item.id));
        }
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
    };

    const handleOpenModal = () => {
        if (selectedIds.length === 0) {
            toast.showToast({
                title: "Nenhum item selecionado",
                description:
                    "Por favor, selecione ao menos um item para imprimir.",
                status: "warning",
            });
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSaveNewPrintBatch = async () => {
        setIsSavingLoading(true);
        if (selectedIds.length === 0) return;

        try {
            const newPrint = {
                orderItemIds: selectedIds,
            };

            const printBatch: PrintBatchDetail = await createPrintBatch(
                newPrint,
            );

            toast.showToast({
                title: "Sucesso!",
                description: "O arquivo PDF esta sendo aberto.",
                status: "success",
            });

            const pdfBlob = await downloadPrintBatch(printBatch.id);
            const filename = `lote-impressao-${printBatch.id}.pdf`;

            try {
                const fileURL = URL.createObjectURL(pdfBlob);
                window.open(fileURL, "_blank");
            } catch (error) {
                toast.showToast({
                    title: "Erro",
                    description: "Não foi possível abrir o PDF.",
                    status: "error",
                });
            }

            setIsModalOpen(false);
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível gerar o lote.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando itens...
                </Text>
            </Center>
        );
    }

    return (
        <>
            <ScrollView
                flex={1}
                bg={backgroundColor}
                showsVerticalScrollIndicator={false}
            >
                <Center>
                    <Box
                        w="100%"
                        maxW={{ md: "960px", lg: "1100px" }}
                        px={4}
                        pt={6}
                    >
                        <Breadcrumbs />
                        <VStack space={4}>
                            <VStack space={4}>
                                {!isEmptyInitial && (
                                    <VStack space={6} mt={2}>
                                        <SearchInput
                                            value={searchTerm}
                                            onChangeText={setSearchTerm}
                                            placeholder="Buscar por cliente ou telefone..."
                                        />
                                        <SortButtons
                                            sortBy={filterBy}
                                            onSortChange={(newFilterBy) =>
                                                setFilterBy(
                                                    newFilterBy as
                                                        | "all"
                                                        | "not-printed",
                                                )
                                            }
                                            options={filterOptions}
                                            label="Filtrar por:"
                                        />
                                    </VStack>
                                )}
                            </VStack>

                            {isEmptyInitial ? (
                                <Center py={10}>
                                    <VStack alignItems="center" space={4}>
                                        <Icon
                                            as={Ionicons}
                                            name="cube"
                                            size={20}
                                            color={mediumGreyColor}
                                        />
                                        <VStack alignItems="center" space={2}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="medium"
                                                color={mediumGreyColor}
                                            >
                                                Nenhum pedido cadastrado
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={mediumGreyColor}
                                                textAlign="center"
                                            >
                                                Adicione pedidos através da tela
                                                de cadastro
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Center>
                            ) : isEmpty ? (
                                <Center py={10}>
                                    <VStack alignItems="center" space={4}>
                                        <Icon
                                            as={Ionicons}
                                            name="search"
                                            size={20}
                                            color={mediumGreyColor}
                                        />
                                        <VStack alignItems="center" space={2}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="medium"
                                                color={mediumGreyColor}
                                            >
                                                Nenhum resultado encontrado
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={mediumGreyColor}
                                                textAlign="center"
                                            >
                                                Tente buscar por outro nome ou
                                                ajuste os filtros
                                            </Text>
                                        </VStack>
                                        <Pressable
                                            onPress={() => setSearchTerm("")}
                                        >
                                            <Box
                                                bg={secondaryColor}
                                                px={6}
                                                py={3}
                                                rounded="xl"
                                            >
                                                <HStack
                                                    alignItems="center"
                                                    space={2}
                                                >
                                                    <Icon
                                                        as={Ionicons}
                                                        name="refresh"
                                                        color={whiteColor}
                                                        size="sm"
                                                    />
                                                    <Text
                                                        color={whiteColor}
                                                        fontWeight="medium"
                                                    >
                                                        Limpar Busca
                                                    </Text>
                                                </HStack>
                                            </Box>
                                        </Pressable>
                                    </VStack>
                                </Center>
                            ) : (
                                <>
                                    <HStack
                                        justifyContent="space-between"
                                        alignItems="center"
                                        px={2}
                                        flexWrap="wrap"
                                    >
                                        <Text
                                            fontSize="md"
                                            fontWeight="bold"
                                            color={secondaryColor}
                                            mt={3}
                                        >
                                            {selectedIds.length} selecionado(s)
                                        </Text>

                                        <HStack
                                            alignItems="center"
                                            space={3}
                                            mt={3}
                                        >
                                            <Pressable
                                                onPress={handleClearSelection}
                                            >
                                                <HStack
                                                    alignItems="center"
                                                    space={1}
                                                >
                                                    <Icon
                                                        as={Ionicons}
                                                        name="trash-outline"
                                                        size="sm"
                                                        color={mediumGreyColor}
                                                    />
                                                    <Text
                                                        color={mediumGreyColor}
                                                        fontSize="sm"
                                                    >
                                                        Limpar
                                                    </Text>
                                                </HStack>
                                            </Pressable>

                                            <Text
                                                color={mediumGreyColor}
                                                fontSize="sm"
                                            >
                                                |
                                            </Text>

                                            <Pressable
                                                onPress={handleSelectAll}
                                            >
                                                <HStack
                                                    alignItems="center"
                                                    space={1}
                                                >
                                                    <Icon
                                                        as={Ionicons}
                                                        name={
                                                            selectedIds.length ===
                                                            processedPrintItems.length
                                                                ? "checkbox-outline"
                                                                : "square-outline"
                                                        }
                                                        size="sm"
                                                        color={mediumGreyColor}
                                                    />
                                                    <Text
                                                        color={mediumGreyColor}
                                                        fontSize="sm"
                                                    >
                                                        Todos
                                                    </Text>
                                                </HStack>
                                            </Pressable>
                                        </HStack>
                                    </HStack>

                                    <Flex
                                        direction="row"
                                        wrap="wrap"
                                        justify="flex-start"
                                        mx={-2}
                                    >
                                        {processedPrintItems.map(
                                            (item, index) => (
                                                <Box
                                                    key={index}
                                                    w={{
                                                        base: "100%",
                                                        md: "50%",
                                                        lg: "33.33%",
                                                    }}
                                                    mb={4}
                                                    px={2}
                                                >
                                                    <PrintItemCard
                                                        item={item}
                                                        isSelected={selectedIds.includes(
                                                            item.id,
                                                        )}
                                                        onSelect={handleSelect}
                                                    />
                                                </Box>
                                            ),
                                        )}
                                    </Flex>
                                </>
                            )}
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton action={handleOpenModal} icon="print" />

            <PrintAlert
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSaveNewPrintBatch}
                selectedCount={selectedIds.length}
                isLoading={isSavingLoading}
            />
        </>
    );
}
