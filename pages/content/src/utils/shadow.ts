export default function generateShadow() {
  const root = document.createElement('div');
  root.setAttribute('data-extension-shadow', 'true');
  document.body.appendChild(root);
  const shadow = root.attachShadow({ mode: 'open' });
  return { root, shadow };
}
