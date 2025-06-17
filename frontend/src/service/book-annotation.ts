/**
 * Annotation
 *
 * @version 1.0
 */
import 'src/js/reader.js';
import { bookAnnotationService } from 'src/service/remote/book-annotation';

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
 * @param userBookId User Book Id
 * @return List
 */
const findBookAnnotation = async (userBookId: string) => {
  const query = {
    id: userBookId
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
