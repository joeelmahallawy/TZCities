import { ChakraProvider, theme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { useEffect } from "react";
import ReactGA from "react-ga";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const logPageView = () => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.pageview(pageProps.router.asPath);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("UA-203142465-1");
      logPageView();
    }
  }, []);

  useEffect(() => {
    logPageView();
  }, [pageProps, Component]);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
