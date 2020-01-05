import { useState, useEffect, useMemo } from 'react';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import Amplify, { Hub } from '@aws-amplify/core';

const isProduction = process.env.NODE_ENV === 'production';

Amplify.configure({
  Auth: {
    region: 'eu-west-1',
    identityPoolId: 'eu-west-1:f5cbf44b-62ec-4096-a783-2b18b93c7ea1',
    userPoolId: 'eu-west-1_ZjBSNXWhz',
    userPoolWebClientId: '66p3t8pgepkn81p217v5begaj6',
    cookieStorage: {
      domain: location.hostname,
      secure: isProduction
    },
    oauth: {
      domain: 'tapchallenge.auth.eu-west-1.amazoncognito.com',
      scope: [
        'phone',
        'email',
        'openid',
        'profile',
        'aws.cognito.signin.user.admin'
      ],
      redirectSignIn: isProduction ? 'https://godu.github.io/tap-challenge/' : 'http://localhost:1234/',
      redirectSignOut: isProduction ? 'https://godu.github.io/tap-challenge/' : 'http://localhost:1234/',
      responseType: 'code'
    }
  }
});

export type UserAttributes = {
  nickname: string
};

export const signIn = () => Auth.federatedSignIn();
export const signOut = () => Auth.signOut();

export const useUser = (): [
  UserAttributes | null,
  (data: UserAttributes) => Promise<void>
] => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(null);

  useEffect(() => {
    const effect = async () => {
      const onSignIn = async () => {
        try {
          setUser(await Auth.currentAuthenticatedUser());
          setUserAttributes({
            nickname: 'Anonymous',
            ...(await Auth.currentUserInfo()).attributes
          });
        }
        catch (err) {
          await onSignOut();
        }
      };
      const onSignOut = async () => {
        setUser(null);
        setUserAttributes(null);
      }
      Hub.listen("auth", async ({ payload: { event } }) => {
        console.log({ event });
        switch (event) {
          case "signIn": {
            await onSignIn();
            return;
          }
          case "signOut": {
            await onSignOut();
            return;
          }
        }
      });
      await onSignIn();
    };
    effect();
  }, []);

  const updateUserAttributes = useMemo(() => async (data: UserAttributes) => {
    if (!user || !userAttributes) return;
    setUserAttributes({ ...userAttributes, ...data });
    await Auth.updateUserAttributes(user, data);
  }, [user, userAttributes, setUserAttributes]);

  return [userAttributes, updateUserAttributes];
}
