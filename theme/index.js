import { extendTheme } from "@chakra-ui/react";

const NAME = "Neonderthaw";
const theme = extendTheme({
    fonts: {
        heading: `${NAME}, cursive`,
        body: `${NAME}, cursive`,
        buttons: `${NAME}, cursive`,
      },
});

export default theme;