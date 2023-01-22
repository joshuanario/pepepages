import React from 'react'
import styles from '../../styles/Resume.module.css'
import 'normalize.css/normalize.css'

type MyProps = {
  moreinfo: string
  synopsis: string
  videoUrl: string
}

const PastLife: React.FC<MyProps> = (props: MyProps) => {
  const { moreinfo, synopsis, videoUrl } = props
  return <div id={styles.container}>
    <div id={styles.wrapper}>
      <div id={styles.top}>
        <div dangerouslySetInnerHTML={{
            __html: synopsis,
        }}/>
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