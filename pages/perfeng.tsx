import path from 'path'
import type { NextPage } from 'next'
import Head from 'next/head'
import {read, writeSync, Compatible} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remark from 'remark'
import remarkMermaid from 'remark-mermaid'
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
    const mdpath = path.resolve(process.cwd(), 'public', 'perf_eng.md')
    const targetfolder = path.resolve(process.cwd(), '_mmd')
    const mmdtarget = await read(mdpath)
    mmdtarget.data = {
        destinationDir: targetfolder
    }
    await remark().use(remarkMermaid).process(mmdtarget, function (err, file) {
      if (err) throw err;
      const desc = file as any
      desc.path = path.resolve(process.cwd(), '_mmd', 'perf_eng.md')
      writeSync(desc as Compatible);
    })

    const mmdcontent = await read(path.resolve(process.cwd(), '_mmd', 'perf_eng.md'))
    const file = await unified()
    .use(remarkParse)
    .use(remarkEmbedImages)
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
