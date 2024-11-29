const ethers = require("ethers");
const Web3 = require("web3");

const seed = "stuff emerge state amateur steak script fuel upper pumpkin time resource labor";
const mnemonicWallet = ethers.Wallet.fromMnemonic(seed);
const PRIVATEKEY = mnemonicWallet.privateKey;
const myAddress = mnemonicWallet.address;

const Key = "de15d2f43192f331d7678c0ffa1a271308924ae60661f4bcc055a0179588a8d2"; // PRIVATE KEY
const hash32Key = new ethers.Wallet(Key);

async function main() {
  try {
    const url = "https://bsc-dataseed.binance.org";
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    const signer = web3.eth.accounts.privateKeyToAccount(hash32Key.privateKey);
    const iface = new ethers.utils.Interface([
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
      'function release(bytes32)'
    ]);

    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');
    const gasPrice = await web3.eth.getGasPrice(); // Fetch dynamic gas price

    const transaction = {
      'from': myAddress,
      'to': signer.address,
      'gas': 21000,
      'value': ethers.utils.parseUnits('0.008', 'ether'), // Example value
      'gasPrice': gasPrice,
      'nonce': nonce
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATEKEY);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction successful:", receipt);

  } catch (error) {
    console.error("Error occurred:", error);
  }
}

setInterval(main, 5000); // Adjust interval for better performance
