from functools import lru_cache
from pathlib import Path

from Crypto.PublicKey import RSA

from app.libs.file_utils import get_storage_dir


def generate_rsa_keypair(tenant_id: str) -> str:
    """
    Generate RSA key pair and persist the private key.
    :param tenant_id: Unique identifier for the tenant
    :return: Exported Public Key (PEM string)
    public_key -> Store in DB
    private_key -> store in FS
    """

    private_key_path = Path(get_storage_dir("privkeys", tenant_id))
    private_key_file = private_key_path / "private.pem"

    # Check if the private key already exists
    if private_key_file.exists():
        try:
            key_data = private_key_file.read_bytes()
            key = RSA.import_key(key_data)
            return key.publickey().export_key().decode("utf-8")
        except ValueError as e:
            raise ValueError(f"Failed to import RSA key for tenant {tenant_id}: {str(e)}")

    # Make sure the path exist
    private_key_path.mkdir(parents=True, exist_ok=True)

    # Use 2048 or 4096 bits for security
    key = RSA.generate(2048)
    # Keypair
    private_key = key.export_key()
    public_key = key.publickey().export_key()

    # Save to file
    Path(private_key_file).write_bytes(private_key)

    return public_key.decode("utf-8")


def load_private_key(tenant_id: str):
    """
    Load and cache the RSA private key object
    """
    private_key_path = Path(get_storage_dir("privkeys", tenant_id))
    private_key_file = private_key_path / "private.pem"

    if not private_key_file.exists():
        raise FileNotFoundError(f"Private key for tenant {tenant_id} not found.")

    try:
        key_data = private_key_file.read_bytes()
        return RSA.import_key(key_data)
    except ValueError as e:
        raise ValueError(f"Failed to import RSA key for tenant {tenant_id}: {str(e)}")


@lru_cache(maxsize=100)
def load_private_key_cached(tenant_id: str):
    return load_private_key(tenant_id)
