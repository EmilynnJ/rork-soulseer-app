import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { MOCK_READERS, MOCK_STREAMS } from '@/mocks/readers';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/Header';

const { width } = Dimensions.get('window');

const BACKGROUND_IMAGE =
  'https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp';
const HERO_IMAGE = 'https://i.postimg.cc/tRLSgCPb/HERO-IMAGE-1.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderStreamItem = ({ item }: { item: typeof MOCK_STREAMS[0] }) => (
    <View style={styles.streamItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} />
      <View style={styles.liveBadge}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.streamOverlay}>
        <Text style={styles.streamTitle}>{item.title}</Text>
        <Text style={styles.streamViewerCount}>{item.viewers} watching</Text>
      </LinearGradient>
    </View>
  );

  const renderReaderItem = ({ item }: { item: typeof MOCK_READERS[0] }) => (
    <View style={styles.readerCard}>
      <View style={styles.readerRow}>
        <Image source={{ uri: item.avatar }} style={styles.readerAvatar} />
        <View style={styles.readerInfo}>
          <Text style={styles.readerName}>{item.name}</Text>
          <Text style={styles.readerSpecialty}>{item.specialty}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>
        <View style={styles.readerAction}>
          <Text style={styles.priceText}>${item.pricePerMin}/min</Text>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => router.push(`/reading/${item.id}`)}
          >
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.isOnline && (
        <View style={styles.onlineIndicator} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: BACKGROUND_IMAGE }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.overlay} />
      
      {/* Transparent Header */}
      <Header transparent={true} />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} contentFit="cover" />
          <Text style={styles.tagline}>A Community of Gifted Psychics</Text>
        </View>

        {/* Live Streams */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Now</Text>
            <TouchableOpacity onPress={() => router.push('/live')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_STREAMS}
            renderItem={renderStreamItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.streamsList}
          />
        </View>

        {/* Online Readers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Readers</Text>
            <TouchableOpacity onPress={() => router.push('/readings')}>
              <Text style={styles.seeAllText}>Filter</Text>
            </TouchableOpacity>
          </View>
          {MOCK_READERS.map((reader) => (
            <View key={reader.id} style={{ marginBottom: 12 }}>
              {renderReaderItem({ item: reader })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 21, 0.85)', // Darken background image
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  heroImage: {
    width: width - 32,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagline: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  seeAllText: {
    color: Colors.dark.tint,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  streamsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  streamItem: {
    width: 160,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
  },
  streamThumbnail: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF0033',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  streamOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 40,
  },
  streamTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streamViewerCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  readerCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  readerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  readerInfo: {
    flex: 1,
  },
  readerName: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 2,
  },
  readerSpecialty: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    color: '#FFD700',
    marginRight: 4,
    fontSize: 12,
  },
  ratingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  readerAction: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chatButton: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
  chatButtonText: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: Colors.dark.card,
    zIndex: 1,
  },
});
