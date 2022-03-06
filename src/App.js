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
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Appbar.Header>
        <Appbar.Content title="Locator" />
      </Appbar.Header>

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
    flex: 1,
    backgroundColor: theme.colors.background
  },
  textInput: {
    marginBottom: 10
  },
  listContainer: {
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.disabled
  },
  listTitle: {
    marginBottom: 10
  }
});

export default App;
