import { Level, Course, Lesson, Quiz, Lab, FinalProject, Achievement, User } from '@/types';
import bcrypt from 'bcryptjs';

// Pre-computed hashes for default accounts
export const DEFAULT_ADMIN_PASSWORD_HASH = bcrypt.hashSync('AdminPass123!', 10);
export const DEFAULT_STUDENT_PASSWORD_HASH = bcrypt.hashSync('StudentPass123!', 10);

export const initialUsers: User[] = [
  {
    id: 'user-admin-01',
    name: 'CyberSec Admin (ผู้ดูแลระบบ)',
    email: 'admin@cybersec.local',
    passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Chief Security Educator & Platform Administrator (ผู้เชี่ยวชาญด้านความมั่นคงปลอดภัยไซเบอร์)',
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'user-student-01',
    name: 'Natdanai Student (ผู้เรียน)',
    email: 'student@cybersec.local',
    passwordHash: DEFAULT_STUDENT_PASSWORD_HASH,
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Security enthusiast pursuing offensive & defensive engineering certifications (ผู้ศึกษาด้าน Cyber Defense)',
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
  }
];

export const initialLevels: Level[] = [
  {
    id: 'lvl-1',
    name: 'Level 1: Basic Security Fundamentals (พื้นฐานความมั่นคงปลอดภัย)',
    slug: 'basic',
    description: 'เรียนรู้แนวคิดพื้นฐานด้านความมั่นคงปลอดภัยไซเบอร์, เสาหลัก CIA Triad, โปรโตคอลเครือข่าย TCP/IP, ความปลอดภัยของ Linux/Windows และสถาปัตยกรรมเว็บเบื้องต้น',
    order: 1,
    badgeName: 'Basic Security Practitioner',
  },
  {
    id: 'lvl-2',
    name: 'Level 2: Intermediate Defense & Web Security (การป้องกันระดับกลางและความปลอดภัยเว็บ)',
    slug: 'intermediate',
    description: 'เจาะลึกช่องโหว่ยอดนิยม OWASP Top 10 (SQLi, XSS, CSRF, IDOR), การตั้งค่า Firewall, IDS/IPS, การเข้ารหัส และการใช้งานเครื่องมือทดสอบความปลอดภัยในระบบจำลอง',
    order: 2,
    badgeName: 'Security Specialist',
  },
  {
    id: 'lvl-3',
    name: 'Level 3: Advanced AppSec & Defensive Engineering (วิศวกรรมความปลอดภัยขั้นสูง)',
    slug: 'advanced',
    description: 'สถาปัตยกรรมความปลอดภัยขั้นสูง (OAuth, JWT, SSRF), ระบบ SIEM และ Incident Response, การวิเคราะห์ความเสี่ยง Threat Modeling และกระบวนการทดสอบเจาะระบบ (Ethical Pentest 8 ขั้นตอน)',
    order: 3,
    badgeName: 'Senior Cyber Defender',
  }
];

export const initialCourses: Course[] = [
  // Basic Level
  {
    id: 'course-b1',
    levelId: 'lvl-1',
    title: 'Cyber Security & Threat Fundamentals (พื้นฐานความมั่นคงปลอดภัยไซเบอร์และภัยคุกคาม)',
    slug: 'cyber-security-fundamentals',
    description: 'ทำความเข้าใจหลักการสำคัญของความมั่นคงปลอดภัยไซเบอร์ เสาหลัก CIA Triad ประเภทของภัยคุกคาม และการลดพื้นที่การโจมตี (Attack Surface)',
    icon: 'Shield',
    order: 1,
  },
  {
    id: 'course-b2',
    levelId: 'lvl-1',
    title: 'Networking & Protocol Security (ความมั่นคงปลอดภัยของเครือข่ายและโปรโตคอล)',
    slug: 'networking-fundamentals',
    description: 'เจาะลึกแบบจำลอง OSI 7 เลเยอร์, โปรโตคอล TCP/IP, DNS, DHCP, การเข้ารหัส HTTPS/TLS และพอร์ตมาตรฐาน',
    icon: 'Network',
    order: 2,
  },
  {
    id: 'course-b3',
    levelId: 'lvl-1',
    title: 'OS & Web Systems Foundations (พื้นฐานระบบปฏิบัติการและระบบเว็บ)',
    slug: 'os-web-fundamentals',
    description: 'การจัดการสิทธิ์บน Linux, การตรวจสอบ Event Logs บน Windows, การทำงานของ HTTP Lifecycle, Cookies และ Security Headers',
    icon: 'Terminal',
    order: 3,
  },

  // Intermediate Level
  {
    id: 'course-i1',
    levelId: 'lvl-2',
    title: 'OWASP Top 10 & Web Application Defense (การป้องกันเว็บตามมาตรฐาน OWASP Top 10)',
    slug: 'owasp-web-security',
    description: 'เจาะลึกช่องโหว่ SQL Injection, Cross-Site Scripting (XSS), CSRF, IDOR และแนวทางการป้องกันด้วย Prepared Statements และ Sanitization',
    icon: 'Globe',
    order: 4,
  },
  {
    id: 'course-i2',
    levelId: 'lvl-2',
    title: 'Network Defense, Firewalls & Cryptography (การป้องกันเครือข่าย ไฟร์วอลล์ และการเข้ารหัส)',
    slug: 'network-defense-crypto',
    description: 'หลักการสแกนเครือข่าย, การตั้งค่า Firewall, ระบบตรวจจับและป้องกันผู้บุกรุก (IDS/IPS), และความปลอดภัยของ TLS Handshake',
    icon: 'Lock',
    order: 5,
  },
  {
    id: 'course-i3',
    levelId: 'lvl-2',
    title: 'Security Tools Mastery in Sandbox (การใช้งานเครื่องมือความปลอดภัยในระบบจำลอง)',
    slug: 'security-tools-mastery',
    description: 'ฝึกฝนการใช้เครื่องมือมาตรฐาน Nmap, Burp Suite Community, Wireshark และเทคนิคการดักจับตรวจสอบ HTTP Request อย่างถูกวิธี',
    icon: 'Wrench',
    order: 6,
  },

  // Advanced Level
  {
    id: 'course-a1',
    levelId: 'lvl-3',
    title: 'Advanced Web Security & Architecture (ความมั่นคงปลอดภัยของเว็บขั้นสูงและสถาปัตยกรรม)',
    slug: 'advanced-web-security',
    description: 'ความปลอดภัยของ OAuth 2.0 / OIDC, การโจมตีและการป้องกัน JWT, การป้องกัน Server-Side Request Forgery (SSRF) และสถาปัตยกรรม Zero-Trust',
    icon: 'Cpu',
    order: 7,
  },
  {
    id: 'course-a2',
    levelId: 'lvl-3',
    title: 'Enterprise Defensive Security & Incident Response (การป้องกันระดับองค์กรและการตอบสนองภัยคุกคาม)',
    slug: 'defensive-security-siem',
    description: 'ระบบศูนย์รวม Log (SIEM), ขั้นตอนการรับมือภัยคุกคามตามมาตรฐาน NIST (6 Phases), กรอบการทำงาน MITRE ATT&CK และ STRIDE Threat Modeling',
    icon: 'Activity',
    order: 8,
  },
  {
    id: 'course-a3',
    levelId: 'lvl-3',
    title: 'Ethical Penetration Testing Methodology (ระเบียบวิธีทดสอบเจาะระบบเชิงจริยธรรม 8 ขั้นตอน)',
    slug: 'pentest-methodology',
    description: 'กระบวนการทดสอบเจาะระบบครบวงจร 8 ขั้นตอน: กฎระเบียบข้อตกลง (Rules of Engagement), การรวบรวมข้อมูล Recon, การประเมินความเสี่ยง CVSS และการเขียนรายงาน Pentest Report',
    icon: 'FileText',
    order: 9,
  },
];

