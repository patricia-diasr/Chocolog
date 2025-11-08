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
import { useState, useMemo, useCallback } from "react";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import { createCustomer, getCustomers } from "../services/customerService";
import { Customer } from "../types/customer";
import { StatItem } from "../types/stats";
import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import FabButton from "../components/layout/FabButton";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import CustomerCard from "../components/customer/CustomerCard";
import CustomerFormModal from "../components/customer/CustomerFormModal";

const newCustomerTemplate: Customer = {
    id: 0,
    name: "",
    phone: "",
    notes: "",
    isReseller: false,
};

export default function CustomersScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();
    const toast = useCustomToast();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "reseller">("all");

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "people" },
        { value: "reseller", label: "Revendedor", icon: "business" },
    ];

    const customerStats = useMemo(() => {
        const totalCustomers = customers.length;
        const resellerCount = customers.filter(
            (customer) => customer.isReseller,
        ).length;
        const regularCount = totalCustomers - resellerCount;

        const stats: StatItem[] = [
            {
                value: totalCustomers,
                label: "Total",
            },
            {
                value: resellerCount,
                label: "Revendedor",
            },
            {
                value: regularCount,
                label: "Comum",
            },
        ];

        return { totalCustomers, resellerCount, regularCount, stats };
    }, [customers]);

    const processedCustomers = useMemo(() => {
        let filtered = customers;

        if (searchTerm) {
            filtered = filtered.filter(
                (customer) =>
                    customer.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    customer.phone.includes(searchTerm),
            );
        }

        if (filterBy === "reseller") {
            filtered = filtered.filter((customer) => customer.isReseller);
        }

        return filtered;
    }, [customers, searchTerm, filterBy]);

    const isEmpty = processedCustomers.length === 0 && searchTerm !== "";
    const isEmptyInitial = customers.length === 0;

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os clientes. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useFocusEffect(
        useCallback(() => {
            fetchCustomers();
        }, [fetchCustomers]),
    );

    const handleOpenAddModal = () => {
        setIsModalOpen(true);
    };

    const handleSaveNewCustomer = async (newCustomer: Customer) => {
        setIsSavingLoading(true);

        try {
            const { id, ...newData } = newCustomer;
            const newEmployee = await createCustomer(newData);
            setCustomers((prev) => [...prev, newEmployee]);

            toast.showToast({
                title: "Sucesso!",
                description: "Cliente criado.",
                status: "success",
            });

            setIsModalOpen(false);
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível criar o cliente.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>
                    Carregando clientes...
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
                        <VStack space={4}>
                            <VStack space={4}>
                                {!isEmptyInitial && (
                                    <StatsCard
                                        title="Resumo dos Clientes"
                                        icon="people"
                                        stats={customerStats.stats}
                                    />
                                )}

                                {!isEmptyInitial && (
                                    <VStack space={6} mt={2}>
                                        <SearchInput
                                            value={searchTerm}
                                            onChangeText={setSearchTerm}
                                            placeholder="Buscar cliente ou telefone..."
                                        />
                                        <SortButtons
                                            sortBy={filterBy}
                                            onSortChange={(newFilterBy) =>
                                                setFilterBy(
                                                    newFilterBy as
                                                        | "all"
                                                        | "reseller",
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
                                            name="people"
                                            size={20}
                                            color={mediumGreyColor}
                                        />
                                        <VStack alignItems="center" space={2}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="medium"
                                                color={mediumGreyColor}
                                            >
                                                Nenhum cliente cadastrado
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={mediumGreyColor}
                                                textAlign="center"
                                            >
                                                Adicione clientes através da
                                                tela de cadastro
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
                                <Flex
                                    direction="row"
                                    wrap="wrap"
                                    justify="flex-start"
                                    mx={-2}
                                    mt={3}
                                >
                                    {processedCustomers.map(
                                        (customer, index) => (
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
                                                <CustomerCard
                                                    id={customer.id}
                                                    name={customer.name}
                                                    phone={customer.phone}
                                                    isReseller={
                                                        customer.isReseller
                                                    }
                                                />
                                            </Box>
                                        ),
                                    )}
                                </Flex>
                            )}
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton action={handleOpenAddModal} />

            <CustomerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNewCustomer}
                customerData={newCustomerTemplate}
                title="Adicionar Cliente"
                isLoading={isSavingLoading}
            />
        </>
    );
}
