import { SHA1 } from 'core/utils/crypto'

export class SSMLParser {
  private ssml: string
  private doc: Document | null = null
  private isParsed = false

  constructor(ssml: string) {
    this.ssml = ssml
    this.parse()
  }

  public parse(): this {
    if (this.isParsed) return this

    try {
      this.doc = this.parseDocument()
      this.isParsed = true
    } catch (error) {
      console.warn('Failed to arse SSML', error)
      this.doc = null
    }

    return this
  }

  public getLang(): string | undefined | null {
    // const root = this.doc?.documentElement;
    // return root?.getAttribute('xml:lang');
    const match = this.ssml.match(/\b(?:xml:lang|lang)="([^"]+)"/)
    return match ? match[1] : null
  }

  public getText(): string {
    function walk(node: Node): string {
      if (node.nodeType === 3) {
        return node.nodeValue || ''
      }

      const el = node as Element

      switch (el.tagName) {
        case 'mark':
        case 'audio':
        case 'break':
          return ''
        case 'sub':
          return el.getAttribute('alias') || walkChildren(el)
      }

      return walkChildren(el)
    }

    function walkChildren(el: Node): string {
      let result = ''
      el.childNodes.forEach((child) => {
        result += walk(child)
      })
      return result
    }

    return this.doc
      ? walk(this.doc.documentElement)
      : ''
  }

  public estimateDuration(): number {
    const rates: Record<string, number> = {
      'zh': 3.0,
      'zh-CN': 3.0,
      'zh-TW': 3.0,
      'en': 10,
      'en-US': 4.5,
      'en-GB': 4.3,
      'ja': 2.8,
      'ko': 2.7,
      'de': 4.0,
    }
    const lang = this.getLang() || 'en'
    const rate = rates[lang] || 3.0
    const text = this.getText()
    return text.length / rate
  }

  public parseFull() {
    const text = this.getText()
    const lang = this.getLang()
    const duration = this.estimateDuration()
    return {
      ssml: this.ssml,
      text,
      lang,
      duration
    }
  }

  public static generateId(ssml: string): string {
    return SHA1(ssml)
  }

  public static extractText(ssml: string): string {
    return new SSMLParser(ssml).getText()
  }

  public static detectLanguage(ssml: string): string | null | undefined {
    return new SSMLParser(ssml).getLang()
  }

  private ensureSSMLRoot(): string {
    const trimmed = this.ssml.trim()
    return trimmed.startsWith('<speak>') ? trimmed : `<speak>${trimmed}</speak>`
  }

  private parseDocument(): Document {
    const doc = new DOMParser().parseFromString(this.ensureSSMLRoot(), 'application/xml')
    if (doc.querySelector('parsererror')) {
      throw new Error('Invalid SSML format')
    }
    return doc
  }
}

export class SSMLUtils {
  /**
   * Extract plain text
   */
  public extractText(ssml: string): string {
    return SSMLParser.extractText(ssml)
  }

  /**
   * Get lang attribute value
   * @param ssml
   */
  public detectLanguage(ssml: string): string | undefined | null {
    return SSMLParser.detectLanguage(ssml)
  }

  /**
   * Generate Id
   */
  public generateId(ssml: string): string {
    return SSMLParser.generateId(ssml)
  }

  public parseSSML(ssml: string) {
    return new SSMLParser(ssml).parseFull()
  }
}

export const ssmlUtils = new SSMLUtils()
