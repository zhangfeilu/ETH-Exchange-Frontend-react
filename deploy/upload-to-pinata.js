const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// 替换为你的Pinata API密钥
const pinata = new pinataSDK({
  pinataApiKey: process.env.pinataApiKey || "api_key empty  ",
  pinataSecretApiKey: process.env.pinataSecretApiKey || "secret_api_key empty",
});

// 上传build文件夹
async function uploadToPinata() {
  try {
    const buildPath = path.join(__dirname, "build"); // 指向build文件夹路径
    const options = {
      pinataMetadata: {
        name: "ETH-Exchange", // 自定义名称
      },
    };

    const result = await pinata.pinFromFS(buildPath, options);
    console.log("上传成功！CID:", result.IpfsHash);
    console.log(
      "访问链接:",
      `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    );
  } catch (error) {
    console.error("上传失败:", error);
  }
}

uploadToPinata(); //node upload-to-pinata.js
