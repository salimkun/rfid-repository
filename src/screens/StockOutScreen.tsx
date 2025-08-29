import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'; // Removed ScrollView
import { StackNavigationProp } from '@react-navigation/native-stack';
import CustomHeader from '../components/CustomHeader';
import DropdownPicker from '../components/DropdownPicker';
import ScanSection from '../components/ScanSection';
import useRfidMqtt, { RfidDataWithQty } from '../hooks/useRfidMqtt';

type RootStackParamList = {
  Login: undefined;
  MainMenu: undefined;
  StockIn: undefined;
  StockOut: undefined;
  StockOpname: undefined;
};

type StockOutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StockOut'>;

interface StockOutScreenProps {
  navigation: StockOutScreenNavigationProp;
}

const StockOutScreen = ({ navigation }: StockOutScreenProps) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const selectedProduct = "Default Product for Stock Out"; // Stock Out doesn't have a product dropdown

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
    setOperationType('STOCK_OUT');
    loadLocalTags(); // Load any previously saved tags when component mounts
  }, []);

  const locationItems = [
    { label: 'Gudang A', value: 'gudangA' },
    { label: 'Gudang B', value: 'gudangB' },
  ];

  const handleScanPress = () => {
    toggleScan(); // This will call startRfidScan('STOCK_OUT') or stopRfidScan()
  };

  const renderScanItem = ({ item }: { item: RfidDataWithQty }) => (
    <View style={styles.scanItem}>
      <View>
        <Text style={styles.scanItemName}>{item.id}</Text>
        <Text style={styles.scanItemProductId}>ID Produk: {item.productId || 'N/A'}</Text>
      </View>
      <Text style={styles.scanItemUnit}>{item.qty} unit</Text>
    </View>
  );

  const handleCompleteTransaction = async () => {
    if (scannedTagsWithQty.length === 0) {
      Alert.alert('Selesaikan Transaksi', 'Tidak ada data RFID untuk diselesaikan.');
      return;
    }
    if (!selectedLocation) {
      Alert.alert('Pilih Lokasi', 'Mohon pilih lokasi terlebih dahulu.');
      return;
    }
    await saveLocalTagsArray(scannedTagsWithQty);
    publishRfidDataArray(scannedTagsWithQty, selectedLocation, selectedProduct);
    Alert.alert('Transaksi Selesai', `Transaksi ${scannedTagsWithQty.length} RFID berhasil diselesaikan dan dipublikasikan dari ${selectedLocation}!`);
    clearScannedTags(); // Clear tags after completing transaction
  };

  const totalItemsCount = scannedTagsWithQty.reduce((sum, item) => sum + item.qty, 0);

  return (
    <View style={styles.container}>
      <CustomHeader title="Stock Out" subtitle="Pencatatan Barang Keluar" />
      <View style={styles.contentWrapper}>
        <View style={styles.dropdownsContainer}>
          <DropdownPicker
            label="Pilih Lokasi"
            placeholder="Pilih nama lokasi..."
            selectedValue={selectedLocation}
            onValueChange={(itemValue: string) => setSelectedLocation(itemValue)}
            items={locationItems}
          />
        </View>
        <ScanSection
          title="Total Kuantitas"
          totalQuantity={totalItemsCount}
          buttonText={isScanning ? "Stop Scan" : "Mulai Scan"}
          onScanPress={handleScanPress}
          scanResults={scannedTagsWithQty}
          renderItem={renderScanItem}
          showTotalItem={true}
          totalItemCount={scannedTagsWithQty.length}
        />
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={handleCompleteTransaction}>
        <Text style={styles.bottomButtonText}>Selesaikan Transaksi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  dropdownsContainer: {
    marginBottom: 20,
  },
  scanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scanItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scanItemProductId: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scanItemUnit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  bottomButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StockOutScreen;
