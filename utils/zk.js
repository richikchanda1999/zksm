import { groth16 } from 'snarkjs';

function unstringifyBigInts(o) {
  if (typeof o === 'string' && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } if (typeof o === 'string' && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o);
  } if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } if (typeof o === 'object') {
    if (o === null) return null;
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  }
  return o;
}

async function exportCallDataGroth16(input, wasmPath, zkeyPath) {
  const { proof, publicSignals } = await groth16.fullProve(
    input,
    wasmPath,
    zkeyPath,
  );

  const editedPublicSignals = unstringifyBigInts(publicSignals);
  const editedProof = unstringifyBigInts(proof);
  const calldata = await groth16.exportSolidityCallData(
    editedProof,
    editedPublicSignals,
  );

  const argv = calldata
    .replace(/["[\]\s]/g, '')
    .split(',')
    .map((x) => BigInt(x).toString());

  const a = [argv[0], argv[1]];
  const b = [
    [argv[2], argv[3]],
    [argv[4], argv[5]],
  ];
  const c = [argv[6], argv[7]];
  const Input = [];

  for (let i = 8; i < argv.length; i++) {
    Input.push(argv[i]);
  }

  return [a, b, c, Input];
}

export async function addCalldata(a, b, c) {
  const input = {
    a, b, c,
  };

  let dataResult;

  try {
    dataResult = await exportCallDataGroth16(
      input,
      '/zkUtil/add.wasm',
      '/zkUtil/add_0001.zkey',
    );
  } catch (error) {
    return false;
  }

  return dataResult;
}

export async function multiplyCalldata(a, b, c) {
  const input = {
    a, b, c,
  };

  let dataResult;

  try {
    dataResult = await exportCallDataGroth16(
      input,
      '/zkUtil/multiply.wasm',
      '/zkUtil/multiply_0001.zkey',
    );
  } catch (error) {
    return false;
  }

  return dataResult;
}
