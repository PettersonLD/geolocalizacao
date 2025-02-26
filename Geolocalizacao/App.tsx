import {useState,useEffect, useRef} from 'react';
import {View} from 'react-native';
import {Styles} from './Style'; 
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, Accuracy, LocationAccuracy, watchPositionAsync} from 'expo-location'
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [location,setLocation] = useState<LocationObject | null>(null)
  
  const mapRef = useRef<MapView>(null);
  
  async function requestLocationPermission() {
    const {granted} = await requestForegroundPermissionsAsync();

    if(granted) {
      const posicaoAtual = await getCurrentPositionAsync();
      setLocation(posicaoAtual);

      console.log("Localizaçao Atual:", posicaoAtual);
    }
  }
  
  useEffect(() => {
    requestLocationPermission();
  },[])

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    },(response) => {
      console.log("Nova Localizaçao: ", response);
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    })
  },[])

  return (
    <View style={Styles.container}>
      {
        location &&
        <MapView 
        ref = {mapRef}
        
        style = {Styles.map}

        initialRegion = {{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}>
          
          <Marker
          coordinate = {{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          ></Marker>
        </MapView>
      }
    </View>
  );

}