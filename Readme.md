# CourtMitra (कोर्ट मित्र) ⚖️
### AI-Powered Legal Accessibility, Advocate Practice Management & AyurIPR Intelligence Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React 19 + Vite 8](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%208-blue.svg)](https://vitejs.dev/)
[![Styling: Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8.svg)](https://tailwindcss.com/)
[![Backend: Django 6.0 + DRF](https://img.shields.io/badge/Backend-Django%206.0%20%7C%20DRF-092e20.svg)](https://www.djangoproject.com/)
[![AI Engine: LangChain + Groq](https://img.shields.io/badge/AI-LangChain%20%7C%20Groq%20Llama%203-f97316.svg)](https://groq.com/)
[![Vector DB: Qdrant](https://img.shields.io/badge/Vector%20DB-Qdrant-dc2626.svg)](https://qdrant.tech/)
[![Payments: Razorpay](https://img.shields.io/badge/Payments-Razorpay-0284c7.svg)](https://razorpay.com/)

---

## 📌 Table of Contents

- [Overview & Vision](#-overview--vision)
- [Target User Ecosystem](#-target-user-ecosystem)
- [Core Architecture](#-core-architecture)
- [Key Features](#-key-features)
  - [1. LawBot (Agentic AI Legal Assistant & Document Generator)](#1-lawbot-agentic-ai-legal-assistant--document-generator)
  - [2. Advocate Discovery & Slot Booking](#2-advocate-discovery--slot-booking)
  - [3. Advocate Practice Management Dashboard](#3-advocate-practice-management-dashboard)
  - [4. Legal Internship & Student Career Hub](#4-legal-internship--student-career-hub)
  - [5. Client / Citizen Dashboard](#5-client--citizen-dashboard)
  - [6. AyurIPR: Ayurveda IPR & Regulatory Intelligence Engine](#6-ayuripr-ayurveda-ipr--regulatory-intelligence-engine)
  - [7. National Judicial Gateway & Quick Links](#7-national-judicial-gateway--quick-links)
- [Project Directory Structure](#-project-directory-structure)
- [Technology Stack](#-technology-stack)
- [API Reference](#-api-reference)
  - [AppUser (Authentication & Profiles)](#appuser-authentication--profiles)
  - [AppLawyer (Lawyers, Internships & Reviews)](#applawyer-lawyers-internships--reviews)
  - [AppConsultant (Appointments & Razorpay Payments)](#appconsultant-appointments--razorpay-payments)
  - [AppAyurIPR (Ayurveda IPR & Regulatory)](#appayuripr-ayurveda-ipr--regulatory)
  - [Chatbot Service (RAG & Tool Execution)](#chatbot-service-rag--tool-execution)
- [Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (Django + DRF)](#1-backend-setup-django--drf)
  - [2. Chatbot Service Setup (Node.js + LangChain)](#2-chatbot-service-setup-nodejs--langchain)
  - [3. Frontend Setup (React + Vite + Tailwind)](#3-frontend-setup-react--vite--tailwind)
- [Environment Configuration](#-environment-configuration)
- [Security, Privacy & Legal Disclaimers](#-security-privacy--legal-disclaimers)
- [Contributing & License](#-contributing--license)

---

## 🏛 Overview & Vision

**CourtMitra** (*Court Friend / कोर्ट मित्र*) is a comprehensive, full-stack legal technology ecosystem designed specifically for the Indian legal framework. 

In India, accessing timely legal information, hiring verified advocates, drafting compliant legal documents, and securing court exposure for law students remain complex, opaque, and cost-prohibitive challenges. Furthermore, specialized domains such as **AYUSH and Ayurveda Intellectual Property Rights (IPR)** face severe barriers due to overlapping legal mandates across the Patents Act (Section 3(p), 3(d), 3(e)), the Biological Diversity Act, Traditional Knowledge Digital Library (TKDL) defense, and Drugs & Cosmetics Rule 158B.

CourtMitra bridges these systemic gaps by uniting **four distinct pillars** into a unified, accessible digital platform:
1. **Citizens & Litigants**: Instant AI triage, verified advocate discovery, dynamic calendar slot scheduling, automated legal document drafting, and appointment management.
2. **Advocates & Law Firms**: Practice dashboard, consultation fee billing with Razorpay, slot availability controls, and talent acquisition via internship postings.
3. **Law Students**: Career launchpad to discover verified legal internships, submit resumes, track applications, and access a rich legal textbook library and Supreme Court calendar.
4. **AYUSH & Ayurveda Innovators**: A specialized IPR & regulatory suite to classify formulations, perform LLM statutory diagnostics, evaluate Access and Benefit Sharing (ABS) mandates, and review international patent treaty compliance (such as the WIPO GRATK Treaty 2024).

---

## 👥 Target User Ecosystem

| Role | Profile Capabilities & Platform Experience |
| :--- | :--- |
| **Citizens & Clients** | • 24/7 legal guidance through **LawBot** with plain-language explanations.<br>• Filter advocates by specialization, experience, location, and fee.<br>• Real-time slot booking with integrated **Razorpay** checkout.<br>• Automated legal notice, contract, and affidavit drafting with instant PDF download.<br>• Private Client Dashboard to monitor active bookings. |
| **Advocates & Law Firms** | • Centralized practice dashboard to manage consultation schedules.<br>• Configurable calendar slots (`start_time`, `end_time`, `working_days`, `consultation_fee`).<br>• Publish internship opportunities specifying stipend, duration, and requirements.<br>• Review applicant resumes and cover letters with 1-click accept/reject workflows.<br>• Public verified advocate profile with badges, bio, and client reviews. |
| **Law Students** | • Dedicated student dashboard with tracked internship applications.<br>• 1-click internship applications with uploaded resume and tailored cover letters.<br>• Law Student Resource Hub: Core PDF textbooks (Constitutional Law, IPC, Torts), Supreme Court annual calendar, clerkship notifications, and moot practice files.<br>• AI research support for legal precedents and statutory analyses. |
| **AYUSH Researchers & MSMEs** | • Evaluate Ayurvedic formulations under Indian Patent Act Sections 3(p), 3(d), and 3(e).<br>• Determine Access & Benefit Sharing (ABS) obligations under Biological Diversity Act 2002 & 2024 Rules.<br>• Classical treatise reference cross-referencing (Charaka, Sushruta, API, AFI).<br>• International compliance analysis for US FDA (Botanical Drug) and EU THMPD. |

---

## 🏗 Core Architecture

CourtMitra is engineered as a decoupled, micro-service-ready architecture consisting of three core layers:

```mermaid
flowchart TD
    subgraph Frontend ["Client Tier (React 19 + Vite 8)"]
        UI["Tailwind CSS v4 & Lucide UI"]
        PDF["html2pdf.js Document Generator"]
        RPay["Razorpay Checkout SDK"]
        Router["React Router v7 Navigation"]
    end

    subgraph Backend ["Core API Tier (Django 6.0 + DRF)"]
        UserApp["AppUser (JWT Auth & Role Segregation)"]
        LawApp["AppLawyer (Advocates & Internships)"]
        ConsultApp["AppConsultant (Slots & Razorpay Payments)"]
        StudApp["AppStudent (Profiles & Applications)"]
        ClientApp["AppClient (Profiles & Bookings)"]
        AyurApp["AppAyurIPR (Ayurveda IPR & Regulatory Knowledge)"]
        DB[(SQLite3 / PostgreSQL)]
    end

    subgraph AIService ["AI & Chatbot Tier (Node.js + Express 5)"]
        Agent["LangChain Agent (ChatGroq Llama 3)"]
        VectorDB[("Qdrant Vector DB (384-dim Embeddings)")]
        HFEmb["HuggingFace Transformers (all-MiniLM-L6-v2)"]
        Tools["Agent Tools: recommend_lawyer, create_legal_notice, create_contract, create_affidavit, retrieve_case_files, retrieve_law_documents"]
    end

    UI -->|"HTTP / REST API"| Backend
    UI -->|"Chat / Streaming REST"| AIService
    RPay <-->|"Payment Verification"| ConsultApp
    PDF <-->|"Render & Export"| UI
    AIService -->|"Fetch Registered Lawyers"| LawApp
    Agent --> Tools
    Tools --> VectorDB
    Backend --> DB
```

---

## ✨ Key Features

### 1. LawBot (Agentic AI Legal Assistant & Document Generator)
- **Agentic Multi-Tool Workflow**: Driven by LangChain and Groq LLMs (`openai/gpt-oss-120b` or Llama 3), capable of autonomously selecting tools based on user intent.
- **RAG-Grounded Retrieval**: Queries Qdrant vector collections (`shivalik-law-casefiles` and `shivalik-law-laws`) for factual statutory citations, Indian Penal Code sections, and case precedents.
- **Dynamic Legal Drafting**:
  - **Legal Notices**: Formatted demand letters with recipient details, factual recitals, statutory grounds, and response deadlines.
  - **Contracts & Agreements**: Commercial and service agreements with indemnification, confidentiality, dispute resolution, and jurisdiction clauses.
  - **Court Affidavits**: Court-admissible affidavits with deponent particulars, verified statements, and swearing blocks.
- **Interactive Sandbox & PDF Export**: Rendered inside sandboxed iframes directly within the chat interface, equipped with 1-click **Download as PDF** using `html2pdf.js`.
- **Integrated Lawyer Discovery Tool**: The agent calls `recommend_lawyer` to pull real-time, active advocates from the Django database, preventing hallucinated phone numbers or credentials.

### 2. Advocate Discovery & Slot Booking
- **Multi-Factor Search & Filtering**: Filter advocates across 15+ specializations (Criminal, Civil, Corporate, Family, IPR, Tax, Constitutional, etc.), work mode (Remote vs. On-site), minimum years of experience, and available consultation days.
- **Automated Conflict-Free Slot Calculation**: Checks the lawyer’s working hours (`start_time`, `end_time`), scheduled breaks, and existing appointments to output strictly available 1-hour slots.
- **Integrated Razorpay Payment Gateway**:
  1. Client selects date and time slot.
  2. Frontend requests Razorpay Order creation via `/api/consultant/create-payment-order/`.
  3. Razorpay Modal loads securely with lawyer consultation fee.
  4. On signature verification, appointment status transitions to `SCHEDULED`.

### 3. Advocate Practice Management Dashboard
- **Consolidated Consultation Schedule**: Manage incoming client consultations with real-time status transitions (`SCHEDULED` ➔ `ON GOING` ➔ `COMPLETED` ➔ `CANCELLED`).
- **Talent Acquisition Engine**:
  - Post new legal internships specifying stipend, duration, remote eligibility, required competencies, and deadlines.
  - Review student applications, read personal cover letters, view qualifications, and download attached PDF resumes.
  - Accept or reject candidate submissions with real-time notifications reflected on the student’s portal.
- **Profile & Availability Controls**: Adjust working hours, days of practice, office address, and consultation fees directly from the dashboard.

### 4. Legal Internship & Student Career Hub
- **Student Profile Management**: Register academic credentials (law college, course LL.B/B.A. LL.B, current year of study, skills) and store default PDF resume.
- **Internship Portal**: Explore active openings posted by practicing advocates and legal firms across India.
- **1-Click Application Flow**: Submit tailored cover letters and auto-attach verified student profiles.
- **Application Status Tracker**: Live dashboard tracking all submitted applications (`PENDING`, `ACCEPTED`, `REJECTED`).
- **Law Student Resource Library**:
  - Comprehensive textbooks in PDF format (Constitutional Law, IPC Handbook, Law of Torts).
  - Supreme Court Annual Hearing and Vacation Calendar.
  - Practice civil and criminal demo case files for moot and drafting practice.
  - Direct access to Supreme Court Law Clerk and Judicial Clerkship programs.

### 5. Client / Citizen Dashboard
- **Consultation Central**: Access all booked consultations, viewing advocate names, appointment dates, designated time slots, and payment receipts.
- **Direct Re-scheduling & Management**: Instant options to book follow-up sessions, check lawyer contact information, and review past case details.

### 6. AyurIPR: Ayurveda IPR & Regulatory Intelligence Engine
A world-first specialized suite tailored to traditional medicine patentability and compliance:
- **Diagnostic Formulation Classifier**: Analyzes 6 clarifying parameters to classify formulations into:
  - *Classical / Generic Ayurvedic Medicine* (First Schedule codified)
  - *Patent or Proprietary (P&P) Ayurvedic Medicine* (Modified ratios / novel adjuvants)
  - *New / Non-Classical Ayurvedic Drug*
  - *Phytopharmaceutical Drug* (Purified standardized fractions)
  - *Ayurveda-Aahar / Nutraceutical* (FSSAI 2022 Regulations)
  - *Ayurvedic Cosmetic / Personal Care*
- **AyurIPR-LLM Statutory Diagnostic Engine**: Groq-powered multi-parameter analysis evaluating Section 3(p) TK bar, Section 3(e) synergistic efficacy, Section 3(d) enhanced therapeutic efficacy, Biological Diversity Act ABS obligations, and Nice Class 5 trademark constraints.
- **Bilingual RAG Statutory Assistant**: Strict layer separation between Indian National Laws (Patents Act 1970, BD Act 2002, D&C Act 1940) and International Regimes (WIPO GRATK Treaty 2024, US FDA Botanical Guidance, EU THMPD Directive), available in English and Hindi.
- **ABS (Access & Benefit Sharing) Matrix**: Interactive rule engine determining NBA (National) vs. SBB (State) jurisdiction, required filing forms (NBA Form 1/2/3, SBB Intimation), and statutory benefit-sharing levies (0.1%–0.5% ex-factory sales or 2%–5% royalties).
- **TKDL Catalog & Treatises Directory**: Searchable repository of codified Ayurvedic classical formulations cross-referenced against authoritative First Schedule treatises (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Ayurvedic Formulary of India).

### 7. National Judicial Gateway & Quick Links
- Curated, direct access to India's official digital court infrastructure:
  - **Supreme Court of India** & E-Committee Portal.
  - **eCourts India**, eCourt Services, and District Court Portals.
  - **National Judicial Data Grid (NJDG)** for live case statistics.
  - **National Legal Services Authority (NALSA)** for free legal aid.
  - Direct links to **25 State High Courts** (Allahabad, Bombay, Delhi, Calcutta, Madras, Karnataka, etc.).

---

## 📂 Project Directory Structure

```plaintext
D:\CourtMitra\
├── Backend\                         # Django REST Framework Core API
│   ├── AppAyurIPR\                  # Ayurveda IPR & Regulatory Intelligence Module
│   │   ├── management\commands\     # seed_ayur_data.py (Database seeder)
│   │   ├── migrations\              # Database migration schemas
│   │   ├── admin.py                 # Django admin registration
│   │   ├── ayur_knowledge.py        # Codified statutory knowledge base & ABS matrix
│   │   ├── models.py                # Formulation, Guideline, ABS, & TKDL models
│   │   ├── serializers.py           # REST serializers
│   │   ├── urls.py                  # AyurIPR routing endpoints
│   │   └── views.py                 # Classification, ABS engine & LLM analysis views
│   ├── AppClient\                   # Client Profiles & Consultations
│   ├── AppConsultant\               # Slot generation, Appointments & Razorpay Checkout
│   │   ├── use_cases\               # Slot availability & consultation business logic
│   │   ├── models.py                # Appointment model with Razorpay order/payment IDs
│   │   ├── urls.py                  # Booking & payment verification routes
│   │   └── views.py                 # Payment order creation & webhook/verify views
│   ├── AppLawyer\                   # Advocate Profiles, Specializations & Internships
│   ├── AppStudent\                  # Student Profiles & Internship Applications
│   ├── AppUser\                     # Custom User model (Role: LAWYER, STUDENT, CLIENT, ADMIN)
│   ├── LegalSystem\                 # Project Root Configuration
│   │   ├── asgi.py & wsgi.py
│   │   ├── settings.py              # Installed apps, JWT, CORS, Razorpay & Database
│   │   └── urls.py                  # Master routing configuration
│   ├── manage.py                    # Django management CLI
│   ├── requirements.txt             # Python dependencies
│   └── old_data.json                # Database fixtures / initial seed data
│
├── chatbot\                         # LangChain & Express AI Agent Service
│   ├── src\
│   │   ├── controller\
│   │   │   └── chat.controller.ts   # Express chat handler & PDF ingestion routes
│   │   ├── tools\                   # Agentic LangChain Tools
│   │   │   ├── caseRetriever.tool.ts       # RAG case file vector search
│   │   │   ├── createAffidavit.tool.ts     # HTML Court affidavit generator
│   │   │   ├── createContract.tool.ts      # HTML Contract agreement generator
│   │   │   ├── createLegalNotice.tool.ts   # HTML Legal notice generator
│   │   │   ├── lawRetriever.tool.ts        # RAG Statutory document search
│   │   │   └── lawyerRecommendation.tool.ts# Live Django backend lawyer matcher
│   │   ├── utils\
│   │   │   └── pdfLoader.ts         # LangChain PDF loader & directory crawler
│   │   ├── vector\
│   │   │   └── vectorstore.ts       # Qdrant client, chunking & HuggingFace embeddings
│   │   ├── index.ts                 # Express server entry point (Port 6969)
│   │   └── model.ts                 # ChatGroq initialization & lawAgent definition
│   ├── package.json                 # Node dependencies
│   └── tsconfig.json                # TypeScript compiler configuration
│
├── frontend\                        # React 19 + Vite 8 Web Application
│   ├── public\                      # Static assets & SVG icons
│   ├── src\
│   │   ├── assets\                  # Hero graphics and branding
│   │   ├── components\
│   │   │   ├── home\                # EcosystemGrid, HeroOrbit, RoleJourney
│   │   │   ├── profile\             # Client, Lawyer, and Student profile panels
│   │   │   └── navbar.jsx           # Global responsive navigation bar
│   │   ├── pages\
│   │   │   ├── About.jsx            # Mission, architecture & platform capabilities
│   │   │   ├── AyurIPR.jsx          # Comprehensive Ayurveda IPR intelligence UI
│   │   │   ├── Dashboard.jsx        # Smart role redirector
│   │   │   ├── FindClient.jsx       # Client leads & inquiry board
│   │   │   ├── FindLawyer.jsx       # Advocate directory, slot picker & Razorpay modal
│   │   │   ├── Home.jsx             # Hero landing page
│   │   │   ├── Internships.jsx      # Student internship catalog & application modal
│   │   │   ├── Lawbot.jsx           # AI chat workspace, sandbox iframe & PDF export
│   │   │   ├── LawyerDashboard.jsx  # Advocate appointment & applicant management
│   │   │   ├── Login.jsx & Signup.jsx# Role-based authentication screens
│   │   │   ├── PrivacyPolicy.jsx    # Data governance & disclaimer statements
│   │   │   ├── Profile.jsx          # Universal profile editor
│   │   │   ├── QuickLinks.jsx       # National judicial portals & High Court directory
│   │   │   ├── StudentDashboard.jsx # Student applications & Law Book library
│   │   │   └── UserDashboard.jsx    # Client consultation tracking & rebooking
│   │   ├── services\
│   │   │   └── lawbotApi.js         # API integration with fallback handlers
│   │   ├── App.jsx                  # Master React Router v7 routes
│   │   ├── index.css                # Tailwind CSS v4 directives & custom themes
│   │   └── main.jsx                 # React root DOM bootstrap
│   ├── package.json                 # Frontend dependencies & scripts
│   └── vite.config.js               # Vite bundler configuration
│
└── Readme.md                        # Master project documentation
```

---

## 💻 Technology Stack

### Frontend Architecture
- **Core Library**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 8 (`@vitejs/plugin-react`)
- **Styling & Design System**: Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
- **Icons & Typography**: Lucide React (`lucide-react`)
- **Page Transitions & UI Motion**: Framer Motion (`framer-motion`)
- **Client-Side Document Export**: `html2pdf.js`
- **Markdown & Code Rendering**: `react-markdown`, `remark-gfm`, `rehype-raw`
- **Client Routing**: React Router v7 (`react-router-dom`)
- **Payment Processing**: Razorpay Checkout (`window.Razorpay`)

### Backend Services
- **Framework**: Django 6.0 + Django REST Framework 3.17 (`djangorestframework`)
- **Authentication**: JWT tokens (`djangorestframework-simplejwt`, `PyJWT`)
- **Cross-Origin Resource Sharing**: `django-cors-headers`
- **Database Engine**: SQLite3 (Local Development) / PostgreSQL (`dj_database_url`)
- **Image & File Processing**: Pillow 12.2 (`pillow`)
- **Payment Integration**: Razorpay Python Client

### AI Chatbot & Agent Engine
- **Runtime Environment**: Node.js 18+ (Executed via `tsx`)
- **Server Framework**: Express 5 (`express`, `cors`, `dotenv`)
- **Agent Orchestration**: LangChain (`langchain`, `@langchain/core`, `@langchain/community`)
- **LLM Provider**: ChatGroq (`@langchain/groq`) using Llama 3 / GPT-OSS
- **Vector Database**: Qdrant (`@langchain/qdrant`, `@qdrant/js-client-rest`)
- **Embeddings**: HuggingFace Transformers (`@huggingface/transformers` with `Xenova/all-MiniLM-L6-v2`)
- **PDF Extraction**: `pdf-parse`, `@langchain/community/document_loaders/fs/pdf`
- **Validation**: Zod 4 (`zod`), Express Validator (`express-validator`)

---

## 📡 API Reference

### AppUser (Authentication & Profiles)
Base URL: `/api/user/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register/` | Register user (`LAWYER`, `STUDENT`, `CLIENT`) and auto-create profile | No |
| `POST` | `/login/` | Authenticate user and issue JWT Access + Refresh tokens | No |
| `GET` | `/user-detail/` | Get current user's profile and role-specific details | Bearer JWT |
| `GET` | `/get-all-specializations/` | List all legal domain specializations | No |

### AppLawyer (Lawyers, Internships & Reviews)
Base URL: `/api/law/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/lawyers/` | Retrieve all verified active advocates | No |
| `POST` | `/lawyer/create/` | Create advocate profile | Bearer JWT |
| `GET` | `/lawyer/<id>/` | Retrieve advocate details by ID | No |
| `PUT/PATCH`| `/lawyer/update/<pk>/`| Update advocate profile | Bearer JWT |
| `GET` | `/internships/` | List all available legal internships | No |
| `POST` | `/internship/create/` | Create a new internship posting | Bearer (Lawyer) |
| `POST` | `/apply/` | Submit internship application with cover letter | Bearer (Student) |
| `GET` | `/student/applications/`| Get applications submitted by student | Bearer (Student) |
| `GET` | `/lawyer/applications/` | Get applications received for lawyer's internships | Bearer (Lawyer) |
| `PATCH` | `/application/update/<pk>/`| Accept or reject an application | Bearer (Lawyer) |
| `POST` | `/review/create/` | Submit rating & review for an advocate | Bearer JWT |
| `GET` | `/reviews/<lawyer_id>/`| Get all reviews for an advocate | No |
| `POST` | `/bookmark/add/` | Bookmark an advocate profile | Bearer JWT |
| `GET` | `/bookmark/` | List current user's bookmarked advocates | Bearer JWT |

### AppConsultant (Appointments & Razorpay Payments)
Base URL: `/api/consultant/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/available-slots/<lawyer_id>/<date>/` | Fetch available 1-hour slots for a date | No |
| `POST` | `/create-payment-order/` | Generate Razorpay order for consultation booking | Bearer JWT |
| `POST` | `/verify-payment-and-book/` | Verify Razorpay payment signature & confirm booking | Bearer JWT |
| `POST` | `/create-appointment/` | Book direct appointment (free sessions) | Bearer JWT |
| `GET` | `/client-appointments/` | Retrieve booked appointments for client | Bearer (Client) |
| `GET` | `/lawyer-appointments/` | Retrieve incoming consultations for lawyer | Bearer (Lawyer) |
| `PATCH` | `/update-status/<pk>/` | Update status (`SCHEDULED`, `COMPLETED`, `CANCELLED`) | Bearer (Lawyer) |

### AppAyurIPR (Ayurveda IPR & Regulatory)
Base URL: `/api/ayur-ipr/`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/classify/` | Classify formulation across 6 statutory lanes | No |
| `POST` | `/llm-analyze/` | Groq-powered multi-regime legal diagnostic report | No |
| `POST` | `/query/` | Bilingual (EN/HI) statutory query assistant | No |
| `POST` | `/abs-check/` | Access & Benefit Sharing rule matrix calculator | No |
| `GET` | `/categories/` | List formulation classification guidelines | No |
| `GET` | `/guidelines/` | List national & international statutory rules | No |
| `GET` | `/tkdl-catalog/` | List TKDL treatises & classical formulations | No |
| `GET` | `/resources/` | List official government IP registries & links | No |
| `GET` | `/stats/` | Retrieve AyurIPR knowledge base metrics | No |

### Chatbot Service (RAG & Tool Execution)
Base URL: `http://127.0.0.1:6969/`

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status | None |
| `POST` | `/chat` | Agentic chat query with history and tool execution | `{"message": "string", "history": []}` |
| `POST` | `/ingestCase` | Ingest and vectorize case law PDFs into Qdrant | Optional batching parameters |
| `POST` | `/ingestLaw` | Ingest and vectorize statutory law PDFs into Qdrant | Optional batching parameters |

---

## 🚀 Getting Started & Installation

### Prerequisites
Ensure you have the following installed on your machine:
- **Python 3.10+** (Python 3.11 or 3.12 recommended)
- **Node.js 18+** and **npm**
- **Git**
- Optional: A running **Qdrant** instance (local Docker or Qdrant Cloud cluster)

---

### 1. Backend Setup (Django + DRF)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd D:\CourtMitra\Backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `Backend/.env`:
   ```env
   # Database (leave empty to use default SQLite db.sqlite3)
   DATABASE_URL=
   
   # Groq API Key (required for AyurIPR-LLM analysis)
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. Run migrations and seed data:
   ```bash
   python manage.py migrate
   python manage.py loaddata old_data.json
   python manage.py seed_ayur_data
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *The backend will be live at `http://127.0.0.1:8000` with the admin panel at `http://127.0.0.1:8000/admin/`.*

---

### 2. Chatbot Service Setup (Node.js + LangChain)

1. Open a new terminal and navigate to the chatbot directory:
   ```bash
   cd D:\CourtMitra\chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `chatbot/.env`:
   ```env
   PORT=6969
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=openai/gpt-oss-120b
   
   # Qdrant Vector Store
   QDRANT_URL=https://your-cluster-url.cloud.qdrant.io
   QDRANT_API_KEY=your_qdrant_api_key_here
   
   # Backend Reference for Lawyer Matching Tool
   LEGAL_BACKEND_BASE_URL=http://127.0.0.1:8000
   ```

4. Start the Chatbot service:
   ```bash
   npm run dev
   ```
   *The LawBot service will listen on `http://127.0.0.1:6969`.*

---

### 3. Frontend Setup (React + Vite + Tailwind)

1. Open a third terminal and navigate to the frontend directory:
   ```bash
   cd D:\CourtMitra\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   VITE_CHATBOT=http://127.0.0.1:6969
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be accessible at `http://localhost:5173`.*

---

## 🔐 Environment Configuration

Here is a summary of all required environment variables across CourtMitra:

### Backend (`Backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (optional) | `postgresql://user:pass@host:5432/db` |
| `GROQ_API_KEY` | Groq cloud API key for AyurIPR LLM diagnostics | `gsk_...` |
| `RAZORPAY_KEY_ID` | Razorpay public key ID for consultation billing | Configured in `settings.py` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | Configured in `settings.py` |

### Chatbot (`chatbot/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Chatbot microservice port | `6969` |
| `GROQ_API_KEY` | Groq Cloud API Key | `gsk_...` |
| `GROQ_MODEL` | Groq model identifier | `openai/gpt-oss-120b` or `llama-3.3-70b-versatile` |
| `QDRANT_URL` | Qdrant endpoint | `http://localhost:6333` or Cloud URL |
| `QDRANT_API_KEY` | Qdrant Cloud API Key (if cloud cluster) | `eyJ...` |
| `LEGAL_BACKEND_BASE_URL` | CourtMitra Django API endpoint | `http://127.0.0.1:8000` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL for Django REST backend | `http://127.0.0.1:8000` |
| `VITE_CHATBOT` | Base URL for Express Chatbot microservice | `http://127.0.0.1:6969` |

---

## 🛡 Security, Privacy & Legal Disclaimers

### Legal Advice Disclaimer
> **Important Note:** CourtMitra and its integrated AI agent (LawBot) provide statutory legal information, procedural insights, and automated drafting templates. CourtMitra does **not** constitute a formal law firm, nor does it establish an attorney-client relationship. Users should consult a qualified advocate licensed by the Bar Council of India before acting upon complex legal matters or initiating judicial proceedings.

### AyurIPR Disclaimer
> Traditional knowledge classifications and patentability analyses generated by AyurIPR are based on the Indian Patents Act 1970, the Biological Diversity Act 2002 (amended 2023), and the Drugs & Cosmetics Act 1940. They serve as strategic compliance guidelines and should be reviewed by an authorized Patent Agent or AYUSH regulatory consultant prior to commercial manufacturing or patent filings.

### Data Governance & Privileged Communications
- Client inquiry submissions and consultation notes are protected behind role-based JWT authentication.
- Passwords are encrypted using Django’s PBKDF2 password hasher.
- Payment transactions are signed and verified cryptographically through Razorpay HMAC SHA256 signatures.

---

## 🤝 Contributing & License

Contributions, bug reports, and pull requests are welcome! If you'd like to extend CourtMitra with new court integrations, regional language translations, or enhanced vector pipelines:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

### License
This project is open-source and distributed under the **MIT License**.

---

<p align="center">
  <b>CourtMitra — Empowering Justice, Bridging Advocacy, and Innovating Legal Technology.</b><br>
  Built with dedication for the legal community, students, and citizens of India. 🇮🇳
</p>
