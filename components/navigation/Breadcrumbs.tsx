import React from "react";
import {
    useRoute,
    useNavigation,
    CommonActions,
} from "@react-navigation/native";
import {
    HStack,
    Text,
    Pressable,
    Center,
    Box,
    Icon,
    useBreakpointValue,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_CONFIG, AppScreenName } from "../../configs/navigation";
import { useAppColors } from "../../hooks/useAppColors";

interface Crumb {
    title: string;
    name: AppScreenName;
    params?: object;
}

const getTitle = (name: AppScreenName) => SCREEN_CONFIG[name]?.title || name;

export default function Breadcrumbs() {
    const { primaryColor, mediumGreyColor, darkGreyColor, backgroundColor } =
        useAppColors();

    const route = useRoute();
    const navigation = useNavigation();
    const crumbs: Crumb[] = [];

    const routeName = route.name as AppScreenName;
    const params = route.params as any;

    const isLargeScreen = useBreakpointValue({ base: false, md: true });

    switch (routeName) {
        case "Customer":
            crumbs.push({ title: getTitle("Customers"), name: "Customers" });
            crumbs.push({
                title: `${getTitle("Customer")} #${params?.customerId}`,
                name: "Customer",
                params: { customerId: params?.customerId },
            });
            break;

        case "PrintBatch":
            crumbs.push({ title: getTitle("Prints"), name: "Prints" });
            crumbs.push({
                title: `${getTitle("PrintBatch")} #${params?.printBatchId}`,
                name: "PrintBatch",
                params: { printBatchId: params?.printBatchId },
            });
            break;

        case "NewPrintBatch":
            crumbs.push({ title: getTitle("Prints"), name: "Prints" });
            crumbs.push({
                title: getTitle("NewPrintBatch"),
                name: "NewPrintBatch",
            });
            break;

        case "Order":
            const orderCrumb = {
                title: `${getTitle("Order")} #${params?.orderId}`,
                name: "Order",
                params,
            };

            if (params?.source === "Customer" && params?.customerId) {
                crumbs.push({
                    title: getTitle("Customers"),
                    name: "Customers",
                });
                crumbs.push({
                    title: `${getTitle("Customer")} #${params.customerId}`,
                    name: "Customer",
                    params: { customerId: params.customerId },
                });
                crumbs.push(orderCrumb);
            } else if (
                params?.source === "PrintBatch" &&
                params?.printBatchId
            ) {
                crumbs.push({ title: getTitle("Prints"), name: "Prints" });
                crumbs.push({
                    title: `${getTitle("PrintBatch")} #${params.printBatchId}`,
                    name: "PrintBatch",
                    params: { printBatchId: params.printBatchId },
                });
                crumbs.push(orderCrumb);
            } else {
                crumbs.push({ title: getTitle("Schedule"), name: "Schedule" });
                crumbs.push(orderCrumb);
            }
            break;
    }

    if (crumbs.length <= 1 || !isLargeScreen) {
        return null;
    }

    const onCrumbPress = (crumb: Crumb) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: crumb.name,
                params: crumb.params,
            }),
        );
    };

    return (
        <HStack space={2} alignItems="center" mb={4}>
            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                return (
                    <HStack key={index} space={2} alignItems="center">
                        <Pressable
                            onPress={() => onCrumbPress(crumb)}
                            disabled={isLast}
                            _pressed={!isLast ? { opacity: 0.6 } : {}}
                        >
                            <Text
                                color={isLast ? primaryColor : darkGreyColor}
                                fontWeight="medium"
                                fontSize="md"
                                letterSpacing="0.3"
                            >
                                {crumb.title}
                            </Text>
                        </Pressable>

                        {!isLast && (
                            <Icon
                                as={Ionicons}
                                name="chevron-forward"
                                size="sm"
                                color={mediumGreyColor}
                            />
                        )}
                    </HStack>
                );
            })}
        </HStack>
    );
}
