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
          <title>TZ Get</title>
          <link rel="icon" type="image/png" href={`${IoIosClock}`}></link>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-NL32CEP9B6"
          ></script>
          <script>
            window.dataLayer = window.dataLayer || []; function gtag()
            {dataLayer.push(arguments)}
            gtag('js', new Date()); gtag('config', 'G-NL32CEP9B6');
          </script>
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
