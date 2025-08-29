import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StyleProp, ViewStyle } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScanSectionProps {
  title: string;
  totalQuantity: number;
  buttonText: string;
  onScanPress: () => void;
  scanResults: any[]; // Consider defining a more specific type for scanResults
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  emptyMessage: string;
  showTotalItem?: boolean;
  totalItemCount?: number;
  style?: StyleProp<ViewStyle>;
  showQuantitySection?: boolean; // New prop to control visibility of quantity section
  showScanResults?: boolean;    // New prop to control visibility of scan results section
  showScanButton?: boolean;     // New prop to control visibility of scan button
}

const ScanSection = ({
  title,
  totalQuantity,
  buttonText,
  onScanPress,
  scanResults,
  renderItem,
  emptyMessage,
  showTotalItem = false,
  totalItemCount = 0,
  style,
  showQuantitySection = true, // Default to true for backward compatibility
  showScanResults = true,     // Default to true for backward compatibility
  showScanButton = true       // Default to true for backward compatibility
}: ScanSectionProps) => {
  return (
    <View style={[styles.container, style]}>
      {showQuantitySection && (
        <View style={styles.quantityContainer}>
          <View>
            <Text style={styles.quantityLabel}>{title}</Text>
            <Text style={styles.quantityValue}>{totalQuantity}</Text>
          </View>
          {showScanButton && (
            <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
              {/* <Icon name="barcode-scan" size={20} color="#fff" /> */}
              <Text style={styles.scanButtonIcon}>&#x2331;</Text> {/* Placeholder for scan icon */}
              <Text style={styles.scanButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showScanResults && (
        <>
          <Text style={styles.resultsHeader}>Hasil Scan RFID
            {showTotalItem && <Text style={styles.totalItemText}> Total item: {totalItemCount}</Text>}
          </Text>
          <View style={styles.scanResultsContainer}>
            {scanResults.length > 0 ? (
              <FlatList
                data={scanResults}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Ensure unique keys
                contentContainerStyle={styles.flatListContent}
                style={styles.flatList} // Add temporary style
              />
            ) : (
              <Text style={styles.emptyMessage}>{emptyMessage || "Belum ada data RFID yang di-scan."}</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Added flex: 1 here
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
    flex: 1,
    // Removed minHeight and justifyContent/alignItems to allow FlatList to expand
  },
  flatListContent: {
    flexGrow: 1, // Allow FlatList content to grow
    width: '100%',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20, // Add some padding for better appearance
  },
  flatList: {
    backgroundColor: '#e0ffe0', // Temporary background color for debugging
    flex: 1, // Ensure FlatList itself also expands
    minHeight: 100, // Add a minimum height for visibility during debugging
  },
});

export default ScanSection;
