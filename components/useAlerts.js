import { useToasts } from '@geist-ui/react';

export default () => {
	const [, setToast] = useToasts();
	const success = (text) => setToast({ text, type: 'success' });
	const error = (text) => setToast({ text, type: 'error' });
	return [ success, error ];
};