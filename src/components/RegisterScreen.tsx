import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Logo } from './Logo';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle2, Check, X } from 'lucide-react';

interface RegisterScreenProps {
  onRegister: (name: string, email: string, password: string) => boolean;
}

export function RegisterScreen({ onRegister }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    // Reset error
    setError('');

    // Validate name
    if (name.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Digite um email válido');
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const registered = onRegister(name.trim(), email.trim(), password);

    if (registered) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError('Este email já está cadastrado no sistema');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-red-50 p-4 sm:p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.4,
          type: 'spring',
        }}
        className="w-full max-w-md"
      >
        <Card className="w-full">
          <CardHeader className="space-y-4 pb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: 'spring',
                stiffness: 200,
              }}
              className="flex justify-center"
            >
              <Logo size="lg" />
            </motion.div>
            <CardTitle className="text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Cadastre-se para acessar o banco de questões
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <Alert className="border-[#4BA551] bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-[#4BA551]" />
                  <AlertDescription className="text-[#4BA551]">
                    Conta criada com sucesso! Redirecionando para o login...
                  </AlertDescription>
                </Alert>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@escola.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1 pt-2"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {password.length >= 6 ? (
                          <Check className="h-3 w-3 text-[#4BA551]" />
                        ) : (
                          <X className="h-3 w-3 text-slate-400" />
                        )}
                        <span
                          className={
                            password.length >= 6
                              ? 'text-[#4BA551]'
                              : 'text-slate-500'
                          }
                        >
                          Mínimo 6 caracteres
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1 pt-2"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {password === confirmPassword ? (
                          <Check className="h-3 w-3 text-[#4BA551]" />
                        ) : (
                          <X className="h-3 w-3 text-slate-400" />
                        )}
                        <span
                          className={
                            password === confirmPassword
                              ? 'text-[#4BA551]'
                              : 'text-slate-500'
                          }
                        >
                          Senhas coincidem
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button type="submit" className="w-full">
                    Criar Conta
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      Já tem uma conta?{' '}
                      <Link
                        to="/login"
                        className="text-[#4BA551] hover:underline transition-colors"
                      >
                        Fazer login
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
