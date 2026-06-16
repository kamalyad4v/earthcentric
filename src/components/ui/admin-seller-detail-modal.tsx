"use client";

import React, { useEffect, useState } from "react";
import { getSellerProfileById, getSellerDashboardStats, getSellerAnalyticsTimeSeries, SellerProfile } from "@/actions/sellers";
import { approveSeller, rejectSeller } from "@/actions/admin";
import { getProducts, ProductItem } from "@/actions/products";
import { AnalyticsData, SellerAnalyticsCharts } from "@/components/ui/seller-analytics-charts";
import { Button, Card, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/shared";
import { X, Building, CheckCircle2, Star, Package, MapPin, ExternalLink, Activity } from "lucide-react";
import { FadeIn } from "@/components/FramerComponents";

export interface AdminSellerDetailModalProps {
  sellerId: string;
  onClose: () => void;
  adminEmail?: string;
  onActionComplete?: () => void;
}

export function AdminSellerDetailModal({ sellerId, onClose, adminEmail, onActionComplete }: AdminSellerDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, productsCount: 0, rating: 4.8, mostSoldProduct: "" });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [badges, setBadges] = useState<string[]>(["Verified Business"]);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    try {
      await approveSeller(profile?.userId || sellerId, badges, adminEmail || "admin@earthcentric.com");
      if (onActionComplete) onActionComplete();
      onClose();
    } catch (err) {
      console.error("Failed to approve seller:", err);
    }
  };

  const handleReject = async () => {
    try {
      await rejectSeller(profile?.userId || sellerId, rejectReason || "Documents incomplete or invalid.", adminEmail || "admin@earthcentric.com");
      if (onActionComplete) onActionComplete();
      onClose();
    } catch (err) {
      console.error("Failed to reject seller:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchSellerDetails = async () => {
      setLoading(true);
      try {
        const [profData, statData, aData, prodData] = await Promise.all([
          getSellerProfileById(sellerId),
          getSellerDashboardStats(sellerId),
          getSellerAnalyticsTimeSeries(sellerId),
          getProducts({ sellerId })
        ]);

        if (mounted) {
          setProfile(profData);
          setStats(statData);
          setAnalyticsData(aData as AnalyticsData);
          setProducts(prodData);
        }
      } catch (err) {
        console.error("Failed to load seller detailed view:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSellerDetails();
    
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      mounted = false;
      document.body.style.overflow = 'auto';
    };
  }, [sellerId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <FadeIn className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {profile?.companyName || "Loading Seller..."}
              </h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Partner ID: {sellerId.substring(0, 10)}...
                </span>
                {profile?.verificationStatus && (
                  <Badge 
                    variant={
                      profile.verificationStatus === "APPROVED" ? "success" : 
                      profile.verificationStatus === "REJECTED" ? "danger" : "primary"
                    } 
                    className="text-[9px] py-0 border-none"
                  >
                    {profile.verificationStatus}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <Activity className="h-8 w-8 animate-spin text-primary/50" />
              <p className="text-xs font-medium uppercase tracking-widest">Compiling Partner Dossier...</p>
            </div>
          ) : !profile ? (
            <div className="h-64 flex flex-col items-center justify-center text-red-500/70 text-sm">
              <X className="h-8 w-8 mb-2" />
              <p>Seller profile not found or could not be loaded.</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* TOP ROW: Profile Details & Core Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profile Snapshot */}
                <Card className="lg:col-span-1 p-5 border-border/50 bg-muted/10 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">Business Profile</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Business Type</span>
                      <p className="font-semibold">{profile.businessType}</p>
                    </div>
                    {profile.description && (
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Description</span>
                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">{profile.description}</p>
                      </div>
                    )}
                    {(profile.website || profile.gstNumber || profile.panNumber) && (
                      <div className="pt-2 mt-2 border-t border-border/30 grid grid-cols-2 gap-3">
                        {profile.gstNumber && (
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">GST Code</span>
                            <p className="text-xs font-mono">{profile.gstNumber}</p>
                          </div>
                        )}
                        {profile.panNumber && (
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">PAN Code</span>
                            <p className="text-xs font-mono">{profile.panNumber}</p>
                          </div>
                        )}
                        {profile.website && (
                          <div className="col-span-2">
                            <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Website</span>
                            <a href={profile.website} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center">
                              {profile.website} <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {profile.badges.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-border/30">
                        <span className="text-[10px] text-muted-foreground uppercase block mb-1.5">Assigned Badges</span>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.badges.map((b, i) => (
                            <Badge key={i} variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/20">
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Core KPIs */}
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="p-4 border-border/40 bg-card flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Total Revenue</span>
                    <h3 className="text-xl sm:text-2xl font-black text-emerald-600">
                      ₹{stats.revenue.toLocaleString()}
                    </h3>
                  </Card>
                  
                  <Card className="p-4 border-border/40 bg-card flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Total Orders</span>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground">
                      {stats.ordersCount.toLocaleString()}
                    </h3>
                  </Card>

                  <Card className="p-4 border-border/40 bg-card flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2 text-muted-foreground">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Trust Score</span>
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground">{stats.rating}</h3>
                      <span className="text-[10px] text-muted-foreground">/ 5.0</span>
                    </div>
                  </Card>

                  <Card className="p-4 border-border/40 bg-card flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2 text-muted-foreground">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Top Product</span>
                      <Package className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2" title={stats.mostSoldProduct || "N/A"}>
                      {stats.mostSoldProduct || "N/A"}
                    </h3>
                  </Card>
                </div>
              </div>

              {/* TABS FOR DEEP DIVE */}
              <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="mb-6 overflow-x-auto flex-nowrap bg-muted/40 p-1">
                  <TabsTrigger value="analytics" className="text-xs">Performance Charts</TabsTrigger>
                  <TabsTrigger value="catalog" className="text-xs">Product Catalog ({products.length})</TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs">Verification Docs</TabsTrigger>
                </TabsList>

                {/* Tab: Analytics */}
                <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-card border border-border/40 rounded-xl p-4 shadow-sm">
                    {analyticsData ? (
                      <SellerAnalyticsCharts data={analyticsData} />
                    ) : (
                      <div className="py-12 text-center text-xs text-muted-foreground">Chart data unavailable.</div>
                    )}
                  </div>
                </TabsContent>

                {/* Tab: Catalog */}
                <TabsContent value="catalog" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Card className="border-border/40 bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/20 hover:bg-muted/20">
                            <TableHead className="w-12 text-xs">IMG</TableHead>
                            <TableHead className="text-xs">Product Name</TableHead>
                            <TableHead className="text-xs">Category</TableHead>
                            <TableHead className="text-xs">Price</TableHead>
                            <TableHead className="text-xs">Stock</TableHead>
                            <TableHead className="text-xs">Eco Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-10 text-xs text-muted-foreground">
                                This seller has not listed any products yet.
                              </TableCell>
                            </TableRow>
                          ) : (
                            products.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell>
                                  <img src={p.images[0]} alt={p.name} className="h-8 w-8 object-cover rounded shadow-sm border border-border/50" />
                                </TableCell>
                                <TableCell className="font-semibold text-xs text-foreground max-w-[200px] truncate" title={p.name}>
                                  {p.name}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{p.category}</TableCell>
                                <TableCell className="font-mono text-xs font-semibold">₹{p.price}</TableCell>
                                <TableCell className="text-xs">{p.stock} units</TableCell>
                                <TableCell>
                                  <Badge variant="primary" className="text-[9px] bg-primary/10 text-primary border-none">
                                    🌱 {p.sustainabilityScore}/100
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </TabsContent>

                {/* Tab: Documents */}
                <TabsContent value="documents" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.documents && profile.documents.length > 0 ? (
                      profile.documents.map((doc) => (
                        <Card key={doc.id} className="p-4 border-border/50 flex flex-col items-center text-center space-y-3 bg-muted/5 hover:bg-muted/20 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6" />
                          </div>
                          <div className="flex-1 w-full">
                            <p className="text-xs font-bold uppercase text-foreground mb-1">{doc.type.replace(/_/g, " ")}</p>
                            <p className="text-[10px] text-muted-foreground truncate w-full px-2" title={doc.fileName}>{doc.fileName}</p>
                          </div>
                          <Button variant="cool" size="sm" className="w-full text-xs py-1" onClick={() => window.open(doc.fileUrl, "_blank")}>
                            View Document
                          </Button>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
                        No verification documents were uploaded by this seller.
                      </div>
                    )}
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          )}
        </div>

        {/* Action Footer for Pending Status */}
        {!loading && profile && profile.verificationStatus === "PENDING" && (
          <div className="px-6 py-4 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Badges selection */}
            <div className="flex flex-col space-y-1.5 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Assign Seller Quality Badges
              </span>
              <div className="flex flex-wrap gap-4 text-xs font-medium">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badges.includes("Verified Business")}
                    onChange={(e) => {
                      if (e.target.checked) setBadges([...badges, "Verified Business"]);
                      else setBadges(badges.filter(b => b !== "Verified Business"));
                    }}
                    className="rounded text-primary border-border focus:ring-ring"
                  />
                  <span>Verified Business</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badges.includes("Verified Sustainable Manufacturer")}
                    onChange={(e) => {
                      if (e.target.checked) setBadges([...badges, "Verified Sustainable Manufacturer"]);
                      else setBadges(badges.filter(b => b !== "Verified Sustainable Manufacturer"));
                    }}
                    className="rounded text-primary border-border focus:ring-ring"
                  />
                  <span>Verified Sustainable Manufacturer</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badges.includes("Gold Eco Rating")}
                    onChange={(e) => {
                      if (e.target.checked) setBadges([...badges, "Gold Eco Rating"]);
                      else setBadges(badges.filter(b => b !== "Gold Eco Rating"));
                    }}
                    className="rounded text-primary border-border focus:ring-ring"
                  />
                  <span>Gold Eco Rating</span>
                </label>
              </div>
            </div>

            {/* Rejection input and Action buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <input
                type="text"
                placeholder="Rejection reason (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-transparent border border-border/60 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-primary w-48 inline-block"
              />
              <Button
                variant="ghost"
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold px-4 py-2 h-9 rounded-lg"
                onClick={handleReject}
              >
                Reject
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 h-9 rounded-lg"
                onClick={handleApprove}
              >
                Approve & Verify
              </Button>
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
