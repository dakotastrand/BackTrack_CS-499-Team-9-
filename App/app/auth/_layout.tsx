import Stack from "expo-router/stack";
import {SessionProvider} from "context/sessionContext";

export default function AuthLayout() {
    return (
        <SessionProvider>
            <Stack screenOptions={{ headerTitleAlign: "center" }}>
                <Stack.Screen name="login" options={{ title: "Login" }} />
                <Stack.Screen name="register" options={{ title: "Register" }} />
            </Stack>
        </SessionProvider>
    );
}