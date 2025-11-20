import Stack from "expo-router/stack";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
            <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
        </Stack>
    );
}