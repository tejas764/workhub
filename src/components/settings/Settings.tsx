import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Fingerprint, Settings } from "lucide-react";
import { C } from "@/constants";
import { hov, unhov } from "@/lib/ui-utils";
import { Btn, Card, EmptyState, Select } from "@/components/ui";
import { createClient } from "@/lib/supabase-client";

export function SettingsPage() {
  const [section, setSection] = useState("Appearance");
  const [supabase] = useState(() => createClient());
  const [passkeyMessage, setPasskeyMessage] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const sections = ["Appearance", "Notifications", "Language & Region", "Account", "Privacy", "Accessibility"];

  const registerPasskey = async () => {
    setPasskeyMessage("");
    setPasskeyError("");

    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      setPasskeyError("This browser or device does not support passkeys.");
      return;
    }

    setPasskeyLoading(true);
    const { data, error } = await supabase.auth.registerPasskey();
    setPasskeyLoading(false);

    if (error) {
      setPasskeyError(error.message);
      return;
    }

    setPasskeyMessage(`${data.friendly_name ?? "Passkey"} registered.`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black mb-6" style={{ color: C.blue600 }}>Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-48 flex-shrink-0">
          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
            {sections.map(s => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={s === section ? { background: C.blue500, color: "#fff" } : { color: C.textSecondary }}
                onMouseEnter={e => { if (s !== section) hov(e.currentTarget, C.blue50, C.blue500); }}
                onMouseLeave={e => { if (s !== section) unhov(e.currentTarget, "transparent", C.textSecondary); }}
              >
                {s}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 max-w-2xl space-y-4">
          {section === "Appearance" && (
            <>
              <Card className="p-5">
                <p className="text-sm font-bold mb-4" style={{ color: C.textPrimary }}>Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {["Light", "Dark", "System"].map(t => (
                    <div
                      key={t}
                      className="p-4 border-2 cursor-pointer text-center"
                      style={{ borderColor: t === "Light" ? C.blue200 : C.border, background: t === "Light" ? C.blue50 : "#fff", borderRadius: 12 }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl mx-auto mb-2"
                        style={{
                          background: t === "Dark" ? C.blue600 : t === "System" ? `linear-gradient(135deg,#fff 50%,${C.blue500} 50%)` : "#fff",
                          border: t === "Light" ? `1px solid ${C.border}` : "none",
                        }}
                      />
                      <p className="text-xs font-bold" style={{ color: t === "Light" ? C.blue500 : C.textPrimary }}>{t}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-sm font-bold mb-4" style={{ color: C.textPrimary }}>Density</p>
                <div className="grid grid-cols-3 gap-3">
                  {["Compact", "Comfortable", "Spacious"].map(d => (
                    <div
                      key={d}
                      className="p-3 border-2 cursor-pointer text-center"
                      style={{ borderColor: d === "Comfortable" ? C.blue200 : C.border, borderRadius: 10 }}
                    >
                      <p className="text-xs font-bold" style={{ color: d === "Comfortable" ? C.blue500 : C.textSecondary }}>{d}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {section === "Language & Region" && (
            <Card className="p-5">
              <p className="text-sm font-bold mb-4" style={{ color: C.textPrimary }}>Language & Region</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: C.textPrimary }}>Interface Language</label>
                  <Select options={["English (US)", "English (UK)", "Hindi", "Tamil", "Telugu"]} className="w-full" />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: C.textPrimary }}>Date Format</label>
                  <Select options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} className="w-full" />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: C.textPrimary }}>Time Zone</label>
                  <Select options={["Asia/Kolkata (IST +5:30)", "UTC", "US/Eastern"]} className="w-full" />
                </div>
              </div>
            </Card>
          )}

          {section === "Account" && (
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.blue50, color: C.blue500 }}>
                  <Fingerprint size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: C.textPrimary }}>Passkey sign-in</p>
                  <p className="text-xs mt-1 max-w-md" style={{ color: C.textMuted }}>
                    Register this device with Windows Hello, biometrics, or a security key, then use the passkey button on the sign-in screen.
                  </p>

                  {(passkeyMessage || passkeyError) && (
                    <div
                      className="mt-3 rounded-xl border px-3 py-2 text-sm font-medium flex items-center gap-2"
                      style={passkeyError
                        ? { background: C.red50, borderColor: C.red100, color: C.red500 }
                        : { background: C.olive50, borderColor: C.olive100, color: C.olive500 }}
                    >
                      {passkeyError ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                      {passkeyError || passkeyMessage}
                    </div>
                  )}

                  <Btn className="mt-4" icon={Fingerprint} onClick={() => void registerPasskey()} disabled={passkeyLoading}>
                    {passkeyLoading ? "Registering..." : "Register Passkey"}
                  </Btn>
                </div>
              </div>
            </Card>
          )}

          {!["Appearance", "Language & Region", "Account"].includes(section) && (
            <EmptyState icon={Settings} title={`${section} Settings`} description={`Configure your ${section.toLowerCase()} preferences here.`} />
          )}
        </div>
      </div>
    </div>
  );
}
