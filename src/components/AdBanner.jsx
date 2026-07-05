function AdBanner() {
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background: transparent; 
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '4ce4b6a782eb4444b278cc16085c8213',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/4ce4b6a782eb4444b278cc16085c8213/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="ad-banner-wrapper">
      <iframe
        srcDoc={srcDoc}
        width="728"
        height="90"
        scrolling="no"
        frameBorder="0"
        style={{ border: 'none', overflow: 'hidden' }}
        title="Advertisement Banner"
      ></iframe>
    </div>
  );
}

export default AdBanner;
