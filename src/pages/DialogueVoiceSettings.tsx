import React, { useState } from 'react';
import { ArrowLeft, Check, Languages, LockKeyhole, Sparkles, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import {
  useDialogueStore,
  type VoiceLanguage,
  type VoiceTone,
} from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';
import { isVoiceSelectionUnlocked } from '@/utils/translationCollar';

const languages: Array<{ name: VoiceLanguage; label: string }> = [
  { name: '普通话', label: '普通话' },
  { name: '台湾腔', label: '台湾腔' },
  { name: '日文', label: '日本語' },
  { name: '英文', label: 'English' },
  { name: '西班牙语', label: 'Español' },
  { name: '韩语', label: '한국어' },
];

const voiceOptions: Array<{ id: VoiceTone; title: string; caption: string }> = [
  { id: 'default', title: '默认音色', caption: '自然、熟悉' },
  { id: 'momo', title: 'momo音色', caption: '软萌、灵动' },
];

const DialogueVoiceSettings: React.FC = () => {
  const navigate = useNavigate();
  const pet = usePetStore((state) => state.pet);
  const { voiceLanguage, voiceTone, setDialogueVoice } = useDialogueStore();
  const [language, setLanguage] = useState<VoiceLanguage>(voiceLanguage ?? '普通话');
  const [tone, setTone] = useState<VoiceTone>(voiceTone ?? 'default');
  const voiceUnlocked = isVoiceSelectionUnlocked(pet?.growth_stage);
  const selectedLanguageLabel = languages.find((item) => item.name === language)?.label ?? language;

  const save = () => {
    setDialogueVoice(language, tone === 'momo' && !voiceUnlocked ? 'default' : tone);
    navigate('/dialogue-mode');
  };

  return (
    <PrototypePhone className="bg-[#f7f5fb]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#d6c8ff_0%,#f5f1ff_22%,#f7f5fb_52%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <PrototypeStatusBar />

        <header className="relative flex h-[68px] items-center justify-center px-4">
          <button
            type="button"
            aria-label="返回"
            onClick={() => navigate('/dialogue-mode')}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#cfc5e7] bg-white/30 text-[#222127]"
          >
            <ArrowLeft size={27} strokeWidth={2.5} />
          </button>
          <h1 className="text-[24px] font-extrabold text-[#26232a]">设置声音</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section className="rounded-[22px] bg-white/90 p-4 shadow-[0_10px_26px_rgba(84,67,120,0.08)]">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eee8ff] text-[#7b58df]">
                <Languages size={20} />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold text-[#302c35]">选择语言</h2>
                <p className="mt-0.5 text-[12px] text-[#98939f]">对话时使用的语言</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="声音语言">
              {languages.map((item) => {
                const selected = item.name === language;
                return (
                  <button
                    key={item.name}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setLanguage(item.name)}
                    className={`relative flex min-h-[62px] items-center rounded-[16px] border-2 px-3 text-left transition-colors ${
                      selected
                        ? 'border-[#8b66ef] bg-[#f3efff]'
                        : 'border-transparent bg-[#f6f5f8]'
                    }`}
                  >
                    <strong className="block text-[15px] font-bold text-[#312d36]">{item.label}</strong>
                    {selected && (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b66ef] text-white">
                        <Check size={13} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-3 rounded-[22px] bg-white/90 p-4 shadow-[0_10px_26px_rgba(84,67,120,0.08)]">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#fff0f5] text-[#e76798]">
                <Volume2 size={20} />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold text-[#302c35]">选择音色</h2>
                <p className="mt-0.5 text-[12px] text-[#98939f]">{selectedLanguageLabel}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5" role="radiogroup" aria-label="声音音色">
              {voiceOptions.map((voice) => {
                const selected = voice.id === tone;
                const locked = voice.id === 'momo' && !voiceUnlocked;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={locked}
                    onClick={() => setTone(voice.id)}
                    className={`flex h-[74px] w-full items-center rounded-[17px] border-2 px-3 text-left transition-colors ${locked
                      ? 'cursor-not-allowed border-transparent bg-[#f3f2f5] opacity-55'
                      : selected
                        ? 'border-[#8b66ef] bg-[#f3efff]'
                        : 'border-transparent bg-[#f6f5f8]'
                    }`}
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      voice.id === 'default' ? 'bg-[#e8efff] text-[#5a78c5]' : 'bg-[#ffe7f0] text-[#d95e8d]'
                    }`}>
                      {voice.id === 'default' ? <Volume2 size={21} /> : <Sparkles size={21} />}
                    </span>
                    <span className="ml-3">
                      <strong className="block text-[15px] font-bold text-[#312d36]">{voice.title}</strong>
                      <span className="mt-1 block text-[12px] text-[#96919c]">{voice.caption}</span>
                    </span>
                    {locked ? (
                      <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#e9e7ec] px-2.5 py-1.5 text-[10px] font-bold text-[#89848f]">
                        <LockKeyhole size={12} />
                        未解锁
                      </span>
                    ) : (
                      <span className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        selected ? 'border-[#8b66ef] bg-[#8b66ef] text-white' : 'border-[#cfcbd5] text-transparent'
                      }`}>
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </main>

        <div className="bg-white/90 px-5 pb-[30px] pt-3 shadow-[0_-8px_24px_rgba(58,47,79,0.06)]">
          <button
            type="button"
            onClick={save}
            className="h-12 w-full rounded-[15px] bg-[#8b66ef] text-[16px] font-bold text-white shadow-[0_9px_20px_rgba(139,102,239,0.24)]"
          >
            保存
          </button>
        </div>
        <div className="absolute bottom-[11px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
      </div>
    </PrototypePhone>
  );
};

export default DialogueVoiceSettings;
