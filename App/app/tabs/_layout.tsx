import { FriendsProvider } from '@/context/friendContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <FriendsProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'green', // active icon color
          tabBarInactiveTintColor: 'black', // inactive icon color
          tabBarStyle: styles.tabBar, // custom tab bar style
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: 'Friends',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
          }}
        />
        <Tabs.Screen
          name="timer"
          options={{
            title: 'Timer',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="clock-o" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
      </Tabs>
    </FriendsProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(230, 230, 230, 0.5)', // light gray with 50% transparency
    borderTopWidth: 0,
    elevation: 0, // remove shadow on Android
    position: 'absolute', // float over content
    height: 70, // optional: slightly taller tab bar
  },
});