import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import {
  initializeReader,
  deInitializeReader,
  startReadingTags,
  stopReadingTags,
  tagListener,
} from 'react-native-rfid-chainway-c72'; // Import library RFID Chainway C72 yang sesungguhnya

export interface RfidData {
  id: string;
  type: 'STOCK_IN' | 'STOCK_OUT';
  timestamp: string;
}

export interface RfidDataWithQty extends RfidData {
  qty: number;
}

const MQTT_BROKER_URI = 'ws://146.190.93.211:8080/mqtt'; // Public test broker
const MQTT_TOPIC = 'rfid/nfc'; // Updated topic as per new request
const USERNAME = "ArlitaDev";
const PASSWORD = "4Rlit40!"
const LOCAL_STORAGE_KEY = 'rfidTags';

const useRfidMqtt = () => {
  const [lastScannedRfid, setLastScannedRfid] = useState<RfidData | null>(null);
  const [mqttClient, setMqttClient] = useState<any | null>(null); // Changed to 'any' temporarily
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [scannedTagsWithQty, setScannedTagsWithQty] = useState<RfidDataWithQty[]>([]); // New state for tags with quantity
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const operationTypeRef = useRef<'STOCK_IN' | 'STOCK_OUT' | null>(null);

  // MQTT Connection Effect
  useEffect(() => {
    console.log('Attempting to connect to MQTT broker:', MQTT_BROKER_URI);
    const client = mqtt.connect(MQTT_BROKER_URI, {
      username: USERNAME,
      password: PASSWORD,
      clientId: 'react_native_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      reconnectPeriod: 1000,
      // Untuk pengujian: Nonaktifkan validasi sertifikat SSL/TLS. TIDAK UNTUK PRODUKSI.
      // rejectUnauthorized: false,
    });

    client.on('connect', () => {
      console.log('MQTT: Connected successfully.');
      setIsConnected(true);
    });

    client.on('reconnect', () => {
      console.log('MQTT: Reconnecting...');
    });

    client.on('close', () => {
      console.log('MQTT: Connection closed.');
      setIsConnected(false);
    });

    client.on('offline', () => {
      console.log('MQTT: Client is offline.');
      setIsConnected(false);
    });

    client.on('error', (err: Error) => {
      console.error('MQTT: Connection Error detail:', err);
      setIsConnected(false);
      Alert.alert('MQTT Error', `Failed to connect to MQTT broker: ${err.message || 'Unknown error'}`);
    });

    setMqttClient(client);

    return () => {
      if ((client as any).connected) { 
        console.log('MQTT: Disconnecting client...');
        client.end();
      }
    };
  }, []);

  // RFID Reader Initialization and Tag Listener Effect
  useEffect(() => {
    let tagSubscription: EmitterSubscription | null = null;

    const initRfid = async () => {
      try {
        console.log('RFID: Initializing reader...');
        // As previously determined, initializeReader() may require (as any) and takes no arguments
        await (initializeReader as any)(); 
        console.log('RFID: Reader initialized successfully.');
        
        // Inisialisasi NativeEventEmitter dengan modul native yang sebenarnya
        const rfidEventEmitter = new NativeEventEmitter(NativeModules.RfidChainwayC72); 
        tagSubscription = rfidEventEmitter.addListener('UHF_TAG', (tagData: string[]) => {
          const tag = tagData[0]; // Asumsi tag EPC ada di indeks 0
          console.log('RFID: Tag scanned (from UHF_TAG event):', tag);
          const currentOperationType = operationTypeRef.current;
          if (currentOperationType) {
            setScannedTagsWithQty((prevTags) => {
              const existingTagIndex = prevTags.findIndex((t) => t.id === tag);
              if (existingTagIndex > -1) {
                const updated = [...prevTags];
                updated[existingTagIndex].qty += 1;
                return updated;
              } else {
                const timestamp = new Date().toISOString();
                return [...prevTags, { id: tag, type: currentOperationType, timestamp, qty: 1 }];
              }
            });
            setLastScannedRfid({ id: tag, type: currentOperationType, timestamp: new Date().toISOString() });
          } else {
            console.warn('RFID: No operation type set, ignoring scanned tag.');
          }
        });

      } catch (e: unknown) {
        console.error('RFID: Failed to initialize reader or set up listener in initRfid:', e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown RFID initialization error';
        Alert.alert('RFID Error', `Failed to initialize RFID reader: ${errorMessage}`);
      }
    };

    initRfid();

    return () => {
      console.log('RFID: Deinitializing reader and removing listeners...');
      if (tagSubscription) {
        tagSubscription.remove();
      }
      try {
        // As previously determined, deInitializeReader() may require (as any) and takes no arguments
        (deInitializeReader as any)(); 
        console.log('RFID: Reader deinitialized successfully.');
      } catch (e: unknown) {
        console.error('RFID: Error during deinitialization:', e);
      }
    };
  }, []);

  
  const startRfidScan = async (type: 'STOCK_IN' | 'STOCK_OUT') => {
    if (isScanning) {
      console.warn('RFID: Scan already in progress. Ignoring start scan request.');
      Alert.alert('Perhatian', 'Pemindaian RFID sudah berjalan.');
      return;
    }
    try {
      operationTypeRef.current = type;
      console.log('RFID: Attempting to start scan for type:', type);
      
      // Wrap startReadingTags in a Promise to better handle its async nature with callbacks
      const startResult = await new Promise<[boolean, string]>((resolve) => {
        (startReadingTags as any)((result: boolean, msg: string) => {
          resolve([result, msg]);
        });
      });

      const [result, msg] = startResult;

      if (result === true) {
        console.log('RFID: startReadingTags successful.', msg || 'No message provided by reader.');
        setIsScanning(true);
        Alert.alert('RFID Scan', `Memulai pemindaian RFID untuk ${type}.`);
      } else {
        console.error('RFID: startReadingTags failed - Result:', result, 'Msg:', msg);
        Alert.alert('RFID Error', `Gagal memulai pemindaian RFID: ${msg || 'Pembaca melaporkan kesalahan yang tidak diketahui.'}`);
        setIsScanning(false); 
      }

    } catch (e: unknown) {
      console.error('RFID: Caught error when calling startReadingTags:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown RFID scan start error';
      Alert.alert('RFID Error', `Gagal memulai pemindaian RFID: ${errorMessage}`);
      setIsScanning(false);
    }
  };

  const stopRfidScan = async () => {
    if (!isScanning) {
      console.warn('RFID: No scan in progress to stop. Ignoring stop scan request.');
      Alert.alert('Perhatian', 'Tidak ada pemindaian RFID yang sedang berjalan untuk dihentikan.');
      return;
    }
    try {
      console.log('RFID: Attempting to stop scan.');

      // Wrap stopReadingTags in a Promise to better handle its async nature with callbacks
      const stopResult = await new Promise<[boolean, string]>((resolve) => {
        (stopReadingTags as any)((result: boolean, msg: string) => {
          resolve([result, msg]);
        });
      });

      const [result, msg] = stopResult;

      if (result === true) {
        console.log(`RFID: stopReadingTags successful.`, msg || 'No message provided by reader.');
        Alert.alert('RFID Scan', 'Pemindaian RFID dihentikan.');
      } else {
        console.error('RFID: stopReadingTags failed - Result:', result, 'Msg:', msg || 'Native module returned undefined message'); // Add more descriptive message
        Alert.alert('RFID Error', `Gagal menghentikan pemindaian RFID: ${msg || `Pembaca melaporkan kesalahan yang tidak diketahui. Hasil: ${result}`}`);
        // Even if stop fails, we might want to reset isScanning if the actual reader is no longer scanning
        // This depends on the exact behavior of the native module. For now, assume it's still scanning if it failed to stop.
      }
    } catch (e: unknown) {
      console.error('RFID: Caught error when calling stopReadingTags:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown RFID scan stop error';
      Alert.alert('RFID Error', `Gagal menghentikan pemindaian RFID: ${errorMessage}`);
    } finally {
      setIsScanning(false);
    }
  };

  const clearScannedTags = () => {
    setScannedTagsWithQty([]);
    setLastScannedRfid(null);
    AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log('RFID: Cleared all scanned tags from state and local storage.');
    Alert.alert('Clear Scanned Tags', 'Semua tag yang dipindai telah dihapus.');
  };

  const loadLocalTags = async () => {
    try {
      const storedTags = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTags) {
        setScannedTagsWithQty(JSON.parse(storedTags)); // Load into scannedTagsWithQty
      } else {
        setScannedTagsWithQty([]); // Ensure it's an empty array if nothing is stored
      }
    } catch (e: unknown) {
      console.error('Failed to load local tags:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      Alert.alert('Storage Error', `Failed to load locally stored RFID tags: ${errorMessage}`);
    }
  };

  const saveLocalTagsArray = async (tags: RfidDataWithQty[]) => {
    try {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tags));
      setScannedTagsWithQty(tags); // Update state to reflect saved tags
      console.log('Storage: RFID tags array saved locally.', tags);
      // Alert.alert('Success', `RFID tags array saved locally.`);
    } catch (e: unknown) {
      console.error('Storage: Failed to save RFID tags array locally:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      Alert.alert('Storage Error', `Failed to save RFID tags array locally: ${errorMessage}`);
    }
  };

  const publishRfidDataArray = (tags: RfidDataWithQty[], location: string, product: string) => {
    if (mqttClient && isConnected) {
      const dataToPublish = JSON.stringify({ tags, location, product, source: 'react-native-app' });
      console.log('MQTT: Attempting to publish tags array:', dataToPublish);
      mqttClient.publish(MQTT_TOPIC, dataToPublish, {}, (err?: Error) => { 
        if (err) {
          console.error('MQTT: Failed to publish RFID tags array:', err);
          Alert.alert('Publish Error', `Failed to publish RFID tags array: ${err.message}`);
        } else {
          console.log('MQTT: RFID tags array published successfully.');
          // Alert.alert('Success', `RFID tags array published successfully.`);
        }
      });
    } else {
      console.warn('MQTT: Client not connected, cannot publish tags array.');
      Alert.alert('MQTT Not Connected', 'Cannot publish, MQTT client is not connected.');
    }
  };

  return {
    lastScannedRfid,
    scannedTagsWithQty,
    isScanning,
    startRfidScan,
    stopRfidScan,
    toggleScan: () => { // Modified toggleScan to use the new startRfidScan with default type
      if (isScanning) {
        stopRfidScan();
      } else {
        // Default to STOCK_IN for toggle if not specified, or handle more explicitly in screens
        startRfidScan(operationTypeRef.current || 'STOCK_IN'); 
      }
    },
    clearScannedTags,
    publishRfidDataArray,
    saveLocalTagsArray,
    loadLocalTags,
    isConnected,
    setOperationType: (type: 'STOCK_IN' | 'STOCK_OUT') => { operationTypeRef.current = type; },
    setScannedTagsWithQty, // Expose setter to allow screens to modify tags directly if needed
  };
};

export default useRfidMqtt;
