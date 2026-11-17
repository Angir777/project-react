import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { UserDetailsTab } from './components/user-details-tab/user-details-tab';
import { UserPasswordTab } from './components/user-password-tab/user-password-tab';
import { UserSettingsTab } from './components/user-settings-tab/user-settings-tab';

export function Account() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('0');

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="0">{t('account.tabsTitle.details')}</TabsTrigger>
          <TabsTrigger value="1">{t('account.tabsTitle.password')}</TabsTrigger>
          <TabsTrigger value="2">{t('account.tabsTitle.settings')}</TabsTrigger>
        </TabsList>

        {/* Only the active tab is rendered (and fetches its data). */}
        <TabsContent value="0">
          {activeTab === '0' && (
            <div className="pt-4">
              <UserDetailsTab />
            </div>
          )}
        </TabsContent>

        <TabsContent value="1">
          {activeTab === '1' && (
            <div className="pt-4">
              <UserPasswordTab />
            </div>
          )}
        </TabsContent>

        <TabsContent value="2">
          {activeTab === '2' && (
            <div className="pt-4">
              <UserSettingsTab />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
