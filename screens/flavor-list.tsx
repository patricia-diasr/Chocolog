import { useState } from "react";
import {
    Box,
    VStack,
    ScrollView,
    useToast,
    Center,
    Flex,
} from "native-base";
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
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
    {
        id: 2,
        flavor: "Brigadeiro",
        prices: [
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
    {
        id: 3,
        flavor: "Ninho",
        prices: [
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
    {
        id: 4,
        flavor: "Sensação",
        prices: [
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
    {
        id: 5,
        flavor: "Maracujá",
        prices: [
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
    {
        id: 6,
        flavor: "Limão",
        prices: [
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
    {
        id: 7,
        flavor: "Doce de Leite",
        prices: [
            { size: "350g", salePrice: 25, costPrice: 20 },
            { size: "500g", salePrice: 35, costPrice: 28 },
            { size: "Coração", salePrice: 40, costPrice: 30 },
            { size: "1Kg", salePrice: 60, costPrice: 45 },
        ],
    },
];

const initialFormData: FlavorFormData = {
    flavor: "",
    prices: [
        { size: "350g", costPrice: 0, salePrice: 0 },
        { size: "500g", costPrice: 0, salePrice: 0 },
        { size: "Coração", costPrice: 0, salePrice: 0 },
        { size: "1Kg", costPrice: 0, salePrice: 0 },
    ],
};

type ModalState = "closed" | "add" | "edit" | "delete";

export default function FlavorListScreen() {
    const [flavors, setFlavors] = useState<Flavor[]>(initialFlavors);
    const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
    const [formData, setFormData] = useState<FlavorFormData>(initialFormData);
    const [modalState, setModalState] = useState<ModalState>("closed");

    const toast = useToast();

    const { backgroundColor } =
        useAppColors();

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
        setFlavors((prev) => prev.filter((f) => f.id !== selectedFlavor.id));
        toast.show({
            title: "Sucesso",
            description: "Sabor excluído.",
            status: "success",
        });
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
