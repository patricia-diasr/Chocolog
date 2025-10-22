import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Icon,
    ScrollView,
    VStack,
    Box,
    Text,
    HStack,
    Center,
    Pressable,
    Flex,
    Spinner,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import FabButton from "../components/layout/FabButton";
import RecordCard from "../components/stock/RecordCard";
import RecordFormModal from "../components/stock/RecordFormModal";
import { useAppColors } from "../hooks/useAppColors";
import { RecordItem, StockRecord } from "../types/stock";
import { useCustomToast } from "../contexts/ToastProvider";
import { createRecord, getRecords } from "../services/stockService";

const groupRecordsByDate = (
    records: StockRecord[],
): Record<string, StockRecord[]> => {
    const grouped = records.reduce((acc, record) => {
        const dateKey = record.productionDate.split("T")[0];

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(record);
        return acc;
    }, {} as Record<string, StockRecord[]>);

    const ordered: Record<string, StockRecord[]> = {};

    Object.keys(grouped)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .forEach((date) => {
            const sortedRecords = grouped[date].sort(
                (a, b) =>
                    new Date(b.productionDate).getTime() -
                    new Date(a.productionDate).getTime(),
            );
            ordered[date] = sortedRecords;
        });

    return ordered;
};

export default function StockRecordsScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();
    const toast = useCustomToast();

    const [records, setRecords] = useState<StockRecord[]>([]);
    const [groupedRecords, setGroupedRecords] = useState<
        Record<string, StockRecord[]>
    >({});
    const [isEmpty, setIsEmpty] = useState<boolean>(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getRecords();
            setRecords(data);

            const groupedRecordsData = groupRecordsByDate(data);
            setGroupedRecords(groupedRecordsData);
            setIsEmpty(Object.keys(groupedRecordsData).length === 0);
        } catch (error) {
            toast.showToast({
                title: "Erro ao carregar!",
                description:
                    "Não foi possível buscar os registros. Tente novamente.",
                status: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleSaveChanges = async (newRecordData: RecordItem) => {
        setIsSavingLoading(true);

        try {
            const newRecord = await createRecord(newRecordData);
            setRecords((prevRecords) => {
                const updatedRecords = [...prevRecords, newRecord];
                const updatedGroupedRecords =
                    groupRecordsByDate(updatedRecords);

                setGroupedRecords(updatedGroupedRecords);
                setIsEmpty(Object.keys(updatedGroupedRecords).length === 0);

                return updatedRecords;
            });

            toast.showToast({
                title: "Sucesso!",
                description: "Registro criado.",
                status: "success",
            });

            setIsAddModalOpen(false);
        } catch (error) {
            toast.showToast({
                title: "Erro!",
                description: "Não foi possível criar o registro.",
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
                    Carregando registros...
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
                                {isEmpty ? (
                                    <Center py={10}>
                                        <VStack alignItems="center" space={4}>
                                            <Icon
                                                as={Ionicons}
                                                name="document-text"
                                                size={20}
                                                color={mediumGreyColor}
                                            />
                                            <VStack
                                                alignItems="center"
                                                space={2}
                                            >
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="medium"
                                                    color={mediumGreyColor}
                                                >
                                                    Nenhum registro ainda
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color={mediumGreyColor}
                                                    textAlign="center"
                                                >
                                                    Comece adicionando seu
                                                    primeiro registro de estoque
                                                </Text>
                                            </VStack>
                                            <Pressable
                                                onPress={() => {
                                                    setIsAddModalOpen(true);
                                                }}
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
                                                            name="add"
                                                            color={whiteColor}
                                                            size="sm"
                                                        />
                                                        <Text
                                                            color={whiteColor}
                                                            fontWeight="medium"
                                                        >
                                                            Adicionar Registro
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                            </Pressable>
                                        </VStack>
                                    </Center>
                                ) : (
                                    <>
                                        <Flex
                                            direction="row"
                                            wrap="wrap"
                                            justify="flex-start"
                                            mx={-2}
                                            mt={3}
                                        >
                                            {Object.entries(groupedRecords).map(
                                                ([date, records], index) => (
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
                                                        <RecordCard
                                                            key={date}
                                                            date={date}
                                                            records={records}
                                                        />
                                                    </Box>
                                                ),
                                            )}
                                        </Flex>
                                    </>
                                )}
                            </VStack>
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>

            <FabButton action={() => setIsAddModalOpen(true)} icon="add" />

            <RecordFormModal
                title="Adicionar Registro"
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveChanges}
                isLoading={isSavingLoading}
            />
        </>
    );
}
