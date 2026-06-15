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


export {
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  renderAnnotations,
  findBookAnnotation,
}
