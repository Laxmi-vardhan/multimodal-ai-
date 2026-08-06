import https from 'https';

setTimeout(() => {
  https.get('https://multimodal-ai-jtmx.vercel.app', (res) => {
    let body = '';
    res.on('data', (d) => (body += d));
    res.on('end', () => {
      console.log('HTML STATUS:', res.statusCode);
      console.log('HAS ROOT:', body.includes('id="root"'));
      console.log('FONTS INCLUDED:', body.includes('fonts.googleapis.com'));
      console.log('SCRIPTS:', body.match(/src="[^"]+"/g));
    });
  });
}, 10000);
