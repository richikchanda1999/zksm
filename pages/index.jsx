import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";
import { addCalldata } from "../zkUtil/zk";

function Home() {
  const [a, setA] = React.useState(-1);
  const [b, setB] = React.useState(-1);
  const [c, setC] = React.useState(-1);
  const [op, setOp] = React.useState("");

  const [shouldShow, setShouldShow] = React.useState(false);

  const MIN = 1;
  const MAX = 50;
  const generate = async () => {
    const a = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    const b = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    setA(a);
    setB(b);
    setOp("+");
  };

  React.useEffect(() => {
    generate();
  }, []);

  React.useEffect(() => {
    if (a > 0 && b > 0) {
      setShouldShow(true);
    }
  }, [a, b]);

  const submit = async () => {
    console.log(c);
    const data = await addCalldata(a, b, c);
    console.log(data);
  };

return <Flex direction="row" justify="center" align="center">
  {shouldShow && <Text>{a} {op} {b} = </Text>}
  {shouldShow && <Input textAlign="center" ml={2} w="60px" onChange={(v) => {
    try {
      setC(parseInt(v.target.value));
    } catch (err) {}
  }}></Input>}
  {shouldShow && <Button ml={2} onClick={submit}>Check!</Button>}
</Flex>
}

export default Home;