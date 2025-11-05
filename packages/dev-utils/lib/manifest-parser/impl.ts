import type { Manifest, ManifestParserInterface } from './types.js';

export const ManifestParserImpl: ManifestParserInterface = {
  convertManifestToString: (manifest, isFirefox, isSafari = false) => {
    // Safari uses Manifest V2 directly from manifest.ts, no conversion needed
    // Firefox needs specific conversions for V3
    if (isFirefox && !isSafari) {
      manifest = convertToFirefoxCompatibleManifest(manifest);
    }

    return JSON.stringify(manifest, null, 2);
  },
};

const convertToFirefoxCompatibleManifest = (manifest: Manifest) => {
  const manifestCopy = {
    ...manifest,
  } as { [key: string]: unknown };

  // Only convert if it's a V3 manifest with service_worker
  if (manifest.background && 'service_worker' in manifest.background && manifest.background.service_worker) {
    manifestCopy.background = {
      scripts: [manifest.background.service_worker],
      type: 'module',
    };
  }
  if (manifest.options_page) {
    manifestCopy.options_ui = {
      page: manifest.options_page,
      open_in_tab: true,
    };
  }
  manifestCopy.content_security_policy = {
    extension_pages: "script-src 'self'; object-src 'self'",
  };
  manifestCopy.permissions = (manifestCopy.permissions as string[]).filter(value => value !== 'sidePanel');

  delete manifestCopy.options_page;
  delete manifestCopy.side_panel;
  return manifestCopy as Manifest;
};
