import { RotatingLines } from "react-loader-spinner";
import chartUp from "../../assets/chart-up.svg";
import charDown from "../../assets/chart-down.svg";
import styles from "./TableCoin.module.css";
import { marketChart } from "../../services/cryptoApi";
function TableCoin({ coins, isLoading, currency, setChart, chart }) {
  // console.log(coins);
  return (
    <div className={styles.container}>
      {isLoading ? (
        <RotatingLines strokeColor="#3874ff" strokeWidth="2" />
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h</th>
              <th>Total Volume</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <TableRow
                coin={coin}
                key={coin.id}
                currency={currency}
                setChart={setChart}
                chart={chart}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableCoin;

const TableRow = ({ coin, currency, setChart ,chart}) => {
  const {
    id,
    name,
    image,
    symbol,
    total_volume,
    price_change_percentage_24h: price_change,
    current_price,
  } = coin;
  const showHandler = async () => {
    try {
      // console.log(id);
      const res = await fetch(marketChart(id));
      const json = await res.json();
      setChart({ ...json, coin });
      console.log(coin);
      console.log(json);
    } catch (error) {
      setChart(null);
    }
  };
  return (
    <tr>
      <td>
        <div className={styles.symbol} onClick={showHandler}>
          <img src={image} alt="" />
          <span>{symbol.toUpperCase()}</span>
        </div>
      </td>
      <td>{name}</td>
      <td>
        <span>{currency === "usd" ? "$ " : null}</span>
        <span>{currency === "eur" ? "€ " : null}</span>
        <span>{currency === "jpy" ? "¥ " : null}</span>
        {current_price.toLocaleString()}
      </td>
      <td className={price_change > 0 ? styles.success : styles.error}>
        {price_change.toFixed(2)}%
      </td>
      <td>{total_volume.toLocaleString()}</td>
      <td>
        <img src={price_change > 0 ? chartUp : charDown} alt={name} />
      </td>
    </tr>
  );
};
