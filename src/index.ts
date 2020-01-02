import { render, unmountComponentAtNode } from 'react-dom';
import main from './main';

const container = document.getElementById("app");

console.log(container)

main().subscribe(
  vdom => {
    render(vdom, container)
  },
  error => {
    console.error(error);
  },
  () => {
    if (container) {
      unmountComponentAtNode(container)
    }
  }
);
