import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import '../src/i18n';

// Custom theme with dark colors
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f0f0f',
    card: '#1a1a1a',
    text: '#ffffff',
    border: 'rgba(255, 255, 255, 0.1)',
    notification: '#ff3366',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <StatusBar style="light" backgroundColor="#0f0f0f" />
      <ThemeProvider value={isDark ? CustomDarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0f0f0f',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              color: '#fff',
            },
            contentStyle: { 
              backgroundColor: '#0f0f0f',
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="wizard" options={{ headerShown: false }} />
          <Stack.Screen name="preview" options={{ headerShown: false }} />
          <Stack.Screen name="export" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </View>
  );
}
