import * as React from 'react';
import { from, Subject } from 'rxjs';
import { map, startWith, mergeAll, mapTo, scan, tap } from 'rxjs/operators';
import { App } from './view';
import { COLOR } from './domain';

export default () => {
  const blueAnswers$ = new Subject();
  const greenAnswers$ = new Subject();
  const redAnswers$ = new Subject();
  const yellowAnswers$ = new Subject();
  const reset$ = new Subject<void>();

  const answers$ = from([
    blueAnswers$.pipe(mapTo(COLOR.BLUE)),
    greenAnswers$.pipe(mapTo(COLOR.GREEN)),
    redAnswers$.pipe(mapTo(COLOR.RED)),
    yellowAnswers$.pipe(mapTo(COLOR.YELLOW)),
    reset$
  ]).pipe(
    mergeAll(),
    scan(
      (answers: COLOR[], answer: COLOR | void): COLOR[] =>
        answer === undefined
          ? []
          : [answer, ...answers],
      []
    ),
    startWith([]),
    tap(console.log)
  );

  const onTapYellow = () => yellowAnswers$.next();
  const onTapBlue = () => blueAnswers$.next();
  const onTapGreen = () => greenAnswers$.next();
  const onTapRed = () => redAnswers$.next();
  const onReset = () => reset$.next();

  const vdom$ =
    answers$
      .pipe(map(answers =>
        <App
          answers={answers}
          onTapYellow={onTapYellow}
          onTapBlue={onTapBlue}
          onTapGreen={onTapGreen}
          onTapRed={onTapRed}
          onReset={onReset}
        />
      ));

  return vdom$;
};
