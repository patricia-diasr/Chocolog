import { useMemo, useState } from "react";
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
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import FabButton from "../components/layout/FabButton";
import RecordCard from "../components/stock/RecordCard";
import RecordFormModal from "../components/stock/RecordFormModal";
import { useAppColors } from "../hooks/useAppColors";
import { RecordItem, StockRecord } from "../types/stock";

const records: StockRecord[] = [
    {
        date: "2025-07-27",
        type: "+",
        quantity: 8,
        flavor: "Doce de Leite",
        size: "500g",
    },
    {
        date: "2025-07-27",
        type: "-",
        quantity: 1,
        flavor: "Doce de Leite",
        size: "500g",
    },
    {
        date: "2025-07-27",
        type: "+",
        quantity: 19,
        flavor: "Brigadeiro",
        size: "500g",
    },
    {
        date: "2025-07-28",
        type: "+",
        quantity: 10,
        flavor: "Brigadeiro",
        size: "500g",
    },
    {
        date: "2025-07-28",
        type: "-",
        quantity: 2,
        flavor: "Brigadeiro",
        size: "350g",
    },
    {
        date: "2025-07-28",
        type: "+",
        quantity: 5,
        flavor: "Prestígio",
        size: "500g",
    },
];

const groupRecordsByDate = (records: StockRecord[]) => {
    const grouped = records.reduce((acc, record) => {
        if (!acc[record.date]) {
            acc[record.date] = [];
        }
        acc[record.date].push(record);
        return acc;
    }, {} as Record<string, StockRecord[]>);

    const ordered: Record<string, StockRecord[]> = {};
    Object.keys(grouped)
        .sort((a, b) => new Date(b).getDate() - new Date(a).getDate())
        .forEach((date) => {
            ordered[date] = grouped[date].sort(
                (a, b) =>
                    new Date(b.date).getDate() - new Date(a.date).getDate(),
            );
        });

    return ordered;
};

export default function StockRecordsScreen() {
    const { backgroundColor, whiteColor, mediumGreyColor, secondaryColor } =
        useAppColors();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const groupedRecords = useMemo(() => groupRecordsByDate(records), []);

    const isEmpty = Object.keys(groupedRecords).length === 0;

    const handleSaveChanges = (item: RecordItem) => {};

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
            />
        </>
    );
}
