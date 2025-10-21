import { useMemo, useState } from "react";
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
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../hooks/useAppColors";
import { ItemPrintBatch } from "../types/prints";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import SearchInput from "../components/layout/Searchbar";
import FabButton from "../components/layout/FabButton";
import PrintItemCard from "../components/print/PrintItemCard";
import PrintAlert from "../components/print/PrintAlert";
import { useCustomToast } from "../contexts/ToastProvider";

const printItemsMock: ItemPrintBatch[] = [
    {
        id: "2",
        order_id: "2",
        status: "pending",
        due_date: "2025-03-12",
        is_printed: false,
        order_detail: {
            id: "2",
            size: "1Kg",
            flavor1: "Brigadeiro",
            quantity: 1,
            unit_price: 95,
            total_price: 95,
            status: "pending",
            custom_made: false,
        },
        customer: {
            id: "5",
            name: "Ana Costa",
            phone: "19888888888",
            isReseller: true,
        },
    },
    {
        id: "3",
        order_id: "3",
        status: "pending",
        due_date: "2025-03-15",
        is_printed: false,
        order_detail: {
            id: "3",
            size: "Coração",
            flavor1: "Ninho",
            flavor2: "Maracujá",
            quantity: 5,
            unit_price: 35,
            total_price: 175,
            status: "completed",
            custom_made: false,
        },
        customer: {
            id: "6",
            name: "Carlos Souza",
            phone: "21777777777",
            isReseller: false,
        },
    },
    {
        id: "4",
        order_id: "2",
        status: "completed",
        due_date: "2025-03-12",
        is_printed: true,
        order_detail: {
            id: "3",
            size: "500g",
            flavor1: "Prestígio",
            quantity: 1,
            unit_price: 95,
            total_price: 95,
            notes: "Embalagem rosa",
            status: "pending",
            custom_made: false,
        },
        customer: {
            id: "5",
            name: "Ana Costa",
            phone: "19888888888",
            isReseller: true,
        },
    },
];

export default function NewPrintBatchScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();
    const toast = useCustomToast();

    const [printItems, setPrintItems] =
        useState<ItemPrintBatch[]>(printItemsMock);
    const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "not-printed">("all");

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "people" },
        { value: "not-printed", label: "Não impressos", icon: "warning" },
    ];

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

    const handleSaveNewPrintBatch = () => {
        toast.showToast({
            title: "Sucesso!",
            description: "O arquivo gerado esta sendo baixado.",
            status: "success",
        });
        setIsModalOpen(false);
    };

    const processedPrintItems = useMemo(() => {
        let filtered = printItems;

        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.customer.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.customer.phone.includes(searchTerm),
            );
        }

        if (filterBy === "not-printed") {
            filtered = filtered.filter((item) => !item.is_printed);
        }

        return filtered;
    }, [printItems, searchTerm, filterBy]);

    const isEmpty = processedPrintItems.length === 0 && searchTerm !== "";
    const isEmptyInitial = printItems.length === 0;

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
                                                        fontWeight={
                                                            mediumGreyColor
                                                        }
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
                                                        {...item}
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
            />
        </>
    );
}
