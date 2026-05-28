// Ropet 生理状态 - 网页模型机交互逻辑
// 基于交互原型文档（生理状态-交互原型.md）实现

// 全局状态管理
const AppState = {
    // 宠物状态
    pet: {
        name: 'KAMOMO',
        hunger: 65,           // 饥饿度 0-100
        health: 85,           // 健康度 0-100
        mood: 75,             // 心情值 0-100
        energy: 60,           // 精力值 0-100
        growth: 360,          // 成长天数
        personality: '乐天派',
        growthStage: '认知形成期',
        todayInteractions: 280
    },
    
    // 食物库存
    foodInventory: [
        { id: 1, name: '胡萝卜', category: '主食', icon: '🥕', stock: 5, effect: { hunger: 15, health: 5 } },
        { id: 2, name: '苹果', category: '零食', icon: '🍎', stock: 3, effect: { hunger: 10, mood: 10 } },
        { id: 3, name: '能量丸', category: '药品', icon: '💊', stock: 2, effect: { energy: 30, health: 20 } },
        { id: 4, name: '饼干', category: '零食', icon: '🍪', stock: 4, effect: { hunger: 8, mood: 5 } },
        { id: 5, name: '蔬菜沙拉', category: '主食', icon: '🥗', stock: 3, effect: { hunger: 20, health: 10 } },
        { id: 6, name: '感冒药', category: '药品', icon: '💊', stock: 1, effect: { health: 40 } }
    ],
    
    // 当前选择
    selectedFood: null,
    selectedQuantity: 1,
    
    // 交互记录
    interactionHistory: []
};

// DOM元素缓存
const DOM = {
    // 宠物状态显示
    hungerValue: null,
    healthValue: null,
    moodValue: null,
    energyValue: null,
    
    // 状态卡片
    accompanimentValue: document.getElementById('accompanimentValue'),
    interactionValue: document.getElementById('interactionValue'),
    personalityValue: document.getElementById('personalityValue'),
    growthValue: document.getElementById('growthValue'),
    
    // 宠物视觉
    petImage: document.getElementById('petImage'),
    statusBubble: document.getElementById('statusBubble'),
    
    // 按钮
    tryMeBtn: document.getElementById('tryMeBtn'),
    
    // 面板和弹窗
    foodPanel: document.getElementById('foodPanel'),
    foodGrid: document.querySelector('.food-grid'),
    closeFoodPanel: document.getElementById('closeFoodPanel'),
    
    feedingModal: document.getElementById('feedingModal'),
    selectedFoodInfo: document.getElementById('selectedFoodInfo'),
    stockCount: document.getElementById('stockCount'),
    qtyInput: document.getElementById('qtyInput'),
    minusBtn: document.getElementById('minusBtn'),
    plusBtn: document.getElementById('plusBtn'),
    cancelFeeding: document.getElementById('cancelFeeding'),
    confirmFeeding: document.getElementById('confirmFeeding'),
    closeFeedingModal: document.getElementById('closeFeedingModal'),
    
    statusDetail: document.getElementById('statusDetail'),
    detailTitle: document.getElementById('detailTitle'),
    detailValue: document.getElementById('detailValue'),
    detailDescription: document.getElementById('detailDescription'),
    detailSuggestion: document.getElementById('detailSuggestion'),
    closeDetail: document.getElementById('closeDetail'),
    
    // Toast
    successToast: document.getElementById('successToast'),
    
    // 状态卡片
    statusCards: document.querySelectorAll('.status-card'),
    
    // 新功能组件
    abnormalDetail: document.getElementById('abnormalDetail'),
    abnormalIcon: document.querySelector('.abnormal-icon'),
    abnormalTitle: document.getElementById('abnormalTitle'),
    abnormalDescription: document.getElementById('abnormalDescription'),
    abnormalSolution: document.getElementById('abnormalSolution'),
    closeAbnormalDetail: document.getElementById('closeAbnormalDetail'),
    feedMedicineBtn: document.getElementById('feedMedicineBtn'),
    
    unlockCelebration: document.getElementById('unlockCelebration'),
    celebrationIcon: document.querySelector('.celebration-icon'),
    celebrationTitle: document.getElementById('celebrationTitle'),
    celebrationReward: document.getElementById('celebrationReward'),
    tryNowBtn: document.getElementById('tryNowBtn'),
    closeCelebration: document.getElementById('closeCelebration'),
    
    categoryTags: document.getElementById('categoryTags'),
    petFace: document.querySelector('.pet-face'),
    
    interactionHistoryPanel: document.querySelector('.interaction-history'),
    historyList: document.querySelector('.history-list'),
    historyToggle: document.querySelector('.history-toggle')
};

