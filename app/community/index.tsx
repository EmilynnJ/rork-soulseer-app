import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { MessageSquare, Heart, Share2 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { CommunityPost } from '@/types/api';

export default function CommunityScreen() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['community', 'posts'],
    queryFn: () => apiService.getCommunityPosts(),
  });

  const renderTopic = ({ item }: { item: CommunityPost }) => {
    const timeAgo = getTimeAgo(item.createdAt);
    
    return (
      <TouchableOpacity style={styles.topicCard}>
        <View style={styles.topicHeader}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.timeText}>{timeAgo}</Text>
        </View>
        
        <Text style={styles.topicTitle}>{item.title}</Text>
        <Text style={styles.topicAuthor}>by {item.author}</Text>
        
        <View style={styles.topicFooter}>
          <View style={styles.statItem}>
            <MessageSquare size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.statText}>{item.comments}</Text>
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
  };

  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Soul Tribe" showShop={true} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
        </View>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Soul Tribe" showShop={true} />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No community posts yet</Text>
          <Text style={styles.emptySubtext}>Be the first to start a conversation</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Soul Tribe" showShop={true} />
      <FlatList
        data={posts}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_400Regular',
    textAlign: 'center',
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
