import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DropdownPicker = ({ label, selectedValue, onValueChange, items, placeholder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {placeholder && <Picker.Item label={placeholder} value="" enabled={false} style={{ color: '#999' }} />}
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
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
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default DropdownPicker;
