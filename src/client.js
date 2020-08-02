import clientRender from '../src/client';

const el = document.getElementById('app');

clientRender(el);

if (module.hot) {
  module.hot.accept();
}
