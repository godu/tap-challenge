import * as React from 'react';
import { NEVER } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { App } from './view';

export default () => {
  const state$ = NEVER.pipe(
    startWith({})
  );

  const vdom$ = state$.pipe(
    map(state => (
      <App />
    ))
  );

  return vdom$;
};
