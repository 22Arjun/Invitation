/**
 * Every word on the site lives here, in English and Hindi.
 * Names, dates and family details are taken from the printed invitation card.
 * In headings, *asterisks* mark the italic accent word and "\n" forces a line break.
 */

export type Lang = "en" | "hi";
export type Text = Record<Lang, string>;

export const COUPLE = {
  groom: {
    name: { en: "Harshraj", hi: "हर्षराज" },
    full: { en: "Harshraj Singh", hi: "हर्षराज सिंह" },
    honorific: { en: "Chi. Ku.", hi: "चि. कु." },
    family: { en: "Rajawat family", hi: "राजावत परिवार" },
    initial: { en: "H", hi: "ह" },
    lineage: [
      {
        label: { en: "Grandson of", hi: "सुपौत्र" },
        value: {
          en: "Smt. Urmila Devi & Shri Krishnapal Singh Rajawat",
          hi: "श्रीमती उर्मिलादेवी – श्री कृष्णपालसिंह राजावत",
        },
      },
      {
        label: { en: "Son of", hi: "सुपुत्र" },
        value: {
          en: "Late Smt. Shyama Devi & Shri Rampratap Singh Rajawat",
          hi: "स्व. श्रीमती श्यामादेवी – श्री रामप्रतापसिंह राजावत",
        },
      },
    ],
  },
  bride: {
    name: { en: "Archana", hi: "अर्चना" },
    full: { en: "Archana", hi: "अर्चना" },
    honorific: { en: "Sau. Ka.", hi: "सौ. का." },
    family: { en: "Bhadauria family", hi: "भदौरिया परिवार" },
    initial: { en: "A", hi: "अ" },
    lineage: [
      {
        label: { en: "Granddaughter of", hi: "सुपौत्री" },
        value: {
          en: "Late Smt. Shanti Devi & Late Shri Randhir Singh Bhadauria",
          hi: "स्व. श्रीमती शान्तिदेवी – स्व. श्री रणधीरसिंह भदौरिया",
        },
      },
      {
        label: { en: "Daughter of", hi: "सुपुत्री" },
        value: {
          en: "Smt. Meera Devi & Shri Nathu Singh Bhadauria",
          hi: "श्रीमती मीरा देवी – श्री नाथूसिंह भदौरिया",
        },
      },
    ],
  },
} as const;

export const SHLOKA = {
  lines: ["वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।", "निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"],
  translation: {
    en: "O Lord of the curved trunk and mighty form, radiant as a million suns — free every endeavour of ours from obstacles, always.",
    hi: "हे वक्रतुण्ड, महाकाय, करोड़ों सूर्यों के समान तेजस्वी प्रभु — हमारे सभी कार्य सदैव निर्विघ्न पूर्ण करें।",
  },
};

export type WeddingEvent = {
  id: string;
  title: Text;
  /** Short name for date lines, e.g. "Lagun & Phaldan" on 19 Nov, "Shubh Vivah" on 25 Nov. */
  short: Text;
  subtitle: Text;
  /** ISO start; events without a printed time start at midnight IST. */
  start: string;
  allDay: boolean;
  weekday: Text;
  day: string;
  month: Text;
  time?: Text;
  venue?: Text;
  description: Text;
  image: string;
  imageAlt: Text;
  tone: "marigold" | "haldi" | "sindoor" | "rose";
};

