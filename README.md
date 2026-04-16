# Fenwick Tree Project - Modern Management Suite

Welcome! This application is a high-performance **Fenwick Tree (Binary Indexed Tree)** implementation designed for efficient prefix sum calculations and value updates, mirrored with a MongoDB persistence layer.

## 1. Project Folder Structure

The project is organized into modular components to ensure clarity and scalability.

```text
fenwick-tree-project/
├── client/                 # Vanilla JS/HTML/CSS Dashboard
├── config/                 # MongoDB Connection logic
├── controllers/            # API Request handlers (Fenwick, Auth)
├── core/                   # Fenwick Tree Data Structure implementation
├── models/                 # Mongoose schemas (Data, User)
├── routes/                 # Express API routing
├── scripts/                # NEW: Maintenance & Rebuild Shell Scripts
├── server.js               # Main entry point (Express Server)
├── rebuild.js              # Standalone rebuild utility
├── .env                    # Environment variables (PORT, MONGO_URI)
└── package.json            # Scripts & dependencies
```

---

## 2. Advanced Features

### 🚀 MongoDB Aggregation Pipelines
The system uses MongoDB's powerful aggregation framework to:
- **Compute Real-time Prefix Sums**: Directly from the database for verification.
- **Tree Rebuilding**: Aggregate all historical updates to reconstruct the in-memory state after a server restart.

### 🛠️ Maintenance & Recovery Scripts
We have included dedicated shell scripts for system administrators:
- **`scripts/rebuild.sh`**: Bash script for Unix/Mac/WSL environments.
- **`scripts/rebuild.ps1`**: PowerShell script for native Windows environments.

To run the rebuild via NPM:
```bash
npm run rebuild
```

---

## 3. Dashboard Integration
The Professional Dashboard provides:
- **Update Value**: Real-time updates to both memory and database.
- **Prefix Sum**: Instant logarithmic time sum calculations.
- **DB Aggregation Status**: Compare memory state vs. database truth with a built-in variance detector.
- **One-Click Rebuild**: Synchronize the application state directly from the UI.

---

## 4. Getting Started

1.  **Configure Environment**: Update the `.env` file with your `MONGO_URI`.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Launch Server**:
    ```bash
    npm run server
    ```
4.  **Access Dashboard**: Open `client/login.html` or `client/dashboard.html` in your browser.

---

## 5. Verification
You can verify the API is alive by hitting:
`http://127.0.0.1:5050/api/fenwick/all` (Shows current in-memory status)
