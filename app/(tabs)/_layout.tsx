import { Tabs } from 'expo-router';
import React from 'react';

// You can replace these with your IconSymbol component
const TabIcon = ({ name }: { name: string }) => <span>{name}</span>;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="🏠" />,
        }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabIcon name="🔍" />,
        }}
      />
      <Tabs.Screen
        name="PostScreen"
        options={{
          title: 'Post',
          tabBarIcon: ({ color }) => <TabIcon name="➕" />,
        }}
      />
      <Tabs.Screen
        name="BookmarkScreen"
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color }) => <TabIcon name="🔖" />,
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="👤" />,
        }}
      />
    </Tabs>
  );
}