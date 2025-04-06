const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const { VertexAI } = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({ project: 'voterverification-fe7a3', location: 'us-central1' });

// Function to compare faces using Vertex AI
const compareFaces = async (image1, image2) => {
    // Replace with your actual model and endpoint
    const model = vertexAI.getGenerativeModel({ model: 'your-face-comparison-model' });

    // Convert image data to base64 if needed
    // Assuming image1 and image2 are base64-encoded JPEG strings
    const request = {
        contents: [
            {
                parts: [
                    {
                        inline_data: {
                            mime_type: 'image/jpeg',
                            data: image1,
                        },
                    },
                    {
                        inline_data: {
                            mime_type: 'image/jpeg',
                            data: image2,
                        },
                    },
                ],
            },
        ],
    };

    try {
        const result = await model.generateContent(request);
        const response = await result.response;
        // Extract the match score or similarity from the response
        // This will depend on the output format of your model
        const matchScore = response.candidates[0].content.parts[0].text;
        return { success: true, match: parseFloat(matchScore) }; // Assuming match score is a number
    } catch (error) {
        console.error('Vertex AI Error:', error);
        return { success: false, error: error.message };
    }
};

exports.preVerify = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');

    // Retrieve the reference image from your Aadhaar database.
    const referenceImage = await admin.firestore().collection('referenceImages').doc(data.aadhaar).get();
    if (!referenceImage.exists) return { success: false, error: 'Reference image not found' };
    const referenceImageData = referenceImage.data().image;

    // Compare the captured image with the reference image.
    const result = await compareFaces(data.image, referenceImageData);

    if (result.success && result.match > 0.9) {
        // Generate Unique QR Code data
        const qrData = `${data.aadhaar}-${Date.now()}`;

        // Store data in Firestore
        await admin.firestore().collection('preVerified').doc(qrData).set({
            aadhaar: data.aadhaar,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, qrData };
    }

    return { success: false };
});

exports.pollingBoothVerify = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');

    // Retrieve data from Firestore
    const doc = await admin.firestore().collection('preVerified').doc(data.qrData).get();
    if (!doc.exists) return { success: false };

    const voterData = doc.data();

    // Retrieve reference image from firestore.
    const referenceImage = await admin.firestore().collection('referenceImages').doc(voterData.aadhaar).get();
    if (!referenceImage.exists) return { success: false, error: 'Reference image not found' };
    const referenceImageData = referenceImage.data().image;

    // Compare the captured image with the reference image
    const result = await compareFaces(data.image, referenceImageData);

    if (result.success && result.match > 0.9) {
        return { success: true };
    }

    return { success: false };
});