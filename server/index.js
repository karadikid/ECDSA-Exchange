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

//function getPublicKey(privateKey: Uint8Array, isCompressed?: false): Uint8Array{};
//function getSharedSecret(privateKeyA: Uint8Array, publicKeyB: Uint8Array): Uint8Array{};
//function sign(msgHash: Uint8Array, privateKey: Uint8Array, opts?: Options): Promise<Uint8Array>{};
//function verify(signature: Uint8Array, msgHash: Uint8Array, publicKey: Uint8Array): boolean{};function verify(signature, msgHash, publicKey){};
//function recoverPublicKey(msgHash: Uint8Array, signature: Uint8Array, recovery: number): Uint8Array | undefined{};
//function utils.randomPrivateKey(): Uint8Array;
// with strings
//const { utf8ToBytes } = require("ethereum-cryptography/utils");
//sha256(utf8ToBytes("abc"))

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const {senderPubkey, sender, recipient, amount} = req.body;
  let privateKey = hexToBytes(sender); //Have to use Uint8Array to derive
  let signingResults = await signingOperation(sender, amount);
  let publicKeyDerived = secp.getPublicKey(privateKey);
  let verifiedResults;

  let amountMessageHash = sha256(utf8ToBytes(amount));
  let signature = await secp.sign(sha256(utf8ToBytes(amount)), sender);
  verifiedResults = secp.verify(signingResults[0], signingResults[1], senderPubkey);
  console.log(verifiedResults);
  if(verifiedResults){
  balances[senderPubkey] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  console.log({balance: balances[senderPubkey]});
  res.send({ balance: balances[senderPubkey] }); }
  else {
    res.send({ balance: "Invalid Transaction "});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(balances);
  console.log(keys);
});
