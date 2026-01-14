/**
 * Note Util
 *
 * @version 1.0
 */
import MarkdownIt from 'markdown-it'

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
