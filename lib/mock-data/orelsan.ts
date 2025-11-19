export const orelsanData = {
    id: "orelsan",
    name: "Orelsan",
    image: "https://i.scdn.co/image/ab6761610000e5eb2c77880163b833d5e97b4982", // Placeholder or real URL if available
    stats: {
        weeklyListeners: 12345,
        monthlyListeners: 45678,
        totalStreams: 1500000,
        rank: 1,
    },
    trends: {
        weekly: [
            { day: "Mon", listeners: 1200 },
            { day: "Tue", listeners: 1500 },
            { day: "Wed", listeners: 1800 },
            { day: "Thu", listeners: 1400 },
            { day: "Fri", listeners: 2200 },
            { day: "Sat", listeners: 2500 },
            { day: "Sun", listeners: 1900 },
        ],
        monthly: [
            { week: "W1", listeners: 8000 },
            { week: "W2", listeners: 9500 },
            { week: "W3", listeners: 11000 },
            { week: "W4", listeners: 10500 },
        ],
    },
    timeDistribution: [
        { hour: "00-04", count: 50 },
        { hour: "04-08", count: 10 },
        { hour: "08-12", count: 300 },
        { hour: "12-16", count: 450 },
        { hour: "16-20", count: 600 },
        { hour: "20-24", count: 200 },
    ],
    topSongs: [
        { title: "La Terre est ronde", plays: 5400, duration: "3:39" },
        { title: "Basique", plays: 4800, duration: "2:43" },
        { title: "San", plays: 4200, duration: "4:02" },
        { title: "L'odeur de l'essence", plays: 3900, duration: "4:42" },
        { title: "Jour meilleur", plays: 3500, duration: "3:32" },
    ],
    topAlbum: {
        title: "Civilisation",
        cover: "https://i.scdn.co/image/ab67616d0000b2735858678a1131435f5387e9f7",
        year: 2021,
        totalPlays: 85000,
    },
    associatedArtists: [
        { name: "Gringe", image: "https://i.scdn.co/image/ab6761610000e5eb55d698816219459507739550" },
        { name: "Vald", image: "https://i.scdn.co/image/ab6761610000e5eb4487503e578844855437651d" },
        { name: "Damso", image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0" },
        { name: "Angèle", image: "https://i.scdn.co/image/ab6761610000e5eb31a32d7966855b3cc8688a4c" },
    ],
};
