/**
 * @description Do a http request
 * @author jaenster
 */

(function (module, require) {

	const Socket = require('Socket');
	const Promise = require('Promise');

	const defaultOptions = {
		url: '',
		headers: {
			'User-Agent': 'd2bs',
			'Accept': '*/*',
		},
		port: 80,
		method: 'GET',
		data: '', // Fill with content for post
	};

	const HTTP = function (config = {}) {
		config = Object.assign({}, defaultOptions, config);
		if (!config.url) {
			throw new Error('Must give a url to connect to')
		}
		const [, hostname, url] = config.url.match(/http:\/\/(\w|.)*(\/?.*)?/);
		const socket = new Socket(hostname, config.port);

		socket.connect();
		if (!socket.connected) {
			throw new Error('failed to connect to ' + hostname);
		}

		if (config.data.length) { // in case we send data
			config.headers['Content-Length'] = config.data.length;
		}
		const data = [config.method + ' ' + url];

		Object.keys(config.headers).forEach((key) => data.push(key + ': ' + config.headers[key]));

		socket.send(data.join('\r\n') + '\r\n\r\n' + config.data);

		let recvd = false; // where we store recv'd data
		socket.once('data', data => recvd = data);
		return new Promise((resolve) => recvd && resolve(recvd));
	};

	module.exports = HTTP;

}).call(null, module, require);