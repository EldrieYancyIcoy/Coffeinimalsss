import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../hooks/useTheme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
