import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { UserPool, SignInType, UserPoolClient } from '@aws-cdk/aws-cognito';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
