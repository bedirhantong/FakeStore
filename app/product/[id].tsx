import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ProductService } from '../../src/api/services/product.service';
import { Product } from '../../src/api/types/product.types';
import { useCartStore } from '../../src/store/cart.store';
import { useAuthStore } from '../../src/store/auth.store';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const loadProduct = async () => {
    try {
      const response = await ProductService.getInstance().getProductById(Number(id));
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleGoBack = () => {
    router.back();
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    loadProduct();
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add items to your cart',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => router.push('/auth/login'),
          },
        ]
      );
      return;
    }

    try {
      await addToCart(Number(id), quantity);
      Alert.alert(
        'Success',
        'Product added to cart successfully',
        [
          {
            text: 'Continue Shopping',
            style: 'cancel',
          },
          {
            text: 'View Cart',
            onPress: () => router.push('/(tabs)/cart'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add product to cart. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIndicator}>
          <View style={styles.loadingCircle} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Floating Back Button - Now with onPress handler */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Floating Favorite Button */}
        <TouchableOpacity 
          style={[styles.favoriteFloatingButton, isFavorite && styles.favoriteActiveButton]} 
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>{isFavorite ? '❤️' : '♡'}</Text>
        </TouchableOpacity>
        
        {/* Product Image Section */}
        <Animated.View style={[styles.imageSection, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
          
          {/* Floating Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </Animated.View>
        
        {/* Product Info Card */}
        <Animated.View 
          style={[
            styles.productCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}]
            }
          ]}
        >
          {/* Rating and Reviews */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>{product.rating.rate}</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text 
                    key={star} 
                    style={[
                      styles.starIcon, 
                      star <= Math.round(product.rating.rate) ? styles.filledStar : styles.emptyStar
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.reviewCount}>{product.rating.count} reviews</Text>
          </View>
          
          {/* Product Title */}
          <Text style={styles.productTitle}>{product.title}</Text>
          
          {/* Price Section */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
              {product.price > 50 && (
                <View style={styles.discountContainer}>
                  <Text style={styles.originalPrice}>${(product.price * 1.15).toFixed(2)}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>15% OFF</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
          
          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>✓</Text>
                </View>
                <Text style={styles.featureText}>Premium Quality</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>✓</Text>
                </View>
                <Text style={styles.featureText}>Durable Material</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>✓</Text>
                </View>
                <Text style={styles.featureText}>Satisfaction Guaranteed</Text>
              </View>
            </View>
          </View>
          
          {/* Delivery Info */}
          <View style={styles.deliverySection}>
            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryIcon}>🚚</Text>
              <View>
                <Text style={styles.deliveryTitle}>Fast Delivery</Text>
                <Text style={styles.deliveryInfo}>Free shipping on orders over $50</Text>
              </View>
            </View>
            <View style={styles.deliveryItem}>
              <Text style={styles.deliveryIcon}>↩️</Text>
              <View>
                <Text style={styles.deliveryTitle}>Easy Returns</Text>
                <Text style={styles.deliveryInfo}>30-day money-back guarantee</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '600',
  },
  favoriteFloatingButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteActiveButton: {
    backgroundColor: 'rgba(255, 236, 236, 0.9)',
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  imageSection: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 0.8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  productImage: {
    width: IMAGE_SIZE * 0.7,
    height: IMAGE_SIZE * 0.7,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: -15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  productCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 100,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  filledStar: {
    color: '#f39c12',
  },
  emptyStar: {
    color: '#ddd',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 32,
    marginBottom: 24,
  },
  priceContainer: {
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureIcon: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 15,
    color: '#444',
  },
  deliverySection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  deliveryInfo: {
    fontSize: 13,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginRight: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#3498db',
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});