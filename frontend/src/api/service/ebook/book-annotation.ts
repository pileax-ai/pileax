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
  // console.log('annotation', annotation)
  ebookRender.addAnnotation(annotation)
  await bookAnnotationService.save(annotation)
}

const removeAnnotation = async (annotation: any) => {
  ebookRender.removeAnnotation(annotation.value)
  await bookAnnotationService.delete(annotation.id)
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
  removeAnnotation,
  renderAnnotations,
  findBookAnnotation,
}