export const EVENTS: WeddingEvent[] = [
  {
    id: "lagun",
    title: { en: "Lagun, Phaldan *&* Preetibhoj", hi: "लगुन, फलदान *एवं* प्रीतिभोज" },
    short: { en: "Lagun & Phaldan", hi: "लगुन व फलदान" },
    subtitle: { en: "The auspicious beginning", hi: "मांगलिक शुभारंभ" },
    start: "2026-11-19T17:00:00+05:30",
    allDay: false,
    weekday: { en: "Thursday", hi: "गुरुवार" },
    day: "19",
    month: { en: "November 2026", hi: "नवंबर 2026" },
    time: { en: "5 PM onwards", hi: "सायं 5 बजे से" },
    venue: { en: "Banke Bihari Marriage Garden, Bhind", hi: "बांके बिहारी मैरिज गार्डन, भिंड" },
    description: {
      en: "The lagan is received with reverence, the bride's family honours the groom with fruits, sweets and blessings in the phaldan, and the evening unfolds into a grand feast of togetherness — the preetibhoj.",
      hi: "शुभ लग्न का सादर स्वागत, फलदान की रस्म में वधु पक्ष द्वारा वर को फल, मिष्ठान्न एवं आशीर्वाद, और फिर अपनों के संग स्नेह से सजा प्रीतिभोज।",
    },
    image: "/images/event-lagun.jpg",
    imageAlt: { en: "A puja thali with kumkum, rice and flowers", hi: "कुमकुम, अक्षत और फूलों से सजी पूजा की थाली" },
    tone: "marigold",
  },
  {
    id: "mandap",
    title: { en: "*The* Mandap", hi: "मण्डप" },
    short: { en: "Mandap", hi: "मण्डप" },
    subtitle: { en: "Raising the sacred canopy", hi: "पवित्र मण्डप की स्थापना" },
    start: "2026-11-24T00:00:00+05:30",
    allDay: true,
    weekday: { en: "Tuesday", hi: "मंगलवार" },
    day: "24",
    month: { en: "November 2026", hi: "नवंबर 2026" },
    description: {
      en: "The mandap is raised and blessed. Haldi, mangal geet and age-old family rituals paint the day in turmeric gold as the wedding draws near.",
      hi: "मण्डप की स्थापना एवं पूजन — हल्दी, मंगल गीत और पारंपरिक रस्मों से सजा, हल्दी-सा सुनहरा दिन।",
    },
    image: "/images/event-mandap.jpg",
    imageAlt: { en: "A mandap decorated with marigolds", hi: "गेंदे के फूलों से सजा मण्डप" },
    tone: "haldi",
  },
  {
    id: "panigrahan",
    title: { en: "Tika *&* Panigrahan Sanskar", hi: "टीका *एवं* पाणिग्रहण संस्कार" },
    short: { en: "Shubh Vivah", hi: "शुभ विवाह" },
    subtitle: { en: "The wedding", hi: "शुभ विवाह" },
    start: "2026-11-25T00:00:00+05:30",
    allDay: true,
    weekday: { en: "Wednesday", hi: "बुधवार" },
    day: "25",
    month: { en: "November 2026", hi: "नवंबर 2026" },
    description: {
      en: "The tika honours and welcomes the groom, and in the sacred panigrahan the couple take each other's hand before the holy fire — seven vows, two families, one lifetime.",
      hi: "टीके की रस्म से वर का सत्कार, और अग्नि को साक्षी मानकर पाणिग्रहण संस्कार — सात वचन, दो परिवार, एक जीवन।",
    },
    image: "/images/event-panigrahan.jpg",
    imageAlt: { en: "The sacred fire of the wedding rites", hi: "विवाह संस्कार की पवित्र अग्नि" },
    tone: "sindoor",
  },
  {
    id: "vadhu-aagman",
    title: { en: "Vadhu *Aagman*", hi: "वधु *आगमन*" },
    short: { en: "Vadhu Aagman", hi: "वधु आगमन" },
    subtitle: { en: "Welcoming the bride home", hi: "नववधु का गृह-प्रवेश" },
    start: "2026-11-26T00:00:00+05:30",
    allDay: true,
    weekday: { en: "Thursday", hi: "गुरुवार" },
    day: "26",
    month: { en: "November 2026", hi: "नवंबर 2026" },
    description: {
      en: "The new bride is welcomed into her new home with aarti, a kalash of rice at the threshold and a doorway full of family, laughter and love.",
      hi: "आरती, देहरी पर चावल भरा कलश और पूरे परिवार के स्नेह व उल्लास के साथ नववधु का स्वागत।",
    },
    image: "/images/event-vadhu-aagman.jpg",
    imageAlt: { en: "A doorway decorated for a welcome", hi: "स्वागत के लिए सजा द्वार" },
    tone: "rose",
  },
];

