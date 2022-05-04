export default ({ children, maxWidth }) => {
	return (
		<div style={{'padding': '0 15px'}}>
			<div style={{'max-width': maxWidth, 'margin': '0 auto', 'padding': '50px 0'}}>
				{ children }
			</div>
		</div>
	);
};