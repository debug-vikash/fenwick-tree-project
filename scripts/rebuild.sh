#!/bin/bash
echo "Triggering Fenwick Tree Rebuild via API..."
curl -X POST http://127.0.0.1:5050/api/fenwick/rebuild -H "Content-Type: application/json"
echo ""
echo "Process completed."
