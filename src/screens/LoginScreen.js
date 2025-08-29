import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import useLogin from '../hooks/useLogin';

const LoginScreen = ({ navigation }) => {
  const { username, setUsername, password, setPassword, handleLogin } = useLogin(navigation);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')} // You'll need to add a logo.png in the assets folder
          style={styles.logo}
        />
        <Text style={styles.title}>Sistem Inventory</Text>
        <Text style={styles.subtitle}>Login untuk melanjutkan</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>ID Pengguna</Text>
        <View style={styles.inputContainer}>
          {/* <Image source={require('../assets/user-icon.png')} style={styles.icon} /> */}
          <TextInput
            style={styles.input}
            placeholder="Masukkan ID Anda"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          {/* <Image source={require('../assets/lock-icon.png')} style={styles.icon} /> */}
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {/* You might want to add a show/hide password icon here later */}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>MASUK</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Lupa Password?</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Versi 1.0.1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#888',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#007bff',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },
  version: {
    fontSize: 12,
    color: '#999',
    marginTop: 30,
  },
});

export default LoginScreen;