// Helper to generate 20 questions per lesson with rich Thai descriptions
function generateQuestionsForLesson(lessonId: string, topic: string, customQuestions?: any[]): any[] {
  if (customQuestions && customQuestions.length === 20) {
    return customQuestions.map((q, idx) => ({
      id: `q-${lessonId}-${idx + 1}`,
      quizId: `quiz-${lessonId}`,
      question: q.question,
      questionType: q.questionType || 'MULTIPLE_CHOICE',
      order: idx + 1,
      explanation: q.explanation,
      correctAnswer: q.correctAnswer,
      options: q.options,
    }));
  }

  const baseList = customQuestions || [];
  const generated: any[] = [...baseList];

  const pool = [
    {
      q: `เป้าหมายหลักของ Confidentiality (การรักษาความลับ) ในบริบทของ ${topic} คืออะไร?`,
      opts: [
        { key: 'A', text: 'การทำให้มั่นใจว่าข้อมูลจะถูกเข้าถึงได้เฉพาะผู้ที่มีสิทธิ์เท่านั้น (Authorized entities)' },
        { key: 'B', text: 'การรับประกันว่าเซิร์ฟเวอร์จะเปิดทำงานตลอดเวลา 100%' },
        { key: 'C', text: 'การป้องกันไม่ให้ใครแก้ไขข้อมูลในฐานข้อมูล' },
        { key: 'D', text: 'การบันทึก Log ทุกครั้งที่มีการเรียกใช้งาน' },
      ],
      ans: 'A',
      exp: 'Confidentiality (การรักษาความลับ) มุ่งเน้นการปกป้องข้อมูลสำคัญไม่ให้ถูกเปิดเผยหรือเข้าถึงโดยผู้ที่ไม่ได้รับอนุญาต ผ่านกลไกการเข้ารหัสและการจำกัดสิทธิ์',
    },
    {
      q: `ในหัวข้อ ${topic} หลักการ Defense-in-Depth (การป้องกันแบบหลายชั้น) ช่วยเสริมสร้างความปลอดภัยอย่างไร?`,
      opts: [
        { key: 'A', text: 'การวางระบบควบคุมหลายชั้นซ้อนกัน เพื่อไม่ให้จุดบกพร่องจุดเดียวทำให้ระบบล่มทั้งหมด' },
        { key: 'B', text: 'การติดตั้ง Firewall ที่มีประสิทธิภาพสูงสุดเพียงตัวเดียว' },
        { key: 'C', text: 'การปิดระบบ Log ทั้งหมดเพื่อประหยัดพื้นที่จัดเก็บ' },
        { key: 'D', text: 'การบังคับให้เปลี่ยนรหัสผ่านทุกๆ 1 ชั่วโมง' },
      ],
      ans: 'A',
      exp: 'Defense-in-Depth คือการใช้มาตรการป้องกันความปลอดภัยหลายระดับ (Network, Host, Application, Data) เพื่อป้องกันเมื่อชั้นใดชั้นหนึ่งถูกเจาะ',
    },
    {
      q: `หลักการ Principle of Least Privilege (การให้สิทธิ์น้อยที่สุดที่จำเป็น) นำไปใช้อย่างไรใน ${topic}?`,
      opts: [
        { key: 'A', text: 'การกำหนดสิทธิ์ให้ผู้ใช้หรือ Service เข้าถึงเฉพาะทรัพยากรที่จำเป็นต่อหน้าที่ของตนเท่านั้น' },
        { key: 'B', text: 'การมอบสิทธิ์ Administrator ให้กับนักพัฒนาทุกคนเพื่อความสะดวกรวดเร็ว' },
        { key: 'C', text: 'การเปิดให้เข้าถึง API ภายในได้โดยไม่ต้องยืนยันตัวตน' },
        { key: 'D', text: 'การปิดการใช้งาน Multi-Factor Authentication (MFA)' },
      ],
      ans: 'A',
      exp: 'Least Privilege ช่วยจำกัดความเสียหายที่อาจเกิดขึ้นหากบัญชีหรือบริการนั้นถูกผู้ไม่ประสงค์ดีเข้าควบคุม',
    },
    {
      q: `ในการประเมินความเสี่ยง (Risk Assessment) ของ ${topic} สมการคำนวณความเสี่ยงที่นิยมใช้คืออะไร?`,
      opts: [
        { key: 'A', text: 'ความเสี่ยง (Risk) = ภัยคุกคาม (Threat) × ช่องโหว่ (Vulnerability) × ผลกระทบ (Impact)' },
        { key: 'B', text: 'ความเสี่ยง = จำนวนเครื่องเซิร์ฟเวอร์ ÷ แบนด์วิดท์ของระบบ' },
        { key: 'C', text: 'ความเสี่ยง = จำนวนพอร์ตที่เปิด + ความเร็วอินเทอร์เน็ต' },
        { key: 'D', text: 'ความเสี่ยง = จำนวนบรรทัดของโค้ด × 0.5' },
      ],
      ans: 'A',
      exp: 'ตามมาตรฐานสากล ความเสี่ยง (Risk) จะเกิดขึ้นเมื่อมีภัยคุกคามมาเจาะผ่านช่องโหว่ และส่งผลกระทบต่อองค์กร (Likelihood × Impact)',
    },
    {
      q: `ข้อใดคือบทบาทสำคัญของการจัดเก็บและตรวจสอบ Telemetry / Security Audit Logs ใน ${topic}?`,
      opts: [
        { key: 'A', text: 'การให้ความสามารถในการตรวจสอบเหตุการณ์ที่น่าสงสัยและวิเคราะห์ที่มาของการโจมตี' },
        { key: 'B', text: 'การแทนที่ระบบสำรองข้อมูล (Backup) ทั้งหมด' },
        { key: 'C', text: 'การเพิ่มความเร็วในการประมวลผลของ CPU' },
        { key: 'D', text: 'การลบบัญชีผู้ใช้ที่ไม่ได้ใช้งานโดยอัตโนมัติ' },
      ],
      ans: 'A',
      exp: 'Security Logs ให้ข้อมูลที่สำคัญต่อการสืบสวนและตอบสนองต่อเหตุการณ์ละเมิดความปลอดภัย (Forensics & Incident Response)',
    },
    {
      q: `จริงหรือไม่: แนวคิด "Security through Obscurity" (ความปลอดภัยด้วยการซ่อนข้อมูล) ถือเป็นมาตรการป้องกันที่เพียงพอใน ${topic}?`,
      opts: [
        { key: 'A', text: 'ไม่จริง: การซ่อนข้อมูลเพียงอย่างเดียวจะไร้ผลทันทีที่ผู้โจมตีค้นพบโครงสร้างระบบ' },
        { key: 'B', text: 'จริง: การเปลี่ยนหมายเลขพอร์ตถือเป็นการป้องกันที่สมบูรณ์แบบแล้ว' },
        { key: 'C', text: 'จริง: หากเราเก็บ Source Code เป็นความลับ ช่องโหว่จะไม่สามารถเกิดขึ้นได้' },
        { key: 'D', text: 'ไม่จริง: เพราะการซ่อนข้อมูลจะทำให้ CPU ทำงานหนักขึ้นมหาศาล' },
      ],
      ans: 'A',
      exp: 'ระบบที่ปลอดภัยจริงจะต้องอิงตามหลักการ Kerckhoffs ซึ่งระบบต้องปลอดภัยแม้ว่าผู้โจมตีจะทราบการทำงานทั้งหมด ยกเว้นกุญแจลับ (Key)',
    },
    {
      q: `กลยุทธ์ใดช่วยลดพื้นที่การโจมตี (Attack Surface Reduction) ได้อย่างมีประสิทธิภาพที่สุดใน ${topic}?`,
      opts: [
        { key: 'A', text: 'การปิดพอร์ตและปิด Service ที่ไม่ได้ใช้งาน และลบแพ็กเกจที่ไม่จำเป็นออกจาก Production' },
        { key: 'B', text: 'การเพิ่มขนาด RAM ให้กับเครื่องแม่ข่าย' },
        { key: 'C', text: 'การเปิด Debug Mode ในระบบที่ใช้งานจริง (Production)' },
        { key: 'D', text: 'การเปิด Broadcast โปรโตคอล UPnP' },
      ],
      ans: 'A',
      exp: 'การปิดช่องทางที่ไม่ได้ใช้งานทำให้ผู้โจมตีมีจุดเข้าถึง (Entry Points) น้อยลงอย่างมาก',
    },
    {
      q: `การตรวจสอบความถูกต้องของข้อมูล (Integrity Verification) ใน ${topic} มักใช้เทคโนโลยีใด?`,
      opts: [
        { key: 'A', text: 'Cryptographic Hashing (เช่น SHA-256) และ Digital Signatures' },
        { key: 'B', text: 'Base64 Encoding' },
        { key: 'C', text: 'การบีบอัดไฟล์ ZIP' },
        { key: 'D', text: 'การเพิ่มขนาดตัวอักษรของข้อมูล' },
      ],
      ans: 'A',
      exp: 'ฟังก์ชัน Hash แบบปลอดภัย เช่น SHA-256 ช่วยตรวจสอบว่าข้อมูลไม่มีการแก้ไขหรือเปลี่ยนแปลงระหว่างทาง',
    },
    {
      q: `ข้อใดกล่าวถูกต้องเกี่ยวกับการจัดการช่องโหว่ (Vulnerability Management) ใน ${topic}?`,
      opts: [
        { key: 'A', text: 'ต้องมีการสแกนและอัปเดต Security Patches อย่างต่อเนื่องตามวงรอบ' },
        { key: 'B', text: 'เมื่อติดตั้งระบบเสร็จแล้วไม่จำเป็นต้องแก้ไขใดๆ อีก' },
        { key: 'C', text: 'การอัปเดตระบบควรทำเฉพาะเมื่อถูกแฮกแล้วเท่านั้น' },
        { key: 'D', text: 'ช่องโหว่ระดับ Low ไม่จำเป็นต้องสนใจหรือบันทึกไว้' },
      ],
      ans: 'A',
      exp: 'การจัดการช่องโหว่ต้องทำอย่างต่อเนื่อง (Continuous Lifecycle) เพื่อป้องกันช่องโหว่ใหม่ๆ (Zero-Day และ Known CVEs)',
    },
    {
      q: `ในกระบวนการ Ethical Hacking / Security Assessment สำหรับ ${topic} กฎเกณฑ์ข้อใดสำคัญที่สุด?`,
      opts: [
        { key: 'A', text: 'ต้องได้รับความยินยอมเป็นลายลักษณ์อักษร (Authorized Scope & SOW) ก่อนการทดสอบเสมอ' },
        { key: 'B', text: 'ต้องทำการลบฐานข้อมูลของเป้าหมายเพื่อพิสูจน์ช่องโหว่' },
        { key: 'C', text: 'สามารถทดสอบระบบใดก็ได้บนอินเทอร์เน็ตโดยไม่ต้องขออนุญาต' },
        { key: 'D', text: 'ต้องเปิดเผยข้อมูลช่องโหว่ต่อสาธารณะทันทีที่ค้นพบ' },
      ],
      ans: 'A',
      exp: 'การทดสอบความปลอดภัยโดยไม่ได้รับอนุญาตถือเป็นสิ่งผิดกฎหมายอย่างร้ายแรง การทดสอบเชิงจริยธรรมจะต้องมี Scope และการอนุญาตชัดเจนเสมอ',
    },
  ];

  while (generated.length < 20) {
    const idx = generated.length;
    const template = pool[idx % pool.length];
    generated.push({
      id: `q-${lessonId}-${idx + 1}`,
      quizId: `quiz-${lessonId}`,
      question: `[คำถามข้อที่ ${idx + 1}] ${template.q}`,
      questionType: 'MULTIPLE_CHOICE',
      order: idx + 1,
      options: template.opts,
      correctAnswer: template.ans,
      explanation: template.exp,
    });
  }

  return generated.map((q, idx) => ({
    id: `q-${lessonId}-${idx + 1}`,
    quizId: `quiz-${lessonId}`,
    question: q.question,
    questionType: q.questionType || 'MULTIPLE_CHOICE',
    order: idx + 1,
    explanation: q.explanation,
    correctAnswer: q.correctAnswer,
    options: q.options,
  }));
}

