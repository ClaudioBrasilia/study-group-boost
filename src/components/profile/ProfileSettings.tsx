
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
import { useTranslation } from 'react-i18next';

const ProfileSettings: React.FC = () => {
  const { user, updateUserPlan } = useAuth();
  const { t } = useTranslation();
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
      toast.success(t('profile.settings.profileUpdated'));
      setIsUpdating(false);
    }, 1000);
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error(t('profile.settings.passwordsNotMatch'));
      return;
    }
    
    setIsUpdating(true);
    
    // Simulação de alteração de senha
    setTimeout(() => {
      toast.success(t('profile.settings.passwordChanged'));
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
          <TabsTrigger value="profile">{t('profile.settings.profile')}</TabsTrigger>
          <TabsTrigger value="security">{t('profile.settings.security')}</TabsTrigger>
          <TabsTrigger value="subscription">{t('profile.settings.subscription')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.settings.name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.settings.email')}</Label>
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
              {isUpdating ? t('profile.settings.updating') : t('profile.settings.updateProfile')}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{t('profile.settings.accountSecurity')}</h3>
              <p className="text-sm text-gray-500">
                {t('profile.settings.manageSecuritySettings')}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(true)}
            >
              {t('profile.settings.changePassword')}
            </Button>
            
            <div className="pt-4">
              <h3 className="font-medium">{t('profile.settings.privacy')}</h3>
              <p className="text-sm text-gray-500">
                {t('profile.settings.managePrivacy')}
              </p>
              <div className="pt-2">
                <Link to="/privacy" className="text-study-primary hover:underline text-sm">
                  {t('profile.settings.viewPrivacyPolicy')}
                </Link>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{t('profile.settings.currentPlan')}</h3>
              <p className="text-sm mt-1 capitalize font-semibold text-study-primary">
                {user?.plan === 'premium' ? t('profile.settings.premium') : user?.plan === 'basic' ? t('profile.settings.basic') : t('profile.settings.free')}
              </p>
              
              {user?.plan !== 'premium' && (
                <p className="text-sm text-gray-500 mt-2">
                  {t('profile.settings.upgradeMessage')}
                </p>
              )}
            </div>
            
            <Link to="/plans">
              <Button className="w-full bg-study-primary">
                {user?.plan === 'premium' ? t('profile.settings.manageSubscription') : t('profile.settings.managePlans')}
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.settings.changePasswordTitle')}</DialogTitle>
            <DialogDescription>
              {t('profile.settings.changePasswordDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t('profile.settings.currentPassword')}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('profile.settings.newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('profile.settings.confirmPassword')}</Label>
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
                {isUpdating ? t('profile.settings.changing') : t('profile.settings.changePassword')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
