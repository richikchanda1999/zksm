pragma circom 2.0.0;

template multiply() {
    signal input a;
    signal input b;
    signal input c;
    signal output result;

    signal product;
    product <== a * b;

    result <== product - c;
    result === 0;
}

component main = multiply();