import { ChakraProvider, theme } from "@chakra-ui/react";
import App from "next/app";
import { useEffect } from "react";
import ReactGA from "react-ga";

class MyApp extends App {
  async componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("UA-203142465-1");
      this.logPageView();
    }
  }

  componentDidUpdate() {
    this.logPageView();
  }

  logPageView() {
    const { router } = this.props;

    if (process.env.NODE_ENV === "production") {
      ReactGA.pageview(router.asPath);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    );
  }
}

export default MyApp;
