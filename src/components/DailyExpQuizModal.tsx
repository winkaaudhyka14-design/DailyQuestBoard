import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Award, Check, X, ArrowRight, HelpCircle, Sparkles, Brain, AlertCircle, Key, Compass, Clock } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXP_QUESTION_POOL: Question[] = [
  {
    id: 101,
    question: "Metode persandian simetris manakah yang memenangkan standardisasi Advanced Encryption Standard (AES) pada tahun 2001 setelah menyisihkan kandidat tangguh seperti Twofish dan RC6?",
    options: [
      "Serpent karya Eli Biham dkk",
      "Rijndael karya Vincent Rijmen dan Joan Daemen",
      "Blowfish ciptaan Bruce Schneier",
      "Triple DES sebagai suksesor DES klasik"
    ],
    correctIndex: 1,
    explanation: "Rijndael terpilih secara resmi oleh NIST sebagai standar AES karena memadukan efisiensi komputasi optimal pada hardware/software dengan struktur matematis pertahanan kriptografi yang sangat tinggi."
  },
  {
    id: 102,
    question: "Jikalau kita mengevaluasi limit fungsi aljabar f(x) = (1 + 1/x)^x saat nilai variabel x mendekati tak hingga (infinity), nilai konstan berapakah yang akan dicapai?",
    options: [
      "0.000 (fungsi mengalami konvergensi ke nol)",
      "1.000 (fungsi konvergen secara linear)",
      "Konstanta transenden e (Euler's Number ~ 2.718)",
      "Fungsi bernilai divergen tanpa limit batas atas"
    ],
    correctIndex: 2,
    explanation: "Definisi klasikal dari konstanta Euler 'e' (~2.71828) adalah hasil limit fungsi (1 + 1/n)^n ketika n mendekati tak hingga, yang juga menjadi basis logaritma natural (ln)."
  },
  {
    id: 103,
    question: "Dalam teori relativitas khusus Albert Einstein, besaran atau parameter fisik manakah yang bersifat invariant (selalu mutlak konstan bagi semua pengamat)?",
    options: [
      "Massa inersia mekanis suatu partikel",
      "Laju aliran waktu deterministik (durasi detik)",
      "Dimensi panjang ruang searah sumbu gerak benda",
      "Kecepatan rambat cahaya di dalam ruang hampa udara (c)"
    ],
    correctIndex: 3,
    explanation: "Kecepatan cahaya c (~299,792 km/detik) di ruang hampa adalah postulat mutlak relativitas khusus yang bernilai sama untuk seluruh pengamat inersial, terlepas dari kecepatan gerak mereka."
  },
  {
    id: 104,
    question: "Siapakah filsuf Yunani Kuno legendaris yang merintis sekolah Akademi dan merumuskan 'Alegori Gua' guna mengilustrasikan bias persepsi indrawi terhadap kebenaran mutlak (Forms)?",
    options: [
      "Socrates (tokoh dialektika etika awal)",
      "Plato (penulis adikarya Republic)",
      "Aristoteles (pencetus silogisme logika formal)",
      "Epicurus (tokoh filosofi ketenangan batin)"
    ],
    correctIndex: 1,
    explanation: "Plato menguraikan Alegori Gua dalam bukunya Republic untuk mendeskripsikan kondisi manusia yang terperangkap dalam dunia bayangan inderawi dan kegagalan memahami Kebenaran Hakiki (Dunia Ide)."
  },
  {
    id: 105,
    question: "Berdasarkan hukum komplementer pasangan basa nitogen nukleotida, dalam struktur untai rantaian DNA ganda, basa Adenina (A) selalu ditautkan khusus dengan basa...",
    options: [
      "Sitosina (C) melalui empat jembatan hidrogen",
      "Guanina (G) melalui satu jembatan hidrogen",
      "Timina (T) melalui dua jembatan hidrogen",
      "Urasil (U) melalui tiga jembatan hidrogen"
    ],
    correctIndex: 2,
    explanation: "Sesuai aturan Chargaff, Adenina (A) berpasangan dengan Timina (T) menggunakan dua ikatan hidrogen, sedangkan Guanina (G) berpasangan dengan Sitosina (C) dengan tiga ikatan hidrogen dalam DNA."
  },
  {
    id: 106,
    question: "Pengepungan spektakuler ibukota Romawi Timur, Konstantinopel pada tahun 1453 mengubah peta geopolitik dunia secara permanen. Siapakah panglima muda Utsmaniyah di balik taktik tersebut?",
    options: [
      "Sultan Suleiman I (the Magnificent)",
      "Sultan Selim I (the Grim)",
      "Sultan Mehmed II (al-Fatih / Sang Penakluk)",
      "Sultan Bayezid I (Sang Halilintar)"
    ],
    correctIndex: 2,
    explanation: "Sultan Mehmed II (al-Fatih) merebut Konstantinopel di usia 21 tahun dengan kapal perang kayu yang ditarik lewat bukit Galata dan meriam raksasa Basilica, mengakhiri Kekaisaran Bizantium."
  },
  {
    id: 107,
    question: "Di antara 20 asam amino penyusun standar protein biologis, manakah struktur molekul paling sederhana yang tidak memiliki atom karbon asimetris (kiral) dan tidak optis aktif?",
    options: [
      "Alanina",
      "Glisina (Glycine)",
      "Prolina",
      "Fenilalanina"
    ],
    correctIndex: 1,
    explanation: "Glisina adalah asam amino paling sederhana karena gugus sampingnya hanyalah sebuah atom hidrogen (H), membuat karbon alfa mengikat dua atom H sejenis sehingga bersifat akiral."
  },
  {
    id: 108,
    question: "Dalam ranah ilmu komputer teoretis, pertanyaan matematika terpenting manakah yang mempersoalkan apakah pemecahan masalah yang mudah diverifikasi juga mudah dicari penyelesaiannya?",
    options: [
      "Paradoks Russell dalam teori himpunan",
      "Teorema Ketidaklengkapan Kurt Gödel",
      "Masalah P vs NP (Millennium Prize Problems)",
      "Hipotesis continuum matematika kardinal"
    ],
    correctIndex: 2,
    explanation: "Masalah P vs NP mempertanyakan apakah kelas persoalan P (mudah diselesaikan dalam waktu polinomial) setara dengan kelas NP (mudah diverifikasi dalam waktu polinomial)."
  },
  {
    id: 109,
    question: "Siapakah sastrawan Florentine legendaris abad pertengahan yang menggubah wiracarita alegoris 'Divine Comedy' (La Divina Commedia) yang mengarungi neraka (Inferno) dan surga?",
    options: [
      "Dante Alighieri",
      "Giovanni Boccaccio",
      "Francesco Petrarca",
      "Geoffrey Chaucer"
    ],
    correctIndex: 0,
    explanation: "Dante Alighieri menyusun 'La Divina Commedia' pada awal abad ke-14, menarasikan perjalanan pencerahan spiritual melewati tiga alam akhirat dibimbing oleh penyair Romawi kuno, Virgilius."
  },
  {
    id: 110,
    question: "Apakah nama batas spasial di perimeter luar lubang hitam (black hole) di mana gaya gravitasi sangat besar sehingga kecepatan lepasnya melampaui kecepatan cahaya?",
    options: [
      "Batas Chandrasekhar (Chandrasekhar Limit)",
      "Cakrawala Peristiwa (Event Horizon)",
      "Titik Singularitas Gravitasi Kuantum",
      "Disk Akresi Gas Termal Bermassa"
    ],
    correctIndex: 1,
    explanation: "Event Horizon adalah garis koordinat astronomi di mana denda gravitasi lubang hitam begitu absolut sehingga tidak ada gelombang cahaya atau materi apa pun yang sanggup meloloskan diri."
  },
  {
    id: 111,
    question: "Siapakah ilmuwan matematika asal Inggris yang memecahkan sandi mesin Enigma militer Jerman menggunakan komputasi mekanikal 'Bombe' di Bletchley Park pada Perang Dunia II?",
    options: [
      "Ada Lovelace (perintis koding)",
      "Alan Turing (bapak ilmu komputer teoretis)",
      "John von Neumann (pionir arsitektur CPU)",
      "Charles Babbage (perancang mesin analitis)"
    ],
    correctIndex: 1,
    explanation: "Alan Turing mendesain mesin elektromekanis Bombe untuk meretas kunci dinamis Enigma, yang berjasa menyingkat durasi perang dan menyelamatkan jutaan nyawa di teater perang Eropa."
  },
  {
    id: 112,
    question: "Dalam kalkulus analisis real dan kombinatorika modern, berapakah kesepakatan umum nilai dari 0 pangkat 0 (0⁰) yang didefinisikan guna merumuskan eksponensiasi aljabar?",
    options: [
      "Bernilai 0 secara mutlak",
      "Bernilai 1 (satu) untuk kelancaran ekspansi polinomial",
      "Bernilai minus satu (-1)",
      "Mengalami kondisi indeterminasi mutlak (tidak terhingga)"
    ],
    correctIndex: 1,
    explanation: "Meskipun dibilang bentuk tak tentu dalam limit, aljabar kombinatorika menyepakati 0⁰ = 1 agar Teorema Binomial (x+y)^n dan limit deret Taylor hukum eksponen bekerja konsisten."
  },
  {
    id: 113,
    question: "Prinsip Ketidakpastian Heisenberg membuktikan keterbatasan fisik dalam pengukuran simultan secara akurat. Dua variabel fisis dasar apakah yang terkena implikasi utama dalil ini?",
    options: [
      "Konduktivitas termal dan Kalor laten zat padat",
      "Massa inersia konstan dan Spasial muatan listrik",
      "Posisi partikel (x) dan Momentum gerak partikel (p)",
      "Enthalpi getaran molekul dan Amplitudo gelombang"
    ],
    correctIndex: 2,
    explanation: "Prinsip Ketidakpastian Heisenberg menyatakan bahwa ketidakpastian posisi (Δx) dikalikan ketidakpastian momentum (Δp) akan selalu bernilai lebih besar atau setara dengan h-bar/2."
  },
  {
    id: 114,
    question: "Ditinjau dari dinamika pergerakan kerak bumi tektonik, apakah nama superbenua raksasa tunggal yang menyatukan seluruh daratan bumi sebelum terpisah di era Mesozoikum?",
    options: [
      "Gondwana (benua selatan purba)",
      "Laurasia (benua utara purba)",
      "Pangaea (Superbenua raksasa terpadu)",
      "Rodinia (superbenua masa prakambrian)"
    ],
    correctIndex: 2,
    explanation: "Pangaea adalah daratan tunggal mahaluas yang eksis pada masa Palaeozoikum akhir hingga Mesozoikum awal sebelum terfragmentasi menjadi benua-benua kita hari ini akibat pergeseran lempeng."
  }
];

