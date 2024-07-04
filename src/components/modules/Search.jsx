import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { searchCoin } from "../../services/cryptoApi";
import styles from "./Search.module.css";
import { marketChart } from "../../services/cryptoApi";

function Search({ currency, setCurrency, mainCoins, setChart }) {
  const [text, setText] = useState("");
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setCoins([]);
    if (!text) {
      setIsLoading(false);
      return;
    }
    const search = async () => {
      try {
        const res = await fetch(searchCoin(text), {
          signal: controller.signal,
        });
        const json = await res.json();
        console.log(json);
        if (json.coins) {
          setIsLoading(false);
          setCoins(json.coins);
        } else {
          alert(json.status.error_message);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          alert(error.message);
        }
      }
    };
    setIsLoading(true);
    search();
    return () => controller.abort();
  }, [text]);
  const showHandler = async (coin) => {
    const newCoin = mainCoins.filter((item) => item.id === coin.id)[0];
    if (!newCoin) alert("information not found");
    coin = newCoin;
    try {
      const res = await fetch(marketChart(newCoin.id));
      const json = await res.json();
      setChart({ ...json, coin });
      console.log(json);
    } catch (error) {
      setChart(null);
    }
  };
  return (
    <div className={styles.searchBox}>
      <input
        type="text"
        placeholder="Search"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select
        name=""
        id=""
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
        <option value="jpy">JPY</option>
      </select>
      {(!!coins.length || isLoading) && (
        <div className={styles.searchResault}>
          {isLoading && (
            <RotatingLines
              width="50px"
              height="50px"
              strokeWidth="2"
              strokeColor="#3874ff"
            />
          )}
          <ul>
            {coins.map((coin) => (
              <li key={coin.id} onClick={() => showHandler(coin)}>
                <img src={coin.thumb} alt={coin.name} />
                <p>{coin.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Search;
