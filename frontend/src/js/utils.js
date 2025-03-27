const getCSS = ({
                  fontSize,
                  fontName,
                  fontPath,
                  letterSpacing,
                  spacing,
                  textIndent,
                  paragraphSpacing,
                  fontColor,
                  backgroundColor,
                  justify,
                  hyphenate,
                }) => {
  const fontFamily =
    fontName === 'book'
      ? ''
      : fontName === 'system'
        ? 'font-family: system-ui !important;'
        : `font-family: ${fontName} !important;`;

  return `
    @namespace epub 'http://www.idpf.org/2007/ops';
    @font-face {
      font-family: ${fontName};
      src: url('${fontPath}');
      font-display: swap;
    }

    html {
        color: ${fontColor} !important;
        background: none !important;
        // background-color: ${backgroundColor} !important;
        background-color: transparent !important;
        letter-spacing: ${letterSpacing}px;
        font-size: ${fontSize}em;
    }

    body {
        background: none !important;
        background-color: transparent;
    }

    img {
        max-width: 100% !important;
        object-fit: contain !important;
        break-inside: avoid !important;
        box-sizing: border-box !important;
    }

    a:link {
        color: #66ccff !important;
    }

    * {
        line-height: ${spacing}em !important;
        ${fontFamily}
    }

    p, li, blockquote, dd, div, font {
        color: ${fontColor} !important;
        // line-height: ${spacing} !important;
        padding-bottom: ${paragraphSpacing}em !important;
        text-align: ${justify ? 'justify' : 'start'};
        -webkit-hyphens: ${hyphenate ? 'auto' : 'manual'};
        hyphens: ${hyphenate ? 'auto' : 'manual'};
        -webkit-hyphenate-limit-before: 3;
        -webkit-hyphenate-limit-after: 2;
        -webkit-hyphenate-limit-lines: 2;
        hanging-punctuation: allow-end last;
        widows: 2;
        text-indent: ${textIndent}em !important;
    }

    /* prevent the above from overriding the align attribute */
    [align="left"] { text-align: left; }
    [align="right"] { text-align: right; }
    [align="center"] { text-align: center; }
    [align="justify"] { text-align: justify; }

    pre {
        white-space: pre-wrap !important;
    }
    aside[epub|type~="endnote"],
    aside[epub|type~="footnote"],
    aside[epub|type~="note"],
    aside[epub|type~="rearnote"] {
        display: none;
    }
`;
};

const debounce = (f, wait, immediate) => {
  let timeout;
  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) f(...args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) f(...args);
  };
};

const frameRect = (frame, rect, sx = 1, sy = 1) => {
  const left = sx * rect.left + frame.left;
  const right = sx * rect.right + frame.left;
  const top = sy * rect.top + frame.top;
  const bottom = sy * rect.bottom + frame.top;
  return { left, right, top, bottom };
};

const pointIsInView = ({ x, y }) =>
  x > 0 && y > 0 && x < window.innerWidth && y < window.innerHeight;

const getLang = (el) => {
  const lang =
    el.lang ||
    el?.getAttributeNS?.('http://www.w3.org/XML/1998/namespace', 'lang');
  if (lang) return lang;
  if (el.parentElement) return getLang(el.parentElement);
};

const getPosition = (target) => {
  const frameElement = (
    target.getRootNode?.() ?? target?.endContainer?.getRootNode?.()
  )?.defaultView?.frameElement;

  const transform = frameElement
    ? getComputedStyle(frameElement).transform
    : '';
  const match = transform.match(/matrix\((.+)\)/);
  const [sx, , , sy] =
  match?.[1]?.split(/\s*,\s*/)?.map((x) => parseFloat(x)) ?? [];

  const frame = frameElement?.getBoundingClientRect() ?? { top: 0, left: 0 };
  const rects = Array.from(target.getClientRects());
  const first = frameRect(frame, rects[0], sx, sy);
  const last = frameRect(frame, rects.at(-1), sx, sy);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const start = {
    point: {
      x: (first.left + first.right) / 2 / screenWidth,
      y: first.top / screenHeight,
    },
    dir: 'up',
  };
  const end = {
    point: {
      x: (last.left + last.right) / 2 / screenWidth,
      y: last.bottom / screenHeight,
    },
    dir: 'down',
  };
  const startInView = pointIsInView(start.point);
  const endInView = pointIsInView(end.point);
  if (!startInView && !endInView) return { point: { x: 0, y: 0 } };
  if (!startInView) return end;
  if (!endInView) return start;
  return start.point.y * screenHeight >
  window.innerHeight - end.point.y * screenHeight
    ? start
    : end;
};

const getSelectionRange = (sel) => {
  if (!sel || !sel.rangeCount) return;
  const range = sel?.getRangeAt(0);
  if (range.collapsed) return;
  return range;
};


export {
  debounce,
  getCSS,
  getLang,
  getPosition,
  getSelectionRange
}
