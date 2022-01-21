const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { sha256 } = require("ethereum-cryptography/sha256");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { createPrivateKeySync, ecdsaSign } = require("ethereum-cryptography/secp256k1")


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {
  "0x44Ae1DA1b5D6E15f0d8e039207fe503Ab33BA536": 100,
  "0x775d0133FA6eE0B5Ca5eEFf6fD5667Ca57650Ee6": 50,
  "0x032E98D0b16eF88fC467009FBAfD8078dBD1A1c1": 75,
}

const keys = {
  key1: "0xb8e07b69eceeef6e2ba731c02b65945449a393be673353e0dd7c543a22b6b3c8",
  key2: "0x2ad0d612c426720e19c99c3ee691a86fb1e8cf3cc6d30ad1df48e916cbd9a417",
  key3: "0xc0b10960727aad557a00c7804d1c73f184587574f0f51ab247bc774091bcb41f"
}

//Define functions from app.post
//Take argument of Private Key from request body in client.index.js
//Call sha256() hash request with private key
//Compare hash of private key matching to balance pubkey
//If they match, subtract the value from pubkey balances and add to recipient key balances

function getPublicKey(privateKey: Uint8Array, isCompressed?: false): Uint8Array;
function getSharedSecret(privateKeyA: Uint8Array, publicKeyB: Uint8Array): Uint8Array;
function sign(msgHash: Uint8Array, privateKey: Uint8Array, opts?: Options): Promise<Uint8Array>;
function signSync(msgHash: Uint8Array, privateKey: Uint8Array, opts?: Options): Uint8Array;
function verify(signature: Uint8Array, msgHash: Uint8Array, publicKey: Uint8Array): boolean
function recoverPublicKey(msgHash: Uint8Array, signature: Uint8Array, recovery: number): Uint8Array | undefined;
function utils.randomPrivateKey(): Uint8Array;

function hashAmount(amount) {
  sha256(utf8ToBytes(amount));
}

function signRemote(remoteKey){

}

function compareSignature(){
  //Compares signatures from both post and local
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log(balances);
  console.log(keys);
});