/** The two dates guests most need: the Lagun & Phaldan (19 Nov) and the wedding itself (25 Nov). */
export const KEY_EVENTS = EVENTS.filter((e) => e.id === "lagun" || e.id === "panigrahan");

export const VENUE = {
  name: { en: "Banke Bihari Marriage Garden", hi: "बांके बिहारी मैरिज गार्डन" },
  address: {
    en: "Hewatpura Road, Gandhi Nagar, Bhind (M.P.)",
    hi: "हेवतपुरा रोड, गाँधी नगर, भिंड (म.प्र.)",
  },
  mapsQuery: "Banke Bihari Marriage Garden, Hewatpura Road, Gandhi Nagar, Bhind, Madhya Pradesh",
};

const name = (en: string, hi: string): Text => ({ en, hi });

export const FAMILY = {
  senders: {
    title: { en: "Sent with love by", hi: "प्रेषक" },
    names: [
      name("Shri Krishnapal Singh Rajawat", "श्री कृष्णपाल सिंह राजावत"),
      name("Shri Shivpratap Singh Rajawat", "श्री शिवप्रताप सिंह राजावत"),
      name("Shri Rampratap Singh Rajawat", "श्री रामप्रताप सिंह राजावत"),
      name("Dr. Ompratap Singh Rajawat", "डॉ. ओमप्रताप सिंह राजावत"),
    ],
    address: name("10, Rajawat Niwas, Virendra Nagar, Bhind (M.P.)", "10, राजावत निवास, वीरेंद्र नगर, भिंड (म.प्र.)"),
  },
  vineet: {
    title: { en: "With humble regards", hi: "विनीत" },
    names: [
      name("Shri Vijaypal Singh", "श्री विजयपाल सिंह"),
      name("Shri Yashpal Singh", "श्री यशपाल सिंह"),
      name("Shri Veerpal Singh", "श्री वीरपाल सिंह"),
      name("Shri Shishupal Singh", "श्री शिशुपाल सिंह"),
    ],
  },
  darshanabhilashi: {
    title: { en: "Eagerly awaiting your presence", hi: "दर्शनाभिलाषी" },
    names: [
      name("Shri Harendra Singh (Patel)", "श्री हरेंद्र सिंह (पटेल)"),
      name("Dhirendra Singh (Anna)", "धीरेन्द्र सिंह (अन्ना)"),
      name("Bhanupratap Singh", "भानुप्रताप सिंह"),
      name("Pravendra Singh", "प्रवेन्द्र सिंह"),
      name("Aditya Singh", "आदित्य सिंह"),
      name("Vishwapratap Singh", "विश्वप्रताप सिंह"),
      name("Shaktipratap Singh", "शक्तिप्रताप सिंह"),
      name("Vikrampratap Singh", "विक्रमप्रताप सिंह"),
      name("Omveer Singh", "ओमवीर सिंह"),
      name("Ankit Singh", "अंकित सिंह"),
      name("Keshav Singh", "केशव सिंह"),
      name("Vijaypratap Singh", "विजयप्रताप सिंह"),
      name("Ajay Singh", "अजय सिंह"),
      name("Sanjay Singh", "संजय सिंह"),
      name("Anuj Singh", "अनुज सिंह"),
      name("Anuruddh Pratap", "अनुरुद्ध प्रताप"),
      name("Parth Singh", "पार्थ सिंह"),
      name("Neelendra", "नीलेन्द्र"),
      name("Debu", "देबू"),
      name("Bholu", "भोलू"),
      name("Shivin", "शिविन"),
      name("Shubhu", "शुभू"),
      name("Purvank", "पूर्वांक"),
      name("Raj", "राज"),
      name("Shivay", "शिवाय"),
      name("Samrat", "सम्राट"),
    ],
    footer: { en: "The entire Rajawat family", hi: "समस्त राजावत परिवार" },
  },
  buaPhoopha: {
    title: { en: "Bua & Phoopha ji", hi: "बुआ-फूफा जी" },
    names: [
      name("Smt. Mala & Late Shri Sushil Singh Chauhan", "श्रीमती माला – स्व. श्री सुशील सिंह चौहान"),
      name("Smt. Neetu & Shri Jitendra Singh Bhadauria", "श्रीमती नीतू – श्री जितेन्द्र सिंह भदौरिया"),
    ],
  },
  organiser: {
    title: { en: "Arrangements", hi: "व्यवस्थापक" },
    names: [name("Akhand Pratap Singh Chauhan (Tharu)", "अखण्ड प्रताप सिंह चौहान (थारू)")],
  },
};

