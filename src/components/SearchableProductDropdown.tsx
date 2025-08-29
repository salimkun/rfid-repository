import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';

interface Product {
  id: number;
  name: string;
}

interface SearchableProductDropdownProps {
  label: string;
  onValueChange: (productId: number | null) => void;
  selectedValue: number | null;
}

const PRODUCTS_PER_LOAD = 5; // Number of products to load initially and on each scroll

const SearchableProductDropdown = ({ label, onValueChange, selectedValue }: SearchableProductDropdownProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const selectedProductName = selectedValue ? allProducts.find(p => p.id === selectedValue)?.name : '';

  const fetchProducts = useCallback(async () => {
    if (allProducts.length > 0) return; // Only fetch once

    setLoading(true);
    try {
      const response = await fetch('http://146.190.93.211:8123/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const fetchedProducts: Product[] = json.data;

      setAllProducts(fetchedProducts);
      setPage(1); // Reset page for internal pagination
      // hasMore will be calculated in the filtering useEffect

    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Alert.alert('Error', 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [allProducts.length]); // Dependency only on allProducts.length to ensure single fetch

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and paginate displayed products (internal pagination)
  useEffect(() => {
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_LOAD * page));
    setHasMore(filtered.length > PRODUCTS_PER_LOAD * page);
  }, [allProducts, searchText, page]);

  const loadMoreProducts = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleProductSelect = (product: Product) => {
    onValueChange(product.id);
    setModalVisible(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductSelect(item)}>
      <Text style={styles.productItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.pickerDisplay} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerDisplayText}>{selectedProductName || 'Pilih produk...'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari produk..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={displayedProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => loading ? <ActivityIndicator size="small" /> : null}
              style={styles.flatList}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  pickerDisplay: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
    minHeight: 50,
  },
  pickerDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  flatList: {
    maxHeight: 300, // Limit height of the FlatList inside the modal
    marginBottom: 10,
  },
  productItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchableProductDropdown;
