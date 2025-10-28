import { Tabs } from 'expo-router';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      headerTitleStyle: { 
        color: COLORS.textPrimary,
        fontWeight: "600" 
      },
      headerShadowVisible: false,
      tabBarStyle: {
       
        backgroundColor: COLORS.cardBackground,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 5,
        paddingBottom: insets.bottom,
        height: 60 + insets.bottom,

      }, 

     }}>
        
        <Tabs.Screen 
        name="index" options={{
           title: 'Home',
           tabBarIcon: ({color,size}) => <Ionicons name="home-outline" color={color} size={size} /> }} />
        
        <Tabs.Screen
         name="create" options={{ 
          title: 'Create',
         tabBarIcon: ({color,size}) => <Ionicons name="add-circle-outline" color={color} size={size} /> }} />
        
        <Tabs.Screen name="profile" options={{ 
          title: 'Profile', 
          tabBarIcon: ({color,size}) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    </Tabs>
  )
}