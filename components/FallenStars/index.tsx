import React, { useState, useEffect } from 'react'

type MyProps = {
  photos: string[]
}

const getRandomInt = (max: number) => {
  if (typeof window !== 'undefined' && window?.crypto?.getRandomValues) {
    const buf = new Uint8Array(1)
    window.crypto.getRandomValues(buf)
    return buf[0] % max
  }
  return Math.floor(Math.random() * max)
}

const randomPic = (curr: string, photos: string[]) : string => {
  let ret = curr
  do {
    const i = getRandomInt(photos.length)
    ret = photos[i]
  } while(ret === curr)
  return ret
}
let cycleTimeout:NodeJS.Timeout
const FallenStars: React.FC<MyProps> = (props: MyProps) => {
  const { photos } = props
  const [curr, setCurr] = useState(randomPic('', photos))
  const cyclePics = () => {
    if (cycleTimeout) {
      clearTimeout(cycleTimeout)
    }
    setCurr(randomPic(curr, photos))
    cycleTimeout = setTimeout(
      cyclePics,
      10000
    )
  }
  useEffect(cyclePics, [])
  return <div
    style={{
      width: '100vw',
      height: '100vh'
    }} 
    onClick={ e => {
      cyclePics()
    }} 
    onTouchMove={e => {
      cyclePics()
    }}
  >
    <img src={curr}
      style={{
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateY(-50%) translateX(-50%)',
      }} />
  </div>
}

export default FallenStars