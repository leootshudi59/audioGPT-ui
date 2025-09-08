import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { CSS } from '../constants';
import { points } from "../mocks/placesMap";


const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_INSET_SPACING = width * 0.1 - 17;

export default function MapScreen() {
  const [region, setRegion] = React.useState<Region>({
    latitude: 48.87,
    longitude: 2.483,
    longitudeDelta: 0.100,
    latitudeDelta: 0.008,
  });

  const _map = useRef<MapView | null>(null);
  const _scrollView = React.useRef<ScrollView | null>(null);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);
  let regionTimeout: number;

  const interpolations = points.map((poi, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });
    return { scale };
  });

  const onMarkerPress = (mapEventData: any) => {
    // Get the ID (or index) of the marker that was pressed.
    const markerId = mapEventData._targetInst.return.key;
    console.log("width", width);
    console.log("CARD_WIDTH", CARD_WIDTH);
    console.log("Marker id", markerId);

    const totalOffset = Platform.OS === "ios" ? CARD_INSET_SPACING : 0;
    const cardMargin = 12; // your card marginHorizontal

    // Correct scroll position to perfectly center the card
    const x = markerId * (CARD_WIDTH + cardMargin * 2) - totalOffset + cardMargin/3 + 0.5;

    // If the ScrollView reference exists, scroll to the calculated x position to show the card that was corresponds to the pressed marker.
    if (_scrollView.current) {
      _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
    }
  };

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= points.length) {
        index = points.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { coordinates } = points[index];
          const coordinatesObj = {
            latitude: coordinates[0],
            longitude: coordinates[1],
          };

          if (_map.current) {
            const newRegion: Region = {
              latitude: Number(coordinatesObj.latitude),
              longitude: Number(coordinatesObj.longitude),
              longitudeDelta: region.longitudeDelta - 0.09,
              latitudeDelta: region.latitudeDelta,
            };
            _map.current.animateToRegion(newRegion, 350);
          }
        }
      }, 10);
    });
  });

  return (
    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}>
      <MapView
        ref={_map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={region}
        style={{ height: '100%', width: '100%' }}
      >
        {points.map((poi, i) => {
          console.log(poi.name, poi._id);
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[i].scale,
              },
            ],
          };
          //console.log(scaleStyle)
          return (
            <Marker
              key={i}
              coordinate={{
                latitude: Number(poi.coordinates[0]),
                longitude: Number(poi.coordinates[1]),
              }}
              title={poi.name ? poi.name : ""}
              onPress={(e) => onMarkerPress(e)}
            >
              {/* <Animated.View style={styles.markerWrap}>

              </Animated.View> */}
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor={CSS.color.APP_BLACK}
          style={{ flex: 1, padding: 0 }}
        />
        <Image
          style={{ width: 20, height: 20, tintColor: CSS.color.APP_BLACK }}
        />
      </View>
      <Animated.ScrollView
        horizontal={true}
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.scrollView}
        snapToInterval={CARD_WIDTH + 24}
        snapToAlignment={"center"}
        contentInset={{
          top: 0,
          // left: CARD_INSET_SPACING,
          //   bottom: 0,
          //   right: CARD_INSET_SPACING
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === "android" ? CARD_INSET_SPACING : 0,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        ref={_scrollView}
      >
        {points.map((poi, i) => {
          return (
            <View style={styles.card} key={i}>
              {/* <Image
                  source={poi.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                /> */}
              <View style={styles.textContent}>
                <Text numberOfLines={2} style={styles.cardTitle}>{poi.name}</Text>
                <Text numberOfLines={3}>{poi.description}</Text>

                {poi.entrance_fee &&
                  <View style={{display: "flex", flexDirection:"row", alignItems: "center", marginTop: 10, overflow: "hidden"}}>
                    <Image
                      // source={require("../assets/coin.png")}
                      style={{height: 18, width: 18, marginRight: 5}}
                      tintColor={CSS.color.MAIN_COLOR}
                      />
                    <Text numberOfLines={3}>{poi.entrance_fee}</Text>
                  </View>  
                }
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    backgroundColor: "#ee0"
  },
  searchBox: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 24 : 16,
    height: 56,
    flexDirection: "row",
    backgroundColor: CSS.color.APP_WHITE,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 64,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: "#6d6868",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  textContent: {
    flex: 2,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: CSS.color.APP_WHITE,
    borderRadius: 8,
    marginHorizontal: 12,
    shadowColor: "#6d6868",
    shadowRadius: 5,
    shadowOpacity: 0.5,
    // shadowOffset: { x: 2, y: -2 },
    overflow: "hidden",
    height: CSS.size.height.CARD_HEIGHT,
    width: CARD_WIDTH,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  }
});