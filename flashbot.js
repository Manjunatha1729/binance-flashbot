const { Wallet } = require('ethers'); // Correct import for v6.x
const Web3 = require('web3');
const express = require('express');

// Seed phrase for generating sending wallet
const seed = "stuff emerge state amateur steak script fuel upper pumpkin time resource labor";
let mnemonicWallet = Wallet.fromMnemonic(seed); // Create wallet from mnemonic

// Private key for claim/unstake wallet (ensure its security)
const claimPrivateKey = "de15d2f43192f331d7678c0ffa1a271308924ae60661f4bcc055a0179588a8d2";

async function main() {
  // Multiple Binance Smart Chain (BSC) dataseed options for redundancy
  const bscDataseeds = [
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc.nodereal.io',
  ];

  // Choose a random dataseed for load balancing across providers
  const randomDataseedIndex = Math.floor(Math.random() * bscDataseeds.length);
  const currentDataseed = bscDataseeds[randomDataseedIndex];

  const web3 = new Web3(new Web3.providers.HttpProvider(currentDataseed));

  // Create signer from the claim/unstake wallet's private key
  const signer = web3.eth.accounts.privateKeyToAccount(claimPrivateKey);

  // Define ERC-20 token interface (replace with actual token contract ABI)
  const tokenAbi = [
    'event Approval(address indexed owner, address indexed spender, uint value)',
    'event Transfer(address indexed from, address indexed to, uint value)',
    'function name() external pure returns (string memory)',
    'function symbol() external pure returns (string memory)',
    'function decimals() external view returns (uint8)',
    'function totalSupply() external view returns (uint)',
    'function balanceOf(address owner) external view returns (uint)',
    'function allowance(address owner, address spender) external view returns (uint)',
    'function approve(address spender, uint value) external returns (bool)',
    'function transfer(address to, uint value) external returns (bool)',
    'function DOMAIN_SEPARATOR() external view returns (bytes32)',
    'function PERMIT_TYPEHASH() external pure returns (bytes32)',
    'function nonces(address owner) external view returns (uint)',
    'function release(bytes32 )',
  ];

  const iface = new ethers.utils.Interface(tokenAbi);

  // Get nonces for both sending and claim/unstake addresses
  const sendingNonce = await web3.eth.getTransactionCount(mnemonicWallet.address, 'latest');
  const claimNonce = await web3.eth.getTransactionCount(signer.address, 'latest'); // Starts from 0

  const gasPrice = 1000000000; // Adjust gas price based on current network conditions

  const transaction = {
    from: mnemonicWallet.address,
    to: signer.address,
    gas: 21000, // Adjust gas limit as needed
    value: ethers.utils.parseUnits('300000', "wei"), // Replace with actual amount to transfer
    gasPrice: gasPrice,
    nonce: sendingNonce,
  };

  // Sign the transaction with the private key of the sending wallet
  const signedTx = await web3.eth.accounts.signTransaction(transaction, mnemonicWallet.privateKey);

  console.log("Transaction signed:", signedTx);

  // Send the signed transaction (uncomment if necessary)
  // const txHash = await web3.eth.sendTransaction(signedTx);
  // console.log("Transaction sent:", txHash);
}

const app = express();
const port = 3000;

// Basic HTTP server
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Call main function every 500ms (adjust interval as needed)
setInterval(async () => {
  try {
    await main();
  } catch (
