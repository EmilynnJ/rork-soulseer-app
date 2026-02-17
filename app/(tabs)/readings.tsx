import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Reader } from '@/types/api';

export default function ReadingsScreen() {
  const router = useRouter();

  const { data: readers = [], isLoading } = useQuery({
    queryKey: ['readers', 'all'],
    queryFn: () => apiService.getAllReaders(),
  });

  const renderReaderItem = ({ item }: { item: Reader }) => (
    <View style={styles.readerCard}>
      <View style={styles.readerRow}>
        <Image source={{ uri: item.avatar }} style={styles.readerAvatar} />
        <View style={styles.readerInfo}>
          <Text style={styles.readerName}>{item.name}</Text>
          <Text style={styles.readerSpecialty}>{item.specialty}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviewCount})
            </Text>
          </View>
        </View>
        <View style={styles.readerAction}>
          <Text style={styles.priceText}>${item.pricePerMin}/min</Text>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => router.push(`/reading/${item.id}` as never)}
          >
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>{item.bio}</Text>
      {item.isOnline && (
        <View style={styles.onlineIndicator} />
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Our Psychics" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
        </View>
      </View>
    );
  }

  if (readers.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Our Psychics" />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No readers available at the moment</Text>
          <Text style={styles.emptySubtext}>Please check back later</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Our Psychics" />
      <FlatList
        data={readers}
        renderItem={renderReaderItem}
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
  readerCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  readerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: Colors.dark.card,
    zIndex: 1,
  },
});