export const initialLessons: Lesson[] = [
  // ==================== LEVEL 1: BASIC ====================
  // Module 1: Cyber Security Fundamentals
  {
    id: 'lesson-b1-1',
    courseId: 'course-b1',
    title: 'Introduction to Cyber Security & The CIA Triad (บทนำสู่ความมั่นคงปลอดภัยไซเบอร์และหลักการ CIA Triad)',
    slug: 'intro-cia-triad',
    level: 'BASIC',
    description: 'เรียนรู้เสาหลักความมั่นคงปลอดภัยสารสนเทศ 3 ประการ: การรักษาความลับ (Confidentiality), ความถูกต้องสมบูรณ์ (Integrity) และความพร้อมใช้งาน (Availability)',
    learningObjective: 'อธิบายขอบเขตความมั่นคงปลอดภัยไซเบอร์ วิเคราะห์หลักการ CIA Triad และเข้าใจองค์ประกอบของภัยคุกคาม',
    content: `### 1. ความมั่นคงปลอดภัยทางไซเบอร์คืออะไร? (What is Cyber Security?)
**Cyber Security** คือศาสตร์และแนวทางปฏิบัติในการปกป้องระบบคอมพิวเตอร์ เครือข่าย อุปกรณ์ และข้อมูลดิจิทัลจากการถูกโจมตี การเข้าถึงโดยไม่ได้รับอนุญาต หรือการถูกทำลาย

---

### 2. เสาหลัก 3 ประการ: The CIA Triad
หัวใจสำคัญของกรอบการทำงานด้านความปลอดภัยทุกประเภทประกอบด้วย 3 เสาหลัก:
- 🔒 **1. Confidentiality (การรักษาความลับ):** การทำให้มั่นใจว่าข้อมูลจะสามารถเข้าถึงได้เฉพาะบุคคลหรือระบบที่ได้รับสิทธิ์เท่านั้น (เช่น การเข้ารหัส Encryption, Access Control, Data Masking)
- 🛡️ **2. Integrity (ความถูกต้องสมบูรณ์):** การรักษาความถูกต้อง ครบถ้วน และความน่าเชื่อถือของข้อมูลตลอดวงจรการใช้งาน ไม่ให้ถูกแก้ไขโดยไม่ได้รับอนุญาต (เช่น การทำ Cryptographic Hashing, Digital Signatures, Checksums)
- ⚡ **3. Availability (ความพร้อมใช้งาน):** การรับประกันว่าระบบและข้อมูลจะพร้อมให้บริการแก่ผู้ใช้งานที่ได้รับอนุญาตเมื่อต้องการใช้งานเสมอ (เช่น ระบบสำรอง Redundancy, การป้องกัน DDoS, ระบบ High Availability)

---

### 3. ศัพท์พื้นฐานที่ต้องรู้ (Core Terminology)
- **Asset (ทรัพย์สิน):** ข้อมูล ระบบ หรือโครงสร้างพื้นฐานที่มีมูลค่าต่อองค์กร
- **Threat (ภัยคุกคาม):** เหตุการณ์หรือบุคคลที่มีโอกาสใช้ช่องโหว่สร้างความเสียหาย
- **Vulnerability (ช่องโหว่):** จุดบกพร่อง ความผิดพลาด หรือการตั้งค่าที่ไม่รัดกุมในระบบ
- **Risk (ความเสี่ยง):** โอกาสและผลกระทบของความเสียหายที่อาจเกิดขึ้นเมื่อภัยคุกคามเจาะผ่านช่องโหว่

> ⚠️ **คำเตือนความปลอดภัย (Safety & Legal Disclaimer):** ใช้เทคนิคและเครื่องมือ Security Testing เฉพาะบนระบบที่คุณเป็นเจ้าของหรือได้รับอนุญาตเป็นลายลักษณ์อักษรเท่านั้น ห้ามนำไปใช้โจมตีระบบจริงภายนอก`,
    labContent: `### Hands-on Exercise: Asset & Threat Modeling (แบบฝึกหัดการระบุทรัพย์สินและภัยคุกคาม)
1. วิเคราะห์ระบบ Internet Banking แล้วระบุ Digital Assets สำคัญ 3 รายการ
2. อธิบายภัยคุกคาม 1 รูปแบบที่เจาะจงไปยัง Confidentiality, Integrity, หรือ Availability
3. ออกแบบมาตรการควบคุมความปลอดภัย (Security Control) เพื่อป้องกันภัยคุกคามดังกล่าว`,
    order: 1,
    status: 'PUBLISHED',
    durationMinutes: 30,
  },
  {
    id: 'lesson-b1-2',
    courseId: 'course-b1',
    title: 'Threats, Vulnerabilities, and Attack Surface Reduction (ภัยคุกคาม ช่องโหว่ และการลดพื้นที่การโจมตี)',
    slug: 'threats-vulnerabilities-attack-surface',
    level: 'BASIC',
    description: 'ทำความเข้าใจวิธีที่ผู้ไม่ประสงค์ดีใช้ค้นหาช่องโหว่ และเรียนรู้หลักการลดพื้นที่การโจมตี (Attack Surface Reduction) ของระบบ',
    learningObjective: 'จำแนกประเภทของผู้คุกคาม แยกความแตกต่างระหว่าง CVEs และ Zero-day และประยุกต์ใช้เทคนิคลดพื้นที่การโจมตี',
    content: `### 1. ความแตกต่างระหว่าง Threat และ Vulnerability
- **Vulnerability (ช่องโหว่):** คือจุดอ่อนของระบบ (เช่น ซอฟต์แวร์ที่ไม่ได้อัปเดตแพตช์ หรือการตั้งรหัสผ่านเริ่มต้น)
- **Threat (ภัยคุกคาม):** คือตัวกระทำหรือสถานการณ์ที่สามารถนำช่องโหว่นั้นมาใช้สร้างความเสียหายได้

---

### 2. การลดพื้นที่การโจมตี (Attack Surface Reduction - ASR)
**Attack Surface** คือ ผลรวมของจุดเชื่อมต่อและบริการทั้งหมดที่ผู้ไม่ได้รับอนุญาตสามารถส่งข้อมูลเข้าหรือดึงข้อมูลออกจากระบบได้
- 🛡️ **กลยุทธ์การลดพื้นที่การโจมตี:**
  1. ปิดพอร์ตและ Service ที่ไม่ได้ใช้งานบนเครื่องเซิร์ฟเวอร์
  2. ลบโมดูลและไลบรารีสำหรับ Development ออกจาก Production Image
  3. บังคับใช้การจำกัดสิทธิ์ Least Privilege ในระดับระบบปฏิบัติการและฐานข้อมูล
  4. ทำการแบ่งส่วนเครือข่าย (Network Segmentation)

> ⚠️ **คำเตือนความปลอดภัย:** ดำเนินการตรวจสอบบนสภาพแวดล้อมจำลอง (Sandbox) เท่านั้น`,
    labContent: `### Local Lab Simulation: Attack Surface Audit
รันสคริปต์ตรวจสอบ Service และ Listening Ports บนระบบจำลองเพื่อตรวจหาและปิดพอร์ตที่ไม่จำเป็น`,
    order: 2,
    status: 'PUBLISHED',
    durationMinutes: 35,
  },

  // Module 2: Networking Fundamentals
  {
    id: 'lesson-b2-1',
    courseId: 'course-b2',
    title: 'TCP/IP, OSI Model & Protocol Deep Dive (แบบจำลอง OSI, TCP/IP และการทำงานของโปรโตคอล)',
    slug: 'tcp-ip-osi-model',
    level: 'BASIC',
    description: 'เจาะลึก 7 เลเยอร์ของแบบจำลอง OSI, การกำหนดหมายเลข IP, MAC Address และกลไกการเชื่อมต่อ 3-Way Handshake ของ TCP',
    learningObjective: 'เปรียบเทียบสถาปัตยกรรม OSI และ TCP/IP, วิเคราะห์โครงสร้าง Header ของแพ็กเกจ และเข้าใจกระบวนการ TCP 3-Way Handshake',
    content: `### 1. แบบจำลอง OSI 7 เลเยอร์ (The OSI 7-Layer Model)
1. **Physical Layer (กายภาพ):** การส่งสัญญาณบิตดิบผ่านสายนำสัญญาณหรือคลื่นวิทยุ
2. **Data Link Layer (ดาต้าลิงก์):** การควบคุมการส่งเฟรมข้อมูลด้วย MAC Address และ Switch
3. **Network Layer (เครือข่าย):** การจัดเส้นทาง (Routing) ด้วย IP Address (IPv4, IPv6, ICMP)
4. **Transport Layer (ขนส่ง):** การส่งข้อมูลแบบ End-to-End เช่น TCP (เชื่อถือได้ มีการตรวจสอบ) และ UDP (รวดเร็ว)
5. **Session Layer (เซสชัน):** การเปิด ควบคุม และปิดเซสชันระหว่างโปรแกรม
6. **Presentation Layer (นำเสนอ):** การจัดรูปแบบข้อมูล การบีบอัด และการเข้ารหัส (TLS/SSL)
7. **Application Layer (แอปพลิเคชัน):** โปรโตคอลที่ผู้ใช้และโปรแกรมติดต่อโดยตรง (HTTP, DNS, SSH, SMTP)

---

### 2. กลไก TCP 3-Way Handshake
\`\`\`text
Client (ไคลเอนต์)                      Server (เซิร์ฟเวอร์)
  | -------- SYN (ขอเชื่อมต่อ) --------> | (Seq = 100)
  | <--- SYN-ACK (ตอบรับและขอต่อ) ---- | (Seq = 300, Ack = 101)
  | -------- ACK (ยืนยันสำเร็จ) --------> | (Seq = 101, Ack = 301)
\`\`\`

> ⚠️ **คำเตือนความปลอดภัย:** ใช้การดักจับแพ็กเกจเฉพาะในระบบเครือข่ายทดสอบที่คุณได้รับอนุญาตเท่านั้น`,
    labContent: `### Wireshark Protocol Inspection Lab
เปิดไฟล์ดักจับแพ็กเกจในระบบจำลองเพื่อตรวจดูขั้นตอน SYN, SYN-ACK และ ACK สำหรับการเชื่อมต่อ`,
    order: 3,
    status: 'PUBLISHED',
    durationMinutes: 40,
  },
  {
    id: 'lesson-b2-2',
    courseId: 'course-b2',
    title: 'DNS, DHCP, Ports, and HTTPS Transport Security (ระบบ DNS, DHCP, หมายเลขพอร์ต และการเข้ารหัส HTTPS)',
    slug: 'dns-dhcp-ports-https',
    level: 'BASIC',
    description: 'เรียนรู้กระบวนการแปลงชื่อโดเมน DNS, การจ่ายหมายเลข IP ของ DHCP, พอร์ตมาตรฐานที่สำคัญ และการรักษาความปลอดภัยด้วย TLS Certificate',
    learningObjective: 'อธิบายขั้นตอนการทำงานของ DNS Resolution, ระบุพอร์ตมาตรฐานสำคัญ (22, 53, 80, 443, 3306, 5432) และเข้าใจการทำงานของ TLS Handshake',
    content: `### 1. หมายเลขพอร์ตมาตรฐานที่สำคัญ (Standard Service Ports)
- **Port 22:** SSH (Secure Shell) สำหรับรีโมตควบคุมเครื่องอย่างปลอดภัย
- **Port 53:** DNS (Domain Name System) สำหรับแปลงชื่อเว็บเป็น IP
- **Port 80:** HTTP (Plaintext Web) ไม่มีการเข้ารหัส
- **Port 443:** HTTPS (Encrypted Web over TLS) เข้ารหัสข้อมูลทั้งหมด
- **Port 3306:** MySQL / MariaDB Database
- **Port 5432:** PostgreSQL Database

---

### 2. การทำงานของ HTTPS และ TLS
HTTPS ทำการเข้ารหัสข้อมูลที่รับส่งระหว่างเบราว์เซอร์กับเซิร์ฟเวอร์เพื่อรับประกัน:
1. **Server Authentication:** ยืนยันตัวตนเซิร์ฟเวอร์ผ่านใบรับรอง X.509 Digital Certificate
2. **Confidentiality:** เข้ารหัสเนื้อหาด้วย Symmetric Encryption (AES-GCM / ChaCha20)
3. **Data Integrity:** ป้องกันการดัดแปลงข้อมูลระหว่างทางด้วย Message Authentication Codes (MAC)

> ⚠️ **คำเตือนความปลอดภัย:** ตรวจสอบความปลอดภัยบนระบบ Sandbox ของคุณเสมอ`,
    labContent: `### Certificate Inspection Exercise
ฝึกตรวจสอบใบรับรองความปลอดภัย TLS ตรวจดูวันหมดอายุ ผู้ออกใบรับรอง (Issuer) และค่า Subject Alternative Name (SAN)`,
    order: 4,
    status: 'PUBLISHED',
    durationMinutes: 35,
  },

  // Module 3: Linux & Windows Security Fundamentals
  {
    id: 'lesson-b3-1',
    courseId: 'course-b3',
    title: 'Linux Security, Permissions & Process Isolation (ความปลอดภัยบน Linux ระบบสิทธิ์ และการจัดการโปรเซส)',
    slug: 'linux-security-permissions',
    level: 'BASIC',
    description: 'ทำความเข้าใจโครงสร้างไฟล์บน Linux, ระบบสิทธิ์ผู้ใช้ (chmod / chown), การแยกส่วนการทำงานของโปรเซส และการวิเคราะห์ Security Logs',
    learningObjective: 'คำนวณและตั้งค่าสิทธิ์ไฟล์ระบบ Linux (Octal Permissions), ตรวจสอบ Log เหตุการณ์ด้วย journalctl และจัดการ Service อย่างปลอดภัย',
    content: `### 1. ระบบสิทธิ์การเข้าถึงไฟล์บน Linux (Linux Permissions Model)
สิทธิ์จะถูกแบ่งออกเป็น 3 กลุ่ม: **User (เจ้าของ)**, **Group (กลุ่ม)**, และ **Others (บุคคลอื่น)**
โดยมีค่าตัวเลข: **Read (อ่าน = 4)**, **Write (เขียน = 2)**, และ **Execute (รัน = 1)**
- \`chmod 750 script.sh\` -> rwxr-x--- (เจ้าของทำได้ทุกอย่าง, กลุ่มอ่านและรันได้, คนอื่นห้ามเข้าถึง)
- \`chmod 600 id_rsa\` -> rw------- (เฉพาะเจ้าของอ่านเขียนได้ ป้องกัน Private Key รั่วไหล)

---

### 2. ไฟล์ Log สำคัญสำหรับการตรวจสอบความปลอดภัย
- \`/var/log/auth.log\` (หรือ \`secure\` บน RHEL/CentOS): บันทึกการเข้าสู่ระบบ, การใช้ sudo
- \`/var/log/syslog\`: บันทึกเหตุการณ์ทั่วไปของระบบ

> ⚠️ **คำเตือนความปลอดภัย:** ตั้งค่าสิทธิ์ไฟล์ระบบเพื่อลดความเสี่ยงจากการถูกยกระดับสิทธิ์ (Privilege Escalation)`,
    labContent: `### Terminal Lab: Linux Hardening
ฝึกตั้งค่าสิทธิ์ไฟล์สำคัญ และตรวจสอบข้อความใน auth.log เพื่อตรวจหาความพยายาม Brute-force Login`,
    order: 5,
    status: 'PUBLISHED',
    durationMinutes: 35,
  },
  {
    id: 'lesson-b3-2',
    courseId: 'course-b3',
    title: 'Windows Security, Event Viewer & Defender (ความปลอดภัยบน Windows, Event Logs และการตั้งค่า Defender)',
    slug: 'windows-security-event-viewer',
    level: 'BASIC',
    description: 'ทำความเข้าใจระบบบัญชีผู้ใช้บน Windows, User Account Control (UAC), หมายเลข Event IDs สำคัญใน Event Viewer และการตั้งค่าความปลอดภัย',
    learningObjective: 'ระบุ Event IDs สำคัญด้านความปลอดภัย (4624, 4625, 4688) และเข้าใจการทำงานของ Endpoint Protection',
    content: `### 1. รหัสเหตุการณ์สำคัญใน Windows Security Event Log
- **Event ID 4624:** การเข้าสู่ระบบสำเร็จ (Successful Logon)
- **Event ID 4625:** การเข้าสู่ระบบล้มเหลว (Failed Logon - ตัวบ่งชี้การโจมตีแบบ Brute-force)
- **Event ID 4688:** มีการสร้าง Process ใหม่ขึ้นในระบบ (สำคัญมากต่อการตรวจสอบ Process Tree)
- **Event ID 4720:** มีการสร้างบัญชีผู้ใช้ใหม่ขึ้นในระบบ

---

### 2. User Account Control (UAC)
UAC ช่วยให้มั่นใจว่าโปรแกรมทั่วไปจะทำงานภายใต้สิทธิ์ของผู้ใช้มาตรฐานเท่านั้น เว้นแต่ผู้ใช้จะกดยืนยันการยกระดับสิทธิ์ระดับ Administrator

> ⚠️ **คำเตือนความปลอดภัย:** ตรวจสอบระบบในสภาพแวดล้อมที่ได้รับอนุญาตเท่านั้น`,
    labContent: `### Event Log Analysis Exercise
วิเคราะห์ตัวอย่าง Windows Security Event Logs เพื่อค้นหาความพยายามสร้างบัญชีที่ผิดปกติ`,
    order: 6,
    status: 'PUBLISHED',
    durationMinutes: 35,
  },

  // Module 4: Web Fundamentals & HTTP Protocol
  {
    id: 'lesson-b3-3',
    courseId: 'course-b3',
    title: 'HTTP Request Lifecycle, Cookies, Sessions & Headers (วงจรคำขอ HTTP, การจัดการ Cookie, Session และ Security Headers)',
    slug: 'http-cookies-sessions-headers',
    level: 'BASIC',
    description: 'เจาะลึก HTTP Methods, รหัสสถานะ HTTP Status Codes, แอตทริบิวต์ความปลอดภัยของ Cookie (HttpOnly, Secure, SameSite) และ Security Headers',
    learningObjective: 'สร้างคำขอ HTTP ที่ถูกต้อง, กำหนดค่า Flag ความปลอดภัยให้กับคุกกี้ และวิเคราะห์ Headers ด้านความปลอดภัย',
    content: `### 1. แอตทริบิวต์ความปลอดภัยของ Cookie (Secure Cookie Attributes)
\`\`\`http
Set-Cookie: session_id=xyz987; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400
\`\`\`
- 🛡️ **HttpOnly:** ป้องกันไม่ให้ JavaScript ฝั่งไคลเอนต์เข้าถึง Cookie ได้ ป้องกันการขโมย Token ผ่าน XSS
- 🔒 **Secure:** บังคับให้ส่ง Cookie เฉพาะผ่านการเชื่อมต่อแบบ HTTPS เท่านั้น
- 🚦 **SameSite=Strict / Lax:** ป้องกันการโจมตีแบบ Cross-Site Request Forgery (CSRF)

---

### 2. Security Headers สำคัญที่ควรเปิดใช้งาน
- \`Content-Security-Policy (CSP)\`: กำหนดแหล่งที่มาของ Script และ Resource ที่อนุญาต
- \`X-Frame-Options: DENY\`: ป้องกันการนำเว็บไปฝังใน iframe เพื่อทำ Clickjacking
- \`Strict-Transport-Security (HSTS)\`: บังคับให้เบราว์เซอร์ใช้ HTTPS เท่านั้น

> ⚠️ **คำเตือนความปลอดภัย:** ตั้งค่า Security Headers ให้ครบถ้วนเพื่อเสริมความปลอดภัยของระบบเว็บ`,
    labContent: `### Header Inspection Sandbox
วิเคราะห์ HTTP Response ของระบบเว็บทดสอบและทำการเพิ่ม Security Headers ที่ขาดหายไป`,
    order: 7,
    status: 'PUBLISHED',
    durationMinutes: 35,
  },

  // ==================== LEVEL 2: INTERMEDIATE ====================
  // Module 1: OWASP Web Security
  {
    id: 'lesson-i1-1',
    courseId: 'course-i1',
    title: 'OWASP Top 10 & SQL Injection (SQLi) Defense (การป้องกันช่องโหว่ SQL Injection ตามมาตรฐาน OWASP)',
    slug: 'owasp-sql-injection-defense',
    level: 'INTERMEDIATE',
    description: 'ทำความเข้าใจกลไกที่ทำให้เกิด SQL Injection จากการต่อสตริงคำสั่ง SQL และเรียนรู้วิธีป้องกันอย่างสมบูรณ์แบบด้วย Parameterized Queries',
    learningObjective: 'ระบุช่องโหว่ SQL Injection, เข้าใจความแตกต่างของ In-band, Blind, และ Error-based SQLi และเขียนโค้ดป้องกันด้วย Prepared Statements',
    content: `### 1. ช่องโหว่ SQL Injection คืออะไร?
SQL Injection เกิดขึ้นเมื่อแอปพลิเคชันนำข้อมูลนำเข้า (User Input) ที่ไม่ได้ผ่านการกรองมาต่อเข้ากับคำสั่ง SQL โดยตรง ทำให้ผู้โจมตีสามารถดัดแปลงโครงสร้างตรรกะของคำสั่งฐานข้อมูลได้

---

### 2. ตัวอย่างโค้ดที่มีช่องโหว่ vs โค้ดที่ปลอดภัย

❌ **โค้ดที่มีช่องโหว่ (String Concatenation):**
\`\`\`javascript
// ผู้โจมตีส่ง email เป็น: admin@test.com' OR '1'='1
const query = "SELECT * FROM users WHERE email = '" + req.body.email + "' AND password = '" + req.body.password + "'";
// ส่งผลให้ WHERE เป็นจริงเสมอ และผ่านการล็อกอินโดยไม่ต้องรู้รหัสผ่าน!
\`\`\`

✅ **โค้ดที่ปลอดภัย (Parameterized Query / Prepared Statement):**
\`\`\`typescript
// ข้อมูลของผู้ใช้จะถูกส่งแยกออกไปต่างหาก และถูกมองเป็นข้อมูลสตริงเสมอ ไม่สามารถแก้โครงสร้างคำสั่งได้
const user = await sql\`
  SELECT id, email, name, role FROM users 
  WHERE email = \${req.body.email} AND password_hash = \${hashedPassword}
\`;
\`\`\`

---

### 3. มาตรการป้องกันที่ต้องปฏิบัติ
1. **ใช้ Prepared Statements หรือ Parameterized Queries เสมอ**
2. **ใช้ ORM หรือ Query Builder ที่มีระบบ Parameterization ในตัว**
3. **ตรวจสอบและจำกัดรูปแบบข้อมูลนำเข้า (Input Validation)**
4. **จำกัดสิทธิ์ของ Database User ให้มีสิทธิ์เฉพาะเท่าที่จำเป็น (Least Privilege)**

> ⚠️ **คำเตือนความปลอดภัย:** ฝึกทดสอบเฉพาะในสภาพแวดล้อม Sandbox ของระบบเท่านั้น`,
    labContent: `### Interactive Lab: SQL Injection Sandbox
ทดสอบความแตกต่างระหว่าง Vulnerable Query และ Prepared Statement ในระบบฐานข้อมูลจำลอง`,
    order: 8,
    status: 'PUBLISHED',
    durationMinutes: 45,
  },
  {
    id: 'lesson-i1-2',
    courseId: 'course-i1',
    title: 'Cross-Site Scripting (XSS) & Content Security Policy (การป้องกันช่องโหว่ XSS และการกำหนด CSP)',
    slug: 'xss-cross-site-scripting-csp',
    level: 'INTERMEDIATE',
    description: 'เจาะลึกรูปแบบช่องโหว่ Stored, Reflected, และ DOM-based XSS พร้อมเรียนรู้เทคนิค Output Encoding และการบังคับใช้ CSP',
    learningObjective: 'แยกแยะประเภทของ XSS, ระบุจุดเสี่ยง DOM Sinks และกำหนดนโยบาย Content Security Policy ที่รัดกุม',
    content: `### 1. ประเภทของช่องโหว่ XSS
- **Reflected XSS:** โค้ดอันตรายสะท้อนกลับมาจากคำขอทันที (เช่น ผ่าน URL Parameter)
- **Stored XSS:** โค้ดอันตรายถูกบันทึกเก็บไว้ในฐานข้อมูล และแสดงผลแก่เหยื่อทุกคนที่เปิดดูหน้านั้น
- **DOM-based XSS:** ช่องโหว่เกิดขึ้นที่ JavaScript ฝั่งไคลเอนต์ที่มีการนำข้อมูลที่ไม่ได้กรองไปใส่ใน DOM (เช่น \`element.innerHTML\`)

---

### 2. แนวทางการป้องกัน (Defensive Strategies)
1. **Context-Aware Output Encoding:** แปลงอักขระพิเศษ (เช่น \`<, >, &, ", '\`) ให้เป็น HTML Entities ก่อนแสดงผล
2. **HttpOnly Cookie:** ป้องกันไม่ให้สคริปต์เข้าถึง Token การเข้าสู่ระบบ
3. **Content-Security-Policy (CSP):** กำหนดแหล่งที่มาที่อนุญาตให้รันสคริปต์ได้

> ⚠️ **คำเตือนความปลอดภัย:** ทดสอบเฉพาะในระบบทดลองที่ได้รับอนุญาตเท่านั้น`,
    labContent: `### Interactive XSS Sanitization Lab
ทดลองป้อนข้อมูลในสภาพแวดล้อมจำลองเพื่อดูความแตกต่างระหว่าง Raw DOM Insertion และ Sanitized Output`,
    order: 9,
    status: 'PUBLISHED',
    durationMinutes: 40,
  },
  {
    id: 'lesson-i1-3',
    courseId: 'course-i1',
    title: 'CSRF, IDOR & Broken Access Control (การป้องกัน CSRF, IDOR และความผิดพลาดในการควบคุมสิทธิ์)',
    slug: 'csrf-idor-broken-access-control',
    level: 'INTERMEDIATE',
    description: 'เรียนรู้สาเหตุของการเกิด Insecure Direct Object References (IDOR), การโจมตีแบบ CSRF และการบังคับใช้การตรวจสอบสิทธิ์ระดับ Object ฝั่งเซิร์ฟเวอร์',
    learningObjective: 'ระบุจุดบกพร่องของการตรวจสอบสิทธิ์, ประยุกต์ใช้ Anti-CSRF Token และออกแบบระบบควบคุมสิทธิ์ระดับ Object',
    content: `### 1. ช่องโหว่ IDOR คืออะไร?
**IDOR (Insecure Direct Object References)** เกิดขึ้นเมื่อระบบเปิดให้เข้าถึงข้อมูลโดยอ้างอิงผ่าน ID โดยตรง (เช่น \`/api/invoices/1042\`) แต่เซิร์ฟเวอร์ไม่ได้ตรวจสอบว่าผู้ใช้งานที่ส่งคำขอนั้นเป็นเจ้าของข้อมูลนั้นจริงหรือไม่

---

### 2. ตัวอย่างการแก้ไข IDOR ให้ปลอดภัย
\`\`\`typescript
// ✅ ตรวจสอบสิทธิ์ความเป็นเจ้าของในระดับฐานข้อมูลเสมอ
const invoice = await db.invoice.findFirst({
  where: {
    id: req.params.id,
    userId: session.user.id // บังคับว่าต้องตรงกับผู้ใช้ที่ล็อกอินอยู่เท่านั้น!
  }
});
if (!invoice) throw new ForbiddenException("ไม่มีสิทธิ์เข้าถึงข้อมูลนี้");
\`\`\`

> ⚠️ **คำเตือนความปลอดภัย:** ต้องตรวจสอบสิทธิ์ทุกครั้งที่ฝั่งเซิร์ฟเวอร์ ไม่พึ่งพาการซ่อนปุ่มฝั่งไคลเอนต์`,
    labContent: `### IDOR Sandbox Lab
ทดลองส่งคำขอเพื่อจำลองการเข้าถึงทรัพยากร และทำการแก้ไข Handler ให้มีการตรวจสอบ session.user.id อย่างถูกต้อง`,
    order: 10,
    status: 'PUBLISHED',
    durationMinutes: 40,
  },

  // Module 2: Network Security & Firewalls
  {
    id: 'lesson-i2-1',
    courseId: 'course-i2',
    title: 'Network Scanning, Firewalls & IDS/IPS Systems (การสแกนเครือข่าย ระบบไฟร์วอลล์ และ IDS/IPS)',
    slug: 'network-scanning-firewalls-ids-ips',
    level: 'INTERMEDIATE',
    description: 'ทำความเข้าใจการทำงานของ Packet Filters, Stateful Firewalls, ระบบตรวจจับ/ป้องกันผู้บุกรุก (IDS/IPS) และการแบ่งส่วนเครือข่าย',
    learningObjective: 'เปรียบเทียบ Stateless vs Stateful Inspection, กำหนดกฎเกณฑ์ Firewall และวิเคราะห์การแจ้งเตือนของ IDS',
    content: `### 1. สถาปัตยกรรมของไฟร์วอลล์ (Firewall Architecture)
- **Stateless Packet Filter:** ตรวจสอบแพ็กเกจเป็นรายตัวตาม IP ต้นทาง/ปลายทางและพอร์ต โดยไม่สนใจสถานะการเชื่อมต่อ
- **Stateful Inspection:** มีการติดตามสถานะ Connection Table อนุญาตให้แพ็กเกจขากลับวิ่งผ่านได้เฉพาะการเชื่อมต่อที่ได้รับอนุญาตแล้ว
- **Next-Generation Firewall (NGFW):** ตรวจสอบข้อมูลเชิงลึกจนถึงระดับ Application Layer (Layer 7)

---

### 2. ความแตกต่างระหว่าง IDS และ IPS
- **IDS (Intrusion Detection System):** ทำหน้าที่ดักฟังสัญญาณ แจ้งเตือนเมื่อพบรูปแบบการโจมตี (Passive Monitoring)
- **IPS (Intrusion Prevention System):** วางตัวขวางเส้นทางข้อมูล (Inline) และทำการตัดการเชื่อมต่อหรือทิ้งแพ็กเกจที่เป็นอันตรายโดยอัตโนมัติ

> ⚠️ **คำเตือนความปลอดภัย:** ปฏิบัติตามมาตรฐานการตั้งค่าไฟร์วอลล์เพื่อความมั่นคงปลอดภัยสูงสุด`,
    labContent: `### Firewall Rule Configuration Exercise
เขียนกฎ UFW / iptables เพื่อเปิดรับเฉพาะทราฟฟิก HTTPS และจำกัดการเข้าถึง SSH เฉพาะไอพีภายในที่ได้รับอนุญาต`,
    order: 11,
    status: 'PUBLISHED',
    durationMinutes: 40,
  },

  // Module 3: Security Tools Mastery
  {
    id: 'lesson-i3-1',
    courseId: 'course-i3',
    title: 'Nmap Port Scanning & Service Enumeration in Sandbox (การสแกนพอร์ตและสำรวจบริการด้วย Nmap ในระบบจำลอง)',
    slug: 'nmap-scanning-enumeration-sandbox',
    level: 'INTERMEDIATE',
    description: 'ฝึกฝนการใช้คำสั่ง Nmap (-sS, -sV, -sC, -p-) สำหรับการสำรวจบริการและการตรวจสอบความปลอดภัยของเครือข่ายอย่างถูกต้องตามกฎหมาย',
    learningObjective: 'รันคำสั่ง Nmap ในระบบ Sandbox (127.0.0.1), อ่านผลลัพธ์ของ Service Banners และนำข้อมูลมาปรับปรุงการป้องกันระบบ',
    content: `### 1. รูปแบบการสแกนของ Nmap ที่นิยมใช้
- \`nmap -sS -p 1-1000 127.0.0.1\`: TCP SYN Stealth Scan (การสแกนแบบกึ่งเปิด ไม่เสร็จสิ้น Handshake)
- \`nmap -sV -sC 127.0.0.1\`: ตรวจหาเวอร์ชันของบริการ (Version Detection) และรัน Default Security Scripts
- \`nmap -p- 127.0.0.1\`: สแกนพอร์ตครบทั้ง 65,535 พอร์ต

---

### 2. การนำผลลัพธ์มาใช้ในการป้องกันระบบ
การสแกนระบบของตนเองช่วยให้ทีมป้องกัน (Blue Team) ทราบว่ามีบริการใดเปิดทิ้งไว้โดยไม่จำเป็น และสามารถปิดการทำงานก่อนที่ผู้โจมตีจะค้นพบ

> ⚠️ **คำเตือนความปลอดภัย:** รันคำสั่งสแกนเฉพาะเป้าหมายจำลอง 127.0.0.1 / Local Docker ของคุณเท่านั้น`,
    labContent: `### Interactive Nmap Terminal Sandbox
ฝึกรันคำสั่ง Nmap ใน Terminal Sandbox ของระบบ เพื่อตรวจหาพอร์ตและบริการที่เปิดอยู่บนเครื่องจำลอง`,
    order: 12,
    status: 'PUBLISHED',
    durationMinutes: 45,
  },
  {
    id: 'lesson-i3-2',
    courseId: 'course-i3',
    title: 'Burp Suite Community & HTTP Interception Mechanics (การดักจับและวิเคราะห์คำขอ HTTP ด้วย Burp Suite)',
    slug: 'burp-suite-http-intercept',
    level: 'INTERMEDIATE',
    description: 'เรียนรู้หลักการทำงานของ Proxy Interception, HTTP History, Repeater, Decoder สำหรับการทดสอบความปลอดภัยของเว็บแอปพลิเคชัน',
    learningObjective: 'ตั้งค่า Proxy บนเบราว์เซอร์, ดักจับคำขอ HTTP, ส่งคำขอไปยัง Repeater เพื่อทดสอบการส่งพารามิเตอร์ และวิเคราะห์ผลตอบกลับ',
    content: `### 1. องค์ประกอบหลักของ Burp Suite
- **Proxy:** ตัวกลางดักจับคำขอระหว่างเบราว์เซอร์กับเซิร์ฟเวอร์
- **Repeater:** เครื่องมือสำหรับแก้ไขข้อมูลใน HTTP Request แล้วส่งซ้ำเพื่อทดสอบการตอบสนอง
- **Decoder:** เครื่องมือถอดรหัสและเข้ารหัสข้อมูล (URL, Base64, Hex, HTML)
- **Comparer:** เครื่องมือเปรียบเทียบความแตกต่างระหว่างสอง Response

---

### 2. ขั้นตอนการวิเคราะห์ความปลอดภัย
1. ดักจับ Request ในระบบจำลอง (เช่น OWASP Juice Shop)
2. ส่ง Request ไปยัง Repeater ด้วยคีย์ลัด (\`Ctrl + R\`)
3. ปรับเปลี่ยนข้อมูลนำเข้าเพื่อทดสอบ Boundary Conditions
4. ตรวจสอบว่าระบบมีมาตรการตรวจสอบและปฏิเสธข้อมูลที่ไม่ถูกต้องหรือไม่

> ⚠️ **คำเตือนความปลอดภัย:** ทดสอบเฉพาะในสภาพแวดล้อม Sandbox ที่ได้รับอนุญาตเท่านั้น`,
    labContent: `### Burp Suite Proxy Simulation Lab
ใช้เครื่องมือจำลอง HTTP Interceptor ในระบบเพื่อตรวจสอบและส่งซ้ำคำขอ HTTP ไปยัง API ทดสอบ`,
    order: 13,
    status: 'PUBLISHED',
    durationMinutes: 45,
  },

  // ==================== LEVEL 3: ADVANCED ====================
  // Module 1: Advanced Web Security
  {
    id: 'lesson-a1-1',
    courseId: 'course-a1',
    title: 'OAuth 2.0, OpenID Connect & JWT Security Hardening (ความมั่นคงปลอดภัยของ OAuth 2.0, OIDC และการเสริมแกร่ง JWT)',
    slug: 'oauth-jwt-security-hardening',
    level: 'ADVANCED',
    description: 'ทำความเข้าใจโครงสร้างของ JSON Web Tokens, ช่องโหว่ Algorithm Confusion (None / HS vs RS), การป้องกัน Token Replay และ PKCE Flow',
    learningObjective: 'สร้างและตรวจสอบลายเซ็น JWT ด้วยอัลกอริทึมที่ปลอดภัย (RS256 / Ed25519), ป้องกัน Token Replay และกำหนดค่า PKCE',
    content: `### 1. โครงสร้างและจุดเสี่ยงของ JSON Web Token (JWT)
JWT ประกอบด้วย 3 ส่วน: \`header.payload.signature\` คั่นด้วยจุด
จุดอ่อนที่พบบ่อย:
- **Algorithm None Attack:** การปลอมแปลง Token โดยระบุ \`"alg": "none"\` หากเซิร์ฟเวอร์ไม่ได้ตรวจสอบ
- **Weak HMAC Secret:** การใช้ Key สั้นทำให้ถูก Brute-force ถอดรหัสได้ง่าย
- **Missing Expiration (\`exp\`):** ไม่มีการกำหนดวันหมดอายุของ Token

---

### 2. OAuth 2.0 Authorization Code Flow ร่วมกับ PKCE
PKCE (Proof Key for Code Exchange) ช่วยปกป้อง Authorization Code จากการถูกดักฟังบน Single Page Applications (SPA) โดยใช้การตรวจสอบ Code Challenge และ Code Verifier

> ⚠️ **คำเตือนความปลอดภัย:** กำหนดค่าการตรวจสอบความถูกต้องของ Token อย่างเข้มงวดเสมอ`,
    labContent: `### JWT Token Cryptanalysis Lab
วิเคราะห์และแก้ไขช่องโหว่ของโค้ดตรวจสอบ JWT ที่มีข้อผิดพลาดเรื่องการตรวจสอบ Signature`,
    order: 14,
    status: 'PUBLISHED',
    durationMinutes: 50,
  },
  {
    id: 'lesson-a1-2',
    courseId: 'course-a1',
    title: 'Server-Side Request Forgery (SSRF) & Deserialization (การป้องกันช่องโหว่ SSRF และความเสี่ยงจาก Deserialization)',
    slug: 'ssrf-deserialization-mitigation',
    level: 'ADVANCED',
    description: 'ทำความเข้าใจว่า SSRF สามารถถูกใช้เพื่อเข้าถึง Cloud Metadata Service (169.254.169.254) ได้อย่างไร และเรียนรู้วิธีป้องกันด้วย IP Allowlisting',
    learningObjective: 'ระบุรูปแบบการโจมตี SSRF, บล็อกช่วงไอพีภายในที่เป็น Private IP (RFC 1918) และประมวลผลข้อมูล Serialized อย่างปลอดภัย',
    content: `### 1. ช่องโหว่ SSRF คืออะไร?
SSRF เกิดขึ้นเมื่อเซิร์ฟเวอร์เปิดให้ผู้ใช้ระบุ URL เพื่อให้เซิร์ฟเวอร์ไปดาวน์โหลดข้อมูล แต่ผู้โจมตีระบุปลายทางเป็นบริการภายในเครื่อง หรือ Cloud Metadata Service เช่น \`http://169.254.169.254/latest/meta-data/\` เพื่อขโมย Access Credentials

---

### 2. สถาปัตยกรรมการป้องกัน SSRF ที่มีประสิทธิภาพ
1. **ทำการ Resolve Hostname เป็น IP Address ก่อนเสมอ**
2. **บล็อก Private IP Ranges ทั้งหมด** (\`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`, \`127.0.0.0/8\`, \`169.254.0.0/16\`)
3. **ปิดการทำงานของ Automatic HTTP Redirect**
4. **ใช้ Dedicated Egress Proxy** สำหรับคำขอที่ต้องออกไปยังอินเทอร์เน็ตภายนอก

> ⚠️ **คำเตือนความปลอดภัย:** ป้องกันการเรียกใช้เครือข่ายภายในจากภายนอกอย่างเคร่งครัด`,
    labContent: `### SSRF Guard Simulator
เขียนฟังก์ชันกรอง URL และตรวจสอบ IP Address เพื่อป้องกันการส่งคำขอไปยัง Intranet และ Cloud Metadata`,
    order: 15,
    status: 'PUBLISHED',
    durationMinutes: 45,
  },

  // Module 2: Enterprise Defensive Security & SIEM
  {
    id: 'lesson-a2-1',
    courseId: 'course-a2',
    title: 'SIEM Architecture, Threat Hunting & Incident Response (สถาปัตยกรรม SIEM, การล่าภัยคุกคาม และขั้นตอนตอบสนองเหตุการณ์)',
    slug: 'siem-threat-hunting-incident-response',
    level: 'ADVANCED',
    description: 'เรียนรู้การรวบรวม Log จากแหล่งต่างๆ, การสร้าง Correlation Rules, การเทียบเคียงกับ MITRE ATT&CK และขั้นตอน Incident Response 6 เฟสตามมาตรฐาน NIST',
    learningObjective: 'ออกแบบกฎ Correlation Rule บนระบบ SIEM, แมปพฤติกรรมผู้โจมตีเข้ากับเทคนิคใน MITRE ATT&CK และปฏิบัติตาม Playbook รับมือภัยคุกคาม',
    content: `### 1. วงจรการตอบสนองต่อเหตุการณ์ 6 ขั้นตอนตามมาตรฐาน NIST
1. **Preparation (การเตรียมความพร้อม):** กำหนดนโยบาย เตรียมเครื่องมือ ฝึกอบรม และทำระบบสำรองข้อมูล
2. **Detection & Analysis (การตรวจจับและวิเคราะห์):** ตรวจจับความผิดปกติ คัดกรอง Alert และวิเคราะห์ตัวบ่งชี้ (IOCs)
3. **Containment (การควบคุมและจำกัดขอบเขต):** ตัดแยกเครื่องที่ถูกบุกรุกออกจากเครือข่ายชั่วคราวเพื่อป้องกันการแพร่กระจาย
4. **Eradication (การกำจัดสาเหตุ):** ลบมัลแวร์ ปิดช่องโหว่ และเพิกถอนสิทธิ์บัญชีที่ถูกขโมย
5. **Recovery (การกู้คืนระบบ):** กู้คืนระบบจากชุดข้อมูลสำรองที่ปลอดภัย และเฝ้าระวังอย่างต่อเนื่อง
6. **Lessons Learned (การถอดบทเรียน):** ประชุมสรุปปัญหาและปรับปรุงมาตรการควบคุมความปลอดภัยให้ดียิ่งขึ้น

---

### 2. กรอบการทำงาน MITRE ATT&CK
MITRE ATT&CK เป็นฐานข้อมูลความรู้ที่จัดหมวดหมู่พฤติกรรมและกลยุทธ์ (Tactics & Techniques) ของผู้โจมตีในโลกแห่งความเป็นจริง ช่วยให้ทีมความปลอดภัยวางระบบตรวจจับได้อย่างตรงจุด

> ⚠️ **คำเตือนความปลอดภัย:** ใช้งานระบบ SIEM เพื่อปกป้องโครงสร้างพื้นฐานขององค์กรอย่างสม่ำเสมอ`,
    labContent: `### SIEM Triage Simulation
วิเคราะห์ความสัมพันธ์ระหว่างเหตุการณ์ Failed Logins จำนวนมากที่เกิดขึ้นพร้อมกับการรันคำสั่งต้องสงสัยในระบบจำลอง SIEM`,
    order: 16,
    status: 'PUBLISHED',
    durationMinutes: 50,
  },

  // Module 3: Ethical Penetration Testing Course (Stages 1-8)
  {
    id: 'lesson-a3-1',
    courseId: 'course-a3',
    title: 'Pentest Methodology Stage 1-4: Legal Scope & Recon (ระเบียบวิธีเจาะระบบ ขั้นที่ 1-4: ขอบเขตทางกฎหมายและการสำรวจ)',
    slug: 'pentest-stage-1-4-scope-recon',
    level: 'ADVANCED',
    description: 'ขั้นที่ 1: กฎระเบียบและจริยธรรม (Rules of Engagement); ขั้นที่ 2: การจัดเตรียม Sandbox จำลอง; ขั้นที่ 3: การรวบรวมข้อมูล Reconnaissance; ขั้นที่ 4: การสแกนค้นหาบริการ',
    learningObjective: 'ร่างเอกสารข้อตกลงการทดสอบ Rules of Engagement, จัดเตรียมระบบทดสอบจำลอง, ดำเนินการ Passive Reconnaissance และทำบันทึกรายการทรัพย์สิน',
    content: `### 1. ขั้นที่ 1: ขอบเขตทางกฎหมายและ Rules of Engagement (ROE)
การทดสอบเจาะระบบเชิงจริยธรรมทุกครั้งจะต้องเริ่มต้นด้วยเอกสารสัญญาที่มีผลทางกฎหมาย:
- **Statement of Work (SOW):** กำหนดขอบเขตเป้าหมาย วันเวลา และเงื่อนไขการทดสอบ
- **In-Scope Targets:** รายการ IP Addresses และ Domains ที่ได้รับอนุญาตให้ทดสอบอย่างชัดเจน
- **Out-of-Scope Targets:** ระบบที่ห้ามแตะต้องโดยเด็ดขาด (เช่น ฐานข้อมูล Production, Third-party Cloud)

---

### 2. ขั้นที่ 2 ถึง 4: การจัดเตรียมและสำรวจระบบ
- **ขั้นที่ 2:** การตั้งค่าสภาพแวดล้อมจำลอง (Docker / VM) เพื่อป้องกันผลกระทบต่อระบบจริง
- **ขั้นที่ 3:** Passive Reconnaissance รวบรวมข้อมูลสาธารณะโดยไม่ส่งทราฟฟิกไปกระทบเป้าหมาย
- **ขั้นที่ 4:** Active Scanning สแกนพอร์ตและสำรวจเวอร์ชันของบริการที่เปิดอยู่

> ⚠️ **คำเตือนความปลอดภัย:** ห้ามทดสอบระบบใดๆ โดยปราศจากหนังสือยินยอมที่เป็นลายลักษณ์อักษรโดยเด็ดขาด`,
    labContent: `### Scope Definition & Docker Lab Setup
ฝึกกำหนดขอบเขตการทดสอบและเปิดใช้งานสภาพแวดล้อม Docker Sandbox สำหรับการทดสอบความปลอดภัย`,
    order: 17,
    status: 'PUBLISHED',
    durationMinutes: 45,
  },
  {
    id: 'lesson-a3-2',
    courseId: 'course-a3',
    title: 'Pentest Methodology Stage 5-8: Web Testing, Analysis & Reporting (ระเบียบวิธีเจาะระบบ ขั้นที่ 5-8: การทดสอบเว็บ การประเมินความเสี่ยง และการเขียนรายงาน)',
    slug: 'pentest-stage-5-8-web-reporting',
    level: 'ADVANCED',
    description: 'ขั้นที่ 5: การทดสอบความปลอดภัยเว็บ; ขั้นที่ 6: การวิเคราะห์เชิงลึกด้วย Burp Suite; ขั้นที่ 7: การประเมินระดับความรุนแรงด้วยคะแนน CVSS; ขั้นที่ 8: การจัดทำรายงาน Pentest Report ระดับผู้บริหารและทีมเทคนิค',
    learningObjective: 'ดำเนินกระบวนการประเมินช่องโหว่เว็บอย่างเป็นระบบ, คำนวณคะแนนความรุนแรงตามมาตรฐาน CVSS และจัดทำรายงานผลการทดสอบความปลอดภัยระดับมืออาชีพ',
    content: `### 1. ขั้นที่ 7: การประเมินระดับความรุนแรง (CVSS Risk Rating)
ประเมินช่องโหว่ตามเกณฑ์ Common Vulnerability Scoring System (CVSS v3.1):
- **คะแนน 0.0 - 3.9:** Low (ความรุนแรงต่ำ)
- **คะแนน 4.0 - 6.9:** Medium (ความรุนแรงปานกลาง)
- **คะแนน 7.0 - 8.9:** High (ความรุนแรงสูง)
- **คะแนน 9.0 - 10.0:** Critical (ความรุนแรงวิกฤต ต้องได้รับการแก้ไขทันที)

---

### 2. ขั้นที่ 8: โครงสร้างรายงานผลการทดสอบเจาะระบบ (Professional Pentest Report)
1. **Executive Summary (บทสรุปสำหรับผู้บริหาร):** ภาพรวมสถานะความเสี่ยงในภาษาที่ผู้บริหารเข้าใจง่าย ไม่มีศัพท์เทคนิคที่ซับซ้อน
2. **Assessment Scope & Methodology:** ขอบเขตเป้าหมาย วันที่ทำการทดสอบ และเครื่องมือที่ใช้
3. **Vulnerability Summary Matrix:** ตารางสรุปรายการช่องโหว่ พร้อมระดับความรุนแรง
4. **Detailed Technical Findings:** คำอธิบายช่องโหว่, หลักฐาน Proof of Concept (PoC) จาก Sandbox, และผลกระทบ
5. **Remediation & Action Plan:** คำแนะนำในการแก้ไขโค้ดและการตั้งค่าอย่างละเอียดเป็นรูปธรรม

> ⚠️ **คำเตือนความปลอดภัย:** เก็บรักษาข้อมูลในรายงานผลการทดสอบเป็นความลับสูงสุด`,
    labContent: `### Final Assessment Preparation Lab
ฝึกคำนวณคะแนน CVSS v3.1 สำหรับช่องโหว่ตัวอย่าง และเขียนข้อเสนอแนะในการแก้ไขโค้ดตามมาตรฐานสากล`,
    order: 18,
    status: 'PUBLISHED',
    durationMinutes: 50,
  }
];

