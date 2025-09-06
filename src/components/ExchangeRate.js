import React from "react";

function ExchangeRate({ rate }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-bold mb-2">Exchange Rate</h2>
      <p className="text-xl text-gray-600">
        1 ETH = <span id="exchangeRate">{rate}</span> Lz404 Tokens
      </p>
    </div>
  );
}

export default ExchangeRate;
