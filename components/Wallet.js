import React from 'react';
import useAlerts from './useAlerts';
import { RefreshCw, Clipboard, Loader } from '@geist-ui/react-icons';
import { Text, Spacer, Button, Card, Input, useInput, useClipboard, Grid, Badge, Tabs } from '@geist-ui/react';

const native_balance = (account) => account.balances.find(x => x.asset_type === 'native').balance;

export default (props) => {
	const { public_key, private_key } = props;
	const [ account, setAccount ] = React.useState(props.account);
	const destination = useInput('');
	const fee = useInput('100');
	const amount = useInput('');
	const memo = useInput('');
	const [ loading, setLoading ] = React.useState(false);
	const [ refreshLoading, setRefreshLoading ] = React.useState(false);
	const [ success, error ] = useAlerts();
	const { copy } = useClipboard();
	
	const balance = native_balance(account);
	const refresh_account = async () => setAccount(await server.loadAccount(public_key));
	
	const refresh_handler = async () => {
		setRefreshLoading(true);
		await refresh_account();
		success('Refreshed.');
		setRefreshLoading(false);
	};
	
	React.useEffect(() => {
		return server.payments().cursor('now').forAccount(public_key).stream({ onmessage: refresh_account });
	}, []);
	
	const portion = (x) => {
		const available_balance = (balance - 1) - (+fee.state / 1e7);
		amount.setState((available_balance * x).toFixed(7));
	};
	
	const send = async () => {
		if (destination.state.length !== 56 || destination.state[0] !== 'G')
			return error('Invalid destination.');
		if (+fee.state < 100)
			return error('Minimum fee is 100 stroops.');
		if (memo.state !== '' && memo.state.length > 28)
			return error('Memo too long! Max 28 characters.');
		if (+amount.state <= 0)
			return error('Amount must be positive.');
		//precision breaks when balance is more than ~900719925 XLM
		if ((+fee.state + +amount.state * 1e7 > (account * 1e7) - 1e7) && account < Number.MAX_SAFE_INTEGER / 1e7)
			return error('Account balance can\'t go below one XLM.');
		const transaction = new StellarSdk.TransactionBuilder(await server.loadAccount(public_key), {
			fee: +fee.state,
			networkPassphrase: StellarSdk.Networks.PUBLIC
		}).addOperation(StellarSdk.Operation.payment({
			asset: StellarSdk.Asset.native(),
			destination: destination.state,
			amount: amount.state,
		})).addMemo(
			memo.state === '' ? StellarSdk.Memo.none() : StellarSdk.Memo.text(memo.state)
		).setTimeout(30).build();
		transaction.sign(StellarSdk.Keypair.fromSecret(private_key));
		try {
			await server.submitTransaction(transaction);
		} catch (e) {
			console.log(e);
			return error('Transaction failed.');
		}
		success('Transaction successful.');
		await refresh_account();
	};
	
	const send_wrapped = async () => {
		setLoading(true);
		await send();
		setLoading(false);
	};
	
	return (
		<Card>
			<Grid.Container gap={2} justify='center'>
				<Grid xs={24}>
					<div style={{'margin': '0 auto'}}>
						<Badge.Anchor style={{'margin': '0 auto'}}>
							<Badge>XLM</Badge>
							<Card>
								<Text span style={{'color': '#118C4F'}} font='25px' mt={0} mb={0}>
									{balance}
								</Text>
								<Spacer inline w={0.5} />
								<Button iconRight={refreshLoading ? <Loader /> : <RefreshCw />} onclick={refresh_handler} auto scale={2/3} px={0.6} />
							</Card>
						</Badge.Anchor>
					</div>
				</Grid>
			</Grid.Container>
			<Tabs initialValue='1'>
				<Tabs.Item label='send' value='1'>
					<Grid.Container gap={0.5}>
						<Grid xs={24}>
							<Input {...destination.bindings} label='Destination' width='100%' />
						</Grid>
						<Grid xs={24} sm={8}>
							<Input {...fee.bindings} htmlType='number' label='Fee (stroops)' width='100%' />
						</Grid>
						<Grid xs={24} sm={16}>
							<div style={{'flex': '1'}}>
								<Input {...amount.bindings} htmlType='number' label='Amount' width='100%' />
							</div>
							<Spacer inline w={0.25} />
							<Button auto onClick={() => portion(1)} scale={0.8}>
								All
							</Button>
						</Grid>
						<Grid xs={24}>
							<Input {...memo.bindings} label='Memo Text' width='100%' placeholder='optional' />
						</Grid>
						<Grid xs={24}>
							<Button loading={loading} type='success' onClick={send_wrapped} width='100%' scale={0.8}>
								Send
							</Button>
						</Grid>
					</Grid.Container>
				</Tabs.Item>
				<Tabs.Item label='receive' value='2'>
					<div style={{'display': 'flex'}}>
						<div style={{'flex': '1'}}>
							<Input value={public_key} disabled label='Address' width='100%' />
						</div>
						<Spacer inline w={0.25} />
						<Button iconRight={<Clipboard />} onclick={() => { copy(public_key); success('Copied.'); }} auto scale={0.8} px={0.6} />
					</div>
				</Tabs.Item>
			</Tabs>
		</Card>
	);
};
