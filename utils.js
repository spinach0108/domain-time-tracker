function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return null;
  }
}