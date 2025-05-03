# EBook

# Upgrade
## Backup
cd frontend/src/js
mv foliate-js foliate-js.backup

## Get latest foliate-js
mv ../../../../foliate-js .
rm -rf foliate-js/.git

## Apply local changes

# Local Changes
## pdf.js
### Line 1
```js
const pdfjsPath = path => { // TODO: EBOOK
  const url = `/vendor/pdfjs/${path}`;
  // const url = new URL(`./vendor/pdfjs/${path}`, import.meta.url).toString();
  console.log('pdfjsPath', url);
  return url;
}
```

## view.js
### Line 328, in #onRelocate
```js
const chapterLocation = { // TODO: EBOOK
  current: this.renderer.page,
  total: this.renderer.pages - 2
}
```

### Line 348, after `#handleLinks`
```js
    // TODO: EBOOK
    #handleImage(doc) {
      for (const img of doc.querySelectorAll('img')) {
        img.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()
          this.#emit('click-image', { img })
        })
      }
    }
    // TODO: EBOOK
    #handleClick(doc) {
      doc.addEventListener('click', e => {
        if (doc.getSelection().type === "Range")
          return

        let { clientX, clientY } = e
        // add top margin to y, y is relative to the iframe
        const topMargin = this.renderer.getAttribute('top-margin').match(/\d+/)[0]
        clientY += parseInt(topMargin)

        this.renderer.scrollProp == 'scrollLeft'
          ? clientX -= (this.renderer.start - this.renderer.size)
          : clientY -= (this.renderer.start)

        this.#emit('click-view', { x: clientX, y: clientY })
      })
      this.renderer.addEventListener('click', e => {
        let { clientX, clientY } = e
        while (clientX > window.innerWidth) {
          clientX -= window.innerWidth
        }
        this.#emit('click-view', { x: clientX, y: clientY })
      })
    }
```