// Fisher-Yates Uniform Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

interface DailyExpQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyQuizCount: number; // Current answered count today
  setDailyQuizCount: React.Dispatch<React.SetStateAction<number>>; // To increment daily counter
  playSynthSound: (type: any) => void;
  onAwardExp: (amount: number) => void;
  addLog: (message: string, type: string) => void;
}

export default function DailyExpQuizModal({
  isOpen,
  onClose,
  dailyQuizCount,
  setDailyQuizCount,
  playSynthSound,
  onAwardExp,
  addLog
}: DailyExpQuizModalProps) {
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gainedExp, setGainedExp] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer countdown: 30 seconds per question
  useEffect(() => {
    const activeQuestion = sessionQuestions[sessionIndex];
    if (!isOpen || quizComplete || isAnswered || !activeQuestion) return;

    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto answer as WRONG due to timeout
          setIsAnswered(true);
          setSelectedOption(null); // No choice was selected
          setDailyQuizCount(p => p + 1);
          playSynthSound('fail');
          addLog("🧠 Ujian Kebijaksanaan: Waktu menjawab 30 detik habis (0 EXP dicairkan!)", "system");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, sessionIndex, isAnswered, quizComplete, sessionQuestions]);

  // Determine how many questions are actually available for this session, capping at 5 per day.
  const questionsLeftToday = Math.max(0, 5 - dailyQuizCount);

  useEffect(() => {
    if (isOpen) {
      const remaining = Math.max(0, 5 - dailyQuizCount);
      const countToTake = Math.min(remaining, 5);
      const shuffled = shuffleArray(EXP_QUESTION_POOL);
      setSessionQuestions(shuffled.slice(0, countToTake));
      setSessionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setGainedExp(0);
      setCorrectAnswersCount(0);
      setQuizComplete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestion = sessionQuestions[sessionIndex];

  const handleAnswerClick = (optionIdx: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    
    // Register that a question has been answered today
    setDailyQuizCount(prev => prev + 1);

    if (isCorrect) {
      setGainedExp(prev => prev + 50);
      setCorrectAnswersCount(prev => prev + 1);
      onAwardExp(50);
      playSynthSound('quest_complete');
      addLog(`🧠 Ujian Kebijaksanaan Selesai: Jawaban BENAR (+50 EXP dikonsumsi!)`, 'quest_complete');
    } else {
      playSynthSound('fail');
      addLog(`🧠 Ujian Kebijaksanaan Selesai: Jawaban SALAH (+0 EXP)`, 'system');
    }
  };

  const handleNextClick = () => {
    playSynthSound('click');
    if (sessionIndex < sessionQuestions.length - 1) {
      setSessionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      playSynthSound('levelup');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231d1a]/80 backdrop-blur-md overflow-y-auto" id="daily-exp-quiz-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl bg-[#fdfbf7] border-4 border-[#2b4c2b] rounded-3xl shadow-[0_12px_0_0_#1a331a] overflow-hidden flex flex-col relative"
          id="daily-exp-quiz-card"
        >
          {/* Header */}
          <div className="bg-[#e4efe0] border-b-4 border-[#2b4c2b] px-6 py-4 flex items-center justify-between relative shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#2b4c2b] text-white p-2.5 rounded-xl border border-[#1a331a]">
                <Brain className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <div className="leading-tight">
                <h3 className="font-serif text-lg md:text-xl font-black tracking-wider text-[#1a331a] uppercase">
                  UJIAN KEBIJAKSANAAN HARIAN
                </h3>
                <p className="text-[10px] text-[#2b4c2b] font-mono font-black uppercase tracking-widest leading-none">
                  Uji Pengetahuan Akademik • +50 EXP / Jawaban Benar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg border-2 border-stone-300 hover:border-[#2b4c2b] bg-white transition-all cursor-pointer text-stone-500 hover:text-stone-850"
              title="Tutup Ujian"
              id="close-daily-quiz-header-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          {questionsLeftToday === 0 ? (
            /* ALL DONE TODAY STATE */
            <div className="p-8 text-center space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full border-4 border-[#2b4c2b] flex items-center justify-center animate-bounce">
                <Award className="w-8 h-8 text-[#2b4c2b]" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-black text-xl text-[#2b4c2b] uppercase">BATAS HARIAN TERSEDIA TELAH PENUH!</h4>
                <p className="text-stone-600 font-sans text-xs md:text-sm max-w-sm leading-relaxed">
                  Anda telah menguji kebijaksanaan batin sebanyak <strong>5 pertanyaan</strong> hari ini sesuai jatah guild petualangan harian. Datanglah esok hari guna menantang kecakapan otak Anda kembali!
                </p>
              </div>
              <div className="bg-[#cbdcc4] border border-[#2b4c2b]/30 p-3.5 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-mono font-black uppercase text-[#2b4c2b] tracking-wider block">BATAS KODEX HARI INI:</span>
                <div className="text-xl font-mono font-black text-[#1a331a]">5 / 5 DIJAWAB</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
                <button
                  onClick={onClose}
                  className="w-full sm:w-1/2 py-2.5 px-6 bg-[#2b4c2b] hover:bg-[#1a331a] text-white font-mono font-black text-xs uppercase rounded-xl border-2 border-[#1a331a] transition-all cursor-pointer shadow-[2px_2px_0_0_#1a331a] active:translate-y-[1px] active:shadow-none"
                  id="close-completed-quiz-btn"
                >
                  KEMBALI KE PAPAN MISI
                </button>
                <button
                  onClick={() => {
                    playSynthSound('quest_complete');
                    setDailyQuizCount(0);
                    localStorage.removeItem('rpg_daily_quiz_count');
                    addLog("🧪 Developer Cheat: Kuota jatah Ujian Kebijaksanaan harian berhasil di-reset ke 0/5!", "system");
                  }}
                  className="w-full sm:w-1/2 py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-stone-900 font-mono font-black text-xs uppercase rounded-xl border-2 border-[#8b5e34] transition-all cursor-pointer shadow-[2px_2px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none animate-pulse"
                  id="dev-reset-quiz-quota-btn"
                  title="Gunakan ini untuk me-reset jatah harian dan menguji kuis kembali secara instan!"
                >
                  🔄 RESET JATAH KUIS
                </button>
              </div>
            </div>
          ) : !quizComplete && currentQuestion ? (
            /* ACTIVE QUIZ SCREEN */
            <div className="p-5 md:p-6 space-y-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-8 select-none">
              
              {/* Daily Pool Counter Banner */}
              <div className="bg-[#f0f7ec] border border-[#2b4c2b]/20 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Compass className="w-4 h-4 text-[#2b4c2b]" />
                  <span className="text-[10px] md:text-xs font-mono font-bold">Kesempatan Jatah Hari Ini:</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#2b4c2b] text-white font-mono font-black text-xs border border-[#1a331a]">
                  Sisa {questionsLeftToday} Soal Lagi
                </div>
              </div>

              {/* Progress and Question indices */}
              <div className="flex items-center justify-between text-xs font-mono font-black pb-1 border-b border-stone-200">
                <span className="text-[#2b4c2b] tracking-wider flex items-center gap-1.5 uppercase">
                  <HelpCircle className="w-4 h-4 text-[#2b4c2b]" /> Ujian Level Tinggi - Soal {sessionIndex + 1}:
                </span>
                <span className="bg-[#e4efe0] text-[#2b4c2b] px-2.5 py-0.5 rounded-full border border-[#2b4c2b]/30">
                  {sessionIndex + 1} / {sessionQuestions.length}
                </span>
              </div>

              {/* Quiz loading bar progress animation */}
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((sessionIndex + 1) / sessionQuestions.length) * 100}%` }}
                />
              </div>

              {/* Countdown Timer Area */}
              <div className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                isAnswered
                  ? 'bg-stone-50 border-stone-200 text-stone-500'
                  : timeLeft <= 10
                  ? 'bg-red-50 border-red-300 text-red-950 animate-pulse'
                  : 'bg-amber-50 border-amber-300 text-amber-955'
              }`}>
                <div className="flex items-center gap-2 font-mono text-xs font-black">
                  <Clock className={`w-4 h-4 ${isAnswered ? 'text-stone-400' : timeLeft <= 10 ? 'text-red-600 animate-spin' : 'text-amber-700 animate-pulse'}`} />
                  <span>SISA WAKTU MENJAWAB:</span>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-mono font-black border-2 transition-all ${
                  isAnswered
                    ? 'bg-stone-200 text-stone-600 border-stone-300'
                    : timeLeft <= 10
                    ? 'bg-red-600 text-white border-red-800 animate-bounce'
                    : 'bg-amber-400 text-stone-900 border-[#8b5e34]'
                }`}>
                  {isAnswered ? "WAKTU BERHENTI" : `${timeLeft} Detik`}
                </div>
              </div>

              {/* Question text board */}
              <div className="bg-white border-2 border-[#2b4c2b]/30 rounded-2xl p-4.5 min-h-[5.5rem] flex items-center justify-center shadow-inner text-center">
                <h5 className="font-serif font-black text-sm md:text-base text-[#1a331a] leading-snug">
                  {currentQuestion.question}
                </h5>
              </div>

              {/* Options list */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  let btnBg = "bg-white hover:bg-[#e4efe0]/30 border-stone-300 text-stone-800";

                  if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      btnBg = "bg-emerald-100 hover:bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-none ring-2 ring-emerald-400";
                    } else if (idx === selectedOption) {
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
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all font-sans font-bold text-xs md:text-sm flex items-center gap-3 relative cursor-pointer shadow-[2px_2px_0_0_#cbdcc4] active:translate-y-[1px] active:shadow-none ${btnBg}`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-mono text-[10px] font-black ${
                        isAnswered && idx === currentQuestion.correctIndex
                          ? 'bg-emerald-600 text-white border-emerald-800'
                          : isAnswered && idx === selectedOption
                          ? 'bg-rose-600 text-white border-rose-800'
                          : 'bg-stone-100 border-stone-300'
                      }`}>
                        {isAnswered && idx === currentQuestion.correctIndex ? (
                          <Check className="w-3 h-3" />
                        ) : isAnswered && idx === selectedOption ? (
                          <X className="w-3 h-3" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <span className="flex-1 pr-6 leading-tight font-sans">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanations block */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-stone-50 border border-stone-300 rounded-xl leading-tight text-xs shadow-sm font-sans flex items-start gap-2.5 text-stone-800 mt-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#2b4c2b] shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-mono font-black tracking-wider text-[#2b4c2b] uppercase">MEMORI PENGETAHUAN AKADEMIK:</p>
                      <p className="font-medium text-[11.5px] mt-0.5 leading-relaxed font-sans">{currentQuestion.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Control next action CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    playSynthSound('click');
                    if (window.confirm("Apakah Anda yakin ingin membatalkan kuis kebijaksanaan ini? Kemajuan ujian kali ini akan hilang.")) {
                      onClose();
                    }
                  }}
                  className="px-4 py-2.5 rounded-full border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono font-black text-xs uppercase cursor-pointer flex items-center gap-1.5 transition-all shadow-[2px_2px_0_0_#fda4af] active:translate-y-[1px] active:shadow-none"
                  title="Batalkan kuis dan keluar"
                >
                  <X className="w-4 h-4 animate-pulse" />
                  <span>BATAL</span>
                </button>

                <button
                  disabled={!isAnswered}
                  onClick={handleNextClick}
                  className={`px-5 md:px-6 py-2.5 rounded-full border-2 font-mono font-black text-xs flex items-center gap-2 tracking-widest transition-all cursor-pointer ${
                    isAnswered
                      ? 'bg-[#2b4c2b] hover:bg-[#1a331a] text-white border-[#1a331a] shadow-[2px_2px_0_0_#1a331a] active:translate-y-[1px] active:shadow-none'
                      : 'bg-stone-100 text-stone-400 border-stone-300 pointer-events-none'
                  }`}
                >
                  <span>{sessionIndex === sessionQuestions.length - 1 ? 'LIHAT AKHIR INTERLUDE' : 'SOAL SELANJUTNYA'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            /* QUIZ FINISHED SCREEN */
            <div className="p-8 text-center space-y-6 flex flex-col items-center select-none font-sans">
              <div className="w-16 h-16 bg-yellow-50 rounded-full border-4 border-yellow-500 flex items-center justify-center animate-bounce">
                <Award className="w-9 h-9 text-yellow-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-black text-xl md:text-2xl text-stone-900 uppercase">UJIAN HARIAN DISELESAIKAN</h4>
                <p className="text-stone-600 font-sans text-xs md:text-sm max-w-sm leading-relaxed">
                  Terima kasih petualang! Jawaban Anda telah diserap oleh dewan kebijaksanaan demi memperkuat bekal latihan spiritual.
                </p>
              </div>

              {/* Exp reward card summary */}
              <div className="bg-[#f2f7f1] border-2 border-dashed border-[#2b4c2b]/50 p-5 rounded-2xl w-full max-w-md mx-auto space-y-3">
                <span className="text-[10px] font-mono font-black uppercase text-[#2b4c2b] tracking-widest block">RINGKASAN HASIL BELAJAR:</span>
                
                <p className="text-stone-700 font-sans text-xs md:text-sm font-bold leading-relaxed">
                  Anda berhasil menyelesaikan <span className="font-mono font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">{sessionQuestions.length}</span> soal dengan <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{correctAnswersCount}</span> jawaban benar!
                </p>

                <div className="py-2.5 px-4 bg-white border-2 border-[#2b4c2b]/15 rounded-xl inline-block w-full">
                  <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Kalkulasi Bonus EXP Yang Diperoleh:</span>
                  <div className="text-stone-700 font-mono text-xs mt-1.5 font-bold flex items-center justify-center gap-1.5 bg-stone-50 py-1 px-2.5 rounded-lg border border-stone-200">
                    <span>{correctAnswersCount} Soal Benar</span>
                    <span className="text-[#8b5e34]">×</span>
                    <span>50 EXP</span>
                  </div>
                  <div className="text-3xl font-serif font-black text-emerald-800 mt-2">
                    = +{gainedExp} EXP
                  </div>
                </div>

                <div className="text-[10px] font-mono font-black text-emerald-700">
                  ✨ Kemajuan petualangan harian ditingkatkan!
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-xs py-3 bg-[#2b4c2b] hover:bg-[#1a331a] text-white font-mono font-black text-xs md:text-sm uppercase rounded-2xl border-2 border-[#1a331a] transition-all cursor-pointer shadow-[3px_3px_0_0_#1a331a] active:translate-y-[1px] active:shadow-none h-11"
                id="claim-daily-exp-reward-btn"
              >
                🔮 CLAIM EXP & LANJUT PETUALANGAN
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
