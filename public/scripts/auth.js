import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
    getAuth,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    connectAuthEmulator
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import firebaseConfig from '../firebase.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Emulator connection
if (window.location.hostname === "127.0.0.1") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}

let recaptchaVerifier;

const initializeRecaptcha = () => {
    recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
            'size': 'invisible',
            'callback': (response) => {
                // Optional callback
            }
        },
        auth
    );
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('/login.html')) {
        initializeRecaptcha();

        document.getElementById('send-otp').addEventListener('click', async () => {
            const phoneNumber = document.getElementById('phone').value;

            try {
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                window.confirmationResult = confirmation;
                window.location.href = '/verify-otp.html';
            } catch (error) {
                showError(error.message);
            }
        });
    }

    if (window.location.pathname.endsWith('/verify-otp.html')) {
        document.getElementById('otp-verify-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const otp = document.getElementById('otp').value;

            try {
                await window.confirmationResult.confirm(otp);
                window.location.href = '/face-verification.html';
            } catch (error) {
                showError('Invalid OTP. Please try again.');
            }
        });
    }
});

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    setTimeout(() => errorDiv.textContent = '', 5000);
}