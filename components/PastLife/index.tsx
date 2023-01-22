import React from 'react'
import styles from '../../styles/Resume.module.css'
import 'normalize.css/normalize.css'

type MyProps = {
  moreinfo: string
  videoUrl: string
}

const PastLife: React.FC<MyProps> = (props: MyProps) => {
  const { moreinfo, videoUrl } = props
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
        <div>
          <video width="100%" height="100%" controls>
            <source src={videoUrl} type="video/ogg" />
          </video>
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