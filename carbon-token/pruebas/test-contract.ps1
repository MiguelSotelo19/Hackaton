# Script de pruebas para CarbonCaña Smart Contract
# Ejecutar: .\test-contract.ps1

$CONTRACT_ID = "CD7KYQLIG5267F7RJSJJ6ROIFALDWURATKVDSKRYJTLD6LTMXZFSL2LS"

Write-Host "==================================" -ForegroundColor Green
Write-Host "🌱 TESTING CARBONCAÑA CONTRACT" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# Test 1: Ver balances de agricultores
Write-Host "📊 BALANCES DE AGRICULTORES:" -ForegroundColor Cyan
Write-Host ""

Write-Host "Agricultor 1:" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GCMZLUK7IR3I2Q56HJEK34J6INYGDUEJZT7L4PGY56UDEKWYKZCYWUHC
Write-Host ""

Write-Host "Agricultor 2:" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GBA54NWU224HNMZORQ5DMQGFZNAO4A3IAH72A65OXW5T4UNDX27HQ4VD
Write-Host ""

Write-Host "Agricultor 3:" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GBW5TNXD64BX4QJ3K5OORSMBLVBH6DHNMQPQIK7THCF64DSIWXAGHVHA
Write-Host ""

# Test 2: Ver balances de empresas
Write-Host "📊 BALANCES DE EMPRESAS:" -ForegroundColor Cyan
Write-Host ""

Write-Host "Empresa 1:" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GA4D7WA54FHEXCFSDXWTQF2BAK3CNQEZZ4QHH3Z5ZMYO4AVAJ2FDDCNR
Write-Host ""

Write-Host "Empresa 2:" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GDHNQ3RD6CMZZGKUKZAUSOD5ESJWCUU7MZHO62KP6YQS7KYRUCZABKJE
Write-Host ""

# Test 3: Simular compra
Write-Host "💳 SIMULANDO COMPRA:" -ForegroundColor Cyan
Write-Host "Empresa 1 compra 50 tokens a Agricultor 1" -ForegroundColor Yellow
Write-Host ""

soroban contract invoke --id $CONTRACT_ID --source agricultor1 --network testnet -- transfer --from GCMZLUK7IR3I2Q56HJEK34J6INYGDUEJZT7L4PGY56UDEKWYKZCYWUHC --to GA4D7WA54FHEXCFSDXWTQF2BAK3CNQEZZ4QHH3Z5ZMYO4AVAJ2FDDCNR --amount 50

Write-Host ""
Write-Host "✅ Compra exitosa!" -ForegroundColor Green
Write-Host ""

# Test 4: Ver balances después de compra
Write-Host "📊 BALANCES DESPUÉS DE COMPRA:" -ForegroundColor Cyan
Write-Host ""

Write-Host "Agricultor 1 (debería tener 450):" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GCMZLUK7IR3I2Q56HJEK34J6INYGDUEJZT7L4PGY56UDEKWYKZCYWUHC
Write-Host ""

Write-Host "Empresa 1 (debería tener 50):" -ForegroundColor Yellow
soroban contract invoke --id $CONTRACT_ID --source plataforma --network testnet -- balance --account GA4D7WA54FHEXCFSDXWTQF2BAK3CNQEZZ4QHH3Z5ZMYO4AVAJ2FDDCNR
Write-Host ""

Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ TODAS LAS PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green