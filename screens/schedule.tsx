import { useState, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    ScrollView,
    VStack,
    Icon,
    Text,
    Center,
    useToken,
    Box,
    Flex,
    Pressable,
    HStack,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { DateData } from "react-native-calendars";
import InfoList from "../components/layout/InfoList";
import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import MonthlyCalendar from "../components/schedule/MonthlyCalendar";
import { StatItem } from "../types/stats";
import { Order } from "../types/order";
import { useAppColors } from "../hooks/useAppColors";
import { formatDate, formatOrderDetailTitle } from "../utils/formatters";
import { getStatusDetails } from "../utils/statusConfig";

const ordersMock: Order[] = [
    {
        id: "1",
        created_date: "2025-02-25",
        due_date: "2025-02-25",
        status: "completed",
        details: [
            {
                id: "1",
                size: "500g",
                flavor1: "Sensação",
                flavor2: "Prestígio",
                quantity: 2,
                unit_price: 60,
                total_price: 120,
                notes: "Embalagem rosa",
                status: "completed",
                custom_made: true,
            },
            {
                id: "2",
                size: "500g",
                flavor1: "Maracujá",
                quantity: 1,
                unit_price: 60,
                total_price: 60,
                status: "completed",
                custom_made: false,
            },
        ],
        charge: {
            id: "1",
            date: "2025-02-20",
            status: "paid",
            subtotal: 180.0,
            discount: 10,
            total: 170.0,
            payments: [],
        },
        customer: {
            id: "1",
            name: "Maria Silva",
            phone: "11999999999",
            isReseller: true,
        },
    },
    {
        id: "2",
        created_date: "2025-02-24",
        due_date: "2025-02-26",
        status: "pending",
        details: [
            {
                id: "3",
                size: "1kg",
                flavor1: "Chocolate",
                flavor2: "Morango",
                quantity: 1,
                unit_price: 80,
                total_price: 80,
                notes: "Entrega às 14h",
                status: "pending",
                custom_made: true,
            },
        ],
        charge: {
            id: "2",
            date: "2025-02-24",
            status: "pending",
            subtotal: 80,
            discount: 0,
            total: 80.0,
            payments: [],
        },
        customer: {
            id: "2",
            name: "João Santos",
            phone: "11888888888",
            isReseller: false,
        },
    },
    {
        id: "3",
        created_date: "2025-02-23",
        due_date: "2025-02-25",
        status: "pending",
        details: [
            {
                id: "4",
                size: "350g",
                flavor1: "Brigadeiro",
                quantity: 3,
                unit_price: 40,
                total_price: 120,
                status: "pending",
                custom_made: false,
            },
        ],
        charge: {
            id: "3",
            date: "2025-02-23",
            status: "pending",
            subtotal: 120,
            discount: 5,
            total: 115.0,
            payments: [],
        },
        customer: {
            id: "3",
            name: "Ana Costa",
            phone: "11777777777",
            isReseller: true,
        },
    },
    {
        id: "4",
        created_date: "2025-02-22",
        due_date: "2025-02-28",
        status: "pending",
        details: [
            {
                id: "5",
                size: "500g",
                flavor1: "Leite Ninho",
                quantity: 2,
                unit_price: 65,
                total_price: 130,
                status: "pending",
                custom_made: false,
            },
        ],
        charge: {
            id: "4",
            date: "2025-02-22",
            status: "pending",
            subtotal: 130,
            discount: 0,
            total: 130.0,
            payments: [],
        },
        customer: {
            id: "4",
            name: "Carlos Oliveira",
            phone: "11666666666",
            isReseller: false,
        },
    },
];

export default function ScheduleScreen() {
    const navigation = useNavigation();
    const {
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        mediumGreyColor,
    } = useAppColors();

    const [resolvedPrimaryColor, resolvedSecondaryColor] = useToken("colors", [
        primaryColor,
        secondaryColor,
    ]);

    const [orders, setOrders] = useState<Order[]>(ordersMock);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "pending">("all");

    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().slice(0, 10),
    );

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "checkmark-done" },
        { value: "pending", label: "Pendentes", icon: "time" },
    ];

    const ordersDate = useMemo(() => {
        let filtered = orders;

        if (selectedDate) {
            filtered = filtered.filter(
                (order) => order.due_date === selectedDate,
            );
        }

        return filtered;
    }, [orders, selectedDate]);

    const processedOrders = useMemo(() => {
        let filtered = ordersDate;

        if (searchTerm) {
            filtered = filtered.filter((order) =>
                order.customer?.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            );
        }

        if (filterBy === "pending") {
            filtered = filtered.filter((order) => order.status === "pending");
        }

        return filtered;
    }, [ordersDate, searchTerm, filterBy]);

    const orderItems = useMemo(() => {
        return processedOrders.map((order) => {
            const status = getStatusDetails(order.status);
            return {
                id: order.id,
                title: order.customer?.name,
                info: order.details
                    .map((orderDetail) => formatOrderDetailTitle(orderDetail))
                    .join("\n"),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [processedOrders]);

    const ordersStats = useMemo(() => {
        const total = ordersDate.length;
        const pending = ordersDate.filter((o) => o.status === "pending").length;
        const completed = ordersDate.filter(
            (o) => o.status === "completed",
        ).length;

        const stats: StatItem[] = [
            {
                value: total,
                label: "Total",
            },
            {
                value: pending,
                label: "Pendentes",
            },
            {
                value: completed,
                label: "Concluídos",
            },
        ];

        return { total, pending, completed, stats };
    }, [ordersDate]);

    const isEmpty = processedOrders.length === 0 && searchTerm !== "";
    const isEmptyInitial = orders.length === 0;

    const handleNavigateToOrder = (id: string) => {
        navigation.navigate("Order" as never);
    };

    const handleDayPress = useCallback((day: DateData) => {
        setSelectedDate(day.dateString);
    }, []);

    const markedDaysWithOrders = useMemo(() => {
        return orders.reduce((acc, order) => {
            const date = order.due_date;
            if (date) {
                acc[date] = { marked: true, dotColor: resolvedPrimaryColor };
            }
            return acc;
        }, {});
    }, [orders, resolvedPrimaryColor]);

    const markedDates = useMemo(() => {
        const newMarkedDates = { ...markedDaysWithOrders };
        if (selectedDate) {
            newMarkedDates[selectedDate] = {
                selected: true,
                disableTouchEvent: true,
                selectedColor: resolvedSecondaryColor,
            };
        }
        return newMarkedDates;
    }, [selectedDate, markedDaysWithOrders, resolvedSecondaryColor]);

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
                        <Flex
                            direction={{ base: "column", lg: "row" }}
                            w="100%"
                            justifyContent="space-between"
                        >
                            <VStack
                                w={{ base: "100%", lg: "50%" }}
                                space={4}
                                mb={{ base: 6, lg: 0 }}
                            >
                                <MonthlyCalendar
                                    selectedDate={selectedDate}
                                    handleDayPress={handleDayPress}
                                    markedDates={markedDates}
                                />
                                {!isEmptyInitial && (
                                    <StatsCard
                                        title="Resumo do Dia"
                                        icon="cube"
                                        stats={ordersStats.stats}
                                    />
                                )}
                            </VStack>

                            <VStack flex={1} space={6} ml={{ base: 0, lg: 8 }}>
                                {!isEmptyInitial && (
                                    <VStack space={6}>
                                        <SearchInput
                                            value={searchTerm}
                                            onChangeText={setSearchTerm}
                                            placeholder="Buscar pedido por cliente..."
                                        />
                                        <SortButtons
                                            sortBy={filterBy}
                                            onSortChange={(newFilterBy) =>
                                                setFilterBy(
                                                    newFilterBy as
                                                        | "all"
                                                        | "pending",
                                                )
                                            }
                                            options={filterOptions}
                                            label="Filtrar por:"
                                        />
                                    </VStack>
                                )}

                                {isEmptyInitial ? (
                                    <Center py={10}>
                                        <VStack alignItems="center" space={4}>
                                            <Icon
                                                as={Ionicons}
                                                name="calendar"
                                                size={20}
                                                color={mediumGreyColor}
                                            />
                                            <VStack
                                                alignItems="center"
                                                space={2}
                                            >
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
                                                    Adicione pedidos através da
                                                    tela do cliente
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
                                            <VStack
                                                alignItems="center"
                                                space={2}
                                            >
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
                                                    Tente buscar por outro nome
                                                    ou ajuste os filtros
                                                </Text>
                                            </VStack>
                                            <Pressable
                                                onPress={() =>
                                                    setSearchTerm("")
                                                }
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
                                    <InfoList
                                        title={`Pedidos de ${formatDate(
                                            selectedDate,
                                        )}`}
                                        icon="calendar"
                                        items={orderItems}
                                        emptyStateText="Nenhum pedido encontrado para esta data."
                                        onItemPress={handleNavigateToOrder}
                                    />
                                )}
                            </VStack>
                        </Flex>
                    </Box>
                </Center>
            </ScrollView>
        </>
    );
}
