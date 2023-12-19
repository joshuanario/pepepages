import path from 'path'
import mammoth from 'mammoth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Fighting from '../components/Fighting'

type MyProps = { 
  notes: string
}

const FightingPage: NextPage<MyProps> = ({ notes }: MyProps ) => {

  return (
    <>
      <Head>
        <title>On Fighting and Self-defense</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Fighting notes={notes}/>
    </>

  )
}


// This function gets called at build time
export async function getStaticProps() {
  const notesdoc = path.resolve(process.cwd(), 'public', 'fighting.docx')
  const result = await mammoth.convertToHtml({path: notesdoc})
  return {
    props: {
      notes: result.value,
    },
  }
}


export default FightingPage
