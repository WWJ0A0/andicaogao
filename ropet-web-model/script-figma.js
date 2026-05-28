// Ropet 首页 - Figma设计稿交互实现
// 1:1 还原所有设计稿中的交互效果

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ropet 首页 - Figma设计稿加载完成');
    
    // 元素引用
    const tryMeBtn = document.getElementById('tryMeBtn');
    const foodSelectionModal = document.getElementById('foodSelectionModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const foodOptions = document.querySelectorAll('.food-option');
    const statusBubble = document.getElementById('statusBubble');
    const petImage = document.getElementById('petImage');
    
    // 状态变量
    let petHungerLevel = 90; // 初始饥饿度 90%（高）
    let petMood = 'hungry'; // 心情状态: hungry, satisfied, happy
    
    // 初始化页面
    function initPage() {
        updatePetStatus();
        setupEventListeners();
        updateCurrentTime();
        
        // 每5秒更新时间
        setInterval(updateCurrentTime, 5000);
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // "点我试试"按钮点击
        tryMeBtn.addEventListener('click', function() {
            showFoodSelectionModal();
        });
        
        // 关闭弹窗按钮
        closeModal.addEventListener('click', function() {
            hideFoodSelectionModal();
        });
        
        // 点击弹窗外部关闭
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hideFoodSelectionModal();
            }
        });
        
        // 食物选项点击
        foodOptions.forEach(option => {
            option.addEventListener('click', function() {
                const foodType = this.getAttribute('data-food');
                feedPet(foodType);
                hideFoodSelectionModal();
            });
        });
        
        // 状态卡片点击
        const statusCards = document.querySelectorAll('.status-card');
        statusCards.forEach(card => {
            card.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                showStatusDetail(type);
            });
        });
        
        // 功能卡片点击
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', function() {
                const isGallery = this.classList.contains('sketch-gallery');
                const isDiary = this.classList.contains('painting-diary');
                
                if (isGallery) {
                    showFeatureModal('拍拍画廊', '展示宠物的照片和绘画作品');
                } else if (isDiary) {
                    showFeatureModal('画画日记', '记录宠物的成长日记和绘画记录');
                }
            });
        });
        
        // 导航项点击
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                navItems.forEach(nav => nav.classList.remove('active'));
                // 添加当前active类
                this.classList.add('active');
                
                const label = this.querySelector('.nav-label').textContent;
                handleNavigation(label);
            });
        });
        
        // 换装按钮点击
        const dressUpBtn = document.querySelector('.dress-up-btn');
        if (dressUpBtn) {
            dressUpBtn.addEventListener('click', function() {
                showDressUpModal();
            });
        }
    }
    
    // 显示食物选择弹窗
    function showFoodSelectionModal() {
        modalOverlay.classList.remove('hidden');
        foodSelectionModal.classList.remove('hidden');
        
        // 添加动画效果
        setTimeout(() => {
            foodSelectionModal.style.transform = 'scale(1)';
            foodSelectionModal.style.opacity = '1';
        }, 10);
    }
    
    // 隐藏食物选择弹窗
    function hideFoodSelectionModal() {
        foodSelectionModal.style.transform = 'scale(0.9)';
        foodSelectionModal.style.opacity = '0';
        
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            foodSelectionModal.classList.add('hidden');
            foodSelectionModal.style.transform = 'scale(1)';
            foodSelectionModal.style.opacity = '1';
        }, 200);
    }
    
    // 喂食宠物
    function feedPet(foodType) {
        console.log(`喂食宠物: ${foodType}`);
        
        // 根据食物类型减少饥饿度
        let hungerReduction = 0;
        let moodChange = '';
        
        switch(foodType) {
            case 'orange':
                hungerReduction = 25;
                moodChange = 'healthy';
                break;
            case 'donut':
                hungerReduction = 35;
                moodChange = 'happy';
                break;
            case 'cake':
                hungerReduction = 40;
                moodChange = 'excited';
                break;
            default:
                hungerReduction = 20;
                moodChange = 'satisfied';
        }
        
        // 更新饥饿度
        petHungerLevel = Math.max(0, petHungerLevel - hungerReduction);
        
        // 更新心情
        petMood = petHungerLevel <= 30 ? 'happy' : 
                  petHungerLevel <= 60 ? 'satisfied' : 'hungry';
        
        // 显示喂食反馈
        showFeedBack(foodType);
        
        // 更新宠物状态
        updatePetStatus();
    }
    
    // 显示喂食反馈
    function showFeedBack(foodType) {
        // 创建反馈气泡
        const feedbackBubble = document.createElement('div');
        feedbackBubble.className = 'feedback-bubble';
        
        let message = '';
        let emoji = '';
        
        switch(foodType) {
            case 'orange':
                message = '橘子真好吃！';
                emoji = '🍊';
                break;
            case 'donut':
                message = '甜甜圈太棒了！';
                emoji = '🍩';
                break;
            case 'cake':
                message = '蛋糕太美味了！';
                emoji = '🍰';
                break;
        }
        
        feedbackBubble.innerHTML = `${emoji} ${message}`;
        feedbackBubble.style.position = 'fixed';
        feedbackBubble.style.bottom = '200px';
        feedbackBubble.style.right = '30px';
        feedbackBubble.style.backgroundColor = 'var(--primary-purple)';
        feedbackBubble.style.color = 'white';
        feedbackBubble.style.padding = '12px 20px';
        feedbackBubble.style.borderRadius = '20px';
        feedbackBubble.style.boxShadow = '0px 4px 12px rgba(157, 124, 255, 0.3)';
        feedbackBubble.style.zIndex = '1000';
        feedbackBubble.style.fontSize = '14px';
        feedbackBubble.style.fontWeight = '500';
        feedbackBubble.style.animation = 'floatUp 2s ease-in-out';
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 0; }
                20% { transform: translateY(-20px); opacity: 1; }
                80% { transform: translateY(-40px); opacity: 1; }
                100% { transform: translateY(-60px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(feedbackBubble);
        
        // 2秒后移除反馈气泡
        setTimeout(() => {
            feedbackBubble.remove();
            style.remove();
        }, 2000);
    }
    
    // 更新宠物状态
    function updatePetStatus() {
        // 更新饥饿度显示
        updateHungerStatus();
        
        // 更新心情显示
        updateMoodStatus();
        
        // 更新宠物形象（根据心情）
        updatePetAppearance();
    }
    
    // 更新饥饿状态
    function updateHungerStatus() {
        let hungerMessage = '';
        let bubbleColor = '';
        
        if (petHungerLevel <= 30) {
            hungerMessage = '好饱哦！';
            bubbleColor = 'var(--success-color)';
        } else if (petHungerLevel <= 60) {
            hungerMessage = '有点饿了';
            bubbleColor = 'var(--warning-color)';
        } else {
            hungerMessage = '好饿哦！';
            bubbleColor = 'var(--primary-purple)';
        }
        
        // 更新状态气泡
        statusBubble.textContent = hungerMessage;
        statusBubble.style.backgroundColor = bubbleColor;
        
        // 更新"点我试试"按钮文本
        if (petHungerLevel <= 30) {
            tryMeBtn.innerHTML = '<div class="btn-icon"></div><span>陪我玩</span>';
        } else {
            tryMeBtn.innerHTML = '<div class="btn-icon"></div><span>点我试试</span>';
        }
        
        // 更新饥饿度指示器
        const hungerFill = document.getElementById('hungerFill');
        if (hungerFill) {
            hungerFill.style.width = `${petHungerLevel}%`;
        }
    }
    
    // 更新心情状态
    function updateMoodStatus() {
        // 这里可以更新宠物表情或其他心情指示器
        console.log(`当前心情: ${petMood}, 饥饿度: ${petHungerLevel}%`);
    }
    
    // 更新宠物外观
    function updatePetAppearance() {
        // 根据心情改变宠物形象
        // 这里可以更改宠物图片或添加CSS类
        if (petImage) {
            // 移除所有心情类
            petImage.classList.remove('pet-hungry', 'pet-satisfied', 'pet-happy');
            
            // 添加当前心情类
            switch(petMood) {
                case 'hungry':
                    petImage.classList.add('pet-hungry');
                    break;
                case 'satisfied':
                    petImage.classList.add('pet-satisfied');
                    break;
                case 'happy':
                    petImage.classList.add('pet-happy');
                    break;
            }
        }
    }
    
    // 显示状态详情
    function showStatusDetail(type) {
        let title = '';
        let message = '';
        
        switch(type) {
            case 'accompaniment':
                title = '已陪伴详情';
                message = '您的宠物已经陪伴您 360 天了，一起度过了许多美好时光！';
                break;
            case 'interaction':
                title = '今日互动';
                message = '今天已经互动 280 次，继续保持哦！';
                break;
            case 'personality':
                title = '当前性格';
                message = '您的宠物是一个乐天派，总是充满活力和快乐！';
                break;
            case 'growth':
                title = '成长阶段';
                message = '您的宠物正处于认知形成期，正在学习和探索世界！';
                break;
        }
        
        showSimpleModal(title, message);
    }
    
    // 显示功能模态框
    function showFeatureModal(title, description) {
        showSimpleModal(title, description);
    }
    
    // 显示换装模态框
    function showDressUpModal() {
        showSimpleModal('换装功能', '宠物换装功能正在开发中，敬请期待！');
    }
    
    // 显示简单模态框
    function showSimpleModal(title, message) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'simple-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'var(--card-bg)';
        modal.style.borderRadius = 'var(--modal-radius)';
        modal.style.padding = 'var(--spacing-xl)';
        modal.style.boxShadow = 'var(--card-shadow-hover)';
        modal.style.zIndex = '1001';
        modal.style.width = '300px';
        modal.style.maxWidth = '90vw';
        
        // 模态框内容
        modal.innerHTML = `
            <div class="modal-header">
                <h3 style="font: var(--font-subtitle); color: var(--text-title); margin-bottom: var(--spacing-md);">
                    ${title}
                </h3>
                <button class="close-simple-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; color: var(--text-tertiary); cursor: pointer;">×</button>
            </div>
            <div class="modal-content">
                <p style="font: var(--font-body); color: var(--text-secondary); line-height: 1.5;">
                    ${message}
                </p>
                <button class="confirm-btn" style="margin-top: var(--spacing-lg); width: 100%; padding: var(--spacing-md); background-color: var(--primary-purple); color: white; border: none; border-radius: var(--btn-radius); font: var(--font-btn); cursor: pointer;">
                    知道了
                </button>
            </div>
        `;
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'simple-modal-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.zIndex = '1000';
        
        // 添加元素到页面
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // 事件监听
        const closeBtn = modal.querySelector('.close-simple-modal');
        const confirmBtn = modal.querySelector('.confirm-btn');
        
        function closeModal() {
            modal.style.opacity = '0';
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                modal.remove();
                overlay.remove();
            }, 200);
        }
        
        closeBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }
    
    // 处理导航
    function handleNavigation(destination) {
        console.log(`导航到: ${destination}`);
        
        // 这里可以处理页面导航逻辑
        // 由于当前只实现首页，所以只显示提示
        if (destination !== '首页') {
            showSimpleModal('功能开发中', `${destination} 功能正在开发中，敬请期待！`);
        }
    }
    
    // 更新时间显示
    function updateCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeElement = document.querySelector('.time');
        
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }
    
    // 初始化页面
    initPage();
});