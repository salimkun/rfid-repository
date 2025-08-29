import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import DropdownPicker from '../components/DropdownPicker';
import ScanSection from '../components/ScanSection';
import useRfidMqtt, { RfidDataWithQty } from '../hooks/useRfidMqtt';

const StockInScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const { 
    isScanning, 
    scannedTagsWithQty, 
    toggleScan, 
    clearScannedTags, 
    saveLocalTagsArray, 
    publishRfidDataArray, 
    loadLocalTags,
    setOperationType,
    setScannedTagsWithQty // Expose this if you need to manually set tags from screen
  } = useRfidMqtt();

  useEffect(() => {
    setOperationType('STOCK_IN');
    loadLocalTags(); // Load any previously saved tags when component mounts
  }, []);

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

  const renderScanItem = ({ item }: { item: RfidDataWithQty }) => (
    <View style={styles.scanItem}>
      <Text>{item.id}</Text>
      {/* <Text>{`Qty: ${item.qty}`}</Text> */}
      {/* <Text>{item.type}</Text> */}
    </View>
  );

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
    Alert.alert('Simpan Data', `Data ${scannedTagsWithQty.length} RFID berhasil disimpan dan dipublikasikan ke ${selectedLocation} - ${selectedProduct}!`);
    clearScannedTags(); // Clear tags after saving and publishing
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Stock In" subtitle="Pencatatan Barang Masuk" />
      <View style={styles.contentArea}>
        <DropdownPicker
          label="Pilih Lokasi"
          placeholder="Pilih nama lokasi..."
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          items={locationItems}
        />
        <DropdownPicker
          label="Pilih Produk"
          placeholder="Pilih nama produk..."
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => setSelectedProduct(itemValue)}
          items={productItems}
        />
        <ScanSection
          title="Total Kuantitas"
          totalQuantity={scannedTagsWithQty.length}
          buttonText={isScanning ? "Stop Scan" : "Mulai Scan"}
          onScanPress={handleScanPress}
          scanResults={scannedTagsWithQty}
          renderItem={renderScanItem}
          emptyMessage="Belum ada RFID yang terdeteksi."
          showTotalItem={false} // Adjust based on your UI for Stock In
          totalItemCount={0} // Not used when showTotalItem is false
        />
      </View>
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
  contentArea: {
    flex: 1,
    padding: 20,
  },
  scanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bottomButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StockInScreen;
