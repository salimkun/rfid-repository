import { useState } from 'react';
import { Alert } from 'react-native';

const useLogin = (navigation) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
