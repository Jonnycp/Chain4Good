#!/bin/sh

# Avvia il nodo Hardhat in background
npx hardhat node --hostname 0.0.0.0 &

# Aspetta che il nodo sia pronto (porta 8545 attiva)
echo "In attesa del nodo Hardhat..."
until nc -z localhost 8545; do
  sleep 1
done

echo "Nodo pronto! Avvio del deploy dei contratti..."

# Esegue il deploy con Ignition
npx hardhat compile
npx hardhat ignition deploy ./ignition/modules/Chain4Good.ts --network localhost --yes

# Mantiene il container attivo leggendo i log del nodo
wait