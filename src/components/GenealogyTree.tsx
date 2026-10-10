import React, { useState } from 'react';
import { Member, Currency } from '../types/mlm';
import { formatNumber } from '../utils/formatters';
import { 
  Network, 
  GitFork, 
  UserCheck, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronRight, 
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface GenealogyTreeProps {
  currentMember: Member;
  allMembers: Member[];
  currency: Currency;
  onOpenEnrollModalWithPlacement: (parentId: string, leg: 'left' | 'right') => void;
  onSelectMemberToInspect?: (member: Member) => void;
}

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({
  currentMember,
  allMembers,
  currency,
  onOpenEnrollModalWithPlacement,
}) => {
  const [viewMode, setViewMode] = useState<'binary' | 'unilevel'>('binary');
  const [focusedRootId, setFocusedRootId] = useState<string>(currentMember.id);
  const [selectedNode, setSelectedNode] = useState<Member | null>(currentMember);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Find the focused root member
  const focusedMember = allMembers.find(m => m.id === focusedRootId) || currentMember;

  // Helpers to get children in binary tree
  const getLeftChild = (parentId: string) => {
    return allMembers.find(m => m.placementParentId === parentId && m.position === 'left');
  };

  const getRightChild = (parentId: string) => {
    return allMembers.find(m => m.placementParentId === parentId && m.position === 'right');
  };

  // Unilevel Generation calculation
  const getDirects = (sponsorId: string) => {
    return allMembers.filter(m => m.sponsorId === sponsorId);
  };

  const gen1 = getDirects(currentMember.id);
  const gen2 = gen1.flatMap(m => getDirects(m.id));
  const gen3 = gen2.flatMap(m => getDirects(m.id));

  // Search filter
  const searchResults = searchQuery.trim() === '' ? [] : allMembers.filter(m => 
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.distributorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearchResult = (member: Member) => {
    setFocusedRootId(member.id);
    setSelectedNode(member);
    setSearchQuery('');
  };

  // Node Component for Binary Tree
  const BinaryNode: React.FC<{ 
    member?: Member; 
    parentId: string; 
    leg: 'left' | 'right' | 'root';
    level: number;
  }> = ({ member, parentId, leg, level }) => {
    if (!member) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-36 h-28 border border-dashed border-slate-700 hover:border-emerald-500/80 rounded-xl bg-slate-900/40 p-3 flex flex-col items-center justify-center text-center transition-all group">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Vacant {leg} Leg
            </span>
            <button
              onClick={() => onOpenEnrollModalWithPlacement(parentId, leg as 'left' | 'right')}
              className="mt-1 flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-md transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              <span>Enroll Here</span>
            </button>
          </div>
        </div>
      );
    }

    const isSelected = selectedNode?.id === member.id;
    const isRoot = member.id === focusedMember.id;

    // Rank border color mapping
    const getRankColor = (rank: string) => {
      switch (rank) {
        case 'Crown Ambassador': return 'border-amber-400 text-amber-300';
        case 'Diamond': return 'border-cyan-400 text-cyan-300';
        case 'Gold': return 'border-amber-500 text-amber-400';
        case 'Silver': return 'border-slate-300 text-slate-300';
        case 'Bronze': return 'border-orange-500 text-orange-400';
        default: return 'border-emerald-500 text-emerald-400';
      }
    };

    return (
      <div className="flex flex-col items-center">
        <div
          onClick={() => setSelectedNode(member)}
          className={`w-40 rounded-xl p-3 cursor-pointer transition-all duration-200 border bg-slate-900 shadow-md hover:shadow-emerald-500/10 ${
            isSelected 
              ? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-slate-900' 
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Top Tag */}
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="font-mono text-slate-400 font-semibold">{member.distributorCode}</span>
            <span className={`font-semibold ${getRankColor(member.rank)}`}>
              {member.rank}
            </span>
          </div>

          {/* Member Info */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={member.avatar}
              alt={member.fullName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{member.fullName}</h4>
              <p className="text-[10px] text-slate-400 font-mono tabular-nums">PPV: {member.personalPV}</p>
            </div>
          </div>

          {/* Binary Legs Summary */}
          <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-800 text-[10px] font-mono">
            <div className="bg-slate-950/80 rounded px-1.5 py-0.5 text-center">
              <span className="text-slate-500 block text-[9px]">L-PV</span>
              <span className="text-blue-400 font-bold tabular-nums">{formatNumber(member.leftLegPV)}</span>
            </div>
            <div className="bg-slate-950/80 rounded px-1.5 py-0.5 text-center">
              <span className="text-slate-500 block text-[9px]">R-PV</span>
              <span className="text-emerald-400 font-bold tabular-nums">{formatNumber(member.rightLegPV)}</span>
            </div>
          </div>

          {/* Downline Focus button if not current root */}
          {!isRoot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFocusedRootId(member.id);
                setSelectedNode(member);
              }}
              className="w-full mt-2 text-[10px] font-medium text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-0.5 pt-1 border-t border-slate-800/60"
            >
              <span>Explore Subtree</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Build Binary Levels
  const leftL1 = getLeftChild(focusedMember.id);
  const rightL1 = getRightChild(focusedMember.id);

  const leftL2_Left = leftL1 ? getLeftChild(leftL1.id) : undefined;
  const leftL2_Right = leftL1 ? getRightChild(leftL1.id) : undefined;

  const rightL2_Left = rightL1 ? getLeftChild(rightL1.id) : undefined;
  const rightL2_Right = rightL1 ? getRightChild(rightL1.id) : undefined;

  return (
    <div className="space-y-6">
      {/* Top Header & View Mode Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                Genealogy & Downline Hierarchy
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual real-time binary pairing matrix and multi-generation unilevel structure
            </p>
          </div>

          {/* Interactive controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Downline */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search downline name or ID..."
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
              />
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center justify-between border-b border-slate-800/50 last:border-0"
                    >
                      <span className="font-semibold text-white">{result.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{result.distributorCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode('binary')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === 'binary'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Binary Tree</span>
              </button>
              <button
                onClick={() => setViewMode('unilevel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === 'unilevel'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Unilevel Generations</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'binary' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Tree Canvas (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[580px]">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10 mb-4">
              <div className="flex items-center gap-2">
                {focusedRootId !== currentMember.id && (
                  <button
                    onClick={() => {
                      setFocusedRootId(currentMember.id);
                      setSelectedNode(currentMember);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Top ({currentMember.fullName})</span>
                  </button>
                )}
                <span className="text-xs text-slate-400">
                  Inspecting root: <strong className="text-white">{focusedMember.fullName}</strong>
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
                <button
                  onClick={() => setZoomScale(prev => Math.max(0.7, prev - 0.1))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-400">{Math.round(zoomScale * 100)}%</span>
                <button
                  onClick={() => setZoomScale(prev => Math.min(1.3, prev + 0.1))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomScale(1)}
                  className="p-1 text-slate-400 hover:text-white ml-1 border-l border-slate-800 pl-1.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Tree Graphical Structure with CSS lines */}
            <div className="overflow-x-auto py-6 flex justify-center items-center">
              <div 
                className="transition-transform duration-200 origin-top flex flex-col items-center min-w-[700px]"
                style={{ transform: `scale(${zoomScale})` }}
              >
                {/* Level 0: Root Member */}
                <div className="flex flex-col items-center relative">
                  <BinaryNode
                    member={focusedMember}
                    parentId=""
                    leg="root"
                    level={0}
                  />
                  {/* Stem down */}
                  <div className="w-0.5 h-6 bg-slate-700 my-0"></div>
                </div>

                {/* Horizontal Branch Bar */}
                <div className="w-[340px] sm:w-[460px] h-0.5 bg-slate-700 relative flex justify-between">
                  <div className="w-0.5 h-6 bg-slate-700 absolute left-0 top-0"></div>
                  <div className="w-0.5 h-6 bg-slate-700 absolute right-0 top-0"></div>
                </div>

                {/* Level 1: Left and Right Children */}
                <div className="w-[340px] sm:w-[460px] flex justify-between pt-6">
                  {/* Left Leg Subtree */}
                  <div className="flex flex-col items-center">
                    <BinaryNode
                      member={leftL1}
                      parentId={focusedMember.id}
                      leg="left"
                      level={1}
                    />

                    {/* Stem down to L2 */}
                    {leftL1 && (
                      <>
                        <div className="w-0.5 h-5 bg-slate-700 my-0"></div>
                        <div className="w-[180px] h-0.5 bg-slate-700 relative flex justify-between">
                          <div className="w-0.5 h-5 bg-slate-700 absolute left-0 top-0"></div>
                          <div className="w-0.5 h-5 bg-slate-700 absolute right-0 top-0"></div>
                        </div>

                        {/* Level 2 under Left */}
                        <div className="w-[200px] flex justify-between pt-5">
                          <BinaryNode
                            member={leftL2_Left}
                            parentId={leftL1.id}
                            leg="left"
                            level={2}
                          />
                          <BinaryNode
                            member={leftL2_Right}
                            parentId={leftL1.id}
                            leg="right"
                            level={2}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Leg Subtree */}
                  <div className="flex flex-col items-center">
                    <BinaryNode
                      member={rightL1}
                      parentId={focusedMember.id}
                      leg="right"
                      level={1}
                    />

                    {/* Stem down to L2 */}
                    {rightL1 && (
                      <>
                        <div className="w-0.5 h-5 bg-slate-700 my-0"></div>
                        <div className="w-[180px] h-0.5 bg-slate-700 relative flex justify-between">
                          <div className="w-0.5 h-5 bg-slate-700 absolute left-0 top-0"></div>
                          <div className="w-0.5 h-5 bg-slate-700 absolute right-0 top-0"></div>
                        </div>

                        {/* Level 2 under Right */}
                        <div className="w-[200px] flex justify-between pt-5">
                          <BinaryNode
                            member={rightL2_Left}
                            parentId={rightL1.id}
                            leg="left"
                            level={2}
                          />
                          <BinaryNode
                            member={rightL2_Right}
                            parentId={rightL1.id}
                            leg="right"
                            level={2}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tree Footnote Indicator */}
            <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                  Left Leg Team
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                  Right Leg Team
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm border border-dashed border-slate-500 inline-block"></span>
                  Vacant Position (Ready for Spillover)
                </span>
              </div>
              <span>Click any node to inspect detailed volume & sponsor metrics</span>
            </div>
          </div>

          {/* Node Inspector Panel (1 col) */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-semibold text-slate-400">Node Inspector</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{selectedNode.distributorCode}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedNode.avatar}
                    alt={selectedNode.fullName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedNode.fullName}</h3>
                    <p className="text-xs text-slate-400 font-mono">@{selectedNode.username}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                      {selectedNode.rank} Director
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Join Date:</span>
                    <span className="text-white font-mono">{selectedNode.joinDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Personal PV:</span>
                    <span className="text-emerald-400 font-mono font-bold tabular-nums">{selectedNode.personalPV} PV</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Left Leg PV:</span>
                    <span className="text-blue-400 font-mono font-bold tabular-nums">{formatNumber(selectedNode.leftLegPV)} PV</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Right Leg PV:</span>
                    <span className="text-emerald-400 font-mono font-bold tabular-nums">{formatNumber(selectedNode.rightLegPV)} PV</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Total Matched Pairs:</span>
                    <span className="text-white font-mono tabular-nums">{selectedNode.matchedPairsCount} pairs</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Direct Sponsorees:</span>
                    <span className="text-white font-mono tabular-nums">{selectedNode.totalDirects} members</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Total Downlines:</span>
                    <span className="text-white font-mono tabular-nums">{selectedNode.totalTeamCount} members</span>
                  </div>
                </div>

                {/* Placement buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onOpenEnrollModalWithPlacement(selectedNode.id, 'left')}
                    className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Place Downline on Left Leg</span>
                  </button>
                  <button
                    onClick={() => onOpenEnrollModalWithPlacement(selectedNode.id, 'right')}
                    className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Place Downline on Right Leg</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a member on the tree to inspect details
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Unilevel Generation View */
        <div className="space-y-6">
          {/* Generation 1 */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Generation 1 (Personally Sponsored Directs)</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    5% Product Override
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distributors registered directly with your personal referral link ({gen1.length} Active Directs)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gen1.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.fullName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.fullName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{m.distributorCode} · {m.rank}</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Personal: {m.personalPV} PV</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="block text-slate-400 text-[10px]">Team Size</span>
                    <span className="font-mono font-bold text-white tabular-nums">{m.totalTeamCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generation 2 */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Generation 2 (Sponsored by Gen 1)</span>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
                    4% Product Override
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Second level distributors duplicated by your personal direct leaders ({gen2.length} Members)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gen2.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.fullName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.fullName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{m.distributorCode} · {m.rank}</p>
                      <p className="text-[10px] text-blue-400 font-mono mt-0.5">Personal: {m.personalPV} PV</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="block text-slate-400 text-[10px]">Team Size</span>
                    <span className="font-mono font-bold text-white tabular-nums">{m.totalTeamCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