// 初始化函数
function init() {
    console.log('Ropet 生理状态模型机初始化...');
    
    // 绑定事件监听器
    bindEvents();
    
    // 初始化UI状态
    updatePetStatusUI();
    updateFoodGrid();
    
    // 模拟数据变化（演示用）
    simulateDataChanges();
    
    console.log('初始化完成，当前状态:', AppState.pet);
}

// 事件绑定
function bindEvents() {
    // 状态卡片点击
    DOM.statusCards.forEach(card => {
        card.addEventListener('click', handleStatusCardClick);
    });
    
    // "点我试试"按钮
    DOM.tryMeBtn.addEventListener('click', openFoodPanel);
    
    // 关闭食物面板
    DOM.closeFoodPanel.addEventListener('click', closeFoodPanel);
    
    // 数量选择器
    DOM.minusBtn.addEventListener('click', decreaseQuantity);
    DOM.plusBtn.addEventListener('click', increaseQuantity);
    DOM.qtyInput.addEventListener('input', validateQuantity);
    
    // 投喂确认/取消
    DOM.cancelFeeding.addEventListener('click', closeFeedingModal);
    DOM.confirmFeeding.addEventListener('click', confirmFeeding);
    DOM.closeFeedingModal.addEventListener('click', closeFeedingModal);
    
    // 关闭状态详情
    DOM.closeDetail.addEventListener('click', closeStatusDetail);
    
    // 食物面板外点击关闭
    document.addEventListener('click', handleOutsideClick);
    
    // 换装按钮
    document.querySelector('.dress-up-btn').addEventListener('click', () => {
        showToast('换装功能开发中...', 'info');
    });
    
    // 功能卡片
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            showToast('功能开发中...', 'info');
        });
    });
    
    // 底部导航
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            showToast('页面切换中...', 'info');
        });
    });
    
    // 异常详情相关事件
    if (DOM.abnormalIcon) {
        DOM.abnormalIcon.addEventListener('click', showAbnormalDetail);
    }
    if (DOM.closeAbnormalDetail) {
        DOM.closeAbnormalDetail.addEventListener('click', closeAbnormalDetail);
    }
    if (DOM.feedMedicineBtn) {
        DOM.feedMedicineBtn.addEventListener('click', feedMedicine);
    }
    
    // 解锁庆祝弹窗
    if (DOM.closeCelebration) {
        DOM.closeCelebration.addEventListener('click', closeCelebration);
    }
    if (DOM.tryNowBtn) {
        DOM.tryNowBtn.addEventListener('click', () => {
            closeCelebration();
            openFoodPanel();
        });
    }
    
    // 交互历史
    if (DOM.historyToggle) {
        DOM.historyToggle.addEventListener('click', toggleHistoryPanel);
    }
    
    // 初始化食物分类标签
    initCategoryTags();
}

