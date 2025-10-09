import { useState } from "react";
import { Box, VStack, ScrollView, useToast, Center, Flex } from "native-base";
import FlavorCard from "../components/flavor/FlavorCard";
import FlavorFormModal from "../components/flavor/FlavorFormModal";
import DeleteAlert from "../components/layout/DeleteAlert";
import FabButton from "../components/layout/FabButton";
import { useAppColors } from "../hooks/useAppColors";
import type { Flavor, FlavorFormData } from "../types/flavor";

const initialFlavors: Flavor[] = [
    {
        id: 1,
        flavor: "Prestígio",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
    {
        id: 2,
        flavor: "Brigadeiro",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
    {
        id: 3,
        flavor: "Ninho",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
    {
        id: 4,
        flavor: "Sensação",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
    {
        id: 5,
        flavor: "Maracujá",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
    {
        id: 6,
        flavor: "Limão",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
    {
        id: 7,
        flavor: "Doce de Leite",
        prices: [
            { size: "350g", sale_price: 25, cost_price: 20 },
            { size: "500g", sale_price: 35, cost_price: 28 },
            { size: "Coração", sale_price: 40, cost_price: 30 },
            { size: "1Kg", sale_price: 60, cost_price: 45 },
        ],
    },
];

const initialFormData: FlavorFormData = {
    flavor: "",
    prices: [
        { size: "350g", cost_price: 0, sale_price: 0 },
        { size: "500g", cost_price: 0, sale_price: 0 },
        { size: "Coração", cost_price: 0, sale_price: 0 },
        { size: "1Kg", cost_price: 0, sale_price: 0 },
    ],
};

type ModalState = "closed" | "add" | "edit" | "delete";

export default function FlavorListScreen() {
    const [flavors, setFlavors] = useState<Flavor[]>(initialFlavors);
    const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
    const [formData, setFormData] = useState<FlavorFormData>(initialFormData);
    const [modalState, setModalState] = useState<ModalState>("closed");

    const toast = useToast();

    const { backgroundColor } = useAppColors();

    const openAddModal = () => {
        setSelectedFlavor(null);
        setFormData(initialFormData);
        setModalState("add");
    };

    const openEditModal = (flavor: Flavor) => {
        setSelectedFlavor(flavor);
        setFormData({
            flavor: flavor.flavor,
            prices: [...flavor.prices],
        });
        setModalState("edit");
    };

    const openDeleteAlert = (flavor: Flavor) => {
        setSelectedFlavor(flavor);
        setModalState("delete");
    };

    const closeModal = () => {
        setModalState("closed");
    };

    const handleSave = () => {
        closeModal();
    };

    const confirmDelete = () => {
        if (!selectedFlavor) return;
        closeModal();
    };

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
                            <Flex
                                direction="row"
                                wrap="wrap"
                                justify="flex-start"
                                mx={-2}
                                mt={3}
                            >
                                {flavors.map((flavor, index) => (
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
                                        <FlavorCard
                                            flavor={flavor}
                                            onEdit={() => openEditModal(flavor)}
                                            onDelete={() =>
                                                openDeleteAlert(flavor)
                                            }
                                        />
                                    </Box>
                                ))}
                            </Flex>
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton action={openAddModal} />

            <FlavorFormModal
                isOpen={modalState === "add" || modalState === "edit"}
                onClose={closeModal}
                onSave={handleSave}
                title={
                    modalState === "add" ? "Adicionar Sabor" : "Editar Sabor"
                }
                formData={formData}
                setFormData={setFormData}
            />

            <DeleteAlert
                isOpen={modalState === "delete"}
                onClose={closeModal}
                onConfirm={confirmDelete}
                prefixMessage="Tem certeza que deseja excluir o sabor"
                itemName={selectedFlavor?.flavor}
            />
        </>
    );
}
