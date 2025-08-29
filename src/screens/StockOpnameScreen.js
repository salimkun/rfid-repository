import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import DropdownPicker from '../components/DropdownPicker';
import ScanSection from '../components/ScanSection';
import useRfidMqtt, { RfidDataWithQty } from '../hooks/useRfidMqtt';

const StockOpnameScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState('');

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
    setOperationType('STOCK_IN'); // Stock Opname can be seen as a form of stock in for counting
    loadLocalTags(); // Load any previously saved tags when component mounts
  }, []);

  const locationItems = [
    { label: 'Gudang A', value: 'gudangA' },
    { label: 'Gudang B', value: 'gudangB' },
  ];

  const handleScanPress = () => {
    toggleScan(); // This will call startRfidScan('STOCK_IN') or stopRfidScan()
  };

  const renderScanItem = ({ item }: { item: RfidDataWithQty }) => (
    <View style={styles.scanItem}>
      <View>
        <Text style={styles.scanItemRfid}>{item.id}</Text>
        <Text style={styles.scanItemProductName}>{item.productName || 'N/A'}</Text>
      </View>
      <Text style={styles.scanItemId}>ID: {item.id}</Text>
    </View>
  );

  const handleSaveOpname = async () => {
    if (scannedTagsWithQty.length === 0) {
      Alert.alert('Simpan Hasil Opname', 'Tidak ada data RFID untuk disimpan.');
      return;
    }
    await saveLocalTagsArray(scannedTagsWithQty);
    publishRfidDataArray(scannedTagsWithQty);
    Alert.alert('Simpan Hasil Opname', `Hasil opname ${scannedTagsWithQty.length} RFID berhasil disimpan dan dipublikasikan!`);
    clearScannedTags(); // Clear tags after saving and publishing
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Stock Opname" subtitle="Pengecekan Stok Fisik" />
      <ScrollView style={styles.contentContainer}>
        <DropdownPicker
          label="Pilih Lokasi"
          placeholder="Pilih nama lokasi..."
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          items={locationItems}
        />
        <ScanSection
          title="Total RFID Terbaca"
          totalQuantity={scannedTagsWithQty.length}
          buttonText={isScanning ? "Stop Scan Opname" : "Mulai Scan Opname"}
          onScanPress={handleScanPress}
          scanResults={scannedTagsWithQty}
          renderItem={renderScanItem}
          showTotalItem={true}
          totalItemCount={scannedTagsWithQty.length}
        />
      </ScrollView>
      <TouchableOpacity style={styles.bottomButton} onPress={handleSaveOpname}>
        <Text style={styles.bottomButtonText}>Simpan Hasil Opname</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  scanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scanItemRfid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scanItemProductName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scanItemId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
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

export default StockOpnameScreen;
