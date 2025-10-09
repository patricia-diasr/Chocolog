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
import { useState, useMemo } from "react";

import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import FabButton from "../components/layout/FabButton";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import CustomerCard from "../components/customer/CustomerCard";
import CustomerFormModal from "../components/customer/CustomerFormModal";

import { useAppColors } from "../hooks/useAppColors";
import { Customer } from "../types/customer";
import { StatItem } from "../types/stats";

const customersMock: Customer[] = [
    {
        id: "1",
        name: "Maria Silva",
        phone: "11999999999",
        is_reseller: true,
    },
    {
        id: "2",
        name: "João Santos",
        phone: "11888888888",
        is_reseller: false,
    },
    {
        id: "3",
        name: "Ana Costa",
        phone: "11777777777",
        is_reseller: false,
    },
    {
        id: "4",
        name: "Pedro Oliveira",
        phone: "11666666666",
        is_reseller: false,
    },
    {
        id: "5",
        name: "Lucia Ferreira",
        phone: "11555555555",
        is_reseller: true,
    },
];

const newCustomerTemplate: Customer = {
    id: "",
    name: "",
    phone: "",
    notes: "",
    is_reseller: false,
};

export default function CustomersScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();

    const [customers, setCustomers] = useState<Customer[]>(customersMock);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "reseller">("all");

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "people" },
        { value: "reseller", label: "Revendedor", icon: "business" },
    ];

    const handleOpenAddModal = () => {
        setIsModalOpen(true);
    };

    const handleSaveNewCustomer = (newCustomer: Customer) => {
        setIsModalOpen(false);
    };

    const customerStats = useMemo(() => {
        const totalCustomers = customers.length;
        const resellerCount = customers.filter(
            (customer) => customer.is_reseller,
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
            filtered = filtered.filter((customer) => customer.is_reseller);
        }

        return filtered;
    }, [customers, searchTerm, filterBy]);

    const isEmpty = processedCustomers.length === 0 && searchTerm !== "";
    const isEmptyInitial = customers.length === 0;

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
                                            name="pe"
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
                                                    is_reseller={
                                                        customer.is_reseller
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
            />
        </>
    );
}
