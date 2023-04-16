import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cryptoTable.css";

const CryptoTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      setData(result.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredData = data.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(search.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = filteredData.sort(
    (a, b) => b.market_cap - a.market_cap
  );

  const tableData = sortedData.slice(0, 10);

  return (
    <div className="table-container">
      <input
        type="text"
        placeholder="Search Crypto"
        onChange={handleSearch}
      />
      {loading ? (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>24h Change</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((crypto, index) => (
              <tr key={index}>
                <td>{crypto.market_cap_rank}</td>
                <td>{crypto.name}</td>
                <td>{crypto.symbol}</td>
                <td>${crypto.current_price.toFixed(2)}</td>
                <td>${crypto.market_cap.toLocaleString()}</td>
                <td
                  className={
                    crypto.price_change_percentage_24h > 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CryptoTable;
