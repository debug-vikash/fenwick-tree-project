Write-Host "Triggering Fenwick Tree Rebuild via API..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:5050/api/fenwick/rebuild" -Method Post -ContentType "application/json"
    Write-Host "Success: $($response.message)" -ForegroundColor Green
    Write-Host "Unique Indices: $($response.count)" -ForegroundColor Green
} catch {
    Write-Host "Failed to trigger rebuild. Ensure server is running on port 5050." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "Process completed."
