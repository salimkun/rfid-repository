import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Login: undefined;
  MainMenu: undefined;
  StockIn: undefined;
  StockOut: undefined;
  StockOpname: undefined;
};

type CustomHeaderNavigationProp = StackNavigationProp<RootStackParamList>;

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const CustomHeader = ({ title, subtitle, showBackButton = true }: CustomHeaderProps) => {
  const navigation = useNavigation<CustomHeaderNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* <Icon name="chevron-left" size={24} color="#333" /> */}
            <Text style={styles.backIcon}>&lt;</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {/* Placeholder for right-side content if needed */}
        <View style={styles.rightPlaceholder} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rightPlaceholder: {
    width: 44, // Equal to backButton width + padding, for alignment
  },
});

export default CustomHeader;
