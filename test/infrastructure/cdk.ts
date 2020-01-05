import test from 'ava';
import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Cdk = require('../../src/infrastructure/cdk-stack');

test('Empty Stack', t => {
  const app = new cdk.App();
  // WHEN
  const stack = new Cdk.CdkStack(app, 'MyTestStack');
  // THEN
  t.notThrows(() =>
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
  );
});
