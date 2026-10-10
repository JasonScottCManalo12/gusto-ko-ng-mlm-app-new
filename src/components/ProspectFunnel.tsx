import React, { useState } from 'react';
import { Prospect, Member, ProspectStatus } from '../types/mlm';
import { 
  Users, 
  UserPlus, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  QrCode, 
  Share2, 
  ChevronRight,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';

interface ProspectFunnelProps {
  currentMember: Member;
  prospects: Prospect[];
  onAddProspect: (prospect: Omit<Prospect, 'id' | 'dateAdded'>) => void;
  onUpdateProspectStatus: (id: string, status: ProspectStatus) => void;
  onDeleteProspect: (id: string) => void;
  onConvertProspectToDownline: (prospect: Prospect) => void;
}

export const ProspectFunnel: React.FC<ProspectFunnelProps> = ({
  currentMember,
  prospects,
  onAddProspect,
  onUpdateProspectStatus,
  onDeleteProspect,
  onConvertProspectToDownline,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'scripts' | 'referral'>('pipeline');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // New Prospect Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSocial, setNewSocial] = useState('');
  const [newPackage, setNewPackage] = useState('Business Builder Pro');
  const [newNotes, setNewNotes] = useState('');

  const referralUrl = `https://apexnetwork.vip/join?ref=${currentMember.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    onAddProspect({
      fullName: newName.trim(),
      phone: newPhone.trim(),
      socialLink: newSocial.trim() || undefined,
      status: 'cold',
      notes: newNotes.trim() || 'Added via Prospect CRM',
      potentialPackage: newPackage,
    });

    setNewName('');
    setNewPhone('');
    setNewSocial('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Pre-crafted high-converting pitch scripts
  const scripts = [
    {
      id: 'script_part_time',
      title: '1. Part-Time Extra Income Approach (Tagalog / English)',
      category: 'Financial Freedom / Side Hustle',
      audience: 'Working Professionals, BPO, Breadwinners',
      text: `Hi [Name]! Kamusta? Napansin ko kasi ang sipag mo and looking ka for extra cash flow. Share ko lang saglit, currently expanding ang direct sales team namin sa Apex Network. Gamit lang ang smartphone mo during your free time, may system kami kung saan pwede kang kumita ng additional ₱15,000 to ₱30,000 monthly nang hindi naiiwan ang main work mo. Open ka bang silipin ang 15-minute business overview namin online mamayang gabi? Walang commitment!`,
    },
    {
      id: 'script_product_first',
      title: '2. Product Testimonial & Beauty Glow Approach',
      category: 'Product First / Wellness',
      audience: 'Skincare enthusiasts, Health conscious, Moms',
      text: `Hi [Name]! Musta po? Naalala kita kasi sobrang effective nitong Aura Glow Peptide Serum at Vitality Supergreens na ginagamit ko everyday—sobrang glowing at energetic ng pakiramdam ko. Distributor din ako ngayon kaya nakakakuha ako ng wholesale discount. Send ko sa'yo yung bago naming catalog link? May exclusive 35% introductory promo kami for family and close friends this week!`,
    },
    {
      id: 'script_bom_invite',
      title: '3. Grand Business Opportunity Meeting (Zoom BOM Invite)',
      category: 'Event Invitation',
      audience: 'Warm market, former colleagues, entrepreneurs',
      text: `Bro/Sis [Name]! May exclusive VIP Zoom session kami mamayang 7:30 PM with our Top Diamond Mentor Jason Manalo. Ipapakita niya kung paano nag-scale ang network marketing system natin with daily GCash encashment. Nag-reserve ako ng 1 VIP seat under my name, sayang if hindi magamit. Pwede kitang i-register libre, okay lang bang i-send ko ang private Zoom link sa'yo?`,
    },
  ];

  const statusColumns: { id: ProspectStatus; label: string; color: string }[] = [
    { id: 'cold', label: 'Cold Leads', color: 'border-slate-700 text-slate-400' },
    { id: 'invited', label: 'Invited to BOM', color: 'border-blue-700 text-blue-400' },
    { id: 'attended_bom', label: 'Attended BOM', color: 'border-amber-700 text-amber-400' },
    { id: 'follow_up', label: 'Follow Up / Closing', color: 'border-purple-700 text-purple-400' },
    { id: 'enrolled', label: 'Enrolled Downline', color: 'border-emerald-700 text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                Prospect Pipeline & Marketing Funnel
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Recruitment CRM, high-converting Tagalog pitch scripts, and replicated referral link
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Prospect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 border border-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'pipeline' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Lead Pipeline CRM ({prospects.length})
        </button>
        <button
          onClick={() => setActiveTab('scripts')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'scripts' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Closing Pitch Scripts
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'referral' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Replicated Landing Page & QR
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statusColumns.map((col) => {
            const columnProspects = prospects.filter(p => p.status === col.id);
            return (
              <div key={col.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 flex flex-col justify-between min-h-[480px]">
                <div>
                  <div className={`flex items-center justify-between text-xs font-semibold pb-2 border-b ${col.color}`}>
                    <span>{col.label}</span>
                    <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-[11px]">
                      {columnProspects.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {columnProspects.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 hover:border-slate-700 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white truncate">{p.fullName}</span>
                          <button
                            onClick={() => onDeleteProspect(p.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                            title="Remove prospect"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <Phone className="w-3 h-3" />
                          <span>{p.phone}</span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/60 p-1.5 rounded">
                          {p.notes}
                        </p>

                        <div className="text-[10px] text-emerald-400 font-medium">
                          Interest: {p.potentialPackage}
                        </div>

                        {/* Status Pipeline Transition */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                          <select
                            value={p.status}
                            onChange={(e) => onUpdateProspectStatus(p.id, e.target.value as ProspectStatus)}
                            className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded px-1.5 py-1 focus:outline-none"
                          >
                            <option value="cold">Cold</option>
                            <option value="invited">Invited</option>
                            <option value="attended_bom">Attended</option>
                            <option value="follow_up">Follow-Up</option>
                            <option value="enrolled">Enrolled</option>
                          </select>

                          {p.status !== 'enrolled' ? (
                            <button
                              onClick={() => onConvertProspectToDownline(p)}
                              className="px-2 py-1 text-[10px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors whitespace-nowrap"
                            >
                              Enroll Now
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ✓ Enrolled
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {columnProspects.length === 0 && (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No prospects in this stage
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Scripts Tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {scripts.map((s) => (
              <div key={s.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Audience: <strong className="text-slate-300">{s.audience}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyScript(s.id, s.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shrink-0"
                  >
                    {copiedScriptId === s.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans select-all whitespace-pre-wrap">
                  {s.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral & Landing Page Tab */}
      {activeTab === 'referral' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <h2 className="text-lg font-bold text-white">Your Replicated Distributor URL</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              When prospects visit this link, they see your distributor branding, official product presentation, and can purchase directly or join your downline under your sponsorship!
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-emerald-400 truncate">{referralUrl}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            {/* QR Code Presentation */}
            <div className="pt-4 flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl shadow-lg inline-block">
                {/* SVG QR Code representation */}
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="black">
                  <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                  <path d="M35,5 h5 v5 h-5 z M45,5 h10 v5 h-10 z M60,5 h5 v5 h-5 z M35,15 h15 v5 h-15 z M55,15 h10 v15 h-10 z M35,25 h15 v5 h-15 z" />
                  <path d="M5,35 h10 v10 h-10 z M20,35 h15 v5 h-15 z M40,35 h20 v10 h-20 z M65,35 h15 v10 h-15 z M85,35 h10 v10 h-10 z" />
                  <path d="M5,50 h15 v10 h-15 z M25,50 h10 v10 h-10 z M40,50 h15 v5 h-15 z M60,50 h10 v15 h-10 z M75,50 h20 v10 h-20 z" />
                  <path d="M35,65 h10 v10 h-10 z M50,65 h20 v15 h-20 z M75,65 h15 v10 h-15 z M35,80 h10 v15 h-10 z M75,80 h20 v15 h-20 z" />
                </svg>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Scan with smartphone camera to open your distributor page
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Prospect Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add New Prospect to CRM</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile / Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0917-xxx-xxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Package</label>
                <select
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Starter Business Kit">Starter Business Kit (₱4,990)</option>
                  <option value="Business Builder Pro">Business Builder Pro (₱14,880)</option>
                  <option value="Elite Diamond Executive">Elite Diamond Executive (₱29,800)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Background</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Inquired about working part-time, invited to Thursday Zoom"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Save Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
