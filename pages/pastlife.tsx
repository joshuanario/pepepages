import path from 'path'
import mammoth from 'mammoth'
import type { NextPage } from 'next'
import Head from 'next/head'
import PastLife from '../components/PastLife'

type MyProps = { 
  moreinfo: string
}

const PastLifePage: NextPage<MyProps> = ({ moreinfo }: MyProps ) => {
  return (
    <>
      <Head>
        <title>In a past life | joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
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
