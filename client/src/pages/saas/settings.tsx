import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Upload,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  UserCheck,
  Trash2
} from "lucide-react";

export default function SaaSSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Institution Profile State
  const [institution, setInstitution] = useState({
    name: "TOTAG GROUP OF COMPANIES LTD",
    tradeName: "TOTAG Group",
    tin: "LRA-TIN-100984712",
    nasscorpNo: "NASS-EMP-2026-99",
    mociRegNo: "MOCI-LIB-2021-08492",
    address: "11th Street Sinkor, Tubman Boulevard, Monrovia, Liberia",
    city: "Monrovia",
    county: "Montserrado",
    country: "Liberia",
    primaryEmail: "info@totaggroup.com",
    billingEmail: "billing@totaggroup.com",
    contactPhone: "+231-777-666-000",
    altPhone: "+231-886-555-111",
    website: "https://totaggroup.com",
    currency: "USD ($) with LRD (L$) Dual Support",
    signatoryName: "Michael Gwoah",
    signatoryTitle: "Chief Executive Officer & Group Chairman",
    logoUrl: ""
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load persisted settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("totag_institution_settings_v1");
      if (saved) {
        setInstitution(JSON.parse(saved));
      } else {
        const legacyName = localStorage.getItem("saas_company_name");
        if (legacyName) {
          setInstitution(prev => ({ ...prev, name: legacyName, tradeName: legacyName }));
        }
      }
    } catch (e) {
      console.error("Error loading institution settings", e);
    }
  }, []);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 3MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setInstitution(prev => ({ ...prev, logoUrl: result }));
      toast({
        title: "Logo Loaded",
        description: "Institution logo updated in preview. Click 'Save Institution Settings' to apply."
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove Logo
  const handleRemoveLogo = () => {
    setInstitution(prev => ({ ...prev, logoUrl: "" }));
    toast({
      title: "Logo Removed",
      description: "Default organization crest will be used on official documents."
    });
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem("totag_institution_settings_v1", JSON.stringify(institution));
      localStorage.setItem("saas_company_name", institution.name);

      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: "✓ Institution Settings Saved",
          description: "Organization identity, branding, logo, and statutory tax parameters updated across all HRMIS and FIMS portals."
        });
      }, 400);
    } catch (err) {
      setIsSaving(false);
      toast({
        title: "Save Failed",
        description: "Could not persist institution profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/saas/dashboard")}
            className="text-slate-400 hover:text-white rounded-xl h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-sm font-black text-white">Institution Profile & Organizational Settings</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-xs">
            Enterprise Tenant Active
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              Official Institution Master Registry
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Configure your corporate identity, logo, physical address, LRA TIN, NASSCORP ID, and executive signatories. These details are dynamically embedded into pay stubs, tax vouchers, 3PL waybills, and financial statements.
            </p>
          </div>
          <Button
            type="submit"
            form="institution-settings-form"
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 shrink-0"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving Updates..." : "Save Institution Settings"}
          </Button>
        </div>

        <form id="institution-settings-form" onSubmit={handleSaveSettings} className="space-y-8">
          {/* Logo & Brand Identity */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                Institution Logo & Brand Identity
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Upload your official high-resolution PNG or SVG logo for client portals, payslips, and compliance reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-32 h-32 rounded-3xl bg-slate-950 border-2 border-dashed border-indigo-500/40 flex items-center justify-center overflow-hidden shadow-inner shrink-0 group">
                  {institution.logoUrl ? (
                    <img
                      src={institution.logoUrl}
                      alt="Institution Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Building2 className="w-8 h-8 text-indigo-400 mx-auto mb-1 opacity-70" />
                      <span className="text-[10px] text-slate-400 block font-mono">No Logo Uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold h-9 px-4 rounded-xl shadow-md"
                    >
                      <Upload className="w-4 h-4 mr-1.5" /> Upload Institution Logo
                    </Button>
                    {institution.logoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveLogo}
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs h-9 px-3 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Recommended dimensions: <strong>512x512px</strong> or vector SVG. Max file size: <strong>3MB</strong> (PNG, JPG, SVG, WebP).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Business Information */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Building2 className="w-5 h-5 text-blue-400" />
                Legal Business Identity & Registration
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Official statutory corporate registration details in accordance with Liberian corporate governance law.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Full Legal Entity Name *</Label>
                  <Input
                    required
                    value={institution.name}
                    onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                    placeholder="e.g. TOTAG GROUP OF COMPANIES LTD"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Trading / Brand Name (DBA)</Label>
                  <Input
                    value={institution.tradeName}
                    onChange={(e) => setInstitution({ ...institution, tradeName: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                    placeholder="e.g. TOTAG Group"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">LRA Tax Identification Number (TIN) *</Label>
                  <Input
                    required
                    value={institution.tin}
                    onChange={(e) => setInstitution({ ...institution, tin: e.target.value })}
                    className="bg-slate-950 border-white/10 font-mono text-amber-300 font-bold rounded-xl text-xs"
                    placeholder="e.g. LRA-TIN-100984712"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">NASSCORP Employer Registration #</Label>
                  <Input
                    value={institution.nasscorpNo}
                    onChange={(e) => setInstitution({ ...institution, nasscorpNo: e.target.value })}
                    className="bg-slate-950 border-white/10 font-mono text-indigo-300 font-bold rounded-xl text-xs"
                    placeholder="e.g. NASS-EMP-2026-99"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">MOCI Business Registration Code</Label>
                  <Input
                    value={institution.mociRegNo}
                    onChange={(e) => setInstitution({ ...institution, mociRegNo: e.target.value })}
                    className="bg-slate-950 border-white/10 font-mono text-emerald-300 font-bold rounded-xl text-xs"
                    placeholder="e.g. MOCI-LIB-2021-08492"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Address & Location */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Physical Headquarters & Geographic Address
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Official physical premises used for tax jurisdiction, 3PL dispatching, and formal audit filings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-300 font-bold">Headquarters Street Address *</Label>
                <Input
                  required
                  value={institution.address}
                  onChange={(e) => setInstitution({ ...institution, address: e.target.value })}
                  className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                  placeholder="e.g. 11th Street Sinkor, Tubman Boulevard"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">City / Township</Label>
                  <Input
                    value={institution.city}
                    onChange={(e) => setInstitution({ ...institution, city: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">County / Administrative Division</Label>
                  <Input
                    value={institution.county}
                    onChange={(e) => setInstitution({ ...institution, county: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Country</Label>
                  <Input
                    value={institution.country}
                    onChange={(e) => setInstitution({ ...institution, country: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Communications */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Mail className="w-5 h-5 text-purple-400" />
                Corporate Communications & Contact Channels
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Official email addresses and telephone contacts for electronic notifications and automated dispatch slips.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Primary Corporate Email *</Label>
                  <Input
                    type="email"
                    required
                    value={institution.primaryEmail}
                    onChange={(e) => setInstitution({ ...institution, primaryEmail: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                    placeholder="e.g. info@totaggroup.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Billing & Treasury Invoicing Email</Label>
                  <Input
                    type="email"
                    value={institution.billingEmail}
                    onChange={(e) => setInstitution({ ...institution, billingEmail: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                    placeholder="e.g. billing@totaggroup.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Primary Telephone *</Label>
                  <Input
                    required
                    value={institution.contactPhone}
                    onChange={(e) => setInstitution({ ...institution, contactPhone: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs font-mono"
                    placeholder="e.g. +231-777-666-000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Secondary / Operations Hotline</Label>
                  <Input
                    value={institution.altPhone}
                    onChange={(e) => setInstitution({ ...institution, altPhone: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs font-mono"
                    placeholder="e.g. +231-886-555-111"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Official Web Domain</Label>
                  <Input
                    value={institution.website}
                    onChange={(e) => setInstitution({ ...institution, website: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                    placeholder="https://totaggroup.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Executive Signatory & Financial Configuration */}
          <Card className="rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <UserCheck className="w-5 h-5 text-amber-400" />
                Executive Signatory & Financial Standards
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Principal authorized executive signatory for legal documents, vendor contracts, and tax withholding submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Executive Signatory Full Name</Label>
                  <Input
                    value={institution.signatoryName}
                    onChange={(e) => setInstitution({ ...institution, signatoryName: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white font-bold rounded-xl text-xs"
                    placeholder="e.g. Michael Gwoah"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300 font-bold">Executive Signatory Title</Label>
                  <Input
                    value={institution.signatoryTitle}
                    onChange={(e) => setInstitution({ ...institution, signatoryTitle: e.target.value })}
                    className="bg-slate-950 border-white/10 text-white rounded-xl text-xs"
                    placeholder="e.g. Chief Executive Officer & Group Chairman"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300 font-bold">Operating Currency Regime</Label>
                <Input
                  readOnly
                  value={institution.currency}
                  className="bg-slate-950/60 border-white/10 text-emerald-400 font-mono font-bold rounded-xl text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs h-11 px-8 rounded-xl shadow-xl shadow-indigo-500/25 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving Updates..." : "Save Institution Settings ➔"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
