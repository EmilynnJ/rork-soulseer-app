import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, MessageSquare } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';

// Mocks
const READER_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop';
const CLIENT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop';

type Message = {
  id: string;
  sender: 'user' | 'reader';
  text: string;
  timestamp: Date;
};

export default function ReadingSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [balance, setBalance] = useState(50.00);
  const [duration, setDuration] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);

  // Timers
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isConnected) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
        setBalance((prev) => Math.max(0, prev - (2.99 / 60))); // $2.99/min
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Simulate Connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      Alert.alert('Connected', `You are now connected with Mystic Luna (Session ${id})`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'reader',
        text: 'I sense a strong energy around you...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };

  const endSession = () => {
    setIsConnected(false);
    Alert.alert('Session Ended', 'Thank you for your reading!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Remote Video (Reader) */}
      <View style={styles.remoteVideoContainer}>
        {isConnected && !isVideoOff ? (
          <Image source={{ uri: READER_AVATAR }} style={styles.remoteVideo} contentFit="cover" />
        ) : (
          <View style={styles.placeholderVideo}>
            <Text style={styles.placeholderText}>
              {isConnected ? 'Reader Camera Off' : 'Connecting...'}
            </Text>
          </View>
        )}
        
        {/* Overlay Info */}
        <SafeAreaView style={styles.topOverlay} edges={['top']}>
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.readerName}>Mystic Luna</Text>
              <Text style={styles.rateText}>$2.99/min</Text>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(duration)}</Text>
              <View style={[styles.statusDot, isConnected ? styles.statusOnline : styles.statusOffline]} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Local Video (Self) */}
      <View style={styles.localVideoContainer}>
        <Image source={{ uri: CLIENT_AVATAR }} style={styles.localVideo} contentFit="cover" />
      </View>

      {/* Balance Badge */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
      </View>

      {/* Chat Overlay */}
      {isChatVisible && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
        >
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat</Text>
            <TouchableOpacity onPress={() => setIsChatVisible(false)}>
              <Text style={styles.closeChatText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 10 }}>
            {messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble, 
                  msg.sender === 'user' ? styles.userMessage : styles.readerMessage
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Send size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Controls */}
      <SafeAreaView style={styles.controlsContainer} edges={['bottom']}>
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff color="white" size={24} /> : <Mic color="white" size={24} />}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, isVideoOff && styles.controlButtonActive]} 
            onPress={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff color="white" size={24} /> : <Video color="white" size={24} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, isChatVisible && styles.controlButtonActive]} 
            onPress={() => setIsChatVisible(!isChatVisible)}
          >
            <MessageSquare color="white" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.endCallButton} onPress={endSession}>
            <PhoneOff color="white" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: '#1A1A24',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  placeholderVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 16,
  },
  readerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rateText: {
    color: '#FF69B4',
    fontSize: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOnline: {
    backgroundColor: '#00FF00',
  },
  statusOffline: {
    backgroundColor: 'red',
  },
  localVideoContainer: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    width: 100,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#333',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  balanceContainer: {
    position: 'absolute',
    left: 16,
    bottom: 120,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
  },
  balanceLabel: {
    color: '#CCC',
    fontSize: 10,
  },
  balanceAmount: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingTop: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: Colors.dark.tint,
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeChatText: {
    color: '#CCC',
  },
  messagesList: {
    flex: 1,
  },
  messageBubble: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.dark.tint,
  },
  readerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
