import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ScanSection = ({ 
  title, 
  totalQuantity, 
  buttonText, 
  onScanPress, 
  scanResults, 
  renderItem, 
  emptyMessage, 
  showTotalItem = false,
  totalItemCount = 0
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.quantityContainer}>
        <View>
          <Text style={styles.quantityLabel}>{title}</Text>
          <Text style={styles.quantityValue}>{totalQuantity}</Text>
        </View>
        <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
          {/* <Icon name="barcode-scan" size={20} color="#fff" /> */}
          <Text style={styles.scanButtonIcon}>&#x2331;</Text> {/* Placeholder for scan icon */}
          <Text style={styles.scanButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.resultsHeader}>Hasil Scan RFID
        {showTotalItem && <Text style={styles.totalItemText}> Total item: {totalItemCount}</Text>}
      </Text>
      <View style={styles.scanResultsContainer}>
        {scanResults.length > 0 ? (
          <FlatList
            data={scanResults}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={styles.emptyMessage}>{emptyMessage || "Belum ada data RFID yang di-scan."}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#666',
  },
  quantityValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007bff',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanButtonIcon: {
    color: '#fff',
    fontSize: 20,
    marginRight: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalItemText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  scanResultsContainer: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    width: '100%',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ScanSection;
