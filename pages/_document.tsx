import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&types=cities&libraries=places`}
            // https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&language=pt_BR&key=YOUR_API_KEY
          ></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
