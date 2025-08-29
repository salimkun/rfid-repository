import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import icons from a library like react-native-vector-icons
// For now, we'll just use placeholders for the icons.
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MainMenuScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const MenuItem = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemIconContainer}>
        {/* <Icon name={icon} size={24} color="#fff" /> */}
        <Text style={styles.iconPlaceholder}>{icon}</Text>
      </View>
      <View style={styles.menuItemTextContainer}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemDescription}>{description}</Text>
      </View>
      {/* <Icon name="chevron-right" size={20} color="#ccc" /> */}
      <Text style={styles.arrowIcon}>></Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.mainTitle}>Menu Utama</Text>
          <Text style={styles.welcomeText}>Selamat Datang, Budi!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          {/* <Icon name="logout" size={24} color="#333" /> */}
          <Text style={styles.logoutIcon}>&#x21B3;</Text> {/* Placeholder for logout icon */}
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="+"
          title="Stock In"
          description="Mencatat barang masuk"
          onPress={() => Alert.alert('Navigasi', 'Go to Stock In')}
        />
        <MenuItem
          icon="-"
          title="Stock Out"
          description="Mencatat barang keluar"
          onPress={() => Alert.alert('Navigasi', 'Go to Stock Out')}
        />
        <MenuItem
          icon="≡"
          title="Stock Opname"
          description="Pengecekan stok fisik"
          onPress={() => Alert.alert('Navigasi', 'Go to Stock Opname')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
  },
  logoutIcon: {
    fontSize: 24,
    color: '#666',
    transform: [{ rotateY: '180deg' }], // Rotate to make it look like an exit icon
  },
  menuContainer: {
    padding: 20,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconPlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#ccc',
  },
});

export default MainMenuScreen;
