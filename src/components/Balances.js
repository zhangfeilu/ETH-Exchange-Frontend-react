import React from "react";

function Balances({ ethBalance, tokenBalance }) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6 text-purple-600">
        <i className="fa fa-balance-scale mr-2"></i>Your Balances
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-600 mb-2">ETH Balance</h4>
          <p className="text-2xl font-bold">{ethBalance}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-600 mb-2">Lz404 Token Balance</h4>
          <p className="text-2xl font-bold">{tokenBalance}</p>
        </div>
      </div>
    </div>
  );
}

export default Balances;
