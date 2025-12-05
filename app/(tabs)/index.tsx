import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { MOCK_READERS, MOCK_STREAMS, MOCK_PRODUCTS, MOCK_COMMUNITY_HIGHLIGHTS } from '@/mocks/readers';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/Header';
import { Eye, ShoppingBag, Users, Mail, Star, Heart, MessageCircle, ArrowRight } from 'lucide-react-native';

const BACKGROUND_IMAGE =
  'https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp';
const HERO_IMAGE = 'https://i.postimg.cc/tRLSgCPb/HERO-IMAGE-1.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const renderStreamItem = ({ item }: { item: typeof MOCK_STREAMS[0] }) => (
    <TouchableOpacity 
      style={styles.streamItem}
      onPress={() => router.push('/live')}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} contentFit="cover" />
      <View style={styles.liveBadge}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.streamOverlay}>
        <Text style={styles.streamReaderName}>{item.readerName}</Text>
        <Text style={styles.streamTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.viewerContainer}>
          <Eye size={12} color="rgba(255,255,255,0.8)" />
          <Text style={styles.streamViewerCount}>{item.viewers} watching</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderOnlineReaderItem = ({ item }: { item: typeof MOCK_READERS[0] }) => (
    <TouchableOpacity 
      style={styles.onlineReaderCard}
      onPress={() => router.push(`/reading/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.onlineReaderImageContainer}>
        <Image source={{ uri: item.avatar }} style={styles.onlineReaderAvatar} contentFit="cover" />
        <View style={styles.onlineIndicator} />
      </View>
      <Text style={styles.onlineReaderName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.onlineReaderSpecialty} numberOfLines={1}>{item.specialty}</Text>
      <View style={styles.onlineReaderRating}>
        <Star size={10} color="#FFD700" fill="#FFD700" />
        <Text style={styles.onlineReaderRatingText}>{item.rating}</Text>
      </View>
      <Text style={styles.onlineReaderPrice}>${item.pricePerMin}/min</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push('/shop')}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.productRating}>
            <Star size={10} color="#FFD700" fill="#FFD700" />
            <Text style={styles.productRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCommunityItem = ({ item }: { item: typeof MOCK_COMMUNITY_HIGHLIGHTS[0] }) => (
    <TouchableOpacity 
      style={styles.communityCard}
      onPress={() => router.push('/community')}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.communityImage} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.communityOverlay}
      >
        <Text style={styles.communityTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.communityAuthor}>By {item.author}</Text>
        <View style={styles.communityStats}>
          <View style={styles.communityStat}>
            <Heart size={12} color="white" />
            <Text style={styles.communityStatText}>{item.likes}</Text>
          </View>
          <View style={styles.communityStat}>
            <MessageCircle size={12} color="white" />
            <Text style={styles.communityStatText}>{item.comments}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <LinearGradient
        colors={['rgba(255, 105, 180, 0.2)', 'rgba(255, 105, 180, 0.05)']}
        style={styles.quickActionIconContainer}
      >
        {icon}
      </LinearGradient>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: BACKGROUND_IMAGE }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.overlay} />
      
      {/* Transparent Header */}
      <Header transparent={true} />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} contentFit="cover" />
          <Text style={styles.tagline}>A Community of Gifted Psychics</Text>
        </View>

        {/* Quick Access Buttons */}
        <View style={styles.quickActionsContainer}>
          <QuickActionButton 
            icon={<Eye color={Colors.dark.tint} size={24} />} 
            label="Readers" 
            onPress={() => router.push('/readings')} 
          />
          <QuickActionButton 
            icon={<ShoppingBag color={Colors.dark.tint} size={24} />} 
            label="Shop" 
            onPress={() => router.push('/shop')} 
          />
          <QuickActionButton 
            icon={<Users color={Colors.dark.tint} size={24} />} 
            label="Community" 
            onPress={() => router.push('/community')} 
          />
          <QuickActionButton 
            icon={<Mail color={Colors.dark.tint} size={24} />} 
            label="Contact" 
            onPress={() => router.push('/help')} 
          />
        </View>

        {/* Online Readers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Online Readers</Text>
            <TouchableOpacity onPress={() => router.push('/readings')} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={14} color={Colors.dark.tint} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_READERS.filter(r => r.isOnline)}
            renderItem={renderOnlineReaderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Live Streams */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Live Streams</Text>
            <TouchableOpacity onPress={() => router.push('/live')} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={14} color={Colors.dark.tint} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_STREAMS}
            renderItem={renderStreamItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => router.push('/shop')} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Shop All</Text>
              <ArrowRight size={14} color={Colors.dark.tint} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_PRODUCTS}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Community Highlights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Highlights</Text>
            <TouchableOpacity onPress={() => router.push('/community')} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Join Discussion</Text>
              <ArrowRight size={14} color={Colors.dark.tint} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={MOCK_COMMUNITY_HIGHLIGHTS}
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Newsletter Signup */}
        <View style={styles.newsletterSection}>
          <LinearGradient
            colors={[Colors.dark.card, 'rgba(255, 105, 180, 0.1)']}
            style={styles.newsletterContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.newsletterTitle}>Join Our Soul Tribe</Text>
            <Text style={styles.newsletterDescription}>
              Sign up for our newsletter to receive daily horoscopes, special offers, and spiritual guidance.
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.subscribeButton}>
                <Text style={styles.subscribeButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom padding for tabs */}
        <View style={{ height: 40 }} />
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
    marginBottom: 32,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tagline: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickActionButton: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  quickActionLabel: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 28,
    color: Colors.dark.tint,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: Colors.dark.tint,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  // Online Reader Card
  onlineReaderCard: {
    width: 140,
    backgroundColor: 'rgba(26, 26, 36, 0.8)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  onlineReaderImageContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  onlineReaderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: Colors.dark.card,
  },
  onlineReaderName: {
    color: 'white',
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
  onlineReaderSpecialty: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  onlineReaderRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  onlineReaderRatingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  onlineReaderPrice: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Stream Item
  streamItem: {
    width: 200,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    paddingHorizontal: 6,
    paddingVertical: 2,
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
  streamReaderName: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  streamTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  viewerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streamViewerCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  // Product Card
  productCard: {
    width: 150,
    backgroundColor: 'rgba(26, 26, 36, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    color: 'white',
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 14,
    marginBottom: 6,
    height: 40,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 14,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  productRatingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  // Community Card
  communityCard: {
    width: 240,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  communityImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  communityOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'flex-end',
  },
  communityTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 4,
  },
  communityAuthor: {
    color: Colors.dark.tint,
    fontSize: 12,
    marginBottom: 8,
  },
  communityStats: {
    flexDirection: 'row',
    gap: 12,
  },
  communityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  communityStatText: {
    color: 'white',
    fontSize: 12,
  },
  // Newsletter
  newsletterSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  newsletterContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  newsletterTitle: {
    color: 'white',
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  newsletterDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlayfairDisplay_400Regular',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subscribeButton: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
