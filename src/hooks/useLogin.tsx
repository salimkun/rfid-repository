import { useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  MainMenu: undefined;
  StockIn: undefined;
  StockOut: undefined;
  StockOpname: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const useLogin = (navigation: LoginScreenNavigationProp) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      navigation.replace('MainMenu');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
  };
};

export default useLogin;
