/**
 * Annotation
 *
 * @version 1.0
 */
import { ebookRender } from 'src/api/service/ebook'
import { bookAnnotationService } from 'src/api/service/remote/book-annotation'

// ---------------------------------------------------------
// Reader
// ---------------------------------------------------------
const addAnnotation = async (annotation: any) => {
  ebookRender.addAnnotation(annotation)
  return bookAnnotationService.save(annotation)
}

const updateAnnotation = async (annotation: Indexable, data: Indexable) => {
  ebookRender.addAnnotation(annotation)
  return bookAnnotationService.update(data)
}

const removeAnnotation = async (annotation: any) => {
  ebookRender.removeAnnotation(annotation.value)
}

const renderAnnotations = (annotations: []) => {
  ebookRender.renderAnnotations(annotations)
}

// ---------------------------------------------------------
// Remote
// ---------------------------------------------------------
/**
 * Finds book annotation that match given find options.
 */
const findBookAnnotation = async (bookId: string, type = '') => {
  return bookAnnotationService.getAll({ book_id: bookId, type })
}

const findRenderAnnotation = async (bookId: string) => {
  const body = {
    pageIndex: 1,
    pageSize: 100000,
    condition: {
      bookId: bookId,
      type__in: ['ai', 'annotation']
    }
  }
  return bookAnnotationService.query(body)
}


export {
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  renderAnnotations,
  findBookAnnotation,
  findRenderAnnotation,
}
