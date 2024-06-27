import { JSDOM } from 'jsdom'

function normalizeURL(url)
{
    url = new URL(url);
    return url.host + url.pathname.replace(/\/$/, '');
}

function getURLsFromHTML(html, baseURL)
{
    const urls = []
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')

    for (const anchor of anchors) {
      if (anchor.hasAttribute('href')) {
        let href = anchor.getAttribute('href')
  
        try {
          // convert any relative URLs to absolute URLs
          href = new URL(href, baseURL).href
          urls.push(href)
        } catch(err) {
          console.log(`${err.message}: ${href}`)
        }
      }
    }
  
    return urls
}

async function crawlPage(url, currentURL = url, pages = {})
{
  const parsedUrl = new URL(url);
  const parsedCurrentUrl = new URL(currentURL);

  if (parsedUrl.hostname != parsedCurrentUrl.hostname) {
    return pages;
  }

  let normalized = normalizeURL(currentURL);

  if (normalized in pages) {
    pages[normalized] += 1;
    return pages;
  } else {
    pages[normalized] = 1;
  }

  console.log(`crawling ${currentURL}`)
  let html = '';
  try {
    html = await getHtml(currentURL);
  } catch (error) {
    console.log('Error fetching html', error);
    return pages
  }
  
  let foundURLs = getURLsFromHTML(html, url);
  for (const link in foundURLs) {
    pages = await crawlPage(url, foundURLs[link], pages);
  }

  return pages;
}

async function getHtml(url)
{
  try {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error('Unsucessful response');
    }

    if (!response.headers.get('Content-Type').includes('text/html')) {
      throw new Error('Content-type is not text/html');
    }

    return await response.text();

  } catch (error) {
    console.error('Error: ', error);
  }
}

export { normalizeURL, getURLsFromHTML, crawlPage }