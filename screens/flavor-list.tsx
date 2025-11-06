import { useCallback, useEffect, useState } from "react";
import {
    Box,
    VStack,
    ScrollView,
    Center,
    Flex,
    Spinner,
    Text,
} from "native-base";
import { useCustomToast } from "../contexts/ToastProvider";
import { useAppColors } from "../hooks/useAppColors";
import {
    createFlavor,
    deleteFlavor,
    getFlavors,
    updateFlavor,
} from "../services/flavorService";
import type { Flavor, FlavorFormData, PriceFormData } from "../types/flavor";
import FabButton from "../components/layout/FabButton";
import FlavorCard from "../components/flavor/FlavorCard";
import FlavorFormModal from "../components/flavor/FlavorFormModal";
import DeleteAlert from "../components/layout/DeleteAlert";

const newFlavorData: FlavorFormData = {
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
    const { backgroundColor, secondaryColor, mediumGreyColor } = useAppColors();
    const toast = useCustomToast();

    const [flavors, setFlavors] = useState<Flavor[]>([]);
    const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FlavorFormData>(newFlavorData);
    const [modalState, setModalState] = useState<ModalState>("closed");

    const closeModal = useCallback(() => {
        setModalState("closed");
    }, []);

    const openAddModal = () => {
        setSelectedFlavor(null);
        setFormData(newFlavorData);
        setModalState("add");
    };

    const openEditModal = (flavor: Flavor) => {
        setSelectedFlavor(flavor);

        const transformedPrices: PriceFormData[] = flavor.sizes.map((size) => ({
            size: size.name,
            salePrice: size.salePrice,
            costPrice: size.costPrice,
        }));

        setFormData({
            flavor: flavor.name,
            prices: transformedPrices,
        });

        setModalState("edit");
    };

    const openDeleteAlert = (flavor: Flavor) => {
        setSelectedFlavor(flavor);
        setModalState("delete");
    };

    const fetchFlavors = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getFlavors();
            setFlavors(data);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os sabores. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchFlavors();
    }, [fetchFlavors]);

    const handleSave = async (flavorData: Flavor) => {
        setIsSavingLoading(true);
        const isEditing = !!flavorData.id;
        const dataToSend = { ...flavorData };

        try {
            if (isEditing) {
                const updated = await updateFlavor(flavorData.id, dataToSend);
                setFlavors((prev) =>
                    prev.map((fl) => (fl.id === updated.id ? updated : fl)),
                );
                toast.showToast({
                    title: "Sucesso!",
                    description: "Sabor atualizado.",
                    status: "success",
                });
            } else {
                const { id, ...newData } = dataToSend;
                const newFlavor = await createFlavor(newData);
                setFlavors((prev) => [...prev, newFlavor]);
                toast.showToast({
                    title: "Sucesso!",
                    description: "Sabor criado.",
                    status: "success",
                });
            }
            closeModal();
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível salvar o sabor.",
                status: "error",
            });
        } finally {
            setIsSavingLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsSavingLoading(true);
        if (!selectedFlavor) return;

        try {
            await deleteFlavor(selectedFlavor.id);
            setFlavors((prev) =>
                prev.filter((fl) => fl.id !== selectedFlavor.id),
            );
            toast.showToast({
                title: "Sucesso!",
                description: "O sabor foi excluído.",
                status: "success",
            });
            closeModal();
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível excluir o sabor.",
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
                    Carregando sabores...
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
                editingFlavor={selectedFlavor}
                isLoading={isSavingLoading}
            />

            <DeleteAlert
                isOpen={modalState === "delete"}
                onClose={closeModal}
                onConfirm={handleDelete}
                prefixMessage="Tem certeza que deseja excluir o sabor"
                itemName={selectedFlavor?.name}
                isLoading={isSavingLoading}
            />
        </>
    );
}
