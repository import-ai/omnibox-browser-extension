export type Manifest = chrome.runtime.ManifestV3 | chrome.runtime.ManifestV2;

export interface ManifestParserInterface {
  convertManifestToString: (manifest: Manifest, isFirefox: boolean, isSafari?: boolean) => string;
}
