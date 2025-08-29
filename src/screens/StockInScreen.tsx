import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import DropdownPicker from '../components/DropdownPicker';
import ScanSection from '../components/ScanSection';
import useRfidMqtt, { RfidDataWithQty } from '../hooks/useRfidMqtt';
import SearchableProductDropdown from '../components/SearchableProductDropdown';

const StockInScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null); // Changed to number | null

  const { 
    isScanning, 
    scannedTagsWithQty, 
    toggleScan, 
    clearScannedTags, 
    saveLocalTagsArray, 
    publishRfidDataArray, 
    loadLocalTags,
    setOperationType,
    // setScannedTagsWithQty // Expose this if you need to manually set tags from screen
  } = useRfidMqtt();

  useEffect(() => {
    setOperationType('STOCK_IN');
    loadLocalTags(); // Load any previously saved tags when component mounts
  }, []);

  console.log("StockInScreen: scannedTagsWithQty", scannedTagsWithQty);

  const locationItems = [
    { label: 'Gudang A', value: 'gudangA' },
    { label: 'Gudang B', value: 'gudangB' },
  ];

  const productItems = [
    { label: 'Produk X', value: 'produkX' },
    { label: 'Produk Y', value: 'produkY' },
  ];

  const handleScanPress = () => {
    toggleScan(); // This will call startRfidScan('STOCK_IN') or stopRfidScan()
  };

  const renderScanItem = ({ item }: { item: RfidDataWithQty }) => {
    console.log("StockInScreen: Rendering item", item);
    return (
      <View style={styles.scanItem}>
        <Text>{item.id}</Text>
        {/* <Text>{`Qty: ${item.qty}`}</Text> */}
        {/* <Text>{item.type}</Text> */}
      </View>
    );
  };

  const handleSaveData = async () => {
    if (scannedTagsWithQty.length === 0) {
      Alert.alert('Simpan Data', 'Tidak ada data RFID untuk disimpan.');
      return;
    }
    if (!selectedLocation) {
      Alert.alert('Pilih Lokasi', 'Mohon pilih lokasi terlebih dahulu.');
      return;
    }
    if (!selectedProduct) {
      Alert.alert('Pilih Produk', 'Mohon pilih produk terlebih dahulu.');
      return;
    }
    await saveLocalTagsArray(scannedTagsWithQty);
    publishRfidDataArray(scannedTagsWithQty, selectedLocation, selectedProduct);
    Alert.alert('Simpan Data', `Data ${scannedTagsWithQty.length} RFID berhasil disimpan dan dipublikasikan ke ${selectedLocation} - Produk ID: ${selectedProduct}!`);
    clearScannedTags(); // Clear tags after saving and publishing
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Stock In" subtitle="Pencatatan Barang Masuk" />
      <FlatList
        data={[
          { type: 'dropdowns', key: 'dropdowns' },
          { type: 'totalQuantityScan', key: 'totalQuantityScan' },
          { type: 'scanResults', key: 'scanResults' },
        ]}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'dropdowns':
              return (
                <View style={styles.dropdownsContainer}>
                  <DropdownPicker
                    label="Pilih Lokasi"
                    placeholder="Pilih nama lokasi..."
                    selectedValue={selectedLocation}
                    onValueChange={(itemValue: string) => setSelectedLocation(itemValue)}
                    items={locationItems}
                  />
                  <SearchableProductDropdown
                    label="Pilih Produk"
                    selectedValue={selectedProduct}
                    onValueChange={(productId) => setSelectedProduct(productId)}
                  />
                </View>
              );
            case 'totalQuantityScan':
              return (
                <ScanSection
                  title="Total Kuantitas"
                  totalQuantity={scannedTagsWithQty.length}
                  buttonText={isScanning ? "Stop Scan" : "Mulai Scan"}
                  onScanPress={handleScanPress}
                  scanResults={[]}
                  renderItem={renderScanItem}
                  emptyMessage=""
                  showTotalItem={true}
                  totalItemCount={scannedTagsWithQty.length}
                  style={styles.borderedScanSection}
                  showQuantitySection={true}
                  showScanResults={false}
                  showScanButton={true}
                />
              );
            case 'scanResults':
              return (
                <ScanSection
                  title="Hasil Scan RFID"
                  totalQuantity={0}
                  buttonText={''}
                  onScanPress={handleScanPress}
                  scanResults={scannedTagsWithQty}
                  renderItem={renderScanItem}
                  emptyMessage="Belum ada RFID yang terdeteksi."
                  showTotalItem={false}
                  totalItemCount={0}
                  style={styles.borderedScanSection}
                  showQuantitySection={false}
                  showScanResults={true}
                  showScanButton={false}
                />
              );
            default:
              return null;
          }
        }}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.bottomButton} onPress={handleSaveData}>
        <Text style={styles.bottomButtonText}>Simpan Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  // Removed contentWrapper and scrollContent as they are no longer needed
  flatListContent: {
    padding: 20,
    paddingBottom: 20, // Add some padding at the bottom of the scroll view
  },
  dropdownsContainer: {
    marginBottom: 20,
  },
  scanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  // Add a new style for the bordered ScanSection
  borderedScanSection: {
    borderWidth: 2,
    borderColor: 'red',
    marginBottom: 20, // Add margin bottom for spacing between sections
  },
  bottomButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30, // Add padding for iPhone X style safe area
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StockInScreen;
