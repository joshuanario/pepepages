import fs from 'fs'
import path from 'path'
import type { NextPage } from 'next'
import Head from 'next/head'
import {read, writeSync, Compatible} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import { remark } from 'remark'
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

const Epcs: NextPage<MyProps> = ({ content, }: MyProps )  => {
  return (
    <>
      <Head>
        <title>Sofware modules for Electronic Prescription of Controlled Substances (EPCS)</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <MathyMd content={content} />
    </>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  const mdpath = path.resolve(process.cwd(), 'public', 'epcs.md')
  const targetfolder = path.resolve(process.cwd(), '_mmd')
  const mmdtarget = await read(mdpath)
  mmdtarget.data = {
      destinationDir: targetfolder
  }
  await remark().use(remarkMermaid).process(mmdtarget, function (err, file) {
    if (err) throw err;
    const desc = file as any
    desc.path = path.resolve(process.cwd(), '_mmd', 'epcs.md')
    writeSync(desc as Compatible);
  })

  const mmdcontentHack = await read(path.resolve(process.cwd(), '_mmd', 'epcs.md'))
  fs.writeFileSync(path.resolve(process.cwd(), '_mmd', 'epcs.md'), 
    String(mmdcontentHack).replace(`\\left{`, `\\left\\{`)
    .replace(`x\\_{MSL}`, `x_{MSL}`).replace(`x\\_{MSL}`, `x_{MSL}`)
    .replace(`x\\_{MSL}`, `x_{MSL}`).replace(`x\\_{MSL}`, `x_{MSL}`).replace(`x\\_{MSL}`, `x_{MSL}`)
    .replace(`r\\_{i}`, `r_{i}`).replace(`r\\_{i}`, `r_{i}`)
    .replace(`r\\_{j}`, `r_{j}`).replace(`E\\[r]`, `E[r]`)
    .replace(`EPCS (Electronic Prescription of Controlled Substances)On October 26, 2017`, `EPCS (Electronic Prescription of Controlled Substances)\n\nOn October 26, 2017`)
    .replace(`(https://www.netflix.com/title/81002576)*.# Four Fundamentals of EPCSGenerally speaking`, `(https://www.netflix.com/title/81002576)*.\n\n# Four Fundamentals of EPCS\n\nGenerally speaking`)
    .replace(`fundamental functions to be mindful of.1) Identity Proofing`, `fundamental functions to be mindful of.\n\n1) Identity Proofing`)
    .replace(`4) Auditing# Identity ProofingThe latest revision of EPCS codification,`, `4) Auditing\n\n# Identity Proofing\n\nThe latest revision of EPCS codification,`)
    .replace(`identity proofing process.![](./837e470e002718c41da186003b2253d5b9588a99.svg "\`mermaid\` image")# Multi-factor Authentication[21 CFR 1311](https://www.ecfr.gov/current/title-21/chapter-II/part-1311)`, `identity proofing process.![](./837e470e002718c41da186003b2253d5b9588a99.svg "\`mermaid\` image")\n\n# Multi-factor Authentication\n\n[21 CFR 1311](https://www.ecfr.gov/current/title-21/chapter-II/part-1311)`)
    .replace(`dictionary passwords).# Digital SignatureAn EPCS application`, `dictionary passwords).\n\n# Digital Signature\n\nAn EPCS application`)
    .replace(`(https://csrc.nist.gov/glossary/term/reference_monitor).# AuditingRecord tracking`, `(https://csrc.nist.gov/glossary/term/reference_monitor).\n\n# Auditing\n\nRecord tracking`)
  )

  const mmdcontent = await read(path.resolve(process.cwd(), '_mmd', 'epcs.md'))
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


export default Epcs
