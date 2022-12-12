import fs from 'fs'
import path from 'path'
import type { NextPage } from 'next'
import Head from 'next/head'
import {read, writeSync, Compatible} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remark from 'remark'
import remarkGfm from 'remark-gfm'
import remarkEmbedImages from 'remark-embed-images'
import remarkRehype from 'remark-rehype'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import MathyMd from '../components/MathyMd'

type MyProps = { 
    content: string
}

const FosterParent: NextPage<MyProps> = ({ content, }: MyProps )  => {
  return (
    <>
      <Head>
        <title>Narios' Foster Parent School Presentation</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <MathyMd content={content} />
    </>
  )
}

// This function gets called at build time
export async function getStaticProps() {
    const mdpath = path.resolve(process.cwd(), 'public', 'fosterparent.md')

    const mmdcontent = await read(mdpath)
    const file = await unified()
    .use(remarkParse)
    .use(remarkEmbedImages)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(mmdcontent)

    return {
      props: {
        content: String(file)
      },
    }
}


export default FosterParent
