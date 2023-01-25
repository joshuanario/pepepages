import path, { join } from 'path'
import fs from 'fs'
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

type MyProps = { 
    legend: string
}

const AviariaPage: NextPage<MyProps> = ({ legend }: MyProps ) => {
    const imgRef = React.createRef<HTMLImageElement>()
    React.useEffect(() => {
        if (!imgRef?.current) {
            return
        }
        narrate()
    }, [imgRef])
    const narrate = () => {
        if (typeof window !== 'undefined') {
            if ('speechSynthesis' in window) {
                let msg = new SpeechSynthesisUtterance()
                msg.rate = 0.1
                msg.text = legend
                msg.lang = 'en'
                if (!window.speechSynthesis.speaking) {
                    window.speechSynthesis.speak(msg)
                }
            }else{
                alert(legend)
            }
        }
    }
    return (
        <>
        <Head>
            <title>Legend of Aviaria | joshuanario.com</title>
            <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <img
            src='/aviaria.png'
            alt='lore legend'
            width={1261}
            height={901}
            onMouseMove={e => narrate()}
            onTouchStart={e => narrate()}
        />
        </>
    )
}

// This function gets called at build time
export async function getStaticProps() {
  const legendPath = path.resolve(process.cwd(), 'public', 'aviaria.txt')
  const legend = fs.readFileSync(legendPath, 'utf8')
  return {
    props: {
        legend,
    },
  }
}


export default AviariaPage
