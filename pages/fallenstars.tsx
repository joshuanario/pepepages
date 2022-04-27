import fs from 'fs'
import path from 'path'
import type { NextPage } from 'next'
import Head from 'next/head'
import FallenStars from '../components/FallenStars'

type MyProps = { 
  photos: string[]
}

const FallenStarsPage: NextPage<MyProps> = ({ photos }: MyProps ) => {
  return (
    <>
      <Head>
        <title>crystalized hearts of fallen stars | joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <FallenStars photos={photos}/>
    </>

  )
}


// This function gets called at build time
export async function getStaticProps() {
  const fromDir = (startPath: string, filter: RegExp, cb: Function) => {
    if (!fs.existsSync(startPath)){
        return
    }
    const files=fs.readdirSync(startPath)
    for(let i=0; i<files.length; i++){
        const filename=path.join(startPath,files[i])
        const stat = fs.lstatSync(filename)
        if (stat.isDirectory()){
            fromDir(filename, filter, cb)
        }
        else if (filter.test(filename)) {
          cb(filename)
        }
    }
  }
  let photos: string[]
  photos = []
  const dir = path.resolve(process.cwd(), 'public', 'fallenstars')
  fromDir(dir, /\.jpg|\.jpeg$/, (filename: string) => {
    const trim = filename.replace(process.cwd() + path.sep + 'public', '')
    const img = trim.replace(path.sep, '/')
    photos.push(img)
  })
  return {
    props: {
      photos,
    },
  }
}


export default FallenStarsPage
