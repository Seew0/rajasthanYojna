import express from 'express';
import sheets from '../db/googlesheetProvider';

const app = express.Router();

app.post("/addData", async (req, res): Promise<void> => {
    try {
        const spreadsheetID = process.env.SPREADSHEETID;
        const {
            userName,
            userPhone,
            userEmail,
            userAdhar,
            userAddress,
            userCity,
            userPincode,
            userState,
            userQuota,
            userSize,
            sonOf,
            inlineRadioOptions,
        } = req.body;

        // Log data for debugging
        console.log("Received data:", req.body);

        // Validate required fields
        if (
            !userName ||
            !userPhone ||
            !userEmail ||
            !userAdhar ||
            !userAddress ||
            !userCity ||
            !userPincode ||
            !userState ||
            !userQuota ||
            !userSize
        ) {
            throw new Error("All fields are required");
        }

        // Validate specific fields
        if (userPhone.length !== 10 || isNaN(Number(userPhone))) {
            throw new Error("Phone number should be 10 digits");
        }

        if (userAdhar.length !== 12 || isNaN(Number(userAdhar))) {
            throw new Error("Aadhaar number should be 12 digits");
        }

        if (!/\S+@\S+\.\S+/.test(userEmail)) {
            throw new Error("Invalid email ID");
        }

        // Fetch existing data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetID,
            range: "Sheet1!A:L", // Adjust range to include all columns
        });

        const rows = response.data.values;

        if (rows && rows.length > 1) {
            for (let i = 1; i < rows.length; i++) {
                const [existingEmail, existingMobileNo, existingAdhaarNo] = [
                    rows[i][2],
                    rows[i][1],
                    rows[i][3],
                ];

                if (existingEmail === userEmail) {
                    throw new Error("Email ID already exists");
                }

                if (existingMobileNo === userPhone) {
                    throw new Error("Mobile number already exists");
                }

                if (existingAdhaarNo === userAdhar) {
                    throw new Error("Aadhaar number already exists");
                }
            }
        }

        // Append data to the sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetID,
            range: "Sheet1!A:L",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [
                        userName,
                        userPhone,
                        userEmail,
                        userAdhar,
                        userAddress,
                        userCity,
                        userPincode,
                        userState,
                        userQuota,
                        userSize,
                        sonOf || "-",
                        inlineRadioOptions || "-",
                    ],
                ],
            },
        });

        res.status(200).send({ message: "Success" });
    } catch (error: any) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

app.post("/checkDuplicacy",async (req, res): Promise<void> => {
    try {
        const spreadsheetID = process.env.SPREADSHEETID;
        const {
            userName,
            userPhone,
            userEmail,
            userAdhar,
            userAddress,
            userCity,
            userPincode,
            userState,
            userQuota,
            userSize,

        } = req.body;

        // Log data for debugging
        console.log("Received data:", req.body);

        // Validate required fields
        if (
            !userName ||
            !userPhone ||
            !userEmail ||
            !userAdhar ||
            !userAddress ||
            !userCity ||
            !userPincode ||
            !userState ||
            !userQuota ||
            !userSize
        ) {
            throw new Error("All fields are required");
        }

        // Validate specific fields
        if (userPhone.length !== 10 || isNaN(Number(userPhone))) {
            throw new Error("Phone number should be 10 digits");
        }

        if (userAdhar.length !== 12 || isNaN(Number(userAdhar))) {
            throw new Error("Aadhaar number should be 12 digits");
        }

        if (!/\S+@\S+\.\S+/.test(userEmail)) {
            throw new Error("Invalid email ID");
        }

        // Fetch existing data from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetID,
            range: "Sheet1!A:L", // Adjust range to include all columns
        });

        const rows = response.data.values;

        if (rows && rows.length > 1) {
            for (let i = 1; i < rows.length; i++) {
                const [existingEmail, existingMobileNo, existingAdhaarNo] = [
                    rows[i][2],
                    rows[i][1],
                    rows[i][3],
                ];

                if (existingEmail === userEmail) {
                    throw new Error("Email ID already exists");
                }

                if (existingMobileNo === userPhone) {
                    throw new Error("Mobile number already exists");
                }

                if (existingAdhaarNo === userAdhar) {
                    throw new Error("Aadhaar number already exists");
                }
            }
        }

        res.status(200).send({ message: "Success" });
    } catch (error: any) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    } 
});


app.post("/getStatus", async (req, res): Promise<void> => {
    try {
        const spreadsheetID = process.env.SPREADSHEETID;
        const { adhaarNo } = req.body;

        // Validate Aadhaar number
        if (!adhaarNo || adhaarNo.length !== 12) {
            throw new Error('Invalid Aadhaar number');
        }

        // Fetch the data from the Google Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetID,
            range: 'Sheet1!A:N', // Adjusted to cover all relevant columns (A to M)
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            throw new Error('No data found');
        }

        let status = null;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][3] === adhaarNo) { // Aadhaar Card No is at index 3
                status = rows[i][12]; // Status is at index 11 (12th column)
                break;
            }
        }

        if (status !== null) {
            res.status(200).json({ message: status || 'Processing' });
        } else {
            throw new Error('No matching Aadhaar number found');
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});



export default app;
