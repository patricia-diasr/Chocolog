import React, { useState } from "react";
import {
    Center,
    HStack,
    Pressable,
    Text,
} from "native-base";
import { useAppColors } from "../hooks/useAppColors";
import StockOverviewScreen from "./stock-overview";
import StockRecordsScreen from "./stock-records";

export default function CustomersScreen() {
    const { backgroundColor, mediumGreyColor, secondaryColor } = useAppColors();
    const [activeTab, setActiveTab] = useState<"overview" | "records">(
        "overview",
    );

    return (
        <>
            <HStack
                background={backgroundColor}
                borderBottomWidth={1}
                borderBottomColor={mediumGreyColor}
                justifyContent={{ md: "flex-start" }}
            >
                <Pressable
                    flex={{ base: 1, md: "none" }}
                    w={{ md: "250px" }}
                    py={3}
                    borderBottomWidth={1.5}
                    borderBottomColor={
                        activeTab === "overview"
                            ? secondaryColor
                            : "transparent"
                    }
                    onPress={() => setActiveTab("overview")}
                >
                    <Center>
                        <Text
                            color={
                                activeTab === "overview"
                                    ? secondaryColor
                                    : mediumGreyColor
                            }
                            fontWeight="medium"
                        >
                            Visão Geral
                        </Text>
                    </Center>
                </Pressable>

                <Pressable
                    flex={{ base: 1, md: "none" }}
                    w={{ md: "250px" }}
                    py={3}
                    borderBottomWidth={1.5}
                    borderBottomColor={
                        activeTab === "records" ? secondaryColor : "transparent"
                    }
                    onPress={() => setActiveTab("records")}
                >
                    <Center>
                        <Text
                            color={
                                activeTab === "records"
                                    ? secondaryColor
                                    : mediumGreyColor
                            }
                            fontWeight="medium"
                        >
                            Registros
                        </Text>
                    </Center>
                </Pressable>
            </HStack>

            {activeTab === "overview" ? (
                <StockOverviewScreen />
            ) : (
                <StockRecordsScreen />
            )}
        </>
    );
}
