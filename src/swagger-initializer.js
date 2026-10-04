globalThis.onload = () => {
  const { SwaggerUIBundle, SwaggerUIStandalonePreset } = globalThis;

  globalThis.ui = SwaggerUIBundle({
    // кожен файл — окрема специфікація у дропдауні справа зверху
    urls: [
      { name: 'Locations', url: '/docs/openapi/locations.yaml' },
      { name: 'Auth', url: '/docs/openapi/auth.yaml' },
      { name: 'Users', url: '/docs/openapi/users.yaml' },
      { name: 'Feedbacks', url: '/docs/openapi/feedbacks.yaml' },
      { name: 'Categories', url: '/docs/openapi/categories.yaml' },
      { name: 'Geocode', url: '/docs/openapi/geocode.yaml' },
    ],
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: 'StandaloneLayout',
  });
};
