import path from 'path'
import mammoth from 'mammoth'
import type { NextPage } from 'next'
import Head from 'next/head'
import PastLife from '../components/PastLife'

type MyProps = { 
  moreinfo: string
}

const PastLifePage: NextPage<MyProps> = ({ moreinfo }: MyProps ) => {
  const synopsis = `
  <h1>Film-making</h1>
  <p>In a past life, I aspired to make films.  The video in this page was probably completed around 2006-2007.<p>
  <h2>Siege on Lochaven Hills</h2>
  <p>Synopsis: Jeff and Roi decided to rob Ha's house, but things did not go as they planned when they arrived at their destination.</p>
  <p>Disclaimer: Viewer discretion is advised due to comical violence and mild gore.</p>
  `
  return (
    <>
      <Head>
        <title>In a past life</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <PastLife synopsis={synopsis} moreinfo={moreinfo} videoUrl='/sdsf_ch09.ogg'/>
    </>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  const sdsfdoc = path.resolve(process.cwd(), 'public', 'sdsf.docx')
  const result = await mammoth.convertToHtml({path: sdsfdoc})
  return {
    props: {
      moreinfo: result.value,
    },
  }
}


export default PastLifePage
