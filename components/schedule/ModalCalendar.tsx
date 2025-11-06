import React, { useMemo, useCallback } from "react";
import { Box, useToken, Icon, Text, Modal, Heading } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { Theme, DateData, MarkedDates } from "react-native-calendars/src/types";
import { useAppColors } from "../../hooks/useAppColors";

interface Props {
    isOpen: boolean;
    handleClose: () => void;
    handleDayPress: (day: DateData) => void;
    markedDates: MarkedDates;
    currentDisplayMonth: string;
    onMonthChange: (monthString: string) => void;
    minDate?: string;
    disablePastDates?: boolean;
};

export default function ModalCalendar({
    isOpen,
    handleClose,
    handleDayPress,
    markedDates,
    currentDisplayMonth,
    onMonthChange,
    minDate,
    disablePastDates = false,
}: Props) {
    const {
        whiteColor,
        primaryColor,
        secondaryColor,
        mediumGreyColor,
        blackColor,
        borderColor,
        lightGreyColor,
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
            textDisabledColor: "#d9e1e8",
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
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <Modal.Content
                maxWidth="400px"
                bg={whiteColor}
                rounded="2xl"
                shadow={6}
                borderWidth={1}
                borderColor={borderColor}
            >
                <Modal.CloseButton rounded="full" _icon={{ size: "sm" }} />
                <Modal.Header bg="transparent" borderBottomWidth={0} pb={2}>
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={secondaryColor}
                    >
                        Selecionar data
                    </Text>
                </Modal.Header>
                <Modal.Body
                    px={6}
                    py={5}
                    borderTopWidth={1.5}
                    borderBottomWidth={1.5}
                    borderColor={lightGreyColor}
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
                        enableSwipeMonths={false}
                        minDate={disablePastDates ? minDate : undefined}
                        disableAllTouchEventsForDisabledDays={true}
                    />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
}
