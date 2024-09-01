const whiteListURLs = [
  "https://124.ir",
  "https://mvcrs.ntsw.ir",
  "https://jam.iacpa.ir",
];

export default class URLHelpers {
  static validateURL(url) {
    console.log(url);

    if (!url) {
      return false;
    }
    const parsed = new URL(url);
    return (
      ["https:", "http:"].includes(parsed.protocol) &&
      whiteListURLs.includes(parsed.origin)
    );
  }
}
