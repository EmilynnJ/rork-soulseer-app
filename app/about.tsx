import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Shield, Users, Sparkles } from 'lucide-react-native';

const FOUNDER_IMAGE = 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg';
const BACKGROUND_IMAGE = 'https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: BACKGROUND_IMAGE }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.overlay} />
      
      <Header title="About Us" showShop={false} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>About SoulSeer</Text>
        
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            At SoulSeer, we are dedicated to providing ethical, compassionate, and judgment-free spiritual guidance. Our mission is twofold: to offer clients genuine, heart-centered readings and to uphold fair, ethical standards for our readers.
          </Text>
        </View>

        <View style={styles.valuesContainer}>
          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Heart size={24} color={Colors.dark.tint} />
            </View>
            <Text style={styles.valueTitle}>Compassionate</Text>
            <Text style={styles.valueDesc}>Heart-centered guidance</Text>
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Shield size={24} color={Colors.dark.tint} />
            </View>
            <Text style={styles.valueTitle}>Ethical</Text>
            <Text style={styles.valueDesc}>Fair standards for all</Text>
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Users size={24} color={Colors.dark.tint} />
            </View>
            <Text style={styles.valueTitle}>Community</Text>
            <Text style={styles.valueDesc}>A true soul tribe</Text>
          </View>
        </View>

        <View style={styles.founderSection}>
          <Text style={styles.sectionTitle}>Meet Our Founder</Text>
          
          <LinearGradient
            colors={['rgba(255, 105, 180, 0.15)', 'rgba(26, 26, 36, 0.9)']}
            style={styles.founderCard}
          >
            <Image source={{ uri: FOUNDER_IMAGE }} style={styles.founderImage} contentFit="cover" />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Emilynn</Text>
              <Text style={styles.founderTitle}>Psychic Medium & Founder</Text>
            </View>
          </LinearGradient>
          
          <Text style={styles.founderBio}>
            Founded by psychic medium Emilynn, SoulSeer was created as a response to the corporate greed that dominates many psychic platforms. Unlike other apps, our readers keep the majority of what they earn and play an active role in shaping the platform.
          </Text>
        </View>

        <View style={styles.missionSection}>
          <View style={styles.missionHeader}>
            <Sparkles size={28} color={Colors.dark.tint} />
            <Text style={styles.missionTitle}>Our Mission</Text>
          </View>
          
          <Text style={styles.missionText}>
            SoulSeer is more than just an app—it&apos;s a soul tribe. A community of gifted psychics united by our life&apos;s calling: to guide, heal, and empower those who seek clarity on their journey.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>70%</Text>
            <Text style={styles.statLabel}>Reader Earnings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Availability</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Encrypted</Text>
          </View>
        </View>

        <View style={styles.commitmentCard}>
          <Text style={styles.commitmentTitle}>Our Commitment</Text>
          <View style={styles.commitmentItem}>
            <View style={styles.bullet} />
            <Text style={styles.commitmentText}>Ethical, judgment-free readings</Text>
          </View>
          <View style={styles.commitmentItem}>
            <View style={styles.bullet} />
            <Text style={styles.commitmentText}>Fair compensation for readers</Text>
          </View>
          <View style={styles.commitmentItem}>
            <View style={styles.bullet} />
            <Text style={styles.commitmentText}>End-to-end encrypted sessions</Text>
          </View>
          <View style={styles.commitmentItem}>
            <View style={styles.bullet} />
            <Text style={styles.commitmentText}>Community-driven development</Text>
          </View>
        </View>

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
    backgroundColor: 'rgba(13, 13, 21, 0.88)',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 42,
    color: Colors.dark.tint,
    textAlign: 'center',
    marginBottom: 24,
  },
  introCard: {
    backgroundColor: 'rgba(255, 105, 180, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
    marginBottom: 32,
  },
  introText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
    textAlign: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  valueItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  valueIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  valueTitle: {
    color: Colors.dark.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    marginBottom: 4,
  },
  valueDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textAlign: 'center',
  },
  founderSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'AlexBrush_400Regular',
    fontSize: 32,
    color: Colors.dark.tint,
    marginBottom: 20,
  },
  founderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
  },
  founderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.dark.tint,
  },
  founderInfo: {
    marginLeft: 20,
    flex: 1,
  },
  founderName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  founderTitle: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontStyle: 'italic',
  },
  founderBio: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  missionSection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: Colors.dark.text,
    marginLeft: 12,
  },
  missionText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 105, 180, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Colors.dark.tint,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  commitmentCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  commitmentTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  commitmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.tint,
    marginRight: 12,
  },
  commitmentText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
  },
});
