interface IPromiseWrapper {
	resolve: any;
	reject: any;
	promise: Promise<any>;
}

export const promiseWrapper = (originalPromise): IPromiseWrapper => {
	let resolve;
	let reject;
	let promise = new Promise((resolveFn, rejectFn) => {
		resolve = resolveFn;
		reject = rejectFn;

		originalPromise
			.then(resolve)
			.catch(reject);
	});

	return {
		resolve,
		reject,
		promise
	};
};
