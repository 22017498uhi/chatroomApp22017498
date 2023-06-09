//import firebase from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";


function Login() {
    return (
        <div style={{ display: 'flex', flex: 1, height: '100vh'}}>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 300
            }}>
                <button style={{
                    backgroundColor: 'red',
                    borderWidth: 0,
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 24,
                    paddingRight: 24,
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold'
                }} onClick={async () => {
                    const auth = getAuth();
                     const provider = new GoogleAuthProvider();
                     signInWithPopup(auth, provider);
                     
                }}>
                    Login with Google
                </button>

            </div>
        </div>
    )
}

export default Login;