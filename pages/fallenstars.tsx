import type { NextPage } from 'next'
import Head from 'next/head'
import FallenStars from '../components/FallenStars'

// const AmnesiaPage: NextPage = ({ photos }) => {
const AmnesiaPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>crystalized hearts of fallen stars | joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <FallenStars />
    </>

  )
}

// This function gets called at build time
// export async function getStaticProps() {
  

//   const res = await fetch('https://.../posts')
//   const photos = await res.json()

//   return {
//     props: {
//       photos,
//     },
//   }
// }


export default AmnesiaPage
