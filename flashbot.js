const { Wallet } = require('ethers'); // Correct import for v6.x
const Web3 = require('web3');
const express = require('express');

// Wallet that sends BNB to claim 
var seed = "stuff emerge state amateur steak script fuel upper pumpkin time resource labor";
let mnemonicWallet = Wallet.fromMnemonic(seed); // Create wallet from mnemonic
var PRIVATEKEY = mnemonicWallet.privateKey;
var myAddress = mnemonicWallet.address;

// Wallet for claim reward or unstake
var Key = "de15d2f43192f331d7678c0ffa1a271308924ae60661f4bcc055a0179588a8d2"; // PRIVATE KEY
var hash32Key = Wallet.fromPrivateKey(Key);

async function main() {
  var url1 = 'https://bsc-dataseed.binance.org';
  var url2 = 'https://bsc-dataseed1.defibit.io';
  var url3 = 'https://bsc-dataseed1.ninicoin.io';
  var url5 = "https://bsc.nodereal.io";

  const web3 = new Web3(
    new Web3.providers.HttpProvider(url5)
  );

  const signer = web3.eth.accounts.privateKeyToAccount(
    hash32Key.privateKey
  );

  let iface = new ethers.utils.Interface([
    'event Approval(address indexed owner, address indexed spender, uint value)',
    'event Transfer(address indexed from, address indexed to, uint value)',
    'function name() external pure returns (string memory)',
    'function symbol() external pure returns (string memory)',
    'function decimals() external pure returns (uint8)',
    'function totalSupply() external view returns (uint)',
    'function balanceOf(address owner) external view returns (uint)',
    'function allowance(address owner, address spender) external view returns (uint)',
    'function approve(address spender, uint value) external returns (bool)',
    'function transfer(address to, uint value) external returns (bool)',
    'function DOMAIN_SEPARATOR() external view returns (bytes32)',
    'function PERMIT_TYPEHASH() external pure returns (bytes32)',
    'function nonces(address owner) external view returns (uint)',
    'function release(bytes32 )'
  ]);

  var noncesend = await web3.eth.getTransactionCount(myAddress, 'latest');
  var nonce = await web3.eth.getTransactionCount(signer.address, 'latest'); // nonce starts counting from 0
  const gasPrice = 1000000000;

  const transaction = {
    from: myAddress,
    to: signer.address,
    gas: 21000,
    value: ethers.utils.parseUnits('300000', "wei"),
    gasPrice: gasPrice,
    nonce: noncesend
  };

  // Example of signing the transaction
  const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATEKEY);

  console.log("Transaction signed:", signedTx);
}

const app = express();
const port = 3000;

// Basic HTTP server
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Main function call every 500ms
setInterval(() => {
  main().catch(console.error);
}, 500);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