// 状态卡片点击处理
function handleStatusCardClick(event) {
    const card = event.currentTarget;
    const type = card.dataset.type;
    
    let title, value, description, suggestion;
    
    switch(type) {
        case 'accompaniment':
            title = '已陪伴时间';
            value = `${AppState.pet.growth}天`;
            description = '您的ropet已经陪伴您度过了这么多美好的时光。每天互动可以加速成长，解锁更多有趣的功能和表情。';
            suggestion = '每天至少互动10次，帮助宠物更快成长！';
            break;
        case 'interaction':
            title = '今日互动次数';
            value = `${AppState.pet.todayInteractions}次`;
            description = '今日您与宠物的互动次数。互动包括投喂、抚摸、换装等操作。互动越多，宠物越开心。';
            suggestion = '继续保持高频互动，让宠物保持好心情！';
            break;
        case 'personality':
            title = '当前性格';
            value = AppState.pet.personality;
            description = '基于您的互动方式，宠物形成的性格特征。性格会影响宠物的表情、反应和行为模式。';
            suggestion = '多尝试不同的互动方式，探索更多性格可能性！';
            break;
        case 'growth':
            title = '成长阶段';
            value = AppState.pet.growthStage;
            description = '宠物当前的成长阶段。随着时间推移和互动增加，宠物会经历不同阶段，解锁新能力。';
            suggestion = '每日坚持互动，加速进入下一成长阶段！';
            break;
    }
    
    // 显示详情浮层
    showStatusDetail(title, value, description, suggestion);
}

// 显示状态详情浮层
function showStatusDetail(title, value, description, suggestion) {
    DOM.detailTitle.textContent = title;
    DOM.detailValue.textContent = value;
    DOM.detailDescription.textContent = description;
    DOM.detailSuggestion.textContent = suggestion;
    
    DOM.statusDetail.classList.add('show');
}

// 关闭状态详情
function closeStatusDetail() {
    DOM.statusDetail.classList.remove('show');
}

// 打开食物选择面板
function openFoodPanel() {
    DOM.foodPanel.classList.add('show');
    AppState.selectedFood = null;
    updateFoodGrid();
}

// 关闭食物面板
function closeFoodPanel() {
    DOM.foodPanel.classList.remove('show');
}

// 更新食物网格
function updateFoodGrid() {
    if (!DOM.foodGrid) return;
    
    DOM.foodGrid.innerHTML = '';
    
    AppState.foodInventory.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        if (AppState.selectedFood && AppState.selectedFood.id === food.id) {
            foodCard.classList.add('selected');
        }
        
        foodCard.innerHTML = `
            <div class="food-icon">${food.icon}</div>
            <div class="food-name">${food.name}</div>
            <div class="food-stock">库存: ${food.stock}</div>
        `;
        
        foodCard.addEventListener('click', () => selectFood(food));
        
        DOM.foodGrid.appendChild(foodCard);
    });
}

// 选择食物
function selectFood(food) {
    AppState.selectedFood = food;
    AppState.selectedQuantity = 1;
    
    updateFoodGrid();
    openFeedingModal();
}

// 打开投喂确认弹窗
function openFeedingModal() {
    if (!AppState.selectedFood) return;
    
    const food = AppState.selectedFood;
    DOM.selectedFoodInfo.innerHTML = `
        <div class="food-info-icon">${food.icon}</div>
        <div class="food-info-text">
            <h4>${food.name}</h4>
            <p>${food.category} · 库存: ${food.stock}</p>
        </div>
    `;
    
    DOM.stockCount.textContent = food.stock;
    DOM.qtyInput.value = AppState.selectedQuantity;
    updateQuantityButtons();
    
    DOM.feedingModal.classList.add('show');
}

// 关闭投喂确认弹窗
function closeFeedingModal() {
    DOM.feedingModal.classList.remove('show');
}

// 减少数量
function decreaseQuantity() {
    if (AppState.selectedQuantity > 1) {
        AppState.selectedQuantity--;
        DOM.qtyInput.value = AppState.selectedQuantity;
        updateQuantityButtons();
    }
}

