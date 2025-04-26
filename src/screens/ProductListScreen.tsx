import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl, 
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Animated,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform
} from 'react-native';
import { useProductStore } from '../store/product.store';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../api/types/product.types';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export const ProductListScreen = () => {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scrollY = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  
  // Extract unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id.toString() }
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard 
      product={item} 
      onPress={handleProductPress}
    />
  );

  // Animated header values
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 10, 20],
    outputRange: [0, 3, 5],
    extrapolate: 'clamp',
  });

  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={[
        styles.loadingContainer, 
        { backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa' }
      ]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={[
          styles.loadingText,
          { color: colorScheme === 'dark' ? '#e0e0e0' : '#666' }
        ]}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[
        styles.errorContainer,
        { backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa' }
      ]}>
        <Ionicons 
          name="alert-circle-outline" 
          size={48} 
          color={colorScheme === 'dark' ? '#e57373' : '#e74c3c'} 
        />
        <Text style={[
          styles.errorText,
          { color: colorScheme === 'dark' ? '#e57373' : '#e74c3c' }
        ]}>{error}</Text>
        <TouchableOpacity 
          style={[
            styles.retryButton,
            { backgroundColor: colorScheme === 'dark' ? '#2980b9' : '#3498db' }
          ]} 
          onPress={fetchProducts}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa' }
    ]}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
      />
      
      {/* Custom Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
            elevation: headerElevation,
            shadowOpacity: headerElevation.interpolate({
              inputRange: [0, 5],
              outputRange: [0, 0.1]
            })
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color={colorScheme === 'dark' ? '#ffffff' : '#333333'} 
            />
          </TouchableOpacity>
          
          <Text style={[
            styles.headerTitle,
            { color: colorScheme === 'dark' ? '#ffffff' : '#333333' }
          ]}>Fake Store</Text>
          
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons 
              name="cart-outline" 
              size={24} 
              color={colorScheme === 'dark' ? '#ffffff' : '#333333'} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Search Section */}
      <View style={[
        styles.searchSection,
        { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff' }
      ]}>      
        <View style={[
          styles.searchInputContainer,
          { backgroundColor: colorScheme === 'dark' ? '#333333' : '#f0f0f0' }
        ]}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={colorScheme === 'dark' ? '#999999' : '#999999'} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: colorScheme === 'dark' ? '#ffffff' : '#333333' }
            ]}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colorScheme === 'dark' ? '#999999' : '#999999'}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons 
                name="close-circle" 
                size={18} 
                color={colorScheme === 'dark' ? '#999999' : '#999999'} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Categories Horizontal Scroll */}
      <View style={[
        styles.categoriesContainer,
        { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff' }
      ]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: colorScheme === 'dark' ? '#333333' : '#f0f0f0' },
                selectedCategory === item && {
                  backgroundColor: colorScheme === 'dark' ? '#2980b9' : '#3498db'
                }
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: colorScheme === 'dark' ? '#cccccc' : '#666666' },
                  selectedCategory === item && { color: '#ffffff' }
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchProducts}
            tintColor={colorScheme === 'dark' ? '#3498db' : '#3498db'}
            colors={[colorScheme === 'dark' ? '#3498db' : '#3498db']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="basket-outline" 
              size={64} 
              color={colorScheme === 'dark' ? '#444444' : '#cccccc'} 
            />
            <Text style={[
              styles.emptyText,
              { color: colorScheme === 'dark' ? '#cccccc' : '#666666' }
            ]}>
              No products found
            </Text>
            <Text style={[
              styles.emptySubtext,
              { color: colorScheme === 'dark' ? '#999999' : '#999999' }
            ]}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.productsRow}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    height: HEADER_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  searchSection: {
    padding: 16,
    paddingTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productsList: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  productsRow: {
    justifyContent: 'space-between',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});