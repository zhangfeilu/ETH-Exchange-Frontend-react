import React from "react";

function Navbar({
  isConnected,
  walletAddress,
  connectWallet,
  disconnectWallet,
}) {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ETH-ERC20 Exchange</h1>
        <div className="flex items-center space-x-4">
          <button
            id="connectWallet"
            className={`px-4 py-2 rounded-md hover:bg-gray-200 transition ${
              isConnected ? "bg-green-600" : "bg-white text-blue-600"
            }`}
            onClick={isConnected ? disconnectWallet : connectWallet}
          >
            {isConnected ? (
              <i className="fa fa-check mr-2">Connected</i>
            ) : (
              <i className="fa fa-wallet mr-2">Connect Wallet</i>
            )}
          </button>
          <span
            id="walletAddress"
            className={`truncate max-w-xs ${
              isConnected ? "" : "hidden md:inline-block"
            }`}
          >
            {walletAddress}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