// 增加数量
function increaseQuantity() {
    const food = AppState.selectedFood;
    if (food && AppState.selectedQuantity < food.stock) {
        AppState.selectedQuantity++;
        DOM.qtyInput.value = AppState.selectedQuantity;
        updateQuantityButtons();
    }
}

// 验证数量输入
function validateQuantity(event) {
    const value = parseInt(event.target.value);
    const food = AppState.selectedFood;
    
    if (isNaN(value) || value < 1) {
        AppState.selectedQuantity = 1;
    } else if (food && value > food.stock) {
        AppState.selectedQuantity = food.stock;
    } else {
        AppState.selectedQuantity = value;
    }
    
    DOM.qtyInput.value = AppState.selectedQuantity;
    updateQuantityButtons();
}

// 更新数量按钮状态
function updateQuantityButtons() {
    DOM.minusBtn.disabled = AppState.selectedQuantity <= 1;
    DOM.plusBtn.disabled = !AppState.selectedFood || 
                          AppState.selectedQuantity >= AppState.selectedFood.stock;
}

// 确认投喂
function confirmFeeding() {
    const food = AppState.selectedFood;
    const quantity = AppState.selectedQuantity;
    
    if (!food || food.stock < quantity) {
        showToast('库存不足！', 'error');
        return;
    }
    
    // 模拟投喂处理
    simulateFeeding(food, quantity);
    
    // 更新库存
    food.stock -= quantity;
    if (food.stock <= 0) {
        // 如果库存为0，可以从数组中移除或标记为无库存
        food.stock = 0;
    }
    
    // 更新互动次数
    AppState.pet.todayInteractions += 1;
    
    // 显示成功提示
    showToast(`投喂成功！${food.name} ×${quantity}`, 'success');
    
    // 更新UI
    updatePetStatusUI();
    updateFoodGrid();
    
    // 关闭弹窗
    closeFeedingModal();
    closeFoodPanel();
    
    // 记录交互
    logInteraction('feeding', { food: food.name, quantity });
}

// 模拟投喂效果
function simulateFeeding(food, quantity) {
    // 应用食物效果
    if (food.effect.hunger) {
        AppState.pet.hunger = Math.min(100, AppState.pet.hunger + food.effect.hunger * quantity);
    }
    if (food.effect.health) {
        AppState.pet.health = Math.min(100, AppState.pet.health + food.effect.health * quantity);
    }
    if (food.effect.mood) {
        AppState.pet.mood = Math.min(100, AppState.pet.mood + food.effect.mood * quantity);
    }
    if (food.effect.energy) {
        AppState.pet.energy = Math.min(100, AppState.pet.energy + food.effect.energy * quantity);
    }
    
    // 更新状态气泡
    updateStatusBubble();
}

// 更新宠物状态UI
function updatePetStatusUI() {
    // 更新状态卡片
    if (DOM.accompanimentValue) {
        DOM.accompanimentValue.textContent = AppState.pet.growth;
    }
    if (DOM.interactionValue) {
        DOM.interactionValue.textContent = AppState.pet.todayInteractions;
    }
    if (DOM.personalityValue) {
        DOM.personalityValue.textContent = AppState.pet.personality;
    }
    if (DOM.growthValue) {
        DOM.growthValue.textContent = AppState.pet.growthStage;
    }
    
    // 更新状态气泡
    updateStatusBubble();
    
    // 更新宠物表情（根据状态）
    updatePetExpression();
}

// 更新状态气泡
function updateStatusBubble() {
    if (!DOM.statusBubble) return;
    
    let message = '';
    let color = '#FF724C'; // 默认品牌色
    
    // 根据状态决定显示内容
    if (AppState.pet.hunger < 30) {
        message = '好饿哦！';
        color = '#FF9800'; // 警告色
    } else if (AppState.pet.health < 50) {
        message = '好像感冒了...';
        color = '#F44336'; // 危险色
    } else if (AppState.pet.mood > 80) {
        message = '超级开心！';
        color = '#4CAF50'; // 成功色
    } else if (AppState.pet.energy < 40) {
        message = '有点累了...';
        color = '#2196F3'; // 信息色
    } else {
        message = '陪我玩嘛~';
    }
    
    DOM.statusBubble.textContent = message;
    DOM.statusBubble.style.backgroundColor = color;
}

