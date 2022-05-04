import { GeistProvider, CssBaseline } from '@geist-ui/react';

export default ({ Component, pageProps }) => {
	return (
		<GeistProvider themeType={'dark'}>
			<CssBaseline />
			<Component {...pageProps} />
		</GeistProvider>
	);
};