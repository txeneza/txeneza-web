import React from "react";
import { useLogin } from "../hooks/use-login";
import { Mail, Lock, AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";

export const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLoginSubmit,
  } = useLogin();

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full max-w-[420px] bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-limeGreen/40 dark:hover:border-limeGreen/30">
      {/* Decorative top border line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-limeGreen to-transparent" />

      {/* Institutional Branding */}
      <div className="text-center flex flex-col items-center gap-3.5 mb-8">
        <div className="w-16 h-20 overflow-hidden shrink-0 filter drop-shadow-[0_5px_15px_rgba(181,242,48,0.2)]">
          <img src="/image/TXENEZA.png" alt="Txeneza Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-forestGreen dark:text-white">
            Protótipo de Gestão
          </h2>
          <p className="text-xs text-forestGreen/70 dark:text-limeGreen/80 font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forestGreen dark:text-limeGreen" />
            Uso Potencial: Vereação de Higiene e Salubridade
          </p>
          <p className="text-[10px] text-grey600 dark:text-grey300 font-medium uppercase mt-0.5">
            Proposta Tecnológica — CMB
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 flex gap-3 items-start text-xs text-red-600 dark:text-red-400 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <span className="font-bold block">Falha na Autenticação</span>
            <p className="mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
        {/* Email input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-grey600 dark:text-grey300 uppercase tracking-wider">
            Endereço de E-mail
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-grey400 dark:text-grey600 group-focus-within:text-limeGreen transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              placeholder="nome@txeneza.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-white dark:bg-grey900/60 border border-grey300 dark:border-forestGreen/40 rounded-xl py-3 pl-11 pr-4 text-sm text-grey900 dark:text-white placeholder-grey400 dark:placeholder-grey600 focus:outline-none focus:border-limeGreen/60 dark:focus:border-limeGreen/40 focus:ring-4 focus:ring-limeGreen/10 dark:focus:ring-limeGreen/5 transition-all duration-200 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-grey600 dark:text-grey300 uppercase tracking-wider">
            Palavra-passe
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-grey400 dark:text-grey600 group-focus-within:text-limeGreen transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-white dark:bg-grey900/60 border border-grey300 dark:border-forestGreen/40 rounded-xl py-3 pl-11 pr-10 text-sm text-grey900 dark:text-white placeholder-grey400 dark:placeholder-grey600 focus:outline-none focus:border-limeGreen/60 dark:focus:border-limeGreen/40 focus:ring-4 focus:ring-limeGreen/10 dark:focus:ring-limeGreen/5 transition-all duration-200 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-grey400 dark:text-grey600 hover:text-forestGreen dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl text-sm font-bold bg-limeGreen text-forestGreen hover:bg-lightLime hover:scale-[1.01] active:scale-95 border border-limeGreen/20 shadow-lg shadow-limeGreen/10 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-forestGreen border-t-transparent rounded-full animate-spin" />
              A processar...
            </span>
          ) : (
            "Entrar no Sistema"
          )}
        </button>
      </form>

      {/* Footer tip */}
      <div className="mt-8 text-center text-[10px] text-grey500 dark:text-grey600">
        Protótipo de demonstração concebido para simulação de uso potencial pela CMB. Trabalho Acadêmico de Conclusão de Curso.
      </div>
    </div>
  );
};