// Generate Quizzes with 20 questions for every single lesson
export const initialQuizzes: Quiz[] = initialLessons.map((lesson) => {
  const customQ: any[] = [];
  
  if (lesson.id === 'lesson-b1-1') {
    customQ.push(
      {
        question: 'เสาหลักข้อใดใน CIA Triad ที่ทำหน้าที่รับรองว่าข้อมูลลับจะไม่ถูกเปิดเผยต่อผู้ที่ไม่ได้รับอนุญาต?',
        questionType: 'MULTIPLE_CHOICE',
        options: [
          { key: 'A', text: 'Confidentiality (การรักษาความลับ)' },
          { key: 'B', text: 'Integrity (ความถูกต้องสมบูรณ์)' },
          { key: 'C', text: 'Availability (ความพร้อมใช้งาน)' },
          { key: 'D', text: 'Non-repudiation (การห้ามปฏิเสธความรับผิดชอบ)' },
        ],
        correctAnswer: 'A',
        explanation: 'Confidentiality (การรักษาความลับ) มีหน้าที่ทำให้มั่นใจว่าข้อมูลสำคัญจะเข้าถึงได้เฉพาะผู้มีสิทธิ์เท่านั้น ผ่านการเข้ารหัสและการจำกัดสิทธิ์',
      },
      {
        question: 'มาตรการควบคุมความปลอดภัยข้อใดสนับสนุนเสาหลัก "Integrity (ความถูกต้องสมบูรณ์)" ได้ดีที่สุด?',
        questionType: 'MULTIPLE_CHOICE',
        options: [
          { key: 'A', text: 'การทำ Cryptographic Hashing (เช่น SHA-256) และ Digital Signatures' },
          { key: 'B', text: 'การติดตั้งเครื่องสำรองไฟ Uninterruptible Power Supply (UPS)' },
          { key: 'C', text: 'การติดตั้ง Load Balancer เพื่อกระจายโหลด' },
          { key: 'D', text: 'การจำกัดแบนด์วิดท์ของระบบ' },
        ],
        correctAnswer: 'A',
        explanation: 'Cryptographic Hashes และ Digital Signatures ช่วยตรวจสอบว่าข้อมูลไม่มีการถูกแก้ไขหรือดัดแปลงระหว่างทาง',
      },
      {
        question: 'ในทางความมั่นคงปลอดภัยไซเบอร์ ข้อใดจัดว่าเป็น "Asset (ทรัพย์สิน)"?',
        questionType: 'MULTIPLE_CHOICE',
        options: [
          { key: 'A', text: 'ข้อมูล ระบบ โครงสร้างพื้นฐาน บุคลากร หรืออุปกรณ์ใดๆ ที่มีมูลค่าต่อองค์กร' },
          { key: 'B', text: 'เฉพาะเครื่องคอมพิวเตอร์แบบตั้งโต๊ะเท่านั้น' },
          { key: 'C', text: 'เฉพาะหน้าเว็บเพจที่เปิดให้สาธารณะเข้าถึงได้' },
          { key: 'D', text: 'สคริปต์ที่ผู้ไม่หวังดีใช้ในการโจมตี' },
        ],
        correctAnswer: 'A',
        explanation: 'Asset ครอบคลุมข้อมูลสำคัญ ระบบโครงสร้างพื้นฐาน บุคลากร และอุปกรณ์ที่มีความสำคัญต่อการดำเนินงานขององค์กร',
      },
      {
        question: 'ข้อใดคือความแตกต่างที่สำคัญระหว่าง "Threat (ภัยคุกคาม)" และ "Vulnerability (ช่องโหว่)"?',
        questionType: 'MULTIPLE_CHOICE',
        options: [
          { key: 'A', text: 'Threat คืออันตรายหรือตัวกระทำที่อาจเกิดขึ้น ส่วน Vulnerability คือจุดอ่อนหรือข้อบกพร่องในระบบ' },
          { key: 'B', text: 'Threat คือข้อผิดพลาดในโค้ด ส่วน Vulnerability คือกลุ่มแฮกเกอร์' },
          { key: 'C', text: 'ทั้งสองคำมีความหมายเหมือนกันทุกประการ' },
          { key: 'D', text: 'Vulnerability ใช้เรียกเฉพาะจุดอ่อนบนอุปกรณ์ฮาร์ดแวร์เท่านั้น' },
        ],
        correctAnswer: 'A',
        explanation: 'Threat คือตัวกระทำหรือสถานการณ์ที่อาจสร้างความเสียหาย ส่วน Vulnerability คือจุดอ่อนที่เปิดโอกาสให้ความเสียหายนั้นเกิดขึ้น',
      },
      {
        question: 'การโจมตีในข้อใดที่มุ่งทำลายเสาหลักด้าน "Availability (ความพร้อมใช้งาน)" โดยตรง?',
        questionType: 'MULTIPLE_CHOICE',
        options: [
          { key: 'A', text: 'Distributed Denial of Service (DDoS) Attack' },
          { key: 'B', text: 'การดักฟังข้อมูลบนเครือข่าย Wi-Fi ที่ไม่มีการเข้ารหัส' },
          { key: 'C', text: 'การทำ SQL Injection เพื่อขโมยฐานข้อมูล' },
          { key: 'D', text: 'การส่ง Phishing Email เพื่อหลอกเอารหัสผ่าน' },
        ],
        correctAnswer: 'A',
        explanation: 'DDoS Attack มีเป้าหมายส่งทราฟฟิกมหาศาลเพื่อทำให้ระบบหรือเซิร์ฟเวอร์ไม่สามารถให้บริการแก่ผู้ใช้งานทั่วไปได้ ซึ่งกระทบต่อ Availability โดยตรง',
      }
    );
  }

  const questions = generateQuestionsForLesson(lesson.id, lesson.title, customQ);

  return {
    id: `quiz-${lesson.id}`,
    lessonId: lesson.id,
    title: `แบบทดสอบ: ${lesson.title}`,
    passingScore: 70, // 70% passing threshold (14/20 questions)
    status: 'PUBLISHED',
    questions: questions,
  };
});

