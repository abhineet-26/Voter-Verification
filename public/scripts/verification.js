import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-functions.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import firebaseConfig from '../firebase.js';

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Camera Access
const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('videoPreview').srcObject = stream;
    } catch (err) {
        console.error('Camera Error:', err);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('/face-verification.html')) {
        startCamera();

        let capturedImage = null;

        document.getElementById('capture-btn').addEventListener('click', () => {
            const canvas = document.getElementById('canvas');
            const video = document.getElementById('videoPreview');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            capturedImage = canvas.toDataURL('image/jpeg'); // Capture image and store in variable
        });

        document.getElementById('generate-qr').addEventListener('click', async () => {
            if (!capturedImage) {
                document.getElementById('qr-result').textContent = 'Please capture your face first.';
                return;
            }

            const aadhaar = prompt('Enter your Aadhaar number:');
            if (!aadhaar) return;

            try {
                const preVerify = httpsCallable(functions, 'preVerify');
                const result = await preVerify({ aadhaar, image: capturedImage }); // Use stored captured image

                if (result.data.success) {
                    // Generate Unique QR Code
                    new QRCode(document.getElementById('qrcode'), result.data.qrData);

                    document.getElementById('qr-result').textContent = 'Verification successful! Face matched. QR Code generated.';
                } else {
                    document.getElementById('qr-result').textContent = 'Verification failed. Face not matched.';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('qr-result').textContent = 'An error occurred during verification.';
            }
        });
    }
});