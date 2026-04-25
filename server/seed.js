const ROADMAP = [
  {
    code: 'A1',
    name: 'Absolute Beginner',
    jlpt: 'N5',
    kanji_count: 103,
    description: 'Master hiragana, katakana, and your first kanji. Build the phonetic and visual foundations that everything else rests on.',
    order_index: 1,
    skills: {
      reading: {
        goals: [
          'Learn all 46 base hiragana characters plus dakuten/handakuten variations (~71 total)',
          'Learn all 46 base katakana characters plus variations (~71 total)',
          'Recognize 20 fundamental kanji: 日月火水木金土山川人口目耳手足大小中上下',
          'Read simple hiragana-only sentences at a slow pace',
        ],
        tips: [
          'Use the Tofugu hiragana/katakana guides — their mnemonic system cuts learning time to days, not weeks',
          'Drill kana until recognition is automatic (under 0.5s per character) before moving on — everything depends on this',
          'Avoid romaji (romanized Japanese) from day one. It creates a crutch that slows reading speed long-term',
          'Katakana appears everywhere in daily life (menus, signs, product names) — don\'t treat it as secondary to hiragana',
        ],
        resources: [
          { title: 'Tofugu: Learn Hiragana', url: 'https://www.tofugu.com/japanese/learn-hiragana/', type: 'website', description: 'The definitive mnemonic-based hiragana guide. Start here.', is_free: true },
          { title: 'Tofugu: Learn Katakana', url: 'https://www.tofugu.com/japanese/learn-katakana/', type: 'website', description: 'Same approach as hiragana — mnemonics for every character.', is_free: true },
          { title: 'WaniKani', url: 'https://www.wanikani.com', type: 'app', description: 'SRS-based kanji learning app. First 3 levels free — covers N5 kanji with mnemonics.', is_free: false },
          { title: 'Anki + Kana Deck', url: 'https://apps.ankiweb.net', type: 'tool', description: 'Free flashcard app. Download a hiragana/katakana deck for unlimited drilling.', is_free: true },
        ],
        checklist: [
          'Read all 46 hiragana without hesitation (under 1 second per character)',
          'Read all 46 katakana without hesitation',
          'Write all hiragana from memory with correct stroke order',
          'Write all katakana from memory with correct stroke order',
          'Recognize 20 basic kanji in context (日、月、人、大、小、山、川、水、火、木)',
        ],
      },
      writing: {
        goals: [
          'Handwrite all hiragana with correct stroke order',
          'Handwrite all katakana with correct stroke order',
          'Write your name in katakana',
          'Write simple vocabulary words from memory',
        ],
        tips: [
          'Physical handwriting practice is essential — stroke order matters for readability in cursive/handwritten Japanese',
          'Buy a grid notebook (方眼ノート) or print genkouyoushi paper to practice proper character sizing and spacing',
          'Muscle memory from handwriting reinforces reading recognition — writing and reading train each other',
        ],
        resources: [
          { title: 'Tofugu: Hiragana Stroke Order', url: 'https://www.tofugu.com/japanese/learn-hiragana/', type: 'website', description: 'Includes stroke order diagrams for every hiragana character.', is_free: true },
          { title: 'KanjiStudy App', url: 'https://kanjistudy.com', type: 'app', description: 'iOS/Android app with animated stroke order for kana and kanji.', is_free: false },
          { title: 'Anki', url: 'https://apps.ankiweb.net', type: 'tool', description: 'Use with a writing-prompt deck to drill character writing from memory.', is_free: true },
        ],
        checklist: [
          'Write all 46 hiragana from memory with correct stroke order',
          'Write all 46 katakana from memory with correct stroke order',
          'Write your name in katakana correctly',
          'Write 10 basic vocabulary words from memory (e.g., みず, やま, ひと)',
        ],
      },
      listening: {
        goals: [
          'Identify all Japanese vowel and consonant sounds',
          'Understand numbers 1–100 spoken aloud',
          'Recognize basic greetings and classroom phrases',
          'Distinguish vowel length (e.g., おばさん vs おばあさん)',
        ],
        tips: [
          'Japanese has 5 pure vowels (a, i, u, e, o) — unlike English, they never change sound regardless of position',
          'Every mora (sound unit) takes equal time — Japanese rhythm is very different from English stress-timed speech',
          'Vowel length is meaningful: おばさん (aunt) vs おばあさん (grandmother) differ only in one long vowel',
          'Listen before you speak — exposure to natural pronunciation at this stage shapes your accent for years to come',
        ],
        resources: [
          { title: 'JapanesePod101 Absolute Beginner', url: 'https://www.japanesepod101.com', type: 'podcast', description: 'Structured audio lessons from absolute zero, slow and clear speech.', is_free: false },
          { title: 'Pimsleur Japanese', url: 'https://www.pimsleur.com/learn-japanese', type: 'app', description: 'Audio-first course using spaced repetition for spoken Japanese. Excellent for ear training.', is_free: false },
          { title: 'Genki I Audio', url: 'https://genki.japantimes.co.jp/en/', type: 'textbook', description: 'Companion audio to the Genki I textbook — clear, natural pace dialogue recordings.', is_free: false },
        ],
        checklist: [
          'Recognize all hiragana sounds when heard aloud',
          'Count from 1 to 100 in Japanese without hesitation',
          'Understand and respond to basic greetings (おはようございます, こんにちは, ありがとう)',
          'Distinguish long vs short vowels in listening (e.g., おじさん vs おじいさん)',
        ],
      },
      speaking: {
        goals: [
          'Pronounce all 5 Japanese vowels correctly',
          'Deliver a simple self-introduction (自己紹介)',
          'Use basic greetings and farewells naturally',
          'Say numbers, days of the week, and months',
        ],
        tips: [
          'Japanese vowels are pure and consistent: あ=ah, い=ee, う=oo (unrounded), え=eh, お=oh — don\'t diphthongize them like English vowels',
          'Don\'t worry about pitch accent yet — focus on clear, confident pronunciation and natural rhythm first',
          'Record yourself and compare to native audio — your ear catches errors that conscious monitoring misses',
          'Start speaking with a tutor from day one — silence between A1 and B1 creates a speaking block that\'s hard to break',
        ],
        resources: [
          { title: 'Pimsleur Japanese', url: 'https://www.pimsleur.com/learn-japanese', type: 'app', description: 'Audio-first with built-in speaking prompts — ideal for pronunciation from the start.', is_free: false },
          { title: 'italki', url: 'https://www.italki.com', type: 'website', description: 'Find affordable community tutors for beginner conversation practice.', is_free: false },
          { title: 'Speechling', url: 'https://speechling.com', type: 'app', description: 'Submit voice recordings for feedback from native speakers.', is_free: true },
        ],
        checklist: [
          'Pronounce all 5 Japanese vowels correctly (confirmed by a native speaker or tutor)',
          'Deliver a 30-second self-introduction: name, country, and one hobby',
          'Use 10 basic greetings and expressions naturally without thinking',
          'Say numbers 1–100 and use them in simple contexts (age, price, time)',
        ],
      },
    },
  },

  {
    code: 'A2',
    name: 'Elementary',
    jlpt: 'N4',
    kanji_count: 367,
    description: 'Begin systematic kanji study, write simple sentences with correct particles, and hold your first real conversations in Japanese.',
    order_index: 2,
    skills: {
      reading: {
        goals: [
          'Know all N5 kanji (~103) and N4 kanji (~264 more, ~367 total)',
          'Read sentences with furigana (pronunciation guides above kanji)',
          'Read Level 0–1 Tadoku graded readers',
          'Understand basic signs, menus, and product labels',
        ],
        tips: [
          'Use a spaced repetition system (SRS) like WaniKani or Anki for kanji — consistency of 15–20 min/day beats long weekend sessions',
          'Read with furigana first — don\'t force yourself to memorize every kanji reading before you can enjoy simple texts',
          'Context learning sticks better than rote memorization — try to read words you\'ve learned in real sentences immediately',
        ],
        resources: [
          { title: 'WaniKani', url: 'https://www.wanikani.com', type: 'app', description: 'SRS kanji app with mnemonics. Levels 1–10 cover most N5/N4 kanji.', is_free: false },
          { title: 'Tadoku Graded Readers (Free)', url: 'https://tadoku.org/japanese/free-books/', type: 'website', description: 'Free graded readers from Level 0 (picture books) to Level 4. Start at Level 0.', is_free: true },
          { title: 'NHK Web Easy', url: 'https://www3.nhk.or.jp/news/easy/', type: 'website', description: 'Real news simplified for learners, with furigana on all kanji. Excellent A2–B1 reading practice.', is_free: true },
          { title: 'Genki I & II', url: 'https://genki.japantimes.co.jp/en/', type: 'textbook', description: 'The standard university-level Japanese textbook series. Covers N5–N4 kanji systematically.', is_free: false },
        ],
        checklist: [
          'Know all 103 N5 kanji (tested by recognition, not just memorization)',
          'Read a full Tadoku Level 0 graded reader without pausing',
          'Read a Tadoku Level 1 story with occasional dictionary use',
          'Understand basic kanji on signs and menus (入口, 出口, 定休日, 営業中)',
          'Read a Genki I reading passage without romaji',
        ],
      },
      writing: {
        goals: [
          'Write simple sentences using core particles: は, が, を, に, で, へ',
          'Conjugate verbs in present/past, polite form (〜ます/〜ました)',
          'Write N5 kanji from memory with correct stroke order',
          'Compose a short self-introduction paragraph (自己紹介文)',
        ],
        tips: [
          'Particles are the skeleton of Japanese sentences — は, が, を, に, で, へ carry meaning that word order alone cannot',
          'The は vs が distinction is subtle and debated even among linguists — focus on は for topics and が for emphasis/new information',
          'い-adjectives and な-adjectives conjugate differently — mixing them up is one of the most common A2 mistakes',
        ],
        resources: [
          { title: 'Genki I & II Workbooks', url: 'https://genki.japantimes.co.jp/en/', type: 'textbook', description: 'Workbook exercises for each grammar point in the Genki series. Essential for writing practice.', is_free: false },
          { title: 'HiNative', url: 'https://hinative.com', type: 'website', description: 'Ask native speakers to check your written Japanese and explain corrections.', is_free: true },
          { title: 'Lang-8', url: 'https://lang-8.com', type: 'website', description: 'Submit Japanese writing for free correction by native speakers.', is_free: true },
        ],
        checklist: [
          'Write a self-introduction paragraph (name, country, age, hobbies) in Japanese',
          'Use は/が/を/に/で particles correctly in 10 different sentences',
          'Conjugate 20 verbs in present and past polite form (〜ます/〜ました)',
          'Write 50 N5 kanji from memory with correct stroke order',
          'Write a short email to a Japanese friend using polite form',
        ],
      },
      listening: {
        goals: [
          'Follow slow, clear dialogues on daily life topics',
          'Extract key information from short announcements',
          'Understand basic verb tenses and adjectives in speech',
          'Watch easy anime with Japanese subtitles',
        ],
        tips: [
          'Watch anime with Japanese subtitles (not English) — it trains your ear while connecting spoken sounds to written Japanese simultaneously',
          'Don\'t try to understand every word — aim for the main topic and 60-70% comprehension at this stage',
          'Slowing audio to 0.75x speed in YouTube/podcast apps is not cheating — it\'s a valid A2 tool',
        ],
        resources: [
          { title: 'Nihongo con Teppei for Beginners', url: 'https://nihongoconteppei.com', type: 'podcast', description: 'A native Japanese speaker talking slowly and clearly, specifically for learners. Perfect A2 listening.', is_free: true },
          { title: 'NHK for School', url: 'https://www.nhk.or.jp/school/', type: 'website', description: 'Japanese educational TV content for children — natural but accessible Japanese.', is_free: true },
          { title: 'Comprehensible Japanese (Beginner)', url: 'https://www.youtube.com/@cijapanese', type: 'youtube', description: 'YouTube channel with graded input videos designed for beginners. Highly recommended.', is_free: true },
        ],
        checklist: [
          'Understand a 3-minute slow dialogue on a familiar topic (daily routine, food, family)',
          'Follow a full episode of Nihongo con Teppei for Beginners',
          'Extract key information from a simple announcement (train, shop, school)',
          'Watch an easy anime episode with Japanese subtitles and understand the main plot',
        ],
      },
      speaking: {
        goals: [
          'Have a 5-minute conversation about yourself and daily life',
          'Express likes and dislikes (好き/嫌い)',
          'Ask for and give simple directions',
          'Order food at a restaurant in Japanese',
        ],
        tips: [
          'Don\'t wait until you feel "ready" to speak — book your first italki session as soon as you know basic particles',
          'Making grammar mistakes while speaking is how you internalize correct forms. Tutors expect them at A2.',
          'Learn set phrases for buying time: ええと... (um), ちょっと待ってください (one moment), もう一度言ってください (please say that again)',
        ],
        resources: [
          { title: 'italki', url: 'https://www.italki.com', type: 'website', description: 'Book community tutors (cheaper) or professional teachers for weekly conversation practice.', is_free: false },
          { title: 'HelloTalk', url: 'https://www.hellotalk.com', type: 'app', description: 'Language exchange app — find Japanese native speakers learning your language for free exchange.', is_free: true },
          { title: 'Tandem', url: 'https://www.tandem.net', type: 'app', description: 'Similar to HelloTalk — connect with Japanese speakers for text, voice, and video exchange.', is_free: true },
        ],
        checklist: [
          'Have a 5-minute conversation about yourself with a tutor or language partner',
          'Express 5 likes and 5 dislikes in natural Japanese',
          'Successfully order a meal at a Japanese restaurant (in person or roleplay)',
          'Ask for and follow directions to a nearby location in Japanese',
          'Use basic survival phrases without hesitation: excuse me, I don\'t understand, please repeat',
        ],
      },
    },
  },

  {
    code: 'B1',
    name: 'Intermediate',
    jlpt: 'N3',
    kanji_count: 650,
    description: 'Break into real native materials: manga, NHK Web Easy, and natural conversation. Master te-form chains and start sounding like a real speaker.',
    order_index: 3,
    skills: {
      reading: {
        goals: [
          'Know ~650 kanji total (N5+N4+N3)',
          'Read よつばと！(Yotsuba&!) manga — the B1 gateway text for Japanese learners',
          'Read NHK Web Easy articles without furigana on common words',
          'Navigate Japanese websites and apps independently',
        ],
        tips: [
          'よつばと！is the most universally recommended manga for intermediate learners — slice of life, real vocabulary, natural casual Japanese',
          'The jump from graded readers to native manga is steep. Expect heavy dictionary use in the first few chapters — it gets easier',
          'Satori Reader bridges the gap between graded readers and fully native texts — it shows vocabulary hints without being a learner-only resource',
        ],
        resources: [
          { title: 'よつばと！(Yotsuba&!) Manga', url: 'https://www.amazon.co.jp/s?k=%E3%82%88%E3%81%A4%E3%81%B0%E3%81%A8', type: 'book', description: 'The classic B1 reading milestone. A girl explores the world — casual, natural Japanese, widely loved.', is_free: false },
          { title: 'Satori Reader', url: 'https://www.satorireader.com', type: 'website', description: 'Native-level stories with built-in vocab lookup and grammar explanations. Perfect B1–B2 bridge.', is_free: false },
          { title: 'WaniKani (Levels 10–30)', url: 'https://www.wanikani.com', type: 'app', description: 'Continue SRS kanji study through levels covering N3 kanji.', is_free: false },
          { title: 'NHK Web Easy', url: 'https://www3.nhk.or.jp/news/easy/', type: 'website', description: 'Real news in simplified Japanese with furigana. Read one article per day as a B1 habit.', is_free: true },
          { title: 'Tadoku Level 2–3', url: 'https://tadoku.org/japanese/free-books/', type: 'website', description: 'Step up to level 2 and 3 graded readers as a B1 warm-up.', is_free: true },
        ],
        checklist: [
          'Read a full volume of よつばと！with a dictionary (target under 20 lookups per chapter by end)',
          'Read 10 NHK Web Easy articles without furigana assistance on common vocabulary',
          'Know all 650 N3 cumulative kanji (tested via WaniKani levels or JLPT N3 mock exam)',
          'Read children\'s book (絵本) for native children aged 6–8 without assistance',
          'Complete a JLPT N3 practice reading section with passing score',
        ],
      },
      writing: {
        goals: [
          'Write short paragraphs using te-form chains (〜て、〜て、〜た)',
          'Use conditional forms correctly: 〜たら, 〜ば, 〜と, 〜なら',
          'Express opinions: 〜と思います, 〜と思っていました',
          'Write in both casual (だ/だった) and polite (です/ます) registers',
        ],
        tips: [
          'The gap between polite and casual Japanese is wide — writing only in polite form means you can\'t text friends naturally',
          'Use Lang-8 or HiNative to get corrections on real writing samples. Grammar explanations in textbooks are often cleaner than reality.',
          'て-form is the backbone of complex Japanese sentences — getting it automatic opens up dozens of grammar patterns',
        ],
        resources: [
          { title: 'Tobira: Gateway to Advanced Japanese', url: 'https://www.9640.jp/nihongo/en/', type: 'textbook', description: 'The standard textbook for N3–N2 learners. Excellent reading passages and grammar coverage.', is_free: false },
          { title: 'HiNative', url: 'https://hinative.com', type: 'website', description: 'Post your Japanese writing for free native corrections with explanations.', is_free: true },
          { title: 'Lang-8', url: 'https://lang-8.com', type: 'website', description: 'Free native corrections — submit journal entries, emails, and essays.', is_free: true },
        ],
        checklist: [
          'Write a 100-word journal entry about your day in Japanese',
          'Write a casual text message to a Japanese friend using appropriate casual forms',
          'Use て-form correctly in 5 different grammatical patterns (〜ている, 〜てみる, 〜てあげる, 〜てしまう, 〜てから)',
          'Express an opinion about a film or book using 〜と思います and supporting reasons',
          'Write a simple conditional sentence using all 4 conditional forms (たら/ば/と/なら)',
        ],
      },
      listening: {
        goals: [
          'Understand natural-speed speech with occasional pausing',
          'Handle casual speech contractions not taught in textbooks',
          'Watch slice-of-life anime without subtitles and grasp 60%+ of content',
          'Follow a Nihongo con Teppei episode on an unfamiliar topic',
        ],
        tips: [
          'Casual speech contractions are everywhere in real Japanese but absent from textbooks: ている→てる, ておく→とく, てしまう→ちゃう, ではない→じゃない',
          'Anime for B1 listening: slice-of-life genres (日常, けいおん！, あたしンち) use natural casual speech without specialized vocabulary',
          'Watch one episode with subtitles first, then rewatch without — the familiarity helps you hear what you missed',
        ],
        resources: [
          { title: 'Nihongo con Teppei (Regular)', url: 'https://nihongoconteppei.com', type: 'podcast', description: 'Natural-speed podcast by a native speaker on daily topics. ~15 min episodes. The B1 listening staple.', is_free: true },
          { title: 'Comprehensible Japanese (Intermediate)', url: 'https://www.youtube.com/@cijapanese', type: 'youtube', description: 'Graded input YouTube channel — intermediate videos are perfect for B1.', is_free: true },
          { title: 'Erin\'s Challenge', url: 'https://www.erin.ne.jp/en/', type: 'website', description: 'Free interactive video lessons featuring a foreigner living in Japan. Authentic daily conversations.', is_free: true },
        ],
        checklist: [
          'Follow a full Nihongo con Teppei (regular) episode on an unfamiliar topic',
          'Watch 1 slice-of-life anime episode without subtitles and understand 60%+ of dialogue',
          'Identify 5 casual speech contractions in natural audio (e.g., てる, ちゃう, じゃない)',
          'Understand a Japanese convenience store or restaurant interaction fully in audio',
          'Listen to a 5-minute NHK Easy News audio and summarize the main points',
        ],
      },
      speaking: {
        goals: [
          'Sustain a 10-minute conversation on familiar topics without long pauses',
          'Use sentence-final particles (ね, よ, よね, な) naturally',
          'Shadow native audio to improve rhythm and connected speech',
          'Give a 2-minute monologue on a chosen topic',
        ],
        tips: [
          'Sentence-final particles (ね, よ, よね, な, わ) signal attitude and relationship — using them correctly sounds natural; overusing or misusing them sounds strange',
          'Shadowing (repeating audio milliseconds after hearing it) is the single best technique for developing natural prosody and rhythm at B1',
          'Set your phone, Siri, or Google Assistant to Japanese — small daily interactions in Japanese add up to hundreds of hours over a year',
        ],
        resources: [
          { title: 'Shadowing: Let\'s Speak Japanese! (Book)', url: 'https://www.9640.jp/nihongo/en/', type: 'book', description: 'The standard shadowing textbook for Japanese learners. Graded audio from beginner to advanced.', is_free: false },
          { title: 'italki', url: 'https://www.italki.com', type: 'website', description: 'Weekly sessions with a tutor are most impactful at B1 — you need real-time feedback on natural speech.', is_free: false },
          { title: 'HelloTalk', url: 'https://www.hellotalk.com', type: 'app', description: 'Daily voice messages with a language exchange partner keep your speaking active between tutor sessions.', is_free: true },
        ],
        checklist: [
          'Have an unscripted 10-minute conversation with a tutor on a topic you chose that day',
          'Use ね, よ, and よね correctly in a conversation (confirmed by tutor feedback)',
          'Complete 2 weeks of daily shadowing practice with the Shadowing textbook',
          'Give a 2-minute prepared speech in Japanese on any topic',
          'Discuss a film, book, or current event in Japanese for 5+ minutes',
        ],
      },
    },
  },

  {
    code: 'B2',
    name: 'Upper Intermediate',
    jlpt: 'N2',
    kanji_count: 1000,
    description: 'Read native news and novels, write business emails in keigo, and approach near-native listening comprehension. The plateau-breaking level.',
    order_index: 4,
    skills: {
      reading: {
        goals: [
          'Know ~1,000 kanji total (N5 through N2)',
          'Read native news articles with fewer than 5 dictionary lookups per article',
          'Read light novels (ライトノベル) and manga without furigana',
          'Complete a JLPT N2 practice reading section with passing score',
        ],
        tips: [
          'The transition to native materials is where most learners stall — push through the first difficult weeks. Each new native text gets easier.',
          'Light novels (ラノベ) are excellent B2 reading: engaging story, natural vocabulary, slightly below literary Japanese complexity',
          'Aozora Bunko has thousands of free classic Japanese books — start with Akutagawa or Miyazawa Kenji for manageable literary Japanese',
        ],
        resources: [
          { title: 'WaniKani (Levels 30–50)', url: 'https://www.wanikani.com', type: 'app', description: 'Continue through WaniKani to cover N2 kanji systematically.', is_free: false },
          { title: 'Asahi Shimbun Digital', url: 'https://www.asahi.com', type: 'website', description: 'One of Japan\'s major newspapers. Read editorials and feature articles for B2 practice.', is_free: false },
          { title: 'Aozora Bunko', url: 'https://www.aozora.gr.jp', type: 'website', description: 'Free archive of Japanese literature in the public domain. Akutagawa, Natsume Soseki, and thousands more.', is_free: true },
          { title: 'Satori Reader', url: 'https://www.satorireader.com', type: 'website', description: 'At B2, use Satori Reader with hints turned off to read native-level stories cold.', is_free: false },
        ],
        checklist: [
          'Read a full newspaper article with fewer than 5 dictionary lookups',
          'Finish a complete light novel in Japanese',
          'Read manga without furigana (shounen or shoujo — not specialized genre)',
          'Know all 1,000 cumulative N2 kanji',
          'Complete a JLPT N2 mock exam reading section with 60%+ score',
        ],
      },
      writing: {
        goals: [
          'Write formal business emails using correct keigo (敬語)',
          'Compose a 300-word opinion essay (意見文)',
          'Use passive (〜られる) and causative (〜させる) and causative-passive (〜させられる) correctly',
          'Understand and use N2-level formal conjunctions: したがって, 一方で, これに対して',
        ],
        tips: [
          'Keigo (honorific language) has 3 levels: 丁寧語 (polite - basic), 尊敬語 (respectful - elevates listener), 謙譲語 (humble - lowers speaker). All three are required in business writing.',
          'The causative-passive form (〜させられる) is uniquely Japanese in feeling — "I was made to do something against my will" — and signals advanced grammar control',
          'Read Japanese business email templates and reverse-engineer the structure before writing your own',
        ],
        resources: [
          { title: 'Tobira (Part 2)', url: 'https://www.9640.jp/nihongo/en/', type: 'textbook', description: 'Second half of Tobira covers N2-level grammar patterns and formal writing.', is_free: false },
          { title: 'HiNative Premium', url: 'https://hinative.com', type: 'website', description: 'Get detailed feedback on formal writing including business emails from native speakers.', is_free: false },
          { title: 'Lang-8', url: 'https://lang-8.com', type: 'website', description: 'Submit essays and business emails for free native correction.', is_free: true },
        ],
        checklist: [
          'Write a formal business email (inquiry or request) using correct 尊敬語 and 謙譲語',
          'Compose a 300-word opinion essay with logical structure and formal conjunctions',
          'Use passive, causative, and causative-passive forms correctly in original sentences',
          'Write a professional self-introduction for a Japanese company job application',
          'Have a native speaker rate your writing as "natural" for at least one formal piece',
        ],
      },
      listening: {
        goals: [
          'Comprehend Japanese TV, variety shows, and podcasts at natural speed',
          'Understand pitch accent well enough to notice meaning differences',
          'Follow a Japanese movie without subtitles with 80%+ comprehension',
          'Understand keigo in formal spoken contexts (customer service, business meetings)',
        ],
        tips: [
          'Pitch accent matters at B2: 橋(bridge), 端(edge), and 箸(chopsticks) are all pronounced はし but with different pitch patterns. Misunderstanding is rare in context, but awareness improves comprehension.',
          'Japanese variety shows are difficult because of crosstalk, fast banter, and puns — start with structured shows (travel, cooking) before panel/comedy shows',
          'Watch content you\'re genuinely interested in. Bored listening is ineffective listening.',
        ],
        resources: [
          { title: 'Dogen (Pitch Accent)', url: 'https://www.youtube.com/@Dogen', type: 'youtube', description: 'Free YouTube content on Japanese pitch accent. Dogen is the go-to resource for B2+ pitch accent awareness.', is_free: true },
          { title: 'Japanese Ammo with Misa', url: 'https://www.youtube.com/@JapaneseAmmowithMisa', type: 'youtube', description: 'Native teacher explains grammar and natural Japanese through video. Excellent B2 listening material.', is_free: true },
          { title: 'NHK Podcast / Radio', url: 'https://www.nhk.or.jp', type: 'podcast', description: 'NHK\'s various podcasts cover news, culture, and lifestyle at natural native speed.', is_free: true },
        ],
        checklist: [
          'Watch a Japanese movie without subtitles and understand 80%+ of dialogue',
          'Follow a 30-minute variety show or travel show without subtitles',
          'Identify pitch accent differences in 10 minimal pairs (e.g., 橋/箸, 雨/飴)',
          'Understand a customer service interaction or business phone call fully',
          'Listen to a NHK news broadcast and summarize 3 stories accurately',
        ],
      },
      speaking: {
        goals: [
          'Discuss abstract topics, current events, and opinions fluently',
          'Use keigo (尊敬語/謙譲語) correctly in spoken formal contexts',
          'Demonstrate pitch accent awareness in everyday speech',
          'Simulate a job interview or business meeting in Japanese',
        ],
        tips: [
          'Most learners plateau at B2 precisely because of keigo — casual speech becomes fluent but formal speech feels foreign. Target it specifically with role-play practice.',
          'Pitch accent awareness at B2 means you catch your mistakes even if you can\'t always correct them in real time — that awareness is the first step',
          'Increase your input ratio at B2: for every 1 hour of speaking, aim for 3–4 hours of listening to continue improving naturally',
        ],
        resources: [
          { title: 'italki (Professional Teachers)', url: 'https://www.italki.com', type: 'website', description: 'At B2, invest in professional teachers who can correct keigo and nuanced mistakes that community tutors might miss.', is_free: false },
          { title: 'Dogen Pitch Accent (YouTube)', url: 'https://www.youtube.com/@Dogen', type: 'youtube', description: 'Free series on Japanese pitch accent — essential viewing for serious B2 speakers.', is_free: true },
          { title: 'HelloTalk', url: 'https://www.hellotalk.com', type: 'app', description: 'Daily voice messages and video calls with native partners supplement tutor sessions.', is_free: true },
        ],
        checklist: [
          'Discuss a complex topic (politics, technology, society) for 10+ minutes without switching to English',
          'Successfully simulate a formal Japanese job interview in roleplay with a tutor',
          'Use 尊敬語 and 謙譲語 correctly in a formal roleplay scenario',
          'Give a 5-minute unprepared speech on a topic given 2 minutes before',
          'Receive feedback from a native Japanese speaker that your speech is "natural" on a familiar topic',
        ],
      },
    },
  },

  {
    code: 'C1',
    name: 'Advanced',
    jlpt: 'N1',
    kanji_count: 2000,
    description: 'Read literary fiction and academic texts, understand all native content including comedy and dialects, write publication-quality Japanese.',
    order_index: 5,
    skills: {
      reading: {
        goals: [
          'Know 2,000+ kanji fluently (N1 level + common joyo kanji)',
          'Read native literary fiction without assistance (村上春樹, 東野圭吾)',
          'Read formal documents, academic papers, and newspaper editorials',
          'Recognize 文語 (literary grammar) forms in formal writing',
        ],
        tips: [
          'Literary grammar forms appear in formal modern writing: 〜べき (should), 〜たる (being a), 〜ざるを得ない (cannot help but), 〜に相違ない (no doubt that). These aren\'t in Genki.',
          'Reading widely matters more than reading perfectly at C1 — quantity of native input drives vocabulary and intuition faster than study',
          'Keep an Anki deck of unfamiliar words from your native reading — mining your own reading material is more effective than pre-made decks at this level',
        ],
        resources: [
          { title: 'WaniKani (Levels 50–60)', url: 'https://www.wanikani.com', type: 'app', description: 'Final WaniKani levels cover rare but important N1 kanji. Supplement with Anki mining.', is_free: false },
          { title: 'Aozora Bunko', url: 'https://www.aozora.gr.jp', type: 'website', description: 'Free archive of Japanese literary classics — Natsume Soseki, Akutagawa Ryunosuke, Kawabata Yasunari.', is_free: true },
          { title: 'Asahi Shimbun Digital', url: 'https://www.asahi.com', type: 'website', description: 'Read editorials and opinion columns for the highest-register modern written Japanese.', is_free: false },
          { title: 'Anki', url: 'https://apps.ankiweb.net', type: 'tool', description: 'Mine vocabulary from native reading into personal Anki decks. The most efficient C1 vocabulary method.', is_free: true },
        ],
        checklist: [
          'Read a full native novel by a major author without interrupting every paragraph for lookups',
          'Read and summarize a newspaper editorial in your own words',
          'Pass a JLPT N1 mock exam reading section with 60%+ score',
          'Identify and explain 5 literary grammar forms (〜べき, 〜たる, 〜ざるを得ない) in real texts',
          'Understand a formal legal or governmental document without external help',
        ],
      },
      writing: {
        goals: [
          'Write formal academic and professional Japanese indistinguishable from educated native output',
          'Use advanced formal conjunctions and logical structure fluently',
          'Write engaging creative prose in multiple styles',
          'Receive native-speaker feedback rating writing as "natural" without qualification',
        ],
        tips: [
          'The gap between "N1 grammar knowledge" and "educated native writing" is substantial — read Japanese writing guides (文章術) written for native speakers to understand how they think about prose',
          'Dictation practice (書き取り) with native audio strengthens the connection between spoken and written formal Japanese',
          'At C1, your writing errors are nuanced — subtle particle choices, word order for emphasis, rhythm of sentences. A professional Japanese editor or advanced tutor gives the most useful feedback.',
        ],
        resources: [
          { title: 'Anki (Sentence Mining)', url: 'https://apps.ankiweb.net', type: 'tool', description: 'Mine example sentences from native texts into Anki to absorb formal writing patterns.', is_free: true },
          { title: 'HiNative', url: 'https://hinative.com', type: 'website', description: 'Ask nuanced writing questions — "does this sound natural?" on near-perfect writing gets C1-level feedback.', is_free: true },
          { title: 'Aozora Bunko (for style)', url: 'https://www.aozora.gr.jp', type: 'website', description: 'Read classic authors to absorb a range of formal and literary prose styles.', is_free: true },
        ],
        checklist: [
          'Write a 500-word formal essay on a social or philosophical topic',
          'Write a complete formal business report that a native colleague would accept without major revision',
          'Use 5 advanced formal connectives (したがって, これに伴い, 〜に際して, 〜を踏まえ, 〜に基づき) correctly in a single piece',
          'Receive feedback from a native Japanese speaker describing your writing as "natural" without caveats',
          'Write a short creative story (fiction or personal essay) that showcases stylistic range',
        ],
      },
      listening: {
        goals: [
          'Understand all native content including comedy, debates, and fast-paced panel shows',
          'Follow the Kansai dialect (関西弁) — the most widely encountered regional dialect',
          'Comprehend humor, wordplay, and cultural references in real-time',
          'Understand 時代劇 (period drama) with archaic speech patterns',
        ],
        tips: [
          '漫才 (manzai) stand-up comedy is the ultimate C1 listening challenge: fast, punny, culturally dense, performed in various dialects. If you can follow it, you\'re advanced.',
          'Kansai dialect changes verb endings and intonation significantly: 〜ない becomes 〜へん, 〜している becomes 〜してる with different pitch, です/ます becomes 〜です/〜まっせ',
          'Develop a taste for difficult content — NHK documentaries, political talk shows, academic lectures — and lean into discomfort. That discomfort is growth.',
        ],
        resources: [
          { title: 'Yoshimoto Kogyo (Manzai on YouTube)', url: 'https://www.youtube.com/@yoshimoto_official', type: 'youtube', description: 'Official channel for Japan\'s premier comedy company. 漫才 and 落語 performances — the gold standard C1 listening challenge.', is_free: true },
          { title: 'NHK Documentaries', url: 'https://www.nhk.or.jp', type: 'website', description: 'NHK produces world-class documentaries in formal, clear Japanese — ideal for C1 academic listening.', is_free: true },
          { title: 'Comprehensible Japanese (Advanced)', url: 'https://www.youtube.com/@cijapanese', type: 'youtube', description: 'Advanced-level content for listening practice at natural native speed.', is_free: true },
        ],
        checklist: [
          'Follow a full 漫才 (manzai) comedy performance and understand the punchlines',
          'Watch a televised political debate and summarize each speaker\'s position',
          'Understand a conversation in 関西弁 between two native Kansai speakers',
          'Watch a 時代劇 (period drama) episode and follow the archaic dialogue',
          'Listen to a 30-minute NHK documentary and answer comprehension questions accurately',
        ],
      },
      speaking: {
        goals: [
          'Speak with near-native pitch accent on familiar vocabulary',
          'Switch seamlessly between casual, polite, and keigo registers',
          'Participate naturally in group conversations with multiple native speakers',
          'Give formal presentations to a Japanese audience',
        ],
        tips: [
          'Code-switching between registers (casual → polite → keigo) should feel automatic at C1 — if you\'re still consciously selecting forms, keep drilling role-plays',
          'Pitch accent at C1: you don\'t need every word perfect, but high-frequency vocabulary should be consistently accurate. Record and analyze your own speech.',
          'Japanese humor and wit require cultural knowledge as much as language skill — consume lots of native comedy, variety shows, and podcasts to develop comedic timing and references',
        ],
        resources: [
          { title: 'Dogen (Full Pitch Accent Course)', url: 'https://www.youtube.com/@Dogen', type: 'youtube', description: 'Dogen\'s free YouTube series plus his Patreon pitch accent course cover everything needed for C1 pitch mastery.', is_free: true },
          { title: 'italki (Advanced Native Teachers)', url: 'https://www.italki.com', type: 'website', description: 'Work with teachers who can catch subtle errors in nuance, pitch, and register that earlier teachers overlooked.', is_free: false },
          { title: 'HelloTalk / Tandem', url: 'https://www.hellotalk.com', type: 'app', description: 'At C1, language exchange partners are genuine friends, not just study tools — aim for natural friendships in Japanese.', is_free: true },
        ],
        checklist: [
          'Participate in a 30-minute group discussion with 2+ native Japanese speakers on a complex topic',
          'Give a 10-minute formal presentation on a technical or academic subject to a Japanese audience',
          'Pass a Japanese job interview conducted entirely in formal Japanese with no English',
          'Make native Japanese people genuinely laugh with appropriate humor and timing',
          'Sustain conversation in keigo for an entire formal meeting without reverting to casual forms',
        ],
      },
    },
  },

  {
    code: 'C2',
    name: 'Mastery',
    jlpt: null,
    kanji_count: null,
    description: 'Full native-equivalent fluency. Read classical Japanese, understand all dialects, write publication-quality prose, and speak with native-like pitch and wit.',
    order_index: 6,
    skills: {
      reading: {
        goals: [
          'Read 古文 (classical Japanese) with understanding — Heian to Edo period literature',
          'Read Meiji-era texts with archaic kanji and pre-reform orthography',
          'Understand literary allusions and intertextual references in modern writing',
          'Read academic and scholarly Japanese in your field of interest',
        ],
        tips: [
          '古文 (classical Japanese) uses completely different grammar: verb endings like 〜けり, 〜ぬ, 〜む, 〜らむ don\'t appear in modern Japanese at all — it requires separate study',
          'Pre-reform kanji orthography (旧字体) changes many common kanji — 國 instead of 国, 學 instead of 学. Worth learning to read Meiji and pre-war texts.',
          'At C2, reading should feel like a pleasure, not a task. If you\'re still grinding, increase input volume dramatically.',
        ],
        resources: [
          { title: '源氏物語 (The Tale of Genji)', url: 'https://www.aozora.gr.jp', type: 'book', description: '11th-century court novel — the pinnacle of classical Japanese literature. Available on Aozora Bunko.', is_free: true },
          { title: '枕草子 (The Pillow Book)', url: 'https://www.aozora.gr.jp', type: 'book', description: 'Sei Shonagon\'s Heian-period essays — elegant classical prose, available on Aozora Bunko.', is_free: true },
          { title: 'Aozora Bunko (Complete Library)', url: 'https://www.aozora.gr.jp', type: 'website', description: 'Full digital library of pre-copyright Japanese literature, spanning classical to modern periods.', is_free: true },
        ],
        checklist: [
          'Read a passage of 古文 without a translation and explain its meaning',
          'Read a full Meiji-era short story with archaic kanji and orthography',
          'Read and discuss a piece of literary criticism written in Japanese about Japanese literature',
          'Read a full chapter of 源氏物語 or 枕草子 with a classical grammar guide',
          'Read academic Japanese in a field of your interest (history, science, linguistics)',
        ],
      },
      writing: {
        goals: [
          'Produce publish-ready formal writing in all registers',
          'Write classical Japanese prose (文語文) if desired',
          'Achieve full 敬語 mastery including uncommon and situationally nuanced forms',
          'Write creative fiction or non-fiction indistinguishable from educated native output',
        ],
        tips: [
          'Even educated native Japanese people study 敬語 formally — business etiquette courses (ビジネスマナー研修) are standard corporate onboarding in Japan. C2 means you\'ve internalized what they study.',
          'Japanese literary style is highly varied — from the spare minimalism of Kawabata to the dense baroque prose of Mishima. Reading across styles gives you range as a writer.',
          'Seek publication or peer review — submitting to literary magazines, corporate communications, or academic publications gives unambiguous real-world feedback.',
        ],
        resources: [
          { title: 'Aozora Bunko (Style Reference)', url: 'https://www.aozora.gr.jp', type: 'website', description: 'Read across authors and periods to develop range and stylistic awareness in your own writing.', is_free: true },
          { title: 'HiNative', url: 'https://hinative.com', type: 'website', description: 'Even at C2, native speaker feedback on nuanced writing remains valuable.', is_free: true },
        ],
        checklist: [
          'Submit a piece of writing to a Japanese publication, blog, or newsletter',
          'Write a formal document (report, proposal, or letter) that a native colleague accepts without revision',
          'Use all three 敬語 levels fluently and correctly in a single extended writing piece',
          'Write a short creative story that native readers describe as "good Japanese writing" rather than "good for a foreigner"',
          'Compose a piece of 文語文 (classical-style writing) for a special occasion (e.g., a formal toast or ceremonial address)',
        ],
      },
      listening: {
        goals: [
          'Comprehend all Japanese content including 落語 (traditional comic storytelling)',
          'Understand major regional dialects: 関西弁, 東北弁, 九州弁',
          'Follow historical drama dialogue with archaic speech',
          'Catch wordplay (駄洒落), puns, and cultural humor in real-time',
        ],
        tips: [
          '落語 (rakugo) is Japanese traditional storytelling comedy — one performer voices all characters using only a fan and cloth. Mastering it as a listener signals complete cultural-linguistic fluency.',
          'Understanding regional dialects is less about study and more about exposure — watch drama and content set in Osaka, Tohoku, Fukuoka, etc.',
          'At C2, language comprehension is no longer the bottleneck. Culture, context, and shared references are what create the remaining gaps.',
        ],
        resources: [
          { title: 'NHK Archive (落語/演芸)', url: 'https://www.nhk.or.jp', type: 'website', description: 'NHK archives classic 落語 and 漫才 performances. Essential C2 listening material.', is_free: true },
          { title: 'Yoshimoto Kogyo (Comedy)', url: 'https://www.youtube.com/@yoshimoto_official', type: 'youtube', description: 'Premier Japanese comedy company with thousands of performances available on YouTube.', is_free: true },
        ],
        checklist: [
          'Understand a full 落語 (rakugo) performance including all character voices and humor',
          'Comprehend a conversation between two native 東北弁 speakers without preparation',
          'Follow a 時代劇 (period drama) episode with archaic vocabulary and understand 90%+',
          'Catch wordplay (駄洒落) and puns in real-time without having them explained',
          'Watch any Japanese content from any era and understand it without subtitles',
        ],
      },
      speaking: {
        goals: [
          'Achieve native-like pitch accent on all common vocabulary',
          'Use humor, wordplay, and wit naturally in Japanese',
          'Optionally adopt or adapt to a regional dialect (e.g., Kansai)',
          'Speak in all formal registers with zero conscious effort',
        ],
        tips: [
          'At C2, native Japanese people may occasionally forget you are a non-native speaker. This happens first in domains you know well (your job, your hobbies) before generalizing.',
          '落語 shadowing is an advanced speaking technique — shadowing one-person multi-character performance develops prosody, timing, and emotional range beyond what conversation practice provides.',
          'The final frontier is cultural fluency: knowing what to say, when to say it, and how to read the room in Japanese social situations that have no English equivalent.',
        ],
        resources: [
          { title: 'Dogen (Complete Pitch Accent)', url: 'https://www.youtube.com/@Dogen', type: 'youtube', description: 'Dogen\'s complete pitch accent materials including Patreon courses for full systematic mastery.', is_free: true },
          { title: 'NHK Archive (落語 Shadowing)', url: 'https://www.nhk.or.jp', type: 'website', description: 'Shadow 落語 masters for prosody, timing, and the full emotional range of Japanese speech.', is_free: true },
          { title: 'italki', url: 'https://www.italki.com', type: 'website', description: 'Work with native speaking partners on specific goals: humor, dialect, pitch — whatever remains.', is_free: false },
        ],
        checklist: [
          'Have a native Japanese speaker say they forgot (or didn\'t realize) you weren\'t a native speaker',
          'Successfully tell a joke or funny story in Japanese that makes native speakers genuinely laugh',
          'Conduct a full professional or academic presentation in Japanese with Q&A, entirely without English',
          'Use all levels of 敬語 in real social situations without any conscious mental effort',
          'Sustain a conversation in a regional dialect for 10+ minutes if you\'ve chosen to learn one',
        ],
      },
    },
  },
];

