import { useState } from 'react'

import ElevatorDoor from '@/features/elevator/ElevatorDoor'
import FloorControls from '@/features/elevator/FloorControls'
import FloorIndicator from '@/features/elevator/FloorIndicator'
import LanguageSwitcher from '@/features/language/LanguageSwitcher'
import PassengerPanel from '@/features/passengers/PassengerPanel'
import QuestPanel from '@/features/quests/QuestPanel'
import SavePanel from '@/features/save/SavePanel'
import SceneViewport from '@/features/scene'

import styles from './style.module.css'

export default function ElevatorFrame() {
    const [floorNumber, setFloorNumber] = useState<number>(1)

    return (
        <div className={styles.root}>
            <div className={styles.left}>
                <PassengerPanel />
                <QuestPanel />
                <SavePanel />
            </div>

            <div className={styles.center}>
                <div className={styles.lintel}>
                    <LanguageSwitcher />
                </div>
                <ElevatorDoor />
                <SceneViewport />
            </div>

            <div className={styles.right}>
                <FloorIndicator floorNumber={floorNumber} />
                <FloorControls />
            </div>
        </div>
    )
}
