import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { Message } from '@/types/api';

export default function MessagesScreen() {
  const { user } = useUser();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: () => apiService.getMessages(user?.id || ''),
    enabled: !!user?.id,
  });

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity style={styles.messageItem}>
      <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.readerName}>{item.senderName}</Text>
          <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <Text style={[styles.messageText, item.unread > 0 && styles.unreadText]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Messages" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
        </View>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Messages" />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation with a reader</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Messages" />
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
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
    paddingHorizontal: 16,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
    marginRight: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  readerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  timeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  messageText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  unreadText: {
    color: 'white',
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: Colors.dark.tint,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
