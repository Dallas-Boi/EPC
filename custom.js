// Index.js@209 - Logs to ./data/*
const axios = require("axios")
const fs = require("fs")
// Player Name
const name = JSON.parse(fs.readFileSync('config.json'))["thisPlayerName"]

// This will log the shift to the google sheet
async function sendShift(data) {
    // Form Data values
    try {
        // Sets Form Data
        var formData = {
            "entry.1036733309": name,
            "entry.1964103007_hour": "00", 
            "entry.1964103007_minute": "00",
            "entry.1964103007_second": "00",
            "entry.400148135": "Nothing", // Court Cases
            "entry.2089831011": data["notes"], // Notes
            "entry.150026211": "Nothing", // Incidents
            "entry.21180222_hour": "0",
            "entry.21180222_minute": "0",
            "entry.21180222_second": "0",
        }
       
        // Sets the Start Time
        var date = new Date(data.start)
        formData["entry.1964103007_hour"] = date.getHours()
        formData["entry.1964103007_minute"] = date.getMinutes()
        formData["entry.1964103007_second"] = date.getSeconds()
        // Sets the Court Cases
        for (var cases of data["courtCases"]) {
            // Adds each court case to the formData value
            formData["entry.400148135"] += `${cases}, `
        }
        // Sets the Incidents
        for (let ind of data["incidents"]) {
            formData["entry.150026211"] += `${ind}, `
        }
        // Sets the End Time
        if (data["end"]) {
            date = new Date(data.end)
            formData["entry.21180222_hour"] = date.getHours()
            formData["entry.21180222_minute"] = date.getMinutes()
            formData["entry.21180222_second"] = date.getSeconds()
        }
        
        // Sends the Form Submit
        const response = await axios.post("https://docs.google.com/forms/u/0/d/e/1FAIpQLScgfixpkkGhAM0MSOOsGZMqPym3O5S42lVfdmVpJ4RUELV-Nw/formResponse", formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        console.log('Form submitted successfully');
        console.log('Response:', response.code);
    } catch (error) {
        //console.log(formData)
        console.error('Error submitting form:', error.code);
    }
}

// This will send the courtData that the client submits
async function sendCourt(data) {
    console.log(data)
    try {
        var formData = {
            "entry.1629094615": data["type"], // Report Type
            "entry.731472255": name, // Players Name
            "entry.563849467": data["ped"], // Ped Name
            "entry.948038162": "Nothing", // Charges
            "entry.593358758": data["number"], // Case Number
            "entry.1336985662": data["description"], // Description
            "entry.150552247": "0", // Fines
            "entry.272516029": "0", // Jail ( Months )
            "entry.651389333": "0", // Jail ( Years )
            pageHistory: "0,1"
        }
        // This will get the fines / jail time and sort them
        // 0 = Fines | 1 = month | 2 = year | 3 = probation
        var out = ["0", "0", "0"]
        // 'Fine: $9,609<br>Jail: 1yr. 10mth.',
        var li = data["outcome"].split("<br>")
        console.log(li)
        li[0] = li[0].replace("Fine: $", "")
        // If the ped got jail time
        if (li[1]) {
            li[1] = li[1].replace("Jail: ", "")
            li[1] = li[1].split(". ")
            // Checks if its years or months
            for (var i=0; i < li[1].length; i++) {
                li[1][i] = li[1][i].replace(".", "")
                if (li[1][i].includes("yr")) {out[2] = li[1][i].replace("yr", "")}
                else if (li[1][i].includes("mth")) {out[1] = li[1][i].replace("mth", "")}
            }
            console.log(out)
        }
        // Changes the values
        formData["entry.150552247"] = li[0]
        formData["entry.272516029"] = out[1]
        formData["entry.651389333"] = out[2]
        formData["entry.948038162"] = data["charges_raw"]
        // Sends the Form Submit
        const response = await axios.post("https://docs.google.com/forms/u/0/d/e/1FAIpQLSd8ObB3c8a2jiAfJLWWGl2OztO_DLCWufqsS4ky7XqGEXjZ5w/formResponse", formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        console.log('Form submitted successfully');
        console.log('Response:', response.status);
    } catch (error) {
        //console.log(formData)
        console.error('Error submitting form:', error.code);
    }
}

module.exports = {
    sendShift,
    sendCourt
}