// 更新宠物表情
function updatePetExpression() {
    // 这里可以添加更复杂的表情变化逻辑
    // 基于hunger、mood、health等状态调整宠物视觉表现
    
    const petFace = document.querySelector('.pet-face');
    if (!petFace) return;
    
    // 简单的表情变化示例
    const eyes = document.querySelectorAll('.eye');
    const mouth = document.querySelector('.mouth');
    
    // 根据心情调整眼睛大小
    const eyeScale = 0.8 + (AppState.pet.mood / 100) * 0.4;
    eyes.forEach(eye => {
        eye.style.transform = `scale(${eyeScale})`;
    });
    
    // 根据饥饿度调整嘴巴
    if (AppState.pet.hunger < 30) {
        mouth.style.width = '40px';
        mouth.style.height = '4px';
        mouth.style.backgroundColor = '#FF9800';
    } else if (AppState.pet.mood > 80) {
        mouth.style.width = '25px';
        mouth.style.height = '12px';
        mouth.style.borderRadius = '12px 12px 0 0';
        mouth.style.backgroundColor = '#4CAF50';
    } else {
        mouth.style.width = '30px';
        mouth.style.height = '8px';
        mouth.style.borderRadius = '4px';
        mouth.style.backgroundColor = '#FF724C';
    }
}

