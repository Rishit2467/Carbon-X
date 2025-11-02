# Carbon-X Contract Deployment Script
# This script builds and deploys the Carbon-X contract to Stellar Soroban

Write-Host "🌳 Carbon-X Contract Deployment" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Step 1: Build the contract
Write-Host "📦 Building contract..." -ForegroundColor Cyan
cargo build --target wasm32-unknown-unknown --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Optimize the WASM (optional but recommended)
Write-Host "🔧 Optimizing WASM..." -ForegroundColor Cyan
$wasmFile = "target\wasm32-unknown-unknown\release\carbon_x_.wasm"

if (Test-Path $wasmFile) {
    Write-Host "✅ WASM file found: $wasmFile" -ForegroundColor Green
} else {
    Write-Host "❌ WASM file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Deploy to network
Write-Host "🚀 Deploying contract..." -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy to Stellar Testnet, run:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  soroban contract deploy ``" -ForegroundColor White
Write-Host "    --wasm $wasmFile ``" -ForegroundColor White
Write-Host "    --network testnet ``" -ForegroundColor White
Write-Host "    --source <YOUR_SECRET_KEY>" -ForegroundColor White
Write-Host ""
Write-Host "Or to deploy to Stellar Futurenet:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  soroban contract deploy ``" -ForegroundColor White
Write-Host "    --wasm $wasmFile ``" -ForegroundColor White
Write-Host "    --network futurenet ``" -ForegroundColor White
Write-Host "    --source <YOUR_SECRET_KEY>" -ForegroundColor White
Write-Host ""

# Step 4: Generate bindings (optional)
Write-Host "📄 To generate contract bindings:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  soroban contract bindings typescript ``" -ForegroundColor White
Write-Host "    --wasm $wasmFile ``" -ForegroundColor White
Write-Host "    --output-dir ./bindings" -ForegroundColor White
Write-Host ""

Write-Host "✨ Build complete! Contract ready for deployment." -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Set up your Soroban identity: soroban keys generate <NAME>" -ForegroundColor White
Write-Host "  2. Configure network: soroban network add testnet ..." -ForegroundColor White
Write-Host "  3. Fund your account on testnet" -ForegroundColor White
Write-Host "  4. Deploy using the command above" -ForegroundColor White
Write-Host "  5. Initialize the contract with an admin address" -ForegroundColor White
Write-Host ""
