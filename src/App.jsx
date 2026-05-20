import { useState, useEffect, useMemo } from "react";

// ─────────────────────────────────────────────────────────────
// VOCABULARY DATA — 300 Most Frequent Quranic Words
// ─────────────────────────────────────────────────────────────
const VOCAB = [
  // LEVEL 1 — Essential Core
  { id:1,  arabic:"اللَّهُ", tr:"Allāhu",    en:"Allah / God",               ru:"Аллах / Бог",                    cat:"noun",        sec:1, rank:1,   ex:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ — Allah, there is no deity except Him" },
  { id:2,  arabic:"رَبّ",   tr:"Rabb",      en:"Lord / Sustainer",          ru:"Господь / Владыка",              cat:"noun",        sec:1, rank:2,   ex:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ — Praise be to Allah, Lord of the worlds" },
  { id:3,  arabic:"مِن",    tr:"min",       en:"from / of",                 ru:"из / от",                        cat:"preposition", sec:1, rank:3,   ex:"مِن رَّبِّكَ — from your Lord" },
  { id:4,  arabic:"إِلَى",  tr:"ilā",       en:"to / toward",               ru:"к / до",                         cat:"preposition", sec:1, rank:4,   ex:"إِلَى اللَّهِ — to Allah" },
  { id:5,  arabic:"فِي",    tr:"fī",        en:"in / within",               ru:"в / внутри",                     cat:"preposition", sec:1, rank:5,   ex:"فِي السَّمَاوَاتِ — in the heavens" },
  { id:6,  arabic:"عَلَى",  tr:"ʿalā",      en:"on / upon / over",          ru:"на / над",                       cat:"preposition", sec:1, rank:6,   ex:"وَعَلَى اللَّهِ تَوَكَّلُوا — upon Allah rely" },
  { id:7,  arabic:"وَ",     tr:"wa",        en:"and",                       ru:"и",                              cat:"particle",    sec:1, rank:7,   ex:"وَاللَّهُ غَفُورٌ رَّحِيمٌ — Allah is Forgiving, Merciful" },
  { id:8,  arabic:"لَا",    tr:"lā",        en:"no / not",                  ru:"нет / не",                       cat:"particle",    sec:1, rank:8,   ex:"لَا إِلَٰهَ إِلَّا اللَّهُ — there is no god but Allah" },
  { id:9,  arabic:"هُوَ",   tr:"huwa",      en:"he / it (masc.)",           ru:"он",                             cat:"pronoun",     sec:1, rank:9,   ex:"هُوَ الْحَيُّ الْقَيُّومُ — He is the Ever-Living, the Sustainer" },
  { id:10, arabic:"قَالَ",  tr:"qāla",      en:"he said",                   ru:"он сказал",                      cat:"verb",        sec:1, rank:10,  ex:"قَالَ رَبِّي يَعْلَمُ — He said: My Lord knows" },
  { id:11, arabic:"إِنَّ",  tr:"inna",      en:"indeed / verily",           ru:"поистине / воистину",            cat:"particle",    sec:1, rank:11,  ex:"إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ — Indeed Allah is Forgiving, Merciful" },
  { id:12, arabic:"كَانَ",  tr:"kāna",      en:"was / were (past)",         ru:"был / была / было",              cat:"verb",        sec:1, rank:12,  ex:"وَكَانَ اللَّهُ عَلِيمًا — Allah is ever All-Knowing" },
  { id:13, arabic:"الَّذِي", tr:"alladhī",  en:"who / which (masc.)",       ru:"который / тот, кто",             cat:"pronoun",     sec:1, rank:13,  ex:"الَّذِي خَلَقَكُمْ — who created you" },
  { id:14, arabic:"مَا",    tr:"mā",        en:"what / that which / not",   ru:"что / то, что / не",             cat:"particle",    sec:1, rank:14,  ex:"مَا فِي السَّمَاوَاتِ — what is in the heavens" },
  { id:15, arabic:"عَلِيم", tr:"ʿAlīm",    en:"All-Knowing",               ru:"Всезнающий",                     cat:"noun",        sec:1, rank:15,  ex:"وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ — Allah knows all things" },
  { id:16, arabic:"قُلْ",   tr:"qul",       en:"say! (command)",            ru:"скажи!",                         cat:"verb",        sec:1, rank:16,  ex:"قُلْ هُوَ اللَّهُ أَحَدٌ — Say: He is Allah, the One" },
  { id:17, arabic:"كُلّ",   tr:"kull",      en:"all / every / each",        ru:"всё / каждый",                   cat:"noun",        sec:1, rank:17,  ex:"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ — every soul shall taste death" },
  { id:18, arabic:"لَهُ",   tr:"lahu",      en:"for him / to him",          ru:"ему / его",                      cat:"particle",    sec:1, rank:18,  ex:"لَهُ مَا فِي السَّمَاوَاتِ — to Him belongs what is in the heavens" },
  { id:19, arabic:"أَنَّ",  tr:"anna",      en:"that (conjunction)",        ru:"что (союз)",                     cat:"particle",    sec:1, rank:19,  ex:"أَنَّ اللَّهَ قَدِيرٌ — that Allah is over all things Capable" },
  { id:20, arabic:"حَكِيم", tr:"Ḥakīm",    en:"All-Wise",                  ru:"Мудрый / Мудрейший",             cat:"noun",        sec:1, rank:20,  ex:"وَاللَّهُ عَزِيزٌ حَكِيمٌ — Allah is Exalted in Might, All-Wise" },
  { id:21, arabic:"يَا",    tr:"yā",        en:"O! (address)",              ru:"О! (обращение)",                 cat:"particle",    sec:1, rank:21,  ex:"يَا أَيُّهَا النَّاسُ — O mankind!" },
  { id:22, arabic:"أَوْ",   tr:"aw",        en:"or",                        ru:"или",                            cat:"particle",    sec:1, rank:22,  ex:"أَوْ يَتُوبَ عَلَيْهِمْ — or that He will turn to them" },
  { id:23, arabic:"هَٰذَا", tr:"hādhā",    en:"this (masc.)",              ru:"этот (м.р.)",                    cat:"pronoun",     sec:1, rank:23,  ex:"هَٰذَا بَيَانٌ لِّلنَّاسِ — this is a clear statement for people" },
  { id:24, arabic:"بِ",     tr:"bi",        en:"by / with / in",            ru:"с / в / посредством",            cat:"preposition", sec:1, rank:24,  ex:"بِسْمِ اللَّهِ — in the name of Allah" },
  { id:25, arabic:"لِ",     tr:"li",        en:"for / to (purpose)",        ru:"для / ради",                     cat:"preposition", sec:1, rank:25,  ex:"لِلَّهِ مَا فِي السَّمَاوَاتِ — to Allah belongs what is in the heavens" },
  { id:26, arabic:"رَحِيم", tr:"Raḥīm",    en:"Most Merciful",             ru:"Милосердный",                    cat:"noun",        sec:1, rank:26,  ex:"إِنَّهُ هُوَ الرَّحِيمُ — Indeed He is the Merciful" },
  { id:27, arabic:"غَفُور", tr:"Ghafūr",   en:"Oft-Forgiving",             ru:"Прощающий",                      cat:"noun",        sec:1, rank:27,  ex:"وَاللَّهُ غَفُورٌ رَّحِيمٌ — Allah is Forgiving and Merciful" },
  { id:28, arabic:"شَيْء",  tr:"shayʾ",    en:"thing",                     ru:"вещь / нечто",                   cat:"noun",        sec:1, rank:28,  ex:"وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ — He is over all things Capable" },
  { id:29, arabic:"قَدِير", tr:"Qadīr",    en:"All-Powerful",              ru:"Всемогущий",                     cat:"noun",        sec:1, rank:29,  ex:"إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ — Allah is over all things All-Powerful" },
  { id:30, arabic:"نَّاس",  tr:"nās",       en:"people / mankind",          ru:"люди / человечество",            cat:"noun",        sec:1, rank:30,  ex:"يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمْ — O people! Fear your Lord" },
  { id:31, arabic:"آمَنَ",  tr:"āmana",    en:"believed / had faith",      ru:"уверовал",                       cat:"verb",        sec:1, rank:31,  ex:"الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ — those who believed and did righteous deeds" },
  { id:32, arabic:"عَمِلَ", tr:"ʿamila",   en:"did / worked",              ru:"делал / совершал",               cat:"verb",        sec:1, rank:32,  ex:"عَمِلَ صَالِحًا — he did righteous deeds" },
  { id:33, arabic:"صَالِح", tr:"ṣāliḥ",    en:"righteous / good",          ru:"праведный / благой",             cat:"noun",        sec:1, rank:33,  ex:"وَعَمِلُوا الصَّالِحَاتِ — they did righteous deeds" },
  { id:34, arabic:"جَنَّة", tr:"janna",     en:"garden / paradise",         ru:"рай / сад",                      cat:"noun",        sec:1, rank:34,  ex:"وَبَشِّرِ الَّذِينَ آمَنُوا أَنَّ لَهُمْ جَنَّاتٍ — give good tidings of gardens" },
  { id:35, arabic:"نَار",   tr:"nār",       en:"fire",                      ru:"огонь",                          cat:"noun",        sec:1, rank:35,  ex:"وَاتَّقُوا النَّارَ — and fear the fire" },
  { id:36, arabic:"يَوْم",  tr:"yawm",      en:"day",                       ru:"день",                           cat:"noun",        sec:1, rank:36,  ex:"يَوْمَ الْقِيَامَةِ — the Day of Resurrection" },
  { id:37, arabic:"آيَة",   tr:"āya",       en:"sign / verse",              ru:"знамение / аят",                 cat:"noun",        sec:1, rank:37,  ex:"تِلْكَ آيَاتُ اللَّهِ — these are the signs of Allah" },
  { id:38, arabic:"أَرْض",  tr:"arḍ",       en:"earth / land",              ru:"земля",                          cat:"noun",        sec:1, rank:38,  ex:"مَا فِي الْأَرْضِ جَمِيعًا — all that is in the earth" },
  { id:39, arabic:"سَمَاء", tr:"samāʾ",    en:"sky / heaven",              ru:"небо",                           cat:"noun",        sec:1, rank:39,  ex:"خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ — He created the heavens and the earth" },
  { id:40, arabic:"كِتَاب", tr:"kitāb",     en:"book / scripture",          ru:"книга / писание",                cat:"noun",        sec:1, rank:40,  ex:"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ — this is the Book about which there is no doubt" },
  { id:41, arabic:"لَّعَلَّ",tr:"laʿalla",  en:"perhaps / so that",         ru:"может быть / быть может",        cat:"particle",    sec:1, rank:41,  ex:"لَعَلَّكُمْ تَتَّقُونَ — so that you may fear Allah" },
  { id:42, arabic:"عَظِيم", tr:"ʿAẓīm",    en:"Great / Mighty",            ru:"Великий / Величественный",       cat:"noun",        sec:1, rank:42,  ex:"وَهُوَ الْعَلِيُّ الْعَظِيمُ — He is the Most High, the Most Great" },
  { id:43, arabic:"خَلَقَ", tr:"khalaqa",   en:"created",                   ru:"сотворил",                       cat:"verb",        sec:1, rank:43,  ex:"خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ — He created the heavens and the earth" },
  { id:44, arabic:"رَحْمَة",tr:"raḥma",    en:"mercy / compassion",        ru:"милость / милосердие",           cat:"noun",        sec:1, rank:44,  ex:"وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ — My mercy encompasses all things" },
  { id:45, arabic:"حَقّ",   tr:"ḥaqq",      en:"truth / right",             ru:"истина / право",                 cat:"noun",        sec:1, rank:45,  ex:"وَقُلِ الْحَقُّ مِن رَّبِّكُمْ — the truth is from your Lord" },
  { id:46, arabic:"نَفْس",  tr:"nafs",      en:"soul / self",               ru:"душа / я / самость",             cat:"noun",        sec:1, rank:46,  ex:"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ — every soul shall taste death" },
  { id:47, arabic:"إِذَا",  tr:"idhā",      en:"when / if (future)",        ru:"когда / если",                   cat:"particle",    sec:1, rank:47,  ex:"إِذَا جَاءَ نَصْرُ اللَّهِ — when the victory of Allah comes" },
  { id:48, arabic:"أَهْل",  tr:"ahl",       en:"people of / family of",     ru:"люди / семья / народ",           cat:"noun",        sec:1, rank:48,  ex:"يَا أَهْلَ الْكِتَابِ — O people of the Scripture" },
  { id:49, arabic:"عِنْد",  tr:"ʿinda",     en:"with / at / near",          ru:"у / при / рядом",                cat:"preposition", sec:1, rank:49,  ex:"وَعِندَهُ مَفَاتِحُ الْغَيْبِ — with Him are the keys of the unseen" },
  { id:50, arabic:"بَعْد",  tr:"baʿd",      en:"after",                     ru:"после",                          cat:"preposition", sec:1, rank:50,  ex:"وَمِن بَعْدِ ذَٰلِكَ — and after that" },

  // LEVEL 2 — Particles & Pronouns
  { id:51,  arabic:"هُمْ",    tr:"hum",       en:"they (masc.)",              ru:"они (м.р.)",              cat:"pronoun",     sec:2, rank:51,  ex:"هُمُ الْمُفْلِحُونَ — they are the successful" },
  { id:52,  arabic:"أَنتُمْ", tr:"antum",     en:"you all (plural)",          ru:"вы (мн.ч.)",             cat:"pronoun",     sec:2, rank:52,  ex:"أَنتُمُ الْأَعْلَوْنَ — you will be superior" },
  { id:53,  arabic:"نَحْنُ",  tr:"naḥnu",     en:"we",                        ru:"мы",                     cat:"pronoun",     sec:2, rank:53,  ex:"نَحْنُ نَرْزُقُكُمْ — We provide for you" },
  { id:54,  arabic:"أَنَا",   tr:"anā",       en:"I",                         ru:"я",                      cat:"pronoun",     sec:2, rank:54,  ex:"إِنَّنِي أَنَا اللَّهُ — Indeed I am Allah" },
  { id:55,  arabic:"أَنتَ",   tr:"anta",      en:"you (masc. sing.)",         ru:"ты (м.р.)",              cat:"pronoun",     sec:2, rank:55,  ex:"أَنتَ وَلِيُّنَا — You are our protector" },
  { id:56,  arabic:"هِيَ",    tr:"hiya",      en:"she / it (fem.)",           ru:"она",                    cat:"pronoun",     sec:2, rank:56,  ex:"هِيَ أَشَدُّ وَطَأً — it is more challenging" },
  { id:57,  arabic:"الَّذِينَ",tr:"alladhīna",en:"those who (plural)",        ru:"те, кто (мн.ч.)",        cat:"pronoun",     sec:2, rank:57,  ex:"الَّذِينَ آمَنُوا — those who believed" },
  { id:58,  arabic:"مَنْ",    tr:"man",       en:"who / whoever",             ru:"кто / тот, кто",         cat:"pronoun",     sec:2, rank:58,  ex:"مَن يَعْمَلْ سُوءًا يُجْزَ بِهِ — whoever does evil will be recompensed" },
  { id:59,  arabic:"ذَٰلِكَ", tr:"dhālika",   en:"that (masc.)",              ru:"тот / то (м.р.)",        cat:"pronoun",     sec:2, rank:59,  ex:"ذَٰلِكَ الْكِتَابُ — that is the Book" },
  { id:60,  arabic:"هَٰؤُلَاء",tr:"hāʾulāʾ", en:"these (people)",            ru:"эти (люди)",             cat:"pronoun",     sec:2, rank:60,  ex:"هَٰؤُلَاءِ قَوْمِي — these are my people" },
  { id:61,  arabic:"مَعَ",    tr:"maʿa",      en:"with / together with",      ru:"вместе с / с",           cat:"preposition", sec:2, rank:61,  ex:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ — Allah is with the patient" },
  { id:62,  arabic:"عَنْ",    tr:"ʿan",       en:"from / about / away from",  ru:"от / о / прочь от",      cat:"preposition", sec:2, rank:62,  ex:"عَن قَوْمٍ — from a people" },
  { id:63,  arabic:"أَمْ",    tr:"am",        en:"or (in questions)",         ru:"или (в вопросах)",       cat:"particle",    sec:2, rank:63,  ex:"أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ — whether you warn them or not" },
  { id:64,  arabic:"ثُمَّ",   tr:"thumma",    en:"then / thereafter",         ru:"потом / затем",          cat:"particle",    sec:2, rank:64,  ex:"ثُمَّ يَتُوبُ اللَّهُ — then Allah accepts repentance" },
  { id:65,  arabic:"حَتَّى",  tr:"ḥattā",     en:"until / so that",           ru:"пока / до тех пор",      cat:"particle",    sec:2, rank:65,  ex:"حَتَّى يَأْتِيَ اللَّهُ — until Allah brings" },
  { id:66,  arabic:"أَيّ",    tr:"ayy",       en:"which / what kind of",      ru:"какой / который",        cat:"pronoun",     sec:2, rank:66,  ex:"أَيُّهَا النَّاسُ — O people!" },
  { id:67,  arabic:"إِلَّا",  tr:"illā",      en:"except / only / but",       ru:"кроме / только",         cat:"particle",    sec:2, rank:67,  ex:"لَا إِلَٰهَ إِلَّا اللَّهُ — there is no deity except Allah" },
  { id:68,  arabic:"قَدْ",    tr:"qad",       en:"indeed / already",          ru:"уже / действительно",    cat:"particle",    sec:2, rank:68,  ex:"قَدْ أَفْلَحَ الْمُؤْمِنُونَ — the believers have certainly succeeded" },
  { id:69,  arabic:"لَمْ",    tr:"lam",       en:"did not (negation)",        ru:"не (отрицание прошлого)",cat:"particle",    sec:2, rank:69,  ex:"لَمْ يَلِدْ وَلَمْ يُولَدْ — He neither begets nor is born" },
  { id:70,  arabic:"إِن",     tr:"in",        en:"if / whether",              ru:"если / ли",              cat:"particle",    sec:2, rank:70,  ex:"إِن كُنتُمْ مُؤْمِنِينَ — if you are believers" },
  { id:71,  arabic:"كَمَا",   tr:"kamā",      en:"just as / as",              ru:"как / подобно тому как", cat:"particle",    sec:2, rank:71,  ex:"كَمَا أَرْسَلْنَا — just as We sent" },
  { id:72,  arabic:"لَن",     tr:"lan",       en:"will never / shall not",    ru:"никогда не (будущее)",   cat:"particle",    sec:2, rank:72,  ex:"لَن تَنَالُوا الْبِرَّ — you will never attain righteousness" },
  { id:73,  arabic:"بَلْ",    tr:"bal",       en:"rather / but / nay",        ru:"нет / но / напротив",    cat:"particle",    sec:2, rank:73,  ex:"بَلْ هُمْ فِي شَكٍّ — rather, they are in doubt" },
  { id:74,  arabic:"لَوْ",    tr:"law",       en:"if (hypothetical)",         ru:"если бы (сослагательное)",cat:"particle",   sec:2, rank:74,  ex:"لَوْ شَاءَ اللَّهُ — if Allah had willed" },
  { id:75,  arabic:"أَنْ",    tr:"an",        en:"to / that (infinitive)",    ru:"что / чтобы",            cat:"particle",    sec:2, rank:75,  ex:"أَن تَعْبُدُوا اللَّهَ — to worship Allah" },
  { id:76,  arabic:"سَوْف",   tr:"sawfa",     en:"will / shall (future)",     ru:"будет (будущее время)",  cat:"particle",    sec:2, rank:76,  ex:"سَوْفَ يُؤْتِيهِمْ — He will give them" },
  { id:77,  arabic:"فَ",      tr:"fa",        en:"so / then / and (sequence)","ru":"и / тогда / итак",     cat:"particle",    sec:2, rank:77,  ex:"فَاللَّهُ خَيْرٌ حَافِظًا — so Allah is the best guardian" },
  { id:78,  arabic:"هَلْ",    tr:"hal",       en:"is there? / did? (question)",ru:"разве? / неужели?",     cat:"particle",    sec:2, rank:78,  ex:"هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ — has there reached you the story?" },
  { id:79,  arabic:"كَيْف",   tr:"kayfa",     en:"how?",                      ru:"как?",                   cat:"particle",    sec:2, rank:79,  ex:"كَيْفَ يَهْدِي اللَّهُ — how would Allah guide" },
  { id:80,  arabic:"أَيْن",   tr:"ayna",      en:"where?",                    ru:"где?",                   cat:"particle",    sec:2, rank:80,  ex:"أَيْنَمَا تَكُونُوا — wherever you may be" },
  { id:81,  arabic:"مَتَى",   tr:"matā",      en:"when?",                     ru:"когда?",                 cat:"particle",    sec:2, rank:81,  ex:"مَتَى نَصْرُ اللَّهِ — when will the help of Allah come?" },
  { id:82,  arabic:"إِنَّمَا",tr:"innamā",    en:"only / it is but",          ru:"только лишь",            cat:"particle",    sec:2, rank:82,  ex:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ — the believers are indeed brothers" },
  { id:83,  arabic:"لَكِن",   tr:"lākin",     en:"but / however",             ru:"но / однако",            cat:"particle",    sec:2, rank:83,  ex:"لَٰكِنَّ اللَّهَ يَشْهَدُ — but Allah bears witness" },
  { id:84,  arabic:"أَمَّا",  tr:"ammā",      en:"as for / but as for",       ru:"что касается",           cat:"particle",    sec:2, rank:84,  ex:"أَمَّا مَن طَغَىٰ — as for one who transgresses" },
  { id:85,  arabic:"مِمَّا",  tr:"mimmā",     en:"from what / of what",       ru:"из того, что",           cat:"particle",    sec:2, rank:85,  ex:"مِمَّا رَزَقْنَاكُمْ — from what We provided you" },
  { id:86,  arabic:"أَلَمْ",  tr:"alam",      en:"did...not?",                ru:"разве не...?",           cat:"particle",    sec:2, rank:86,  ex:"أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ — did you not see how your Lord dealt" },
  { id:87,  arabic:"وَلَا",   tr:"walā",      en:"and not / nor",             ru:"и не / ни",              cat:"particle",    sec:2, rank:87,  ex:"وَلَا تَيْأَسُوا — do not despair" },
  { id:88,  arabic:"قَبْل",   tr:"qabl",      en:"before",                    ru:"до / прежде",            cat:"preposition", sec:2, rank:88,  ex:"مِن قَبْلُ — before that" },
  { id:89,  arabic:"حِين",    tr:"ḥīn",       en:"time / moment / when",      ru:"время / момент",         cat:"noun",        sec:2, rank:89,  ex:"وَلَاتَ حِينَ مَنَاصٍ — and it was not a time for escape" },
  { id:90,  arabic:"لَّكُمْ", tr:"lakum",     en:"for you (plural)",          ru:"для вас / вам",          cat:"particle",    sec:2, rank:90,  ex:"أُحِلَّ لَكُمْ — it is permitted for you" },
  { id:91,  arabic:"لَهُمْ",  tr:"lahum",     en:"for them / to them",        ru:"для них / им",           cat:"particle",    sec:2, rank:91,  ex:"وَلَهُمْ عَذَابٌ أَلِيمٌ — for them is a painful punishment" },
  { id:92,  arabic:"بِهِ",    tr:"bihi",      en:"with it / by it",           ru:"с ним / посредством него",cat:"particle",   sec:2, rank:92,  ex:"آمَنُوا بِهِ — they believed in it" },
  { id:93,  arabic:"عَمَّا",  tr:"ʿammā",     en:"from what / about what",    ru:"о том, что",             cat:"particle",    sec:2, rank:93,  ex:"عَمَّا يَعْمَلُونَ — about what they do" },
  { id:94,  arabic:"حَوْل",   tr:"ḥawl",      en:"around / about",            ru:"вокруг / около",         cat:"preposition", sec:2, rank:94,  ex:"مَا حَوْلَهُمْ — what is around them" },
  { id:95,  arabic:"لِكَيْ",  tr:"likayla",   en:"so that / in order to",     ru:"чтобы / для того чтобы", cat:"particle",    sec:2, rank:95,  ex:"لِكَيْلَا تَأْسَوْا — so that you may not grieve" },
  { id:96,  arabic:"مَاذَا",  tr:"mādhā",     en:"what? (direct object)",     ru:"что? (доп. объект)",     cat:"pronoun",     sec:2, rank:96,  ex:"مَاذَا أَرَادَ اللَّهُ — what did Allah intend" },
  { id:97,  arabic:"كَ",      tr:"ka",        en:"like / as (similarity)",    ru:"как / подобно",          cat:"particle",    sec:2, rank:97,  ex:"كَالْجِبَالِ — like mountains" },
  { id:98,  arabic:"سَوَاء",  tr:"sawāʾ",     en:"equal / same / alike",      ru:"равный / одинаковый",    cat:"particle",    sec:2, rank:98,  ex:"سَوَاءٌ عَلَيْهِمْ — it is the same for them" },
  { id:99,  arabic:"غَيْر",   tr:"ghayra",    en:"other than / except",       ru:"иной / кроме",           cat:"particle",    sec:2, rank:99,  ex:"غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ — not of those on whom is anger" },
  { id:100, arabic:"أَمَا",   tr:"amā",       en:"now then / indeed",         ru:"итак / поистине",        cat:"particle",    sec:2, rank:100, ex:"أَمَا وَاللَّهِ — now then, by Allah" },

  // LEVEL 3 — Sacred Verbs
  { id:101, arabic:"أَرَادَ",  tr:"arāda",     en:"wanted / willed",           ru:"хотел / желал",                  cat:"verb", sec:3, rank:101, ex:"مَا يُرِيدُ اللَّهُ — what Allah intends" },
  { id:102, arabic:"جَاءَ",   tr:"jāʾa",      en:"came / brought",            ru:"пришёл / принёс",                cat:"verb", sec:3, rank:102, ex:"جَاءَ الْحَقُّ — the truth has come" },
  { id:103, arabic:"أَرْسَلَ",tr:"arsala",    en:"sent (a messenger)",        ru:"послал / отправил",              cat:"verb", sec:3, rank:103, ex:"أَرْسَلْنَا رُسُلَنَا — We sent Our messengers" },
  { id:104, arabic:"نَزَلَ",  tr:"nazala",    en:"descended / revealed",      ru:"ниспослал / снизошёл",           cat:"verb", sec:3, rank:104, ex:"نَزَّلْنَا عَلَيْكَ الْقُرْآنَ — We sent down the Quran upon you" },
  { id:105, arabic:"رَأَى",   tr:"raʾā",      en:"saw / observed",            ru:"видел",                          cat:"verb", sec:3, rank:105, ex:"أَلَمْ تَرَ كَيْفَ — have you not seen how" },
  { id:106, arabic:"عَلِمَ",  tr:"ʿalima",    en:"knew / came to know",       ru:"знал / узнал",                   cat:"verb", sec:3, rank:106, ex:"يَعْلَمُ مَا تُخْفُونَ — He knows what you conceal" },
  { id:107, arabic:"دَعَا",   tr:"daʿā",      en:"called / invited / prayed", ru:"призвал / молился",              cat:"verb", sec:3, rank:107, ex:"ادْعُوا رَبَّكُمْ — call upon your Lord" },
  { id:108, arabic:"أَخَذَ",  tr:"akhadha",   en:"took / seized",             ru:"взял / схватил",                 cat:"verb", sec:3, rank:108, ex:"أَخَذَهُمُ الْعَذَابُ — punishment seized them" },
  { id:109, arabic:"تَابَ",   tr:"tāba",      en:"repented / turned back",    ru:"покаялся / вернулся к Богу",     cat:"verb", sec:3, rank:109, ex:"وَتُوبُوا إِلَى اللَّهِ — repent to Allah" },
  { id:110, arabic:"رَزَقَ",  tr:"razaqa",    en:"provided / bestowed",       ru:"наделил / дал удел",             cat:"verb", sec:3, rank:110, ex:"مِمَّا رَزَقَكُمُ اللَّهُ — from what Allah provided you" },
  { id:111, arabic:"هَدَى",   tr:"hadā",      en:"guided",                    ru:"наставил / направил",            cat:"verb", sec:3, rank:111, ex:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ — guide us to the straight path" },
  { id:112, arabic:"ظَلَمَ",  tr:"ẓalama",    en:"wronged / oppressed",       ru:"притеснял / поступал несправедливо",cat:"verb",sec:3,rank:112, ex:"وَمَا ظَلَمَهُمُ اللَّهُ — Allah did not wrong them" },
  { id:113, arabic:"كَفَرَ",  tr:"kafara",    en:"disbelieved / denied",      ru:"не уверовал / отверг",           cat:"verb", sec:3, rank:113, ex:"الَّذِينَ كَفَرُوا — those who disbelieved" },
  { id:114, arabic:"وَجَدَ",  tr:"wajada",    en:"found / discovered",        ru:"нашёл / обнаружил",              cat:"verb", sec:3, rank:114, ex:"وَوَجَدَكَ ضَالًّا فَهَدَىٰ — He found you lost and guided you" },
  { id:115, arabic:"دَخَلَ",  tr:"dakhala",   en:"entered",                   ru:"вошёл",                          cat:"verb", sec:3, rank:115, ex:"ادْخُلُوا الْجَنَّةَ — enter Paradise" },
  { id:116, arabic:"خَرَجَ",  tr:"kharaja",   en:"exited / came out",         ru:"вышел",                          cat:"verb", sec:3, rank:116, ex:"خَرَجُوا مِن دِيَارِهِمْ — they left their homes" },
  { id:117, arabic:"صَبَرَ",  tr:"ṣabara",    en:"was patient / endured",     ru:"был терпелив / терпел",          cat:"verb", sec:3, rank:117, ex:"وَاصْبِرُوا إِنَّ اللَّهَ مَعَ الصَّابِرِينَ — be patient; Allah is with the patient" },
  { id:118, arabic:"شَكَرَ",  tr:"shakara",   en:"was grateful",              ru:"благодарил",                     cat:"verb", sec:3, rank:118, ex:"وَاشْكُرُوا لِلَّهِ — be grateful to Allah" },
  { id:119, arabic:"فَعَلَ",  tr:"faʿala",    en:"did / acted",               ru:"делал / совершил",               cat:"verb", sec:3, rank:119, ex:"مَاذَا فَعَلَ رَبُّكَ — what did your Lord do?" },
  { id:120, arabic:"ضَرَبَ",  tr:"ḍaraba",    en:"struck / set an example",   ru:"ударил / привёл пример",         cat:"verb", sec:3, rank:120, ex:"ضَرَبَ اللَّهُ مَثَلًا — Allah sets forth a parable" },
  { id:121, arabic:"آتَى",    tr:"ātā",       en:"gave / brought",            ru:"принёс / дал",                   cat:"verb", sec:3, rank:121, ex:"آتَيْنَاهُ الْإِنجِيلَ — We gave him the Gospel" },
  { id:122, arabic:"اتَّبَعَ",tr:"ittabaʿa",  en:"followed",                  ru:"последовал / следовал за",       cat:"verb", sec:3, rank:122, ex:"اتَّبِعُوا مَا أُنزِلَ — follow what has been revealed" },
  { id:123, arabic:"أَقَامَ", tr:"aqāma",     en:"established / performed",   ru:"устанавливал / совершал",        cat:"verb", sec:3, rank:123, ex:"أَقِيمُوا الصَّلَاةَ — establish prayer" },
  { id:124, arabic:"يَعْلَمُ",tr:"yaʿlamu",   en:"He knows",                  ru:"Он знает",                       cat:"verb", sec:3, rank:124, ex:"وَاللَّهُ يَعْلَمُ مَا تَصْنَعُونَ — Allah knows what you do" },
  { id:125, arabic:"يَشَاء",  tr:"yashāʾu",   en:"He wills / He pleases",     ru:"Он хочет / Он повелевает",       cat:"verb", sec:3, rank:125, ex:"يَفْعَلُ مَا يَشَاءُ — He does what He wills" },
  { id:126, arabic:"يَغْفِرُ",tr:"yaghfiru",  en:"He forgives",               ru:"Он прощает",                     cat:"verb", sec:3, rank:126, ex:"يَغْفِرُ لِمَن يَشَاءُ — He forgives whom He wills" },
  { id:127, arabic:"يُحِبّ",  tr:"yuḥibbu",   en:"loves",                     ru:"любит",                          cat:"verb", sec:3, rank:127, ex:"اللَّهَ يُحِبُّ الْمُحْسِنِينَ — Allah loves those who do good" },
  { id:128, arabic:"يُؤْمِن", tr:"yuʾminu",   en:"believes / has faith",      ru:"верует / верит",                 cat:"verb", sec:3, rank:128, ex:"مَن يُؤْمِن بِاللَّهِ — whoever believes in Allah" },
  { id:129, arabic:"يَعْبُد", tr:"yaʿbudu",   en:"worships / serves",         ru:"поклоняется / служит",           cat:"verb", sec:3, rank:129, ex:"وَمَا خَلَقْتُ إِلَّا لِيَعْبُدُونِ — I created them only to worship Me" },
  { id:130, arabic:"يَهْدِي", tr:"yahdī",     en:"guides",                    ru:"наставляет / ведёт",             cat:"verb", sec:3, rank:130, ex:"اللَّهُ يَهْدِي مَن يَشَاءُ — Allah guides whom He wills" },
  { id:131, arabic:"تَوَكَّلَ",tr:"tawakkala", en:"relied / put trust in Allah",ru:"уповал / положился на Аллаха", cat:"verb", sec:3, rank:131, ex:"وَعَلَى اللَّهِ فَتَوَكَّلُوا — upon Allah rely" },
  { id:132, arabic:"أَسْلَمَ",tr:"aslama",    en:"submitted / became Muslim", ru:"покорился / принял ислам",       cat:"verb", sec:3, rank:132, ex:"وَمَن أَحْسَنُ دِينًا مِّمَّنْ أَسْلَمَ — who is better than one who submits?" },
  { id:133, arabic:"خَشِيَ",  tr:"khashiya",  en:"feared (with reverence)",   ru:"боялся с почтением",             cat:"verb", sec:3, rank:133, ex:"إِنَّمَا يَخْشَى اللَّهَ الْعُلَمَاءُ — only the scholars truly fear Allah" },
  { id:134, arabic:"ذَكَرَ",  tr:"dhakara",   en:"remembered / mentioned",    ru:"помнил / упомянул",              cat:"verb", sec:3, rank:134, ex:"وَاذْكُرُوا اللَّهَ كَثِيرًا — remember Allah often" },
  { id:135, arabic:"سَأَلَ",  tr:"saʾala",    en:"asked",                     ru:"спросил / просил",               cat:"verb", sec:3, rank:135, ex:"وَإِذَا سَأَلَكَ عِبَادِي عَنِّي — when My servants ask you about Me" },
  { id:136, arabic:"أَمَرَ",  tr:"amara",     en:"commanded / ordered",       ru:"приказал / повелел",             cat:"verb", sec:3, rank:136, ex:"إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ — Allah commands justice" },
  { id:137, arabic:"نَهَى",   tr:"nahā",      en:"forbade / prohibited",      ru:"запретил",                       cat:"verb", sec:3, rank:137, ex:"وَنَهَى النَّفْسَ عَنِ الْهَوَىٰ — forbade the soul from desire" },
  { id:138, arabic:"بَشَّرَ", tr:"bashshara", en:"gave glad tidings",         ru:"принёс благую весть",            cat:"verb", sec:3, rank:138, ex:"وَبَشِّرِ الْمُؤْمِنِينَ — give glad tidings to the believers" },
  { id:139, arabic:"أَنذَرَ", tr:"andhara",   en:"warned",                    ru:"предупредил / предостерёг",      cat:"verb", sec:3, rank:139, ex:"وَأَنذِرِ النَّاسَ — and warn the people" },
  { id:140, arabic:"غَفَرَ",  tr:"ghafara",   en:"forgave",                   ru:"простил",                        cat:"verb", sec:3, rank:140, ex:"وَاللَّهُ يَغْفِرُ لِمَن يَشَاءُ — Allah forgives whom He wills" },
  { id:141, arabic:"أَحَبَّ", tr:"aḥabba",    en:"loved / liked",             ru:"полюбил / возлюбил",             cat:"verb", sec:3, rank:141, ex:"يُحِبُّهُمْ وَيُحِبُّونَهُ — He loves them and they love Him" },
  { id:142, arabic:"أَفْلَحَ",tr:"aflaḥa",    en:"succeeded / prospered",     ru:"преуспел / достиг успеха",       cat:"verb", sec:3, rank:142, ex:"قَدْ أَفْلَحَ الْمُؤْمِنُونَ — the believers have certainly succeeded" },
  { id:143, arabic:"خَسِرَ",  tr:"khasira",   en:"lost / suffered loss",      ru:"потерял / потерпел убыток",      cat:"verb", sec:3, rank:143, ex:"قَدْ خَسِرَ الَّذِينَ كَفَرُوا — those who disbelieve have certainly lost" },
  { id:144, arabic:"أَعْطَى", tr:"aʿṭā",      en:"gave / granted",            ru:"дал / пожаловал",                cat:"verb", sec:3, rank:144, ex:"إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ — We have given you al-Kawthar" },
  { id:145, arabic:"قَاتَلَ", tr:"qātala",    en:"fought",                    ru:"сражался",                       cat:"verb", sec:3, rank:145, ex:"قَاتِلُوا فِي سَبِيلِ اللَّهِ — fight in the way of Allah" },
  { id:146, arabic:"يَرْزُق", tr:"yarzuqu",   en:"provides / gives sustenance",ru:"обеспечивает / наделяет",       cat:"verb", sec:3, rank:146, ex:"اللَّهُ يَرْزُقُ مَن يَشَاءُ — Allah provides for whom He wills" },
  { id:147, arabic:"اسْتَغْفَرَ",tr:"istaghfara",en:"sought forgiveness",     ru:"просил прощения",                cat:"verb", sec:3, rank:147, ex:"وَاسْتَغْفِرُوا اللَّهَ — seek forgiveness from Allah" },
  { id:148, arabic:"تَذَكَّرَ",tr:"tadhakkara",en:"remembered / took heed",   ru:"вспомнил / принял к сведению",   cat:"verb", sec:3, rank:148, ex:"أَفَلَا تَذَكَّرُونَ — will you not then remember?" },
  { id:149, arabic:"تَدَبَّرَ",tr:"tadabbara", en:"pondered / reflected",      ru:"размышлял / обдумывал",          cat:"verb", sec:3, rank:149, ex:"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ — will they not ponder the Quran?" },
  { id:150, arabic:"أَعْلَمَ",tr:"aʿlama",    en:"informed / knows best",     ru:"сообщил / знает лучше",          cat:"verb", sec:3, rank:150, ex:"وَاللَّهُ أَعْلَمُ — Allah knows best" },

  // LEVEL 4 — Quranic Nouns
  { id:151, arabic:"صَلَاة",  tr:"ṣalāh",    en:"prayer / salah",            ru:"молитва / салят",                cat:"noun", sec:4, rank:151, ex:"أَقِيمُوا الصَّلَاةَ — establish the prayer" },
  { id:152, arabic:"زَكَاة",  tr:"zakāh",    en:"almsgiving / purification", ru:"закят",                          cat:"noun", sec:4, rank:152, ex:"وَآتُوا الزَّكَاةَ — give zakah" },
  { id:153, arabic:"إِيمَان", tr:"īmān",     en:"faith / belief",            ru:"вера / иман",                    cat:"noun", sec:4, rank:153, ex:"الَّذِينَ ازْدَادُوا إِيمَانًا — those who increased in faith" },
  { id:154, arabic:"دِين",    tr:"dīn",      en:"religion / way of life",    ru:"религия / образ жизни",          cat:"noun", sec:4, rank:154, ex:"إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ — the religion in the sight of Allah is Islam" },
  { id:155, arabic:"نَبِيّ",  tr:"nabiyy",   en:"prophet",                   ru:"пророк",                         cat:"noun", sec:4, rank:155, ex:"وَخَاتَمُ النَّبِيِّينَ — and the seal of the prophets" },
  { id:156, arabic:"رَسُول",  tr:"rasūl",    en:"messenger / apostle",       ru:"посланник",                      cat:"noun", sec:4, rank:156, ex:"وَأَطِيعُوا الرَّسُولَ — and obey the Messenger" },
  { id:157, arabic:"مَلَك",   tr:"malak",    en:"angel",                     ru:"ангел",                          cat:"noun", sec:4, rank:157, ex:"وَالْمَلَائِكَةُ يُسَبِّحُونَ — the angels glorify" },
  { id:158, arabic:"إِنْسَان",tr:"insān",    en:"human / mankind",           ru:"человек / человечество",         cat:"noun", sec:4, rank:158, ex:"وَخُلِقَ الْإِنسَانُ ضَعِيفًا — man was created weak" },
  { id:159, arabic:"قَوْم",   tr:"qawm",     en:"people / nation / tribe",   ru:"народ / племя",                  cat:"noun", sec:4, rank:159, ex:"يَا قَوْمِ اعْبُدُوا اللَّهَ — O my people, worship Allah" },
  { id:160, arabic:"أُمَّة",  tr:"umma",     en:"community / nation",        ru:"умма / община",                  cat:"noun", sec:4, rank:160, ex:"جَعَلْنَاكُمْ أُمَّةً وَسَطًا — We made you a moderate community" },
  { id:161, arabic:"صِرَاط",  tr:"ṣirāṭ",   en:"path / way / road",         ru:"путь / дорога",                  cat:"noun", sec:4, rank:161, ex:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ — guide us to the straight path" },
  { id:162, arabic:"عَذَاب",  tr:"ʿadhāb",  en:"punishment / torment",      ru:"мучение / наказание",            cat:"noun", sec:4, rank:162, ex:"وَلَهُمْ عَذَابٌ أَلِيمٌ — for them is a painful punishment" },
  { id:163, arabic:"قِيَامَة",tr:"qiyāma",   en:"resurrection / Judgment Day",ru:"воскресение / Судный день",     cat:"noun", sec:4, rank:163, ex:"يَوْمَ الْقِيَامَةِ — the Day of Resurrection" },
  { id:164, arabic:"آخِرَة",  tr:"ākhira",   en:"hereafter / afterlife",     ru:"загробный мир / тот свет",       cat:"noun", sec:4, rank:164, ex:"وَالدَّارُ الْآخِرَةُ — the abode of the Hereafter" },
  { id:165, arabic:"دُنْيَا", tr:"dunyā",    en:"worldly life / this world", ru:"этот мир / мирская жизнь",       cat:"noun", sec:4, rank:165, ex:"الْحَيَاةُ الدُّنْيَا — the worldly life" },
  { id:166, arabic:"قَلْب",   tr:"qalb",     en:"heart",                     ru:"сердце",                         cat:"noun", sec:4, rank:166, ex:"يَعْلَمُ مَا فِي الْقُلُوبِ — He knows what is in the hearts" },
  { id:167, arabic:"سَبِيل",  tr:"sabīl",    en:"way / path / cause",        ru:"путь / дорога",                  cat:"noun", sec:4, rank:167, ex:"فِي سَبِيلِ اللَّهِ — in the way of Allah" },
  { id:168, arabic:"تَقْوَى", tr:"taqwā",    en:"piety / God-consciousness", ru:"богобоязненность / такуа",       cat:"noun", sec:4, rank:168, ex:"إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ — the most noble is the most God-conscious" },
  { id:169, arabic:"صَبْر",   tr:"ṣabr",     en:"patience / endurance",      ru:"терпение",                       cat:"noun", sec:4, rank:169, ex:"وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ — seek help through patience and prayer" },
  { id:170, arabic:"ذِكْر",   tr:"dhikr",    en:"remembrance / mention",     ru:"поминание / зикр",               cat:"noun", sec:4, rank:170, ex:"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ — in the remembrance of Allah do hearts find rest" },
  { id:171, arabic:"عِلْم",   tr:"ʿilm",     en:"knowledge / science",       ru:"знание / наука",                 cat:"noun", sec:4, rank:171, ex:"وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ — above every knower is one more knowing" },
  { id:172, arabic:"حِكْمَة", tr:"ḥikma",    en:"wisdom",                    ru:"мудрость",                       cat:"noun", sec:4, rank:172, ex:"يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ — He gives wisdom to whom He wills" },
  { id:173, arabic:"نِعْمَة", tr:"niʿma",    en:"blessing / favor / grace",  ru:"благодать / дар / милость",      cat:"noun", sec:4, rank:173, ex:"وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا — you cannot enumerate Allah's blessings" },
  { id:174, arabic:"مَال",    tr:"māl",      en:"wealth / property",         ru:"имущество / богатство",          cat:"noun", sec:4, rank:174, ex:"الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا — wealth and children are adornments of worldly life" },
  { id:175, arabic:"بَيْت",   tr:"bayt",     en:"house / home",              ru:"дом",                            cat:"noun", sec:4, rank:175, ex:"وَطَهِّرْ بَيْتِيَ — purify My House" },
  { id:176, arabic:"مَسْجِد", tr:"masjid",   en:"mosque / place of prostration",ru:"мечеть",                     cat:"noun", sec:4, rank:176, ex:"فِي الْمَسَاجِدِ — in the mosques" },
  { id:177, arabic:"مَاء",    tr:"māʾ",      en:"water",                     ru:"вода",                           cat:"noun", sec:4, rank:177, ex:"وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ — We made from water every living thing" },
  { id:178, arabic:"نُور",    tr:"nūr",      en:"light",                     ru:"свет",                           cat:"noun", sec:4, rank:178, ex:"اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ — Allah is the light of the heavens and the earth" },
  { id:179, arabic:"حَيَاة",  tr:"ḥayāh",   en:"life",                      ru:"жизнь",                          cat:"noun", sec:4, rank:179, ex:"الْحَيَاةُ الدُّنْيَا — the life of this world" },
  { id:180, arabic:"مَوْت",   tr:"mawt",     en:"death",                     ru:"смерть",                         cat:"noun", sec:4, rank:180, ex:"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ — every soul will taste death" },
  { id:181, arabic:"عَدْل",   tr:"ʿadl",     en:"justice / equity",          ru:"справедливость",                 cat:"noun", sec:4, rank:181, ex:"إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ — Allah commands justice" },
  { id:182, arabic:"خَيْر",   tr:"khayr",    en:"good / goodness / better",  ru:"добро / благо / лучший",         cat:"noun", sec:4, rank:182, ex:"وَمَا تَفْعَلُوا مِنْ خَيْرٍ — whatever good you do" },
  { id:183, arabic:"فِتْنَة", tr:"fitna",    en:"trial / temptation / chaos",ru:"испытание / смута / хаос",       cat:"noun", sec:4, rank:183, ex:"وَالْفِتْنَةُ أَشَدُّ مِنَ الْقَتْلِ — fitna is worse than killing" },
  { id:184, arabic:"وَجْه",   tr:"wajh",     en:"face / countenance",        ru:"лицо / лик",                     cat:"noun", sec:4, rank:184, ex:"ابْتِغَاءَ وَجْهِ اللَّهِ — seeking the face of Allah" },
  { id:185, arabic:"يَد",     tr:"yad",      en:"hand",                      ru:"рука",                           cat:"noun", sec:4, rank:185, ex:"يَدُ اللَّهِ فَوْقَ أَيْدِيهِمْ — the hand of Allah is above their hands" },
  { id:186, arabic:"رُوح",    tr:"rūḥ",      en:"spirit / soul",             ru:"дух / душа",                     cat:"noun", sec:4, rank:186, ex:"وَيَسْأَلُونَكَ عَنِ الرُّوحِ — they ask you about the soul" },
  { id:187, arabic:"شَمْس",   tr:"shams",    en:"sun",                       ru:"солнце",                         cat:"noun", sec:4, rank:187, ex:"وَالشَّمْسِ وَضُحَاهَا — by the sun and its brightness" },
  { id:188, arabic:"قَمَر",   tr:"qamar",    en:"moon",                      ru:"луна",                           cat:"noun", sec:4, rank:188, ex:"وَالشَّمْسَ وَالْقَمَرَ — the sun and the moon" },
  { id:189, arabic:"لَيْل",   tr:"layl",     en:"night",                     ru:"ночь",                           cat:"noun", sec:4, rank:189, ex:"وَاللَّيْلِ إِذَا يَغْشَىٰ — by the night when it covers" },
  { id:190, arabic:"نَهَار",  tr:"nahār",    en:"day (daytime)",             ru:"день (светлое время)",           cat:"noun", sec:4, rank:190, ex:"وَجَعَلَ اللَّيْلَ سَكَنًا — He made the night as rest" },
  { id:191, arabic:"أُمّ",    tr:"umm",      en:"mother / source",           ru:"мать / источник",                cat:"noun", sec:4, rank:191, ex:"وَأُمَّهَاتُكُمُ اللَّاتِي أَرْضَعْنَكُمْ — your mothers who nursed you" },
  { id:192, arabic:"أَب",     tr:"ab",       en:"father",                    ru:"отец",                           cat:"noun", sec:4, rank:192, ex:"إِبْرَاهِيمُ أَبَاكُمْ — Ibrahim is your father" },
  { id:193, arabic:"أَخ",     tr:"akh",      en:"brother",                   ru:"брат",                           cat:"noun", sec:4, rank:193, ex:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ — the believers are brothers" },
  { id:194, arabic:"وَلَد",   tr:"walad",    en:"child / son",               ru:"ребёнок / сын",                  cat:"noun", sec:4, rank:194, ex:"لَمْ يَلِدْ وَلَمْ يُولَدْ — He neither begets nor is born" },
  { id:195, arabic:"دُعَاء",  tr:"duʿāʾ",   en:"supplication / prayer",     ru:"мольба / дуа",                   cat:"noun", sec:4, rank:195, ex:"ادْعُونِي أَسْتَجِبْ لَكُمْ — call upon Me; I will respond to you" },
  { id:196, arabic:"حِسَاب",  tr:"ḥisāb",   en:"reckoning / account",       ru:"расчёт / отчёт",                 cat:"noun", sec:4, rank:196, ex:"يَوْمَ الْحِسَابِ — the Day of Reckoning" },
  { id:197, arabic:"مَثَل",   tr:"mathal",   en:"parable / example",         ru:"притча / пример",                cat:"noun", sec:4, rank:197, ex:"ضَرَبَ اللَّهُ مَثَلًا — Allah sets forth a parable" },
  { id:198, arabic:"أَجَل",   tr:"ajal",     en:"appointed time / term",     ru:"срок / назначенное время",       cat:"noun", sec:4, rank:198, ex:"لِكُلِّ أَجَلٍ كِتَابٌ — for every term there is a record" },
  { id:199, arabic:"مُلْك",   tr:"mulk",     en:"dominion / kingdom",        ru:"царство / власть",               cat:"noun", sec:4, rank:199, ex:"تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ — blessed is He in whose hand is dominion" },
  { id:200, arabic:"عِبَادَة",tr:"ʿibāda",   en:"worship / devotion",        ru:"поклонение / богослужение",      cat:"noun", sec:4, rank:200, ex:"وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ — they were commanded only to worship Allah" },

  // LEVEL 5 — Deeper Knowledge
  { id:201, arabic:"أَحَد",   tr:"aḥad",     en:"one / unique / anyone",     ru:"один / единственный",            cat:"noun", sec:5, rank:201, ex:"قُلْ هُوَ اللَّهُ أَحَدٌ — say: He is Allah, the One" },
  { id:202, arabic:"وَاحِد",  tr:"wāḥid",    en:"one / single",              ru:"один / единый",                  cat:"noun", sec:5, rank:202, ex:"وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ — your God is one God" },
  { id:203, arabic:"حَيّ",    tr:"Ḥayy",     en:"Ever-Living / alive",       ru:"Живой / Вечно Живой",            cat:"noun", sec:5, rank:203, ex:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ — Allah, the Ever-Living, the Sustainer" },
  { id:204, arabic:"سَمِيع",  tr:"Samīʿ",    en:"All-Hearing",               ru:"Всеслышащий",                    cat:"noun", sec:5, rank:204, ex:"وَاللَّهُ سَمِيعٌ عَلِيمٌ — Allah is Hearing and Knowing" },
  { id:205, arabic:"بَصِير",  tr:"Baṣīr",    en:"All-Seeing",                ru:"Всевидящий",                     cat:"noun", sec:5, rank:205, ex:"إِنَّ اللَّهَ بِمَا تَعْمَلُونَ بَصِيرٌ — Allah sees what you do" },
  { id:206, arabic:"خَبِير",  tr:"Khabīr",   en:"All-Aware",                 ru:"Всеведущий",                     cat:"noun", sec:5, rank:206, ex:"إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ — Allah is Subtle and All-Aware" },
  { id:207, arabic:"لَطِيف",  tr:"Laṭīf",    en:"Subtle / Kind",             ru:"Добрый / Тонкий",                cat:"noun", sec:5, rank:207, ex:"وَاللَّهُ لَطِيفٌ بِعِبَادِهِ — Allah is Kind to His servants" },
  { id:208, arabic:"وَدُود",  tr:"Wadūd",    en:"Most Loving",               ru:"Любящий",                        cat:"noun", sec:5, rank:208, ex:"وَهُوَ الْغَفُورُ الْوَدُودُ — He is the Forgiving, the Loving" },
  { id:209, arabic:"رَؤُوف",  tr:"Raʾūf",    en:"Most Compassionate",        ru:"Сострадательный",                cat:"noun", sec:5, rank:209, ex:"إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَّحِيمٌ — Allah is Kind and Merciful to people" },
  { id:210, arabic:"غَيْب",   tr:"ghayb",    en:"unseen / unknown",          ru:"скрытое / неведомое",            cat:"noun", sec:5, rank:210, ex:"عَالِمُ الْغَيْبِ وَالشَّهَادَةِ — Knower of the unseen and the witnessed" },
  { id:211, arabic:"شَهَادَة",tr:"shahāda",  en:"testimony / witnessed world",ru:"свидетельство / видимый мир",   cat:"noun", sec:5, rank:211, ex:"عَالِمُ الْغَيْبِ وَالشَّهَادَةِ — Knower of the unseen and the witnessed" },
  { id:212, arabic:"مِيزَان", tr:"mīzān",    en:"balance / scale",           ru:"весы / мерило",                  cat:"noun", sec:5, rank:212, ex:"وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ — He raised the heaven and established the balance" },
  { id:213, arabic:"صِدْق",   tr:"ṣidq",     en:"truthfulness / sincerity",  ru:"правдивость / искренность",      cat:"noun", sec:5, rank:213, ex:"كُونُوا مَعَ الصَّادِقِينَ — be with the truthful" },
  { id:214, arabic:"تَوْبَة", tr:"tawba",    en:"repentance / returning to Allah",ru:"покаяние / тауба",          cat:"noun", sec:5, rank:214, ex:"وَتُوبُوا إِلَى اللَّهِ جَمِيعًا — repent to Allah all of you" },
  { id:215, arabic:"أَجْر",   tr:"ajr",      en:"reward / recompense",       ru:"награда / воздаяние",            cat:"noun", sec:5, rank:215, ex:"وَاللَّهُ عِندَهُ أَجْرٌ عَظِيمٌ — with Allah is a great reward" },
  { id:216, arabic:"بَلَاء",  tr:"balāʾ",    en:"trial / tribulation",       ru:"испытание / невзгода",           cat:"noun", sec:5, rank:216, ex:"وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ — We will test you with something of fear" },
  { id:217, arabic:"قَدَر",   tr:"qadar",    en:"divine decree / fate",      ru:"предопределение / кадар",        cat:"noun", sec:5, rank:217, ex:"إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ — We created all things according to a measure" },
  { id:218, arabic:"عَرْش",   tr:"ʿarsh",    en:"throne",                    ru:"трон",                           cat:"noun", sec:5, rank:218, ex:"وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ — He is the Lord of the Mighty Throne" },
  { id:219, arabic:"كُرْسِيّ",tr:"kursiyy",  en:"footstool / seat of authority",ru:"подножие трона",             cat:"noun", sec:5, rank:219, ex:"وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ — His footstool extends over the heavens and earth" },
  { id:220, arabic:"بُرْهَان",tr:"burhān",   en:"proof / evidence",          ru:"доказательство / довод",         cat:"noun", sec:5, rank:220, ex:"قَدْ جَاءَكُم بُرْهَانٌ — a proof has come to you" },
  { id:221, arabic:"خَوْف",   tr:"khawf",    en:"fear / dread",              ru:"страх",                          cat:"noun", sec:5, rank:221, ex:"لَا خَوْفٌ عَلَيْهِمْ — there is no fear for them" },
  { id:222, arabic:"رَجَاء",  tr:"rajāʾ",    en:"hope / expectation",        ru:"надежда",                        cat:"noun", sec:5, rank:222, ex:"مَن كَانَ يَرْجُو لِقَاءَ اللَّهِ — whoever hopes for the meeting with Allah" },
  { id:223, arabic:"هُدَى",   tr:"hudā",     en:"guidance",                  ru:"руководство / наставление",      cat:"noun", sec:5, rank:223, ex:"هُدًى لِّلْمُتَّقِينَ — guidance for the righteous" },
  { id:224, arabic:"ضَلَال",  tr:"ḍalāl",    en:"misguidance / straying",    ru:"заблуждение",                    cat:"noun", sec:5, rank:224, ex:"وَمَن يُضْلِلِ اللَّهُ فَمَا لَهُ مِنْ هَادٍ — whoever Allah sends astray has no guide" },
  { id:225, arabic:"غَضَب",   tr:"ghadab",   en:"anger / wrath",             ru:"гнев",                           cat:"noun", sec:5, rank:225, ex:"وَبَاءُوا بِغَضَبٍ مِّنَ اللَّهِ — they returned with anger from Allah" },
  { id:226, arabic:"إِخْلَاص",tr:"ikhlāṣ",  en:"sincerity / devotion",      ru:"искренность / преданность",      cat:"noun", sec:5, rank:226, ex:"مُخْلِصِينَ لَهُ الدِّينَ — being sincere to Him in religion" },
  { id:227, arabic:"شِرْك",   tr:"shirk",    en:"associating partners with Allah",ru:"многобожие / ширк",        cat:"noun", sec:5, rank:227, ex:"إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ — Allah does not forgive associating partners with Him" },
  { id:228, arabic:"خُشُوع",  tr:"khushūʿ",  en:"humility / reverence",      ru:"смирение / богобоязненность",    cat:"noun", sec:5, rank:228, ex:"الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ — those who are humbly submissive in prayer" },
  { id:229, arabic:"وَحْي",   tr:"waḥy",     en:"divine revelation",         ru:"откровение / внушение",          cat:"noun", sec:5, rank:229, ex:"إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ — it is not but a revelation revealed" },
  { id:230, arabic:"سُنَّة",  tr:"sunna",    en:"way / practice / tradition",ru:"сунна / традиция",               cat:"noun", sec:5, rank:230, ex:"سُنَّةَ اللَّهِ فِي الَّذِينَ خَلَوْا — the way of Allah among those who passed" },
  { id:231, arabic:"أَمَانَة",tr:"amāna",    en:"trust / responsibility",    ru:"доверие / ответственность",      cat:"noun", sec:5, rank:231, ex:"إِنَّا عَرَضْنَا الْأَمَانَةَ — We offered the trust" },
  { id:232, arabic:"عَهْد",   tr:"ʿahd",     en:"covenant / promise",        ru:"завет / обещание",               cat:"noun", sec:5, rank:232, ex:"أَوْفُوا بِالْعُقُودِ — fulfill covenants" },
  { id:233, arabic:"نِفَاق",  tr:"nifāq",    en:"hypocrisy",                 ru:"лицемерие / нифак",              cat:"noun", sec:5, rank:233, ex:"الْمُنَافِقُونَ فِي الدَّرْكِ الْأَسْفَلِ مِنَ النَّارِ — hypocrites are in the lowest depths of fire" },
  { id:234, arabic:"بِرّ",    tr:"birr",     en:"righteousness / piety",     ru:"праведность / благочестие",      cat:"noun", sec:5, rank:234, ex:"لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا — you will not attain righteousness until you spend" },
  { id:235, arabic:"فَسَاد",  tr:"fasād",    en:"corruption / mischief",     ru:"порча / нечестие",               cat:"noun", sec:5, rank:235, ex:"وَلَا تُفْسِدُوا فِي الْأَرْضِ — do not cause corruption on earth" },
  { id:236, arabic:"ظُلْمَة", tr:"ẓulma",    en:"darkness",                  ru:"тьма / мрак",                    cat:"noun", sec:5, rank:236, ex:"مِنَ الظُّلُمَاتِ إِلَى النُّورِ — from darkness to light" },
  { id:237, arabic:"حِجَاب",  tr:"ḥijāb",    en:"veil / barrier",            ru:"завеса / преграда",              cat:"noun", sec:5, rank:237, ex:"وَمِن بَيْنِنَا وَبَيْنِكَ حِجَابٌ — between us and you is a veil" },
  { id:238, arabic:"أَسْمَاء",tr:"asmāʾ",    en:"names",                     ru:"имена",                          cat:"noun", sec:5, rank:238, ex:"وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى — to Allah belong the Most Beautiful Names" },
  { id:239, arabic:"تَسْبِيح",tr:"tasbīḥ",   en:"glorification / SubhanAllah",ru:"прославление / «Субханаллах»",  cat:"noun", sec:5, rank:239, ex:"فَسَبِّحْ بِحَمْدِ رَبِّكَ — exalt with praise your Lord" },
  { id:240, arabic:"حَمْد",   tr:"ḥamd",     en:"praise / gratitude",        ru:"хвала / восхваление",            cat:"noun", sec:5, rank:240, ex:"الْحَمْدُ لِلَّهِ — all praise is to Allah" },
  { id:241, arabic:"سَلَام",  tr:"salām",    en:"peace / safety / greeting", ru:"мир / безопасность",             cat:"noun", sec:5, rank:241, ex:"السَّلَامُ عَلَيْكُمْ — peace be upon you" },
  { id:242, arabic:"بَرَكَة", tr:"baraka",   en:"blessing / divine grace",   ru:"благодать / баракат",            cat:"noun", sec:5, rank:242, ex:"وَبَارَكْنَا عَلَيْهِ — We blessed him" },
  { id:243, arabic:"مَغْفِرَة",tr:"maghfira", en:"forgiveness / pardon",      ru:"прощение / отпущение грехов",    cat:"noun", sec:5, rank:243, ex:"وَالَّذِينَ يَسْتَغْفِرُونَ بِالْأَسْحَارِ — those who seek forgiveness before dawn" },
  { id:244, arabic:"رِضْوَان",tr:"riḍwān",   en:"pleasure / approval of Allah",ru:"довольство / одобрение Аллаха",cat:"noun", sec:5, rank:244, ex:"ابْتِغَاءَ رِضْوَانِ اللَّهِ — seeking the pleasure of Allah" },
  { id:245, arabic:"فَضْل",   tr:"faḍl",     en:"grace / favor / bounty",    ru:"милость / щедрость",             cat:"noun", sec:5, rank:245, ex:"وَاللَّهُ ذُو الْفَضْلِ الْعَظِيمِ — Allah is the possessor of great bounty" },
  { id:246, arabic:"كَرَامَة",tr:"karāma",   en:"dignity / honor",           ru:"достоинство / честь",            cat:"noun", sec:5, rank:246, ex:"وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ — We have dignified the children of Adam" },
  { id:247, arabic:"حُزْن",   tr:"ḥuzn",     en:"grief / sadness",           ru:"горе / печаль",                  cat:"noun", sec:5, rank:247, ex:"وَلَا هُمْ يَحْزَنُونَ — nor shall they grieve" },
  { id:248, arabic:"اطمئنان", tr:"iṭmiʾnān", en:"tranquility / contentment", ru:"успокоение / умиротворение",     cat:"noun", sec:5, rank:248, ex:"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ — in the remembrance of Allah hearts find tranquility" },
  { id:249, arabic:"ظُلْم",   tr:"ẓulm",     en:"injustice / oppression",    ru:"несправедливость / угнетение",   cat:"noun", sec:5, rank:249, ex:"وَاللَّهُ لَا يُحِبُّ الظَّالِمِينَ — Allah does not love the wrongdoers" },
  { id:250, arabic:"لِقَاء",  tr:"liqāʾ",    en:"meeting / encounter",       ru:"встреча / свидание",             cat:"noun", sec:5, rank:250, ex:"مَن كَانَ يَرْجُو لِقَاءَ اللَّهِ — whoever hopes for the meeting with Allah" },

  // LEVEL 6 — Review & Mastery
  { id:251, arabic:"مُؤْمِن", tr:"muʾmin",   en:"believer / faithful",       ru:"верующий",                       cat:"noun", sec:6, rank:251, ex:"إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ — the believers are brothers" },
  { id:252, arabic:"مُسْلِم", tr:"muslim",   en:"Muslim / one who submits",  ru:"мусульманин / покорный",         cat:"noun", sec:6, rank:252, ex:"وَنَحْنُ لَهُ مُسْلِمُونَ — we are to Him submitters" },
  { id:253, arabic:"مُنَافِق",tr:"munāfiq",  en:"hypocrite",                 ru:"лицемер / мунафик",              cat:"noun", sec:6, rank:253, ex:"الْمُنَافِقُونَ وَالْمُنَافِقَاتُ — the hypocrite men and women" },
  { id:254, arabic:"كَافِر",  tr:"kāfir",    en:"disbeliever / ingrate",     ru:"неверующий / кафир",             cat:"noun", sec:6, rank:254, ex:"وَاللَّهُ لَا يَهْدِي الْقَوْمَ الْكَافِرِينَ — Allah does not guide the disbelieving people" },
  { id:255, arabic:"مُتَّقِي",tr:"muttaqī",  en:"God-fearing / righteous",   ru:"богобоязненный",                 cat:"noun", sec:6, rank:255, ex:"هُدًى لِّلْمُتَّقِينَ — guidance for the righteous" },
  { id:256, arabic:"صَادِق",  tr:"ṣādiq",    en:"truthful / sincere",        ru:"правдивый / искренний",          cat:"noun", sec:6, rank:256, ex:"كُونُوا مَعَ الصَّادِقِينَ — be with the truthful" },
  { id:257, arabic:"ظَالِم",  tr:"ẓālim",    en:"oppressor / wrongdoer",     ru:"притеснитель",                   cat:"noun", sec:6, rank:257, ex:"وَاللَّهُ لَا يُحِبُّ الظَّالِمِينَ — Allah does not love the wrongdoers" },
  { id:258, arabic:"صَابِر",  tr:"ṣābir",    en:"patient / enduring",        ru:"терпеливый",                     cat:"noun", sec:6, rank:258, ex:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ — Allah is with the patient" },
  { id:259, arabic:"شَاكِر",  tr:"shākir",   en:"grateful / thankful",       ru:"благодарный",                    cat:"noun", sec:6, rank:259, ex:"وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ — few of My servants are truly grateful" },
  { id:260, arabic:"عَابِد",  tr:"ʿābid",    en:"worshipper / devout",       ru:"поклоняющийся",                  cat:"noun", sec:6, rank:260, ex:"وَأَنَا أَوَّلُ الْعَابِدِينَ — I am the first of the worshippers" },
  { id:261, arabic:"عَالِم",  tr:"ʿālim",    en:"scholar / one who knows",   ru:"учёный / знающий",               cat:"noun", sec:6, rank:261, ex:"إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ — only the scholars truly fear Allah" },
  { id:262, arabic:"مُحْسِن", tr:"muḥsin",   en:"doer of good",              ru:"творящий добро",                 cat:"noun", sec:6, rank:262, ex:"إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ — Allah loves those who do good" },
  { id:263, arabic:"مُصْلِح", tr:"muṣliḥ",   en:"reformer / peacemaker",     ru:"реформатор / миротворец",        cat:"noun", sec:6, rank:263, ex:"إِنْ أُرِيدُ إِلَّا الْإِصْلَاحَ — I only intend reform" },
  { id:264, arabic:"عِبَاد",  tr:"ʿibād",    en:"servants of Allah",         ru:"рабы / слуги Аллаха",            cat:"noun", sec:6, rank:264, ex:"وَعِبَادُ الرَّحْمَٰنِ — the servants of the Most Merciful" },
  { id:265, arabic:"أَوْلِيَاء",tr:"awliyāʾ",en:"allies / friends / protectors",ru:"союзники / друзья",          cat:"noun", sec:6, rank:265, ex:"أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ — the allies of Allah will have no fear" },
  { id:266, arabic:"جِهَاد",  tr:"jihād",    en:"striving in the way of Allah",ru:"усердие на пути Аллаха",       cat:"noun", sec:6, rank:266, ex:"وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ — strive in Allah as He deserves" },
  { id:267, arabic:"هِجْرَة", tr:"hijra",    en:"migration for faith",       ru:"переселение / хиджра",           cat:"noun", sec:6, rank:267, ex:"وَالَّذِينَ هَاجَرُوا فِي سَبِيلِ اللَّهِ — those who emigrated in the way of Allah" },
  { id:268, arabic:"شُورَى",  tr:"shūrā",    en:"consultation / mutual counsel",ru:"совещание / совет",           cat:"noun", sec:6, rank:268, ex:"وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ — their affairs are by consultation" },
  { id:269, arabic:"حُدُود",  tr:"ḥudūd",    en:"limits / boundaries of Allah",ru:"пределы / границы Аллаха",    cat:"noun", sec:6, rank:269, ex:"تِلْكَ حُدُودُ اللَّهِ — these are the limits of Allah" },
  { id:270, arabic:"يَقِين",  tr:"yaqīn",    en:"certainty / conviction",    ru:"убеждённость / уверенность",     cat:"noun", sec:6, rank:270, ex:"وَاعْبُدْ رَبَّكَ حَتَّى يَأْتِيَكَ الْيَقِينُ — worship your Lord until certainty comes" },
  { id:271, arabic:"إِسْلَام",tr:"islām",    en:"Islam / submission to Allah",ru:"ислам / покорность",            cat:"noun", sec:6, rank:271, ex:"إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ — the religion with Allah is Islam" },
  { id:272, arabic:"قُرْآن",  tr:"qurʾān",   en:"the Quran / recitation",    ru:"Коран / чтение",                 cat:"noun", sec:6, rank:272, ex:"إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي — this Quran guides" },
  { id:273, arabic:"حَسَنَة", tr:"ḥasana",   en:"good deed / blessing",      ru:"доброе дело / благо",            cat:"noun", sec:6, rank:273, ex:"مَن جَاءَ بِالْحَسَنَةِ فَلَهُ عَشْرُ أَمْثَالِهَا — one good deed gets ten times its like" },
  { id:274, arabic:"سَيِّئَة",tr:"sayyiʾa",  en:"bad deed / evil",           ru:"плохое дело / зло",              cat:"noun", sec:6, rank:274, ex:"وَمَن جَاءَ بِالسَّيِّئَةِ فَلَا يُجْزَىٰ إِلَّا مِثْلَهَا — evil deed recompensed only with its equivalent" },
  { id:275, arabic:"سِرّ",    tr:"sirr",     en:"secret / private",          ru:"секрет / тайное",                cat:"noun", sec:6, rank:275, ex:"يَعْلَمُ السِّرَّ وَأَخْفَى — He knows the secret and what is even more hidden" },
  { id:276, arabic:"وَسِيلَة",tr:"wasīla",   en:"means / approach",          ru:"средство / способ",              cat:"noun", sec:6, rank:276, ex:"وَابْتَغُوا إِلَيْهِ الْوَسِيلَةَ — seek the means of approach to Him" },
  { id:277, arabic:"كِبْر",   tr:"kibr",     en:"arrogance / pride",         ru:"высокомерие / гордыня",          cat:"noun", sec:6, rank:277, ex:"لَا يَدْخُلُ الْجَنَّةَ مَن فِي قَلْبِهِ كِبْرٌ — no one with arrogance in heart will enter Paradise" },
  { id:278, arabic:"تَوَاضُع",tr:"tawāḍuʿ",  en:"humility / modesty",        ru:"скромность / смирение",          cat:"noun", sec:6, rank:278, ex:"وَاخْفِضْ جَنَاحَكَ لِلْمُؤْمِنِينَ — lower your wing to the believers" },
  { id:279, arabic:"رِيَاء",  tr:"riyāʾ",    en:"showing off / ostentation", ru:"показуха / тщеславие",           cat:"noun", sec:6, rank:279, ex:"وَلَا يَرَاهُ أَحَدٌ — let no one see it (sincerity in deeds)" },
  { id:280, arabic:"قَضَاء",  tr:"qaḍāʾ",    en:"decree / judgment",         ru:"предопределение / решение",      cat:"noun", sec:6, rank:280, ex:"وَكَانَ أَمْرُ اللَّهِ قَدَرًا مَّقْدُورًا — the command of Allah is a destiny decreed" },
  { id:281, arabic:"اسْتِغْفَار",tr:"istighfār",en:"seeking forgiveness",    ru:"испрашивание прощения",          cat:"noun", sec:6, rank:281, ex:"وَاسْتَغْفِرُوا اللَّهَ — seek forgiveness from Allah" },
  { id:282, arabic:"ثَوَاب",  tr:"thawāb",   en:"reward from Allah",         ru:"награда от Аллаха",              cat:"noun", sec:6, rank:282, ex:"وَاللَّهُ عِندَهُ حُسْنُ الثَّوَابِ — with Allah is an excellent reward" },
  { id:283, arabic:"عَقْل",   tr:"ʿaql",     en:"intellect / reason / mind", ru:"разум / интеллект",              cat:"noun", sec:6, rank:283, ex:"لِقَوْمٍ يَعْقِلُونَ — for people who reason" },
  { id:284, arabic:"شُكْر",   tr:"shukr",    en:"gratitude / thankfulness",  ru:"благодарность",                  cat:"noun", sec:6, rank:284, ex:"وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ — few of My servants are grateful" },
  { id:285, arabic:"نُبُوَّة",tr:"nubuwwa",  en:"prophethood",               ru:"пророчество",                    cat:"noun", sec:6, rank:285, ex:"وَآتَيْنَاهُ الْحُكْمَ وَالنُّبُوَّةَ — We gave him wisdom and prophethood" },
  { id:286, arabic:"رِسَالَة",tr:"risāla",   en:"message / mission",         ru:"послание / миссия",              cat:"noun", sec:6, rank:286, ex:"فَمَا بَلَّغْتَ رِسَالَتَهُ — you have not conveyed His message" },
  { id:287, arabic:"حَلَال",  tr:"ḥalāl",    en:"permissible / lawful",      ru:"дозволенное / халяль",           cat:"noun", sec:6, rank:287, ex:"أُحِلَّ لَكُمُ الطَّيِّبَاتُ — the good things are permitted to you" },
  { id:288, arabic:"حَرَام",  tr:"ḥarām",    en:"forbidden / prohibited",    ru:"запрещённое / харам",            cat:"noun", sec:6, rank:288, ex:"وَحَرَّمَ الرِّبَا — He has forbidden interest" },
  { id:289, arabic:"خُلُق",   tr:"khuluq",   en:"character / morals",        ru:"нрав / характер / мораль",       cat:"noun", sec:6, rank:289, ex:"وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ — you are of great moral character" },
  { id:290, arabic:"إِحْسَان",tr:"iḥsān",    en:"excellence / perfecting worship",ru:"совершенство / ихсан",      cat:"noun", sec:6, rank:290, ex:"إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ — Allah commands justice and excellence" },
  { id:291, arabic:"تَفْسِير",tr:"tafsīr",   en:"interpretation of Quran",   ru:"толкование / тафсир",            cat:"noun", sec:6, rank:291, ex:"وَأَنزَلْنَا إِلَيْكَ الذِّكْرَ لِتُبَيِّنَ — We sent down the reminder so you may explain" },
  { id:292, arabic:"مُعْجِزَة",tr:"muʿjiza",  en:"miracle / wonder",          ru:"чудо",                           cat:"noun", sec:6, rank:292, ex:"وَمَا كَانَ لِرَسُولٍ أَن يَأْتِيَ بِآيَةٍ — it is not for a messenger to bring a sign except by Allah's permission" },
  { id:293, arabic:"عَقِيدَة",tr:"ʿaqīda",   en:"creed / belief / doctrine", ru:"вероубеждение / акида",          cat:"noun", sec:6, rank:293, ex:"وَمَن يَكْفُرْ بِالْإِيمَانِ فَقَدْ حَبِطَ عَمَلُهُ — whoever disbelieves, his deeds become worthless" },
  { id:294, arabic:"مِحْرَاب",tr:"miḥrāb",   en:"prayer niche / sanctuary",  ru:"михраб / молитвенная ниша",      cat:"noun", sec:6, rank:294, ex:"كُلَّمَا دَخَلَ عَلَيْهَا زَكَرِيَّا الْمِحْرَابَ — every time Zakariyya entered the sanctuary" },
  { id:295, arabic:"تَكْبِير",tr:"takbīr",   en:"magnifying Allah / Allahu Akbar",ru:"возвеличивание / Аллаху Акбар",cat:"noun",sec:6,rank:295, ex:"وَاللَّهُ أَكْبَرُ — and Allah is the Greatest" },
  { id:296, arabic:"فِقْه",   tr:"fiqh",     en:"Islamic jurisprudence",     ru:"фикх / исламское право",         cat:"noun", sec:6, rank:296, ex:"وَلِيُنذِرُوا قَوْمَهُمْ إِذَا رَجَعُوا — to warn their people when they return" },
  { id:297, arabic:"صِفَات",  tr:"ṣifāt",    en:"attributes / qualities",    ru:"атрибуты / качества",            cat:"noun", sec:6, rank:297, ex:"وَلِلَّهِ الْمَثَلُ الْأَعْلَىٰ — to Allah belong the highest attributes" },
  { id:298, arabic:"نِيَّة",  tr:"niyya",    en:"intention / purpose",       ru:"намерение / цель",               cat:"noun", sec:6, rank:298, ex:"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ — indeed deeds are judged by intentions" },
  { id:299, arabic:"تَوْحِيد",tr:"tawḥīd",   en:"monotheism / oneness of Allah",ru:"единобожие / таухид",         cat:"noun", sec:6, rank:299, ex:"قُلْ هُوَ اللَّهُ أَحَدٌ — Say: He is Allah, the One" },
  { id:300, arabic:"إِحْسَان",tr:"iḥsān",    en:"excellence / perfecting worship",ru:"совершенство / ихсан",      cat:"noun", sec:6, rank:300, ex:"أَن تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ — worship Allah as if you see Him" },
];

const SECTIONS_META = [
  { id:1, title:"Essential Core",     subtitle:"50 most critical Quranic words",      emoji:"🌟", g1:"#1a472a", g2:"#2d6a4f" },
  { id:2, title:"Particles & Pronouns",subtitle:"The connective tissue of Arabic",    emoji:"🔗", g1:"#1a3a5c", g2:"#2563a8" },
  { id:3, title:"Sacred Verbs",       subtitle:"Divine actions and commands",         emoji:"⚡", g1:"#3d1a0f", g2:"#8b3a1a" },
  { id:4, title:"Quranic Nouns",      subtitle:"People, places, and concepts",        emoji:"📿", g1:"#2d1a4a", g2:"#6b3a9e" },
  { id:5, title:"Deeper Knowledge",   subtitle:"Divine names & spiritual terms",      emoji:"✨", g1:"#4a3200", g2:"#b5963e" },
  { id:6, title:"Review & Mastery",   subtitle:"Character, community, and creed",     emoji:"🏆", g1:"#4a1a1a", g2:"#a83232" },
];

const MOTDS = [
  { ar:"رَبِّ زِدْنِي عِلْمًا",                                  en:"My Lord, increase me in knowledge." },
  { ar:"اقْرَأْ بِاسْمِ رَبِّكَ",                                en:"Read in the name of your Lord." },
  { ar:"طَلَبُ الْعِلْمِ فَرِيضَةٌ",                              en:"Seeking knowledge is an obligation." },
  { ar:"الْعِلْمُ نُورٌ",                                         en:"Knowledge is light." },
  { ar:"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",          en:"In the remembrance of Allah do hearts find rest." },
  { ar:"وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ",                      en:"Above every knower is one more knowing." },
  { ar:"إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ",   en:"Only those with knowledge truly fear Allah." },
];

const CATS = ["all","noun","verb","particle","pronoun","preposition"];

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
const LS = {
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

// ─────────────────────────────────────────────────────────────
// SPACED REPETITION
// ─────────────────────────────────────────────────────────────
const SR_DAYS={easy:7,good:3,hard:1,again:0};
function nextReview(r){return Date.now()+SR_DAYS[r]*86400000;}
function rateWord(prog,id,r){
  const p=prog[id]||{};
  return{...prog,[id]:{
    studied:(p.studied||0)+1,
    easyCount:(p.easyCount||0)+(r==="easy"?1:0),
    goodCount:(p.goodCount||0)+(r==="good"?1:0),
    hardCount:(p.hardCount||0)+(r==="hard"?1:0),
    againCount:(p.againCount||0)+(r==="again"?1:0),
    lastRating:r, lastStudied:Date.now(), reviewAt:nextReview(r),
  }};
}
const getDue=(prog)=>VOCAB.filter(w=>{const p=prog[w.id];return p&&p.reviewAt&&p.reviewAt<=Date.now();});
const getWeak=(prog)=>VOCAB.filter(w=>{const p=prog[w.id];return p&&((p.hardCount||0)+(p.againCount||0))>=2;});

// ─────────────────────────────────────────────────────────────
// STREAK
// ─────────────────────────────────────────────────────────────
const todayISO=()=>new Date().toISOString().slice(0,10);
function calcStreak(s){
  const t=todayISO(),y=new Date(Date.now()-86400000).toISOString().slice(0,10);
  if(s.lastDay===t)return s;
  if(s.lastDay===y)return{count:(s.count||0)+1,lastDay:t};
  return{count:1,lastDay:t};
}

// ─────────────────────────────────────────────────────────────
// ICON COMPONENT
// ─────────────────────────────────────────────────────────────
const Ic=({n,s=20,cls=""})=>{
  const p={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",className:cls};
  const icons={
    home:<svg {...p}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
    book:<svg {...p}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
    repeat:<svg {...p}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
    list:<svg {...p}><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>,
    chart:<svg {...p}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    settings:<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    bkmk:<svg {...p}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>,
    vol:<svg {...p}><path d="M11.5 3.5L6 8H2v8h4l5.5 4.5V3.5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>,
    moon:<svg {...p}><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>,
    sun:<svg {...p}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    back:<svg {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
    search:<svg {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    fire:<svg {...p}><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z"/><path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>,
    x:<svg {...p}><path d="M6 18L18 6M6 6l12 12"/></svg>,
    star:<svg {...p}><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>,
  };
  return icons[n]||null;
};

// ─────────────────────────────────────────────────────────────
// FLASHCARD
// ─────────────────────────────────────────────────────────────
function FlashCard({word,onRate,flipped,setFlipped,dark}){
  const GOLD="#c9a84c";
  return(
    <div className="w-full max-w-md mx-auto select-none" style={{perspective:"1200px"}}>
      <div onClick={()=>setFlipped(!flipped)} style={{
        position:"relative",minHeight:"300px",
        transformStyle:"preserve-3d",
        transition:"transform 0.55s cubic-bezier(.4,0,.2,1)",
        transform:flipped?"rotateY(180deg)":"rotateY(0deg)",cursor:"pointer"
      }}>
        {/* Front */}
        <div style={{backfaceVisibility:"hidden",position:"absolute",inset:0}}
          className={`rounded-3xl border shadow-2xl flex flex-col items-center justify-center p-8 ${dark?"bg-stone-900 border-stone-700":"bg-white border-stone-200"}`}>
          <div className="text-[11px] font-bold tracking-widest uppercase mb-5 opacity-50" style={{color:GOLD}}>
            {word.cat} · rank #{word.rank}
          </div>
          <div className="text-[5.5rem] leading-none font-light mb-5"
            style={{fontFamily:"'Amiri',serif",direction:"rtl",color:dark?"#f9edd8":"#1c0e00"}}>
            {word.arabic}
          </div>
          <div className={`text-xs ${dark?"text-stone-500":"text-stone-400"}`}>tap to reveal</div>
        </div>
        {/* Back */}
        <div style={{backfaceVisibility:"hidden",position:"absolute",inset:0,transform:"rotateY(180deg)"}}
          className={`rounded-3xl border shadow-2xl flex flex-col p-7 gap-3 ${dark?"bg-stone-900 border-stone-700":"bg-white border-stone-200"}`}>
          <div className="text-3xl font-light text-center" style={{fontFamily:"'Amiri',serif",direction:"rtl",color:dark?"#f9edd8":"#1c0e00"}}>{word.arabic}</div>
          <div className="text-center font-semibold" style={{fontFamily:"'Crimson Text',serif",color:GOLD,fontSize:"1.1rem"}}>{word.tr}</div>
          <div className="flex gap-2 flex-wrap justify-center">
            <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${dark?"bg-emerald-900/40 text-emerald-300":"bg-emerald-50 text-emerald-800"}`}>🇬🇧 {word.en}</span>
            <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${dark?"bg-amber-900/30 text-amber-300":"bg-amber-50 text-amber-800"}`}>🇷🇺 {word.ru}</span>
          </div>
          <div className={`rounded-2xl p-3 text-xs leading-relaxed flex-1 ${dark?"bg-stone-800":"bg-stone-50"}`}>
            <div className="font-bold text-[10px] tracking-widest uppercase mb-2" style={{color:GOLD}}>EXAMPLE</div>
            <div className="text-right text-lg mb-1" style={{fontFamily:"'Amiri',serif",direction:"rtl",color:dark?"#f9edd8":"#1c0e00",lineHeight:1.7}}>{word.ex.split("—")[0]}</div>
            <div className={dark?"text-stone-400":"text-stone-500"}>{(word.ex.split("—")[1]||"").trim()}</div>
          </div>
        </div>
      </div>

      {flipped&&(
        <div className="mt-5 grid grid-cols-4 gap-2" style={{animation:"fadeUp .25s ease"}}>
          {[
            {k:"again",l:"Again",e:"↩",lc:"bg-red-50 border-red-200 text-red-700",dc:"bg-red-900/40 border-red-800 text-red-300"},
            {k:"hard", l:"Hard", e:"😓",lc:"bg-orange-50 border-orange-200 text-orange-700",dc:"bg-orange-900/40 border-orange-800 text-orange-300"},
            {k:"good", l:"Good", e:"👍",lc:"bg-sky-50 border-sky-200 text-sky-700",dc:"bg-sky-900/40 border-sky-800 text-sky-300"},
            {k:"easy", l:"Easy", e:"✨",lc:"bg-emerald-50 border-emerald-200 text-emerald-700",dc:"bg-emerald-900/40 border-emerald-800 text-emerald-300"},
          ].map(b=>(
            <button key={b.k} onClick={e=>{e.stopPropagation();onRate(b.k);}}
              className={`py-3 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${dark?b.dc:b.lc}`}>
              <div className="text-xl mb-0.5">{b.e}</div>
              <div>{b.l}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App(){
  const [page, setPage]         = useState("home");
  const [dark, setDark]         = useState(()=>LS.get("qv_dark",false));
  const [progress, setProgress] = useState(()=>LS.get("qv_prog",{}));
  const [bookmarks, setBookmarks]= useState(()=>LS.get("qv_bkmk",[]));
  const [streak, setStreak]     = useState(()=>LS.get("qv_streak",{count:0,lastDay:""}));
  const [dailyCounts, setDailyCounts]= useState(()=>LS.get("qv_daily",{}));

  // study
  const [queue,setQueue]   = useState([]);
  const [qIdx,setQIdx]     = useState(0);
  const [flipped,setFlipped]= useState(false);
  const [studySec,setStudySec]= useState(null);

  // wordlist state
  const [search,setSearch]       = useState("");
  const [filterSec,setFilterSec] = useState(0);
  const [filterCat,setFilterCat] = useState("all");
  const [filterDiff,setFilterDiff]= useState("all");

  // review tabs
  const [revTab,setRevTab] = useState("due");

  // settings
  const [resetModal,setResetModal]= useState(false);

  const D=dark;
  const BG   =D?"bg-[#0e0c09]":"bg-stone-50";
  const CARD =D?"bg-stone-900 border-stone-800":"bg-white border-stone-200";
  const TXT  =D?"text-stone-100":"text-stone-900";
  const TSUB =D?"text-stone-400":"text-stone-500";
  const NAVBG=D?"bg-stone-900/95 border-stone-800":"bg-white/95 border-stone-200";
  const GOLD ="#c9a84c";
  const GOLDB="#e0c06a";
  const today=todayISO();

  useEffect(()=>LS.set("qv_dark",dark),[dark]);
  useEffect(()=>LS.set("qv_prog",progress),[progress]);
  useEffect(()=>LS.set("qv_bkmk",bookmarks),[bookmarks]);
  useEffect(()=>LS.set("qv_streak",streak),[streak]);
  useEffect(()=>LS.set("qv_daily",dailyCounts),[dailyCounts]);

  const todayCount=dailyCounts[today]||0;
  const DAILY_GOAL=20;
  const dueWords =useMemo(()=>getDue(progress),[progress]);
  const weakWords=useMemo(()=>getWeak(progress),[progress]);
  const studiedIds=useMemo(()=>new Set(Object.keys(progress).map(Number)),[progress]);
  const strongCount=useMemo(()=>Object.values(progress).filter(p=>(p.easyCount||0)>=2).length,[progress]);

  function startStudy(sec){
    let words=sec==="review_due"?dueWords:sec==="review_weak"?weakWords:sec==="review_all"?[...new Set([...dueWords,...weakWords])]:VOCAB.filter(w=>w.section===sec);
    if(!words.length)return;
    setQueue([...words].sort(()=>Math.random()-.5));
    setQIdx(0);setFlipped(false);setStudySec(sec);setPage("study");
  }

  function handleRate(r){
    const w=queue[qIdx];
    setProgress(p=>rateWord(p,w.id,r));
    setStreak(s=>calcStreak(s));
    setDailyCounts(dc=>({...dc,[today]:(dc[today]||0)+1}));
    if(qIdx+1>=queue.length){setPage("done");}else{setQIdx(i=>i+1);setFlipped(false);}
  }

  function toggleBkmk(id){setBookmarks(b=>b.includes(id)?b.filter(x=>x!==id):[...b,id]);}

  function doReset(){
    setProgress({});setBookmarks([]);setStreak({count:0,lastDay:""});setDailyCounts({});
    LS.set("qv_prog",{});LS.set("qv_bkmk",[]);LS.set("qv_streak",{count:0,lastDay:""});LS.set("qv_daily",{});
    setResetModal(false);setPage("home");
  }

  const motd=MOTDS[new Date().getDay()%MOTDS.length];

  // ══ PAGE: HOME ══════════════════════════════════════════════
  function PageHome(){
    const pct=Math.min(100,Math.round(todayCount/DAILY_GOAL*100));
    return(
      <div className="max-w-lg mx-auto px-4 pb-28 pt-6">
        {/* Hero */}
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">☽</div>
          <h1 className="text-4xl font-bold mb-1" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>Quran Vocab</h1>
          <p className={`text-sm ${TSUB}`}>300 Most Frequent Words of the Holy Quran</p>
          <div className={`mt-4 p-4 rounded-2xl border ${CARD}`}>
            <div className="text-xl mb-1" style={{fontFamily:"'Amiri',serif",direction:"rtl",color:D?"#f9edd8":"#1c0e00"}}>{motd.ar}</div>
            <div className={`text-xs italic ${TSUB}`}>{motd.en}</div>
          </div>
        </div>

        {/* Streak + Daily */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`rounded-2xl border p-4 ${CARD}`}>
            <div className="flex items-center gap-2 mb-2"><Ic n="fire" s={16} cls={streak.count>0?"text-orange-400":"text-stone-400"}/><span className={`text-xs font-bold ${TSUB}`}>Day Streak</span></div>
            <div className={`text-3xl font-bold ${streak.count>0?"text-orange-400":TSUB}`}>{streak.count}</div>
            <div className={`text-[11px] mt-0.5 ${TSUB}`}>{streak.count>0?"🔥 Keep it up!":"Start today!"}</div>
          </div>
          <div className={`rounded-2xl border p-4 ${CARD}`}>
            <div className="flex items-center gap-2 mb-2"><Ic n="star" s={16} cls="" style={{color:GOLD}}/><span className={`text-xs font-bold ${TSUB}`}>Today</span></div>
            <div className="text-3xl font-bold" style={{color:GOLD}}>{todayCount}</div>
            <div className={`text-[11px] mt-0.5 ${TSUB}`}>goal: {DAILY_GOAL}</div>
            <div className={`h-1.5 rounded-full mt-2 ${D?"bg-stone-800":"bg-stone-100"}`}>
              <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:`linear-gradient(90deg,${GOLD},${GOLDB})`}}/>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[{v:studiedIds.size,l:"Studied",c:"text-emerald-500"},{v:strongCount,l:"Strong",c:"text-amber-500"},{v:dueWords.length+weakWords.length,l:"Review",c:"text-rose-400"}].map(s=>(
            <div key={s.l} className={`rounded-2xl border p-3 text-center ${CARD}`}>
              <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
              <div className={`text-xs ${TSUB}`}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button onClick={()=>setPage("sections")} className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 shadow-lg" style={{background:"linear-gradient(135deg,#1a472a,#2d6a4f)"}}>
            Continue Learning →
          </button>
          <button onClick={()=>setPage("review")} className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 border-2" style={{borderColor:GOLD,color:GOLD,background:D?"rgba(201,168,76,.08)":"rgba(201,168,76,.06)"}}>
            ↩ На повторение · {dueWords.length+weakWords.length} слов
          </button>
        </div>
      </div>
    );
  }

  // ══ PAGE: SECTIONS ══════════════════════════════════════════
  function PageSections(){
    return(
      <div className="max-w-lg mx-auto px-4 pb-28 pt-4">
        <h2 className="text-2xl font-bold mb-5" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>Study Levels</h2>
        <div className="space-y-3">
          {SECTIONS_META.map(sec=>{
            const sw=VOCAB.filter(w=>w.section===sec.id);
            const ss=sw.filter(w=>progress[w.id]).length;
            const pct=Math.round(ss/sw.length*100);
            return(
              <button key={sec.id} onClick={()=>startStudy(sec.id)} className={`w-full rounded-2xl border p-5 text-left active:scale-[.98] transition-all ${CARD}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner" style={{background:`linear-gradient(135deg,${sec.g1},${sec.g2})`}}>{sec.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-0.5">
                      <span className={`font-bold text-sm ${TXT}`}>{sec.title}</span>
                      <span className="text-xs font-bold" style={{color:GOLD}}>{pct}%</span>
                    </div>
                    <div className={`text-xs mb-2 ${TSUB}`}>{sec.subtitle}</div>
                    <div className={`h-1.5 rounded-full ${D?"bg-stone-800":"bg-stone-100"} overflow-hidden`}>
                      <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:`linear-gradient(90deg,${GOLD},${GOLDB})`}}/>
                    </div>
                    <div className={`text-xs mt-1 ${TSUB}`}>{ss}/{sw.length} words</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ══ PAGE: STUDY ═════════════════════════════════════════════
  function PageStudy(){
    if(!queue.length)return(
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-5xl mb-4">🎉</div>
        <p className={`font-bold ${TXT}`}>No words to study here.</p>
        <button onClick={()=>setPage("home")} className="mt-4 px-6 py-3 rounded-2xl text-white font-bold" style={{background:"#1a472a"}}>Go Home</button>
      </div>
    );
    const word=queue[qIdx];
    const bk=bookmarks.includes(word.id);
    const pct=Math.round(qIdx/queue.length*100);
    return(
      <div className="max-w-md mx-auto px-4 pt-3 pb-28">
        <div className={`h-1 rounded-full mb-4 ${D?"bg-stone-800":"bg-stone-200"} overflow-hidden`}>
          <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:`linear-gradient(90deg,${GOLD},${GOLDB})`}}/>
        </div>
        <div className="flex justify-between items-center mb-5">
          <span className={`text-xs ${TSUB}`}>{qIdx+1} / {queue.length}</span>
          <div className="flex gap-1">
            <button onClick={()=>toggleBkmk(word.id)} className={`p-2 rounded-xl transition-colors ${bk?"text-amber-400":"text-stone-400"}`}><Ic n="bkmk" s={18} cls={bk?"fill-current":""}/></button>
            <button className="p-2 rounded-xl text-stone-400"><Ic n="vol" s={18}/></button>
          </div>
        </div>
        <FlashCard word={word} onRate={handleRate} flipped={flipped} setFlipped={setFlipped} dark={D}/>
      </div>
    );
  }

  // ══ PAGE: DONE ══════════════════════════════════════════════
  function PageDone(){
    return(
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-3xl font-bold mb-2" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>Session Complete!</h2>
        <p className={`${TSUB} mb-1`}>{queue.length} words reviewed</p>
        <div className="flex items-center gap-2 justify-center mb-6">
          <Ic n="fire" s={16} cls="text-orange-400"/>
          <span className="text-orange-400 font-bold text-sm">{streak.count} day streak 🔥</span>
        </div>
        <p className={`text-sm italic ${TSUB} mb-8 max-w-xs`} style={{fontFamily:"'Crimson Text',serif"}}>رَبِّ زِدْنِي عِلْمًا — My Lord, increase me in knowledge.</p>
        <div className="space-y-3 w-full max-w-xs">
          <button onClick={()=>startStudy(studySec)} className="w-full py-4 rounded-2xl text-white font-bold shadow-lg" style={{background:"linear-gradient(135deg,#1a472a,#2d6a4f)"}}>Study Again</button>
          <button onClick={()=>setPage("home")} className={`w-full py-4 rounded-2xl font-bold border ${CARD} ${TXT}`}>Back Home</button>
        </div>
      </div>
    );
  }

  // ══ PAGE: REVIEW ════════════════════════════════════════════
  function PageReview(){
    const tabWords=revTab==="due"?dueWords:weakWords;
    const allRev=[...new Set([...dueWords,...weakWords])];
    return(
      <div className="max-w-lg mx-auto px-4 pb-28 pt-4">
        <h2 className="text-2xl font-bold mb-1" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>На повторение</h2>
        <p className={`text-sm mb-5 ${TSUB}`}>{allRev.length} слов требуют внимания</p>

        {/* Start buttons */}
        {allRev.length>0&&(
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button onClick={()=>startStudy("review_all")} className="col-span-2 py-4 rounded-2xl text-white font-bold shadow-lg" style={{background:"linear-gradient(135deg,#1a472a,#2d6a4f)"}}>
              Повторить все ({allRev.length})
            </button>
            <button onClick={()=>startStudy("review_due")} className={`py-3 rounded-2xl text-sm font-bold border ${D?"border-sky-800 text-sky-400 bg-sky-900/20":"border-sky-200 text-sky-700 bg-sky-50"}`}>
              ⏰ Due ({dueWords.length})
            </button>
            <button onClick={()=>startStudy("review_weak")} className={`py-3 rounded-2xl text-sm font-bold border ${D?"border-rose-800 text-rose-400 bg-rose-900/20":"border-rose-200 text-rose-700 bg-rose-50"}`}>
              ⚠️ Weak ({weakWords.length})
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex rounded-2xl border overflow-hidden mb-4 ${CARD}`}>
          {[["due","⏰ Due for Review"],["weak","⚠️ Weak Words"]].map(([k,l])=>(
            <button key={k} onClick={()=>setRevTab(k)} className="flex-1 py-3 text-sm font-bold transition-colors"
              style={{background:revTab===k?GOLD:"transparent",color:revTab===k?"#fff":D?"#78716c":"#a8a29e"}}>
              {l}
            </button>
          ))}
        </div>

        {tabWords.length===0?(
          <div className={`rounded-2xl border p-8 text-center ${CARD}`}>
            <div className="text-4xl mb-3">✅</div>
            <p className={`font-bold ${TXT}`}>{revTab==="due"?"No words due right now!":"No weak words yet!"}</p>
            <p className={`text-sm mt-1 ${TSUB}`}>{revTab==="due"?"Come back later as words become due.":"Rate words as Hard/Again to build this list."}</p>
          </div>
        ):(
          <div className="space-y-2">
            {tabWords.map(w=>{
              const p=progress[w.id]||{};
              const wk=(p.hardCount||0)+(p.againCount||0);
              return(
                <div key={w.id} className={`rounded-2xl border p-4 flex items-center gap-3 ${CARD}`}>
                  <div className="text-2xl min-w-[60px] text-right" style={{fontFamily:"'Amiri',serif",color:D?"#f9edd8":"#1c0e00",direction:"rtl"}}>{w.arabic}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${TXT} truncate`}>{w.en}</div>
                    <div className={`text-xs ${TSUB}`}>{w.tr} · {w.cat}</div>
                  </div>
                  {revTab==="weak"&&<span className={`text-xs px-2 py-1 rounded-lg font-bold flex-shrink-0 ${D?"bg-rose-900/40 text-rose-400":"bg-rose-50 text-rose-600"}`}>{wk}× weak</span>}
                  {revTab==="due"&&<span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${D?"bg-sky-900/40 text-sky-400":"bg-sky-50 text-sky-700"}`}>due</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ══ PAGE: WORD LIST ═════════════════════════════════════════
  function PageWordList(){
    const filtered=useMemo(()=>VOCAB.filter(w=>{
      const q=search.toLowerCase();
      const ms=!q||w.arabic.includes(q)||w.tr.toLowerCase().includes(q)||w.en.toLowerCase().includes(q)||w.ru.toLowerCase().includes(q);
      const mSec=!filterSec||w.section===filterSec;
      const mCat=filterCat==="all"||w.cat===filterCat;
      const p=progress[w.id];
      const mDiff=filterDiff==="all"||(filterDiff==="unseen"&&!p)||(filterDiff==="weak"&&p&&(p.hardCount||0)+(p.againCount||0)>=2)||(filterDiff==="strong"&&p&&(p.easyCount||0)>=2);
      return ms&&mSec&&mCat&&mDiff;
    }),[search,filterSec,filterCat,filterDiff,progress]);

    return(
      <div className="max-w-lg mx-auto px-4 pb-28 pt-4">
        <h2 className="text-2xl font-bold mb-4" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>Word List</h2>

        {/* Search */}
        <div className={`flex items-center gap-2 rounded-2xl border p-3 mb-3 ${CARD}`}>
          <Ic n="search" s={16} cls={TSUB}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Arabic, English, Russian..."
            className={`flex-1 bg-transparent text-sm outline-none ${TXT}`}/>
          {search&&<button onClick={()=>setSearch("")} className={TSUB}><Ic n="x" s={14}/></button>}
        </div>

        {/* Section filter */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
          {[{id:0,title:"All Levels"},...SECTIONS_META].map(s=>(
            <button key={s.id} onClick={()=>setFilterSec(s.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all"
              style={filterSec===s.id?{background:GOLD,color:"#fff",borderColor:GOLD}:{color:D?"#78716c":"#a8a29e",borderColor:D?"#292524":"#e7e5e4"}}>
              {s.title||"All Levels"}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setFilterCat(c)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all capitalize"
              style={filterCat===c?{background:"#1a472a",color:"#fff",borderColor:"#1a472a"}:{color:D?"#78716c":"#a8a29e",borderColor:D?"#292524":"#e7e5e4"}}>
              {c}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
          {[["all","All"],["unseen","Unseen"],["weak","Weak"],["strong","Strong"]].map(([k,l])=>(
            <button key={k} onClick={()=>setFilterDiff(k)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all"
              style={filterDiff===k?{background:"#1a3a5c",color:"#fff",borderColor:"#1a3a5c"}:{color:D?"#78716c":"#a8a29e",borderColor:D?"#292524":"#e7e5e4"}}>
              {l}
            </button>
          ))}
        </div>

        <p className={`text-xs mb-3 ${TSUB}`}>{filtered.length} words</p>

        <div className="space-y-2">
          {filtered.slice(0,150).map(w=>{
            const p=progress[w.id];
            const bk=bookmarks.includes(w.id);
            const isStrong=p&&(p.easyCount||0)>=2;
            const isWeak=p&&(p.hardCount||0)+(p.againCount||0)>=2;
            return(
              <div key={w.id} className={`rounded-2xl border p-4 flex items-center gap-3 ${CARD}`}>
                <div className="text-2xl min-w-[60px] text-right" style={{fontFamily:"'Amiri',serif",color:D?"#f9edd8":"#1c0e00",direction:"rtl"}}>{w.arabic}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold mb-0.5" style={{color:GOLD}}>{w.tr}</div>
                  <div className={`text-sm ${TXT} truncate`}>{w.en}</div>
                  <div className={`text-xs ${TSUB} truncate`}>{w.ru}</div>
                </div>
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <button onClick={()=>toggleBkmk(w.id)} className={bk?"text-amber-400":"text-stone-400"}><Ic n="bkmk" s={15} cls={bk?"fill-current":""}/></button>
                  {p&&<div className="w-2 h-2 rounded-full" style={{background:isStrong?"#22c55e":isWeak?"#f97316":GOLD}}/>}
                </div>
              </div>
            );
          })}
          {filtered.length>150&&<p className={`text-center text-xs py-3 ${TSUB}`}>Showing 150 of {filtered.length}</p>}
        </div>
      </div>
    );
  }

  // ══ PAGE: STATS ═════════════════════════════════════════════
  function PageStats(){
    const total=VOCAB.length;
    const pct=Math.round(studiedIds.size/total*100);
    const days=Array.from({length:7}).map((_,i)=>{
      const d=new Date(Date.now()-(6-i)*86400000);
      const k=d.toISOString().slice(0,10);
      return{k,label:d.toLocaleDateString("en",{weekday:"short"}),count:dailyCounts[k]||0};
    });
    const maxDay=Math.max(...days.map(d=>d.count),1);
    return(
      <div className="max-w-lg mx-auto px-4 pb-28 pt-4">
        <h2 className="text-2xl font-bold mb-5" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>Statistics</h2>

        {/* Circular progress */}
        <div className={`rounded-2xl border p-6 mb-4 text-center ${CARD}`}>
          <div className="relative w-36 h-36 mx-auto mb-3">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={D?"#292524":"#e7e5e4"} strokeWidth="2.5"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={GOLD} strokeWidth="2.5"
                strokeDasharray={`${pct} ${100-pct}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold" style={{color:GOLD}}>{pct}%</div>
              <div className={`text-xs ${TSUB}`}>Complete</div>
            </div>
          </div>
          <p className={`text-sm ${TSUB}`}>{studiedIds.size} of {total} words studied</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{v:studiedIds.size,l:"Studied",e:"📚"},{v:strongCount,l:"Strong",e:"💪"},{v:weakWords.length,l:"Weak",e:"🔄"},{v:dueWords.length,l:"Due",e:"⏰"},{v:todayCount,l:"Today",e:"📅"},{v:bookmarks.length,l:"Bookmarks",e:"🔖"}].map(s=>(
            <div key={s.l} className={`rounded-2xl border p-4 ${CARD}`}>
              <div className="text-xl mb-1">{s.e}</div>
              <div className={`text-2xl font-bold ${TXT}`}>{s.v}</div>
              <div className={`text-xs ${TSUB}`}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Streak + 7-day chart */}
        <div className={`rounded-2xl border p-5 mb-4 ${CARD}`}>
          <div className="flex items-center gap-2 mb-4">
            <Ic n="fire" s={18} cls="text-orange-400"/>
            <span className={`font-bold ${TXT}`}>Day Streak</span>
            <span className="ml-auto text-2xl font-bold text-orange-400">{streak.count} 🔥</span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {days.map(d=>(
              <div key={d.k} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md transition-all"
                  style={{height:`${Math.max(4,(d.count/maxDay)*52)}px`,background:d.k===today?GOLD:D?"#3d3730":"#e7e5e4"}}/>
                <div className={`text-[9px] ${TSUB}`}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-level */}
        <div className={`rounded-2xl border p-5 ${CARD}`}>
          <h3 className={`font-bold mb-4 ${TXT}`}>Progress by Level</h3>
          {SECTIONS_META.map(sec=>{
            const sw=VOCAB.filter(w=>w.section===sec.id);
            const ss=sw.filter(w=>progress[w.id]).length;
            const p=Math.round(ss/sw.length*100);
            return(
              <div key={sec.id} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className={`text-xs font-medium ${TSUB}`}>{sec.emoji} {sec.title}</span>
                  <span className="text-xs font-bold" style={{color:GOLD}}>{ss}/{sw.length}</span>
                </div>
                <div className={`h-1.5 rounded-full ${D?"bg-stone-800":"bg-stone-100"} overflow-hidden`}>
                  <div className="h-full rounded-full" style={{width:`${p}%`,background:`linear-gradient(90deg,${GOLD},${GOLDB})`}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ══ PAGE: SETTINGS ══════════════════════════════════════════
  function PageSettings(){
    return(
      <div className="max-w-lg mx-auto px-4 pb-28 pt-4">
        <h2 className="text-2xl font-bold mb-5" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>Settings</h2>

        <div className={`rounded-2xl border overflow-hidden mb-4 ${CARD}`}>
          {/* Dark mode */}
          <div className={`flex items-center p-5 border-b ${D?"border-stone-800":"border-stone-100"}`}>
            <Ic n={D?"sun":"moon"} s={18} cls="" style={{color:GOLD}}/>
            <span className={`ml-3 font-medium text-sm ${TXT}`}>Dark Mode</span>
            <button onClick={()=>setDark(!D)} className={`ml-auto w-12 h-6 rounded-full transition-all relative ${D?"bg-emerald-700":"bg-stone-200"}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${D?"left-6":"left-0.5"}`}/>
            </button>
          </div>
          {/* Daily goal */}
          <div className={`flex items-center p-5 border-b ${D?"border-stone-800":"border-stone-100"}`}>
            <Ic n="star" s={18} cls="" style={{color:GOLD}}/>
            <span className={`ml-3 font-medium text-sm ${TXT}`}>Daily Goal</span>
            <span className={`ml-auto text-sm font-bold ${TSUB}`}>{DAILY_GOAL} words/day</span>
          </div>
          {/* Streak */}
          <div className="flex items-center p-5">
            <Ic n="fire" s={18} cls="text-orange-400"/>
            <span className={`ml-3 font-medium text-sm ${TXT}`}>Best Streak</span>
            <span className="ml-auto text-sm font-bold text-orange-400">{streak.count} days 🔥</span>
          </div>
        </div>

        {/* Reset */}
        <div className={`rounded-2xl border p-5 mb-4 ${CARD}`}>
          <h3 className={`font-bold mb-3 ${TXT}`}>Data & Privacy</h3>
          <button onClick={()=>setResetModal(true)} className="w-full py-3 rounded-xl text-sm font-bold text-red-500 border border-red-400/30 hover:bg-red-500/10 transition-colors">
            Reset All Progress
          </button>
          {resetModal&&(
            <div className="mt-3 space-y-2">
              <p className={`text-sm text-center font-medium ${TXT}`}>Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={()=>setResetModal(false)} className={`flex-1 py-3 rounded-xl text-sm border font-medium ${CARD} ${TXT}`}>Cancel</button>
                <button onClick={doReset} className="flex-1 py-3 rounded-xl text-sm bg-red-600 text-white font-bold">Reset</button>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className={`rounded-2xl border p-6 text-center ${CARD}`}>
          <div className="text-3xl mb-3">☽</div>
          <p className="font-bold mb-1" style={{fontFamily:"'Crimson Text',serif",color:GOLD,fontSize:"1.2rem"}}>Quran Vocab</p>
          <p className={`text-xs ${TSUB} mb-3`}>300 Most Frequent Quranic Words · Spaced Repetition Learning</p>
          <p className={`text-xs italic ${TSUB}`} style={{fontFamily:"'Crimson Text',serif"}}>
            "رَبِّ زِدْنِي عِلْمًا"<br/>My Lord, increase me in knowledge.
          </p>
        </div>
      </div>
    );
  }

  // ══ NAV ═════════════════════════════════════════════════════
  const NAV=[
    {id:"home",     icon:"home",    label:"Home"},
    {id:"sections", icon:"book",    label:"Levels"},
    {id:"review",   icon:"repeat",  label:"Повтор."},
    {id:"wordlist", icon:"list",    label:"Words"},
    {id:"stats",    icon:"chart",   label:"Stats"},
    {id:"settings", icon:"settings",label:"Settings"},
  ];
  const isStudy=page==="study"||page==="done";

  return(
    <div className={`min-h-screen ${BG} ${TXT} transition-colors duration-300`} style={{fontFamily:"'Lato',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Top bar */}
      <div className={`sticky top-0 z-50 border-b ${NAVBG} backdrop-blur-xl`}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {isStudy
            ?<button onClick={()=>setPage("sections")} className={`p-2 -ml-1 rounded-xl ${TSUB}`}><Ic n="back" s={20}/></button>
            :<span className="font-bold text-lg" style={{fontFamily:"'Crimson Text',serif",color:GOLD}}>☽ Quran Vocab</span>
          }
          <button onClick={()=>setDark(!D)} className={`p-2 rounded-xl ${TSUB}`}><Ic n={D?"sun":"moon"} s={18}/></button>
        </div>
      </div>

      {/* Pages */}
      <main>
        {page==="home"     && <PageHome/>}
        {page==="sections" && <PageSections/>}
        {page==="study"    && <PageStudy/>}
        {page==="done"     && <PageDone/>}
        {page==="review"   && <PageReview/>}
        {page==="wordlist" && <PageWordList/>}
        {page==="stats"    && <PageStats/>}
        {page==="settings" && <PageSettings/>}
      </main>

      {/* Bottom nav */}
      {!isStudy&&(
        <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t ${NAVBG} backdrop-blur-xl`}>
          <div className="max-w-lg mx-auto flex">
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setPage(n.id)}
                className="flex-1 py-2.5 flex flex-col items-center gap-0.5 text-[10px] transition-colors"
                style={{color:page===n.id?GOLD:D?"#57534e":"#a8a29e"}}>
                <Ic n={n.icon} s={19}/>
                <span className="font-medium leading-none">{n.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}