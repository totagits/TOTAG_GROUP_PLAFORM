import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  ClipboardCheck,
  ChefHat,
  Sparkles,
  Truck,
  BookOpen,
  FileText,
  Users,
  Eye,
  Ban,
  Heart
} from "lucide-react";
const cateringLogo = "/images/totag-logo.png";
import foodSafetyBg from "@assets/Event1_1752617755645.jpg";
import { Link } from "wouter";

export default function FoodSafetyPage() {
  const haccpControls = [
    {
      stage: "1. Supplier Approval & Receiving",
      icon: ClipboardCheck,
      color: "bg-blue-100 text-blue-700",
      controls: [
        "Approved suppliers only with documented verification",
        "Receiving inspection: freshness, expiry dates, seal integrity",
        "Reject compromised items immediately upon inspection",
        "All inspections recorded in Receiving Log"
      ]
    },
    {
      stage: "2. Storage & Segregation",
      icon: Thermometer,
      color: "bg-cyan-100 text-cyan-700",
      controls: [
        "FIFO (First In, First Out) and FEFO (First Expiry, First Out) enforced",
        "Raw items segregated from ready-to-eat items",
        "All containers labeled with contents and date",
        "Storage areas kept clean, dry, and pest-protected",
        "Daily temperature and condition checks logged"
      ]
    },
    {
      stage: "3. Hygienic Preparation",
      icon: ChefHat,
      color: "bg-green-100 text-green-700",
      controls: [
        "Mandatory handwashing before and during food handling",
        "Hair fully covered; clean uniform worn at all times",
        "Separate utensils and cutting boards for raw vs ready-to-eat",
        "Equipment sanitized between tasks",
        "No jewelry on hands/wrists during food handling"
      ]
    },
    {
      stage: "4. Cooking & Reheating (Critical Control Point)",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700",
      controls: [
        "Cook all foods thoroughly to safe internal temperatures",
        "Reheat rapidly to appropriate temperatures",
        "Verify safe internal temperatures with calibrated thermometers",
        "Record all batch checks in Cooking/Batch Log",
        "This is the primary Critical Control Point (CCP)"
      ]
    },
    {
      stage: "5. Hot/Cold Holding & Time Control",
      icon: Thermometer,
      color: "bg-amber-100 text-amber-700",
      controls: [
        "Keep hot foods at safe hot-holding temperatures",
        "Keep cold foods at safe cold-holding temperatures",
        "Minimize time in the temperature danger zone",
        "Discard any items held at unsafe temperatures"
      ]
    },
    {
      stage: "6. Packaging & Transport",
      icon: Truck,
      color: "bg-purple-100 text-purple-700",
      controls: [
        "Food-grade packaging materials only",
        "Covered transport to prevent contamination",
        "Dispatch checklist completed before departure",
        "Delivery handover confirmation: time, receiver, headcount"
      ]
    },
    {
      stage: "7. Cleaning & Sanitation",
      icon: Sparkles,
      color: "bg-teal-100 text-teal-700",
      controls: [
        "Clean then sanitize all food-contact surfaces",
        "Daily sanitation schedule strictly followed and documented",
        "Covered waste removal at regular intervals",
        "Pest prevention actions recorded and monitored"
      ]
    },
    {
      stage: "8. Allergen & Special Diet Management",
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-700",
      controls: [
        "Prevent cross-contact through separate preparation",
        "Clear labeling of all allergens on containers and stations",
        "Dietary requirements confirmed during order intake",
        "Staff trained on allergen identification and management"
      ]
    }
  ];

  const staffHygieneRules = {
    fitnessToWork: [
      "No food handling with vomiting, diarrhea, or fever",
      "No food handling with sore throat accompanied by fever",
      "No food handling with infected wounds or skin infections",
      "Report any illness immediately to supervisor"
    ],
    uniformAndGrooming: [
      "Clean uniform/apron provided and required daily",
      "Hair fully covered (hairnet/cap) at all times",
      "Beard cover worn where applicable",
      "Nails kept short and clean; no nail polish",
      "No jewelry on hands/wrists (plain band only if permitted)"
    ],
    handHygiene: [
      "Before starting work and before handling ready-to-eat food",
      "After toilet use and after handling raw foods",
      "After touching phones, money, or waste",
      "After cleaning activities and after breaks",
      "Gloves do not replace handwashing"
    ],
    conductRules: [
      "No smoking, gum, or eating while handling food",
      "Do not cough or sneeze over food",
      "If contamination incident occurs: step away, wash hands, change gloves",
      "Cuts/wounds covered with waterproof dressing plus gloves",
      "Weeping wounds excluded from food handling until healed"
    ]
  };

  const complianceRecords = [
    { name: "Approved Supplier List", desc: "Verified and approved food suppliers" },
    { name: "Receiving Inspection Log", desc: "Freshness, expiry, seal checks" },
    { name: "Storage Temperature Log", desc: "Daily cold/dry storage checks" },
    { name: "Cooking/Batch Temperature Log", desc: "CCP verification records" },
    { name: "Cleaning & Sanitation Log", desc: "Daily sanitation schedule compliance" },
    { name: "Delivery Confirmation Log", desc: "Time, receiver, headcount confirmation" },
    { name: "Incident/Corrective Action Log", desc: "Food safety incident documentation" },
    { name: "Training Register", desc: "Staff training and certification records" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header 
        className="relative bg-cover bg-center bg-no-repeat shadow-sm border-b"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${foodSafetyBg})`,
          minHeight: '220px'
        }}
      >
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <Link href="/catering">
              <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Catering
              </Button>
            </Link>
          </div>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 -ml-6">
              <img src={cateringLogo} alt="TOTAG Catering" className="w-[100px] h-[100px] object-contain" />
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-white mb-2">Food Safety & Hygiene Standards</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                HACCP Principles | Codex/WHO Good Hygiene Practices | ISO 22000-Style Controls
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-green-600 text-white border-0">HACCP Aligned</Badge>
                <Badge className="bg-blue-600 text-white border-0">Codex/WHO GHP</Badge>
                <Badge className="bg-purple-600 text-white border-0">ISO 22000 Controls</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Food Safety & Hygiene SOP
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
            TOTAG operates a comprehensive food safety management system to ensure all foods and beverages 
            prepared and served are safe, hygienic, traceable, and suitable for institutional clients.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Document:</strong> Food Safety & Hygiene SOP</div>
              <div><strong>Version:</strong> 2.0</div>
              <div><strong>Effective Date:</strong> 01/12/2024</div>
              <div><strong>Owner:</strong> Food Safety & Quality Supervisor</div>
            </div>
          </div>
        </motion.div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Key Operating Controls (HACCP-Aligned)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {haccpControls.map((control, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <div className={`w-10 h-10 ${control.color} rounded-lg flex items-center justify-center mr-3`}>
                        <control.icon className="h-5 w-5" />
                      </div>
                      {control.stage}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {control.controls.map((item, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Incident Response Protocol</h2>
          <p className="text-lg mb-8 opacity-90">
            In the event of a food safety concern, our protocol activates immediately
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: "1", label: "Stop Service", desc: "Immediately halt affected operations" },
              { step: "2", label: "Isolate Product", desc: "Remove and segregate suspected items" },
              { step: "3", label: "Notify Supervisor", desc: "Alert Food Safety Supervisor" },
              { step: "4", label: "Document", desc: "Record incident details thoroughly" },
              { step: "5", label: "Corrective Action", desc: "Sanitize, investigate, prevent recurrence" }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold">{s.step}</div>
                <p className="font-semibold text-sm">{s.label}</p>
                <p className="text-xs opacity-80 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="mb-16 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              Staff Hygiene Policy (Food Handlers & Catering Staff)
            </CardTitle>
            <div className="bg-gray-100 rounded-lg p-3 mt-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Document:</strong> Staff Hygiene Policy</div>
                <div><strong>Version:</strong> 2.0</div>
                <div><strong>Effective Date:</strong> 01/12/2024</div>
                <div><strong>Objective:</strong> Prevent contamination, protect client health</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Heart className="h-4 w-4 text-red-600 mr-2" />
                  Fitness to Work
                </h4>
                <div className="space-y-2">
                  {staffHygieneRules.fitnessToWork.map((rule, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <Ban className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Users className="h-4 w-4 text-blue-600 mr-2" />
                  Uniform & Grooming
                </h4>
                <div className="space-y-2">
                  {staffHygieneRules.uniformAndGrooming.map((rule, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 text-green-600 mr-2" />
                  Hand Hygiene Requirements
                </h4>
                <div className="space-y-2">
                  {staffHygieneRules.handHygiene.map((rule, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Shield className="h-4 w-4 text-purple-600 mr-2" />
                  Conduct & Safety Rules
                </h4>
                <div className="space-y-2">
                  {staffHygieneRules.conductRules.map((rule, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Enforcement</h4>
              <p className="text-sm text-gray-700">
                Violations are addressed through coaching/retraining, written warning, and removal 
                for repeated or serious breaches. Food safety violations are escalated to management immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="h-6 w-6 text-gray-600 mr-2" />
              Compliance Records & Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {complianceRecords.map((record, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-semibold">{record.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{record.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Verification & Audit</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    The Food Safety & Quality Supervisor verifies compliance via log reviews, spot checks, 
                    and corrective-action tracking. All records are retained for audit and available to 
                    clients upon request. Staff complete induction before assignment and receive periodic refreshers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Food Safety is Our Foundation</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Every meal we serve is backed by documented procedures, trained staff, 
              verified controls, and a complete audit trail. Our commitment to HACCP, 
              WHO/Codex GHP, and ISO 22000 standards ensures your safety and satisfaction.
            </p>
            <Link href="/catering">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Catering Services
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
