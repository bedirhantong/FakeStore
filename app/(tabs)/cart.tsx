import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCartStore } from '../../src/store/cart.store';
import { useAuthStore } from '../../src/store/auth.store';
import { ProductService } from '../../src/api/services/product.service';
import { Product } from '../../src/api/types/product.types';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32;

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { cart, isLoading, getUserCart, updateQuantity, removeFromCart } = useCartStore();
  const { user } = useAuthStore();
  const [cartProducts, setCartProducts] = React.useState<(Product & { quantity: number })[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false);

  useEffect(() => {
    if (user?.id) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      if (user?.id) {
        await getUserCart(user.id);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!cart?.products.length) {
        setCartProducts([]);
        return;
      }

      setIsLoadingProducts(true);
      try {
        const productService = ProductService.getInstance();
        const products = await Promise.all(
          cart.products.map(async (cartProduct) => {
            const response = await productService.getProductById(cartProduct.productId);
            return {
              ...response.data,
              quantity: cartProduct.quantity
            };
          })
        );
        setCartProducts(products);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchCartProducts();
  }, [cart]);

  const calculateTotal = () => {
    return cartProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
      // Cart will be automatically updated through the useEffect
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromCart(productId);
              // Cart will be automatically updated through the useEffect
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          },
        },
      ]
    );
  };

  if (isLoading || isLoadingProducts) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
      ]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={[
          styles.loadingText,
          { color: isDark ? '#ffffff' : '#333333' }
        ]}>Loading cart...</Text>
      </View>
    );
  }

  if (!cart || cartProducts.length === 0) {
    return (
      <View style={[
        styles.emptyContainer,
        { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
      ]}>
        <Ionicons
          name="cart-outline"
          size={64}
          color={isDark ? '#333333' : '#cccccc'}
        />
        <Text style={[
          styles.emptyTitle,
          { color: isDark ? '#ffffff' : '#333333' }
        ]}>Your cart is empty</Text>
        <Text style={[
          styles.emptySubtitle,
          { color: isDark ? '#cccccc' : '#666666' }
        ]}>Add some products to your cart</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#121212' : '#f8f9fa' }
    ]}>
      <ScrollView style={styles.scrollView}>
        {cartProducts.map((product) => (
          <View
            key={product.id}
            style={[
              styles.cartItem,
              { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
            ]}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <Text
                style={[
                  styles.productTitle,
                  { color: isDark ? '#ffffff' : '#333333' }
                ]}
                numberOfLines={2}
              >
                {product.title}
              </Text>
              <Text
                style={[
                  styles.productPrice,
                  { color: isDark ? '#3498db' : '#2980b9' }
                ]}
              >
                ${(product.price * product.quantity).toFixed(2)}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                >
                  <Ionicons name="remove" size={20} color="#3498db" />
                </TouchableOpacity>
                <Text style={[
                  styles.quantityText,
                  { color: isDark ? '#ffffff' : '#333333' }
                ]}>
                  {product.quantity}
                </Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                >
                  <Ionicons name="add" size={20} color="#3498db" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveItem(product.id)}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color="#e74c3c"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={[
        styles.bottomBar,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }
      ]}>
        <View style={styles.totalContainer}>
          <Text style={[
            styles.totalLabel,
            { color: isDark ? '#cccccc' : '#666666' }
          ]}>Total:</Text>
          <Text style={[
            styles.totalAmount,
            { color: isDark ? '#ffffff' : '#333333' }
          ]}>
            ${calculateTotal().toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
