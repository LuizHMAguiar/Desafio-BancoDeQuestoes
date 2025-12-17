import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types/question';
import { QuestionCard } from './QuestionCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Download, Search, X, Plus } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  // Removi categories e subjects das props pois vamos calcular dinamicamente
  onDeleteQuestion: (id: number) => void;
  onCreateNew?: () => void;
}

export function QuestionList({
  questions,
  onDeleteQuestion,
  onCreateNew,
}: QuestionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // CORREÇÃO 1: Extrair disciplinas (subjects) diretamente das questões
  const uniqueSubjects = useMemo(() => {
    // Pegamos o subject de cada questão, filtramos nulos/indefinidos e removemos duplicatas
    const subjects = new Set<string>(
      questions
        ?.map((q) => q.subject)
        .filter((s): s is string => !!s) // Remove undefined (como no ID 31) e garante tipo string
    );
    return Array.from(subjects).sort();
  }, [questions]);

  // Get unique authors
  const authors = useMemo(() => {
    const uniqueAuthors = Array.from(
      new Set(questions?.map((q) => q.authorName).filter(Boolean))
    );
    return uniqueAuthors.sort();
  }, [questions]);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    questions?.forEach((q) => q.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return (
      questions?.filter((question) => {
        // Ignora questões quebradas (sem enunciado ou ID)
        if (!question.statement) return false;

        // Filter by search term
        if (
          searchTerm &&
          !question.statement.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        // Filter by Subject
        if (
          selectedSubject !== 'all' &&
          question.subject !== selectedSubject
        ) {
          return false;
        }

        // Filter by author
        if (
          selectedAuthor !== 'all' &&
          question.authorName !== selectedAuthor
        ) {
          return false;
        }

        // Filter by tags
        if (selectedTags.length > 0) {
          const hasAllTags = selectedTags.every((tag) =>
            question.tags?.includes(tag)
          );
          if (!hasAllTags) return false;
        }

        return true;
      }) ?? []
    );
  }, [questions, searchTerm, selectedSubject, selectedAuthor, selectedTags]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedAuthor('all');
    setSelectedTags([]);
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Professor',
      'Disciplina',
      'Tags',
      'Enunciado',
      'Opção A',
      'Opção B',
      'Opção C',
      'Opção D',
      'Opção E',
      'Resposta Correta',
      'Data de Criação',
    ];

    const rows = filteredQuestions.map((q) => [
      q.id,
      q.authorName,
      q.subject, // Corrigido de q.Subject para q.subject (case sensitive)
      q.tags?.join('; ') || '',
      q.statement?.replace(/"/g, '""') || '',
      q.options?.[0]?.replace(/"/g, '""') || '',
      q.options?.[1]?.replace(/"/g, '""') || '',
      q.options?.[2]?.replace(/"/g, '""') || '',
      q.options?.[3]?.replace(/"/g, '""') || '',
      q.options?.[4]?.replace(/"/g, '""') || '',
      String.fromCharCode(65 + (q.correctOption || 0)),
      q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : '',
    ]);

    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `questoes_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedSubject !== 'all' ||
    selectedAuthor !== 'all' ||
    selectedTags.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters Section */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl">Filtros</h2>
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar filtros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="search">Assunto</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          {/* Subject Filter CORRIGIDO */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="Subject">Disciplina</Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger id="Subject">
                <SelectValue placeholder="Todas as disciplinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as disciplinas</SelectItem>
                {/* Aqui usamos a lista gerada dinamicamente */}
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Author Filter */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="author">Professor</Label>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger id="author">
                <SelectValue placeholder="Todos os professores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os professores</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <motion.div
            className="mt-3 sm:mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <motion.div
                  key={`${tag}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <p className="text-gray-700 text-sm sm:text-base">
            {questions.length === 0
              ? 'Nenhuma questão disponível'
              : `${filteredQuestions.length} ${
                  filteredQuestions.length === 1
                    ? 'questão encontrada'
                    : 'questões encontradas'
                }`}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto"
        >
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={filteredQuestions.length === 0 || questions.length === 0}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </motion.div>
      </motion.div>

      {/* Questions List */}
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence mode="popLayout">
          {questions.length === 0 ? (
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="space-y-4">
                <div className="text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma questão disponível
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comece criando sua primeira questão para o banco de
                    questões.
                  </p>
                  <Button onClick={onCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Questão
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : filteredQuestions?.length === 0 ? (
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="space-y-4">
                <div className="text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma questão encontrada
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar os filtros de busca para encontrar mais
                    resultados.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            filteredQuestions?.map((question, index) => (
              <motion.div
                key={String(question.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
              >
                <QuestionCard
                  question={question}
                  onDelete={() => onDeleteQuestion(question.id ?? 0)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}