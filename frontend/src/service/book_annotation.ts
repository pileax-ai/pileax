/**
 * Annotation
 *
 * @version 1.0
 */
import 'src/js/reader.js';
import useReader from 'src/hooks/useReader';
import useBook from 'src/hooks/useBook';

const { setQueryTimer } = useReader();
const { bookId, setProgress, setSelection, setToc } = useBook();

// --------------------------------------------------------------------------------
// Reader
// --------------------------------------------------------------------------------
const addAnnotation = async (annotation: any) => {
  console.log('annotation', annotation);
  window.ebook.addAnnotation(annotation);
  await saveAnnotation(annotation);
}

const removeAnnotation = async (annotation: any) => {
  window.ebook.removeAnnotation(annotation.value);
  await deleteAnnotation(annotation.id);
}

const renderAnnotations = (annotations: []) => {
  window.ebook.renderAnnotations(annotations);
}

// --------------------------------------------------------------------------------
// Electron
// --------------------------------------------------------------------------------
const saveAnnotation = async (annotation: any) => {
  return new Promise<any>((resolve, reject) => {
    window.electronAPI.dbExecute('BookAnnotation', 'save', annotation)
      .then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        console.error('saveAnnotation failed', err);
        reject(err);
      })
  });
}

/**
 * Finds book annotation that match given find options.
 *
 * @param bookId Book id
 * @return List
 */
const findBookAnnotation = async (bookId: number) => {
  const condition = {
    bookId: bookId
  };
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('BookAnnotation', 'find', condition)
      .then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
      reject(err);
    })
  });
}

/**
 * Pagination query
 *
 * @param bookId Book Id
 */
const queryAnnotation = async (bookId: number) => {
  const query = {
    pageIndex: 1,
    pageSize: 20,
    condition: {
      bookId: bookId
    }
  };
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('BookAnnotation', 'query', query)
      .then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      })
  });
}

const joinQueryAnnotation = async (note = '') => {
  const query = {
    pageIndex: 1,
    pageSize: 20,
    condition: {
      note: note
    }
  };
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('BookAnnotation', 'joinQuery', query).then((res: any) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err);
    })
  });
}

const getAnnotation = async (id: string) => {
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('BookAnnotation', 'findById', id)
      .then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject(err);
      })
  });
}

const deleteAnnotation = async (id: string) => {
  return new Promise((resolve, reject) => {
    window.electronAPI.dbExecute('BookAnnotation', 'deleteById', id)
      .then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
      reject(err);
    })
  });
}

export {
  addAnnotation,
  removeAnnotation,
  renderAnnotations,
  getAnnotation,
  findBookAnnotation,
  saveAnnotation,
  queryAnnotation,
  joinQueryAnnotation
}
