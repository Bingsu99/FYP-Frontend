const patientLinks = [
    { name: 'Home', path: '/patient' },
    { name: 'Activities', path: '/patient/activities' },
];

const therapistLinks = [
    { name: 'Patients', path: '/therapist' },
    { name: 'Decks', path: '/therapist/decks' },
    { name: 'AI Decks', path: '/therapist/AIDecks' },
    { name: 'Create', path: '/therapist/create' },
];

const caregiverLinks = [
    { name: 'Patients', path: '/caregiver' },
    { name: 'Decks', path: '/caregiver/decks' },
    { name: 'AI Decks', path: '/caregiver/AIDecks' },
];

const links = {
    patient:patientLinks,
    therapist:therapistLinks,
    caregiver:caregiverLinks,
}

export default links;