import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { Header } from '@/components/Header';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Product } from '@/types/api';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'crystals', name: 'Crystals' },
  { id: 'tarot', name: 'Tarot Decks' },
  { id: 'guides', name: 'Digital Guides' },
  { id: 'meditation', name: 'Meditation' },
];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => apiService.getProducts(selectedCategory === 'all' ? undefined : selectedCategory),
  });

  const renderProduct = ({ item }: { item: Product }) => (
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
            <TouchableOpacity 
              key={cat.id} 
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.dark.tint} />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No products available</Text>
            <Text style={styles.emptySubtext}>Check back soon for new items</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  categoryChipActive: {
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
    borderColor: Colors.dark.tint,
  },
  categoryText: {
    color: Colors.dark.text,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  categoryTextActive: {
    color: Colors.dark.tint,
    fontWeight: 'bold',
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
