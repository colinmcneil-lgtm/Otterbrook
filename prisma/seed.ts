import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.candidateOnMandate.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.mandate.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@otterbrook.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin:", admin.email);

  // Create TechCorp
  const techCorp = await prisma.company.create({
    data: {
      name: "TechCorp",
      website: "https://techcorp.example.com",
    },
  });

  const techCorpClientPassword = await bcrypt.hash("client123", 10);
  const techCorpClient = await prisma.user.create({
    data: {
      email: "client@techcorp.com",
      password: techCorpClientPassword,
      name: "TechCorp Client",
      role: "CLIENT",
      companyId: techCorp.id,
    },
  });
  console.log("✅ Created TechCorp client:", techCorpClient.email);

  // Create GrowthCo
  const growthCo = await prisma.company.create({
    data: {
      name: "GrowthCo",
      website: "https://growthco.example.com",
    },
  });

  const growthCoClientPassword = await bcrypt.hash("client123", 10);
  const growthCoClient = await prisma.user.create({
    data: {
      email: "client@growthco.com",
      password: growthCoClientPassword,
      name: "GrowthCo Client",
      role: "CLIENT",
      companyId: growthCo.id,
    },
  });
  console.log("✅ Created GrowthCo client:", growthCoClient.email);

  // Create TechCorp mandates
  const tcMandate1 = await prisma.mandate.create({
    data: {
      title: "Senior Software Engineer",
      description:
        "We are looking for a Senior Software Engineer to join our core platform team. You will be responsible for designing and building scalable backend systems that power our products. Strong experience with distributed systems and cloud infrastructure required.",
      location: "London, UK (Hybrid)",
      salaryRange: "£90,000 – £120,000",
      status: "OPEN",
      companyId: techCorp.id,
    },
  });

  const tcMandate2 = await prisma.mandate.create({
    data: {
      title: "Product Manager",
      description:
        "Seeking an experienced Product Manager to lead our consumer-facing product roadmap. You will work closely with engineering, design, and commercial teams to define and deliver features that delight users and drive business growth.",
      location: "London, UK (On-site)",
      salaryRange: "£75,000 – £95,000",
      status: "OPEN",
      companyId: techCorp.id,
    },
  });

  const tcMandate3 = await prisma.mandate.create({
    data: {
      title: "Head of Data Science",
      description:
        "We are hiring a Head of Data Science to build and lead our data science function. You will shape our ML strategy, manage a growing team, and partner with product and engineering to embed data-driven decision making across the business.",
      location: "Remote (UK)",
      salaryRange: "£110,000 – £140,000",
      status: "ON_HOLD",
      companyId: techCorp.id,
    },
  });

  console.log("✅ Created TechCorp mandates");

  // Create GrowthCo mandates
  const gcMandate1 = await prisma.mandate.create({
    data: {
      title: "VP of Sales",
      description:
        "GrowthCo is looking for a VP of Sales to own and scale our revenue function. You will build and manage a high-performing sales team, own the full sales cycle from pipeline generation to close, and work closely with the CEO on go-to-market strategy.",
      location: "New York, NY (Hybrid)",
      salaryRange: "$180,000 – $220,000 + Commission",
      status: "OPEN",
      companyId: growthCo.id,
    },
  });

  const gcMandate2 = await prisma.mandate.create({
    data: {
      title: "Marketing Director",
      description:
        "We are seeking a Marketing Director to lead our brand, demand generation, and content strategy. You will own the marketing budget, manage a team of 5, and drive top-of-funnel growth across digital channels.",
      location: "New York, NY (On-site)",
      salaryRange: "$130,000 – $160,000",
      status: "OPEN",
      companyId: growthCo.id,
    },
  });

  const gcMandate3 = await prisma.mandate.create({
    data: {
      title: "Finance Manager",
      description:
        "GrowthCo is hiring a Finance Manager to oversee financial planning, reporting, and analysis. You will support the CFO in strategic financial decisions, manage month-end close, and lead the annual budgeting process.",
      location: "New York, NY (Hybrid)",
      salaryRange: "$100,000 – $125,000",
      status: "CLOSED",
      companyId: growthCo.id,
    },
  });

  console.log("✅ Created GrowthCo mandates");

  // Create candidates
  const candidate1 = await prisma.candidate.create({
    data: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      linkedinUrl: "https://linkedin.com/in/alice-johnson",
      notes: "Strong background in distributed systems, 8 years experience at FAANG companies.",
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      linkedinUrl: "https://linkedin.com/in/bob-smith",
      notes: "Product leader with SaaS and consumer app experience. Previously at Monzo and Revolut.",
    },
  });

  const candidate3 = await prisma.candidate.create({
    data: {
      name: "Clara Williams",
      email: "clara.williams@example.com",
      linkedinUrl: "https://linkedin.com/in/clara-williams",
      notes: "Enterprise sales leader, consistently exceeded quota. Built teams from 3 to 25 reps.",
    },
  });

  const candidate4 = await prisma.candidate.create({
    data: {
      name: "David Chen",
      email: "david.chen@example.com",
      linkedinUrl: "https://linkedin.com/in/david-chen",
      notes: "Full-stack engineer with deep expertise in React and Node.js. Open source contributor.",
    },
  });

  const candidate5 = await prisma.candidate.create({
    data: {
      name: "Eva Martinez",
      email: "eva.martinez@example.com",
      linkedinUrl: "https://linkedin.com/in/eva-martinez",
      notes: "B2B marketing expert. Led demand gen at two Series B startups. Strong data-driven approach.",
    },
  });

  console.log("✅ Created candidates");

  // Assign candidates to mandates with various stages
  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate1.id,
      mandateId: tcMandate1.id,
      stage: "CLIENT_INTERVIEW",
      notes: "Excellent technical round. Client very positive. Final interview scheduled for next week.",
    },
  });

  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate4.id,
      mandateId: tcMandate1.id,
      stage: "SUBMITTED",
      notes: "CV submitted to client. Awaiting feedback.",
    },
  });

  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate2.id,
      mandateId: tcMandate2.id,
      stage: "OFFER",
      notes: "Offer extended at £88,000. Candidate considering. Response expected by Friday.",
    },
  });

  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate3.id,
      mandateId: gcMandate1.id,
      stage: "PLACED",
      notes: "Accepted offer. Start date: 1st of next month. Great placement!",
    },
  });

  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate5.id,
      mandateId: gcMandate2.id,
      stage: "SCREENING",
      notes: "First call done. Strong fit on experience. Moving to competency interview.",
    },
  });

  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate1.id,
      mandateId: gcMandate1.id,
      stage: "REJECTED",
      notes: "Client felt background was too technical for a sales leadership role.",
    },
  });

  await prisma.candidateOnMandate.create({
    data: {
      candidateId: candidate4.id,
      mandateId: tcMandate3.id,
      stage: "SOURCED",
      notes: "Identified via LinkedIn. Strong ML background. Will reach out next week.",
    },
  });

  console.log("✅ Assigned candidates to mandates");
  console.log("\n🎉 Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Admin: admin@otterbrook.com / admin123");
  console.log("  TechCorp: client@techcorp.com / client123");
  console.log("  GrowthCo: client@growthco.com / client123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
