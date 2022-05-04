import Head from 'next/head';
import Script from 'next/script';
import React from 'react';
import Login from '../components/Login';
import Wallet from '../components/Wallet';
import Page from '../components/Page';

export default () => {
	const [ state, setState ] = React.useState(null);
	const [ loaded, setLoaded ] = React.useState(false);

	const onLoad = () => {
		window.server = new StellarSdk.Server('https://horizon.stellar.org');
		setLoaded(true);
	};

	return (
		<>
			<Head>
				<title>Lumite Wallet</title>
				<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
			</Head>
			<Script src='/lumite/stellar-sdk.min.js' onLoad={onLoad} />
			{!loaded ? null :
				<Page maxWidth={state ? '700px' : '300px'}>
					<b>Lumite</b>
					{state ? <Wallet {...state} /> : <Login submit_cb={setState} />}
				</Page>
			}
		</>
	);
};