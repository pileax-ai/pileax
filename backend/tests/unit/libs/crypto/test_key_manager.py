import uuid

from app.libs.crypto.key_manager import generate_rsa_keypair


def test_generate_rsa_keypair() -> None:
    tenant_id = uuid.uuid4()
    public_key = generate_rsa_keypair(str(tenant_id))
    print(f"public_key. {public_key}")
