import https from 'https';

https.get('https://multimodal-ai-jtmx.vercel.app', (res) => {
  let html = '';
  res.on('data', (d) => (html += d));
  res.on('end', () => {
    console.log('HTML Status:', res.statusCode);
    const match = html.match(/src="(\/assets\/[^"]+)"/);
    console.log('Script URL:', match ? match[1] : 'NOT FOUND');
    if (match) {
      https.get('https://multimodal-ai-jtmx.vercel.app' + match[1], (jsRes) => {
        console.log('JS Asset Status:', jsRes.statusCode);
        let js = '';
        jsRes.on('data', (d) => (js += d));
        jsRes.on('end', () => {
          console.log('JS Asset Size:', js.length, 'bytes');
          // Check if JS contains top-level errors or window references
          console.log('JS snippet start:', js.slice(0, 200));
        });
      });
    }
  });
});
