#! /bin/sh
circom multiply.circom --r1cs --wasm --sym --c
node multiply_js/generate_witness.js multiply_js/multiply.wasm input.json witness.wtns

snarkjs powersoftau new bn128 2 pot14_0000.ptau
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution"
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau
snarkjs groth16 setup multiply.r1cs pot14_final.ptau multiply_0000.zkey
snarkjs zkey contribute multiply_0000.zkey multiply_0001.zkey --name="Key name"
snarkjs zkey export verificationkey multiply_0001.zkey verification_key.json
snarkjs groth16 prove multiply_0001.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json -v