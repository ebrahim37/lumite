import useAlerts from './useAlerts';
import { Spacer, Button, Card, Input, useInput } from '@geist-ui/react';

export default ({ submit_cb }) => {
	const [ , error ] = useAlerts();
	const private_key = useInput('');
	
	const handle_submit = async (e) => {
		e.preventDefault();
		if (private_key.state.length !== 56)
			return error('Private key must be 56 characters long.');
		let public_key;
		try {
			public_key = StellarSdk.Keypair.fromSecret(private_key.state).publicKey();
		} catch {
			return error('Invalid account.');
		}
		submit_cb({ public_key, private_key: private_key.state, account: await server.loadAccount(public_key) });
	};
	
	return (
		<Card>
			<form onSubmit={handle_submit}>
				<Input.Password {...private_key.bindings} width='100%' label='Private' />
				<Spacer h={0.5} />
				<Button type='success' width='100%' htmlType='submit' scale={0.8}>
					Login
				</Button>
			</form>
		</Card>
	);
};