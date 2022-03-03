import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import publicIP from "react-native-public-ip";

var token = "be058ccf4fffe4b8bed23887850577b5d034354f";
var url1 =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
var options = {
  method: "GET",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Token " + token
  }
};

const App = () => {
  const [ip, setIp] = useState(null);
  const [city, setCity] = useState(null);
  const [street, setStreet] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    publicIP()
      .then((ip) => {
        setIp(ip);
        return fetch(url1 + ip, options);
      })
      .then((response) => response.json())
      .then((data) => setCity(data.location.data.city))
      .catch((error) => console.log("error", error));
  }, []);

  var url2 =
    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  var options2 = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token
    },
    body: JSON.stringify({ query: city + " " + street })
  };
  function handleStreetChange(text) {
    /[^A-Za-zА-Яа-я]+/.test(text) || setStreet(text);
  }

  function handleStreetBlur() {
    if (!street) return;
    fetch(url2, options2)
      .then((response) => response.json())
      .then(({ suggestions }) => {
        setSuggestions(suggestions);
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="IP адрес"
        value={ip}
        disabled
        style={styles.textInput}
      />

      <TextInput label="Город" value={city} disabled style={styles.textInput} />

      <TextInput
        label="Улица"
        value={street}
        onChangeText={handleStreetChange}
        style={styles.textInput}
        onBlur={handleStreetBlur}
      />

      {suggestions.map((item) => (
        <Text key={item.value}>{item.value}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 20
  },
  textInput: {
    marginBottom: 10
  }
});

export default App;
