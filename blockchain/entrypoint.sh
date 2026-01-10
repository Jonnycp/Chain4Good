#!/bin/sh

# Avvia il nodo Hardhat in background
npm start &

# Aspetta che il nodo sia pronto (porta 8545 attiva)
echo "In attesa del nodo Hardhat..."
while ! nc -z localhost 8545; do
  sleep 1
done

echo "Nodo pronto! Avvio del deploy dei contratti..."

# Esegue il deploy con Ignition
rm -rf /app/cache/*
rm -rf /app/artifacts/*
npx hardhat ignition deploy ./ignition/modules/Chain4Good.ts --network localhost

# Mantiene il container attivo leggendo i log del nodo
wait