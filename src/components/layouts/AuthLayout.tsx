import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import AuthLinkSwitcher from '@/components/ui/AuthLinkSwitcher';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">Login</h1>
                    {children}
                    <AuthLinkSwitcher text="Don't have an account?" url="/register" anchor="Register here" />
                </section>
            </div>
        </div>
    );
};

export default AuthLayout;
