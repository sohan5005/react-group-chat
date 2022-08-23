import { useState } from 'react';
import styles from './dashboard.module.scss';

const Dashboard = ({ children }) => {

	const [count, setCount] = useState(0);

	const range = (n, min, max) => {
		return Math.max( Math.min( n, max ), min );
	}

	const increment = () => {
		setCount( range( count + 1, 0, 10 ) );
	}
	const decrement = () => {
		setCount( range( count - 1, 0, 10 ) );
	}

	return (
		<>
		<div className={styles.dashboard}>
			<div className={styles.head}>Group Chat</div>
			<div className={styles.content}>{ children }</div>
		</div>
		</>
	)

}

const doAll = () => {
	console.log('Doall');
}

export default Dashboard;

export {doAll};