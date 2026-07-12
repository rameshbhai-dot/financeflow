/* ============================================
   FinanceFlow — Firebase Configuration
   ============================================ */

try {
  const firebaseConfig = {
    apiKey: "AIzaSyCfuIMFHqk--zVlj8Cf4m7E57FE5Dgbf3c",
    authDomain: "financeflow-b747e.firebaseapp.com",
    projectId: "financeflow-b747e",
    storageBucket: "financeflow-b747e.firebasestorage.app",
    messagingSenderId: "701013882588",
    appId: "1:701013882588:web:a5f78f9b793c5770b0e619",
    measurementId: "G-1E2RW32SLR"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Global references
  var auth = firebase.auth();
  var db = firebase.firestore();

  // Google Auth Provider
  var googleProvider = new firebase.auth.GoogleAuthProvider();

  // GitHub Auth Provider
  var githubProvider = new firebase.auth.GithubAuthProvider();

  console.log('🔥 Firebase initialized for FinanceFlow');
} catch(e) {
  // Firebase CDN not loaded (offline / local file mode) — site works fine without it
  console.log('⚠️ Firebase not available (offline mode). Site will work with local features.');
}
