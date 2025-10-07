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
import { useState, useMemo, useCallback } from "react";

import StatsCard from "../components/layout/StatsCard";
import SearchInput from "../components/layout/Searchbar";
import FabButton from "../components/layout/FabButton";
import SortButtons, { SortOption } from "../components/layout/SortButtons";
import EmployeeCard from "../components/employee/EmployeeCard";
import EmployeeFormModal from "../components/employee/EmployeeFormModal";

import { useAppColors } from "../hooks/useAppColors";
import { Employee } from "../types/employee";
import { StatItem } from "../types/stats";
import DeleteAlert from "../components/layout/DeleteAlert";

const employeesMock: Employee[] = [
    {
        id: "1",
        name: "Maria Silva",
        login: "maria.silva",
        role: "admin",
    },
    {
        id: "2",
        name: "João Santos",
        login: "joao.santos",
        role: "staff",
    },
    {
        id: "3",
        name: "Ana Costa",
        login: "ana.costa",
        role: "staff",
    },
    {
        id: "4",
        name: "Pedro Oliveira",
        login: "pedro.oliveira",
        role: "admin",
    },
    {
        id: "5",
        name: "Lucia Ferreira",
        login: "lucia.ferreira",
        role: "staff",
    },
];

const newEmployeeTemplate: Employee = {
    id: "",
    name: "",
    login: "",
    password: "",
    role: "staff",
};

type ModalState = "closed" | "add" | "edit" | "delete";

export default function EmployeesScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();

    const [employees, setEmployees] = useState<Employee[]>(employeesMock);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );
    const [modalState, setModalState] = useState<ModalState>("closed");
    const [formData, setFormData] = useState<Employee>(newEmployeeTemplate);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "admin">("all");

    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "people" },
        { value: "admin", label: "Admin", icon: "key" },
    ];

    const closeModal = useCallback(() => {
        setModalState("closed");
    }, []);

    const openAddModal = useCallback(() => {
        setFormData(newEmployeeTemplate);
        setModalState("add");
    }, []);

    const openEditModal = useCallback((employee: Employee) => {
        setFormData({ ...employee });
        setModalState("edit");
    }, []);

    const openDeleteAlert = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        setModalState("delete");
    }, []);

    const handleSave = useCallback(() => {
        closeModal();
    }, [formData, closeModal]);

    const confirmDelete = useCallback(() => {
        if (!formData.id) return;
        closeModal();
    }, [formData.id, closeModal]);

    const employeeStats = useMemo(() => {
        const totalEmployees = employees.length;
        const adminCount = employees.filter(
            (employee) => employee.role === "admin",
        ).length;
        const regularCount = totalEmployees - adminCount;

        const stats: StatItem[] = [
            {
                value: totalEmployees,
                label: "Total",
            },
            {
                value: adminCount,
                label: "Administradores",
            },
            {
                value: regularCount,
                label: "Comum",
            },
        ];

        return { totalEmployees, adminCount, regularCount, stats };
    }, [employees]);

    const processedEmployees = useMemo(() => {
        let filtered = employees;

        if (searchTerm) {
            filtered = filtered.filter(
                (employee) =>
                    employee.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    employee.login
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        if (filterBy === "admin") {
            filtered = filtered.filter((employee) => employee.role === "admin");
        }

        return filtered;
    }, [employees, searchTerm, filterBy]);

    const isEmpty = processedEmployees.length === 0 && searchTerm !== "";
    const isEmptyInitial = employees.length === 0;

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
                                        title="Resumo dos Funcionários"
                                        icon="people"
                                        stats={employeeStats.stats}
                                    />
                                )}

                                {!isEmptyInitial && (
                                    <VStack space={6} mt={2}>
                                        <SearchInput
                                            value={searchTerm}
                                            onChangeText={setSearchTerm}
                                            placeholder="Buscar nome ou login..."
                                        />
                                        <SortButtons
                                            sortBy={filterBy}
                                            onSortChange={(newFilterBy) =>
                                                setFilterBy(
                                                    newFilterBy as
                                                        | "all"
                                                        | "admin",
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
                                            name="person-circle"
                                            size={20}
                                            color={mediumGreyColor}
                                        />
                                        <VStack alignItems="center" space={2}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="medium"
                                                color={mediumGreyColor}
                                            >
                                                Nenhum funcionário cadastrado
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={mediumGreyColor}
                                                textAlign="center"
                                            >
                                                Adicione funcionário através da
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
                                    {processedEmployees.map(
                                        (employee, index) => (
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
                                                <EmployeeCard
                                                    employee={employee}
                                                    onEdit={openEditModal}
                                                    onDelete={() =>
                                                        openDeleteAlert(
                                                            employee,
                                                        )
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

            <FabButton action={openAddModal} />

            <EmployeeFormModal
                isOpen={modalState === "add" || modalState === "edit"}
                onClose={closeModal}
                onSave={handleSave}
                title={
                    modalState === "add"
                        ? "Adicionar Funcionário"
                        : "Editar Funcionário"
                }
                employeeData={formData}
            />

            <DeleteAlert
                isOpen={modalState === "delete"}
                onClose={closeModal}
                onConfirm={confirmDelete}
                prefixMessage="Tem certeza que deseja excluir o funcionário"
                itemName={selectedEmployee?.name || ""}
            />
        </>
    );
}
