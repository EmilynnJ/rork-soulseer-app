import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  Heart,
  MessageCircle,
  Phone,
  Video,
  Clock,
  Shield,
  Award,
  Calendar,
} from 'lucide-react-native';

const BACKGROUND_IMAGE = 'https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp';

const MOCK_READER = {
  id: '1',
  name: 'Mystic Luna',
  specialty: 'Tarot & Clairvoyance',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop',
  rating: 4.9,
  reviews: 1247,
  pricePerMinChat: 2.99,
  pricePerMinCall: 3.99,
  pricePerMinVideo: 4.99,
  isOnline: true,
  description: 'I am a third-generation psychic with over 15 years of experience in tarot reading, clairvoyance, and spiritual guidance. My gift allows me to connect with energies and provide clarity on love, career, and life path questions.',
  bio: 'Born into a family of psychics, I discovered my gift at age 7 when I had my first vision. Since then, I have dedicated my life to helping others find their path and connect with their spiritual selves.',
  specialties: ['Love & Relationships', 'Career Guidance', 'Past Lives', 'Spirit Communication'],
  languages: ['English', 'Spanish'],
  totalReadings: 5432,
  yearsExperience: 15,
  responseTime: '< 1 min',
};

const MOCK_REVIEWS = [
  { id: '1', author: 'Sarah M.', rating: 5, text: 'Absolutely amazing reading! Luna connected with my energy immediately and provided incredible insights.', date: '2 days ago' },
  { id: '2', author: 'Michael R.', rating: 5, text: 'Luna helped me see my situation from a new perspective. Highly recommend!', date: '1 week ago' },
  { id: '3', author: 'Jennifer L.', rating: 4, text: 'Great reading, very intuitive and compassionate. Will definitely book again.', date: '2 weeks ago' },
];

export default function ReaderProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading] = useState(false);

  const reader = MOCK_READER;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  const startReading = (type: 'chat' | 'call' | 'video') => {
    console.log(`Starting ${type} reading with reader ${id}`);
    router.push(`/reading/${id}`);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: BACKGROUND_IMAGE }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.overlay} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            size={24} 
            color={isFavorite ? '#FF69B4' : 'white'} 
            fill={isFavorite ? '#FF69B4' : 'transparent'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: reader.avatar }} style={styles.avatar} contentFit="cover" />
            {reader.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <Text style={styles.name}>{reader.name}</Text>
          <Text style={styles.specialty}>{reader.specialty}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={18} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{reader.rating}</Text>
            <Text style={styles.reviewCount}>({reader.reviews} reviews)</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={20} color={Colors.dark.tint} />
            <Text style={styles.statValue}>{reader.totalReadings}</Text>
            <Text style={styles.statLabel}>Readings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Award size={20} color={Colors.dark.tint} />
            <Text style={styles.statValue}>{reader.yearsExperience}+</Text>
            <Text style={styles.statLabel}>Years Exp</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Shield size={20} color={Colors.dark.tint} />
            <Text style={styles.statValue}>{reader.responseTime}</Text>
            <Text style={styles.statLabel}>Response</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{reader.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsContainer}>
            {reader.specialties.map((spec, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Types</Text>
          
          <TouchableOpacity 
            style={styles.sessionCard}
            onPress={() => startReading('chat')}
          >
            <View style={styles.sessionIcon}>
              <MessageCircle size={24} color={Colors.dark.tint} />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionType}>Live Chat</Text>
              <Text style={styles.sessionDesc}>Text-based reading</Text>
            </View>
            <View style={styles.sessionPrice}>
              <Text style={styles.priceValue}>${reader.pricePerMinChat}</Text>
              <Text style={styles.priceUnit}>/min</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sessionCard}
            onPress={() => startReading('call')}
          >
            <View style={styles.sessionIcon}>
              <Phone size={24} color={Colors.dark.tint} />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionType}>Voice Call</Text>
              <Text style={styles.sessionDesc}>Audio-only reading</Text>
            </View>
            <View style={styles.sessionPrice}>
              <Text style={styles.priceValue}>${reader.pricePerMinCall}</Text>
              <Text style={styles.priceUnit}>/min</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sessionCard}
            onPress={() => startReading('video')}
          >
            <View style={styles.sessionIcon}>
              <Video size={24} color={Colors.dark.tint} />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionType}>Video Call</Text>
              <Text style={styles.sessionDesc}>Face-to-face reading</Text>
            </View>
            <View style={styles.sessionPrice}>
              <Text style={styles.priceValue}>${reader.pricePerMinVideo}</Text>
              <Text style={styles.priceUnit}>/min</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {MOCK_REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      color="#FFD700" 
                      fill={i < review.rating ? "#FFD700" : "transparent"} 
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <LinearGradient
        colors={['transparent', 'rgba(13, 13, 21, 0.95)', Colors.dark.background]}
        style={[styles.bottomGradient, { paddingBottom: insets.bottom + 16 }]}
      >
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.scheduleButton}>
            <Calendar size={20} color={Colors.dark.tint} />
            <Text style={styles.scheduleText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => startReading('chat')}
          >
            <LinearGradient
              colors={[Colors.dark.tint, '#D84A8C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startGradient}
            >
              <Text style={styles.startText}>Start Reading</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 21, 0.85)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.dark.tint,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FF00',
    borderWidth: 3,
    borderColor: Colors.dark.background,
  },
  name: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  specialty: {
    color: Colors.dark.tint,
    fontSize: 16,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  reviewCount: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 28,
    color: Colors.dark.tint,
    marginBottom: 12,
  },
  seeAllText: {
    color: Colors.dark.tint,
    fontSize: 14,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  tagText: {
    color: Colors.dark.tint,
    fontSize: 13,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 14,
  },
  sessionType: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  sessionPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    color: Colors.dark.tint,
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceUnit: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  reviewCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    gap: 8,
  },
  scheduleText: {
    color: Colors.dark.tint,
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
