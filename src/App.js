import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import ExchangeRate from "./components/ExchangeRate";
import EthToToken from "./components/EthToToken";
import TokenToEth from "./components/TokenToEth";
import Balances from "./components/Balances";
import TransactionHistory from "./components/TransactionHistory";
import Notification from "./components/Notification";

import { contractAddress, abiToken, abiExchange } from "./constants";
// 合约配置 - 请替换为实际部署的合约地址
const EXCHANGE_CONTRACT_ADDRESS = contractAddress;
const EXCHANGE_TOKEN_ABI = abiToken;
const EXCHANGE_CONTRACT_ABI = abiExchange;

function App() {
  // 状态管理
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenReceiveAmount, setTokenReceiveAmount] = useState("");
  const [ethReceiveAmount, setEthReceiveAmount] = useState("");
  const [ethBalance, setEthBalance] = useState("-- ETH");
  const [tokenBalance, setTokenBalance] = useState("-- EXC");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [transactions, setTransactions] = useState([]);

  // 合约实例
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [exchangeContract, setExchangeContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  // 初始化
  useEffect(() => {
    // 检查是否安装了MetaMask
    if (window.ethereum) {
      // 检测是否已连接
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        })
        .catch((error) => console.error("Error checking connection:", error));

      // 监听账户变化
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      });

      // 监听链变化
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } else {
      showNotification("Please install MetaMask to use this dApp", "error");
    }

    // 加载交易历史
    loadTransactionHistory();
  }, []);

  // 计算接收金额的副作用
  useEffect(() => {
    if (!exchangeRate) return;

    const ethAmountNum = parseFloat(ethAmount);
    if (isNaN(ethAmountNum) || ethAmountNum <= 0) {
      setTokenReceiveAmount("");
      return;
    }

    const tokenAmount = ethAmountNum * exchangeRate;
    setTokenReceiveAmount(tokenAmount.toFixed(2));
  }, [ethAmount, exchangeRate]);

  useEffect(() => {
    if (!exchangeRate) return;

    const tokenAmountNum = parseFloat(tokenAmount);
    if (isNaN(tokenAmountNum) || tokenAmountNum <= 0) {
      setEthReceiveAmount("");
      return;
    }

    const ethAmount = tokenAmountNum / exchangeRate;
    setEthReceiveAmount(ethAmount.toFixed(6));
  }, [tokenAmount, exchangeRate]);

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showNotification("Please install MetaMask", "error");
        return;
      }

      // 1. 请求连接钱包，获取账户
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // 2. 初始化 Provider（优先用于视图方法）和 Signer（用于写操作）
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      // 关键：确保 Signer 已“就绪”（等待 MetaMask 确认账户）
      const newSigner = await newProvider.getSigner();

      // 3. 初始化“视图用”合约实例（用 Provider，支持 call 操作）
      const exchangeContractForView = new ethers.Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        newProvider // 视图方法用 Provider，避免 Signer 未就绪问题
      );

      // 4. 调用视图方法（获取代币地址）——此时用 Provider 实例，不会报错
      let newExchangeRate = await exchangeContractForView.getexchangeRate();
      newExchangeRate = Number(newExchangeRate);
      const tokenAddress = await exchangeContractForView.exchangeToken();

      // 5. 初始化“写作用”合约实例（用 Signer，支持转账、授权等操作）
      const newExchangeContract = new ethers.Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        newSigner // 写操作必须用 Signer
      );
      const newTokenContract = new ethers.Contract(
        tokenAddress,
        EXCHANGE_TOKEN_ABI,
        newSigner // 授权操作需要 Signer
      );

      // 6. 更新状态（确保所有实例正确赋值）
      setProvider(newProvider);
      setSigner(newSigner);
      setExchangeContract(newExchangeContract); // 保存写作用实例
      setTokenContract(newTokenContract);
      setExchangeRate(newExchangeRate);
      setWalletAddress(formatAddress(account));
      setIsConnected(true);

      // 7. 更新余额（正常执行）
      updateBalances(newProvider, newSigner, newTokenContract);
      showNotification("Wallet connected successfully", "success");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showNotification("Failed to connect wallet", "error");
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    setEthBalance("-- ETH");
    setTokenBalance("-- EXC");
    setExchangeRate(null);
    showNotification("Wallet disconnected", "info");
  };

  // 更新余额
  const updateBalances = async (provider, signer, tokenContract) => {
    try {
      const address = await signer.getAddress();

      // 获取ETH余额
      const ethBalance = await provider.getBalance(address);
      setEthBalance(`${ethers.formatEther(ethBalance).substring(0, 8)} ETH`);

      // 获取代币余额
      const tokenBalance = await tokenContract.balanceOf(address);
      setTokenBalance(
        `${ethers.formatEther(tokenBalance).substring(0, 8)} EXC`
      );
    } catch (error) {
      console.error("Error updating balances:", error);
    }
  };

  // ETH兑换代币
  const ethToToken = async () => {
    if (!isConnected) return;

    const ethAmountNum = parseFloat(ethAmount);
    if (isNaN(ethAmountNum) || ethAmountNum <= 0) {
      showNotification("Please enter a valid ETH amount", "error");
      return;
    }

    try {
      // 转换为wei
      const ethAmountWei = ethers.parseEther(ethAmountNum.toString());

      // 发送ETH到合约（会触发receive函数）
      const tx = await signer.sendTransaction({
        to: EXCHANGE_CONTRACT_ADDRESS,
        value: ethAmountWei,
      });

      showNotification("Transaction sent, waiting for confirmation...", "info");

      // 等待交易确认
      const receipt = await tx.wait();

      // 更新UI
      updateBalances(provider, signer, tokenContract);
      addTransactionToHistory(
        receipt.hash,
        "ETH to Lz404",
        ethAmountNum,
        ethAmountNum * exchangeRate
      );
      showNotification("Successfully exchanged ETH to EXC", "success");

      // 清空输入
      setEthAmount("");
      setTokenReceiveAmount("");
    } catch (error) {
      console.error("Error exchanging ETH to token:", error);
      showNotification("Failed to exchange ETH to EXC", "error");
    }
  };

  // 代币兑换ETH
  const tokenToEth = async () => {
    if (!isConnected) return;

    const tokenAmountNum = parseFloat(tokenAmount);
    if (isNaN(tokenAmountNum) || tokenAmountNum <= 0) {
      showNotification("Please enter a valid EXC amount", "error");
      return;
    }

    try {
      // 转换为wei
      const tokenAmountWei = ethers.parseEther(tokenAmountNum.toString());

      // 先授权合约使用代币
      showNotification("Approving token spending...", "info");
      const approveTx = await tokenContract.approve(
        EXCHANGE_CONTRACT_ADDRESS,
        tokenAmountWei
      );
      await approveTx.wait();

      // 兑换代币为ETH
      showNotification("Exchanging tokens...", "info");
      const tx = await exchangeContract.exchangeTokenToEth(tokenAmountWei);
      const receipt = await tx.wait();

      // 更新UI
      updateBalances(provider, signer, tokenContract);
      addTransactionToHistory(
        receipt.hash,
        "Lz404 to ETH",
        tokenAmountNum,
        tokenAmountNum / exchangeRate
      );
      showNotification("Successfully exchanged EXC to ETH", "success");

      // 清空输入
      setTokenAmount("");
      setEthReceiveAmount("");
    } catch (error) {
      console.error("Error exchanging token to ETH:", error);
      showNotification("Failed to exchange EXC to ETH", "error");
    }
  };

  // 显示通知
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });

    // 3秒后隐藏
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // 格式化地址显示
  const formatAddress = (address) => {
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 4)
    );
  };

  // 添加交易到历史记录
  const addTransactionToHistory = (txHash, type, amountIn, amountOut) => {
    const newTransaction = {
      txHash,
      type,
      amountIn,
      amountOut,
      timestamp: new Date().toISOString(),
    };

    // 更新状态
    setTransactions((prev) => [newTransaction, ...prev.slice(0, 19)]);

    // 保存到本地存储
    saveTransactionToLocalStorage(newTransaction);
  };

  // 保存交易到本地存储
  const saveTransactionToLocalStorage = (newTransaction) => {
    let transactions = JSON.parse(
      localStorage.getItem("exchangeTransactions") || "[]"
    );

    transactions.unshift(newTransaction);

    // 只保存最近的20条交易
    if (transactions.length > 20) {
      transactions = transactions.slice(0, 20);
    }

    localStorage.setItem("exchangeTransactions", JSON.stringify(transactions));
  };

  // 加载交易历史
  const loadTransactionHistory = () => {
    const transactions = JSON.parse(
      localStorage.getItem("exchangeTransactions") || "[]"
    );
    setTransactions(transactions);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        isConnected={isConnected}
        walletAddress={walletAddress}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />

      <main className="container mx-auto px-4 py-8">
        <ExchangeRate rate={exchangeRate ? exchangeRate : "--"} />

        <div className="grid md:grid-cols-2 gap-8">
          <EthToToken
            ethAmount={ethAmount}
            setEthAmount={setEthAmount}
            tokenReceiveAmount={tokenReceiveAmount}
            ethToToken={ethToToken}
            isConnected={isConnected}
          />

          <TokenToEth
            tokenAmount={tokenAmount}
            setTokenAmount={setTokenAmount}
            ethReceiveAmount={ethReceiveAmount}
            tokenToEth={tokenToEth}
            isConnected={isConnected}
          />
        </div>

        <Balances ethBalance={ethBalance} tokenBalance={tokenBalance} />

        <TransactionHistory transactions={transactions} />
      </main>

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}

export default App;
