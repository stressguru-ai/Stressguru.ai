import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Download,
  Mail,
  Eye,
  ArrowLeft,
  RefreshCw,
  Search,
  TrendingUp,
  BarChart3,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

type SortField = "createdAt" | "name" | "email" | "score" | "tierTitle" | "primaryGuru";
type SortDirection = "asc" | "desc";

function formatDate(dateStr: string | Date) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTierColor(tierTitle: string) {
  switch (tierTitle) {
    case "Flourishing":
      return "bg-green-100 text-green-700";
    case "Prevention":
      return "bg-yellow-100 text-yellow-700";
    case "Recovery":
      return "bg-orange-100 text-orange-700";
    case "Stabilization":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getScoreColor(score: number) {
  if (score <= 30) return "text-green-600";
  if (score <= 60) return "text-yellow-600";
  if (score <= 85) return "text-orange-600";
  return "text-red-600";
}

function getDomainLabel(domain: string) {
  const labels: Record<string, string> = {
    stress: "Stress",
    sleep: "Sleep",
    anxiety: "Anxiety",
    relationship: "Relationships",
    motivation: "Motivation",
    calm: "Calm",
    spiritual: "Spiritual",
  };
  return labels[domain] || domain;
}

function getDomainBarColor(domain: string) {
  const colors: Record<string, string> = {
    stress: "bg-red-500",
    sleep: "bg-indigo-500",
    anxiety: "bg-amber-500",
    relationship: "bg-pink-500",
    motivation: "bg-emerald-500",
    calm: "bg-cyan-500",
    spiritual: "bg-purple-500",
  };
  return colors[domain] || "bg-gray-500";
}

// Detail View Component
function LeadDetail({
  leadId,
  onBack,
}: {
  leadId: number;
  onBack: () => void;
}) {
  const { data: lead, isLoading } = trpc.stressLeads.getById.useQuery({ id: leadId });
  const resendMutation = trpc.stressLeads.resendEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Report email resent successfully!");
      } else {
        toast.error("Failed to resend email. Please try again.");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to resend email.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#7BDDE5]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Lead not found.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  const domainAverages = (lead.domainAverages || {}) as Record<string, number>;
  const bodyMapAreas = (lead.bodyMapAreas || []) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Lead Details</h2>
        <div className="ml-auto">
          <Button
            onClick={() => resendMutation.mutate({ id: leadId })}
            disabled={resendMutation.isPending}
            className="bg-[#7BDDE5] hover:bg-[#6bcdd5] text-slate-900"
          >
            {resendMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Resend Report Email
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Name</div>
              <div className="text-lg font-semibold text-slate-900">{lead.name}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email</div>
              <a href={`mailto:${lead.email}`} className="text-[#7BDDE5] hover:underline font-medium">
                {lead.email}
              </a>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Submitted</div>
              <div className="text-slate-700">{formatDate(lead.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Status</div>
              <div className="flex items-center gap-2">
                {lead.emailSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-700 font-medium">Sent</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700 font-medium">Failed</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-5xl font-black ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
              <div className="text-sm text-slate-500 mt-1">out of 100</div>
            </div>
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getTierColor(lead.tierTitle)}`}>
                {lead.tierTitle}
              </span>
            </div>
            <div className="text-center text-sm text-slate-600">
              Reported pressure score: <strong>{lead.stressLevel}/9</strong>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Suggested AI Guru</div>
              <div className="text-lg font-bold text-slate-900">{lead.primaryGuru} Guru</div>
              {lead.secondaryGuru && (
                <div className="text-sm text-slate-500 mt-1">
                  Secondary: {lead.secondaryGuru} Guru
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Body Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Body Tension Areas</CardTitle>
          </CardHeader>
          <CardContent>
            {bodyMapAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {bodyMapAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100"
                  >
                    {area}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No body tension areas reported.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Domain Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(domainAverages)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([domain, avg]) => (
                <div key={domain} className="flex items-center gap-4">
                  <div className="w-28 text-sm font-medium text-slate-700">
                    {getDomainLabel(domain)}
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getDomainBarColor(domain)}`}
                      style={{ width: `${((avg as number) / 3) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-bold text-slate-700">
                    {((avg as number) / 3 * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tier Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">
            {lead.tierTitle === "Flourishing"
              ? "The answers in this check-in reflect lower reported pressure. The result is a wellness summary, not a clinical assessment."
              : lead.tierTitle === "Prevention"
              ? "The answers reflect some pressure worth noticing. A small routine or clearer boundary may be a useful place to start."
              : lead.tierTitle === "Recovery"
              ? "The answers reflect high pressure across this check-in. The report should encourage practical support and professional care when symptoms persist or affect daily functioning."
              : "The answers reflect very high pressure. The report should state that StressGuru is not crisis care and provide 988 and emergency guidance where safety may be at risk."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Leads Page
export default function StressLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { data: leadsData, isLoading } = trpc.stressLeads.list.useQuery();
  const leads = leadsData?.leads ?? [];
  const { data: stats, isLoading: statsLoading } = trpc.stressLeads.stats.useQuery();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-1" />
    );
  };

  const filteredAndSortedLeads = useMemo(() => {
    if (!leads || leads.length === 0) return [];
    let filtered = [...leads];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l: any) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.primaryGuru.toLowerCase().includes(q) ||
          l.tierTitle.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "createdAt":
          return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case "name":
          return dir * a.name.localeCompare(b.name);
        case "email":
          return dir * a.email.localeCompare(b.email);
        case "score":
          return dir * (a.score - b.score);
        case "tierTitle":
          return dir * a.tierTitle.localeCompare(b.tierTitle);
        case "primaryGuru":
          return dir * a.primaryGuru.localeCompare(b.primaryGuru);
        default:
          return 0;
      }
    });
  }, [leads, searchQuery, sortField, sortDirection]);

  const handleExportCsv = async () => {
    try {
      const response = await fetch("/api/trpc/stressLeads.exportCsv", {
        credentials: "include",
      });
      const json = await response.json();
      const csvContent = json?.result?.data;
      if (!csvContent) {
        toast.error("Failed to generate CSV.");
        return;
      }
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stress-leads-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV.");
    }
  };

  if (selectedLeadId) {
    return (
      <AdminLayout>
        <LeadDetail
          leadId={selectedLeadId}
          onBack={() => setSelectedLeadId(null)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Stress Assessment Leads</h1>
            <p className="text-slate-600 mt-1">
              View and manage stress assessment submissions
            </p>
          </div>
          <Button
            onClick={handleExportCsv}
            className="bg-[#7BDDE5] hover:bg-[#6bcdd5] text-slate-900"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
              <Users className="w-5 h-5 text-[#7BDDE5]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsLoading ? "..." : stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Score</CardTitle>
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsLoading ? "..." : stats?.avgScore ? Math.round(stats.avgScore) : "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Emails Sent</CardTitle>
              <Mail className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsLoading ? "..." : stats?.emailsSent || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">This Week</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {statsLoading ? "..." : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, guru, or tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7BDDE5]/30 focus:border-[#7BDDE5] text-sm"
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#7BDDE5]" />
              </div>
            ) : filteredAndSortedLeads.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  {searchQuery ? "No leads match your search." : "No leads yet."}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Leads will appear here when users complete the stress assessment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th
                        className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("name")}
                      >
                        Name <SortIcon field="name" />
                      </th>
                      <th
                        className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("email")}
                      >
                        Email <SortIcon field="email" />
                      </th>
                      <th
                        className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("score")}
                      >
                        Score <SortIcon field="score" />
                      </th>
                      <th
                        className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("tierTitle")}
                      >
                        Tier <SortIcon field="tierTitle" />
                      </th>
                      <th
                        className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("primaryGuru")}
                      >
                        Guru <SortIcon field="primaryGuru" />
                      </th>
                      <th
                        className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                        onClick={() => handleSort("createdAt")}
                      >
                        Date <SortIcon field="createdAt" />
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAndSortedLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedLeadId(lead.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getTierColor(lead.tierTitle)}`}>
                            {lead.tierTitle}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-medium text-slate-700">
                            {lead.primaryGuru}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-slate-500">
                            {formatDate(lead.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {lead.emailSent ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLeadId(lead.id);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
