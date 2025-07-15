export default function generateShadow() {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const shadow = root.attachShadow({ mode: 'open' });
  return { root, shadow };
}
