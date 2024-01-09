import React, { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"; // This line changes depending on which authentication method we have chosen in the Firebase console

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   console.log(auth?.currentUser);

  // signIn() need to be asynchronous, because Firebase libraries/functions return promises
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      console.log(data.user.uid);
    } catch (err) {
      console.error(err);
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Authentication</h2>
      <label>
        Email
        <br />
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </label>
      <label>
        Password
        <br />
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <br />
      </label>
      <button onClick={signIn}>Sign in</button>
      <br />
      <br />
      <br />
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={signout}>Sign Out</button>
    </div>
  );
}

export default Auth;
