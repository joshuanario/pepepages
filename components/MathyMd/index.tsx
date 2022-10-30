import React from 'react'
import styles from '../../styles/MathyMd.module.css'
import 'normalize.css/normalize.css'

type MyProps = {
  content: string
}

const Resume: React.FC<MyProps> = (props: MyProps) => {
  const { content, } = props
  return <div
    id={styles.container}
  >
    <div 
      id={styles.wrapper}
    >
      <div 
        id={styles.content}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </div>
  </div>
}

export default Resume