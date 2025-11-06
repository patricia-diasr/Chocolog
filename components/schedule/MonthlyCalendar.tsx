import React, { useMemo, useCallback } from "react";
import { Box, useToken, Icon, Heading } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { Theme, DateData, MarkedDates } from "react-native-calendars/src/types";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    selectedDate: string;
    currentDisplayMonth: string;
    handleDayPress: (day: DateData) => void;
    markedDates: MarkedDates;
    onMonthChange: (monthString: string) => void;
};

export default function MonthlyCalendar({
    selectedDate,
    currentDisplayMonth,
    handleDayPress,
    markedDates,
    onMonthChange,
}: Props) {
    const {
        whiteColor,
        primaryColor,
        secondaryColor,
        mediumGreyColor,
        blackColor,
        borderColor,
    } = useAppColors();

    const [
        resolvedPrimaryColor,
        resolvedSecondaryColor,
        resolvedWhiteColor,
        resolvedMediumGreyColor,
        resolvedBlackColor,
        resolvedBorderColor,
    ] = useToken("colors", [
        primaryColor,
        secondaryColor,
        whiteColor,
        mediumGreyColor,
        blackColor,
        borderColor,
    ]);

    const calendarTheme: Theme = useMemo(
        () => ({
            backgroundColor: resolvedWhiteColor,
            calendarBackground: resolvedWhiteColor,
            textSectionTitleColor: resolvedPrimaryColor,
            selectedDayBackgroundColor: resolvedSecondaryColor,
            textDayHeaderFontWeight: "600",
            selectedDayTextColor: resolvedWhiteColor,
            todayTextColor: resolvedPrimaryColor,
            dayTextColor: resolvedMediumGreyColor,
            arrowColor: resolvedBlackColor,
            textMonthFontWeight: "bold",
            indicatorColor: resolvedPrimaryColor,
            dotColor: resolvedSecondaryColor,
        }),
        [
            resolvedPrimaryColor,
            resolvedSecondaryColor,
            resolvedWhiteColor,
            resolvedMediumGreyColor,
            resolvedBlackColor,
            resolvedBorderColor,
        ],
    );

    const renderCustomHeader = useCallback(
        (date: Date) => {
            const headerDate = new Date(date);
            headerDate.setMonth(headerDate.getMonth());

            const currentYear = new Date().getFullYear();
            const options: Intl.DateTimeFormatOptions = {
                month: "long",
                timeZone: "UTC", 
            };

            if (headerDate.getFullYear() !== currentYear) {
                options.year = "numeric";
            }

            const monthText = new Intl.DateTimeFormat("pt-BR", options).format(
                headerDate,
            );

            const formattedMonth =
                monthText.charAt(0).toUpperCase() + monthText.slice(1);

            return (
                <Box>
                    <Heading size="md" color={resolvedBlackColor}>
                        {formattedMonth}
                    </Heading>
                </Box>
            );
        },
        [resolvedBlackColor],
    );

    const handleMonthChange = useCallback(
        (month: DateData) => {
            const monthString = month.dateString.slice(0, 7);
            onMonthChange(monthString);
        },
        [onMonthChange],
    );

    return (
        <Box
            bg={resolvedWhiteColor}
            p={4}
            rounded="2xl"
            shadow={2}
            borderWidth={1}
            borderColor={borderColor}
            width={{
                base: "100%",
                lg: "600px",
            }}
            maxWidth="100%"
        >
            <Calendar
                current={currentDisplayMonth}
                onDayPress={handleDayPress}
                onMonthChange={handleMonthChange}
                markedDates={markedDates}
                theme={calendarTheme}
                renderHeader={renderCustomHeader}
                renderArrow={(direction: "left" | "right") => (
                    <Icon
                        as={Ionicons}
                        name={
                            direction === "left"
                                ? "chevron-back"
                                : "chevron-forward"
                        }
                        color={blackColor}
                        size="md"
                    />
                )}
                enableSwipeMonths={true}
            />
        </Box>
    );
}
