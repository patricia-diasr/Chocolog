import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
    Box,
    Center,
    Text,
    ScrollView,
    Spinner,
    VStack,
    HStack,
    Pressable,
    Icon,
    useToken,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { DateData } from "react-native-calendars";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import { useReportsData } from "../hooks/useReportsData";
import {
    getReports,
    GetReportsParams,
    PeriodType,
} from "../services/reportsService";
import { ReportData } from "../types/reports";
import { formatDate } from "../utils/formatters";
import { getISODateString } from "../utils/dates";
import KPISection from "../components/reports/KPISection";
import FlavorSalesChart from "../components/reports/FlavorSalesChart";
import OnDemandVsStockChart from "../components/reports/OnDemandVsStockChart";
import PaymentMethodChart from "../components/reports/PaymentMethodChart";
import RevenueVsReceivedChart from "../components/reports/RevenueVsReceivedChart";
import SalesByPeriodChart from "../components/reports/SalesByPeriodChart";
import OrdersByStatusChart from "../components/reports/OrdersByStatusChart";
import ResponsiveChartRow from "../components/reports/ResponsiveChartRow";
import ModalCalendar from "../components/schedule/ModalCalendar";
import SortButtons from "../components/layout/SortButtons";

const periodFilterOptions = [
    { label: "Dia", value: "DAY", icon: "calendar" },
    { label: "Semana", value: "WEEK", icon: "analytics" },
    { label: "Mês", value: "MONTH", icon: "grid" },
];

