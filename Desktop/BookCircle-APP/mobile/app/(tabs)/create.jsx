// import { 
//   View,
//   Text, 
//   KeyboardAvoidingView, 
//   Platform,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator
// } from 'react-native'
// import { useState } from 'react';
// import styles from '../../assets/styles/create.styles';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import COLORS from '../../constants/colors';
// import { useAuthStore } from '../../store/authStore';
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import { API_URL } from '../../constants/api';

// export default function Create() {
//   const [title, setTitle] = useState("");
//   const [caption, setCaption] = useState("");
//   const [rating, setRating] = useState(3);
//   const [image, setImage] = useState(null);
//   const [imageBase64, setImageBase64] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();
//   const { token } = useAuthStore();

//   const pickImage = async () => {
//     try {
//       if (Platform.OS !== "web") {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//         if (status !== "granted") {
//           Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
//           return;
//         }
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: "images",
//         allowsEditing: true,
//         aspect: [3, 4],
//         quality: 0.5,
//         base64: true,
//       });

//       if (!result.canceled) {
//         setImage(result.assets[0].uri);

//         if (result.assets[0].base64) {
//           setImageBase64(result.assets[0].base64);
//         } else {
//           const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
//             encoding: FileSystem.EncodingType.Base64,
//           });
//           setImageBase64(base64);
//         }
//       }
//     } catch (error) {
//       console.error("Error picking image:", error);
//       Alert.alert("Error", "There was a problem selecting your image");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !caption || !imageBase64 || !rating) {
//       Alert.alert("Missing Fields", "Please fill in all fields and select an image.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const uriParts = image.split(".");
//       const fileType = uriParts[uriParts.length - 1];
//       const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
//       const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

//       const response = await fetch(`${API_URL}/books`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title,
//           caption,  
//           rating: rating.toString(),
//           image: imageDataUrl,
//         }),
//       });

//       // Check if response is JSON before parsing
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Server returned HTML:', text.substring(0, 200));
//         throw new Error('Server error - check API URL');
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Something went wrong");
//       }

//       Alert.alert("Success", "Your book recommendation has been posted.");
//       setTitle("");
//       setCaption("");
//       setRating(3);
//       setImage(null);
//       setImageBase64(null);
//       router.push("/");

//     } catch (error) {
//       console.error("Error submitting book:", error);
//       Alert.alert("Error", error.message || "There was a problem submitting your recommendation.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const renderRatingPicker = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
//           <Ionicons
//             name={i <= rating ? "star" : "star-outline"}
//             size={32}
//             color={i <= rating ? "#f4b400" : COLORS.textSecondary}
//           />
//         </TouchableOpacity>
//       );
//     }
//     return <View style={styles.ratingContainer}>{stars}</View>;
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
//         <View style={styles.card}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Add Book Recommendation</Text>
//             <Text style={styles.subtitle}>Share your favorite reads with others</Text>
//           </View>

//           <View style={styles.form}>
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Book Title</Text>
//               <View style={styles.inputContainer}>
//                 <Ionicons
//                   name="book-outline"
//                   size={20}
//                   color={COLORS.textSecondary}
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter book title"
//                   placeholderTextColor={COLORS.placeholderText}
//                   value={title}
//                   onChangeText={setTitle}
//                 />
//               </View>
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Your Rating</Text>
//               {renderRatingPicker()}
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Book Image</Text>
//               <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
//                 {image ? (
//                   <Image source={{ uri: image }} style={styles.previewImage} />
//                 ) : (
//                   <View style={styles.placeholderContainer}>
//                     <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
//                     <Text style={styles.placeholderText}>Tap to select image</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Caption</Text>
//               <TextInput
//                 style={styles.textArea}
//                 placeholder="Write your review or thoughts about this book..."
//                 placeholderTextColor={COLORS.placeholderText}
//                 value={caption}
//                 onChangeText={setCaption}
//                 multiline
//                 textAlignVertical="top"
//               />
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
//               {loading ? (
//                 <ActivityIndicator color={COLORS.white} />
//               ) : (
//                 <>
//                   <Ionicons
//                     name="cloud-upload-outline"
//                     size={20}
//                     color={COLORS.white}
//                     style={styles.buttonIcon}
//                   />
//                   <Text style={styles.buttonText}>Share</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   )
// }

import { 
  View,
  Text, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native'
import { useState } from 'react';
import styles from '../../assets/styles/create.styles';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from '../../constants/api';

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.1, // Reduced quality to fix 413 error
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Missing Fields", "Please fill in all fields and select an image.");
      return;
    }

    try {
      setLoading(true);

      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,  
          rating: rating.toString(),
          image: imageDataUrl,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Server returned:', text.substring(0, 200));
        throw new Error('Server error - check backend CORS configuration');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Alert.alert("Success", "Your book recommendation has been posted.");
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);
      router.push("/");

    } catch (error) {
      console.error("Error submitting book:", error);
      Alert.alert("Error", error.message || "There was a problem submitting your recommendation.");
    } finally {
      setLoading(false);
    }
  }

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>Share your favorite reads with others</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your review or thoughts about this book..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}