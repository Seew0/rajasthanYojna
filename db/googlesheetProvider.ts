import {google} from 'googleapis';
import dotenv from 'dotenv';    
dotenv.config();    

const auth = new google.auth.GoogleAuth({
  keyFile: "./skyverse-441609-214d7fd90a8a.json",
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({version: 'v4', auth});

export default sheets;