export const BAL_MANUHAR = {
  title: { en: "A little plea from the little ones", hi: "बाल मनुहार" },
  lines: ["खुशियों की रात होगी, जश्न जरा डट के होगा", "मेरे चाचा की शादी में अंदाज जरा हट के होगा"],
  translation: [
    "A night full of joy, a celebration in full swing —",
    "at my chacha's wedding, the style will be one of a kind!",
  ],
  kids: { en: "Sachi, Jayvardhan & Ramya", hi: "सचि, जयवर्धन, रम्या" },
};

export const CONTACTS = ["74156-40052", "98263-33210", "90397-35199", "93400-43077"];

/** RSVPs open a WhatsApp chat with this number (the first contact on the card). */
export const RSVP_WHATSAPP = "917415640052";

export const UI = {
  invocation: "॥ श्री गणेशाय नमः ॥",
  menu: { en: "Menu", hi: "मेन्यू" },
  close: { en: "Close", hi: "बंद" },
  rsvp: { en: "RSVP", hi: "उपस्थिति" },
  skip: { en: "Skip to content", hi: "मुख्य सामग्री पर जाएँ" },
  nav: [
    { href: "#invitation", label: { en: "Invitation", hi: "आमंत्रण" } },
    { href: "#couple", label: { en: "The couple", hi: "वर-वधु" } },
    { href: "#celebrations", label: { en: "Celebrations", hi: "कार्यक्रम" } },
    { href: "#venue", label: { en: "Venue", hi: "कार्यक्रम स्थल" } },
    { href: "#blessings", label: { en: "Blessings", hi: "आशीर्वाद" } },
    { href: "#rsvp", label: { en: "RSVP", hi: "उपस्थिति" } },
  ],
  hero: {
    kicker: { en: "are getting married", hi: "सात फेरों की ओर" },
    place: { en: "Bhind, Madhya Pradesh", hi: "भिंड, मध्य प्रदेश" },
    badge: { en: "Shubh Vivah · scroll to enter · ", hi: "शुभ विवाह · स्वागतम् · " },
    sceneEyebrow: { en: "You are cordially invited", hi: "आप सपरिवार सादर आमंत्रित हैं" },
    sceneSub: {
      en: "to the wedding celebrations of Harshraj & Archana",
      hi: "हर्षराज एवं अर्चना के शुभ विवाह के मांगलिक अवसर पर",
    },
    sceneDates: { en: "Celebrations · 19 – 26 November 2026 · Bhind", hi: "मांगलिक कार्यक्रम · 19 – 26 नवंबर 2026 · भिंड" },
  },
  marquee: [
    { en: "Harshraj *&* Archana", hi: "हर्षराज *&* अर्चना" },
    { en: "*Lagun* & *Phaldan* · 19 November", hi: "*लगुन व फलदान* · 19 नवंबर" },
    { en: "*Shubh Vivah* · 25 November", hi: "*शुभ विवाह* · 25 नवंबर" },
    { en: "Bhind, Madhya Pradesh", hi: "भिंड, मध्य प्रदेश" },
  ],
  invitation: {
    eyebrow: { en: "Mangalik Parinay Aamantran", hi: "मांगलिक परिणय आमंत्रण" },
    body: {
      en: "With the blessings of Shri Ganesh and our elders, the Rajawat family joyfully invites you {0} to the wedding celebrations of their beloved Harshraj with Archana {1} and requests the honour of your presence {2} as two families become one.",
      hi: "श्री गणेश जी एवं पूज्य बुज़ुर्गों के आशीर्वाद से राजावत परिवार {0} अपने प्रिय हर्षराज एवं अर्चना के शुभ विवाह {1} के मांगलिक अवसर पर आपको सपरिवार सादर आमंत्रित करता है। {2} आपकी गरिमामयी उपस्थिति प्रार्थनीय है।",
    },
    sign: { en: "with love & regards", hi: "सादर" },
  },
  couple: {
    eyebrow: { en: "01 — The couple", hi: "01 — वर-वधु" },
    title: { en: "Two families,\n*one* celebration", hi: "दो परिवार,\n*एक* उत्सव" },
    with: { en: "with", hi: "संग" },
  },
  countdown: {
    eyebrow: { en: "Counting the moments", hi: "शुभ घड़ी की प्रतीक्षा" },
    until: { en: "Until the *celebrations* begin", hi: "मांगलिक कार्यक्रमों में *शेष*" },
    untilEvent: { en: "until", hi: "तक" },
    units: [
      { en: "Days", hi: "दिन" },
      { en: "Hours", hi: "घंटे" },
      { en: "Minutes", hi: "मिनट" },
      { en: "Seconds", hi: "सेकंड" },
    ],
    married: { en: "Just *married*", hi: "शुभ *विवाह* सम्पन्न" },
    marriedNote: {
      en: "Thank you for every blessing. Our hearts are full.",
      hi: "आपके आशीर्वाद के लिए हृदय से आभार।",
    },
    addToCalendar: { en: "Add to calendar", hi: "कैलेंडर में जोड़ें" },
    google: { en: "or Google Calendar", hi: "या गूगल कैलेंडर" },
  },
  celebrations: {
    eyebrow: { en: "02 — Celebrations", hi: "02 — कार्यक्रम" },
    title: { en: "Mangalik *karyakram*", hi: "मांगलिक कार्यक्रम *एवं तिथियां*" },
    lede: {
      en: "Four auspicious days, each with its own colour, its own rituals and its own reasons to celebrate.",
      hi: "चार मांगलिक दिन — हर दिन का अपना रंग, अपनी रस्में और खुशियाँ मनाने का अपना बहाना।",
    },
    familyRitual: { en: "Family ritual", hi: "पारिवारिक रस्म" },
  },
  shringaar: {
    eyebrow: { en: "03 — Colours of the celebration", hi: "03 — उत्सव के रंग" },
    title: { en: "Rang, *rasmein*\n& raunak", hi: "रंग, *रस्में*\nऔर रौनक" },
    hint: { en: "Keep scrolling", hi: "स्क्रॉल करते रहें" },
    swipe: { en: "Swipe to explore", hi: "देखने के लिए स्वाइप करें" },
  },
  venue: {
    eyebrow: { en: "04 — Venue", hi: "04 — कार्यक्रम स्थल" },
    when: { en: "Lagun, Phaldan & Preetibhoj · Thursday 19 November, 5 PM", hi: "लगुन, फलदान एवं प्रीतिभोज · गुरुवार 19 नवंबर, सायं 5 बजे" },
    directions: { en: "Get directions", hi: "रास्ता देखें" },
    gettingThere: { en: "Getting there", hi: "कैसे पहुँचें" },
    travel: [
      { label: { en: "By air", hi: "हवाई मार्ग" }, value: { en: "Gwalior Airport, about 80 km by road", hi: "ग्वालियर हवाई अड्डा, सड़क मार्ग से लगभग 80 किमी" } },
      { label: { en: "By rail", hi: "रेल मार्ग" }, value: { en: "Bhind Railway Station, a short drive away", hi: "भिंड रेलवे स्टेशन, कुछ ही दूरी पर" } },
    ],
    ring: { en: "Banke Bihari Marriage Garden ✦ Bhind ✦ ", hi: "बांके बिहारी मैरिज गार्डन ✦ भिंड ✦ " },
  },
  blessings: {
    eyebrow: { en: "05 — With blessings", hi: "05 — आशीर्वाद एवं निवेदन" },
    title: { en: "With the love\nof *our families*", hi: "अपनों के\n*स्नेह* के साथ" },
  },
  rsvpSection: {
    eyebrow: { en: "06 — RSVP", hi: "06 — उपस्थिति" },
    title: { en: "Will you *bless us*\nwith your presence?", hi: "क्या आप अपनी\n*उपस्थिति* से शोभा बढ़ाएँगे?" },
    lede: {
      en: "Let the family know you're coming. Your reply opens WhatsApp with a message ready to send.",
      hi: "परिवार को अपने आगमन की सूचना दें। फ़ॉर्म भरते ही व्हाट्सऐप पर आपका संदेश तैयार मिलेगा।",
    },
    name: { en: "Your name(s)", hi: "आपका नाम" },
    phone: { en: "Phone number", hi: "फ़ोन नंबर" },
    attending: { en: "Will you be there?", hi: "क्या आप पधारेंगे?" },
    yes: { en: "*Joyfully* attending", hi: "*अवश्य* पधारेंगे" },
    no: { en: "Sending *blessings* from afar", hi: "दूर से *आशीर्वाद*" },
    guests: { en: "Guests in your party", hi: "आपके साथ कुल सदस्य" },
    fewer: { en: "Fewer guests", hi: "कम करें" },
    more: { en: "More guests", hi: "बढ़ाएँ" },
    which: { en: "Which ceremonies will you join?", hi: "किन कार्यक्रमों में शामिल होंगे?" },
    message: { en: "Blessings for the couple", hi: "वर-वधु के लिए आशीर्वाद" },
    optional: { en: "(optional)", hi: "(वैकल्पिक)" },
    submit: { en: "Send RSVP on WhatsApp", hi: "व्हाट्सऐप पर भेजें" },
    required: { en: "Please fill this in", hi: "कृपया यह भरें" },
    phoneInvalid: { en: "Please enter a valid phone number", hi: "कृपया सही फ़ोन नंबर लिखें" },
    choose: { en: "Please choose one", hi: "कृपया एक विकल्प चुनें" },
    thanksTitleYes: { en: "Dhanyavaad, {name}!", hi: "धन्यवाद, {name}!" },
    thanksTitleNo: { en: "Thank you, {name}", hi: "धन्यवाद, {name}" },
    thanksYes: {
      en: "We can't wait to celebrate with you in Bhind. If WhatsApp didn't open, use the button below.",
      hi: "भिंड में आपके स्वागत की प्रतीक्षा रहेगी। यदि व्हाट्सऐप नहीं खुला, तो नीचे दिए बटन का उपयोग करें।",
    },
    thanksNo: {
      en: "You'll be missed — your blessings mean the world to us. If WhatsApp didn't open, use the button below.",
      hi: "आपकी कमी खलेगी — आपका आशीर्वाद हमारे लिए अनमोल है। यदि व्हाट्सऐप नहीं खुला, तो नीचे दिए बटन का उपयोग करें।",
    },
    openWhatsApp: { en: "Open WhatsApp", hi: "व्हाट्सऐप खोलें" },
    edit: { en: "Edit your reply", hi: "उत्तर बदलें" },
  },
  footer: {
    contact: { en: "Contact", hi: "संपर्क" },
    line: { en: "Your presence is our greatest blessing.", hi: "आपकी उपस्थिति ही हमारा सबसे बड़ा आशीर्वाद है।" },
    top: { en: "Back to the top · back to the top · ", hi: "ऊपर चलें · ऊपर चलें · " },
    made: { en: "Made with love for the Rajawat & Bhadauria families", hi: "राजावत एवं भदौरिया परिवार के लिए स्नेह से निर्मित" },
    credits: { en: "Photo credits", hi: "छायाचित्र श्रेय" },
  },
  langSwitch: { en: "हिन्दी में देखें", hi: "View in English" },
} as const;

