#!/usr/bin/env python3
"""
Generate secure credentials for KOSGE project deployment
Run this script and use the output values in your Netlify environment variables
"""

import bcrypt
import secrets


def generate_password_hash(password: str) -> str:
    """Generate bcrypt hash for password"""
    salt = bcrypt.gensalt(rounds=12)
    hash_bytes = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hash_bytes.decode('utf-8')


# Note: JWT not used - using simple admin authentication instead


def main():
    print("=== KOSGE Secure Credentials Generator ===\n")

    # Get admin password
    admin_password = input("Enter admin password: ")
    if len(admin_password) < 8:
        print("⚠️  Warning: Password should be at least 8 characters long")

    # Generate credentials
    password_hash = generate_password_hash(admin_password)

    print("\n=== Copy these values to Netlify Environment Variables ===\n")
    print(f"ADMIN_USERNAME=administroni")
    print(f"ADMIN_PASSWORD_HASH={password_hash}")
    print(f"GROQ_API_KEY=[Get new key from https://console.groq.com/keys]")

    print("\n=== Security Notes ===")
    print("1. Get a new GROQ API key from: https://console.groq.com/keys")
    print("2. Keep these values secure and never commit them to git")
    print("3. Store them only in Netlify environment variables")
    print("4. Using simple admin auth (no JWT) to avoid premium Netlify features")


if __name__ == "__main__":
    main()
