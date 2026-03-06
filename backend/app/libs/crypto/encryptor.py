import base64
from typing import Union

from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA


def encrypt(content: str, public_key: str) -> str:
    """
    Encrypt content using RSA-OAEP with SHA-256.
    :param content: Plain text to encrypt
    :param public_key: RSA Public Key in PEM format
    :return: Base64 encoded encrypted string
    """
    try:
        # Import key and initialize cipher with SHA-256 (modern standard)
        rsa_key = RSA.import_key(public_key)
        # Using SHA-256 is more secure than the default SHA-1
        cipher = PKCS1_OAEP.new(rsa_key, hashAlgo=SHA256)
        encrypted = cipher.encrypt(content.encode("utf-8"))

        return base64.b64encode(encrypted).decode("utf-8")
    except (ValueError, TypeError) as e:
        # Handle invalid keys or encryption failures
        raise ValueError(f"Encryption failed: {str(e)}")


def decrypt(ciphertext: str, private_key: Union[str, bytes, RSA.RsaKey]) -> str:
    """
    Decrypt content using RSA-OAEP.
    :param ciphertext: Base64 encoded encrypted string
    :param private_key: RSA Private Key (PEM string, bytes, or RSA object)
    :return: Decrypted plain text
    """
    try:
        # Check if private_key is already an RSA object (e.g., from lru_cache)
        rsa_key = private_key
        if not isinstance(private_key, RSA.RsaKey):
            rsa_key = RSA.import_key(private_key)

        cipher = PKCS1_OAEP.new(rsa_key, hashAlgo=SHA256)

        # Decode base64 and decrypt
        decoded_data = base64.b64decode(ciphertext)
        decrypted_data = cipher.decrypt(decoded_data)

        return decrypted_data.decode("utf-8")
    except (ValueError, TypeError) as e:
        # Handle decryption failures (e.g., wrong key, corrupted data)
        raise ValueError(f"Decryption failed: {str(e)}")
