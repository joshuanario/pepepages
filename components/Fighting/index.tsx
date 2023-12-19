import React from 'react'
import styles from '../../styles/Fighting.module.css'
import 'normalize.css/normalize.css'

type MyProps = {
  notes: string
}

const Fighting: React.FC<MyProps> = (props: MyProps) => {
  const { notes } = props
  return <div
    id={styles.container}
  >
    <div 
      id={styles.wrapper}
    >
      <div 
        id={styles.notes}
        dangerouslySetInnerHTML={{
          __html: notes,
        }}
      />
    </div>
  </div>
}

export default Fighting