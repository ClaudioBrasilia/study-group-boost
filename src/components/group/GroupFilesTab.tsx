
import React from 'react';
import { File, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileType } from '@/types/groupTypes';
import { useTranslation } from 'react-i18next';

interface GroupFilesTabProps {
  files: FileType[];
  uploadDialogOpen: boolean;
  setUploadDialogOpen: (value: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  handleDownloadFile: (fileId: string) => void;
  newFile: File | null;
}

const GroupFilesTab: React.FC<GroupFilesTabProps> = ({
  files,
  uploadDialogOpen,
  setUploadDialogOpen,
  handleFileChange,
  handleFileUpload,
  handleDownloadFile,
  newFile
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{t('files.title')}</h3>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-study-primary">
              <Upload size={16} className="mr-1" />
              {t('files.upload')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('files.upload')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">{t('files.fileName')}</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!newFile}
                  className="bg-study-primary"
                >
                  {t('files.upload')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File size={24} className="text-gray-400" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.size} • {t('files.uploadedBy')}: {file.uploadedBy} • 
                      {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadFile(file.id)}
                  className="flex items-center gap-1"
                >
                  <Download size={14} />
                  {t('files.download')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <File className="mx-auto h-12 w-12 opacity-50 mb-2" />
          <p>{t('files.noFiles')}</p>
        </div>
      )}
    </div>
  );
};

export default GroupFilesTab;
