import { useState, useMemo, useCallback, useEffect } from "react";
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
    Spinner,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { DateData } from "react-native-calendars";
import { StatItem } from "../types/stats";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import { getOrdersByDate } from "../services/orderService";
import { getStatusDetails } from "../utils/statusConfig";
import {
    formatDate,
    formatOrderDetailTitleWithNotes,
} from "../utils/formatters";
import { getFirstDayOfMonth, getMonthString } from "../utils/dates";
import { OrderResponse } from "../types/order";
import InfoList from "../components/layout/InfoList";
import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import MonthlyCalendar from "../components/schedule/MonthlyCalendar";

export default function ScheduleScreen() {
    const navigation = useNavigation();
    const {
        backgroundColor,
        whiteColor,
        primaryColor,
        secondaryColor,
        mediumGreyColor,
    } = useAppColors();
    const toast = useCustomToast();

    const [resolvedPrimaryColor, resolvedSecondaryColor] = useToken("colors", [
        primaryColor,
        secondaryColor,
    ]);

    const initialDate = useMemo(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - offset);
        return localTime.toISOString().slice(0, 10);
    }, []);

    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "pending">("all");
    const [selectedDate, setSelectedDate] = useState<string>(initialDate);
    const [currentMonth, setCurrentMonth] = useState<string>(
        getMonthString(initialDate),
    );

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "checkmark-done" },
        { value: "pending", label: "Pendentes", icon: "time" },
    ];

    const ordersDate = useMemo(() => {
        return orders.filter(
            (order) => order.expectedPickupDate.slice(0, 10) === selectedDate,
        );
    }, [orders, selectedDate]);

    const processedOrders = useMemo(() => {
        let filtered = ordersDate;

        if (searchTerm) {
            filtered = filtered.filter((order) =>
                order.customer?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            );
        }

        if (filterBy === "pending") {
            filtered = filtered.filter((order) => order.status === "PENDING");
        }

        return filtered;
    }, [ordersDate, searchTerm, filterBy]);

    const orderItems = useMemo(() => {
        return processedOrders.map((order) => {
            const status = getStatusDetails(order.status);
            return {
                id: order.id,
                title: order.customer?.name,
                info: order.orderItems
                    .map((orderDetail) =>
                        formatOrderDetailTitleWithNotes(orderDetail),
                    )
                    .join("\n"),
                badgeColor: status.colorScheme,
                badgeIcon: status.icon,
                badgeLabel: status.label,
            };
        });
    }, [processedOrders]);

    const ordersStats = useMemo(() => {
        const total = ordersDate.filter((o) => o.status !== "CANCELLED").length;
        const pending = ordersDate.filter((o) => o.status === "PENDING").length;
        const completed = ordersDate.filter(
            (o) => o.status === "COMPLETED" || o.status === "READY_FOR_PICKUP",
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
                label: "Prontos",
            },
        ];

        return { total, pending, completed, stats };
    }, [ordersDate]);

    const isEmpty = processedOrders.length === 0 && searchTerm !== "";
    const isEmptyInitial = orders.length === 0;

    const markedDaysWithOrders = useMemo(() => {
        return orders.reduce((acc, order) => {
            const date = order.expectedPickupDate.slice(0, 10);
            if (date) {
                acc[date] = {
                    ...(acc[date] || {}),
                    marked: true,
                    dotColor: resolvedPrimaryColor,
                };
            }
            return acc;
        }, {} as Record<string, any>);
    }, [orders, resolvedPrimaryColor]);

    const markedDates = useMemo(() => {
        const newMarkedDates = { ...markedDaysWithOrders };
        if (selectedDate) {
            newMarkedDates[selectedDate] = {
                ...(newMarkedDates[selectedDate] || {}),
                selected: true,
                disableTouchEvent: true,
                selectedColor: resolvedSecondaryColor,
            };
        }
        return newMarkedDates;
    }, [selectedDate, markedDaysWithOrders, resolvedSecondaryColor]);

    const displayDateForCalendar = getFirstDayOfMonth(currentMonth);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getOrdersByDate(currentMonth);
            setOrders(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os pedidos. Tente novamente.",
                status: "error",
            });
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth, toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        if (getMonthString(selectedDate) !== currentMonth) {
            setSelectedDate(getFirstDayOfMonth(currentMonth));
        }
    }, [currentMonth, selectedDate]);

    const handleNavigateToOrder = (orderId: number) => {
        const customerId = orders.find((o) => o.id === orderId)?.customer?.id;

        if (customerId) {
            navigation.navigate("Order", {
                customerId: customerId,
                orderId: orderId,
                source: "Schedule",
            });
        }
    };

    const handleDayPress = useCallback((day: DateData) => {
        setSelectedDate(day.dateString);
        setSearchTerm("");
    }, []);

    const handleMonthChange = useCallback((monthString: string) => {
        setCurrentMonth(monthString);
    }, []);

    if (isLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando pedidos...
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
                                    currentDisplayMonth={displayDateForCalendar}
                                    handleDayPress={handleDayPress}
                                    markedDates={markedDates}
                                    onMonthChange={handleMonthChange}
                                />
                                {!isEmptyInitial && (
                                    <StatsCard
                                        title="Resumo do Dia"
                                        icon="calendar"
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
