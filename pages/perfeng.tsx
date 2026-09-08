import path from 'path'
import type { NextPage } from 'next'
import Head from 'next/head'
import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkEmbedImages from 'remark-embed-images'
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

    const mmdcontent = await read(path.resolve(process.cwd(), '_mmd', 'perf_eng.md'))
    mmdcontent.cwd = path.resolve(process.cwd(), '_mmd')
    const file = await unified()
    .use(remarkParse)
    .use(remarkEmbedImages)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeMathjax)
    .use(rehypeStringify)
    .process(mmdcontent)

    return {
      props: {
        content: String(file)
      },
    }
}


export default PerfEng
