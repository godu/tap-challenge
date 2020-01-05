import { useState, useEffect, useMemo } from 'react';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import Amplify, { Hub } from '@aws-amplify/core';
import { async } from 'rxjs/dist/types/internal/scheduler/async';

Amplify.configure({
  Auth: {
    "region": "eu-west-1",
    "identityPoolId": "eu-west-1:f5cbf44b-62ec-4096-a783-2b18b93c7ea1",
    "userPoolId": "eu-west-1_ZjBSNXWhz",
    "userPoolWebClientId": "66p3t8pgepkn81p217v5begaj6",
    "oauth": {
      "domain": "tapchallenge.auth.eu-west-1.amazoncognito.com",
      "scope": [
        "phone",
        "email",
        "openid",
        "profile",
        "aws.cognito.signin.user.admin"
      ],
      "redirectSignIn": "http://localhost:1234/",
      "redirectSignOut": "http://localhost:1234/",
      "responseType": "code"
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
      Hub.listen("auth", async ({ payload: { event } }) => {
        console.log({ event });
        switch (event) {
          case "signIn": {
            try {
              setUser(await Auth.currentAuthenticatedUser());
              setUserAttributes((await Auth.currentUserInfo()).attributes);
            }
            catch (err) {
              setUser(null);
              setUserAttributes(null);
            }
            return;
          }
          case "signOut": {
            setUser(null);
            setUserAttributes(null);
            return;
          }
        }
      });
      try {
        setUser(await Auth.currentAuthenticatedUser());
        setUserAttributes((await Auth.currentUserInfo()).attributes);
      }
      catch (err) {
        setUser(null);
        setUserAttributes(null);
      }
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
