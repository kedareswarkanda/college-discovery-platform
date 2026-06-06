const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Manually load .env variables
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;
      const index = trimmedLine.indexOf('=');
      if (index !== -1) {
        const key = trimmedLine.substring(0, index).trim();
        let value = trimmedLine.substring(index + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error reading .env file:", e);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString || connectionString.includes('xxxxx')) {
  console.error("Error: DATABASE_URL is not set properly in env.");
  process.exit(1);
}

const ddl = `
-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "fees" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "overview" TEXT NOT NULL,
    "courses" TEXT NOT NULL,
    "placements" TEXT NOT NULL,
    "reviews" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "SavedCollege" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    CONSTRAINT "SavedCollege_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SavedCollege_userId_collegeId_key" ON "SavedCollege"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "SavedCollege" DROP CONSTRAINT IF EXISTS "SavedCollege_userId_fkey";
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" DROP CONSTRAINT IF EXISTS "SavedCollege_collegeId_fkey";
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
`;

const colleges = [
  {
    name: "Indian Institute of Technology Bombay (IITB)",
    location: "Mumbai",
    fees: 220000,
    rating: 4.9,
    overview: "Established in 1958, IIT Bombay is one of the premier engineering institutions in India, known for its world-class faculty, research, and campus life in Powai, Mumbai.",
    courses: "Computer Science & Engineering, Electrical Engineering, Mechanical Engineering, Aerospace Engineering, Civil Engineering, Chemical Engineering",
    placements: "Average Package: 21.8 LPA, Highest Package: 1.5 Crore PA, Top Recruiters: Uber, Google, Microsoft, Optiver, Rubrik, Tower Research",
    reviews: "Outstanding campus life, great cultural festivals (Mood Indigo), high competitive coding culture, and top-tier placement opportunities."
  },
  {
    name: "Indian Institute of Technology Delhi (IITD)",
    location: "Delhi",
    fees: 225000,
    rating: 4.8,
    overview: "IIT Delhi, located in the heart of India's capital, is renowned for its academic excellence, state-of-the-art incubation center, and strong alumni network.",
    courses: "Computer Science & Engineering, Mathematics & Computing, Electrical Engineering, Chemical Engineering, Production & Industrial Engineering",
    placements: "Average Package: 20.5 LPA, Highest Package: 1.4 Crore PA, Top Recruiters: Microsoft, Goldman Sachs, Graviton, Bain & Co",
    reviews: "Very competitive environment, highly intellectual peer group, great location benefits, and exceptional placements every year."
  },
  {
    name: "Indian Institute of Technology Madras (IITM)",
    location: "Chennai",
    fees: 215000,
    rating: 4.9,
    overview: "IIT Madras is ranked #1 consistently in NIRF. Set in a beautiful, forested campus, it is famous for its research park and engineering design courses.",
    courses: "Computer Science & Engineering, Aerospace Engineering, Electrical Engineering, Naval Architecture, Biological Engineering",
    placements: "Average Package: 21.4 LPA, Highest Package: 1.3 Crore PA, Top Recruiters: Texas Instruments, Qualcomm, Apple, Google, BCG",
    reviews: "Rich academic tradition, quiet green campus filled with deer, strong focus on research, and world-class labs."
  },
  {
    name: "Indian Institute of Technology Kanpur (IITK)",
    location: "Kanpur",
    fees: 218000,
    rating: 4.7,
    overview: "IIT Kanpur has a massive 1055-acre campus and is famous for its stellar computer science department, national wind tunnel facility, and airstrip.",
    courses: "Computer Science & Engineering, Materials Science, Aerospace Engineering, Electrical Engineering, Cognitive Science",
    placements: "Average Package: 20.0 LPA, Highest Package: 1.2 Crore PA, Top Recruiters: Quantbox, Rubrik, Microsoft, NVIDIA, Jaguar Land Rover",
    reviews: "Excellent research environment, highly flexible academic curriculum (double majors, minors), and brilliant coding culture."
  },
  {
    name: "Indian Institute of Technology Kharagpur (IITKGP)",
    location: "Kharagpur",
    fees: 210000,
    rating: 4.7,
    overview: "The oldest IIT in the country, IIT Kharagpur is known for its vast campus, diverse engineering streams (including Agricultural and Mining), and rich student culture.",
    courses: "Computer Science & Engineering, Instrumentation Engineering, Ocean Engineering, Mining Engineering, Agricultural Engineering",
    placements: "Average Package: 19.2 LPA, Highest Package: 1.0 Crore PA, Top Recruiters: Apple, Google, Caterpillar, Shell, ExxonMobil",
    reviews: "Huge campus, amazing hall culture (Illumination festival), vast choice of branches, and huge alumni base globally."
  },
  {
    name: "Indian Institute of Technology Roorkee (IITR)",
    location: "Roorkee",
    fees: 222000,
    rating: 4.6,
    overview: "Founded in 1847 as Thomason College of Civil Engineering, IIT Roorkee is rich in history and offers world-class education in hydraulics, earthquake, and structural engineering.",
    courses: "Computer Science & Engineering, Civil Engineering, Electrical Engineering, Engineering Physics, Chemical Engineering",
    placements: "Average Package: 18.8 LPA, Highest Package: 1.2 Crore PA, Top Recruiters: Schlumberger, Microsoft, Goldman Sachs, Jio",
    reviews: "Beautiful British-era campus architecture, super strong civil and mechanical engineering departments, and wonderful student clubs."
  },
  {
    name: "Indian Institute of Technology Guwahati (IITG)",
    location: "Guwahati",
    fees: 220000,
    rating: 4.6,
    overview: "Located on the banks of the Brahmaputra River, IIT Guwahati boasts one of the most scenic campus settings in India, along with top-tier research labs.",
    courses: "Computer Science & Engineering, Data Science & AI, Electronics & Electrical Engineering, Biotechnology, Chemical Engineering",
    placements: "Average Package: 18.5 LPA, Highest Package: 1.1 Crore PA, Top Recruiters: Microsoft, Uber, Oracle, Amazon, IBM",
    reviews: "Breathtakingly beautiful campus, great sports facilities, strong research output, and peaceful environment."
  },
  {
    name: "Indian Institute of Technology Hyderabad (IITH)",
    location: "Hyderabad",
    fees: 230000,
    rating: 4.7,
    overview: "A prominent second-generation IIT, IIT Hyderabad is highly regarded for its close ties with Japanese universities and a strong focus on AI, 5G, and nanotechnology.",
    courses: "Computer Science & Engineering, Artificial Intelligence, Electrical Engineering, Biomedical Engineering, Materials Science",
    placements: "Average Package: 20.1 LPA, Highest Package: 1.3 Crore PA, Top Recruiters: TSMC, Sony, Denso, Microsoft, Google, Intel",
    reviews: "Excellent fractal academics structure, modern infrastructure, strong industry collaboration, and very tech-focused environment."
  },
  {
    name: "BITS Pilani - Pilani Campus",
    location: "Pilani",
    fees: 540000,
    rating: 4.8,
    overview: "BITS Pilani is a legendary private university known for its strict meritocracy, zero-attendance policy, and producing some of the most successful tech founders in India.",
    courses: "Computer Science, Electronics & Instrumentation, Chemical Engineering, Mechanical Engineering, Dual Degree (M.Sc. + B.E.)",
    placements: "Average Package: 19.5 LPA, Highest Package: 60 LPA, Top Recruiters: Apple, Nutanix, Google, Salesforce, McKinsey & Co.",
    reviews: "Amazing freedom due to the zero-attendance policy, strong startup incubator, Oasis cultural fest is iconic, but fees are high."
  },
  {
    name: "National Institute of Technology Trichy (NITT)",
    location: "Trichy",
    fees: 145000,
    rating: 4.6,
    overview: "Ranked #1 among all NITs in India, NIT Trichy offers incredible academic programs, high-quality laboratories, and top-tier placements matching the IITs.",
    courses: "Computer Science & Engineering, Electronics & Communication, Electrical & Electronics, Production Engineering, Chemical Engineering",
    placements: "Average Package: 16.5 LPA, Highest Package: 52 LPA, Top Recruiters: Amazon, Morgan Stanley, Qualcomm, Texas Instruments, Microsoft",
    reviews: "Brilliant coding culture, highly active student-run clubs, Pragyan tech fest, and top placements at a fraction of IIT fees."
  },
  {
    name: "National Institute of Technology Surathkal (NITK)",
    location: "Surathkal",
    fees: 150000,
    rating: 4.5,
    overview: "NITK Surathkal is unique for having its own private beach on the Arabian Sea. It is exceptionally famous for its computing courses and research facilities.",
    courses: "Computer Science & Engineering, Information Technology, Electronics & Communication, Mining Engineering, Metallurgical Engineering",
    placements: "Average Package: 15.8 LPA, Highest Package: 50 LPA, Top Recruiters: Microsoft, Uber, Amazon, Adobe, Intel, Wells Fargo",
    reviews: "Beach campus is dream-like, outstanding placement record, especially for CS and IT branches, and peaceful climate."
  },
  {
    name: "National Institute of Technology Warangal (NITW)",
    location: "Warangal",
    fees: 148000,
    rating: 4.5,
    overview: "The first NIT to be established (formerly REC Warangal), NITW is highly respected for its rigorous syllabus and highly competitive placements.",
    courses: "Computer Science & Engineering, Electronics & Communication, Mechanical Engineering, Civil Engineering, Biotechnology",
    placements: "Average Package: 15.2 LPA, Highest Package: 48 LPA, Top Recruiters: Oracle, Qualcomm, Nvidia, Cisco, Samsung, Deloitte",
    reviews: "Academic curriculum is strict, very strong coding culture, state-of-the-art supercomputing facility, and vast campus."
  },
  {
    name: "International Institute of Information Technology Hyderabad (IIITH)",
    location: "Hyderabad",
    fees: 360000,
    rating: 4.9,
    overview: "IIIT Hyderabad is a research-focused, autonomous university famous for its unmatched coding curriculum, research centers in computer vision, and GSOC selections.",
    courses: "Computer Science & Engineering, Electronics & Communication, Dual Degree (B.Tech + MS by Research)",
    placements: "Average Package: 30.2 LPA, Highest Package: 1.0 Crore PA, Top Recruiters: Google, Microsoft, Adobe, Facebook, Uber, Salesforce",
    reviews: "Best coding culture in India. Very high research focus, high workload, no campus life compared to IITs, but unmatched average packages."
  },
  {
    name: "International Institute of Information Technology Bangalore (IIITB)",
    location: "Bangalore",
    fees: 380000,
    rating: 4.7,
    overview: "Located in Electronic City, Bangalore, IIITB offers integrated courses and post-graduate programs with direct industry access to Bangalore's tech ecosystem.",
    courses: "Integrated M.Tech (Computer Science), Integrated M.Tech (Electronics & Communication)",
    placements: "Average Package: 26.5 LPA, Highest Package: 78 LPA, Top Recruiters: Intel, Cisco, Qualcomm, Apple, Goldman Sachs, Siemens",
    reviews: "Great location in Electronic City, highly technical syllabus, perfect for tech career seekers, but campus is relatively small."
  },
  {
    name: "Indian Institute of Information Technology Allahabad (IIITA)",
    location: "Allahabad",
    fees: 210000,
    rating: 4.6,
    overview: "IIIT Allahabad is known for its state-of-the-art campus and exceptionally strong competitive programming culture. It ranks very high in software engineer placements.",
    courses: "Information Technology, Electronics & Communication Engineering, IT with Specialization in Business Informatics",
    placements: "Average Package: 21.9 LPA, Highest Package: 1.2 Crore PA, Top Recruiters: Amazon, Google, CodeNation, Directi, Adobe, Microsoft",
    reviews: "Phenomenal coding culture, beautiful dome-shaped infrastructure, high-speed campus internet, and top-tier placements."
  },
  {
    name: "Delhi Technological University (DTU)",
    location: "Delhi",
    fees: 219000,
    rating: 4.5,
    overview: "Formerly Delhi College of Engineering (DCE), DTU is one of the oldest and most prestigious engineering colleges in India, known for its strong student projects.",
    courses: "Computer Science & Engineering, Software Engineering, Electronics & Communication, Mechanical Engineering, Automobile Engineering",
    placements: "Average Package: 15.1 LPA, Highest Package: 64 LPA, Top Recruiters: Amazon, Microsoft, Maruti Suzuki, Tata Motors, KPMG",
    reviews: "Huge campus in Rohini, Delhi, excellent ROI, great student projects (Formula Student racing, unmanned aerial systems), and relaxed attendance."
  },
  {
    name: "Netaji Subhas University of Technology (NSUT)",
    location: "Delhi",
    fees: 219000,
    rating: 4.4,
    overview: "NSUT, formerly NSIT, is a premier state university in Dwarka, Delhi. It is highly regarded for its electronics and computer engineering programs.",
    courses: "Computer Science & Engineering, Information Technology, Instrumentation & Control, Electronics & Communication",
    placements: "Average Package: 15.0 LPA, Highest Package: 60 LPA, Top Recruiters: Google, Microsoft, Texas Instruments, Sandisk, McKinsey",
    reviews: "Great location, extremely high cutoffs, excellent coding environment, but campus administration is strict."
  },
  {
    name: "COEP Technological University",
    location: "Pune",
    fees: 135000,
    rating: 4.5,
    overview: "Established in 1854, COEP is the third oldest engineering college in Asia. Located in Pune, it has a rich history of producing stellar engineers.",
    courses: "Computer Engineering, Metallurgy, Mechanical Engineering, Electronics & Telecommunication, Instrumentation",
    placements: "Average Package: 9.8 LPA, Highest Package: 42 LPA, Top Recruiters: Goldman Sachs, BNY Mellon, Tata Motors, L&T, Cummins",
    reviews: "Historical campus in Pune city center, legendary student clubs (boat club), highly prestigious in Maharashtra, excellent industry ties."
  },
  {
    name: "Vellore Institute of Technology (VIT)",
    location: "Vellore",
    fees: 198000,
    rating: 4.1,
    overview: "VIT Vellore is one of India's largest private universities. It features modern infrastructure, a diverse student base from all over India, and massive placement drives.",
    courses: "Computer Science & Engineering, Information Technology, Electronics & Communication, Biotechnology, Mechanical Engineering",
    placements: "Average Package: 8.2 LPA, Highest Package: 75 LPA, Top Recruiters: TCS, Cognizant, Wipro, Microsoft, Amazon, Intel, Nokia",
    reviews: "Huge, state-of-the-art campus, very modern labs, strict hostel rules, and great diversity in student activities."
  },
  {
    name: "RV College of Engineering (RVCE)",
    location: "Bangalore",
    fees: 250000,
    rating: 4.3,
    overview: "RVCE is a top-ranked private engineering college in Bangalore. It is famous for its placement record in software and core companies in South India.",
    courses: "Computer Science & Engineering, Information Science, Electronics & Communication, Aerospace Engineering, Biotech",
    placements: "Average Package: 10.5 LPA, Highest Package: 50 LPA, Top Recruiters: Cisco, Akamai, Microsoft, Goldman Sachs, Mercedes-Benz, Bosch",
    reviews: "Excellent placements in Bangalore, friendly campus, rigorous academics, and very helpful alumni network."
  },
  {
    name: "PSG College of Technology",
    location: "Coimbatore",
    fees: 110000,
    rating: 4.4,
    overview: "PSG Tech is a highly reputed government-aided institution known for its strong industry-integrated courses and excellent mechanical and textile engineering departments.",
    courses: "Mechanical Engineering, Computer Science, Electrical & Electronics, Production Engineering, Textile Technology",
    placements: "Average Package: 8.5 LPA, Highest Package: 36 LPA, Top Recruiters: L&T, Bosch, Qualcomm, Microsoft, Cognizant, Caterpillar",
    reviews: "Highly disciplined academic environment, strong industrial research, and great prestige in Tamil Nadu."
  },
  {
    name: "Jadavpur University",
    location: "Kolkata",
    fees: 10000,
    rating: 4.6,
    overview: "Jadavpur University is globally famous for its near-zero fees structure, outstanding research output, and exceptional ROI matching the top IITs.",
    courses: "Computer Science & Engineering, Electronics & Telecommunication, Mechanical Engineering, Power Engineering, Chemical Engineering",
    placements: "Average Package: 14.8 LPA, Highest Package: 85 LPA, Top Recruiters: Microsoft, Amazon, Texas Instruments, PwC, Airbus",
    reviews: "Unbelievably low fees (Rs. 2400 per year), highly democratic campus, supreme research culture, and amazing placements."
  },
  {
    name: "National Institute of Technology Rourkela (NITR)",
    location: "Rourkela",
    fees: 140000,
    rating: 4.3,
    overview: "NIT Rourkela has one of the largest campus areas among NITs. It is highly regarded for its research labs, ceramics engineering, and computing facilities.",
    courses: "Computer Science & Engineering, Ceramic Engineering, Metallurgical & Materials, Electronics & Communication, Mining",
    placements: "Average Package: 12.8 LPA, Highest Package: 46 LPA, Top Recruiters: Microsoft, Tata Steel, PwC, Oracle, Qualcomm, L&T",
    reviews: "Huge, lush green campus, great sports facilities, strong research culture, and very active student clubs."
  },
  {
    name: "National Institute of Technology Calicut (NITC)",
    location: "Calicut",
    fees: 142000,
    rating: 4.3,
    overview: "Set in a beautiful campus in the Western Ghats foothills, NIT Calicut is known for its excellent engineering education and strong placements in IT and core sectors.",
    courses: "Computer Science & Engineering, Electronics & Communication, Civil Engineering, Electrical & Electronics, Mechanical",
    placements: "Average Package: 13.0 LPA, Highest Package: 47 LPA, Top Recruiters: Goldman Sachs, Amazon, Intel, Texas Instruments, Bosch",
    reviews: "Beautiful and calm campus, highly helpful faculty, excellent placement cell, and active cultural festivals."
  },
  {
    name: "Atal Bihari Vajpayee IIITM Gwalior (IIITMG)",
    location: "Gwalior",
    fees: 185000,
    rating: 4.4,
    overview: "IIITM Gwalior is an apex institute blending information technology with management education. Its competitive programming and development culture is highly reputed.",
    courses: "Integrated M.Tech (IT), Integrated MBA, Computer Science & Engineering",
    placements: "Average Package: 17.2 LPA, Highest Package: 58 LPA, Top Recruiters: Amazon, Google, Directi, Microsoft, Adobe, BNY Mellon",
    reviews: "Beautiful residential campus, unique IT-Management integration courses, strong coding community, and excellent placements."
  }
];

function generateCuid() {
  return 'cuid_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
}

async function setup() {
  const client = new Client({ connectionString });
  try {
    console.log("Connecting to Render database...");
    await client.connect();
    
    console.log("Creating database tables (DDL)...");
    await client.query(ddl);
    console.log("Tables created successfully.");

    console.log("Cleaning up existing colleges...");
    await client.query('DELETE FROM "SavedCollege"');
    await client.query('DELETE FROM "College"');

    console.log("Inserting 25 engineering colleges...");
    for (const c of colleges) {
      const id = generateCuid();
      const query = {
        text: 'INSERT INTO "College" (id, name, location, fees, rating, overview, courses, placements, reviews) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [id, c.name, c.location, c.fees, c.rating, c.overview, c.courses, c.placements, c.reviews]
      };
      await client.query(query);
    }
    console.log("Seeding completed successfully.");
    console.log("Database is fully initialized and seeded!");

  } catch (err) {
    console.error("Database setup failed:", err);
  } finally {
    await client.end();
  }
}

setup();
