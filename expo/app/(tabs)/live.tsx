import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { LiveStream } from '@/types/api';

export default function LiveScreen() {
  const { data: streams = [], isLoading } = useQuery({
    queryKey: ['streams', 'live'],
    queryFn: () => apiService.getLiveStreams(),
  });

  const renderStreamItem = ({ item }: { item: LiveStream }) => (
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Live Streams" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
        </View>
      </View>
    );
  }

  if (streams.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Live Streams" />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No live streams at the moment</Text>
          <Text style={styles.emptySubtext}>Check back soon for live readings</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Live Streams" />
      <FlatList
        data={streams}
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
