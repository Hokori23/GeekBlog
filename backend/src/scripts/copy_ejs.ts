import path from 'path'
import { findSrcFiles, File } from '@utils'
import { copyFile } from 'node:fs/promises'

export default async (ejsFiles?: File[]) => {
  const _ejsFiles = ejsFiles || findSrcFiles(path.resolve('./src/mailer'), [], /.*\.ejs$/)

  try {
    await Promise.all(
      _ejsFiles.map((ejs) => {
        const outputPath = path.resolve(
          ejs.path.replace(path.join('backend', 'src'), path.join('backend', 'build')),
        )
        return copyFile(ejs.path, outputPath)
      }),
    )
  } catch (e) {
    console.error('构建失败 -- 复制ejs文件失败')
    console.error(e)
    process.exit(0)
  }
}
