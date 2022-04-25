pragma circom 2.0.0;

template add() {
    signal input a;
    signal input b;
    signal input c;
    signal output result;

    signal sum;
    sum <== a + b;

    result <== sum - c;
    result === 0;
}

component main = add();