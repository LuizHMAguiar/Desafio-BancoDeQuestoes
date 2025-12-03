import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../types/question';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Trash2, User, Calendar, CheckCircle2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface QuestionCardProps {
  question: Question;
  onDelete: () => void;
}

export function QuestionCard({ question, onDelete }: QuestionCardProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge>{question.category}</Badge>
                </motion.div>
                {question.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Badge variant="outline">
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1 truncate">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{question.authorName}</span>
                </span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {new Date(question.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                  onClick={() => navigate(`/questoes/${question.id}/editar`)}
                >
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
              </motion.div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="m-0">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90 m-0">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="mb-4 break-words" dangerouslySetInnerHTML={{ __html: question.statement }} />
          </div>

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${ 
                  index === question.correctOption
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-gray-300 text-xs sm:text-sm">
                  {optionLabels[index]}
                </span>
                <span className="flex-1 text-sm sm:text-base break-words">{option}</span>
                {index === question.correctOption && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}