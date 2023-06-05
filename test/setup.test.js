import jsdom from 'mocha-jsdom'
import sinon from 'sinon'

import chai from 'chai'
chai.use(require('chai-dom'))
chai.use(require('sinon-chai'))
const expect = chai.expect

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
global.document = jsdom({
  url: "http://localhost:3000/"
});

let rootContainer;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  sinon.restore();
});

export { rootContainer, expect };