export default function ReportsScreen() {
    const {
        backgroundColor,
        secondaryColor,
        mediumGreyColor,
        borderColor,
    } = useAppColors();
    const [resolvedSecondaryColor] = useToken("colors", [secondaryColor]);
    const toast = useCustomToast();

    const [reportData, setReportData] = useState<ReportData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [periodType, setPeriodType] = useState<PeriodType>("DAY");
    const [startDate, setStartDate] = useState<string>(
        getISODateString(new Date(new Date().getFullYear(), 0, 1)),
    );
    const [endDate, setEndDate] = useState<string>(
        getISODateString(new Date()),
    );

    const [startDateText, setStartDateText] = useState("");
    const [endDateText, setEndDateText] = useState("");

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateFieldToSet, setDateFieldToSet] = useState<
        "startDate" | "endDate" | null
    >(null);

    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
        getISODateString(new Date()),
    );

    const {
        ordersByStatusData,
        onDemandVsStockData,
        flavorData,
        allSizes,
        salesByPeriodData,
        revenueChartData,
    } = useReportsData(reportData);

    const openCalendar = (field: "startDate" | "endDate") => {
        setDateFieldToSet(field);
        setCurrentCalendarMonth(field === "startDate" ? startDate : endDate);
        setIsCalendarOpen(true);
    };

    const markedDates = useMemo(() => {
        const marks: any = {};
        const selectedDate =
            dateFieldToSet === "startDate" ? startDate : endDate;

        if (selectedDate) {
            marks[selectedDate] = {
                selected: true,
                selectedColor: resolvedSecondaryColor,
            };
        }
        return marks;
    }, [dateFieldToSet, startDate, endDate, resolvedSecondaryColor]);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: GetReportsParams = { startDate, endDate, periodType };
            const data = await getReports(params);
            setReportData(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os relatórios. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, startDate, endDate, periodType]);

    useEffect(() => {
        setStartDateText(formatDate(startDate));
        setEndDateText(formatDate(endDate));
    }, [startDate, endDate]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleDayPress = useCallback(
        (day: DateData) => {
            const isoDate = day.dateString;
            if (dateFieldToSet === "startDate") {
                setStartDate(isoDate);
            } else if (dateFieldToSet === "endDate") {
                setEndDate(isoDate);
            }
            setIsCalendarOpen(false);
            setDateFieldToSet(null);
        },
        [dateFieldToSet],
    );

    const handleMonthChange = useCallback((monthString: string) => {
        setCurrentCalendarMonth(monthString);
    }, []);

    const FilterButton = ({
        onPress,
        label,
        icon,
    }: {
        onPress: () => void;
        label: string;
        icon: string;
    }) => (
        <Pressable
            onPress={onPress}
            bg={borderColor}
            px={3}
            py={2}
            rounded="lg"
        >
            <HStack alignItems="center" space={1}>
                <Icon
                    as={Ionicons}
                    name={icon as any}
                    size="xs"
                    color={mediumGreyColor}
                />
                <Text fontSize="xs" color={mediumGreyColor} fontWeight="medium">
                    {label}
                </Text>
            </HStack>
        </Pressable>
    );

    return (
        <>
            <Box flex={1} bg={backgroundColor}>
                {isLoading && !reportData ? (
                    <Center flex={1} bg={backgroundColor}>
                        <Spinner size="lg" color={secondaryColor} />
                        <Text mt={4} color={mediumGreyColor}>
                            Carregando relatórios...
                        </Text>
                    </Center>
                ) : (
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
                                    <Box
                                        width="100%"
                                        display="flex"
                                        flexDirection={{
                                            base: "column",
                                            md: "row",
                                        }}
                                        justifyContent={{ md: "space-between" }}
                                        alignItems={{ md: "center" }}
                                    >
                                        <HStack
                                            space={2}
                                            alignItems="center"
                                            flexWrap="wrap"
                                            
                                        >
                                            <Text
                                                fontSize="sm"
                                                color={mediumGreyColor}
                                            >
                                                Período:
                                            </Text>

                                            <HStack space={2} my={1}>
                                                <FilterButton
                                                    onPress={() =>
                                                        openCalendar(
                                                            "startDate",
                                                        )
                                                    }
                                                    label={`Início: ${startDateText}`}
                                                    icon="calendar-outline"
                                                />
                                                <FilterButton
                                                    onPress={() =>
                                                        openCalendar("endDate")
                                                    }
                                                    label={`Fim: ${endDateText}`}
                                                    icon="calendar"
                                                />
                                            </HStack>
                                        </HStack>

                                        <Box mt={{base: 2, md:0}}>
                                            <SortButtons
                                                label="Agrupar por:"
                                                sortBy={periodType}
                                                onSortChange={(value) =>
                                                    setPeriodType(
                                                        value as PeriodType,
                                                    )
                                                }
                                                options={periodFilterOptions}
                                            />
                                        </Box>
                                    </Box>

                                    {isLoading && reportData && (
                                        <Center p={4}>
                                            <Spinner color={secondaryColor} />
                                        </Center>
                                    )}

                                    {reportData && (
                                        <>
                                            <KPISection
                                                kpis={reportData.kpis}
                                            />
                                            <SalesByPeriodChart
                                                data={salesByPeriodData}
                                            />
                                            <ResponsiveChartRow>
                                                <OrdersByStatusChart
                                                    data={ordersByStatusData}
                                                />
                                                <OnDemandVsStockChart
                                                    data={onDemandVsStockData}
                                                />
                                            </ResponsiveChartRow>
                                            <FlavorSalesChart
                                                data={flavorData}
                                                sizes={allSizes}
                                            />
                                            <ResponsiveChartRow>
                                                <RevenueVsReceivedChart
                                                    data={revenueChartData}
                                                />
                                                <PaymentMethodChart
                                                    data={
                                                        reportData.financials
                                                            .receivedByPaymentMethod
                                                    }
                                                />
                                            </ResponsiveChartRow>
                                        </>
                                    )}
                                </VStack>
                            </Box>
                        </Center>
                    </ScrollView>
                )}
            </Box>

            <ModalCalendar
                handleDayPress={handleDayPress}
                markedDates={markedDates}
                isOpen={isCalendarOpen}
                handleClose={() => setIsCalendarOpen(false)}
                currentDisplayMonth={currentCalendarMonth}
                onMonthChange={handleMonthChange}
            />
        </>
    );
}
