import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { createCanvas, loadImage } from 'canvas'
import mammoth from 'mammoth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Resume from '../components/Resume'

type MyProps = { 
  resume: string
  serversideArt: string
}

const ResumePage: NextPage<MyProps> = ({ resume, serversideArt }: MyProps ) => {
  const intro = `
  <h1>Joshua Nario</h1>
  <p>Durham, NC<p>
  <p>Computer technology professional</p>
  <h2>Interests</h2>
  <p>dogs, lots of food, watching birds, going to the beach, camping in the woods, and algorithmic art like the one seen in this page</p>
  `
  return (
    <>
      <Head>
        <title>Joshua's resume</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Resume resume={resume} intro={intro} serversideArt={serversideArt}/>
    </>

  )
}

const colorBand8 = (hex: string) : string[] => {
  let ret = []
  for(let i=0; i < hex.length; i++) {
    ret.push('#' + hex.substring(i, 8))
  }
  return ret
}


// This function gets called at build time
export async function getStaticProps() {
  const l = 51 //US Passport dimension
  const resumedoc = path.resolve(process.cwd(), 'public', 'resume.docx')
  const profilepic = path.resolve(process.cwd(), 'public', 'joshuanario.jpg')
  const profilePicBuffer = fs.readFileSync(profilepic)
  const profilePicHash = crypto.createHash('sha256').update(profilePicBuffer).digest('hex')
  const result = await mammoth.convertToHtml({path: resumedoc})
  const profileImage = await loadImage(profilepic)
  const canvas = createCanvas(2*l, 2*l)
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 2*l, 2*l)
  context.drawImage(profileImage, 0, 0, l, l)
  context.drawImage(profileImage, l, l, l, l)
  context.globalCompositeOperation='difference'
  context.drawImage(profileImage, l, 0, l, l)
  context.drawImage(profileImage, 0, l, l, l)
  const bands = colorBand8(profilePicHash)
  for(let i=0; i < 8; i++) {
    context.fillStyle = bands[i]
    const g = Math.round(l/8)
    let w = g
    context.fillRect(l+i*g, 0, g, 2*l)
  }
  return {
    props: {
      resume: result.value,
      serversideArt: canvas.toDataURL('image/png'),
    },
  }
}


export default ResumePage
