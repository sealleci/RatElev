import styles from './style.module.css'

export default function ElevatorDoor() {
    return <div className={styles.root}>
        <div className={styles.leftDoorLeaf}></div>
        <div className={styles.rightDoorLeaf}></div>
    </div>
}
