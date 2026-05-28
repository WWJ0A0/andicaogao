import React, { useMemo, useState } from 'react';
import Lottie from 'lottie-react';

type LottieJsonModule = {
  default: object;
};

export default function LottiePreview() {
  const animationModules = import.meta.glob('../assets/animations/*.json', { eager: true }) as Record<
    string,
    LottieJsonModule
  >;

  const animMap = useMemo(() => {
    const map: Record<string, object> = {};
    Object.entries(animationModules).forEach(([path, module]) => {
      const fileName = path.split('/').pop()?.replace('.json', '') || '';
      if (fileName) {
        map[fileName] = module.default;
      }
    });
    return map;
  }, [animationModules]);

  const animationNames = useMemo(() => Object.keys(animMap).sort(), [animMap]);
  const [selectedName, setSelectedName] = useState(() => (animMap.cheng ? 'cheng' : animationNames[0] || ''));
  const selectedAnimation = selectedName ? animMap[selectedName] : undefined;

  return (
    <div className="w-full min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
      <h2 className="text-white text-2xl mb-4">动画预览</h2>
      <div className="mb-6 w-[300px]">
        <label className="block text-white text-sm mb-2">选择动画</label>
        <select
          className="w-full h-10 rounded-md px-3 bg-white text-[#0f172a] outline-none"
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          {animationNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-[300px] h-[300px]">
        {selectedAnimation ? (
          <Lottie
            animationData={selectedAnimation}
            loop
            autoplay
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          />
        ) : (
          <p className="text-white text-sm">未找到动画文件</p>
        )}
      </div>
    </div>
  );
}
