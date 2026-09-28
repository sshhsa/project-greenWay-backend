globalThis.onload = () => {
  const { SwaggerUIBundle, SwaggerUIStandalonePreset } = globalThis;

  globalThis.ui = SwaggerUIBundle({
    url: '/docs/locations.yaml',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: 'StandaloneLayout',
  });
};
