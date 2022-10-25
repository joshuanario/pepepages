import path from 'path'
import type { NextPage } from 'next'
import Head from 'next/head'
import {read, Compatible} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remark from 'remark'
import remarkMermaid from 'remark-mermaid'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import MathyMd from '../components/MathyMd'

type MyProps = { 
    content: string
}

const PerfEng: NextPage<MyProps> = ({ content, }: MyProps )  => {
  return (
    <>
      <Head>
        <title>Performance engineering web applications with load that is growing at a polynomial rate | joshuanario.com</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <MathyMd content={content} />
    </>
  )
}

// This function gets called at build time
export async function getStaticProps() {
    const mdpath = path.resolve(process.cwd(), 'public', 'perf_eng.md')
    const outroot = path.resolve(process.cwd(), 'out')
    const targetfolder = path.resolve(process.cwd(), 'out', 'perfeng')
    const mmdtarget = await read(mdpath)
    mmdtarget.data = {
        destinationDir: targetfolder
    }
    const mmdcontent = await remark().use(remarkMermaid).process(mmdtarget)

    const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeMathjax)
    .use(rehypeStringify)
    .process(mmdcontent as Compatible)

    return {
      props: {
        content: String(file)
      },
    }
}


export default PerfEng
