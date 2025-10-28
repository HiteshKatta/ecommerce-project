import { Text, TouchableOpacity, View } from 'react-native'
import { useAuthStore } from '../../store/authStore'
export default function Home() {
  const {logout} = useAuthStore();

  return (
    <View>
    
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}