// 显示Toast提示
function showToast(message, type = 'success') {
    const toast = DOM.successToast;
    const toastContent = toast.querySelector('.toast-content');
    
    // 设置内容和图标
    let icon = 'fa-check-circle';
    let bgColor = '#4CAF50'; // 成功绿色
    
    switch(type) {
        case 'error':
            icon = 'fa-exclamation-circle';
            bgColor = '#F44336'; // 错误红色
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            bgColor = '#FF9800'; // 警告橙色
            break;
        case 'info':
            icon = 'fa-info-circle';
            bgColor = '#2196F3'; // 信息蓝色
            break;
    }
    
    toastContent.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    toast.style.backgroundColor = bgColor;
    
    // 显示toast
    toast.classList.add('show');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 处理面板外点击
function handleOutsideClick(event) {
    // 食物面板外点击关闭
    if (DOM.foodPanel.classList.contains('show') && 
        !DOM.foodPanel.contains(event.target) && 
        !DOM.tryMeBtn.contains(event.target)) {
        closeFoodPanel();
    }
    
    // 弹窗外点击关闭
    if (DOM.feedingModal.classList.contains('show') && 
        !DOM.feedingModal.querySelector('.modal-content').contains(event.target)) {
        closeFeedingModal();
    }
    
    // 详情浮层外点击关闭
    if (DOM.statusDetail.classList.contains('show') && 
        !DOM.statusDetail.querySelector('.detail-content').contains(event.target) &&
        !Array.from(DOM.statusCards).some(card => card.contains(event.target))) {
        closeStatusDetail();
    }
}

// 记录交互历史
function logInteraction(type, data) {
    AppState.interactionHistory.push({
        type,
        data,
        timestamp: new Date().toISOString()
    });
    
    // 限制历史记录长度
    if (AppState.interactionHistory.length > 50) {
        AppState.interactionHistory.shift();
    }
}

// 模拟数据变化（用于演示）
function simulateDataChanges() {
    // 每30秒减少一点状态值（模拟时间流逝）
    setInterval(() => {
        AppState.pet.hunger = Math.max(0, AppState.pet.hunger - 1);
        AppState.pet.energy = Math.max(0, AppState.pet.energy - 0.5);
        AppState.pet.mood = Math.max(0, AppState.pet.mood - 0.3);
        
        // 偶尔随机降低健康度（模拟生病）
        if (Math.random() < 0.05) {
            AppState.pet.health = Math.max(0, AppState.pet.health - 5);
        }
        
        // 更新UI
        updatePetStatusUI();
        
        // 每天增加成长天数（演示用，加速）
        if (Math.random() < 0.1) {
            AppState.pet.growth += 1;
            DOM.accompanimentValue.textContent = AppState.pet.growth;
        }
        
    }, 30000); // 30秒
}

// 显示异常详情浮层
function showAbnormalDetail() {
    if (!DOM.abnormalDetail) return;
    
    // 根据当前健康状态设置异常内容
    const health = AppState.pet.health;
    let title, description, solution;
    
    if (health < 30) {
        title = '严重感冒';
        description = '宠物出现严重感冒症状，精神萎靡，食欲不振，需要立即治疗。';
        solution = '立即喂食感冒药，并保持环境温暖。避免与其他宠物接触。';
    } else if (health < 50) {
        title = '轻微感冒';
        description = '宠物有轻微感冒症状，打喷嚏，精神稍差。';
        solution = '喂食感冒药，多休息，补充营养。';
    } else if (AppState.pet.hunger < 20) {
        title = '严重饥饿';
        description = '宠物极度饥饿，可能导致健康问题。';
        solution = '立即喂食高能量食物，如能量丸或主食。';
    } else {
        title = '状态异常';
        description = '宠物出现异常状态，需要关注。';
        solution = '检查宠物各项状态指标，采取相应措施。';
    }
    
    DOM.abnormalTitle.textContent = title;
    DOM.abnormalDescription.textContent = description;
    DOM.abnormalSolution.textContent = solution;
    
    DOM.abnormalDetail.classList.add('show');
}

// 关闭异常详情浮层
function closeAbnormalDetail() {
    if (DOM.abnormalDetail) {
        DOM.abnormalDetail.classList.remove('show');
    }
}

// 喂药功能
function feedMedicine() {
    // 查找感冒药
    const medicine = AppState.foodInventory.find(food => food.name === '感冒药');
    if (!medicine || medicine.stock < 1) {
        showToast('没有感冒药了！', 'error');
        return;
    }
    
    // 模拟喂药
    simulateFeeding(medicine, 1);
    medicine.stock -= 1;
    
    // 更新UI
    updatePetStatusUI();
    updateFoodGrid();
    
    // 显示成功提示
    showToast('喂药成功！感冒症状缓解', 'success');
    
    // 关闭异常详情浮层
    closeAbnormalDetail();
    
    // 记录交互
    logInteraction('medicine', { medicine: medicine.name });
}

// 关闭解锁庆祝弹窗
function closeCelebration() {
    if (DOM.unlockCelebration) {
        DOM.unlockCelebration.classList.remove('show');
    }
}

// 显示解锁庆祝弹窗
function showUnlockCelebration(unlockedItem) {
    if (!DOM.unlockCelebration) return;
    
    DOM.celebrationTitle.textContent = `解锁成功！${unlockedItem}`;
    DOM.celebrationReward.textContent = '+50 积分奖励';
    
    DOM.unlockCelebration.classList.add('show');
    
    // 模拟解锁庆祝动画
    setTimeout(() => {
        showToast(`恭喜解锁新功能：${unlockedItem}！`, 'success');
    }, 1000);
    
    // 5秒后自动关闭
    setTimeout(() => {
        closeCelebration();
    }, 5000);
}

// 切换交互历史面板
function toggleHistoryPanel() {
    if (!DOM.interactionHistoryPanel) return;
    
    const isShowing = DOM.interactionHistoryPanel.classList.contains('show');
    
    if (isShowing) {
        DOM.interactionHistoryPanel.classList.remove('show');
    } else {
        DOM.interactionHistoryPanel.classList.add('show');
        updateHistoryList();
    }
}

// 更新交互历史列表
function updateHistoryList() {
    if (!DOM.historyList) return;
    
    DOM.historyList.innerHTML = '';
    
    // 显示最近10条记录
    const recentHistory = AppState.interactionHistory.slice(-10).reverse();
    
    recentHistory.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let content = '';
        const time = new Date(record.timestamp).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        switch(record.type) {
            case 'feeding':
                content = `${time} 投喂 ${record.data.food} ×${record.data.quantity}`;
                break;
            case 'medicine':
                content = `${time} 喂药 ${record.data.medicine}`;
                break;
            default:
                content = `${time} ${record.type} 操作`;
        }
        
        historyItem.textContent = content;
        DOM.historyList.appendChild(historyItem);
    });
}

