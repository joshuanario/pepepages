import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

type MyProps = { 
  href: string,
  children: string
}

const MyLink : React.FC<MyProps>  = ({ href, children } : MyProps) => {
  if (process.env.NODE_ENV === 'production') {
    return <a href={href + '.html'}>{children}</a>
  }
  return <Link href={href}>{children}</Link>
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
          <h1>joshuanario.com</h1>
          <ul>
            <li><MyLink href='art'>Interactive HTML Art</MyLink></li>
            <li><MyLink href='resume'>Resume, Computer Technology Professional</MyLink></li>
            <li><MyLink href='perfeng'>Performance Engineering Manifesto</MyLink></li>
            <li><MyLink href='fosterparent'>Foster Parent School Presentation</MyLink></li>
            <li><MyLink href='aviaria'>Legend of Aviaria</MyLink></li>
            <li><MyLink href='pastlife'>In a past life...</MyLink></li>
          </ul>
      </nav>
    </>

  )
}

export default Home
