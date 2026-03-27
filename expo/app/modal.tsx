import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/colors";
import { BlurView } from "expo-blur";

export default function ModalScreen() {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => router.back()}
    >
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Welcome to SoulSeer</Text>
          <Text style={styles.description}>
            Connect with gifted psychics, explore mystical products, and join our spiritual community.
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>

      <StatusBar style="light" />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    alignItems: "center",
    minWidth: 300,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 16,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  closeButton: {
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