// Interactive Labs
export const initialLabs: Lab[] = [
  {
    id: 'lab-nmap-01',
    lessonId: 'lesson-i3-1',
    title: 'Nmap Port Scanning & Service Discovery Sandbox (ปฏิบัติการสแกนพอร์ตและสำรวจบริการด้วย Nmap ในระบบจำลอง)',
    slug: 'nmap-sandbox-lab',
    objective: 'ฝึกฝนการใช้คำสั่ง Nmap ในสภาพแวดล้อม Sandbox จำลอง (127.0.0.1) เพื่อตรวจหาพอร์ตที่เปิดอยู่ ตรวจสอบเวอร์ชันของบริการ และตรวจสอบความปลอดภัยของ HTTP Headers',
    environment: 'Local Docker Container / Isolated Sandbox (127.0.0.1)',
    prerequisites: 'ความรู้คำสั่งพื้นฐานบน Terminal และความเข้าใจเกี่ยวกับหมายเลขพอร์ต TCP/IP',
    stepByStep: `1. รันคำสั่ง \`nmap -sS -p 1-1000 127.0.0.1\` เพื่อทำการสแกนแบบ Stealth SYN Scan
2. จดบันทึกพอร์ตที่เปิดอยู่ (เช่น พอร์ต 22, 80, 443, 3306)
3. รันคำสั่ง \`nmap -sV -p 80,443 127.0.0.1\` เพื่อตรวจหาเวอร์ชันซอฟต์แวร์ของเว็บเซิร์ฟเวอร์
4. รันคำสั่ง \`nmap --script http-headers 127.0.0.1\` เพื่อตรวจสอบการตั้งค่า HTTP Security Headers
5. วิเคราะห์แนวทางการป้องกันเพื่อปิดพอร์ตและบริการที่ไม่จำเป็น`,
    expectedResult: 'สามารถระบุพอร์ตที่เปิดอยู่ได้อย่างถูกต้อง ทราบเวอร์ชันของบริการ และตรวจสอบการมีอยู่ของ Security Headers (HSTS, X-Frame-Options)',
    securityExplanation: 'การสำรวจบริการช่วยให้วิศวกรความปลอดภัยทราบรายการทรัพย์สินในระบบเครือข่ายอย่างแม่นยำ และสามารถตรวจพบ Service ที่เปิดค้างไว้ก่อนผู้ไม่ประสงค์ดี',
    mitigation: 'ติดตั้งระบบ Host-based Firewall (UFW / iptables), ปิดการทำงานของ Service ที่ไม่ได้ใช้งาน และ Bind บริการภายในไว้เฉพาะที่ localhost (127.0.0.1)',
    scenarioType: 'network',
    terminalCommands: [
      {
        command: 'nmap -sS -p 1-1000 127.0.0.1',
        output: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-08 09:00 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00012s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql

Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`,
        hint: 'สังเกตว่าพอร์ต 22, 80, 443 และ 3306 เปิดให้บริการอยู่'
      },
      {
        command: 'nmap -sV -p 80,443 127.0.0.1',
        output: `PORT    STATE SERVICE  VERSION
80/tcp  open  http     nginx 1.24.0 (Ubuntu)
443/tcp open  ssl/http nginx 1.24.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
        hint: 'Version Banner ระบุว่าเป็น nginx เวอร์ชัน 1.24.0'
      },
      {
        command: 'nmap --script http-headers 127.0.0.1',
        output: `PORT   STATE SERVICE
80/tcp open  http
| http-headers: 
|   Server: nginx/1.24.0
|   Date: Tue, 08 Sep 2026 09:02:14 GMT
|   Content-Type: text/html
|   Strict-Transport-Security: max-age=31536000
|_  X-Frame-Options: SAMEORIGIN`,
        hint: 'ยอดเยี่ยม: ระบบมีการตั้งค่า HSTS และ X-Frame-Options อย่างถูกต้อง'
      }
    ]
  },
  {
    id: 'lab-sqli-01',
    lessonId: 'lesson-i1-1',
    title: 'SQL Injection Parameterization & Defense Lab (ปฏิบัติการป้องกันช่องโหว่ SQL Injection ด้วย Parameterized Queries)',
    slug: 'sqli-parameterization-lab',
    objective: 'สังเกตพฤติกรรมเมื่อคำสั่ง SQL เกิดช่องโหว่จากการนำข้อมูลมาต่อสตริง และเรียนรู้วิธีการแก้ไขโดยใช้ Prepared Statements เพื่อป้องกันการโจมตีอย่างเด็ดขาด',
    environment: 'Isolated Web Application Sandbox (OWASP Juice Shop / WebGoat simulation)',
    prerequisites: 'ความรู้พื้นฐานไวยากรณ์ SQL และความเข้าใจเกี่ยวกับ HTTP POST Request',
    stepByStep: `1. สังเกตคำสั่ง SQL ที่มีช่องโหว่: SELECT * FROM users WHERE email = '$email' AND password = '$password'
2. ทดสอบป้อน Payload: admin@local.test' OR '1'='1 ในช่องกรอกอีเมล
3. เปลี่ยนการประมวลผลมาใช้ Prepared Statements: db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").bind(email, password)
4. ยืนยันว่า Payload จะถูกมองเป็นข้อความสตริงธรรมดา และไม่สามารถแก้โครงสร้างคำสั่งได้อีกต่อไป`,
    expectedResult: 'การโจมตีด้วย SQLi ไร้ผลเมื่อใช้ Prepared Statements โดยระบบไม่ส่งข้อมูลที่ไม่ได้รับอนุญาตกลับมา',
    securityExplanation: 'Prepared Statements ทำการแยกคำสั่ง SQL ออกจากข้อมูลของผู้ใช้อย่างสมบูรณ์ ทำให้ User Input ไม่สามารถเปลี่ยนแปลง Execution Tree ของฐานข้อมูลได้',
    mitigation: 'ใช้ ORM หรือ Parameterized Queries เสมอ กำหนด Schema ตรวจสอบข้อมูลนำเข้า และจำกัดสิทธิ์ผู้ใช้ฐานข้อมูลตามหลัก Least Privilege',
    scenarioType: 'web',
    terminalCommands: [
      {
        command: 'test-sqli --mode vulnerable --input "admin@test.local\' OR \'1\'=\'1"',
        output: `[VULNERABLE ENGINE EXECUTION - จำลองระบบที่มีช่องโหว่]
Executed SQL: SELECT * FROM users WHERE email = 'admin@test.local' OR '1'='1' AND password = 'xxx'
ผลการทำงาน: Query logic ถูกเปลี่ยนแปลง!
ผลลัพธ์: ข้ามการตรวจสอบสิทธิ์สำเร็จ! ข้อมูลถูกดึงออกมา 10 แถว (พบช่องโหว่ร้ายแรง)`,
        hint: 'การต่อสตริงเปิดโอกาสให้ใส่คำสั่ง OR 1=1 เพื่อบายพาสการล็อกอิน'
      },
      {
        command: 'test-sqli --mode prepared --input "admin@test.local\' OR \'1\'=\'1"',
        output: `[SECURE PREPARED STATEMENT EXECUTION - ระบบที่ใช้ Prepared Statements]
Bound Parameter 1: "admin@test.local' OR '1'='1"
Executed SQL: SELECT * FROM users WHERE email = ? AND password = ?
ผลลัพธ์: 0 records found. ไม่พบผู้ใช้ (ป้องกันการโจมตีสำเร็จ 100%)`,
        hint: 'ข้อมูลถูกมองเป็นสตริงปกติ ไวยากรณ์ของฐานข้อมูลไม่ถูกแก้ไข'
      }
    ]
  },
  {
    id: 'lab-burp-01',
    lessonId: 'lesson-i3-2',
    title: 'HTTP Request Interception & Header Hardening Lab (ปฏิบัติการดักจับคำขอ HTTP และการเสริมแกร่ง Security Headers)',
    slug: 'burp-suite-interception-lab',
    objective: 'จำลองการดักจับคำขอด้วย Burp Suite Proxy ตรวจสอบข้อมูลดิบใน Header และแอตทริบิวต์ของ Cookie พร้อมตั้งค่า HttpOnly, Secure, SameSite',
    environment: 'Local Sandbox HTTP Proxy',
    prerequisites: 'เข้าใจการทำงานของ HTTP Methods (GET, POST) และโครงสร้าง Headers',
    stepByStep: `1. ดักจับคำขอ POST /api/auth/login ที่ส่งออกจากเบราว์เซอร์
2. ตรวจสอบ Cookie Headers และพบว่าขาด Flag ความปลอดภัย HttpOnly และ Secure
3. ปรับแต่ง Response Header ให้มี HttpOnly, Secure และ SameSite=Strict
4. ยืนยันว่า Session Token ได้รับการปกป้องจากการถูกสคริปต์ XSS ขโมย`,
    expectedResult: 'Cookie ของเซสชันได้รับการล็อกความปลอดภัยอย่างสมบูรณ์ ป้องกันการขโมย Token',
    securityExplanation: 'การดักจับข้อมูลช่วยให้ผู้ตรวจสอบความปลอดภัยมองเห็นข้อมูลที่ส่งออกจากไคลเอนต์ได้อย่างชัดเจนและตรวจพบช่องโหว่ในระดับโปรโตคอล',
    mitigation: 'กำหนดค่า HttpOnly, Secure, SameSite=Strict ให้กับคุกกี้ที่เกี่ยวข้องกับการยืนยันตัวตนทุกตัว',
    scenarioType: 'pentest',
    terminalCommands: [
      {
        command: 'intercept-http --target /api/session',
        output: `[CAPTURED HTTP RESPONSE - ดักจับ Response]
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session_token=c8f8b89e7123; Path=/

⚠️ คำเตือนความปลอดภัย: Cookie ขาดแอตทริบิวต์ HttpOnly, Secure, และ SameSite!`,
        hint: 'Cookie ขาด Flag ความปลอดภัย ทำให้เสี่ยงต่อการถูกขโมยผ่าน XSS'
      },
      {
        command: 'apply-security-headers --cookie-flags "HttpOnly; Secure; SameSite=Strict"',
        output: `[HARDENED HTTP RESPONSE - เสริมความปลอดภัยเรียบร้อย]
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session_token=c8f8b89e7123; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains

✅ สำเร็จ: เซสชันคุกกี้ได้รับการเสริมความปลอดภัย ป้องกัน XSS Exfiltration และ CSRF ได้อย่างสมบูรณ์`,
        hint: 'เพิ่ม HttpOnly, Secure, และ SameSite ป้องกันอย่างครบถ้วน'
      }
    ]
  }
];