// 初始化食物分类标签
function initCategoryTags() {
    if (!DOM.categoryTags) return;
    
    // 获取所有分类
    const categories = ['全部', '主食', '零食', '药品'];
    
    // 清空现有标签
    DOM.categoryTags.innerHTML = '';
    
    // 创建标签
    categories.forEach(category => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        if (category === '全部') {
            tag.classList.add('active');
        }
        tag.textContent = category;
        tag.dataset.category = category;
        
        tag.addEventListener('click', () => {
            // 移除其他标签的active状态
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            // 添加当前标签的active状态
            tag.classList.add('active');
            // 过滤食物
            filterFoodByCategory(category);
        });
        
        DOM.categoryTags.appendChild(tag);
    });
}

// 按分类过滤食物
function filterFoodByCategory(category) {
    if (!DOM.foodGrid) return;
    
    DOM.foodGrid.innerHTML = '';
    
    const foods = category === '全部' 
        ? AppState.foodInventory 
        : AppState.foodInventory.filter(food => food.category === category);
    
    foods.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        if (AppState.selectedFood && AppState.selectedFood.id === food.id) {
            foodCard.classList.add('selected');
        }
        
        foodCard.innerHTML = `
            <div class="food-icon">${food.icon}</div>
            <div class="food-name">${food.name}</div>
            <div class="food-stock">库存: ${food.stock}</div>
        `;
        
        foodCard.addEventListener('click', () => selectFood(food));
        
        DOM.foodGrid.appendChild(foodCard);
    });
}

// 增强版宠物表情更新
function updatePetExpression() {
    const petFace = DOM.petFace;
    if (!petFace) return;
    
    // 移除所有表情状态类
    petFace.classList.remove('healthy', 'sick', 'happy', 'hungry', 'tired');
    
    // 根据状态添加相应类
    if (AppState.pet.health < 50) {
        petFace.classList.add('sick');
    } else if (AppState.pet.mood > 80) {
        petFace.classList.add('happy');
    } else if (AppState.pet.hunger < 30) {
        petFace.classList.add('hungry');
    } else if (AppState.pet.energy < 40) {
        petFace.classList.add('tired');
    } else {
        petFace.classList.add('healthy');
    }
    
    // 更新状态气泡
    updateStatusBubble();
    
    // 检查是否需要显示异常气泡
    checkAbnormalStatus();
}

// 检查异常状态
function checkAbnormalStatus() {
    // 如果健康度低于50，显示异常图标
    if (AppState.pet.health < 50 && DOM.abnormalIcon) {
        DOM.abnormalIcon.style.display = 'flex';
    } else if (DOM.abnormalIcon) {
        DOM.abnormalIcon.style.display = 'none';
    }
    
    // 如果达到解锁条件（演示用），显示庆祝弹窗
    if (AppState.pet.growth >= 365 && Math.random() < 0.1) {
        showUnlockCelebration('一周年纪念装扮');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 导出到全局（用于调试）
window.AppState = AppState;
window.updatePetStatusUI = updatePetStatusUI;