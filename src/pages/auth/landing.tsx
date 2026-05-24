
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from '../../assets/1777297540099.png'
import {
  Users,
  CreditCard,
  CalendarDays,
  TrendingUp,
  Receipt,
  Briefcase,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Clock,
  BarChart3,
  Bell,
  Lock,
  Layers,
  HeartHandshake,
  Star,
  ChevronRight,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import { Spinner } from "../../components/ui/spinner";

const features = [
  {
    icon: Users,
    label: "Employee Management",
    desc: "Centralize your entire workforce — profiles, org charts, documents, and contracts — all in one place.",
    highlights: ["Custom fields & departments", "Document storage", "Org chart view"],
  },
  {
    icon: CalendarDays,
    label: "Leave & Attendance",
    desc: "Streamline leave requests, multi-level approvals, and balance tracking across your organization.",
    highlights: ["Multi-type leave policies", "Team calendar view", "Auto-balance accrual"],
  },
  {
    icon: CreditCard,
    label: "Payroll Processing",
    desc: "Run accurate, automated payroll in minutes. Generate payslips and export directly to your accounting tool.",
    highlights: ["Automated tax calculations", "Payslip generation", "Multi-currency support"],
  },
  {
    icon: TrendingUp,
    label: "Performance Reviews",
    desc: "Drive growth with 360° feedback, goal tracking, and competency-based reviews.",
    highlights: ["360° peer reviews", "OKR / goal tracking", "Competency matrices"],
  },
  {
    icon: Receipt,
    label: "Expense Claims",
    desc: "Employees submit, managers approve, finance reimburses — all in one streamlined workflow.",
    highlights: ["Receipt uploads", "Policy enforcement", "Bulk approvals"],
  },
  {
    icon: Briefcase,
    label: "Recruitment Pipeline",
    desc: "Post jobs, track candidates through stages, schedule interviews, and send offers.",
    highlights: ["Kanban pipeline view", "Interview scheduling", "Offer letter generation"],
  },
  {
    icon: ClipboardList,
    label: "Onboarding",
    desc: "Make every new hire's first day unforgettable with structured task checklists and automated workflows.",
    highlights: ["Task checklists", "Auto-assign by role", "Progress tracking"],
  },
  {
    icon: BarChart3,
    label: "Analytics & Reporting",
    desc: "Real-time insights across headcount, turnover, payroll costs, and workforce trends.",
    highlights: ["Custom report builder", "Exportable dashboards", "Trend analysis"],
  },
];

const stats = [
  { value: "10k+", label: "Employees Managed" },
  { value: "98%", label: "Payroll Accuracy" },
  { value: "3×", label: "Faster Approvals" },
  { value: "50+", label: "Integrations" },
];

const howItWorks = [
  {
    step: "01",
    icon: UserCheck,
    title: "Set up your workspace",
    desc: "Import your existing employees, configure departments, and define your leave policies in under 30 minutes.",
  },
  {
    step: "02",
    icon: Layers,
    title: "Configure your workflows",
    desc: "Customize approval chains, payroll schedules, performance cycles, and expense policies to fit your company.",
  },
  {
    step: "03",
    icon: Bell,
    title: "Automate the routine",
    desc: "Let ZucoHR handle notifications, reminders, and recurring tasks so your team can focus on what matters.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Measure & improve",
    desc: "Get real-time analytics on workforce health, costs, and engagement to make smarter people decisions.",
  },
];

const testimonials = [
  {
    quote: "ZucoHR cut our monthly payroll processing time from 2 days to 3 hours. Absolute game changer for our team.",
    name: "Sarah Mitchell",
    role: "Head of People, Nexora",
    rating: 5,
  },
  {
    quote: "The leave management module alone saved us endless back-and-forth emails. Our managers love the calendar view.",
    name: "James Osei",
    role: "HR Director, Brightfield Group",
    rating: 5,
  },
  {
    quote: "Finally, an HR platform that doesn't feel like it was built in 2005. Clean, fast, and our employees actually use it.",
    name: "Priya Sharma",
    role: "COO, Luminary Studios",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$4",
    per: "per employee / month",
    desc: "Perfect for small teams getting started.",
    features: ["Up to 50 employees", "Employee profiles", "Leave management", "Basic payroll", "Email support"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$9",
    per: "per employee / month",
    desc: "Everything you need to scale HR operations.",
    features: ["Unlimited employees", "All Starter features", "Performance reviews", "Expense management", "Recruitment pipeline", "Priority support"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "contact us",
    desc: "Tailored solutions for large organizations.",
    features: ["Everything in Growth", "Custom integrations", "Dedicated success manager", "SSO / SAML", "SLA guarantee", "Onboarding assistance"],
    cta: "Contact sales",
    highlight: false,
  },
];


export default function AuthGate() {
  return (
    <>
     <LandingPage />

     
    </> 
  );
}

function LandingPage() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
        
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src={Image}
            alt="ZucoHR"
            className="h-8 w-auto object-contain flex-shrink-0"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            How it works
          </a>

          <a
            href="#testimonials"
            className="hover:text-foreground transition-colors"
          >
            Testimonials
          </a>

          <a
            href="#pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </a>

          <div className="flex items-center gap-3 ml-2">
            <a href="/login">
              <button className="bg-[#5f25d5] text-white px-4 py-2 rounded-md hover:opacity-90 transition cursor-pointer">
                Login
              </button>
            </a>

            <a href="/signup">
              <button className="border border-[#5f25d5] text-[#5f25d5] px-4 py-2 rounded-md hover:bg-[#5f25d5]/5 transition cursor-pointer">
                Sign Up
              </button>
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-5 space-y-4 shadow-lg">
          <a
            href="#features"
            className="block text-sm text-muted-foreground hover:text-foreground transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="block text-sm text-muted-foreground hover:text-foreground transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </a>

          <a
            href="#testimonials"
            className="block text-sm text-muted-foreground hover:text-foreground transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Testimonials
          </a>

          <a
            href="#pricing"
            className="block text-sm text-muted-foreground hover:text-foreground transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </a>

          <div className="flex flex-col gap-3 pt-3">
            <a href="/login" className="w-full">
              <button className="w-full bg-[#5f25d5] text-white py-2.5 rounded-md hover:opacity-90 transition">
                Login
              </button>
            </a>

            <a href="/signup" className="w-full">
              <button className="w-full border border-[#5f25d5] text-[#5f25d5] py-2.5 rounded-md hover:bg-[#5f25d5]/5 transition">
                Sign Up
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>


      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[130px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] rounded-full bg-primary/5 blur-[90px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Zap className="h-3.5 w-3.5" />
            All-in-one HR platform for modern teams
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display tracking-tight text-balance leading-[1.08] mb-6">
            HR/Payroll that moves as fast as{" "}
            <span className="text-primary">your business</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            ZucoHR unifies employees, payroll, leave, performance, expenses, and recruitment in one beautifully simple platform — so your people team can focus on people.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            {/* <SignInButton
              signInText="Get started free"
              className="h-12 px-8 text-base font-semibold cursor-pointer"
            /> */}
            <a
              href="#features"
              className="h-12 px-8 text-base font-medium inline-flex items-center gap-2 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Explore features <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Mini trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["No credit card required", "Free 14-day trial", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-muted-foreground/50"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/60 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold font-display text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
            Everything your HR team needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From hiring to retiring — manage the full employee lifecycle without switching tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.label}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{f.desc}</p>
              <ul className="space-y-1.5">
                {f.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 bg-muted/20 border-y border-border/60">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No lengthy implementation or IT support needed. ZucoHR is built to be self-serve from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="rounded-2xl border border-border/60 bg-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold font-display text-primary/20">{step.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature spotlight */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Spotlight</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-5">
              Real-time visibility into your entire workforce
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-relaxed">
              ZucoHR's unified dashboard gives HR leaders a live view of headcount, leave patterns, payroll spend, and team performance — all without pulling a single report manually.
            </p>
            <ul className="space-y-4">
              {[
                { icon: BarChart3, text: "Live headcount and department breakdowns" },
                { icon: Clock, text: "Pending approvals surfaced automatically" },
                { icon: Bell, text: "Smart alerts for compliance and deadlines" },
                { icon: Lock, text: "Role-based access for managers and admins" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-border/60 bg-card p-8 space-y-5"
          >
            {/* Mock dashboard preview */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Team Overview</span>
              <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full">Live</span>
            </div>
            {[
              { label: "Total Employees", value: "248", change: "+12 this month", color: "bg-primary" },
              { label: "On Leave Today", value: "14", change: "3 pending approval", color: "bg-amber-500" },
              { label: "Open Positions", value: "7", change: "23 applicants", color: "bg-emerald-500" },
              { label: "Payroll This Month", value: "$182k", change: "+3.2% vs last month", color: "bg-blue-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl bg-muted/40">
                <div className={`w-2 h-10 rounded-full ${item.color} opacity-70`} />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-lg leading-tight">{item.value}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.change}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-muted/20 border-y border-border/60">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
              Loved by HR teams everywhere
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              See what HR professionals and business leaders say about ZucoHR.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border/60 bg-card p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground flex-1 mb-5">{`"${t.quote}"`}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No hidden fees. No long-term contracts. Start free and scale as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl border p-7 flex flex-col relative ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                  : "border-border/60 bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold font-display">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">{plan.per}</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              {/* <SignInButton
                signInText={plan.cta}
                className={`w-full h-11 font-semibold cursor-pointer ${plan.highlight ? "" : "variant-secondary"}`}
              /> */}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 border-t border-border/60 bg-muted/20 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          {[
            { icon: ShieldCheck, text: "SOC 2 Type II certified" },
            { icon: Lock, text: "End-to-end encryption" },
            { icon: Globe, text: "Available in 40+ countries" },
            { icon: Zap, text: "99.9% uptime SLA" },
            { icon: HeartHandshake, text: "GDPR compliant" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-5">
            Ready to transform your HR?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 text-balance">
            Join thousands of companies using ZucoHR to manage their people better. Start your free trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* <SignInButton
              signInText="Start free trial"
              className="h-12 px-10 text-base font-semibold cursor-pointer"
            /> */}
            <a
              href="#features"
              className="h-12 px-8 text-base font-medium inline-flex items-center gap-2 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <img
              src={Image}
              alt="ZucoHR"
              className="h-8 w-auto object-contain mb-3"
            />
            <p className="text-sm text-muted-foreground max-w-xs">
              The all-in-one HR platform built for modern, fast-moving teams.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-3">Product</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Company</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">About</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Blog</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Careers</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">Legal</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Terms</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Security</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-border/60 text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} ZucoHR. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
