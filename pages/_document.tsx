import Document, { Html, Head, Main, NextScript } from "next/document";
import { IoIosClock } from "react-icons/io";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>TZ Cities</title>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
