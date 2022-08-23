import React, { useEffect, useReducer, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';

const client = io("ws://localhost:1000/");
const actions = ['ban'];

const Messenger = () => {

	const [myid, setMyid] = useState('');
	const [myname, setMyName] = useState('');
	const [joined, setJoin] = useState(false);
	const [errored, setError] = useState(false);
	const [msg, setMsg] = useState('');
	const scrollHandler = useRef();
	const inputHandler = useRef();

	const [banlist, ban] = useReducer((oldList, upcoming) => {

		const newList = { ...oldList };
		newList[upcoming.data] ||= 0;

		if( upcoming.type === 'unban' ) {
			newList[upcoming.data] = 0;
		} else {
			newList[upcoming.data] = Date.now() + (30 * 1000);
		}

		return newList;
	}, {});

	const executeAction = action => {
		console.log(action);
		if( action.type === 'ban' || action.type === 'unban' ) {
			ban(action);
		}
	}

	const notBanned = upcoming => {
		if( banlist[upcoming.from] > Date.now() ) {
			return false;
		}
		return true;
	}

	const [messeges, updMessage] = useReducer((state, upcoming) => {
		const newData = [...state];
		if( actions.includes(upcoming.type) ) {
			let test = upcoming.data.split('|');
			if( test.length > 1 ) {
				upcoming = {
					...upcoming,
					data: test.splice(0, 1).toString(),
					options: test
				}
			}
			executeAction(upcoming);
		}
		if( upcoming.type === 'message' && !notBanned(upcoming) ) {
			return newData;
		}
		newData.push(upcoming);
		return newData;
	}, []);

	useEffect(() => {
		
		client.on('connect', () => {
			console.log('Client Connected!');
			setError(false);
		});
		
		client.on('connect_error', (error) => {
			console.error('Connection Error!', error);
			setError(true);
		});
		
		client.on('disconnect', (reason) => {
			console.warn('Client Disconnected!', reason);
		});
	
		client.on('broadcast', data => {
			updMessage(data);
			setTimeout(() => {
				scrollHandler?.current?.scrollIntoView?.();
				inputHandler?.current?.focus?.();
			});
		});

		return () => {
			client.off('connect');
			client.off('disconnect');
			client.off('broadcast');
		}

	}, []);

	const joinChat = e => {

		e.preventDefault();

		client?.emit?.('message', {
			id: uuid(),
			from: myid,
			name: myname,
			time: Date.now(),
			type: 'online',
			data: ''
		});

		setJoin(true);

		return false;

	};

	const sendMsg = e => {

		e.preventDefault();

		if( msg.trim() === '' ) {
			return false;
		}

		if( !notBanned({from: myid}) ) {
			alert('You are still banned!!');
			return false;
		}

		let test = msg.split(':');

		if( test.length === 2 && actions.includes(test[0]) ) {
			client?.emit?.('message', {
				id: uuid(),
				from: myid,
				name: myname,
				time: Date.now(),
				type: test[0],
				data: test[1]
			});
		} else {
			client?.emit?.('message', {
				id: uuid(),
				from: myid,
				name: myname,
				time: Date.now(),
				type: 'message',
				data: msg
			});
		}

		setMsg('');

		return false;

	};
	
	const setID = name => {
		setMyName(name);
		setMyid(name.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'-'));
	}
	
	const logout = () => {
		if( window.confirm('Do you want to logout?') ) {

			client?.emit?.('message', {
				id: uuid(),
				from: myid,
				name: myname,
				time: Date.now(),
				type: 'offline',
				data: ''
			});

			setMyName('');
			setMyid('');
			setMsg('');
			setJoin(false);
		}
	}

	return(
		<div className="max-w-sm w-full mx-auto shadow-2xl rounded">
		{ joined && <>
			<div className="bg-indigo-700 rounded-t px-4 py-2 text-white text-center relative">
				{myname}
				<div onClick={logout} className="absolute bg-red-500 hover:bg-red-400 transition-all text-white top-2 right-2 h-6 w-6 rounded-full cursor-pointer">&times;</div>
			</div>
			{ <div className="flex flex-col gap-4 border p-4 h-96 overflow-y-auto">
				{ messeges.map( m => {
					switch( m.type ) {
						case 'message':
							let time = <div className="text-xs font-normal">{ new Date(m.time).toLocaleTimeString() }</div>;
							return (
								<div key={m.time} className={ 'bg-slate-100 px-4 py-2 rounded w-3/4 shadow ' + (m.from === myid ? 'bg-green-600 text-white self-end text-right' : '') }>
									<div className="font-bold text-sm flex items-center">{ m.from === myid && time }<div className="flex-1">{ m.name }</div>{ m.from !== myid && time }</div>
									<div className="mt-2">{ m.data }</div>
								</div>
							);
						case 'offline': 
							return (
								<div key={m.time} className="text-xs text-center text-slate-500">
									<span className="font-bold text-black">{ m.from === myid ? 'You' : m.name }</span> <span className="text-red-500">left</span> the chat on { new Date(m.time).toLocaleString() }
								</div>
							);
						case 'online': 
							return (
								<div key={m.time} className="text-xs text-center text-slate-500">
									<span className="font-bold text-black">{ m.from === myid ? 'You' : m.name }</span> <span className="text-indigo-700">joined</span> the chat on { new Date(m.time).toLocaleString() }
								</div>
							);
						case 'ban': 
							return (
								<div key={m.time} className="text-xs text-center text-slate-500">
									<span className="font-bold text-black">{ m.from === myid ? 'You' : m.name }</span> <span className="text-red-700">banned</span> <span className="underline">{ m.data === myid ? 'You' : m.data }</span>{ m.options?.length ? ' for ' + m.options[0] : '' } on { new Date(m.time).toLocaleString() }
								</div>
							);
						default:
							return null;
					}
				} ) }
				<div ref={scrollHandler}></div>
			</div> }
			<form onSubmit={sendMsg} className="flex bg-gray-50 p-3 border border-t-0 rounded-b">
				<input ref={inputHandler} className="border flex-1 h-9 p-4 outline-none rounded-l" type="text" value={msg} onChange={e => setMsg(e.target.value)} />
				<button className="px-4 bg-slate-800 text-white rounded-r text-sm hover:bg-blue-700 transition-all" type="submit">Send</button>
			</form>
			</> }
			{ !joined && !errored && <>
			<div className="bg-indigo-700 rounded-t px-4 py-2 text-white text-center relative">
				Enter your name
			</div>
			<form onSubmit={joinChat} className="flex bg-gray-50 p-3 border border-t-0 rounded-b">
				<input className="border flex-1 h-9 p-4 outline-none rounded-l" type="text" value={myname} onChange={e => setID(e.target.value)} />
				<button className="px-4 bg-slate-800 text-white rounded-r text-sm hover:bg-blue-700 transition-all" type="submit">Join</button>
			</form>
			</> }
			{ errored && <>
			<div className="bg-red-50 text-red-600 p-4 rounded border-2 border-red-400 text-center">
				Could not connect to server!
			</div>
			</> }
		</div>
	);
}

export default Messenger;