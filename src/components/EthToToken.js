import React from "react";

function EthToToken({
  ethAmount,
  setEthAmount,
  tokenReceiveAmount,
  ethToToken,
  isConnected,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-4 text-blue-600">
        <i className="fa fa-arrow-down mr-2"></i>ETH to Lz404 Token
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">ETH Amount</label>
        <div className="flex">
          <input
            type="number"
            step="0.001"
            min="0.001"
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ETH amount"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
          />
          <span className="bg-gray-200 px-4 py-2 rounded-r-md border border-l-0 border-gray-300">
            ETH
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
            value={tokenReceiveAmount}
          />
          <span className="bg-gray-200 px-4 py-2 rounded-r-md border border-l-0 border-gray-300">
            Lz404
          </span>
        </div>
      </div>

      <button
        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={ethToToken}
        disabled={!isConnected || !ethAmount}
      >
        <i className="fa fa-exchange mr-2"></i>Exchange ETH to Lz404
      </button>
    </div>
  );
}

export default EthToToken;
