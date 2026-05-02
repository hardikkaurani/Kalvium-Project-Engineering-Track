# Security Audit: Password Storage Investigation

## 1. What I Found
During the audit of the authentication flow, I identified that user passwords are being stored in **plain text** within the MongoDB database. 

**Example from Database:**
```json
{
  "_id": "60d5f9b2b0b3c2a1c8d5e6f7",
  "email": "user@example.com",
  "password": "password123", 
  "createdAt": "2024-05-01T10:00:00Z"
}
```
The password "password123" is visible in its original form, which is a critical security vulnerability.

## 2. Root Cause
The vulnerability stems from two primary locations in the codebase:

1. **Signup Controller (`controllers/authController.js`)**: The `signup` function receives the password from `req.body` and passes it directly to `User.create()` without any hashing or encryption.
2. **Login Controller (`controllers/authController.js`)**: The `login` function performs a direct string comparison (`user.password !== password`) to verify credentials.
3. **User Model (`models/User.js`)**: The schema lacks a pre-save hook or any logic to handle sensitive data masking.

## 3. Why This Is Dangerous
Storing passwords in plain text is one of the most severe security failures possible in a backend system:

- **Data Breach Exposure**: If the database is compromised (via SQL injection, misconfiguration, or insider threat), every user's password is immediately available to the attacker.
- **Credential Stuffing**: Attackers use leaked plain-text passwords to gain access to the same users' accounts on other platforms (email, banking, social media), as users frequently reuse passwords.
- **Compliance Failure**: This violates almost all security standards and regulations (GDPR, SOC2, PCI-DSS).
