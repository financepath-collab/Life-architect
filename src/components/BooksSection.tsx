import React, { useState } from "react";
import { BookItem } from "../types";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Star, 
  Bookmark, 
  CheckCircle, 
  TrendingUp, 
  X, 
  Check,
  ChevronRight,
  BookMarked,
  Edit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BooksSectionProps {
  books: BookItem[];
  setBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
}

export default function BooksSection({ books, setBooks }: BooksSectionProps) {
  const [filter, setFilter] = useState<"Tous" | "En cours" | "À lire" | "Terminé">("Tous");
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(200);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"À lire" | "En cours" | "Terminé">("En cours");

  // Editing notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newBook: BookItem = {
      id: "b_" + Date.now(),
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim() || "Développement Personnel",
      currentPage: status === "Terminé" ? totalPages : Number(currentPage) || 0,
      totalPages: Number(totalPages) || 1,
      rating: status === "Terminé" ? rating : 0,
      notes: notes.trim(),
      status
    };

    setBooks(prev => [newBook, ...prev]);
    
    // Reset form
    setTitle("");
    setAuthor("");
    setGenre("");
    setCurrentPage(0);
    setTotalPages(200);
    setRating(0);
    setNotes("");
    setStatus("En cours");
    setShowAddForm(false);
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const updatePage = (id: string, newPage: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;
      const validatedPage = Math.max(0, Math.min(newPage, b.totalPages));
      const newStatus = validatedPage === b.totalPages ? "Terminé" : b.status;
      return { 
        ...b, 
        currentPage: validatedPage,
        status: newStatus as any
      };
    }));
  };

  const changeStatus = (id: string, newStatus: "À lire" | "En cours" | "Terminé") => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;
      let curPage = b.currentPage;
      if (newStatus === "Terminé") curPage = b.totalPages;
      if (newStatus === "À lire") curPage = 0;
      return {
        ...b,
        status: newStatus,
        currentPage: curPage
      };
    }));
  };

  const setBookRating = (id: string, rate: number) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, rating: rate } : b));
  };

  const saveNotes = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, notes: tempNotes } : b));
    setEditingNotesId(null);
  };

  // Filtered lists
  const currentlyReading = books.filter(b => b.status === "En cours");
  const toRead = books.filter(b => b.status === "À lire");
  const finished = books.filter(b => b.status === "Terminé");

  const displayedBooks = books.filter(b => {
    if (filter === "Tous") return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. CURRENTLY READING - HERO AREA */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[40%] h-[150%] rounded-full bg-neutral-800 blur-3xl pointer-events-none opacity-55" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase font-mono">Lecture En Cours</span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {currentlyReading.length} livre{currentlyReading.length > 1 ? "s" : ""} en cours de lecture
            </span>
          </div>

          {currentlyReading.length === 0 ? (
            <div className="py-6 text-center text-neutral-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-300" />
              <p className="text-xs font-semibold">Aucun livre en cours de lecture active.</p>
              <p className="text-[10px] text-neutral-500 mt-1">Commencez l'un de vos livres ci-dessous en changeant son statut.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentlyReading.map(book => {
                const percent = Math.round((book.currentPage / book.totalPages) * 100) || 0;
                return (
                  <div key={book.id} className="bg-neutral-800/50 border border-neutral-700/60 rounded-2xl p-5 space-y-4 transition-all hover:bg-neutral-800/80">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full font-bold font-mono">
                          {book.genre}
                        </span>
                        <h4 className="text-sm font-extrabold text-white mt-1 leading-snug">{book.title}</h4>
                        <p className="text-xs text-neutral-400 font-semibold">{book.author}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black font-mono text-emerald-400">{percent}%</span>
                        <span className="text-[10px] text-neutral-400 font-semibold mt-0.5 font-mono">{book.currentPage} / {book.totalPages} pages</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>

                    {/* Interactive Page Incrementor */}
                    <div className="flex items-center justify-between gap-3 bg-neutral-800 p-2.5 rounded-xl border border-neutral-700/60">
                      <span className="text-[10px] text-neutral-400 font-bold font-sans uppercase">Mettre à jour la page :</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => updatePage(book.id, book.currentPage - 10)}
                          className="w-7 h-7 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                          title="-10 Pages"
                        >
                          -10
                        </button>
                        <button 
                          onClick={() => updatePage(book.id, book.currentPage - 1)}
                          className="w-7 h-7 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                          title="-1 Page"
                        >
                          -1
                        </button>
                        <input 
                          type="number"
                          value={book.currentPage}
                          onChange={(e) => updatePage(book.id, Number(e.target.value))}
                          className="w-12 h-7 bg-neutral-900 border border-neutral-700 text-white text-center font-mono text-xs rounded-lg focus:outline-none focus:border-emerald-400"
                        />
                        <button 
                          onClick={() => updatePage(book.id, book.currentPage + 1)}
                          className="w-7 h-7 bg-neutral-700 hover:bg-emerald-500 hover:text-white text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                          title="+1 Page"
                        >
                          +1
                        </button>
                        <button 
                          onClick={() => updatePage(book.id, book.currentPage + 10)}
                          className="w-7 h-7 bg-neutral-700 hover:bg-emerald-500 hover:text-white text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                          title="+10 Pages"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    {/* Note editor for book */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-bold">Notes & Idées clés :</span>
                        {editingNotesId === book.id ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => saveNotes(book.id)} className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"><Check className="w-3 h-3" /> Enregistrer</button>
                            <button onClick={() => setEditingNotesId(null)} className="text-neutral-500 hover:text-neutral-400"><X className="w-3 h-3" /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingNotesId(book.id); setTempNotes(book.notes); }} className="text-neutral-400 hover:text-white flex items-center gap-1"><Edit className="w-3 h-3" /> Modifier</button>
                        )}
                      </div>
                      
                      {editingNotesId === book.id ? (
                        <textarea 
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                          rows={2}
                          placeholder="Notez des concepts importants ou leçons..."
                        />
                      ) : (
                        <p className="text-xs text-neutral-300 italic bg-neutral-800/75 p-2 rounded-lg leading-relaxed min-h-[36px]">
                          {book.notes || "Pas encore de notes saisies. Cliquez sur Modifier pour ajouter des idées."}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">À lire absolument (Wishlist)</span>
            <span className="text-base font-extrabold font-mono text-neutral-900 block">{toRead.length} livre{toRead.length > 1 ? "s" : ""}</span>
          </div>
          <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Bookmark className="w-4 h-4" /></div>
        </div>
        
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Lectures Terminées</span>
            <span className="text-base font-extrabold font-mono text-neutral-900 block">{finished.length} livre{finished.length > 1 ? "s" : ""}</span>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100"><CheckCircle className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Taux d'achèvement</span>
            <span className="text-base font-extrabold font-mono text-neutral-900 block">
              {books.length > 0 ? Math.round((finished.length / books.length) * 100) : 0}% des livres
            </span>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><TrendingUp className="w-4 h-4" /></div>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE AREA: FILTERS + ADD ACTIONS */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          {/* Sub tabs filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(["Tous", "En cours", "À lire", "Terminé"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
                }`}
              >
                {tab === "Tous" ? "Tous les Livres" : tab === "À lire" ? "À Lire (Wishlist)" : tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer ml-auto"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? "Annuler" : "Ajouter un Livre"}</span>
          </button>
        </div>

        {/* 4. COLLAPSIBLE ADD BOOK FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              onSubmit={handleAddBook}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-4"
            >
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">
                Enregistrer un Nouveau Livre dans la Bibliothèque
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Titre du Livre *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: L'Autoroute du Millionnaire"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Auteur *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: MJ DeMarco"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Genre / Thématique</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Business / Finance"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Statut</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="À lire">À lire (Wishlist)</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Pages Totales</label>
                  <input 
                    type="number" 
                    min={1}
                    value={totalPages}
                    onChange={(e) => setTotalPages(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Page Actuelle</label>
                  <input 
                    type="number" 
                    min={0}
                    max={totalPages}
                    disabled={status === "À lire" || status === "Terminé"}
                    value={status === "À lire" ? 0 : status === "Terminé" ? totalPages : currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {status === "Terminé" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Note Personnelle (Stars)</label>
                    <div className="flex items-center gap-1 h-9">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-neutral-300 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${rating >= star ? "text-amber-400 fill-amber-400" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Notes, Idées Clés ou Résumé</label>
                <textarea 
                  placeholder="Ex: Leçons principales sur la création de richesse..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 transition-all cursor-pointer"
                >
                  Fermer
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Ajouter le Livre
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* 5. BOOKS GRID LIST */}
        {displayedBooks.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 italic bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
            Aucun livre ne correspond à cette sélection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBooks.map((book) => {
              const percent = Math.round((book.currentPage / book.totalPages) * 100) || 0;
              return (
                <div 
                  key={book.id}
                  className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-400 hover:bg-white transition-all shadow-3xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] bg-neutral-200/70 text-neutral-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                        {book.genre}
                      </span>
                      
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        book.status === "Terminé"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : book.status === "En cours"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        {book.status === "À lire" ? "À Lire" : book.status}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-neutral-900 leading-tight flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{book.title}</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-semibold pl-5">{book.author}</p>
                    </div>

                    {book.status !== "À lire" && (
                      <div className="space-y-1.5 pl-5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 font-semibold">Progression :</span>
                          <span className="font-mono font-bold text-neutral-800">{percent}% ({book.currentPage}/{book.totalPages} p)</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-1">
                          <div className="bg-neutral-900 h-1 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )}

                    {book.status === "Terminé" && book.rating > 0 && (
                      <div className="flex items-center gap-0.5 pl-5 pt-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${book.rating >= s ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                        ))}
                      </div>
                    )}

                    {book.notes && (
                      <div className="pl-5 pt-1">
                        <p className="text-[11px] text-neutral-500 bg-white border border-neutral-100 rounded-lg p-2 italic leading-relaxed">
                          {book.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 pl-5">
                    {/* Status Toggle control */}
                    <div className="flex items-center gap-1">
                      {book.status !== "En cours" && (
                        <button 
                          onClick={() => changeStatus(book.id, "En cours")}
                          className="text-[10px] font-bold text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Commencer
                        </button>
                      )}
                      {book.status !== "Terminé" && (
                        <button 
                          onClick={() => changeStatus(book.id, "Terminé")}
                          className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Marquer Lu
                        </button>
                      )}
                      {book.status !== "À lire" && (
                        <button 
                          onClick={() => changeStatus(book.id, "À lire")}
                          className="text-[10px] font-bold text-neutral-500 hover:bg-neutral-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          À lire
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => deleteBook(book.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ml-auto"
                      title="Supprimer ce livre"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
