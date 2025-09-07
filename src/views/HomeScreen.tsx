import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation }: {navigation: any}) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Bienvenue sur AudioGPT !
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <Text>Open App</Text>
      </TouchableOpacity>
    </View>
  );
}