export type GalleryItem = { src: string; alt: Text; word: Text; shape: "tall" | "wide" | "square"; position?: string };

/** Detail photographs for the horizontal gallery. Captions pair a Hindi word with its English meaning. */
export const GALLERY: GalleryItem[] = [
  { src: "/images/gallery-01.jpg", alt: { en: "Two hands with fresh mehendi", hi: "ताज़ा मेहँदी रचे दो हाथ" }, word: { hi: "मेहँदी", en: "Mehendi" }, shape: "square", position: "45% 50%" },
  { src: "/images/gallery-07.jpg", alt: { en: "A groom's sherwani with a red safa", hi: "लाल साफ़े के साथ दूल्हे की शेरवानी" }, word: { hi: "साफ़ा", en: "The safa" }, shape: "tall", position: "50% 35%" },
  { src: "/images/gallery-04.jpg", alt: { en: "Heaps of marigold garlands", hi: "गेंदे की मालाओं के ढेर" }, word: { hi: "गेंदा", en: "Marigold" }, shape: "wide" },
  { src: "/images/gallery-03.jpg", alt: { en: "A bridal gold choker and mangalsutra", hi: "दुल्हन का स्वर्ण हार और मंगलसूत्र" }, word: { hi: "मंगलसूत्र", en: "Mangalsutra" }, shape: "square", position: "40% 62%" },
  { src: "/images/event-phaldan.jpg", alt: { en: "A tray of mithai dusted with pistachio", hi: "पिस्ते से सजी मिठाई की थाली" }, word: { hi: "मिठाई", en: "Mithai" }, shape: "tall", position: "50% 60%" },
  { src: "/images/gallery-06.jpg", alt: { en: "A colourful rangoli with a lit diya", hi: "जलते दीये के साथ रंगोली" }, word: { hi: "रंगोली", en: "Rangoli" }, shape: "wide" },
  { src: "/images/gallery-10.jpg", alt: { en: "A bride's foot with alta and a silver payal", hi: "आलता और चाँदी की पायल" }, word: { hi: "आलता", en: "Alta" }, shape: "wide", position: "65% 55%" },
  { src: "/images/gallery-08.jpg", alt: { en: "Hennaed hands held together with the sacred thread", hi: "मौली के साथ थामे हुए मेहँदी रचे हाथ" }, word: { hi: "हाथों में हाथ", en: "Hand in hand" }, shape: "tall", position: "60% 45%" },
  { src: "/images/gallery-05.jpg", alt: { en: "A lit diya beside yellow marigolds", hi: "गेंदे के फूलों के पास जलता दीया" }, word: { hi: "दीया", en: "Diya" }, shape: "square", position: "40% 55%" },
  { src: "/images/gallery-02.jpg", alt: { en: "Hands in red chooda searching a platter of marigold petals", hi: "गेंदे की पंखुड़ियों की थाली में चूड़े वाले हाथ" }, word: { hi: "रस्में", en: "Rituals" }, shape: "wide", position: "50% 55%" },
  { src: "/images/event-preetibhoj.jpg", alt: { en: "Paneer in a copper handi with naan", hi: "ताँबे की हांडी में पनीर और नान" }, word: { hi: "प्रीतिभोज", en: "The feast" }, shape: "tall", position: "50% 60%" },
  { src: "/images/gallery-09.jpg", alt: { en: "Gold and maroon bangles on red fabric", hi: "लाल कपड़े पर सुनहरी-मैरून चूड़ियाँ" }, word: { hi: "चूड़ियाँ", en: "Bangles" }, shape: "square", position: "40% 55%" },
];

/** CC BY-SA photos need a visible credit; everything else is Unsplash License or CC0. */
export const PHOTO_CREDITS = [
  { title: "Indian Culture Wedding (5)", creator: "AmanAgrahari01", url: "https://commons.wikimedia.org/wiki/File:Indian_Culture_Wedding_(5)_07.jpg" },
  { title: "MEHNDI-93", creator: "Antony Trivet", url: "https://commons.wikimedia.org/wiki/File:MEHNDI-93.jpg" },
];
