#!/usr/bin/env node

import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../src/infrastructure/cdk-stack';

const app = new cdk.App();

new CdkStack(app, 'TapChallenge');
