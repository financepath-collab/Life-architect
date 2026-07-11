import React, { useState } from "react";
import { PurchaseEntry, StockEntry } from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  DollarSign, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Calculator,
  RefreshCw,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

interface FinanceTrackerProps {
  purchases: PurchaseEntry[];
  addPurchase: (entry: Omit<PurchaseEntry, "id">) => void;
  deletePurchase: (id: string) => void;
  stocks: StockEntry[];
  addStock: (entry: Omit<StockEntry, "id" | "lastUpdated">) => void;
  updateStockPrice: (id: string, currentPrice: number) => void;
  deleteStock: (id: string) => void;
}

export default function FinanceTracker({
  purchases,
  addPurchase,
  deletePurchase,
  stocks,
  addStock,
  updateStockPrice,
  deleteStock
}: FinanceTrackerProps) {
  // Purchases form state
  const [purchaseDesc, setPurchaseDesc] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseCat, setPurchaseCat] = useState<PurchaseEntry["category"]>("Business");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);

  // Stocks form state
  const [stockSymbol, setStockSymbol] = useState("");
  const [stockName, setStockName] = useState("");
  const [stockBuyPrice, setStockBuyPrice] = useState("");
  const [stockQty, setStockQty] = useState("");

  // Price updating state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");

  // Calculate totals
  const totalPurchases = purchases.reduce((acc, p) => acc + p.amount, 0);

  const stockPortfolioCost = stocks.reduce((acc, s) => acc + s.buyPrice * s.quantity, 0);
  const stockPortfolioValue = stocks.reduce((acc, s) => acc + s.currentPrice * s.quantity, 0);
  const stockNetProfitLoss = stockPortfolioValue - stockPortfolioCost;
  const stockProfitPercentage = stockPortfolioCost > 0 ? (stockNetProfitLoss / stockPortfolioCost) * 100 : 0;

  // Handles adding purchase
  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseDesc.trim() || !purchaseAmount || isNaN(Number(purchaseAmount))) return;
    addPurchase({
      date: purchaseDate,
      description: purchaseDesc.trim(),
      category: purchaseCat,
      amount: Math.abs(Number(purchaseAmount))
    });
    setPurchaseDesc("");
    setPurchaseAmount("");
  };

  // Handles adding stock
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol.trim() || !stockName.trim() || !stockBuyPrice || !stockQty) return;
    if (isNaN(Number(stockBuyPrice)) || isNaN(Number(stockQty))) return;
    addStock({
      symbol: stockSymbol.trim().toUpperCase(),
      name: stockName.trim(),
      buyPrice: Math.abs(Number(stockBuyPrice)),
      currentPrice: Math.abs(Number(stockBuyPrice)), // starts equal to buy price
      quantity: Math.abs(Number(stockQty))
    });
    setStockSymbol("");
    setStockName("");
    setStockBuyPrice("");
    setStockQty("");
  };

  const startEditingPrice = (stock: StockEntry) => {
    setEditingStockId(stock.id);
    setTempPrice(stock.currentPrice.toString());
  };

  const handleUpdatePrice = (id: string) => {
    if (isNaN(Number(tempPrice)) || Number(tempPrice) < 0) return;
    updateStockPrice(id, Number(tempPrice));
    setEditingStockId(null);
  };

  // Group purchases by category for progress bars
  const purchaseCategories: Record<PurchaseEntry["category"], number> = {
    Business: 0,
    Marketing: 0,
    Stock: 0,
    Personnel: 0,
    Autres: 0
  };
  purchases.forEach(p => {
    if (purchaseCategories[p.category] !== undefined) {
      purchaseCategories[p.category] += p.amount;
    }
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Purchases Card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total des Achats</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold font-display text-white">
              {totalPurchases.toLocaleString("fr-FR")} <span className="text-xs text-slate-400 font-sans font-normal">MAD</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Dépenses opérationnelles cumulées pour vos chaînes et votre site.
            </p>
          </div>
        </div>

        {/* Bourse Portfolio Value Card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Valeur du Portefeuille Bourse</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold font-display text-white">
              {stockPortfolioValue.toLocaleString("fr-FR")} <span className="text-xs text-slate-400 font-sans font-normal">MAD</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              Coût d'acquisition: <strong className="text-slate-300">{stockPortfolioCost.toLocaleString("fr-FR")} MAD</strong>
            </p>
          </div>
        </div>

        {/* Portfolio Gains Card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Performance Boursière</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              stockNetProfitLoss >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
            }`}>
              {stockNetProfitLoss >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-3xl font-bold font-display ${stockNetProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {stockNetProfitLoss >= 0 ? "+" : ""}{stockNetProfitLoss.toLocaleString("fr-FR")} <span className="text-xs font-sans font-normal">MAD</span>
            </h3>
            <p className="text-xs mt-2 flex items-center gap-1">
              <span className={`font-semibold ${stockNetProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {stockNetProfitLoss >= 0 ? "▲" : "▼"} {stockProfitPercentage.toFixed(2)}%
              </span>
              <span className="text-slate-400">de gains latents</span>
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns: Purchases & Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Purchases Column (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">Suivi des Achats</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Excel-Style Ledger</span>
          </div>

          {/* Add Purchase Form */}
          <form onSubmit={handleAddPurchase} className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/30 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Catégorie</label>
                <select
                  value={purchaseCat}
                  onChange={(e) => setPurchaseCat(e.target.value as any)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Business">Business (Matériel/Abo)</option>
                  <option value="Marketing">Marketing (Pubs/Facebook)</option>
                  <option value="Stock">Investissement Bourse</option>
                  <option value="Personnel">Routines / Personnel</option>
                  <option value="Autres">Autres dépenses</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={purchaseDesc}
                onChange={(e) => setPurchaseDesc(e.target.value)}
                placeholder="Description (ex: Micro Rode, Pub Facebook)"
                className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="Montant (MAD)"
                className="w-24 bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Category Allocation Visualizer */}
          <div className="bg-slate-900/20 border border-slate-800 p-4 rounded-xl space-y-2.5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Ventilation des Dépenses</span>
            <div className="space-y-2">
              {Object.entries(purchaseCategories).map(([cat, amount]) => {
                const percentage = totalPurchases > 0 ? (amount / totalPurchases) * 100 : 0;
                if (amount === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{cat}</span>
                      <span className="font-mono text-[11px]">{amount.toLocaleString("fr-FR")} MAD ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {totalPurchases === 0 && (
                <span className="text-xs text-slate-500 italic block text-center py-2">Aucune ventilation disponible.</span>
              )}
            </div>
          </div>

          {/* Purchases List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {purchases.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Aucun achat enregistré.</p>
            ) : (
              purchases.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/30 text-xs">
                  <div>
                    <div className="font-medium text-slate-200">{p.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex gap-2">
                      <span>{p.date}</span>
                      <span>•</span>
                      <span className="text-emerald-500/80">{p.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-slate-100">{p.amount.toLocaleString("fr-FR")} MAD</span>
                    <button
                      onClick={() => deletePurchase(p.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stock Market (Bourse) Column (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">Suivi de la Bourse (Hebdomadaire)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Actions / OPCVM</span>
          </div>

          {/* Add Stock Form */}
          <form onSubmit={handleAddStock} className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/30 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Symbole</label>
                <input
                  type="text"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value)}
                  placeholder="Ex: ATW (Attijari)"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nom de l'actif</label>
                <input
                  type="text"
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  placeholder="Attijariwafa"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Prix d'Achat (MAD)</label>
                <input
                  type="number"
                  value={stockBuyPrice}
                  onChange={(e) => setStockBuyPrice(e.target.value)}
                  placeholder="Ex: 510"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Quantité</label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  placeholder="Ex: 25"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ajouter l'actif au Portefeuille
            </button>
          </form>

          {/* Stocks Ledger Table */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider bg-slate-900/60">
                  <th className="py-3 px-4">Valeur</th>
                  <th className="py-3 px-2 text-right">Qté</th>
                  <th className="py-3 px-2 text-right">Achat</th>
                  <th className="py-3 px-2 text-right">Cours Actuel (MAD)</th>
                  <th className="py-3 px-2 text-right">Valeur Actuelle</th>
                  <th className="py-3 px-2 text-right">Gain / Perte</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {stocks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                      Aucun actif dans le portefeuille boursier.
                    </td>
                  </tr>
                ) : (
                  stocks.map((stock) => {
                    const cost = stock.buyPrice * stock.quantity;
                    const val = stock.currentPrice * stock.quantity;
                    const diff = val - cost;
                    const diffPercent = cost > 0 ? (diff / cost) * 100 : 0;
                    const isEditing = editingStockId === stock.id;

                    return (
                      <tr key={stock.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{stock.symbol}</div>
                          <div className="text-[10px] text-slate-400">{stock.name}</div>
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono text-slate-300">
                          {stock.quantity}
                        </td>
                        <td className="py-3.5 px-2 text-right font-mono text-slate-400">
                          {stock.buyPrice.toFixed(1)}
                        </td>
                        
                        {/* Course / Actual Price cell */}
                        <td className="py-3.5 px-2 text-right font-mono">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-right text-xs text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdatePrice(stock.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-bold"
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingPrice(stock)}
                              className="text-white hover:text-emerald-400 font-semibold border-b border-dashed border-slate-600 hover:border-emerald-400 inline-block"
                              title="Cliquez pour mettre à jour le cours"
                            >
                              {stock.currentPrice.toFixed(1)}
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-2 text-right font-semibold text-white font-mono">
                          {val.toLocaleString("fr-FR")}
                        </td>

                        <td className={`py-3.5 px-2 text-right font-mono font-semibold ${
                          diff >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}>
                          <div>{diff >= 0 ? "+" : ""}{diff.toFixed(1)}</div>
                          <div className="text-[9px] font-normal">{diff >= 0 ? "▲" : "▼"}{diffPercent.toFixed(1)}%</div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => deleteStock(stock.id)}
                            className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/40 inline-block transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-900/40 p-3 rounded-lg">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Mettez à jour le cours de vos actions une fois par semaine en cliquant sur le prix actuel. Les gains ou pertes sont recalculés instantanément.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
