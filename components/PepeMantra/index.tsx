import React from 'react'
import NoisyScreen from './NoisyScreen'
import PP from './Dichotomy'
import styles from '../../styles/PepeMantra.module.css'


let up = Math.random() >= 0.4
const peace = up ? 'peace' : 'poise'
const poise = up ? 'poise' : 'peace'

up = Math.random() >= 0.4
const passion = up ? 'passion' : 'power'
const power = up ? 'power' : 'passion'

up = Math.random() >= 0.4
const piquancy = up ? 'piquancy' : 'potential'
const potential = up ? 'potential' : 'piquancy'


type State = {
  isNoisy: boolean
}

export default class PepeMantra extends React.Component<object, State> {
  constructor(prop: object){
    super(prop)
    this.state = {
      isNoisy: true,
    }
  }

  componentDidMount() {
    setTimeout(
        () => {
            this.setState({
              isNoisy: false
            })
        },
        3000
    )
  }

  render() {
    const { isNoisy } = this.state

    let content = isNoisy ? <NoisyScreen/> : ( 
      <h1 className={styles["App-text"]}>
        <PP firstText={peace} secondText={poise} animatingClass={styles["Fading"]} mountingClass={styles["Slip-slide"]} ></PP>&nbsp;
        <PP firstText={passion} secondText={power} animatingClass={styles["Saturating"]} mountingClass={styles["See-saw"]} ></PP>&nbsp;
        <PP firstText={piquancy} secondText={potential} animatingClass={styles["Springy"]} mountingClass={styles["Inflate"]} ></PP>&nbsp;
      </h1>
    )

    return (
      <div className={styles["App"]}>
        <header className={styles["App-header"]}>
          { content }
        </header>
      </div>
    )
  }
}