// Final Security Project
export const initialFinalProject: FinalProject = {
  id: 'final-proj-01',
  title: 'Comprehensive Security Assessment & Penetration Test Report (รายงานผลการประเมินความปลอดภัยและการทดสอบเจาะระบบ)',
  description: 'ดำเนินการประเมินความปลอดภัยเชิงจริยธรรมบนระบบเป้าหมายจำลองที่ได้รับอนุญาต (OWASP Juice Shop / Local Docker Sandbox) รวบรวมรายการทรัพย์สิน ดำเนินการสแกนความปลอดภัย วิเคราะห์ช่องโหว่ ประเมินระดับความเสี่ยงตามมาตรฐาน CVSS และจัดทำรายงานผลการทดสอบ (Executive & Technical Pentest Report) ฉบับสมบูรณ์',
  scope: 'Authorized Local Target: 127.0.0.1:3000 / Local Docker Sandbox (ห้ามทำการทดสอบบนระบบภายนอกที่ไม่ได้รับอนุญาตโดยเด็ดขาด)',
  instructions: `เพื่อผ่านการประเมินและรับใบรับรองประกาศนียบัตร (Certificate of Cyber Security) ให้ส่งรายงานการประเมินความปลอดภัยที่มีเนื้อหาครอบคลุม:
1. **Scope & Rules of Engagement (ขอบเขตและข้อตกลง):** ระบุเป้าหมาย ขอบเขตที่ได้รับอนุญาต และเงื่อนไขการทดสอบอย่างชัดเจน
2. **Threat Modeling (การวิเคราะห์ภัยคุกคาม):** ระบุประเภทผู้คุกคามและรูปแบบการโจมตีที่เป็นไปได้ตามกรอบ STRIDE
3. **Security Testing Execution (การดำเนินการทดสอบ):** อธิบายขั้นตอนการสแกนพอร์ต, การทดสอบเว็บแอปพลิเคชัน และการวิเคราะห์ Header
4. **Vulnerability Findings & Evidence (รายการช่องโหว่และหลักฐาน):** บันทึกช่องโหว่ที่ค้นพบอย่างน้อย 3 รายการ พร้อมขั้นตอนและหลักฐานใน Sandbox
5. **Risk Rating (CVSS Scoring):** คำนวณระดับความรุนแรงและคะแนน CVSS v3.1 สำหรับแต่ละช่องโหว่
6. **Remediation & Defense Guidance (แนวทางการแก้ไขและป้องกัน):** ระบุโค้ดตัวอย่างการแก้ไขและคำแนะนำเชิงสถาปัตยกรรมที่ถูกต้อง
7. **Executive Summary & Report Structure:** จัดทำบทสรุปสำหรับผู้บริหารและรายงานเทคนิคที่มีรูปแบบชัดเจนเป็นมืออาชีพ`,
  rubric: [
    { category: 'Scope & Rules of Engagement (ขอบเขตและข้อตกลงทางกฎหมาย)', maxPoints: 10, description: 'ความชัดเจนของขอบเขตเป้าหมายจำลอง Sandbox และกฎระเบียบการทดสอบ' },
    { category: 'Methodology & Structured Approach (ระเบียบวิธีและขั้นตอนมาตรฐาน)', maxPoints: 15, description: 'การปฏิบัติตามขั้นตอนการทดสอบเจาะระบบเชิงจริยธรรม 8 ขั้นตอน' },
    { category: 'Security Analysis & Threat Modeling (การวิเคราะห์ภัยคุกคาม)', maxPoints: 20, description: 'ความลึกซึ้งในการระบุทรัพย์สินและประเมินภาพรวมความเสี่ยง' },
    { category: 'Findings & Technical Evidence (รายการช่องโหว่และหลักฐานเชิงประจักษ์)', maxPoints: 20, description: 'ความถูกต้องในการระบุช่องโหว่พร้อมขั้นตอนการทดสอบใน Sandbox ที่ชัดเจน' },
    { category: 'Risk Assessment & CVSS Scoring (การประเมินความรุนแรง CVSS)', maxPoints: 10, description: 'การคำนวณระดับความเสี่ยงตามหลักเกณฑ์ความเป็นไปได้และผลกระทบ' },
    { category: 'Mitigation & Defense Guidance (แนวทางการแก้ไขโค้ดและการป้องกัน)', maxPoints: 15, description: 'คำแนะนำการแก้ไขโค้ดและสถาปัตยกรรมที่มีคุณภาพ ปฏิบัติได้จริง' },
    { category: 'Report Quality & Executive Clarity (คุณภาพรายงานและบทสรุปผู้บริหาร)', maxPoints: 10, description: 'ความน่าเชื่อถือ ความเป็นมืออาชีพ และความเข้าใจง่ายของบทสรุปผู้บริหาร' },
  ],
  passingScore: 70, // Total 100 points, 70 required to pass
};

