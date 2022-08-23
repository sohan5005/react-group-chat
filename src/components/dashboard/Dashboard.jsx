import styles from './dashboard.module.scss';

const Dashboard = ({ children }) => {

	return (
		<>
		<div className={styles.dashboard}>
			<div className={styles.head}>Group Chat</div>
			<div className={styles.content}>{ children }</div>
		</div>
		</>
	)

}

export default Dashboard;