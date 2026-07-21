## Product Requirement Document (PRD)

---

### **Project Name:** *Cryptic Decoder* (Working Title)

**Platform:** Telegram Mini App (TMA)

**Target Audience:** Gen-Z & Millennial Telegram users, puzzle/logic enthusiasts, casual gamers

**Document Version:** 1.0

**Owner:** Core Dev Team

---

### 1. Executive Summary & Product Vision

**Product Vision:**

*Cryptic Decoder* adalah game tebak-tebakan logika/puzzle berbasis Telegram Mini App yang menggabungkan elemen visual minimalis, tekanan waktu, dan retensi berbasis edukasi ringan. Game ini dirancang untuk memberikan *quick win*, dorongan pamer skor sosial (*viral loop*), serta pengalaman bermain yang *seamless* tanpa instalasi.

**Key Metrics (KPIs):**

* **DAU / MAU Ratio:** Target $> 25\%$ (menandakan retensi harian yang kuat)
* **Viral Coefficient ($K$-factor):** $> 1.2$ (setiap pengguna mengajak setidaknya 1 pengguna baru via link Telegram)
* **Average Session Length:** $2 - 4$ menit per sesi (3–5 kali main per hari)
* **Completion Rate:** $> 70\%$ pengguna menyelesaikan setidaknya 5 puzzle per sesi

---

### 2. User Persona & Target Audience

* **Primary Persona:** Casual Social Gamer (Usia 18–35 tahun)
* **Behavior:** Aktif di grup Telegram/komunitas, suka permainan cepat saat senggang, tertarik dengan tantangan logika/pop-culture.


* **Pain Points:** Game Play Store terlalu berat ($>100\text{ MB}$), banyak iklan mengganggu, butuh waktu loading lama.



---

### 3. Core Gameplay Loop & Mechanics

#### **Core Loop:**

$$\text{Buka Mini App} \longrightarrow \text{Pilih Mode} \longrightarrow \text{Tebak Puzzle (15s)} \longrightarrow \text{Haptic/Audio Feedback} \longrightarrow \text{Penjelasan Edukatif} \longrightarrow \text{Share to Group}$$

```
                          ┌──────────────────────────┐
                          │  Buka Telegram Mini App  │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │    Pilih Mode Bermain    │
                          │   (Daily / Endless)      │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │ Tampil Clue (15s Timer)  │
                          └─────────────┬────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                [ Jawaban Benar ]             [ Jawaban Salah/Timeout ]
                         │                             │
                         ▼                             ▼
              ┌─────────────────────┐       ┌────────────────────┐
              │ +Point & Haptic OK  │       │ -3s / Shake Effect │
              └──────────┬──────────┘       └──────────┬─────────┘
                         │                             │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │    Popup Penjelasan      │
                          │     Bilingual ID/EN      │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │   Leaderboard & Share    │
                          │    Result ke Group       │
                          └──────────────────────────┘

```

#### **Mekanik Tekanan Waktu & Point System:**

* **Waktu per Soal:** $15\text{ detik}$
* **Jawaban Benar:** Sisa detik $\times 10\text{ Poin}$ (Bonus *Streak* $x1.5$ setiap 5 jawaban benar berturut-turut)
* **Jawaban Salah:** Timer berkurang $3\text{ detik}$ + getaran (*haptic feedback*)


* **Penjelasan Singkat:** Muncul *pop-up modal* bilingual setelah jawaban berhasil ditebak sebelum lanjut ke level berikutnya.



---

### 4. Functional Requirements & Feature Sets

#### **4.1. Authentication & Onboarding**

* **Telegram Native Auth:** Auto-login menggunakan `initData` dari Telegram WebApp SDK. Tanpa *form registration*.
* **Language Detection:** Otomatis menyesuaikan bahasa sistem (Indonesia / Inggris) berdasarkan preferensi Telegram pengguna.



#### **4.2. Game Modes**

1. **Endless Mode:** Bermain terus menerus dari level 1 hingga gagal/kehabisan waktu.
2. **Daily Challenge:** 1 Soal khusus tiap jam/hari dengan skor pamer ekstra.

#### **4.3. UI/UX Features**

* **Cyberpunk Minimalis:** Dark mode (`#0D0E15`), aksen Neon Cyan (`#00F2FE`) & Neon Green (`#00FF87`).


