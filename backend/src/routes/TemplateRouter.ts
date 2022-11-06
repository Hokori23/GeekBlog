/* eslint-disable @typescript-eslint/no-var-requires */
import EXPRESS from 'express'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import template from '@mailer/template'
import { getBlogConfig } from '@mailer/template/utils'
import config from '@config'

const templateRouter = EXPRESS.Router()
const fsp = fs.promises

templateRouter.get('', async (req, res, next) => {
  if (req.query.name) {
    const importPath = path.resolve(__dirname, `../mailer/template/${req.query.name as string}`)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { exampleAttribute, OutputTemplate } = require(importPath)
    const content = await OutputTemplate(exampleAttribute)
    res.status(200).send(content)
  } else {
    const blogConfig = await getBlogConfig()
    const rawContent = await fsp.readFile(path.resolve('./src/mailer/index.ejs'), {
      encoding: 'utf8',
    })

    const content = ejs.render(rawContent, {
      blogConfig,
      port: config.port,
      templates: Reflect.ownKeys(template),
    })
    res.status(200).send(content)
  }
  next()
})

export default templateRouter
