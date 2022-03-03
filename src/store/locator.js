import { action, makeAutoObservable } from "mobx";
import publicIP from "react-native-public-ip";

const token = "be058ccf4fffe4b8bed23887850577b5d034354f";
const api_url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/";

class Locator {
  ip = null;
  city = null;
  street = null;
  suggestions = [];

  constructor() {
    makeAutoObservable(this);

    publicIP().then(
      action((ip) => {
        this.ip = ip;

        fetch(api_url + "iplocate/address?ip=" + ip, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + token
          }
        })
          .then((response) => response.json())
          .then(
            action(({ location }) => {
              this.city = location.data.city;
            })
          )
          .catch((error) => console.log("error", error));
      })
    );
  }

  setStreet(street) {
    if (/[^A-Za-zА-Яа-я]+/.test(street)) return;
    this.street = street;
  }

  fetchSuggestions() {
    if (!this.street) return;

    const query = this.city + " " + this.street;

    fetch(api_url + "suggest/address", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token
      },
      body: JSON.stringify({ query })
    })
      .then((response) => response.json())
      .then(
        action(({ suggestions }) => {
          this.suggestions = suggestions;
        })
      )
      .catch((error) => console.log("error", error));
  }
}

export default new Locator();
