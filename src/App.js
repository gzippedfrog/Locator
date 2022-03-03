import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { observer } from "mobx-react-lite";
import locator from "./store/locator";

const App = observer(() => {
  function handleStreetChange(street) {
    /[^A-Za-zА-Яа-я]+/.test(street) || locator.setStreet(street);
  }

  function handleStreetBlur() {
    locator.fetchSuggestions();
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="IP адрес"
        value={locator.ip}
        disabled
        style={styles.textInput}
      />

      <TextInput
        label="Город"
        value={locator.city}
        disabled
        style={styles.textInput}
      />

      <TextInput
        label="Улица"
        value={locator.street}
        onChangeText={handleStreetChange}
        style={styles.textInput}
        onBlur={handleStreetBlur}
      />

      {locator.suggestions?.map((item) => (
        <Text key={item.value}>{item.value}</Text>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1
  },
  textInput: {
    marginBottom: 10
  }
});

export default App;
