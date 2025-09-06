import React from "react";

function TransactionHistory({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-700">
          <i className="fa fa-history mr-2"></i>Transaction History
        </h3>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-700">
        <i className="fa fa-history mr-2"></i>Transaction History
      </h3>

      <div className="space-y-4">
        {transactions.map((tx, index) => {
          let icon, color;
          if (tx.type === "ETH to Lz404") {
            icon = "fa-arrow-down text-blue-600";
            color = "text-blue-600";
          } else {
            icon = "fa-arrow-up text-green-600";
            color = "text-green-600";
          }

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex items-center mb-2 md:mb-0">
                <i className={`fa ${icon} mr-3 text-xl`}></i>
                <div>
                  <p className={`font-medium ${color}`}>{tx.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-medium">
                  {tx.amountIn.toFixed(6)}{" "}
                  {tx.type.includes("ETH") ? "ETH" : "Lz404"}
                </p>
                <p className="text-sm text-gray-500">
                  Received: {tx.amountOut.toFixed(6)}{" "}
                  {tx.type.includes("ETH") ? "Lz404" : "ETH"}
                </p>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 md:mt-0 text-blue-500 hover:underline text-sm"
              >
                View on sepolia Etherscan
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionHistory;
