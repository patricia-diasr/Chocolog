import React from "react";
import { Center, Button } from "native-base";

export const MenuScreen = ({ onLogout }: { onLogout: () => void }) => {
    return (
        <Center flex={1}>
            <Button onPress={onLogout}>
                Sair
            </Button>
        </Center>
    );
};
