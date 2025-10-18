import { useState, useMemo } from "react";
import {
    ScrollView,
    Flex,
    Box,
    VStack,
    Icon,
    HStack,
    Text,
    Center,
    Pressable,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import StockCard from "../components/stock/StockCard";
import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import { normalizeText } from "../utils/formatters";
import { StockItem } from "../types/stock";
import { StatItem } from "../types/stats";
import { useAppColors } from "../hooks/useAppColors";
import { STOCK_STATUS } from "../configs/stock";

export default function StockOverviewScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();

    const stockData: StockItem[] = [
        {
            flavor: "Prestígio",
            sizes: [
                { size: "500g", quantity: 150 },
                { size: "350g", quantity: 200 },
                { size: "Coração", quantity: 20 },
                { size: "1Kg", quantity: 3 },
            ],
            status: STOCK_STATUS.high,
        },
        {
            flavor: "Brigadeiro",
            sizes: [
                { size: "500g", quantity: 120 },
                { size: "350g", quantity: 180 },
                { size: "Coração", quantity: 28 },
                { size: "1Kg", quantity: 3 },
            ],
            status: STOCK_STATUS.high,
        },
        {
            flavor: "Sensação",
            sizes: [
                { size: "500g", quantity: 80 },
                { size: "350g", quantity: 60 },
                { size: "Coração", quantity: 12 },
                { size: "1Kg", quantity: 0 },
            ],
            status: STOCK_STATUS.medium,
        },
        {
            flavor: "Doce de Leite",
            sizes: [
                { size: "500g", quantity: 40 },
                { size: "350g", quantity: 25 },
                { size: "Coração", quantity: 8 },
                { size: "1Kg", quantity: 0 },
            ],
            status: STOCK_STATUS.low,
        },
        {
            flavor: "Maracujá",
            sizes: [
                { size: "500g", quantity: 80 },
                { size: "350g", quantity: 60 },
                { size: "Coração", quantity: 6 },
                { size: "1Kg", quantity: 0 },
            ],
            status: STOCK_STATUS.medium,
        },
        {
            flavor: "Limão",
            sizes: [
                { size: "500g", quantity: 80 },
                { size: "350g", quantity: 60 },
                { size: "Coração", quantity: 3 },
                { size: "1Kg", quantity: 0 },
            ],
            status: STOCK_STATUS.medium,
        },
        {
            flavor: "Ninho",
            sizes: [
                { size: "500g", quantity: 180 },
                { size: "350g", quantity: 150 },
                { size: "Coração", quantity: 18 },
                { size: "1Kg", quantity: 0 },
            ],
            status: STOCK_STATUS.high,
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "quantity">("name");

    const sortOptions: SortOption[] = [
        { value: "name", label: "Nome", icon: "text" },
        { value: "quantity", label: "Quantidade", icon: "bar-chart" },
    ];

    const stockStats = useMemo(() => {
        const totalProducts = stockData.length;
        const totalUnits = stockData.reduce(
            (sum, item) =>
                sum +
                item.sizes.reduce(
                    (sizeSum, size) => sizeSum + size.quantity,
                    0,
                ),
            0,
        );

        const lowStockCount = stockData.filter(
            (item) => item.status === STOCK_STATUS.low,
        ).length;

        const outOfStockCount = stockData.filter((item) => {
            const total = item.sizes.reduce(
                (sum, size) => sum + size.quantity,
                0,
            );
            return total === 0;
        }).length;

        const stats: StatItem[] = [
            {
                value: totalProducts,
                label: "Produtos",
            },
            {
                value: totalUnits,
                label: "Unidades",
            },
            {
                value: lowStockCount,
                label: "Estoque Baixo",
            },
        ];

        if (outOfStockCount > 0) {
            stats.push({
                value: outOfStockCount,
                label: "Sem Estoque",
            });
        }

        return {
            totalProducts,
            totalUnits,
            lowStockCount,
            outOfStockCount,
            stats,
        };
    }, [stockData]);

    const processedStock = useMemo(() => {
        let filtered = stockData.filter((item) =>
            normalizeText(item.flavor).includes(normalizeText(searchTerm)),
        );

        filtered.sort((a, b) => {
            const totalA = a.sizes.reduce(
                (sum, size) => sum + size.quantity,
                0,
            );
            const totalB = b.sizes.reduce(
                (sum, size) => sum + size.quantity,
                0,
            );

            switch (sortBy) {
                case "quantity":
                    return totalB - totalA;
                default:
                    return a.flavor.localeCompare(b.flavor);
            }
        });

        return filtered;
    }, [stockData, searchTerm, sortBy]);

    const isEmpty = processedStock.length === 0 && searchTerm !== "";
    const isEmptyInitial = stockData.length === 0;

    return (
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
                                <StatsCard
                                    title="Resumo do Estoque"
                                    icon="stats-chart"
                                    stats={stockStats.stats}
                                />
                            )}

                            {!isEmptyInitial && (
                                <VStack space={6} mt={2}>
                                    <SearchInput
                                        value={searchTerm}
                                        onChangeText={setSearchTerm}
                                        placeholder="Buscar sabor..."
                                    />
                                    <SortButtons
                                        sortBy={sortBy}
                                        onSortChange={(newSortBy) =>
                                            setSortBy(
                                                newSortBy as
                                                    | "name"
                                                    | "quantity",
                                            )
                                        }
                                        options={sortOptions}
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
                                            Nenhum produto no estoque
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            color={mediumGreyColor}
                                            textAlign="center"
                                        >
                                            Adicione produtos através dos
                                            registros de entrada
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
                                            Tente buscar por outro sabor ou
                                            ajuste os filtros de ordenação
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
                                {stockStats.lowStockCount > 0 && (
                                    <Box
                                        bg="orange.50"
                                        borderColor="orange.200"
                                        borderWidth={1}
                                        p={4}
                                        rounded="xl"
                                    >
                                        <HStack alignItems="center" space={3}>
                                            <Icon
                                                as={Ionicons}
                                                name="warning"
                                                color="orange.600"
                                                size="md"
                                            />
                                            <VStack flex={1}>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    color="orange.800"
                                                >
                                                    Atenção: Estoque Baixo
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    color="orange.700"
                                                >
                                                    {stockStats.lowStockCount}{" "}
                                                    produto
                                                    {stockStats.lowStockCount !==
                                                    1
                                                        ? "s"
                                                        : ""}{" "}
                                                    com estoque baixo
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                )}

                                <Flex
                                    direction="row"
                                    wrap="wrap"
                                    justify="flex-start"
                                    mx={-2}
                                    mt={3}
                                >
                                    {processedStock.map((item, index) => (
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
                                            <StockCard
                                                flavor={item.flavor}
                                                sizes={item.sizes}
                                                status={item.status}
                                            />
                                        </Box>
                                    ))}
                                </Flex>
                            </>
                        )}
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
}
