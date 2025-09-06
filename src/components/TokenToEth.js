// TokenToEth.js
import React from "react";

function TokenToEth({
  tokenAmount,
  setTokenAmount,
  ethReceiveAmount,
  tokenToEth,
  isConnected,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-4 text-green-600">
        <i className="fa fa-arrow-up mr-2"></i>Lz404 Token to ETH
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Lz404 Amount</label>
        <div className="flex">
          <input
            type="number"
            step="1"
            min="1"
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter Lz404 amount"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
          />
          <span className="bg-gray-200 px-4 py-2 rounded-r-md border border-l-0 border-gray-300">
            EXC
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">You'll Receive</label>
        <div className="flex">
          <input
            type="text"
            readOnly
            className="flex-1 bg-gray-100 border border-gray-300 rounded-l-md px-4 py-2"
            placeholder="0.00"
            value={ethReceiveAmount}
          />
          <span className="bg-gray-200 px-4 py-2 rounded-r-md border border-l-0 border-gray-300">
            ETH
          </span>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={tokenToEth}
        disabled={!isConnected || !tokenAmount}
      >
        <i className="fa fa-exchange mr-2"></i>Exchange Lz404 to ETH
      </button>
    </div>
  );
}

export default TokenToEth;
