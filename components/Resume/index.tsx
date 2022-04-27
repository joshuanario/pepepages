import React from 'react'
import styles from '../../styles/Resume.module.css'
import 'normalize.css/normalize.css'

type MyProps = {
  resume: string
  intro: string
  serversideArt: string
}

const Resume: React.FC<MyProps> = (props: MyProps) => {
  const { resume, intro, serversideArt } = props
  return <div
    style={{
      width: '100vw',
      height: '100%',
      backgroundColor: 'black',
      color: 'white',
      padding: '1em 0',
      margin: '0',
      fontFamily: "'Tinos', serif",
    }}
  >
    <div 
      style={{
        width: '50%',
        minWidth: '816px',
        margin: '0 auto',
      }}
    >
      <div
        id={styles.top}
      >
        <div
          id={styles.algoArt}
        >
          <img src={serversideArt} />
        </div>
        <div 
          id={styles.intro}
          dangerouslySetInnerHTML={{
            __html: intro,
          }}
      />
      </div>
      <div 
        id={styles.content}
        dangerouslySetInnerHTML={{
          __html: resume,
        }}
      />
    </div>
  </div>
}

export default Resume