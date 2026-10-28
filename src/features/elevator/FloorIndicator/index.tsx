import styles from './style.module.css'

type ArrowDirection = 'up' | 'down'
export type FloorIndicatorStatus =
    | ArrowDirection
    | 'both'
    | 'idle'


interface DirectionIconProps {
    direction: ArrowDirection
    isVisible: boolean
}

interface FloorIndicatorProps {
    floorNumber: number | string
    direction?: FloorIndicatorStatus
}

function DirectionIcon({
    direction,
    isVisible,
}: DirectionIconProps) {
    const className = isVisible ?
        styles.directionIcon :
        `${styles.directionIcon} ${styles.invisible}`

    return (
        <div
            className={className}
            data-direction={direction}
            role="img"
        >
            <div className={styles.arrow}>
                <div className={styles.leftStroke} />
                <div className={styles.rightStroke} />
            </div>
        </div>
    )
}

export default function FloorIndicator({
    floorNumber,
    direction = 'idle',
}: FloorIndicatorProps) {
    const isUp = direction === 'up' || direction === 'both'
    const isDown = direction === 'down' || direction === 'both'

    return (
        <div className={styles.root}>
            <DirectionIcon
                direction='up'
                isVisible={isUp}
            />

            <div className={styles.floorNumber}>
                {floorNumber}
            </div>

            <DirectionIcon
                direction='down'
                isVisible={isDown}
            />
        </div>
    )
}
