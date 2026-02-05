"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  FileText,
  DollarSign,
  Download,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";

const cptCodes = [
  { code: "99457", description: "RPM Treatment Management", mapped: true, claims: 156, revenue: "$12,480" },
  { code: "99458", description: "Additional RPM Time", mapped: true, claims: 89, revenue: "$5,340" },
  { code: "99490", description: "Chronic Care Management", mapped: true, claims: 67, revenue: "$8,710" },
  { code: "99491", description: "Complex CCM", mapped: false, claims: 0, revenue: "$0" },
];

const ITEMS_PER_PAGE = 3;

type FilterType = "all" | "mapped" | "unmapped" | "with-claims";

export function BillingSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const mappedCodes = cptCodes.filter(c => c.mapped);
  const unmappedCodes = cptCodes.filter(c => !c.mapped);
  const totalClaims = cptCodes.reduce((sum, c) => sum + c.claims, 0);

  const filteredCptCodes = cptCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
           code.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "mapped":
        return code.mapped;
      case "unmapped":
        return !code.mapped;
      case "with-claims":
        return code.claims > 0;
      default:
        return true;
    }
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCptCodes.length / ITEMS_PER_PAGE);
  const paginatedCptCodes = filteredCptCodes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing & RPM</h1>
            <p className="text-muted-foreground">Manage billing, claims, and RPM codes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Claims
            </Button>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              New Claim
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search CPT codes..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{cptCodes.length}</div>
                <div className="text-xs text-muted-foreground">Total CPT Codes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "mapped" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("mapped")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mappedCodes.length}</div>
                <div className="text-xs text-muted-foreground">Mapped Codes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "unmapped" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("unmapped")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{unmappedCodes.length}</div>
                <div className="text-xs text-muted-foreground">Unmapped Codes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-claims" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("with-claims")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalClaims}</div>
                <div className="text-xs text-muted-foreground">Total Claims</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
        {/* CPT Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              CPT Code Mapping ({filteredCptCodes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedCptCodes.map((code) => (
                <div key={code.code} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{code.code}</span>
                      {code.mapped ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{code.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{code.revenue}</div>
                    <div className="text-xs text-muted-foreground">{code.claims} claims</div>
                  </div>
                </div>
              ))}
              {filteredCptCodes.length > ITEMS_PER_PAGE && (
                <PaginationControlled
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredCptCodes.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Monthly Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Submitted Claims</span>
                <span className="font-medium">312</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Approved</span>
                <span className="font-medium text-green-600">289 (93%)</span>
              </div>
              <Progress value={93} className="h-2 [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Pending</span>
                <span className="font-medium text-yellow-600">23 (7%)</span>
              </div>
              <Progress value={7} className="h-2 [&>div]:bg-yellow-500" />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Billed</span>
                <span className="font-bold">$48,530</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Collected</span>
                <span className="font-bold text-green-600">$45,250</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
