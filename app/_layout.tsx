import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" options={{ headerShown: true, title: 'Create Account' }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="blog/[id]"
        options={{
          headerShown: true,
          title: 'Blog Post',
          presentation: 'card'
        }}
      />
    </Stack>
  );
}