async function seed(pool) {
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM roadmap_levels');
  if (parseInt(rows[0].count) > 0) {
    console.log('Roadmap already seeded — skipping.');
    return;
  }

  console.log('Seeding Japanese roadmap content...');

  for (const levelData of ROADMAP) {
    const { rows: [level] } = await pool.query(
      `INSERT INTO roadmap_levels (code, name, jlpt, kanji_count, description, order_index)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [levelData.code, levelData.name, levelData.jlpt, levelData.kanji_count, levelData.description, levelData.order_index]
    );

    for (const [skill, guide] of Object.entries(levelData.skills)) {
      const { rows: [skillGuide] } = await pool.query(
        `INSERT INTO skill_guides (level_id, skill, goals, tips)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [level.id, skill, guide.goals, guide.tips]
      );

      for (const resource of guide.resources) {
        await pool.query(
          `INSERT INTO resources (skill_guide_id, title, url, type, description, is_free)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [skillGuide.id, resource.title, resource.url, resource.type, resource.description, resource.is_free]
        );
      }

      for (let i = 0; i < guide.checklist.length; i++) {
        await pool.query(
          `INSERT INTO checklist_items (skill_guide_id, text, order_index)
           VALUES ($1, $2, $3)`,
          [skillGuide.id, guide.checklist[i], i]
        );
      }
    }
  }

  console.log('Japanese roadmap seeded successfully!');
}

module.exports = { seed };
