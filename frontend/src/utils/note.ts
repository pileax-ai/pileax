/**
 * Note Util
 *
 * @version 1.0
 */
import MarkdownIt from 'markdown-it'
import { JSONContent } from '@yiitap/vue'

const md = new MarkdownIt({
  breaks: true,
})

export const markdownToHtml = (text: string) => {
  return md.render(text)
}

export const chatContentToHtml = (text: string, title = '') => {
  text = title ? `# ${title} \n ${text}` : text
  // console.log('chatContentToHtml', text)
  return md.render(text)
}

/**
 * Clean marks
 * @param node
 */
export const sanitizeContent = (node: JSONContent): JSONContent => {
  const newNode = { ...node }

  if (newNode.marks) {
    const hasCode = newNode.marks.some(m => m.type === 'code')
    const hasBold = newNode.marks.some(m => m.type === 'bold')

    // If both exist and schema still complains, prioritize one
    if (hasCode && hasBold) {
      newNode.marks = newNode.marks.filter(m => m.type === 'code')
    }
  }

  if (newNode.content) {
    newNode.content = newNode.content.map(sanitizeContent)
  }

  return newNode
}
