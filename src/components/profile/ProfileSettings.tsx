
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const ProfileSettings: React.FC = () => {
  const { user, updateUserPlan } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulação de atualização de perfil
    setTimeout(() => {
      toast.success('Perfil atualizado com sucesso');
      setIsUpdating(false);
    }, 1000);
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsUpdating(true);
    
    // Simulação de alteração de senha
    setTimeout(() => {
      toast.success('Senha alterada com sucesso');
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsUpdating(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-study-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Atualizando...' : 'Atualizar Perfil'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Segurança da Conta</h3>
              <p className="text-sm text-gray-500">
                Gerencie as configurações de segurança da sua conta
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(true)}
            >
              Alterar Senha
            </Button>
            
            <div className="pt-4">
              <h3 className="font-medium">Privacidade</h3>
              <p className="text-sm text-gray-500">
                Gerencie como suas informações são usadas
              </p>
              <div className="pt-2">
                <Link to="/privacy" className="text-study-primary hover:underline text-sm">
                  Ver Política de Privacidade
                </Link>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Seu Plano Atual</h3>
              <p className="text-sm mt-1 capitalize font-semibold text-study-primary">
                {user?.plan === 'premium' ? 'Premium' : user?.plan === 'basic' ? 'Básico' : 'Gratuito'}
              </p>
              
              {user?.plan !== 'premium' && (
                <p className="text-sm text-gray-500 mt-2">
                  Faça o upgrade para o plano Premium para acessar todos os recursos
                </p>
              )}
            </div>
            
            <Link to="/plans">
              <Button className="w-full bg-study-primary">
                {user?.plan === 'premium' ? 'Gerenciar Assinatura' : 'Ver Planos'}
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Digite sua senha atual e a nova senha desejada.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-study-primary"
                disabled={isUpdating}
              >
                {isUpdating ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
