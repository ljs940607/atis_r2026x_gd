export function unescapeHTML(html){
    // Use "DOMParser" to avoid XSS security issue.
    const doc = new DOMParser()
      .parseFromString(html || '', 'text/html')
    return doc.documentElement.textContent || ''
  }