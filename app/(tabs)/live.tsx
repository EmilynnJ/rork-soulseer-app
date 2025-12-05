import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { MOCK_STREAMS } from '@/mocks/readers';
import { LinearGradient } from 'expo-linear-gradient';

export default function LiveScreen() {
  const renderStreamItem = ({ item }: { item: typeof MOCK_STREAMS[0] }) => (
    <TouchableOpacity style={styles.streamItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} />
      <View style={styles.liveBadge}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.streamOverlay}>
        <Text style={styles.readerName}>{item.readerName}</Text>
        <Text style={styles.streamTitle}>{item.title}</Text>
        <Text style={styles.streamViewerCount}>{item.viewers} watching</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Live Streams" />
      <FlatList
        data={MOCK_STREAMS}
        renderItem={renderStreamItem}
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
  streamItem: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
  },
  streamThumbnail: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF0033',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
    padding: 16,
    paddingTop: 60,
  },
  readerName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  streamTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streamViewerCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});
