import React from 'react';
import { View, Text, Image, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Product } from '../api/types/product.types';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Daha geniş boşluklar için 48px margin
const IMAGE_SIZE = CARD_WIDTH - 24; // Görsel için daha dengeli bir boyut

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() => onPress?.(product)}
    >
      {/* Ürün Görseli */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Ürün Bilgileri */}
      <View style={styles.infoContainer}>
        {/* Başlık */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Fiyat ve Rating */}
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ★ {product.rating.rate}
            </Text>
          </View>
        </View>

        {/* Kategori */}
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>

        {/* Sepete Ekle Butonu */}
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    padding: 12,
    elevation: 4, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  imageContainer: {
    backgroundColor: '#f5f5f5', // Daha yumuşak bir arka plan rengi
    borderRadius: 12,
    overflow: 'hidden',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignSelf: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#fff',
  },
  infoContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50', // Daha sofistike bir renk tonu
  },
  ratingContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#3498db', // Modern bir mavi ton
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});