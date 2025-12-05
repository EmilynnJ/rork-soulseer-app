import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';

const MOCK_MESSAGES = [
  {
    id: '1',
    readerName: 'Mystic Luna',
    lastMessage: 'Your reading is ready for review.',
    time: '2m ago',
    unread: 1,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    readerName: 'Crystal Sage',
    lastMessage: 'Thank you for the session! Remember to cleanse your crystals.',
    time: '1d ago',
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
  },
];

export default function MessagesScreen() {
  const renderMessageItem = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => (
    <TouchableOpacity style={styles.messageItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.readerName}>{item.readerName}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
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

  return (
    <View style={styles.container}>
      <Header title="Messages" />
      <FlatList
        data={MOCK_MESSAGES}
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
