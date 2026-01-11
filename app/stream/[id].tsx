import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Heart,
  Send,
  Gift,
  Users,
  Star,
  Sparkles,
  Crown,
  Gem,
  Flame,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ChatMessage = {
  id: string;
  username: string;
  message: string;
  isGift?: boolean;
  giftType?: string;
  timestamp: Date;
};

type GiftItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  color: string;
};

const GIFTS: GiftItem[] = [
  { id: '1', name: 'Heart', icon: <Heart size={24} color="#FF69B4" fill="#FF69B4" />, price: 1, color: '#FF69B4' },
  { id: '2', name: 'Star', icon: <Star size={24} color="#FFD700" fill="#FFD700" />, price: 5, color: '#FFD700' },
  { id: '3', name: 'Sparkle', icon: <Sparkles size={24} color="#00BFFF" />, price: 10, color: '#00BFFF' },
  { id: '4', name: 'Crown', icon: <Crown size={24} color="#FFD700" fill="#FFD700" />, price: 50, color: '#FFD700' },
  { id: '5', name: 'Diamond', icon: <Gem size={24} color="#B9F2FF" />, price: 100, color: '#B9F2FF' },
  { id: '6', name: 'Fire', icon: <Flame size={24} color="#FF4500" />, price: 25, color: '#FF4500' },
];

const MOCK_STREAM = {
  id: '1',
  readerName: 'Mystic Luna',
  readerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop',
  title: 'Evening Tarot Messages',
  viewers: 234,
  thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop',
};

const INITIAL_CHAT: ChatMessage[] = [
  { id: '1', username: 'SpiritSeeker', message: 'Hello everyone! 🌙', timestamp: new Date() },
  { id: '2', username: 'MoonChild', message: 'So excited for tonight!', timestamp: new Date() },
  { id: '3', username: 'StarGazer', message: 'Luna your readings are amazing', isGift: true, giftType: 'Star', timestamp: new Date() },
];

export default function StreamViewerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [viewerCount, setViewerCount] = useState(MOCK_STREAM.viewers);
  const [giftAnimations, setGiftAnimations] = useState<{ id: string; gift: GiftItem; animation: Animated.Value }[]>([]);

  useEffect(() => {
    console.log('Viewing stream:', id);
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: inputText.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const sendGift = (gift: GiftItem) => {
    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: `sent a ${gift.name}!`,
      isGift: true,
      giftType: gift.name,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, giftMessage]);
    
    const animValue = new Animated.Value(0);
    const animId = Date.now().toString();
    setGiftAnimations(prev => [...prev, { id: animId, gift, animation: animValue }]);
    
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(animValue, {
        toValue: 2,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setGiftAnimations(prev => prev.filter(a => a.id !== animId));
    });
    
    setShowGifts(false);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.chatMessage, item.isGift && styles.giftMessage]}>
      <Text style={styles.chatUsername}>{item.username}</Text>
      {item.isGift ? (
        <View style={styles.giftMessageContent}>
          <Text style={styles.chatText}>{item.message}</Text>
          {GIFTS.find(g => g.name === item.giftType)?.icon}
        </View>
      ) : (
        <Text style={styles.chatText}>{item.message}</Text>
      )}
    </View>
  );

  const renderGift = ({ item }: { item: GiftItem }) => (
    <TouchableOpacity style={styles.giftItem} onPress={() => sendGift(item)}>
      <View style={[styles.giftIconContainer, { borderColor: item.color }]}>
        {item.icon}
      </View>
      <Text style={styles.giftName}>{item.name}</Text>
      <Text style={styles.giftPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: MOCK_STREAM.thumbnail }}
        style={styles.streamVideo}
        contentFit="cover"
      />
      <View style={styles.streamOverlay} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.streamerInfo}>
          <Image source={{ uri: MOCK_STREAM.readerAvatar }} style={styles.streamerAvatar} />
          <View>
            <Text style={styles.streamerName}>{MOCK_STREAM.readerName}</Text>
            <Text style={styles.streamTitle}>{MOCK_STREAM.title}</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.viewerBadge}>
            <Users size={14} color="white" />
            <Text style={styles.viewerCount}>{viewerCount}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      {giftAnimations.map(({ id: animId, gift, animation }) => (
        <Animated.View
          key={animId}
          style={[
            styles.giftAnimation,
            {
              opacity: animation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [100, 0, -50],
                  }),
                },
                {
                  scale: animation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.2, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.giftAnimationContent, { borderColor: gift.color }]}>
            {gift.icon}
            <Text style={[styles.giftAnimationText, { color: gift.color }]}>{gift.name}!</Text>
          </View>
        </Animated.View>
      ))}

      <View style={styles.chatContainer}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.chatGradient}
        >
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            showsVerticalScrollIndicator={false}
            inverted={false}
          />
        </LinearGradient>
      </View>

      {showGifts && (
        <View style={styles.giftsPanel}>
          <View style={styles.giftsPanelHeader}>
            <Text style={styles.giftsPanelTitle}>Send a Gift</Text>
            <TouchableOpacity onPress={() => setShowGifts(false)}>
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={GIFTS}
            renderItem={renderGift}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.giftsList}
          />
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity 
          style={styles.giftButton}
          onPress={() => setShowGifts(!showGifts)}
        >
          <Gift size={24} color={showGifts ? Colors.dark.tint : 'white'} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Say something..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={inputText}
          onChangeText={setInputText}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  streamVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  streamOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  streamerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 24,
  },
  streamerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  streamerName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  streamTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  viewerCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 100,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0033',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  giftAnimation: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 75,
    top: '40%',
    width: 150,
    alignItems: 'center',
  },
  giftAnimationContent: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  giftAnimationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 250,
  },
  chatGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatMessage: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 12,
    marginBottom: 6,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  giftMessage: {
    backgroundColor: 'rgba(255, 105, 180, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.5)',
  },
  chatUsername: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  chatText: {
    color: 'white',
    fontSize: 14,
  },
  giftMessageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  giftsPanel: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 36, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  giftsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  giftsPanelTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  giftsList: {
    paddingHorizontal: 8,
  },
  giftItem: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  giftIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 6,
  },
  giftName: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
  giftPrice: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  giftButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: 'white',
    marginHorizontal: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