// 10 Platform Achievements
export const initialAchievements: Achievement[] = [
  {
    id: 'ach-01',
    code: 'FIRST_LESSON',
    title: 'First Step into Cyber Security (ก้าวแรกสู่โลกความปลอดภัยไซเบอร์)',
    description: 'เรียนจบบทเรียนความมั่นคงปลอดภัยบทแรกสำเร็จ',
    icon: 'BookOpen',
    criteria: 'เรียนจบ 1 บทเรียน',
  },
  {
    id: 'ach-02',
    code: 'FIRST_QUIZ',
    title: 'Knowledge Verified (ผ่านการทดสอบความรู้)',
    description: 'ผ่านแบบทดสอบ 20 ข้อบทแรกด้วยคะแนน ≥70%',
    icon: 'Award',
    criteria: 'สอบผ่าน 1 แบบทดสอบ',
  },
  {
    id: 'ach-03',
    code: 'QUIZ_MASTER',
    title: 'Quiz Master (ผู้เชี่ยวชาญแบบทดสอบ)',
    description: 'ทำคะแนนแบบทดสอบได้เต็ม 100% (20/20 ข้อ) ในบทเรียนใดก็ได้',
    icon: 'Zap',
    criteria: 'สอบได้คะแนน 100%',
  },
  {
    id: 'ach-04',
    code: 'LAB_BEGINNER',
    title: 'Sandbox Explorer (นักสำรวจระบบจำลอง)',
    description: 'ทำแล็บปฏิบัติการด้านความปลอดภัยสำเร็จเป็นครั้งแรก',
    icon: 'Terminal',
    criteria: 'ผ่าน 1 แล็บปฏิบัติการ',
  },
  {
    id: 'ach-05',
    code: 'SECURITY_EXPLORER',
    title: 'Security Explorer (นักเรียนรู้ความปลอดภัยรอบด้าน)',
    description: 'เรียนจบบทเรียนครบ 5 บทเรียนบนแพลตฟอร์ม',
    icon: 'Compass',
    criteria: 'เรียนจบ 5 บทเรียน',
  },
  {
    id: 'ach-06',
    code: 'BASIC_COMPLETED',
    title: 'Basic Security Practitioner (ผู้เชี่ยวชาญระดับพื้นฐาน)',
    description: 'เรียนจบและสอบผ่านทุกบทเรียนใน Level 1: Basic',
    icon: 'Shield',
    criteria: 'สำเร็จ Level 1',
  },
  {
    id: 'ach-07',
    code: 'INTERMEDIATE_COMPLETED',
    title: 'Intermediate Security Defender (นักป้องกันความปลอดภัยระดับกลาง)',
    description: 'เรียนจบและสอบผ่านทุกบทเรียนใน Level 2: Intermediate',
    icon: 'Lock',
    criteria: 'สำเร็จ Level 2',
  },
  {
    id: 'ach-08',
    code: 'ADVANCED_COMPLETED',
    title: 'Advanced Cyber Architect (สถาปนิกความปลอดภัยไซเบอร์ขั้นสูง)',
    description: 'เรียนจบและสอบผ่านทุกบทเรียนใน Level 3: Advanced',
    icon: 'Cpu',
    criteria: 'สำเร็จ Level 3',
  },
  {
    id: 'ach-09',
    code: 'FINAL_PROJECT_COMPLETED',
    title: 'Security Assessor (ผู้ประเมินความปลอดภัยมืออาชีพ)',
    description: 'ส่งรายงาน Final Security Project และสอบผ่านด้วยคะแนน ≥70 คะแนน',
    icon: 'FileCheck',
    criteria: 'ผ่าน Final Project',
  },
  {
    id: 'ach-10',
    code: 'CERTIFIED_SECURITY_LEARNER',
    title: 'Certified Security Professional (ผู้ได้รับประกาศนียบัตรวิชาชีพ)',
    description: 'สำเร็จการศึกษาหลักสูตรครบถ้วนและได้รับใบประกาศนียบัตรรับรองอย่างเป็นทางการ',
    icon: 'CheckCircle2',
    criteria: 'ได้รับใบประกาศนียบัตร',
  }
];
