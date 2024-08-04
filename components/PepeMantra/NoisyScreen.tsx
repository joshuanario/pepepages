import React from 'react'
import styles from '../../styles/PepeMantra.module.css'

const NoisyScreen: React.FC = () => {
  return <div style={
      {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0
      }
    } className={styles["Rolling-stripes"]}/>
}

export default NoisyScreen