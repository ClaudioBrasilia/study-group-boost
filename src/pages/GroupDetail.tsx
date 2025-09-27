
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGroupData } from '@/hooks/useGroupData';
import { useAuth } from '@/context/AuthContext';

// Group tab components
import GroupOverviewTab from '@/components/group/GroupOverviewTab';
import GroupSubjectsTab from '@/components/group/GroupSubjectsTab';
import GroupMembersTab from '@/components/group/GroupMembersTab';
import GroupMessagesTab from '@/components/group/GroupMessagesTab';
import GroupFilesTab from '@/components/group/GroupFilesTab';
import GroupGoalsTab from '@/components/group/GroupGoalsTab';

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    subjects,
    newSubject,
    setNewSubject,
    isVestibularGroup,
    files,
    goals,
    newGoalSubject,
    setNewGoalSubject,
    newGoalType,
    setNewGoalType,
    newGoalTarget,
    setNewGoalTarget,
    uploadDialogOpen,
    setUploadDialogOpen,
    newFile,
    currentUserIsAdmin,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    addVestibularDialogOpen,
    setAddVestibularDialogOpen,
    messages,
    messageText,
    setMessageText,
    members,
    userPoints,
    groupName,
    handleAddSubject,
    handleDeleteSubject,
    confirmDeleteSubject,
    handleAddVestibularModule,
    handleAddGoal,
    updateGoalProgress,
    handleFileUpload,
    handleFileChange,
    handleSendMessage,
    handleDownloadFile,
    getSubjectNameById
  } = useGroupData(groupId);

  return (
    <PageLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-study-primary">
            {isVestibularGroup ? t('groups.fixedGroups.vestibularBrasil') : (groupName || `Grupo ${groupId}`)}
          </h1>
          <div className="flex items-center">
            <div className="bg-study-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              {userPoints} pontos
            </div>
          </div>
        </div>
        
        {isVestibularGroup && (
          <p className="text-gray-500 mt-1">
            Grupo dedicado à preparação para vestibulares brasileiros
          </p>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="overview" className="flex-1">Visão Geral</TabsTrigger>
          <TabsTrigger value="subjects" className="flex-1">Matérias</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Membros</TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">Mensagens</TabsTrigger>
          <TabsTrigger value="files" className="flex-1">Arquivos</TabsTrigger>
          <TabsTrigger value="goals" className="flex-1">Metas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <GroupOverviewTab
            goals={goals}
            isVestibularGroup={isVestibularGroup}
            getSubjectNameById={getSubjectNameById}
            onViewAllGoals={() => setActiveTab('goals')}
            groupId={groupId || ''}
          />
        </TabsContent>
        
        <TabsContent value="subjects">
          <GroupSubjectsTab
            subjects={subjects}
            isVestibularGroup={isVestibularGroup}
            currentUserIsAdmin={currentUserIsAdmin}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            deleteConfirmOpen={deleteConfirmOpen}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
            addVestibularDialogOpen={addVestibularDialogOpen}
            setAddVestibularDialogOpen={setAddVestibularDialogOpen}
            handleAddSubject={handleAddSubject}
            handleDeleteSubject={handleDeleteSubject}
            confirmDeleteSubject={confirmDeleteSubject}
            handleAddVestibularModule={handleAddVestibularModule}
          />
        </TabsContent>
        
        <TabsContent value="members">
          <GroupMembersTab
            members={members}
          />
        </TabsContent>
        
        <TabsContent value="messages">
          <GroupMessagesTab
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="files">
          <GroupFilesTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="goals">
          <GroupGoalsTab
            goals={goals}
            subjects={subjects}
            isVestibularGroup={isVestibularGroup}
            newGoalSubject={newGoalSubject}
            setNewGoalSubject={setNewGoalSubject}
            newGoalType={newGoalType}
            setNewGoalType={setNewGoalType}
            newGoalTarget={newGoalTarget}
            setNewGoalTarget={setNewGoalTarget}
            handleAddGoal={handleAddGoal}
            getSubjectNameById={getSubjectNameById}
            updateGoalProgress={updateGoalProgress}
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default GroupDetail;
