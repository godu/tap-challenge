import React from 'react';
import { useUser, signIn, signOut } from '../service/user';

export const App = ({
}: {
}) => {
  const [user, setUser] = useUser();

  console.log({ user })

  return (
    <div className="App">
      {
        user
          ? (
            <>
              <h1>Hi<input value={user.nickname} onChange={(e) => setUser({ nickname: e.target.value })} /></h1>
              <button onClick={() => signOut()}>
                Sign Out
              </button>
            </>
          )
          : (
            <button onClick={() =>
              signIn()
            }>
              Sign In
            </button>
          )
      }
    </div >
  );
}
