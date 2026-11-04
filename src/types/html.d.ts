// next.config.mjs의 webpack asset/source 규칙 — .html을 문자열로 import (src/site/pages)
declare module '*.html' {
  const content: string;
  export default content;
}
