'use strict';

module.exports = exports = function (RED) {
	const got = require('got');

	function GotNodeSequenced(config) {
		RED.nodes.createNode(this, config);
		this.name = config.name;
		var node = this;
		
		const timeout = parseInt(config.timeout) || 30 * 1000;	
		const retries = parseInt(config.retries) || 5;
		
		this.on('input', msg => {
			
			// QUEUE MANAGEMENT
			var now = Date.now;
			var context = node.context();

			// if queue doesn't exist, create it
			context.queue = context.queue || [];
			context.run_status = 'Q:'+context.queue.length+'|'
				             +(((context.run_status!=undefined)&&(context.run_status.indexOf('|')>=0))?context.run_status.split('|')[1]:'Waiting')
					       
			node.status({shape: 'dot', text: context.run_status});
			
			
			
			// if the msg is a reset, clear queue
			if (msg.hasOwnProperty("reset")) {
		        context.queue = [];
			context.run_status = "";
			} 
			
			// Add current message to queue
			msg._queuetimestamp = now();
		        context.queue.push(msg); // Add to queue
			
			function process_msg(context,node) {

				// If node status is waiting or error, process next message
				if ((context.run_status.indexOf('Waiting')>=0)&&(context.queue.length>0)) {
					msg = context.queue.shift();
				} else { return; }


				// GOT PROCESS
				node.status({fill: 'yellow', shape: 'dot', text: 'Q:'+context.queue.length+'|'+'Requesting'});
				context.run_status='Q:'+context.queue.length+'|'+'Requesting';
				
				const body = msg.payload;
				const opts = Object.assign({timeout, body, retries}, msg);
				delete opts.url;
				delete opts.payload;
				got(msg.url, opts)
					.then(res => {

						// Clear node status to waiting
						node.status({fill: 'green', shape: 'dot', text: 'Q:'+context.queue.length+'|'+'Waiting'});
						context.run_status='Q:'+context.queue.length+'|'+'Waiting';
						
						node.send(Object.assign({}, msg, {
							headers: res.headers,
							statusCode: res.statusCode,
							statusMessage: res.statusMessage,
							payload: res.body
						}));
					
						// Self call again, for more msg processing
						process_msg(context,node);
					})
					.catch(err => {
						if (err.statusCode) {
							this.status({});
							this.send(Object.assign({}, msg, {
								headers: {},
								statusCode: err.statusCode,
								statusMessage: err.statusMessage,
								payload: err.message
							}));							
						}
						// Update node status
						node.status({fill: 'red', shape: 'dot', text: 'Q:'+context.queue.length+'|Waiting:'+err.message});
						context.run_status='Q:'+context.queue.length+'|Waiting:'+err.message;
						
						
						// Self call again, for more msg processing
						process_msg(context,node);

						node.error(err, msg);
					});
			};
			
			// Run
			process_msg(context,node)
		});	
	}
	RED.nodes.registerType('got-sequenced', GotNodeSequenced);
};
