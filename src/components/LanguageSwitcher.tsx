"use client";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
        variant="outline"
        className="px-4 py-2"
      >
        {language === 'ar' ? 'Français' : 'العربية'}
      </Button>
    </div>
  );
};

export default LanguageSwitcher; 