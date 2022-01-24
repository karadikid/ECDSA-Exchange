const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { sha256 } = require("ethereum-cryptography/sha256");
const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, concatBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const {signingOperation} = require("./libs/operations");


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const keyArray1 = secp.utils.randomPrivateKey();
const keyArray2 = secp.utils.randomPrivateKey();
const keyArray3 = secp.utils.randomPrivateKey();

const pubkeyArray1 = secp.getPublicKey(keyArray1);
const pubkeyArray2 = secp.getPublicKey(keyArray2);
const pubkeyArray3 = secp.getPublicKey(keyArray3);

const key1 = toHex(keyArray1);
const key2 = toHex(keyArray2);
const key3 = toHex(keyArray3);

const pubkey1 = toHex(pubkeyArray1);
const pubkey2 = toHex(pubkeyArray2);
const pubkey3 = toHex(pubkeyArray3);

//const senderPrivKey = '';
//const senderPubkey = '';

const balances = {}

balances[pubkey1] = 100;
balances[pubkey2] = 50;
balances[pubkey3] = 75;

console.log(balances);

const keys = {
  key1,
  key2,
  key3
}

console.log(keys);



//Define functions from app.post
//Take argument of Private Key from request body in client.index.js
//Call sha256() hash request with private key (utf8ToBytes)
//Compare hash of private key matching to balance pubkey
//If they match, subtract the value from pubkey balances and add to recipient key balances

//function getPublicKey(privateKey: Uint8Array, isCompressed?: false): Uint8Array{};

//function getSharedSecret(privateKeyA: Uint8Array, publicKeyB: Uint8Array): Uint8Array{};
//function sign(msgHash: Uint8Array, privateKey: Uint8Array, opts?: Options): Promise<Uint8Array>{};
//function verify(signature: Uint8Array, msgHash: Uint8Array, publicKey: Uint8Array): boolean{};function verify(signature, msgHash, publicKey){};
//function recoverPublicKey(msgHash: Uint8Array, signature: Uint8Array, recovery: number): Uint8Array | undefined{};
//function utils.randomPrivateKey(): Uint8Array;
// with strings
//const { utf8ToBytes } = require("ethereum-cryptography/utils");
//sha256(utf8ToBytes("abc"))


/*
(async () => {
  // You pass either a hex string, or Uint8Array
  const privateKey = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
  const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
  const publicKey = secp.getPublicKey(privateKey);
  const signature = await secp.sign(messageHash, privateKey);
  const isSigned = secp.verify(signature, messageHash, publicKey);
})();
*/

/*
Sign message upon button.onClick();
1. scep.sign(msgHash, privateKey,)
*/

/*
Verify operation on server end 
1. Receive signed hash with message and publicKey.
2. Run function scep.verify(signature, msgHash, publicKey)
3. If 2. true, commit transaction.
4. If false, return error to page.
*/

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const {sender, recipient, amount} = req.body;
  let privateKey = hexToBytes(sender);
  let signingResults = await signingOperation(sender, amount);
  let publicKeyDerived = toHex(secp.getPublicKey(privateKey));
  let publicKey = await hexToBytes(pubkey1);
  // get index of balances object for publickey pos = myArray.map(function(e) { return e.hello; }).indexOf('stevie');
  /*
  if(balances[publicKey]){
    //Perform verification  
    let verifiedResults = secp.verify(signature)
    }
*/
    //Hash is different** 20220122 - 0415
  console.log("signingResults-Signature", signingResults[0]);
  let signature = await secp.sign(sha256(utf8ToBytes(amount)), privateKey);
  console.log("Server-Signature:", signature, publicKeyDerived);
  let verifiedResults = secp.verify(signingResults[0], signingResults[1], publicKey )
  //console.log(verifiedResults);
  //balances[sender] -= amount;
  //balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(balances);
  console.log(keys);
});
