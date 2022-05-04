import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@geist-ui/react';

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		const styles = CssBaseline.flush();

		return {
			...initialProps,
			styles: (
				<>
					{initialProps.styles}
					{styles}
				</>
			),
		};
	}

	render() {
		return (
			<Html lang='en'>
				<Head>
					<meta charSet='utf-8' />
					<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
					<meta name='description' content='secure web-wallet for stellar lumens' />	
					<link rel='manifest' href='manifest.json' />
					<link
						href='icons/icon-72x72.png'
						rel='icon'
						type='image/png'
						sizes='72x72'
					/>
					<link
						href='icons/icon-128x128.png'
						rel='icon'
						type='image/png'
						sizes='128x128'
					/>
					<link rel='apple-touch-icon' href='apple-icon.png' />
					<link rel='mask-icon' href='safari-pinned-tab.svg' color='#000000' />
					<meta name='apple-mobile-web-app-title' content='Lumite' />
					<meta name='application-name' content='Lumite' />
					<meta name='msapplication-TileColor' content='#da532c' />
					<meta name='theme-color' content='#000000' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;