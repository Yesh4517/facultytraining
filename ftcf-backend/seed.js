/**
 * Seed script — populates MongoDB with all FTCF mock data.
 * Run:  node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dotenv.config();

// Force Google DNS to fix SRV lookup failures on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User         = require('./models/User');
const Training     = require('./models/Training');
const Registration = require('./models/Registration');
const Certificate  = require('./models/Certificate');
const CreditHistory = require('./models/CreditHistory');
const Attendance   = require('./models/Attendance');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // ── Clear existing data ──────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Training.deleteMany({}),
    Registration.deleteMany({}),
    Certificate.deleteMany({}),
    CreditHistory.deleteMany({}),
    Attendance.deleteMany({}),
  ]);
  console.log('🗑   Cleared existing data');

  // ── Users ────────────────────────────────────────────────────────────────
  const usersRaw = [
    { name: 'Dr. Nitish Pradhan', email: 'nitish.pradhan@lnmiit.ac.in', password: 'faculty123', role: 'faculty', department: 'Computer Science', designation: 'Associate Professor', avatar: 'NP', totalCredits: 42, requiredCredits: 40 },
    { name: 'Dr. Rajbir Kaur',    email: 'rajbir.kaur@lnmiit.ac.in',    password: 'coordinator123', role: 'coordinator', department: 'Computer Science', designation: 'Department Coordinator', avatar: 'RK', totalCredits: 55, requiredCredits: 40 },
    { name: 'Mohan Kumar',        email: 'mohan.kumar@lnmiit.ac.in',    password: 'admin123', role: 'admin', department: 'Administration', designation: 'Training Administrator', avatar: 'MK', totalCredits: 60, requiredCredits: 40 },
    { name: 'Dr. Fatima Ali',     email: 'fatima.ali@lnmiit.ac.in',     password: 'faculty123', role: 'faculty', department: 'Mathematics', designation: 'Assistant Professor', avatar: 'FA', totalCredits: 28, requiredCredits: 40 },
    { name: 'Dr. Kamran Iqbal',   email: 'kamran.iqbal@lnmiit.ac.in',   password: 'faculty123', role: 'faculty', department: 'Electrical Engineering', designation: 'Professor', avatar: 'KI', totalCredits: 51, requiredCredits: 40 },
    { name: 'Dr. Priya Sharma',   email: 'priya.sharma@lnmiit.ac.in',   password: 'faculty123', role: 'faculty', department: 'Physics', designation: 'Associate Professor', avatar: 'PS', totalCredits: 33, requiredCredits: 40 },
    { name: 'Dr. Rahul Mehra',    email: 'rahul.mehra@lnmiit.ac.in',    password: 'faculty123', role: 'faculty', department: 'Mechanical Engineering', designation: 'Assistant Professor', avatar: 'RM', totalCredits: 19, requiredCredits: 40 },
    { name: 'Dr. Sana Zafar',     email: 'sana.zafar@lnmiit.ac.in',     password: 'faculty123', role: 'faculty', department: 'Chemistry', designation: 'Lecturer', avatar: 'SZ', totalCredits: 44, requiredCredits: 40 },
  ];

  // Use create() so the pre-save hook hashes passwords
  const users = await Promise.all(usersRaw.map(u => User.create(u)));
  const userMap = {};
  users.forEach((u) => { userMap[u.email] = u; });
  console.log(`👤  Seeded ${users.length} users`);

  const faculty1 = userMap['nitish.pradhan@lnmiit.ac.in'];
  const faculty4 = userMap['fatima.ali@lnmiit.ac.in'];
  const faculty5 = userMap['kamran.iqbal@lnmiit.ac.in'];
  const coordinator = userMap['rajbir.kaur@lnmiit.ac.in'];
  const admin = userMap['mohan.kumar@lnmiit.ac.in'];

  // ── Trainings ────────────────────────────────────────────────────────────
  const trainingsRaw = [
    { title: 'Advanced Machine Learning Techniques', category: 'Technical', provider: 'Coursera', credits: 8, duration: '6 weeks', mode: 'Online', startDate: '2026-11-01', endDate: '2026-12-15', seats: 30, enrolled: 18, status: 'Open', description: 'Deep dive into advanced ML algorithms including ensemble methods, neural architectures, and model optimization.', image: 'ML', createdBy: coordinator._id },
    { title: 'Pedagogy & Active Learning Strategies', category: 'Teaching', provider: 'HEC Pakistan', credits: 6, duration: '3 days', mode: 'On-Campus', startDate: '2026-11-10', endDate: '2026-11-12', seats: 25, enrolled: 25, status: 'Full', description: 'Workshop focused on modern teaching methodologies, classroom engagement, and outcome-based education.', image: 'PA', createdBy: coordinator._id },
    { title: 'Research Proposal Writing & Grant Acquisition', category: 'Research', provider: 'PASTIC', credits: 5, duration: '2 days', mode: 'Hybrid', startDate: '2026-11-20', endDate: '2026-11-21', seats: 20, enrolled: 12, status: 'Open', description: 'Comprehensive guide to writing competitive research proposals and securing national/international grants.', image: 'RG', createdBy: coordinator._id },
    { title: 'Data Science with Python & R', category: 'Technical', provider: 'edX', credits: 10, duration: '8 weeks', mode: 'Online', startDate: '2026-12-01', endDate: '2027-01-26', seats: 50, enrolled: 31, status: 'Open', description: 'Industry-aligned data science curriculum covering pandas, scikit-learn, ggplot2, and real-world case studies.', image: 'DS', createdBy: coordinator._id },
    { title: 'Academic Leadership & Management', category: 'Leadership', provider: 'British Council', credits: 7, duration: '5 days', mode: 'On-Campus', startDate: '2026-12-08', endDate: '2026-12-12', seats: 15, enrolled: 9, status: 'Open', description: 'Leadership skills for heads of department, program managers, and aspiring academic administrators.', image: 'AL', createdBy: coordinator._id },
    { title: 'Cybersecurity Fundamentals & Ethical Hacking', category: 'Technical', provider: 'CompTIA', credits: 9, duration: '4 weeks', mode: 'Online', startDate: '2026-11-15', endDate: '2026-12-13', seats: 40, enrolled: 37, status: 'Open', description: 'Hands-on cybersecurity training covering network defense, penetration testing, and OWASP Top 10.', image: 'CY', createdBy: coordinator._id },
    { title: 'Curriculum Design & OBE', category: 'Teaching', provider: 'HEC Pakistan', credits: 5, duration: '2 days', mode: 'On-Campus', startDate: '2027-01-05', endDate: '2027-01-06', seats: 30, enrolled: 7, status: 'Open', description: 'Outcome-based education framework, curriculum mapping, and assessment alignment techniques.', image: 'CD', createdBy: coordinator._id },
    { title: 'Cloud Computing with AWS', category: 'Technical', provider: 'AWS Training', credits: 12, duration: '10 weeks', mode: 'Online', startDate: '2027-01-10', endDate: '2027-03-21', seats: 35, enrolled: 14, status: 'Open', description: 'Comprehensive AWS solutions architect course covering EC2, S3, RDS, Lambda, and cloud architecture.', image: 'CC', createdBy: coordinator._id },
  ];

  const trainings = await Training.insertMany(trainingsRaw);
  const tMap = {};
  trainings.forEach((t) => { tMap[t.title] = t; });
  console.log(`📚  Seeded ${trainings.length} trainings`);

  // ── Registrations ────────────────────────────────────────────────────────
  const regsRaw = [
    { faculty: faculty1._id, training: tMap['Advanced Machine Learning Techniques']._id, credits: 8, status: 'Approved', registrationDate: '2026-10-05', supervisorName: 'Dr. Rajbir Kaur', justification: 'Need ML skills for research project' },
    { faculty: faculty1._id, training: tMap['Research Proposal Writing & Grant Acquisition']._id, credits: 5, status: 'Pending', registrationDate: '2026-10-08' },
    { faculty: faculty1._id, training: tMap['Cybersecurity Fundamentals & Ethical Hacking']._id, credits: 9, status: 'Completed', registrationDate: '2026-09-15', completionDate: '2026-10-13' },
    { faculty: faculty4._id, training: tMap['Data Science with Python & R']._id, credits: 10, status: 'Approved', registrationDate: '2026-10-10' },
    { faculty: faculty5._id, training: tMap['Academic Leadership & Management']._id, credits: 7, status: 'Pending', registrationDate: '2026-10-12' },
  ];

  const registrations = await Registration.insertMany(regsRaw);
  console.log(`📋  Seeded ${registrations.length} registrations`);

  // ── Certificates ─────────────────────────────────────────────────────────
  const certsRaw = [
    { faculty: faculty1._id, trainingTitle: 'Deep Learning Specialization', provider: 'Coursera / DeepLearning.AI', completionDate: '2026-08-20', credits: 10, category: 'Technical', fileName: 'DL_Cert_Nitish.pdf', status: 'Verified', verifiedBy: coordinator._id, verifiedDate: '2026-08-25' },
    { faculty: faculty1._id, trainingTitle: 'Effective Teaching in HE', provider: 'HEC Pakistan', completionDate: '2026-06-15', credits: 6, category: 'Teaching', fileName: 'Teaching_Cert_Nitish.pdf', status: 'Verified', verifiedBy: coordinator._id, verifiedDate: '2026-06-20' },
    { faculty: faculty1._id, trainingTitle: 'Python for Data Analysis', provider: 'DataCamp', completionDate: '2026-09-10', credits: 4, category: 'Technical', fileName: 'Python_DA_Nitish.pdf', status: 'Pending' },
    { faculty: faculty4._id, trainingTitle: 'Statistical Modelling with R', provider: 'Coursera', completionDate: '2026-07-30', credits: 7, category: 'Technical', fileName: 'Stats_R_Fatima.pdf', status: 'Pending' },
    { faculty: faculty5._id, trainingTitle: 'IoT & Embedded Systems Workshop', provider: 'IEEE', completionDate: '2026-09-25', credits: 8, category: 'Technical', fileName: 'IoT_Kamran.pdf', status: 'Rejected', verifiedBy: coordinator._id, verifiedDate: '2026-09-30', rejectionReason: 'Certificate not from an accredited provider.' },
    { faculty: coordinator._id, trainingTitle: 'Academic Leadership Programme', provider: 'British Council', completionDate: '2026-05-10', credits: 12, category: 'Leadership', fileName: 'Leadership_Rajbir.pdf', status: 'Verified', verifiedBy: admin._id, verifiedDate: '2026-05-14' },
  ];

  await Certificate.insertMany(certsRaw);
  console.log(`📜  Seeded ${certsRaw.length} certificates`);

  // ── Credit History ────────────────────────────────────────────────────────
  const creditsRaw = [
    { faculty: faculty1._id, activity: 'Deep Learning Specialization', type: 'Certification', category: 'Technical', credits: 10, date: '2026-08-25', status: 'Approved', period: 'Fall 2026', source: 'Certificate' },
    { faculty: faculty1._id, activity: 'Effective Teaching in HE', type: 'Certification', category: 'Teaching', credits: 6, date: '2026-06-20', status: 'Approved', period: 'Spring 2026', source: 'Certificate' },
    { faculty: faculty1._id, activity: 'Cybersecurity Fundamentals & Ethical Hacking', type: 'Training Programme', category: 'Technical', credits: 9, date: '2026-10-13', status: 'Approved', period: 'Fall 2026', source: 'Registration' },
    { faculty: faculty1._id, activity: 'Research Methodologies Workshop', type: 'Workshop', category: 'Research', credits: 4, date: '2026-04-05', status: 'Approved', period: 'Spring 2026', source: 'Manual' },
    { faculty: faculty1._id, activity: 'International Conference Paper Presentation', type: 'Conference', category: 'Research', credits: 8, date: '2026-07-18', status: 'Approved', period: 'Summer 2026', source: 'Manual' },
    { faculty: faculty1._id, activity: 'Python for Data Analysis', type: 'Certification', category: 'Technical', credits: 4, date: '2026-09-12', status: 'Pending', period: 'Fall 2026', source: 'Certificate' },
    { faculty: faculty4._id, activity: 'Statistical Modelling with R', type: 'Certification', category: 'Technical', credits: 7, date: '2026-08-01', status: 'Pending', period: 'Fall 2026', source: 'Certificate' },
    { faculty: faculty5._id, activity: 'IoT Workshop IEEE', type: 'Workshop', category: 'Technical', credits: 8, date: '2026-09-25', status: 'Rejected', period: 'Fall 2026', source: 'Certificate' },
  ];

  await CreditHistory.insertMany(creditsRaw);
  console.log(`💳  Seeded ${creditsRaw.length} credit history entries`);

  console.log('\n🎉  Seeding complete!\n');
  console.log('Demo login credentials:');
  console.log('  Faculty:     nitish.pradhan@lnmiit.ac.in  /  faculty123');
  console.log('  Coordinator: rajbir.kaur@lnmiit.ac.in     /  coordinator123');
  console.log('  Admin:       mohan.kumar@lnmiit.ac.in     /  admin123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed error:', err);
  process.exit(1);
});
