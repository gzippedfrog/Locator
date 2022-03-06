import { action, makeAutoObservable, runInAction } from "mobx";
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

    (async () => {
      try {
        const ip = await publicIP();
        let response = await fetch(api_url + "iplocate/address?ip=" + ip, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + token
          }
        });
        response = await response.json();
        runInAction(() => {
          this.ip = ip;
          this.city = response.location.data.city;
        });
      } catch (error) {
        console.log("error", error);
      }
    })();
  }

  setStreet(street) {
    if (/[^A-Za-zА-Яа-я]+/.test(street)) return;
    this.street = street;
  }

  async fetchSuggestions() {
    if (!this.street) return;

    const query = this.city + " " + this.street;

    try {
      const response = await fetch(api_url + "suggest/address", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + token
        },
        body: JSON.stringify({ query })
      });
      const { suggestions } = await response.json();
      runInAction(() => {
        this.suggestions = suggestions.filter(
          ({ data }) => data.street_with_type && data.city
        );
      });
    } catch (error) {
      console.log("error", error);
    }
  }
}

export default new Locator();
