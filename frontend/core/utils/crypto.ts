/**
 * Crypto
 *
 * @author Xman
 * @version 1.0
 */
import md5 from 'crypto-js/md5';
import sha1 from 'crypto-js/sha1';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';
import { v4 as uuidv4 } from 'uuid';


export const MD5 = (message: string) => {
  return md5(message).toString()
}

export const SHA1 = (message: any) => {
  return sha1(message).toString()
}

export const EncodeBase64 = (wordArray: any) => {
  return Base64.stringify(wordArray);
}


export const HmacSHA1 = (message: string, privateKey: string) => {
  return hmacSHA1(message, privateKey);
}

export const Base64HmacSha1 = (message: string, privateKey: string) => {
  return Base64.stringify(hmacSHA1(message, privateKey));
}

export const UUID = () => {
  // return crypto.randomUUID().replaceAll('-', '');
  return uuidv4().replaceAll('-', '');
}
