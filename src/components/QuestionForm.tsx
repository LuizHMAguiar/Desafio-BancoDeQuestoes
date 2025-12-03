import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Category } from '../types/question';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface QuestionFormProps {
  categories: Category[];
  onSubmit: (question: Omit<Question, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => void;
  onAddCategory: (name: string) => Category;
  onCancel: () => void;
  initialQuestion?: Question;
  isEditing?: boolean;
}

export function QuestionForm({ categories, onSubmit, onAddCategory, onCancel, initialQuestion, isEditing }: QuestionFormProps) {
  const [category, setCategory] = useState(initialQuestion?.category || '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [tags, setTags] = useState<string[]>(initialQuestion?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [statement, setStatement] = useState(initialQuestion?.statement || '');
  const [options, setOptions] = useState(initialQuestion?.options || ['', '', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(initialQuestion?.correctOption || 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = onAddCategory(newCategoryName.trim());
      setCategory(newCategory.name);
      setNewCategoryName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !statement.trim() || options.some(o => !o.trim())) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      category,
      tags,
      statement,
      options,
      correctOption,
    });
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = document.getElementById('statement') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = statement.substring(start, end);

    if (!selectedText) return;

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
    }

    const newStatement = statement.substring(0, start) + formattedText + statement.substring(end);
    setStatement(newStatement);
  };

  const insertImage = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) {
      setStatement(statement + `<br><img src="${url}" alt="Imagem" style="max-width: 100%; height: auto;" /><br>`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setStatement(statement + `<br><img src="${base64String}" alt="Imagem enviada" style="max-width: 100%; height: auto;" /><br>`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Category Selection */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="category">Disciplina *</Label>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma disciplina" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Nova disciplina"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" variant="outline" onClick={handleCreateCategory} className="flex-shrink-0">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Criar</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="tags">Tags / Palavras-chave</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Digite uma tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" variant="outline" onClick={handleAddTag} className="flex-shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <AnimatePresence>
          {tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Statement */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="statement">Enunciado *</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" size="sm" variant="outline" onClick={() => applyFormatting('bold')}>
              <span className="hidden sm:inline">Negrito</span>
              <span className="sm:hidden">N</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" size="sm" variant="outline" onClick={() => applyFormatting('italic')}>
              <span className="hidden sm:inline">Itálico</span>
              <span className="sm:hidden">I</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" size="sm" variant="outline" onClick={() => applyFormatting('underline')}>
              <span className="hidden sm:inline">Sublinhado</span>
              <span className="sm:hidden">S</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" size="sm" variant="outline" onClick={insertImage}>
              <ImageIcon className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">URL Imagem</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <Textarea
          id="statement"
          placeholder="Digite o enunciado da questão..."
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          rows={4}
          required
          className="resize-y"
        />
        <AnimatePresence>
          {statement && (
            <motion.div 
              className="mt-2 p-3 border rounded-lg bg-gray-50 overflow-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-sm text-gray-600 mb-1">Pré-visualização:</p>
              <div className="prose prose-sm max-w-none break-words" dangerouslySetInnerHTML={{ __html: statement }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Options */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label>Alternativas *</Label>
        <RadioGroup value={String(correctOption)} onValueChange={(value: string) => setCorrectOption(Number(value))}>
          {options.map((option, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-2 sm:gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <RadioGroupItem value={String(index)} id={`option-${index}`} className="mt-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Label htmlFor={`option-${index}`} className="text-xs sm:text-sm text-gray-600">
                  Opção {String.fromCharCode(65 + index)}
                </Label>
                <Input
                  placeholder={`Digite a alternativa ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            </motion.div>
          ))}
        </RadioGroup>
        <p className="text-xs sm:text-sm text-gray-500">
          Selecione a alternativa correta marcando o círculo ao lado
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div 
        className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-4 border-t"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button type="submit" className="w-full sm:w-auto">
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Questão'}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}