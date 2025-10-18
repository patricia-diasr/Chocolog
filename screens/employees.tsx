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
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo, useCallback, useEffect } from "react";

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
import { useCustomToast } from "../contexts/ToastProvider";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";

const employeesMock: Employee[] = [
    {
        id: "1",
        name: "Maria Silva",
        login: "maria.silva",
        role: "ADMIN",
    }
];

const newEmployeeTemplate: Employee = {
    id: "",
    name: "",
    login: "",
    password: "",
    role: "STAFF",
};

type ModalState = "closed" | "add" | "edit" | "delete";

export default function EmployeesScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();
    const toast = useCustomToast();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [modalState, setModalState] = useState<ModalState>("closed");
    const [formData, setFormData] = useState<Employee>(newEmployeeTemplate);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<"all" | "admin">("all");
    const filterOptions: SortOption[] = [
        { value: "all", label: "Todos", icon: "people" },
        { value: "admin", label: "Admin", icon: "key" },
    ];

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description: "Não foi possível buscar os funcionários. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

        const closeModal = useCallback(() => {
        setModalState("closed");
    }, []);

    const openAddModal = () => {
        setFormData(newEmployeeTemplate);
        setModalState("add");
    };

    const openEditModal = (employee: Employee) => {
        setFormData({ ...employee, password: "" }); 
        setModalState("edit");
    };

    const openDeleteAlert = (employee: Employee) => {
        setSelectedEmployee(employee);
        setModalState("delete");
    };

    const handleSave = async (employeeData: Employee) => {
        setIsSavingLoading(true);
        const isEditing = !!employeeData.id;
        const dataToSend = { ...employeeData };

        if (isEditing && !dataToSend.password) {
            delete dataToSend.password;
        }
        
        try {
            if (isEditing) {
                const updated = await updateEmployee(employeeData.id, dataToSend);
                setEmployees(prev => prev.map(emp => (emp.id === updated.id ? updated : emp)));
                toast.showToast({ title: "Sucesso!", description: "Funcionário atualizado.", status: "success" });
            } else {
                const { id, ...newData } = dataToSend; 
                const newEmployee = await createEmployee(newData);
                setEmployees(prev => [...prev, newEmployee]);
                toast.showToast({ title: "Sucesso!", description: "Funcionário criado.", status: "success" });
            }
            closeModal();
        } catch (error) {
            toast.showToast({ title: "Erro!", description: "Não foi possível salvar o funcionário.", status: "error" });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const confirmDelete = useCallback(async () => {
        if (!selectedEmployee) return;
        try {
            await deleteEmployee(selectedEmployee.id);
            setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
            toast.showToast({ title: "Sucesso!", description: "O funcionário foi excluído.", status: "success" });
            closeModal();
        } catch (error) {
            toast.showToast({ title: "Erro!", description: "Não foi possível excluir o funcionário.", status: "error" });
        }
    }, [selectedEmployee, toast, closeModal]);

    const handleDelete = async () => {
        setIsSavingLoading(true);
        if (!selectedEmployee) return;

        try {
            await deleteEmployee(selectedEmployee.id);
            setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
            toast.showToast({ title: "Sucesso!", description: "O funcionário foi excluído.", status: "success" });
            closeModal();
        } catch (error) {
            toast.showToast({ title: "Erro!", description: "Não foi possível excluir o funcionário.", status: "error" });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const employeeStats = useMemo(() => {
        const totalEmployees = employees.length;
        const adminCount = employees.filter(
            (employee) => employee.role === "ADMIN",
        ).length;
        const regularCount = totalEmployees - adminCount;

        const stats: StatItem[] = [
            {
                value: totalEmployees,
                label: "Total",
            },
            {
                value: adminCount,
                label: "Admin",
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
            filtered = filtered.filter((employee) => employee.role === "ADMIN");
        }

        return filtered;
    }, [employees, searchTerm, filterBy]);

    const isEmpty = processedEmployees.length === 0 && searchTerm !== "";
    const isEmptyInitial = employees.length === 0;

    if (isLoading) {
        return (
            <Center flex={1} bg={backgroundColor}>
                <Spinner size="lg" color={secondaryColor} />
                <Text mt={4} color={mediumGreyColor}>Carregando funcionários...</Text>
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

            {!isEmptyInitial && <FabButton action={openAddModal} />}

            <EmployeeFormModal
                isOpen={modalState === "add" || modalState === "edit"}
                onClose={closeModal}
                onSave={handleSave} 
                title={modalState === "add" ? "Adicionar Funcionário" : "Editar Funcionário"}
                employeeData={formData}
                isLoading={isSavingLoading}
            />

            <DeleteAlert
                isOpen={modalState === "delete"}
                onClose={closeModal}
                onConfirm={handleDelete} 
                prefixMessage="Tem certeza que deseja excluir o funcionário"
                itemName={selectedEmployee?.name || ""}
                isLoading={isSavingLoading}
            />
        </>
    );
}
