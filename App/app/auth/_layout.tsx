import Stack from "expo-router/stack";
import {SessionProvider} from "context/sessionContext";

export default function AuthLayout() {
    return (
        <SessionProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
                <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
            </Stack>
        </SessionProvider>
    );
}