
import React, { useState, useEffect, createContext, ReactNode, useContext, useMemo } from 'react';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import Amplify, { Hub } from '@aws-amplify/core';

type UserAttributes = {
  nickname: string
};

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

export const signIn = () => Auth.federatedSignIn();
export const signOut = () => Auth.signOut();

export const useUser = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    const effect = async () => {
      Hub.listen("auth", async ({ payload: { event } }) => {
        console.log({ event });
        switch (event) {
          case "signIn": {
            setUser(await Auth.currentAuthenticatedUser());
            return;
          }
          case "signOut": {
            setUser(null);
            return;
          }
        }
      });
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      }
      catch (err) {
        setUser(null);
      }
      console.log('useUserEffect');
    };
    effect();
  }, []);

  return [user];
}

// export const useUser = () => {
//   const [user, setUser] = useContext(UserContext);
//   const setUserAttributes = useMemo(() => async (nextUser: User) => {
//     setUser({ ...user, ...nextUser });
//     await Auth.updateUserAttributes(
//       await Auth.currentAuthenticatedUser(),
//       nextUser
//     );
//   }, [user, setUser]);
//   return [user, setUserAttributes, signIn, signOut];
// }

// export const Service = ({ children }: { children: ReactNode[] }) => {
//   const [user, setUser] = useState<null | User>(null);

//   useEffect(() => {
//     const effect = async () => {
//       Hub.listen("auth", async ({ payload: { event, data } }) => {
//         console.log({ event, data });
//         switch (event) {
//           case "signIn": {
//             const user = await Auth.currentUserInfo();
//             setUser(user);
//             return;
//           }
//           case "signOut": {
//             setUser(null);
//             return;
//           }
//         }
//       });

//       try {
//         const user = await Auth.currentUserInfo();
//         setUser(user);
//       }
//       catch (err) {
//         setUser(null);
//       }
//     };
//     effect();
//   }, []);


//   return (
//     <UserContext.Provider value={[user, setUser]}>
//       {children}
//     </UserContext.Provider>
//   )
// }
