/**
 * Annotation
 *
 * @version 1.0
 */
import 'js/ebook.js';
import { bookAnnotationService } from 'src/api/service/remote/book-annotation';

// ---------------------------------------------------------
// Reader
// ---------------------------------------------------------
const addAnnotation = async (annotation: any) => {
  console.log('annotation', annotation);
  window.ebook.addAnnotation(annotation);
  await bookAnnotationService.save(annotation);
}

const removeAnnotation = async (annotation: any) => {
  window.ebook.removeAnnotation(annotation.value);
  await bookAnnotationService.delete(annotation.id);
}

const renderAnnotations = (annotations: []) => {
  window.ebook.renderAnnotations(annotations);
}

// ---------------------------------------------------------
// Remote
// ---------------------------------------------------------
/**
 * Finds book annotation that match given find options.
 *
 * @param tenantBookId Tenant Book Id
 * @return List
 */
const findBookAnnotation = async (tenantBookId: string) => {
  const query = {
    id: tenantBookId
  };
  return bookAnnotationService.getAll(query);
}

const joinQueryAnnotation = async (query: Indexable) => {
  return bookAnnotationService.queryBook(query);
}


export {
  addAnnotation,
  removeAnnotation,
  renderAnnotations,
  findBookAnnotation,
  joinQueryAnnotation
}
