import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Users,
  BookOpen,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Logo } from "./Logo";
import { User, Subject } from "../types/question";
import { toast } from "sonner";

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}




export function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "teacher" | "subject";
    id: number;
    name: string;
  } | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "" });
  const [subjectForm, setSubjectForm] = useState({ name: "" });

  useEffect(() => {
    initializeData();
    loadData();
  }, []);

  const loadData = async () => {
  try {
    // Busca professores ainda do localStorage (se quiser manter)
    const responseUser = await fetch("https://bancodequestoes-api.onrender.com/users");
    if (!responseUser.ok) {
      throw new Error("Erro ao buscar disciplinas");
    }
    const usersFromApi = await responseUser.json();
    setSubjects(usersFromApi);

    // Busca disciplinas da API
    const response = await fetch("https://bancodequestoes-api.onrender.com/subjects");
    if (!response.ok) {
      throw new Error("Erro ao buscar disciplinas");
    }

    const subjectsFromApi = await response.json();
    setSubjects(subjectsFromApi); // atualiza estado com dados da API
  } catch (error) {
    console.error(error);
    toast.error("Não foi possível carregar as disciplinas");
  }
};

const initializeData = async () => {
  try {
    // Busca professores na API
    const response = await fetch("https://bancodequestoes-api.onrender.com/users");
    if (!response.ok) {
      throw new Error("Erro ao buscar professores");
    }

    const users = await response.json();

    // Filtra apenas os que têm role professor
    const teachers: User[] = users.filter((u: any) => u.role === "professor");

    // Atualiza estado (se você tiver setTeachers disponível)
    setTeachers(teachers);

    // Se quiser manter cache local opcional
    localStorage.setItem("teachers", JSON.stringify(teachers));
  } catch (error) {
    console.error(error);
    toast.error("Não foi possível carregar os professores da API");
  }
}; 

  const handleAddTeacher = async () => {
  if (!teacherForm.name || !teacherForm.email) {
    toast.error("Preencha todos os campos");
    return;
  }

  try {
    const response = await fetch("https://bancodequestoes-api.onrender.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: teacherForm.name,
        email: teacherForm.email,
        role: "professor", // define o papel do usuário
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar professor");
    }

    const newTeacher: User = await response.json();

    const updatedTeachers = [...teachers, newTeacher];
    setTeachers(updatedTeachers);

    toast.success(`Professor ${newTeacher.name} adicionado com sucesso`);
    setTeacherForm({ name: "", email: "" });
    setTeacherDialogOpen(false);
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const handleEditTeacher = async () => {
  if (!editingTeacher || !teacherForm.name || !teacherForm.email) {
    toast.error("Preencha todos os campos");
    return;
  }

  try {
    const response = await fetch(
      `https://bancodequestoes-api.onrender.com/users/${editingTeacher.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingTeacher,
          name: teacherForm.name,
          email: teacherForm.email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar professor");
    }

    const updatedTeacher: User = await response.json();

    const updatedTeachers = teachers.map((t) =>
      t.id === updatedTeacher.id ? updatedTeacher : t
    );
    setTeachers(updatedTeachers);

    toast.success(`Professor ${updatedTeacher.name} atualizado com sucesso`);
    setTeacherForm({ name: "", email: "" });
    setEditingTeacher(null);
    setTeacherDialogOpen(false);
  } catch (error) {
    toast.error((error as Error).message);
  }
};


  const handleAddSubject = async () => {
  if (!subjectForm.name) {
    toast.error("Preencha o nome da disciplina");
    return;
  }

  try {
    const response = await fetch("https://bancodequestoes-api.onrender.com/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subjectForm.name,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar disciplina");
    }

    const newSubject: Subject = await response.json();

    // Atualiza estado com o retorno da API
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);

    toast.success(`Disciplina ${newSubject.name} adicionada com sucesso`);
    setSubjectForm({ name: "" });
    setSubjectDialogOpen(false);
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const handleEditSubject = async () => {
  if (!editingSubject || !subjectForm.name) {
    toast.error("Preencha o nome da disciplina");
    return;
  }

  try {
    const response = await fetch(
      `https://bancodequestoes-api.onrender.com/subjects/${editingSubject.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingSubject,
          name: subjectForm.name,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao atualizar disciplina");
    }

    const updatedSubject: Subject = await response.json();

    const updatedSubjects = subjects.map((s) =>
      s.id === updatedSubject.id ? updatedSubject : s
    );

    setSubjects(updatedSubjects);

    toast.success(`Disciplina ${updatedSubject.name} atualizada com sucesso`);
    setSubjectForm({ name: "" });
    setEditingSubject(null);
    setSubjectDialogOpen(false);
  } catch (error) {
    toast.error((error as Error).message);
  }
};


 const confirmDelete = async () => {
  if (!itemToDelete) return;

  try {
    if (itemToDelete.type === "teacher") {
      // Chamada DELETE para professores (se a API tiver esse endpoint)
      const response = await fetch(
        `https://bancodequestoes-api.onrender.com/teachers/${itemToDelete.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover professor");
      }

      const updatedTeachers = teachers.filter((t) => t.id !== itemToDelete.id);
      setTeachers(updatedTeachers);

      toast.success(`Professor ${itemToDelete.name} removido com sucesso`);
    } else {
      // Chamada DELETE para disciplinas
      const response = await fetch(
        `https://bancodequestoes-api.onrender.com/subjects/${itemToDelete.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover disciplina");
      }

      const updatedSubjects = subjects.filter((s) => s.id !== itemToDelete.id);
      setSubjects(updatedSubjects);

      toast.success(`Disciplina ${itemToDelete.name} removida com sucesso`);
    }

    setItemToDelete(null);
    setDeleteDialogOpen(false);
  } catch (error) {
    toast.error((error as Error).message);
  }
};


  const openTeacherDialog = (teacher?: User) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm({ name: teacher.name, email: teacher.email });
    } else {
      setEditingTeacher(null);
      setTeacherForm({ name: "", email: "" });
    }
    setTeacherDialogOpen(true);
  };

  const openSubjectDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({ name: subject.name });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: "" });
    }
    setSubjectDialogOpen(true);
  };

  const openDeleteDialog = (
    type: "teacher" | "subject",
    id: number,
    name: string
  ) => {
    setItemToDelete({ type, id, name });
    setDeleteDialogOpen(true);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-4 sm:p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div>
              <h1 className="text-slate-900">Painel Administrativo</h1>
              <p className="text-slate-600">
                Olá, {user.name} (Coordenador)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="size-4" />
                Banco de Questões
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-[#4BA551]" />
                Professores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">{teachers.length}</div>
              <p className="text-slate-600">professores cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-[#4BA551]" />
                Disciplinas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">{subjects.length}</div>
              <p className="text-slate-600">disciplinas cadastradas</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="teachers" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="teachers"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4BA551] data-[state=active]:bg-transparent"
                  >
                    <Users className="size-4" />
                    Professores
                  </TabsTrigger>
                  <TabsTrigger
                    value="subjects"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4BA551] data-[state=active]:bg-transparent"
                  >
                    <BookOpen className="size-4" />
                    Disciplinas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="teachers" className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-slate-900">Gerenciar Professores</h3>
                      <p className="text-slate-600">
                        Adicione, edite ou remova professores
                      </p>
                    </div>
                    <Button onClick={() => openTeacherDialog()} size="sm">
                      <Plus className="size-4" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                        
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teachers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-slate-500 py-8"
                            >
                              Nenhum professor cadastrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          teachers.map((teacher, index) => (
                            <motion.tr
                              key={teacher.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b last:border-0"
                            >
                              <TableCell>{teacher.name}</TableCell>
                              <TableCell>{teacher.email}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openTeacherDialog(teacher)}
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openDeleteDialog(
                                        "teacher",
                                        teacher.id,
                                        teacher.name
                                      )
                                    }
                                  >
                                    <Trash2 className="size-4 text-[#C8393F]" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="subjects" className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-slate-900">Gerenciar Disciplinas</h3>
                      <p className="text-slate-600">
                        Adicione, edite ou remova disciplinas
                      </p>
                    </div>
                    <Button onClick={() => openSubjectDialog()} size="sm">
                      <Plus className="size-4" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.length === 0 ? (
                      <div className="col-span-full text-center text-slate-500 py-8">
                        Nenhuma disciplina cadastrada
                      </div>
                    ) : (
                      subjects.map((subject, index) => (
                        <motion.div
                          key={subject.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-slate-900">
                                    {subject.name}
                                  </CardTitle>
                                  <CardDescription>
                                    {new Date(
                                      subject.createdAt
                                    ).toLocaleDateString("pt-BR")}
                                  </CardDescription>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openSubjectDialog(subject)}
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openDeleteDialog(
                                        "subject",
                                        subject.id,
                                        subject.name
                                      )
                                    }
                                  >
                                    <Trash2 className="size-4 text-[#C8393F]" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Teacher Dialog */}
      <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTeacher ? "Editar Professor" : "Adicionar Professor"}
            </DialogTitle>
            <DialogDescription>
              {editingTeacher
                ? "Edite as informações do professor"
                : "Preencha os dados do novo professor"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">Nome</Label>
              <Input
                id="teacher-name"
                value={teacherForm.name}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, name: e.target.value })
                }
                placeholder="Nome do professor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher-email">Email</Label>
              <Input
                id="teacher-email"
                type="email"
                value={teacherForm.email}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, email: e.target.value })
                }
                placeholder="email@escola.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTeacherDialogOpen(false);
                setEditingTeacher(null);
                setTeacherForm({ name: "", email: "" });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingTeacher ? handleEditTeacher : handleAddTeacher}
            >
              {editingTeacher ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subject Dialog */}
      <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Editar Disciplina" : "Adicionar Disciplina"}
            </DialogTitle>
            <DialogDescription>
              {editingSubject
                ? "Edite o nome da disciplina"
                : "Preencha o nome da nova disciplina"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Nome da Disciplina</Label>
              <Input
                id="subject-name"
                value={subjectForm.name}
                onChange={(e) =>
                  setSubjectForm({ ...subjectForm, name: e.target.value })
                }
                placeholder="Ex: Matemática"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSubjectDialogOpen(false);
                setEditingSubject(null);
                setSubjectForm({ name: "" });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingSubject ? handleEditSubject : handleAddSubject}
            >
              {editingSubject ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{" "}
              {itemToDelete?.type === "teacher" ? "o professor" : "a disciplina"}{" "}
              <strong>{itemToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#C8393F] hover:bg-[#C8393F]/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
