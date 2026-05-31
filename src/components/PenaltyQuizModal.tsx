import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Award, Heart, Coins, Check, X, ArrowRight, HelpCircle, AlertOctagon, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTION_POOL: Question[] = [
  // COGNITIVE & BEHAVIORAL SCIENCE
  {
    id: 1,
    question: "Berapa lama waktu tidur harian yang sangat disarankan secara ilmiah bagi petualang untuk mengoptimalkan pemulihan stamina (CON) harian?",
    options: [
      "4 - 5 Jam untuk memaksimalkan waktu produktif harian",
      "6 - 7 Jam di akhir pekan saja",
      "7 - 8 Jam berkualitas untuk fungsionalitas kognitif dan fisik harian",
      "9 - 10 Jam setiap malam guna merelaksasi sistem motorik secara total"
    ],
    correctIndex: 2,
    explanation: "Tidur selama 7-8 jam berkualitas adalah standar klinis ideal bagi kesehatan kardiovaskular, kestabilan emosi, konsolidasi memori, dan pemulihan stamina fisik harian."
  },
  {
    id: 2,
    question: "Jika Anda berhadapan dengan prokrastinasi (kecenderungan menunda tugas), strategi psikologi perilaku apa yang paling efektif diterapkan?",
    options: [
      "Menunda penyelesaian tugas hingga menit terakhir demi memicu dorongan panik adrenalin",
      "Menyusun skema rencana jangka panjang berdurasi jam tanpa langsung memulai aksi",
      "Membagi tugas menjadi bagian mikro dan berkomitmen mengerjakan 5 menit pertama untuk memicu momentum",
      "Mengalihkan perhatian sepenuhnya ke rekreasi pasif agar tingkat kecemasan merosot sementara"
    ],
    correctIndex: 2,
    explanation: "Prinsip 5 Menit (Zeigarnik Effect) mengajarkan bahwa ketika kita mulai beraksi pada langkah mikro, hambatan kognitif awal akan luntur dan membentuk momentum psikologis berkelanjutan."
  },
  {
    id: 3,
    question: "Manakah di antara bias kognitif berikut yang membuat seseorang terus menginvestasikan waktu atau keping emas pada misi yang gagal hanya karena merasa telanjur rugi banyak?",
    options: [
      "Confirmation Bias (Kecenderungan memilah informasi pendukung opini pribadi)",
      "Dunning-Kruger Effect (Kesenjangan penilaian kecakapan diri sendiri)",
      "Sunk Cost Fallacy (Kesesatan berpikir akibat akumulasi investasi masa lalu)",
      "Availability Heuristic (Penarikan kesimpulan instan berdasarkan ingatan terdekat)"
    ],
    correctIndex: 2,
    explanation: "Sunk Cost Fallacy membuat kita enggan mengorbankan atau menghentikan tindakan yang tidak efisien karena kita terfokus pada investasi (waktu, tenaga, uang) yang telah dikeluarkan sebelumnya."
  },
  {
    id: 4,
    question: "Dalam ilmu psikologi perilaku, apa dinamika mendasar dari fenomena Dunning-Kruger Effect?",
    options: [
      "Kecenderungan orang yang berketerampilan rendah menilai terlalu tinggi kecakapan nyata mereka sendiri",
      "Hilangnya dorongan intrinsik saat dihadapkan pada apresiasi material atau fisik",
      "Penyusutan ketajaman fokus mental akibat terlalu lama mengambil keputusan kritis tanpa jeda",
      "Kecenderungan memikul beban tanggung jawab lebih banyak karena tuntutan standar sosial"
    ],
    correctIndex: 0,
    explanation: "Dunning-Kruger Effect adalah bias kognitif di mana individu dengan kompetensi rendah pada sebuah domain tidak memiliki keahlian metakognitif untuk menyadari keterbatasan dirinya."
  },
  {
    id: 5,
    question: "Sistem belajar 'Spaced Repetition' sangat direkomendasikan dalam ilmu kognitif karena didesain berdasarkan...",
    options: [
      "Pemuatan informasi secara bervolume besar sekaligus dalam satu malam sebelum batas ujian",
      "Distribusi sesi ulasan pelajaran dengan interval waktu yang kian melebar demi melawan kurva kelupaan biologis",
      "Proses membaca pasif dokumen teks berulang-ulang tanpa uji mandiri secara aktif",
      "Metode transkripsi teks buku pelajaran secara verbatim ke buku catatan pribadi"
    ],
    correctIndex: 1,
    explanation: "Spaced Repetition mendistribusikan peninjauan materi pada interval waktu yang dihitung presisi untuk menantang memori tepat sebelum ia dilupakan, memindahkannya dari memori jangka pendek ke jangka panjang."
  },

  // MATHEMATICS & LOGIC
  {
    id: 6,
    question: "Sebuah kereta api berakselerasi konstan pada jalur lurus. Jika kecepatannya meningkat dari 10 m/s menjadi 20 m/s dalam jarak tempuh 150 meter, berapakah percepatan kereta tersebut secara tepat?",
    options: [
      "0.5 m/s² secara kontinu",
      "1.0 m/s² secara kontinu",
      "1.5 m/s² secara kontinu",
      "2.0 m/s² secara kontinu"
    ],
    correctIndex: 1,
    explanation: "Menggunakan rumus fisika kinematika v² = u² + 2as. Dengan v = 20, u = 10, dan s = 150, didapatkan: 400 = 100 + 300a, sehingga 300a = 300, yang menghasilkan a = 1.0 m/s²."
  },
  {
    id: 7,
    question: "Dari 40 petualang di sebuah Guild, 25 meluncurkan sihir Elemen Api, 20 menguasai Elemen Air, dan 5 orang tidak menguasai keduanya. Berapa banyak petualang yang menguasai kedua elemen sihir tersebut?",
    options: [
      "5 orang multitalenta",
      "10 orang multitalenta",
      "15 orang multitalenta",
      "20 orang multitalenta"
    ],
    correctIndex: 1,
    explanation: "Menggunakan hukum himpunan Inklusi-Eksklusi: Total (40) = Api (25) + Air (20) - Irisan (X) + Tanpa Elemen (5). Diperoleh 40 = 50 - X, sehingga X = 10 orang."
  },
  {
    id: 8,
    question: "Jika sebuah dadu adil bermata enam dilempar sebanyak dua kali berturut-turut, berapakah probabilitas matematis bahwa jumlah kedua angka yang muncul adalah tepat 8?",
    options: [
      "4 dari 36 kemungkinan (11.1%)",
      "5 dari 36 kemungkinan (13.9%)",
      "6 dari 36 kemungkinan (16.7%)",
      "7 dari 36 kemungkinan (19.4%)"
    ],
    correctIndex: 1,
    explanation: "Pasangan angka yang berjumlah 8 adalah (2,6), (3,5), (4,4), (5,3), dan (6,2). Dengan total 5 pasang dari 36 kombinasi sampel, peluangnya adalah 5/36."
  },
  {
    id: 9,
    question: "Sebuah baterai energi ajaib berkurang daya sebesar 10% setiap jamnya dari daya yang tersisa. Jika daya awalnya adalah 100%, berapakah sisa daya baterai tersebut setelah mengalirkan energi selama tepat 2 jam?",
    options: [
      "80% dari kapasitas penuh",
      "81% dari kapasitas penuh",
      "82% dari kapasitas penuh",
      "83% dari kapasitas penuh"
    ],
    correctIndex: 1,
    explanation: "Setelah jam pertama daya menjadi 90% (100 - 10). Pada jam kedua, susut 10% dari 90% (yaitu 9%), sehingga menyisakan 81%."
  },

  // SCIENCE & OPTICS & BIOLOGY
  {
    id: 10,
    question: "Mengapa langit bumi tampak berwarna biru di siang hari yang cerah menurut prinsip ilmu fisika optik?",
    options: [
      "Refleksi langsung dari cermin samudra air asin bumi yang mendominasi permukaan bawah",
      "Hamburan Rayleigh oleh gas penyusun atmosfer yang menyebarkan panjang gelombang pendek cahaya matahari",
      "Efek penyerapan termal gelombang merah panjang spektrum radiasi matahari oleh lapisan ionosfer",
      "Pecahan cahaya monokromatik akibat kondensasi uap air jenuh di batas mesosfer"
    ],
    correctIndex: 1,
    explanation: "Hamburan Rayleigh menjelaskan efek di mana partikel gas atmosfer menyebarkan cahaya gelombang pendek (biru dan ungu) jauh lebih kuat ke segala arah dibandingkan gelombang panjang (merah)."
  },
  {
    id: 11,
    question: "Organel dalam sel eukariotik yang bertindak sebagai pusat respirasi aerobik dan generator pasokan energi ATP utama adalah...",
    options: [
      "Retikulum Endoplasma Kasar",
      "Mitokondria bermembran ganda",
      "Badan Golgi (Aparatus sekretoris)",
      "Lisosom pengurai enzimatis"
    ],
    correctIndex: 1,
    explanation: "Mitokondria dijuluki sebagai 'the powerhouse of the cell' karena memproduksi Adenosin Trifosfat (ATP) melalui siklus asam sitrat dan transpor elektron."
  },
  {
    id: 12,
    question: "Unsur non-logam manakah dalam sistem periodik kimiawi yang merupakan komponen dengan limpahan massa terbesar dalam kerak bumi?",
    options: [
      "Silikon (Si)",
      "Karbon (C)",
      "Oksigen (O)",
      "Kalsium (Ca)"
    ],
    correctIndex: 2,
    explanation: "Oksigen adalah unsur paling melimpah di kerak bumi, menyusun sekitar 46.6% dari total massa lapisan luar bumi, sering kali dalam bentuk senyawa silikat."
  },
  {
    id: 13,
    question: "Komponen mikroskopis dalam darah manakah yang meluncurkan rangkaian koagulasi biologis guna mencegah pendarahan fatal saat terjadi abrasi luka?",
    options: [
      "Eritrosit pendistribusi hemoglobin",
      "Leukosit pembawa respons imunologi",
      "Trombosit keping sel pembeku darah",
      "Plasma fraksi globulin terlarut"
    ],
    correctIndex: 2,
    explanation: "Trombosit (keping darah) bertugas membentuk sumbatan di area luka dengan memicu konversi fibrinogen menjadi jaring fibrin pembeku darah."
  },
  {
    id: 14,
    question: "Proses transfer energi panas tanpa memerlukan partikel medium perantara, seperti pancaran hangat matahari menembus kehampaan antariksa menuju bumi disebut...",
    options: [
      "Konveksi mekanis zat fluida",
      "Konduksi rambatan material termal",
      "Radiasi elektromagnetik mandiri",
      "Adveksi perpindahan massa udara"
    ],
    correctIndex: 2,
    explanation: "Radiasi adalah perpindahan kalor dalam bentuk gelombang elektromagnetik yang tidak memerlukan partikel zat perantara (medium) untuk merambat."
  },

  // LITERATURE & MYTHOLOGY
  {
    id: 15,
    question: "Siapakah sastrawan legendaris Indonesia yang merangkai novel mahakarya sejarah 'Bumi Manusia' sebagai buku pertama dari mahakarya Tetralogi Buru?",
    options: [
      "Sutan Takdir Alisjahbana (pujangga baru)",
      "Pramoedya Ananta Toer (sastrawan realisme)",
      "Chairil Anwar (pelopor Angkatan '45)",
      "Goenawan Mohamad (pendiri Teater Utan Kayu)"
    ],
    correctIndex: 1,
    explanation: "Bumi Manusia adalah adikarya Pramoedya Ananta Toer yang ditulis secara lisan di pengasingan Pulau Buru sebelum dicatat secara tertulis."
  },
  {
    id: 16,
    question: "Dalam khazanah mitologi Nordik, siapakah figur dewa yang bertugas mengawasi Bifrost (jembatan pelangi penghubung antar dunia) dengan panca indra luar biasa tajam?",
    options: [
      "Baldr (Dewa keindahan dan cahaya)",
      "Loki (Dewa penipu dan kekacauan)",
      "Heimdall (Penjaga gerbang setia Asgard)",
      "Tyr (Dewa pertempuran dan keberanian)"
    ],
    correctIndex: 2,
    explanation: "Heimdall memiliki penglihatan ratusan mil baik siang maupun malam, serta pendengaran tajam yang mampu mendengar pertumbuhan bulu domba."
  },
  {
    id: 17,
    question: "Siapakah pujangga Romawi Kuno yang menulis wiracarita agung 'Aeneid', mengisahkan perjalanan pahlawan Aeneas dari keruntuhan Troya hingga fondasi peradaban Roma?",
    options: [
      "Ovidius (penulis Metamorphoses)",
      "Horatius (penulis Ars Poetica)",
      "Virgilius (Publius Vergilius Maro)",
      "Cicero (negarawan dan orator)"
    ],
    correctIndex: 2,
    explanation: "Aeneid ditulis oleh Virgilius antara tahun 29 dan 19 SM atas perintah kaisar pertama Romawi, Augustus, sebagai mitos asal-usul persatuan kekaisaran."
  },

  // HISTORY & GEOGRAPHY
  {
    id: 18,
    question: "Di samudra manakah kapal penumpang uap legendaris RMS Titanic kandas menabrak gunung es raksasa pada pelayaran perdananya di bulan April tahun 1912?",
    options: [
      "Samudra Pasifik bagian Utara dekat khatulistiwa",
      "Samudra Atlantik Utara di koordinat lintang tinggi",
      "Samudra Hindia bagian Selatan dekat Antartika",
      "Laut Utara dekat perbatasan Arktik Norwegia"
    ],
    correctIndex: 1,
    explanation: "RMS Titanic karam di perairan samudra Atlantik Utara sebelah selatan Newfoundland pada tanggal 15 April 1912 di jalur pelayaran Southampton ke New York."
  },
  {
    id: 19,
    question: "Peradaban kuno manakah yang bertuah membangun gerbang monumen megah 'Ishtar Gate' dengan ubin padat kaca biru serta ornamen relief ukiran naga berkaki elang?",
    options: [
      "Peradaban Persia Era Wangsa Achamenid",
      "Kekaisaran Assyria Agung di kota Ninewe",
      "Kekaisaran Babilonia Baru di bawah Nebukadnezar II",
      "Kerajaan Mesir Baru Masa Pemerintahan Ramses II"
    ],
    correctIndex: 2,
    explanation: "Gerbang Ishtar dipugar sekitar tahun 575 SM atas instruksi Raja Nebukadnezar II sebagai gerbang masuk kedelapan ke dalam benteng inti kota Babilonia."
  },
  {
    id: 20,
    question: "Reruntuhan kota kuno legendaris Machu Picchu yang bertengger tinggi di wilayah pegunungan Andes merupakan ikon peninggalan peradaban agung...",
    options: [
      "Peradaban Maya di semenanjung Yucatan",
      "Peradaban Aztek di dataran tinggi Meksiko",
      "Peradaban Inca di wilayah Peru modern",
      "Peradaban Olmek di sepanjang pesisir pantai"
    ],
    correctIndex: 2,
    explanation: "Machu Picchu dibangun sekitar tahun 1450 M di bawah instruksi kaisar Inca Pachacuti sebagai tempat peristirahatan keluarga kerajaan di atas lembah Urubamba."
  },
  {
    id: 21,
    question: "Siapakah tokoh revolusioner yang didaulat memimpin pelayaran armada penjelajahan pertama yang berhasil mengelilingi dunia (sirkumnavigasi) secara historis?",
    options: [
      "Christopher Columbus (penjelajah Genova)",
      "Vasco da Gama (penemu rute tanjung harapan)",
      "Ferdinand Magellan & Juan Sebastian Elcano (Spanyol)",
      "Marco Polo (penjelajah jalur sutra darat)"
    ],
    correctIndex: 2,
    explanation: "Ekspedisi Armada Maluku dipimpin oleh Ferdinand Magellan sejak 1519, dan diselesaikan oleh awak kapalnya di bawah komando Elcano setelah kematian Magellan di Mactan, Filipina."
  },
  {
    id: 22,
    question: "Perjanjian Westphalia pada tahun 1648 ditandatangani secara historis di teologi Eropa dengan peran kunci bagi perubahan...",
    options: [
      "Berakhirnya Perang Tiga Puluh Tahun serta peletakan batas kedaulatan negara modern",
      "Deklarasi pemisahan daerah koloni Amerika dari pengaruh konstitusi Inggris",
      "Kesepakatan pembagian zona penjelajahan laut antara armada Spanyol dan Portugis",
      "Penyatuan kadipaten-kadipaten independen menjadi satu entitas Kekaisaran Jerman"
    ],
    correctIndex: 0,
    explanation: "Perjanjian Westphalia mengakhiri Perang Tiga Puluh Tahun di Eropa, melahirkan konsep kedaulatan negara integral (Westphalian Sovereignty) yang diakui secara internasional hari ini."
  },
  // CHEMISTRY (SCIENCE)
  {
    id: 23,
    question: "Senyawa kimiawi apa yang dikenal luas sebagai gas tawa karena efek anestesi dan euforia ringan ketika dihirup?",
    options: [
      "Karbondioksida (CO₂)",
      "Dinitrogen Monoksida (N₂O)",
      "Metana jenuh (CH₄)",
      "Sulfur Heksatetrafluorida (SF₆)"
    ],
    correctIndex: 1,
    explanation: "Dinitrogen monoksida (N₂O) atau Nitrous Oxide adalah senyawa gas tawa yang sering digunakan sebagai anestetik ringan dalam kedokteran gigi serta agen pendorong sistem induksi nitros."
  },
  // POETRY / LITERATURE
  {
    id: 24,
    question: "Dalam seni puisi klasik, bait yang tersusun atas tepat dua larik baris kalimat berirama disebut sebagai...",
    options: [
      "Kuint (Quintel suku)",
      "Sektet (Enam sebaris)",
      "Distikon (Doublet rima)",
      "Terzina (Sajak tiga laku)"
    ],
    correctIndex: 2,
    explanation: "Distikon berasal dari bahasa Yunani kuno yang berarti 'dua baris'. Ini merepresentasikan bait puisi lama yang terdiri atas dua baris sejajar."
  },
  // ALGEBRA / MATHEMATICS
  {
    id: 25,
    question: "Berapakah hasil faktorisasi aljabar dari bentuk kuadrat sempurna x² - 12x + 36 secara matematis tepat?",
    options: [
      "(x + 6)(x - 6)",
      "(x - 6)²",
      "(x + 6)²",
      "(x - 12)(x + 3)"
    ],
    correctIndex: 1,
    explanation: "Bentuk kuadrat sempurna x² - 2ax + a² sama dengan (x - a)². Karena a = 6, maka (x - 6)² = x² - 12x + 36."
  },
  // REGIONAL HISTORY
  {
    id: 26,
    question: "Siapakah patih pemersatu legendaris dari Kerajaan Majapahit yang mengikrarkan Sumpah Palapa di hadapan Ratu Tribhuwana Wijayattunggadewi?",
    options: [
      "Ronggolawe",
      "Kebo Anabrang",
      "Gajah Mada",
      "Adityawarman"
    ],
    correctIndex: 2,
    explanation: "Patih Amangkubhumi Gajah Mada mengikrarkan Sumpah Palapa pada tahun 1336 M, bertekad tidak akan memakan buah palapa (menikmati libur/kenikmatan duniawi) sebelum menyatukan Nusantara."
  },
  // ASTRONOMY
  {
    id: 27,
    question: "Planet terdekat kedua dari matahari dalam tata surya kita yang terkenal dengan suhu permukaan paling ekstrem karena efek rumah kaca tebal adalah...",
    options: [
      "Merkurius berorbit cepat",
      "Venus bercahaya fajar",
      "Mars merah beroksida",
      "Saturnus bercincin es"
    ],
    correctIndex: 1,
    explanation: "Venus adalah planet paling panas di tata surya kita dengan suhu mencapai 462°C, dipicu oleh atmosfer tebal karbon dioksida jenuh yang memerangkap radiasi panas matahari."
  },
  // WORLD HISTORY
  {
    id: 28,
    question: "Peradaban kuno manakah yang menciptakan kode hukum tertulis tertua yang terkenal dengan pepatah keadilan 'mata ganti mata, gigi ganti gigi'?",
    options: [
      "Kekaisaran Mongol di bawah Genghis Khan",
      "Dinasti Han di daratan Tiongkok",
      "Kekaisaran Babilonia di bawah Raja Hammurabi",
      "Republik Romawi awal"
    ],
    correctIndex: 2,
    explanation: "Piagam Hammurabi (Code of Hammurabi) adalah piagam hukum tertua (sekitar 1754 SM) yang diukir pada batu basalt besar dari kerajaan Babilonia Kuno."
  },
  // ADVANCED GEOGRAPHY
  {
    id: 29,
    question: "Selat terdalam di dunia yang memisahkan ujung selatan benua Amerika Selatan dengan daratan beku benua Antartika adalah...",
    options: [
      "Selat Gibraltar",
      "Selat Drake (Drake Passage)",
      "Selat Malaka",
      "Selat Bering"
    ],
    correctIndex: 1,
    explanation: "Selat Drake (Drake Passage) menghubungkan bagian tenggara Samudra Pasifik dengan bagian barat daya Samudra Atlantik, terkenal dengan kondisi ombak paling dahsyat di bumi."
  },
  // COMPUTER SCIENCE / MATH
  {
    id: 30,
    question: "Berapa banyak bit (binary digit) penyimpanan yang mutlak diperlukan untuk menyimpan tepat 1 Kilobyte data digital dalam komputasi biner?",
    options: [
      "1000 bit tunggal",
      "8000 bit tunggal",
      "1024 bit tunggal",
      "8192 bit tunggal"
    ],
    correctIndex: 3,
    explanation: "1 Kilobyte sama dengan 1024 Byte. Karena setiap 1 Byte tersusun atas 8 bit, maka total kapasitasnya adalah 1024 * 8 = 8192 bit."
  }
];

