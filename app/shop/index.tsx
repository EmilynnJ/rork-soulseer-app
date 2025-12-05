import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Crystals' },
  { id: '3', name: 'Tarot Decks' },
  { id: '4', name: 'Digital Guides' },
  { id: '5', name: 'Meditation' },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Amethyst Cluster',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1567605663737-17eb48cb7f21?w=400&fit=crop',
    category: 'Crystals',
  },
  {
    id: '2',
    name: 'Mystic Tarot Deck',
    price: 32.50,
    image: 'https://images.unsplash.com/photo-1630328224345-d85c13b3815e?w=400&fit=crop',
    category: 'Tarot Decks',
  },
  {
    id: '3',
    name: 'Moon Phase Guide',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=400&fit=crop',
    category: 'Digital Guides',
  },
  {
    id: '4',
    name: 'Rose Quartz Point',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&fit=crop',
    category: 'Crystals',
  },
];

export default function ShopScreen() {
  const router = useRouter();

  const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Soul Shop" showShop={false} />
      <View style={styles.content}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={PRODUCTS}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryText: {
    color: Colors.dark.text,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  productList: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: Colors.dark.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  productPrice: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  addButtonText: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
