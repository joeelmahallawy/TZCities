import { layout } from "@chakra-ui/react";
import title from "next/head";
import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
// import { IoIosClock } from "react-icons/io";
// import config from "../config/configs";
// import apple from "/icons/favicon.ico";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* <title> */}
          {/* <link
            rel="icon"


            href={apple.src}
            type="image/png"
          /> */}

          <link
            rel="icon"
            sizes="16x16"
            href="/icons/favicon.ico"
            // type="image/x-icon"
          />
          <meta name="viewport" content="width=device-width" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
