import React, { ReactNode } from "react";
import { Box, Flex } from "native-base";

interface Props {
    children: [ReactNode, ReactNode]; 
}

export default function ResponsiveChartRowProps({ children }: Props) {
    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent={{ base: "flex-start", md: "space-between" }}
            alignItems="stretch"
            p={{ md: 2 }} 
        >
            <Box
                flex={{ base: 1, md: 1 }}
                mr={{ md: 4 }}
                mb={{ base: 4, md: 0 }}
            >
                {children[0]}
            </Box>
            <Box flex={{ base: 1, md: 1 }}>{children[1]}</Box>
        </Flex>
    );
}
