import React from 'react';
import PageLayout from '../components/PageLayout';

const DressUp: React.FC = () => {
  return (
    <PageLayout title="宠物换装">
      <div className="flex flex-col gap-6 pt-6">
        <div className="bg-[#f8f8f8e5] rounded-[24px] p-6 w-full shadow-sm text-center">
          <div className="relative w-[200px] h-[200px] mx-auto mb-6 bg-gradient-to-b from-[#e2e7f1] to-white rounded-full shadow-inner border border-gray-100 flex items-center justify-center">
            <img 
              src="/images/mo0uw8au-tlddmuo.png" 
              alt="KAMOMO宠物" 
              className="w-32 h-32 object-contain z-20"
            />
            <div className="absolute bottom-4 w-24 h-4 bg-gradient-to-r from-[#a68db6] to-[#c8b4d3] blur-md rounded-full opacity-50"></div>
          </div>
          <h2 className="text-[#222222] text-xl font-semibold mb-4 text-left px-2">装扮衣柜</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-[#eeeeee] rounded-xl border border-[#2222220d] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="text-gray-400 text-xs font-medium">配件 {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DressUp;