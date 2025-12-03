import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { QuestionForm } from './QuestionForm';
import { LogOut, ArrowLeft } from 'lucide-react';
import { Question, Category, User } from '../types/question';
import { Logo } from './Logo';
import { toast } from 'sonner';

interface EditQuestionPageProps {
  user: User;
  onLogout: () => void;
}

// Mock initial categories
const initialCategories: Category[] = [
  { id: '1', name: 'Matemática' },
  { id: '2', name: 'Português' },
  { id: '3', name: 'História' },
  { id: '4', name: 'Geografia' },
  { id: '5', name: 'Ciências' },
];

export function EditQuestionPage({ user, onLogout }: EditQuestionPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Load categories and question from localStorage
  useEffect(() => {
    // Try to load subjects from admin panel first, otherwise use initial categories
    const savedSubjects = localStorage.getItem('subjects');
    const savedCategories = localStorage.getItem('categories');

    // Prioritize subjects from admin panel
    if (savedSubjects) {
      const subjects = JSON.parse(savedSubjects);
      const categoriesFromSubjects = subjects.map((s: any) => ({
        id: s.id,
        name: s.name
      }));
      setCategories(categoriesFromSubjects);
      localStorage.setItem('categories', JSON.stringify(categoriesFromSubjects));
    } else if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(initialCategories);
      localStorage.setItem('categories', JSON.stringify(initialCategories));
    }

    // Load the question to edit
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions && id) {
      const questions: Question[] = JSON.parse(savedQuestions);
      const foundQuestion = questions.find(q => q.id === id);
      if (foundQuestion) {
        setQuestion(foundQuestion);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleUpdateQuestion = (updatedQuestion: Omit<Question, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => {
    if (!question) return;

    const editedQuestion: Question = {
      ...question,
      ...updatedQuestion,
    };

    // Load existing questions
    const savedQuestions = localStorage.getItem('questions');
    const questions = savedQuestions ? JSON.parse(savedQuestions) : [];
    
    // Update question
    const updatedQuestions = questions.map((q: Question) => 
      q.id === question.id ? editedQuestion : q
    );
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    
    // Show success message
    toast.success('Questão atualizada com sucesso!');
    
    // Navigate back to question list
    navigate('/');
  };

  const handleAddCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryName,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    return newCategory;
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.header 
        className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </motion.div>
              <Logo size="sm" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="truncate">Editar Questão</h1>
                <p className="text-gray-600 text-sm sm:text-base hidden sm:block">Modificar questão existente</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button variant="outline" onClick={handleLogoutClick} className="w-full sm:w-auto">
                <LogOut className="mr-1 sm:mr-2 h-4 w-4" />
                Sair
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <QuestionForm
            categories={categories}
            onSubmit={handleUpdateQuestion}
            onAddCategory={handleAddCategory}
            onCancel={() => navigate('/')}
            initialQuestion={question}
            isEditing={true}
          />
        </motion.div>
      </main>
    </motion.div>
  );
}