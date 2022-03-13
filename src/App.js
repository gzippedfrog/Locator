import React from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import {
  Appbar,
  List,
  Provider as PaperProvider,
  Subheading,
  TextInput
} from "react-native-paper";
import { observer } from "mobx-react-lite";
import locator from "./store/locator";

const App = observer(() => {
  const handleStreetChange = (street) => {
    locator.setStreet(street);
  };

  const handleStreetBlur = () => {
    locator.fetchSuggestions();
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.data.street_with_type}
      description={item.data.city}
    />
  );

  return (
    <PaperProvider>
      <StatusBar />
      <Appbar.Header>
        <Appbar.Content title="Locator" />
      </Appbar.Header>

      <FlatList
        data={locator.suggestions}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
        style={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.container}>
            <TextInput
              label="IP адрес"
              value={locator.ip}
              style={styles.textInput}
              disabled
              mode="outlined"
            />

            <TextInput
              label="Город"
              value={locator.city}
              style={styles.textInput}
              disabled
              mode="outlined"
            />

            <TextInput
              label="Улица"
              value={locator.street}
              style={styles.textInput}
              onChangeText={handleStreetChange}
              onBlur={handleStreetBlur}
              mode="outlined"
            />

            <Subheading>Список найденных улиц:</Subheading>
          </View>
        }
      />
    </PaperProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },
  textInput: {
    marginBottom: 10
  }
});

export default App;
