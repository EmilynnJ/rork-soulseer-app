import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { MessageSquare, Heart, Share2 } from 'lucide-react-native';

const TOPICS = [
  {
    id: '1',
    title: 'Welcome to SoulSeer Community',
    author: 'Emilynn (Founder)',
    replies: 124,
    likes: 450,
    time: '2h ago',
    tag: 'Announcements',
  },
  {
    id: '2',
    title: 'Daily Card Pull - Share Yours!',
    author: 'Mystic Luna',
    replies: 45,
    likes: 89,
    time: '4h ago',
    tag: 'Tarot',
  },
  {
    id: '3',
    title: 'Understanding Mercury Retrograde',
    author: 'Star Gazer',
    replies: 23,
    likes: 56,
    time: '6h ago',
    tag: 'Astrology',
  },
  {
    id: '4',
    title: 'New to Psychic Readings? Ask Here!',
    author: 'Crystal Sage',
    replies: 12,
    likes: 34,
    time: '1d ago',
    tag: 'Support',
  },
];

export default function CommunityScreen() {
  const renderTopic = ({ item }: { item: typeof TOPICS[0] }) => (
    <TouchableOpacity style={styles.topicCard}>
      <View style={styles.topicHeader}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      
      <Text style={styles.topicTitle}>{item.title}</Text>
      <Text style={styles.topicAuthor}>by {item.author}</Text>
      
      <View style={styles.topicFooter}>
        <View style={styles.statItem}>
          <MessageSquare size={16} color="rgba(255,255,255,0.6)" />
          <Text style={styles.statText}>{item.replies}</Text>
        </View>
        <View style={styles.statItem}>
          <Heart size={16} color="rgba(255,255,255,0.6)" />
          <Text style={styles.statText}>{item.likes}</Text>
        </View>
        <TouchableOpacity style={styles.shareIcon}>
          <Share2 size={16} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Soul Tribe" showShop={true} />
      <FlatList
        data={TOPICS}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  topicCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: Colors.dark.tint,
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  topicTitle: {
    color: Colors.dark.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  topicAuthor: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginLeft: 6,
  },
  shareIcon: {
    marginLeft: 'auto',
  },
});