* **Virtual Keyboard:** Keyboard huruf teracak di area bawah untuk input tanpa pop-up keyboard HP bawaan.


* **Haptic Feedback:** Vibrasi mikro saat menekan tombol, jawaban benar, atau salah.



#### **4.4. Social & Virality Features**

* **Group Challenge Button:** Menghasilkan *inline message* di chat Telegram:
> *"Gua berhasil nemu jawaban '👨‍💻 + ☕ + 0101' dalam 3 detik! Lu bisa ngalahin skor 450 gua?"*
> 


* **Leaderboard:** Global Leaderboard & Weekly Group Leaderboard.

---

### 5. Non-Functional Requirements

* **Performance:** *First Contentful Paint (FCP)* $< 1.5\text{ detik}$ di jaringan 4G.
* **Asset Size:** Total *bundle size* frontend $< 3\text{ MB}$ (tanpa gambar berat, mengandalkan font vector & emoji sistem).
* **Scalability:** Mampu menangani hingga $10.000\text{ Concurrent Users (CCU)}$ di sesi puncak.
* **Security:** Validasi data `initData` via HMAC-SHA256 di backend untuk mencegah *spoofing* skor.

---

### 6. Monetization Strategy

| Metode | Deskripsi | Target User |
| --- | --- | --- |
| **Telegram Stars (In-App Purchase)** | Membeli Paket Hint (1-5 Stars) / Skip Level | User kompetitif / Mentok |
| **Rewarded Ads (Adsgram API)** | Nonton iklan 5 detik untuk dapet 1 Hint gratis

 | User freemium |
| **No-Ads Pass** | Pembayaran satu kali (*one-time*) untuk bebas iklan permanen | User regular |

---

### 7. Tech Stack Architecture

* **Frontend (Mini App):** React.js / Vite + TailwindCSS + `@twa-dev/sdk`

* **State & Animation:** Zustand / Framer Motion (transisi smooth)
* **Backend:** Node.js (Express) atau Python (FastAPI)


* **Database:** SQLite / PostgreSQL (Data pengguna, *high score*, ketersediaan 100 soal)


* **Deployment:** Vercel/Render (Frontend) + Docker/VPS (Backend)



---

### 8. System Data Architecture (Schema Database)

#### **Users Table**

| Column | Type | Description |
| --- | --- | --- |
| `telegram_id` | BIGINT (PK) | Unique Telegram User ID

 |
| `username` | VARCHAR(64) | Telegram Username

 |
| `high_score` | INT | Skor tertinggi

 |
| `streak_count` | INT | Jawaban benar beruntun

 |
| `stars_balance` | INT | Saldo Telegram Stars |

#### **Puzzles Table**

| Column | Type | Description |
| --- | --- | --- |
| `id` | INT (PK) | Unique Puzzle ID

 |
| `difficulty` | INT | 1 (Easy), 2 (Medium), 3 (Hard)

 |
| `category_id` | VARCHAR(64) | Kategori Bahasa Indonesia

 |
| `category_en` | VARCHAR(64) | Category in English

 |
| `clues` | JSON | Array Emoji/Simbol

 |
| `answer` | VARCHAR(64) | Kata Kunci Jawaban

 |
| `explanation_id` | TEXT | Penjelasan ID

 |
| `explanation_en` | TEXT | Penjelasan EN

 |

---

### 9. Product Roadmap & Phasing

* **Phase 1: MVP (Minggu 1–2)**
* Integrasi Telegram WebApp SDK (`initData` auth).


* UI/UX Cyberpunk Minimalis + Virtual Keyboard.


* Import 100 Soal ke Database (SQLite/JSON).


* Core Gameplay Loop + Timer 15s + Pop-up Penjelasan.




* **Phase 2: Virality & Monetization (Minggu 3)**
* Integrasi Telegram Stars & Adsgram Rewarded Ads.


* Feature Share Result ke Grup / PM.


* Global & Group Leaderboard.




* **Phase 3: Community & Expansion (Minggu 4+)**
* Penambahan Mode *Daily Challenge*.
* Update Bank Soal ke 300+ item.



---

PRD ini siap dijadikan panduan teknis pengembangan! Mau kita mulai dari mana dulu, bro? Menyiapkan *boilerplate* frontend React Telegram Mini App-nya atau *setup API backend*-nya?