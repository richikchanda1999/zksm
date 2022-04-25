#! /bin/sh
circom add.circom --r1cs --wasm --sym --c
node add_js/generate_witness.js add_js/add.wasm input.json witness.wtns

snarkjs powersoftau new bn128 2 pot14_0000.ptau
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution"
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau
snarkjs groth16 setup add.r1cs pot14_final.ptau add_0000.zkey
snarkjs zkey contribute add_0000.zkey add_0001.zkey --name="Key name"
snarkjs zkey export verificationkey add_0001.zkey verification_key.json
snarkjs groth16 prove add_0001.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json -v