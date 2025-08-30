import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LANGUAGES } from '@/lib/constants';

const LanguageSelector: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('i18nextLng', language);
        setCurrentLanguage(language);
    };

    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    return (
        <Select value={currentLanguage} onValueChange={(value) => changeLanguage(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={t('globals.languages')} />
            </SelectTrigger>
            <SelectContent>
                {LANGUAGES.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                        {language.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;
