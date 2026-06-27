export type Language = "en" | "hi";

export const translations = {
  en: {
    // General
    welcome: "Welcome to Udaan Care",
    choose_language: "Choose your language",
    
    // Login
    patient_id: "Patient ID",
    pin: "4-Digit PIN",
    invalid_login: "Invalid Patient ID or PIN. Please contact the clinic.",
    login_button: "View Progress",
    logging_in: "Logging in...",
    forgot_pin: "Forgot PIN?",
    contact_clinic: "Contact Udaan Care",
    no_id: "Don't have your ID?",

    // Navigation
    nav_home: "Home",
    nav_appointments: "Bookings",
    nav_notes: "Notes",
    nav_profile: "Profile",

    // Dashboard
    hello: "Hello",
    your_child: "Your Child",
    age: "Age",
    assigned_doctor: "Assigned Doctor",
    progress_summary: "Progress Summary",
    goals_achieved: "Goals Achieved",
    next_appointment: "Next Appointment",
    no_upcoming: "No upcoming appointments.",
    book_new_session: "Book New Session",
    recent_notes: "Recent Doctor Notes",
    view_all_notes: "View all notes",

    // Appointments
    my_appointments: "My Appointments",
    upcoming: "Upcoming",
    past: "Past",
    join_zoom: "Join Zoom",
    status_paid: "Paid",
    status_pending: "Pending",
    
    // Notes
    therapy_notes: "Therapy Notes",
    no_notes: "No notes available yet.",

    // Profile
    sign_out: "Sign Out",
    profile: "Profile Settings",
  },
  hi: {
    // General
    welcome: "उड़ान केयर में आपका स्वागत है",
    choose_language: "अपनी भाषा चुनें",
    
    // Login
    patient_id: "रोगी आईडी (Patient ID)",
    pin: "4-अंकीय पिन (PIN)",
    invalid_login: "अमान्य रोगी आईडी या पिन। कृपया क्लिनिक से संपर्क करें।",
    login_button: "प्रगति देखें (View Progress)",
    logging_in: "लॉग इन हो रहा है...",
    forgot_pin: "पिन भूल गए?",
    contact_clinic: "उड़ान केयर से संपर्क करें",
    no_id: "क्या आपके पास आईडी नहीं है?",

    // Navigation
    nav_home: "होम",
    nav_appointments: "बुकिंग",
    nav_notes: "नोट्स",
    nav_profile: "प्रोफ़ाइल",

    // Dashboard
    hello: "नमस्ते",
    your_child: "आपका बच्चा",
    age: "आयु",
    assigned_doctor: "नियुक्त डॉक्टर",
    progress_summary: "प्रगति सारांश",
    goals_achieved: "लक्ष्य प्राप्त किए",
    next_appointment: "अगली अपॉइंटमेंट",
    no_upcoming: "कोई आगामी अपॉइंटमेंट नहीं है।",
    book_new_session: "नया सेशन बुक करें",
    recent_notes: "हाल के डॉक्टर नोट्स",
    view_all_notes: "सभी नोट्स देखें",

    // Appointments
    my_appointments: "मेरी अपॉइंटमेंट",
    upcoming: "आगामी",
    past: "पिछली",
    join_zoom: "ज़ूम से जुड़ें",
    status_paid: "भुगतान हो गया",
    status_pending: "लंबित",
    
    // Notes
    therapy_notes: "थेरेपी नोट्स",
    no_notes: "अभी तक कोई नोट्स उपलब्ध नहीं हैं।",

    // Profile
    sign_out: "लॉग आउट करें",
    profile: "प्रोफ़ाइल सेटिंग्स",
  }
};

export type TranslationKey = keyof typeof translations.en;
