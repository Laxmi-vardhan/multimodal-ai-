import https from 'https';

https.get('https://multimodal-ai-jtmx.vercel.app/assets/index-BvInsvI-.js', (res) => {
  let js = '';
  res.on('data', (d) => (js += d));
  res.on('end', () => {
    console.log('Bundle loaded. Size:', js.length);
    // Check for process.env or undefined variables in bundle
    const processEnvMatches = js.match(/process\.env\.[A-Za-z0-9_]+/g);
    console.log('Found process.env in JS bundle:', processEnvMatches);
    
    // Check if VITE_API_BASE_URL was replaced or left as undefined
    const baseApiMatches = js.match(/\/api/g);
    console.log('Found /api occurrences:', baseApiMatches ? baseApiMatches.length : 0);
  });
});
