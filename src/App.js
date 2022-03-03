import React from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import {
  Appbar,
  Caption,
  DefaultTheme as theme,
  List,
  Subheading,
  TextInput
} from "react-native-paper";
import { observer } from "mobx-react-lite";
import locator from "./store/locator";

const App = observer(() => {
  function handleStreetChange(street) {
    locator.setStreet(street);
  }

  function handleStreetBlur() {
    locator.fetchSuggestions();
  }

  function renderItem({ item }) {
    return (
      <List.Item
        title={item.data.street_with_type}
        description={item.data.city}
      />
    );
  }

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Appbar.Header>
        <Appbar.Content title="Locator" />
      </Appbar.Header>

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

        <Subheading style={styles.listTitle}>Список найденных улиц:</Subheading>
        {locator.suggestions.length ? (
          <FlatList
            data={locator.suggestions}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            style={styles.listContainer}
          />
        ) : (
          <Caption>сначала введите название улицы</Caption>
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },
  textInput: {
    marginBottom: 10
  },
  listContainer: {
    backgroundColor: "#eee",
    borderRadius: theme.roundness
  },
  listTitle: {
    marginBottom: 10
  }
});

export default App;
