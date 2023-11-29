export const onEnterRun = (Fn: (e: React.KeyboardEvent) => void) => (e: React.KeyboardEvent) => {
	if (e.keyCode === 13) Fn(e);
};
