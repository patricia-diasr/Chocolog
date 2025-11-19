import { useState, useMemo, useCallback } from "react";
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
    Spinner,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import { getFlavors } from "../services/flavorService";
import { STOCK_STATUS } from "../configs/stock";
import { normalizeText } from "../utils/formatters";
import { getFlavorStockStatus } from "../utils/statusConfig";
import { StatItem } from "../types/stats";
import { Flavor } from "../types/flavor";
import { StockStatus } from "../types/stock";
import StockCard from "../components/stock/StockCard";
import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import SortButtons, { SortOption } from "../components/layout/SortButtons";

export default function StockOverviewScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();
    const toast = useCustomToast();

    const [flavors, setFlavors] = useState<Flavor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "quantity">("name");

    const sortOptions: SortOption[] = [
        { value: "name", label: "Nome", icon: "text" },
        { value: "quantity", label: "Quantidade", icon: "bar-chart" },
    ];

    const stockStats = useMemo(() => {
        const totalProducts = flavors.length;
        const totalUnits = flavors.reduce(
            (sum, item) =>
                sum +
                item.sizes.reduce(
                    (sizeSum, size) => sizeSum + size.totalQuantity,
                    0,
                ),
            0,
        );

        const lowStockCount = flavors.filter(
            (item) => item.status === STOCK_STATUS.LOW,
        ).length;

        const outOfStockCount = flavors.filter((item) => {
            const total = item.sizes.reduce(
                (sum, size) => sum + size.totalQuantity,
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

        return {
            totalProducts,
            totalUnits,
            lowStockCount,
            outOfStockCount,
            stats,
        };
    }, [flavors]);

    const processedStock = useMemo(() => {
        let filtered = flavors.filter((item) =>
            normalizeText(item.name).includes(normalizeText(searchTerm)),
        );

        filtered.sort((a, b) => {
            const totalA = a.sizes.reduce(
                (sum, size) => sum + size.totalQuantity,
                0,
            );
            const totalB = b.sizes.reduce(
                (sum, size) => sum + size.totalQuantity,
                0,
            );

            switch (sortBy) {
                case "quantity":
                    return totalB - totalA;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [flavors, searchTerm, sortBy]);

    const isEmpty = processedStock.length === 0 && searchTerm !== "";
    const isEmptyInitial = flavors.length === 0;

    const fetchStock = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getFlavors();

            const processedFlavors = data.map((flavor) => {
                const sizeStatuses: StockStatus[] = flavor.sizes.map((size) =>
                    getFlavorStockStatus(
                        size.totalQuantity,
                        size.remainingQuantity,
                    ),
                );

                let overallStatus: StockStatus;

                if (sizeStatuses.length === 0) {
                    overallStatus = STOCK_STATUS.OUT_OF_STOCK;
                } else if (
                    sizeStatuses.some(
                        (status) => status.label === STOCK_STATUS.LOW.label,
                    )
                ) {
                    overallStatus = STOCK_STATUS.LOW;
                } else if (
                    sizeStatuses.some(
                        (status) => status.label === STOCK_STATUS.MEDIUM.label,
                    )
                ) {
                    overallStatus = STOCK_STATUS.MEDIUM;
                } else if (
                    sizeStatuses.some(
                        (status) => status.label === STOCK_STATUS.HIGH.label,
                    )
                ) {
                    overallStatus = STOCK_STATUS.HIGH;
                } else {
                    overallStatus = STOCK_STATUS.OUT_OF_STOCK;
                }

                return {
                    ...flavor,
                    status: overallStatus,
                };
            });

            setFlavors(processedFlavors);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar o estoque. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useFocusEffect(
        useCallback(() => {
            fetchStock();
        }, [fetchStock]),
    );

    if (isLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando estoque...
                </Text>
            </Center>
        );
    }
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
                                                id={item.id}
                                                name={item.name}
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
