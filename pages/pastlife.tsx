import path from 'path'
import mammoth from 'mammoth'
import type { NextPage } from 'next'
import Head from 'next/head'
import PastLife from '../components/PastLife'

type MyProps = { 
  moreinfo: string
}

const tagline = `Siege on Lochaven Hills - Oppose Application Z2000041: Rezoning 30 Acres at Guess & Latta Roads`
const PastLifePage: NextPage<MyProps> = ({ moreinfo }: MyProps ) => {
  return (
    <>
      <Head>
        <title>In a past life | joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content={tagline} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Siege on Lochaven Hills' key='title' />
        <meta property='og:description' content={tagline} key='description' />
      </Head>
      <PastLife moreinfo={moreinfo} videoUrlMp4='/sdsf_ch09.mp4' videoUrlOgg='/sdsf_ch09.ogg' videoUrlM4v='/sdsf_ch09.m4v'/>
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
