import path from 'path'
import { createCanvas, loadImage } from 'canvas'
import mammoth from 'mammoth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Resume from '../components/Resume'

type MyProps = { 
  game: string
  art: string
}

const WolvesInSheepSkinPage: NextPage<MyProps> = ({ game, art }: MyProps ) => {
  const intro = ``
  return (
    <>
      <Head>
        <title>Joshua's resume</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Resume resume={game} intro={intro} serversideArt={art}/>
    </>

  )
}

// This function gets called at build time
export async function getStaticProps() {
  const l = 51 //US Passport dimension
  const gamedoc = path.resolve(process.cwd(), 'public', 'wolvesinsheepskin.docx')
  const art = path.resolve(process.cwd(), 'public', 'wolf-howling.png')
  const result = await mammoth.convertToHtml({path: gamedoc})
  const artImage = await loadImage(art)
  const canvas = createCanvas(2*l, 2*l)
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 2*l, 2*l)
  context.drawImage(artImage, 0, 0, 2*l, 2*l)
  return {
    props: {
      game: result.value,
      art: canvas.toDataURL('image/png'),
    },
  }
}


export default WolvesInSheepSkinPage
