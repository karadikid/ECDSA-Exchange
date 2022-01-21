const { sha256 } = require("ethereum-cryptography/sha256");
const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, concatBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");


function signingOperation(senderPrivKey, amount){
    senderKeyArray = utf8ToBytes(senderPrivKey);
    msgHash = sha256(utf8ToBytes(amount));
    signature = secp.sign(senderPrivKey, msgHash);
    return msgHash, signature;

}

module.exports = {
    signingOperation,
  };



