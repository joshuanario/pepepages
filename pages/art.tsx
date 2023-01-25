import type { NextPage } from 'next'
import Head from 'next/head'
import PepeMantra from '../components/PepeMantra'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <PepeMantra />
    </>

  )
}

export default Home
