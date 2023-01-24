import React from 'react'
import styles from '../../styles/PastLife.module.css'
import 'normalize.css/normalize.css'

type MyProps = {
  moreinfo: string
  videoUrl: string
}

const PastLife: React.FC<MyProps> = (props: MyProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.createRef<HTMLVideoElement>()
  const { moreinfo, videoUrl } = props
  const togglePlay = () => {
    if (!videoRef?.current) {
      return
    }
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }
  return <div id={styles.container}>
    <div id={styles.wrapper}>
      <div id={styles.top}>
        <div>
          <h1>Film-making</h1>
          <p>In a past life, I aspired to make films.  The video in this page was probably completed around 2006-2007.</p>
          <h2>Siege on Lochaven Hills</h2>
          <p>Synopsis: Jeff and Roi decided to rob Ha's house, but things did not go as they planned when they arrived at their destination.</p>
          <p>Disclaimer: Viewer discretion is advised due to comical violence and mild gore.</p>
        </div>
        <div id={styles.videoContainer}>
          <video width="100%" height="100%" ref={videoRef} controls onPause={e => setIsPlaying(false)} onPlay={e => setIsPlaying(true)} >
            <source src={videoUrl} type="video/ogg" />
          </video>
          {!isPlaying && <div id={styles.play} onClick={e => togglePlay()}/>}
        </div>
      </div>
      <div 
        id={styles.content}
        dangerouslySetInnerHTML={{
          __html: moreinfo,
        }}
      />
    </div>
  </div>
}

export default PastLife