// Fisher-Yates Uniform Shuffle Algorithm for predictable random probability
function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

interface PenaltyQuizModalProps {
  isOpen: boolean;
  questTitle: string;
  questDifficulty: 'easy' | 'medium' | 'hard';
  onClose: () => void;
  onCompleteQuiz: (score: number) => void;
  playSynthSound: (type: any) => void;
}

export default function PenaltyQuizModal({
  isOpen,
  questTitle,
  questDifficulty,
  onClose,
  onCompleteQuiz,
  playSynthSound
}: PenaltyQuizModalProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Initialize 5 random questions
  useEffect(() => {
    if (isOpen) {
      // Shuffle QUESTION_POOL using Fisher-Yates and take 5
      const shuffled = fisherYatesShuffle(QUESTION_POOL);
      setSelectedQuestions(shuffled.slice(0, 5));
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setQuizFinished(false);
    }
  }, [isOpen]);

  if (!isOpen || selectedQuestions.length === 0) return null;

  const currentQuestion = selectedQuestions[currentIndex];

  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSynthSound('quest_complete');
    } else {
      playSynthSound('fail');
    }
  };

  const handleNextClick = () => {
    playSynthSound('click');
    if (currentIndex < 4) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      playSynthSound('levelup');
    }
  };

  // Penalty multiplier calculations based on the outcome
  // 5/5: Perfect -> 0 penalty!
  // 3-4/5: Minor -> 50% penalty
  // 0-2/5: Full -> 100% penalty
  const hpLossBase = questDifficulty === 'hard' ? 30 : questDifficulty === 'medium' ? 20 : 10;
  const goldLossBase = questDifficulty === 'hard' ? 15 : questDifficulty === 'medium' ? 10 : 5;

  const getPenaltyStatus = () => {
    if (score === 5) return { label: '🔴 TRIAL AMPUNAN DEWA (PARDONED!)', color: 'text-emerald-700 bg-emerald-50 border-emerald-400', hpLoss: 0, goldLoss: 0, scale: '0% (Bebas dari hukuman!)', desc: 'Dewa takjub dengan kecerdasan Anda! Seluruh denda HP & Emas dibatalkan!' };
    if (score >= 3) return { label: '🟡 TRIAL SEBAGIAN (SEMI PENS)', color: 'text-amber-700 bg-amber-50 border-amber-400', hpLoss: Math.ceil(hpLossBase * 0.5), goldLoss: Math.ceil(goldLossBase * 0.5), scale: '50% (Hukuman Dikurangi Setengah)', desc: 'Pengetahuan Anda cukup baik. Dewa mengurangi pinalti HP & Gold sebesar 50%!' };
    return { label: '💀 TRIAL GAGAL TOTAL (FULL PENALTY)', color: 'text-red-700 bg-red-50 border-red-400', hpLoss: hpLossBase, goldLoss: goldLossBase, scale: '100% (Hukuman Penuh)', desc: 'Anda gagal dalam sidang pengetahuan harian! Seluruh hukuman HP dan Gold akan dipotong penuh.' };
  };

  const penaltyStatus = getPenaltyStatus();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5d4037]/75 backdrop-blur-md overflow-y-auto" id="penalty-quiz-overlay">
        
        {/* Animated Card Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl max-h-[92vh] bg-[#fffdf5] border-4 border-[#8b5e34] rounded-3xl shadow-[0_12px_0_0_#5d4037] overflow-hidden flex flex-col relative"
          id="penalty-quiz-card"
        >
          {/* Header Banners - Fixed shrinkless */}
          <div className="bg-[#ebdcb9] border-b-4 border-[#8b5e34] px-6 py-4 flex items-center gap-3 relative shrink-0">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none text-6xl">
              ⚖️
            </div>
            <div className="bg-[#8b5e34] text-white p-2 rounded-xl border border-[#5d4037]">
              <ShieldAlert className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div className="leading-tight">
              <h3 className="font-serif text-lg md:text-xl font-black tracking-wider text-[#5d4037] uppercase">
                PENGADILAN TRIAL PENALTI
              </h3>
              <p className="text-[10px] text-[#8b5e34] font-mono font-black uppercase tracking-widest leading-none">
                Sidang Akal Sehat • Penebusan Misi Terlambat
              </p>
            </div>
          </div>

          {!quizFinished ? (
            /* ACTIVE QUIZ SCREEN - Scrollable with min-h-0 and custom scrollbars */
            <div className="p-5 md:p-6 space-y-5 flex-1 overflow-y-auto min-h-0 select-none custom-scrollbar pb-8">
              
              {/* Overdue Quest Info Bar */}
              <div className="bg-[#8b5e34]/5 border-2 border-[#8b5e34]/20 p-3 rounded-xl text-center space-y-1">
                <p className="text-[9px] font-mono tracking-widest font-black uppercase text-[#8b5e34]">Misi Terlambat:</p>
                <h4 className="font-serif font-black text-sm md:text-base text-[#5d4037] truncate">"{questTitle}"</h4>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-red-300 bg-red-50 text-red-700 font-mono text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                  <span>Denda Dasar: -{hpLossBase} HP & -{goldLossBase} Gold</span>
                </div>
              </div>

              {/* Progress and Question Header */}
              <div className="flex items-center justify-between text-xs font-mono font-black pb-1.5 border-b border-[#8b5e34]/10">
                <span className="text-[#8b5e34] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#8b5e34]" /> Pertanyaan Kognitif:
                </span>
                <span className="bg-[#8b5e34] text-[#fffdf5] px-2.5 py-0.5 rounded-full border border-[#5d4037]">
                  {currentIndex + 1} / 5
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="bg-white border-2 border-[#8b5e34]/30 rounded-2xl p-4 min-h-[5.5rem] flex items-center justify-center shadow-inner text-center">
                <h5 className="font-serif font-black text-sm md:text-base text-[#3e2723] leading-snug">
                  {currentQuestion.question}
                </h5>
              </div>

              {/* Options list */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  let btnBg = "bg-white hover:bg-[#ebdcb9]/20 border-stone-300 text-stone-800";
                  
                  if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      // Correct option is always highlighted green
                      btnBg = "bg-emerald-100 hover:bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-none ring-2 ring-emerald-400";
                    } else if (idx === selectedOption) {
                      // Selected incorrect option
                      btnBg = "bg-rose-100 hover:bg-rose-100 border-rose-500 text-rose-950 font-black shadow-none ring-2 ring-rose-400";
                    } else {
                      btnBg = "bg-stone-50 border-stone-200 text-stone-400 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswerClick(idx)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all font-mono font-bold text-xs md:text-sm flex items-center gap-3 relative cursor-pointer shadow-[2px_2px_0_0_#ebdcb9] active:translate-y-[1px] active:shadow-none ${btnBg}`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-mono text-[10px] font-black ${
                        isAnswered && idx === currentQuestion.correctIndex 
                          ? 'bg-emerald-600 text-white border-emerald-800'
                          : isAnswered && idx === selectedOption
                          ? 'bg-rose-600 text-white border-rose-800'
                          : 'bg-stone-100 border-stone-300'
                      }`}>
                        {isAnswered && idx === currentQuestion.correctIndex ? <Check className="w-3 h-3" /> : isAnswered && idx === selectedOption ? <X className="w-3 h-3" /> : String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 pr-6 leading-tight">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Explanation Alert Banner */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-amber-50 border border-amber-300 rounded-xl leading-tight text-xs shadow-sm font-mono flex items-start gap-2 text-stone-800"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black tracking-wider text-[#8b5e34] uppercase">IKHTISAR PENGETAHUAN:</p>
                      <p className="font-semibold text-[11px] mt-0.5 leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation button */}
              <div className="pt-2 flex justify-end">
                <button
                  disabled={!isAnswered}
                  onClick={handleNextClick}
                  className={`px-6 py-2.5 rounded-full border-2 font-mono font-black text-xs flex items-center gap-2 tracking-widest transition-all cursor-pointer ${
                    isAnswered 
                      ? 'bg-amber-400 hover:bg-amber-300 text-stone-900 border-[#8b5e34] shadow-[2px_2px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none' 
                      : 'bg-stone-100 text-stone-400 border-stone-300 pointer-events-none'
                  }`}
                >
                  <span>{currentIndex === 4 ? 'LIHAT HASIL TRIAL' : 'SELANJUTNYA'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            /* TRIAL RESULTS SUMMARY SCREEN - Scrollable with min-h-0 and custom scrollbars */
            <div className="p-5 md:p-6 space-y-5 text-center flex-1 overflow-y-auto min-h-0 font-serif select-none custom-scrollbar pb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-500 mx-auto mb-2 animate-bounce">
                  <Award className="w-9 h-9 text-amber-600" />
                </div>
                <h4 className="font-serif font-black text-xl md:text-2xl text-[#5d4037] uppercase tracking-wider">TRIAL PETUALANG RESMI SELESAI</h4>
              </div>

              {/* Overall stats board */}
              <div className="bg-[#ebdcb9]/40 border-4 border-dashed border-[#8b5e34]/40 p-4 rounded-2xl max-w-sm mx-auto space-y-4">
                <div className="text-sm font-mono font-black text-[#8b5e34] uppercase tracking-widest">
                  HASIL JAWABAN AKAN DIHITUNG...
                </div>
                
                <div className="text-3xl md:text-5xl font-serif font-black text-[#5d4037] tracking-wider relative inline-block">
                  {score < 3 ? '❌' : score === 5 ? '🏆' : '⭐'} <span className="text-[#8b5e34]">{score}</span> / 5
                </div>

                <p className="text-xs font-mono font-bold text-[#5d4037] italic">
                  Anda berhasil menjawab benar {score} dari total 5 pertanyaan bijaksana.
                </p>
              </div>

              {/* Judgment Banner */}
              <div className={`p-4 border-2 rounded-2xl text-left font-serif space-y-2 max-w-sm mx-auto ${penaltyStatus.color}`}>
                <p className="text-xs font-black uppercase tracking-wider text-center">{penaltyStatus.label}</p>
                <p className="text-[11px] font-mono leading-relaxed font-bold text-center">
                  {penaltyStatus.desc}
                </p>
                <div className="flex justify-around border-t border-current/20 pt-2.5 text-xs font-mono font-black text-center">
                  <div className="space-y-0.5">
                    <span className="block text-[8px] uppercase tracking-wider opacity-70">Potong HP 💔</span>
                    <span className="text-sm flex items-center justify-center gap-0.5 font-black">
                      <Heart className="w-3.5 h-3.5 fill-rose-600 stroke-none" /> -{penaltyStatus.hpLoss} HP
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-current/20 pl-6">
                    <span className="block text-[8px] uppercase tracking-wider opacity-70">Sita Koin 🪙</span>
                    <span className="text-sm flex items-center justify-center gap-0.5 font-black">
                      <Coins className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> -{penaltyStatus.goldLoss} Gold
                    </span>
                  </div>
                </div>
              </div>

              {/* Action accept results CTA */}
              <div className="pt-2">
                <button
                  onClick={() => onCompleteQuiz(score)}
                  className="w-full max-w-sm py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs md:text-sm rounded-2xl cursor-pointer shadow-[3px_3px_0_0_#5d4037] active:translate-y-[1px] active:shadow-none transition-all uppercase tracking-wider h-11"
                  id="claim-results-btn"
                >
                  ⚖️ TERIMA SIDANG & AMANKAN KARAKTER
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
