import React, { useState } from 'react';
import { X, Building2, Save, Check } from 'lucide-react';
import { CompanyProfile } from '../types/licitacao';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onSaveProfile: (profile: CompanyProfile) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>(profile);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof CompanyProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCpfChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    handleChange('cpfRepresentante', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="tactile-card-raised border border-white/[0.09] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/[0.06] bg-[#1e2430] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl tactile-btn flex items-center justify-center text-amber-400 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Perfil Cadastral & CADASTUR
              </h2>
              <p className="text-xs text-slate-400">
                Dados oficiais utilizados no preenchimento de peças e propostas da Levivre
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl tactile-btn text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Razão Social:
              </label>
              <input
                type="text"
                value={formData.razaoSocial}
                onChange={(e) => handleChange('razaoSocial', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Nome Fantasia:
              </label>
              <input
                type="text"
                value={formData.nomeFantasia}
                onChange={(e) => handleChange('nomeFantasia', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                CNPJ:
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 font-mono focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Porte / Enquadramento (LC 123/2006):
              </label>
              <select
                value={formData.enquadramento}
                onChange={(e) => handleChange('enquadramento', e.target.value as any)}
                className="w-full p-2.5 bg-[#1b2029] border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-amber-500/50"
              >
                <option value="EPP">EPP - Empresa de Pequeno Porte (Até R$ 4,8M/ano)</option>
                <option value="ME">ME - Microempresa (Até R$ 360k/ano)</option>
                <option value="Demais (Lucro Real / Presumido)">Demais / Médio-Grande Porte</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Número CADASTUR (MTur):
              </label>
              <input
                type="text"
                value={formData.cadastur}
                onChange={(e) => handleChange('cadastur', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 font-mono focus:outline-hidden focus:border-amber-500/50"
                placeholder="Ex: 19.012.345/0001-90"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Código IATA / Registro Agência:
              </label>
              <input
                type="text"
                value={formData.iata}
                onChange={(e) => handleChange('iata', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 font-mono focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                E-mail Institucional:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Telefone / Plantão 24/7:
              </label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>
          </div>

          {/* SESSÃO: DADOS DO SÓCIO / REPRESENTANTE LEGAL */}
          <div className="pt-3 pb-1 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                Sócio / Representante Legal (Assinatura das Minutas & Peças)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                  Nome do Sócio / Representante:
                </label>
                <input
                  type="text"
                  value={formData.representante || ''}
                  onChange={(e) => handleChange('representante', e.target.value)}
                  className="w-full p-2.5 tactile-well text-slate-100 focus:outline-hidden focus:border-amber-500/50"
                  placeholder="Ex: Rocha Romeiro"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                  Cargo / Função:
                </label>
                <input
                  type="text"
                  value={formData.cargoRepresentante || ''}
                  onChange={(e) => handleChange('cargoRepresentante', e.target.value)}
                  className="w-full p-2.5 tactile-well text-slate-100 focus:outline-hidden focus:border-amber-500/50"
                  placeholder="Ex: Sócio-Administrador"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">
                  CPF do Sócio Representante:
                </label>
                <input
                  type="text"
                  value={formData.cpfRepresentante || ''}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  className="w-full p-2.5 tactile-well text-white font-mono focus:outline-hidden focus:border-amber-400 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Endereço Completo da Sede:
            </label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Cidade:
              </label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Estado (UF):
              </label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                CEP:
              </label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                className="w-full p-2.5 tactile-well text-slate-200 font-mono focus:outline-hidden focus:border-amber-500/50"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Atualizações têm efeito imediato nas minutas geradas
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 tactile-btn text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 tactile-btn-primary text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Salvo!' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
