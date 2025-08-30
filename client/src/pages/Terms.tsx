import { useTranslation } from 'react-i18next';
import '@/css/terms.css';
import BackButton from '@/components/ui/BackButton';

const Terms = () => {
    const { t } = useTranslation();

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/" />
            <article className="terms-container">
                <h1>{t('terms.title')}</h1>

                <section>
                    <h2>{t('terms.useOfApp.title')}</h2>
                    <ul>
                        <li>{t('terms.useOfApp.playGames')}</li>
                        <li>{t('terms.useOfApp.optionalAccount')}</li>
                        <li>{t('terms.useOfApp.rankings')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.accounts.title')}</h2>
                    <ul>
                        <li>{t('terms.accounts.provideInfo')}</li>
                        <li>{t('terms.accounts.passwordHash')}</li>
                        <li>{t('terms.accounts.userResponsibility')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.dataStored.title')}</h2>
                    <ul>
                        <li>{t('terms.dataStored.accountData')}</li>
                        <li>{t('terms.dataStored.scores')}</li>
                        <li>{t('terms.dataStored.preferences')}</li>
                        <li>{t('terms.dataStored.avatar')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.dataDeletion.title')}</h2>
                    <ul>
                        <li>{t('terms.dataDeletion.softDelete')}</li>
                        <li>{t('terms.dataDeletion.hardDelete')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.emails.title')}</h2>
                    <ul>
                        <li>{t('terms.emails.accountConfirmation')}</li>
                        <li>{t('terms.emails.noSpam')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.privacy.title')}</h2>
                    <ul>
                        <li>{t('terms.privacy.dataUsage')}</li>
                        <li>{t('terms.privacy.noSharing')}</li>
                        <li>{t('terms.privacy.noTracking')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.limitation.title')}</h2>
                    <ul>
                        <li>{t('terms.limitation.providedAsIs')}</li>
                        <li>{t('terms.limitation.notResponsible')}</li>
                    </ul>
                </section>

                <section>
                    <h2>{t('terms.changes.title')}</h2>
                    <p>{t('terms.changes.text')}</p>
                </section>

                <section>
                    <h2>{t('terms.contact.title')}</h2>
                    <p>{t('terms.contact.text')}</p>
                </section>
            </article>
        </div>
    );
};

export default Terms;
