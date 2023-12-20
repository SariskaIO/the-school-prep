import { GENERATE_TOKEN_URL } from "../constants";

export async function getToken(profile, name, avatarColor, isModerator) {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: process.env.REACT_APP_API_KEY,
            user: {
                id: profile.id,
                avatar: avatarColor,
                name: name,
                email: profile.email,
                moderator: isModerator
            },
            exp: "48 hours"
        })
    };

    
    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("SARISKA_TOKEN", json.token);
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log('error', error);
    }
}

export function generateMeetingId() {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const str = generateString(9).trim()
    const strArr = str.match(/.{3}/g);
    return strArr.join("-");
}

export function generateParticipantName() {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const str = generateString(6).trim()
    const strArr = str.match(/.{3}/g);
    return strArr.join("_");
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}