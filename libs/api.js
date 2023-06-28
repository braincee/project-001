const Api = {
    getYouTubers: async () => {
        const response = await fetch('/api/youtuber/all');
        const results = await response.json();
        return results;
    },
    getCaptions: async () => {
        const response = await fetch('/api/caption/all');
        const results = await response.json();
        return results
    },
    addYoutuber: async (youtuberData) => {
        const JSONData = JSON.stringify(youtuberData);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONData,
        }
        const response = await fetch('/api/youtuber/add', options);
        const results = await response.json()
        return results;
    },
    addCaption: async (captionData) => {
        const JSONData = JSON.stringify(captionData);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONData,
        }
        const response = await fetch('/api/youtuber/add', options);
        const results = await response.json()
        return results;
    },
}

export default Api;