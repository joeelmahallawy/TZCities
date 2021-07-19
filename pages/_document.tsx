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
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCv1J8JeB52Jb5dZYt6LUkkYPkUaV4ySNg&libraries=places"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
