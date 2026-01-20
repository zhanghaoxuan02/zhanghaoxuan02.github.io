document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const focalLengthSlider = document.getElementById('focal-length');
    const objectDistanceSlider = document.getElementById('object-distance');
    const objectHeightSlider = document.getElementById('object-height');
    const fValueDisplay = document.getElementById('f-value');
    const uValueDisplay = document.getElementById('u-value');
    const hValueDisplay = document.getElementById('h-value');
    const fInput = document.getElementById('f-input');
    const uInput = document.getElementById('u-input');
    const hInput = document.getElementById('h-input');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const canvas = document.getElementById('lens-canvas');
    const ctx = canvas.getContext('2d');
    
    // 成像属性显示元素
    const imageTypeDisplay = document.getElementById('image-type');
    const vValueDisplay = document.getElementById('v-value');
    const imageHeightDisplay = document.getElementById('image-height');
    const magnificationDisplay = document.getElementById('magnification');
    const formulaCalculationDisplay = document.getElementById('formula-calculation');
    
    // 物理参数
    let f = 20; // 焦距 (cm)
    let u = 60; // 物距 (cm)
    let h = 10; // 物体高度 (cm)
    let v = 0;  // 像距 (cm)
    let h_image = 0; // 像高 (cm)
    let magnification = 0; // 放大率
    
    // 初始化
    updateValuesFromSliders();
    drawLensDiagram();
    updateImageProperties();
    
    // 滑块事件监听
    focalLengthSlider.addEventListener('input', function() {
        f = parseInt(this.value);
        fValueDisplay.textContent = f;
        fInput.value = f;
        updateCalculations();
        drawLensDiagram();
        updateImageProperties();
    });
    
    objectDistanceSlider.addEventListener('input', function() {
        u = parseInt(this.value);
        uValueDisplay.textContent = u;
        uInput.value = u;
        updateCalculations();
        drawLensDiagram();
        updateImageProperties();
    });
    
    objectHeightSlider.addEventListener('input', function() {
        h = parseInt(this.value);
        hValueDisplay.textContent = h;
        hInput.value = h;
        updateCalculations();
        drawLensDiagram();
        updateImageProperties();
    });
    
    // 手动输入事件监听
    fInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 5) value = 5;
        if (value > 40) value = 40;
        f = value;
        this.value = f;
        focalLengthSlider.value = f;
        fValueDisplay.textContent = f;
        updateCalculations();
        drawLensDiagram();
        updateImageProperties();
    });
    
    uInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 10) value = 10;
        if (value > 100) value = 100;
        u = value;
        this.value = u;
        objectDistanceSlider.value = u;
        uValueDisplay.textContent = u;
        updateCalculations();
        drawLensDiagram();
        updateImageProperties();
    });
    
    hInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 5) value = 5;
        if (value > 20) value = 20;
        h = value;
        this.value = h;
        objectHeightSlider.value = h;
        hValueDisplay.textContent = h;
        updateCalculations();
        drawLensDiagram();
        updateImageProperties();
    });
    
    // 预设按钮事件监听
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fValue = parseFloat(this.getAttribute('data-f'));
            const uValue = parseFloat(this.getAttribute('data-u'));
            
            f = fValue;
            u = uValue;
            
            // 更新滑块和显示
            focalLengthSlider.value = f;
            objectDistanceSlider.value = u;
            fValueDisplay.textContent = f;
            uValueDisplay.textContent = u;
            fInput.value = f;
            uInput.value = u;
            
            updateCalculations();
            drawLensDiagram();
            updateImageProperties();
        });
    });
    
    // 更新计算值
    function updateCalculations() {
        // 使用透镜公式计算像距: 1/f = 1/u + 1/v
        if (u === f) {
            v = Infinity; // 不成像
        } else {
            v = 1 / (1/f - 1/u);
        }
        
        // 计算像高和放大率
        if (isFinite(v)) {
            magnification = Math.abs(v / u);
            h_image = h * (v / u);
        } else {
            magnification = Infinity;
            h_image = Infinity;
        }
    }
    
    // 更新成像属性显示
    function updateImageProperties() {
        // 更新公式显示
        if (u === f) {
            formulaCalculationDisplay.textContent = `1/${f} = 1/${u} + 1/∞ (平行光)`;
        } else if (u < f) {
            formulaCalculationDisplay.textContent = `1/${f} = 1/${u} - 1/${Math.abs(v).toFixed(2)} (虚像)`;
        } else {
            formulaCalculationDisplay.textContent = `1/${f} = 1/${u} + 1/${v.toFixed(2)}`;
        }
        
        // 更新像距显示
        if (!isFinite(v)) {
            vValueDisplay.textContent = "∞ (无限远)";
        } else if (v < 0) {
            vValueDisplay.textContent = `${Math.abs(v).toFixed(2)} cm (虚像，同侧)`;
        } else {
            vValueDisplay.textContent = `${v.toFixed(2)} cm`;
        }
        
        // 更新像高显示
        if (!isFinite(h_image)) {
            imageHeightDisplay.textContent = "∞";
        } else if (Math.abs(h_image) < 0.01) {
            imageHeightDisplay.textContent = "≈0 cm";
        } else {
            imageHeightDisplay.textContent = `${Math.abs(h_image).toFixed(2)} cm`;
        }
        
        // 更新放大率显示
        if (!isFinite(magnification)) {
            magnificationDisplay.textContent = "∞";
        } else {
            magnificationDisplay.textContent = magnification.toFixed(2);
        }
        
        // 判断像的性质并更新显示
        let imageType = "";
        if (u > 2*f) {
            imageType = "倒立缩小的实像";
        } else if (u === 2*f) {
            imageType = "倒立等大的实像";
        } else if (u > f && u < 2*f) {
            imageType = "倒立放大的实像";
        } else if (u === f) {
            imageType = "不成像 (出射光平行)";
        } else if (u < f) {
            imageType = "正立放大的虚像";
        }
        imageTypeDisplay.textContent = imageType;
    }
    
    // 绘制凸透镜光路图
    function drawLensDiagram() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置缩放比例 (将物理尺寸转换为像素)
        const scale = 4; // 1cm = 4像素
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // 绘制主光轴
        ctx.beginPath();
        ctx.moveTo(50, centerY);
        ctx.lineTo(canvas.width - 50, centerY);
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 绘制凸透镜 (双凸透镜简化表示)
        const lensWidth = 20;
        const lensHeight = 150;
        
        ctx.beginPath();
        ctx.moveTo(centerX - lensWidth/2, centerY - lensHeight/2);
        ctx.lineTo(centerX + lensWidth/2, centerY - lensHeight/2);
        ctx.moveTo(centerX - lensWidth/2, centerY + lensHeight/2);
        ctx.lineTo(centerX + lensWidth/2, centerY + lensHeight/2);
        
        // 绘制透镜曲线
        ctx.arc(centerX - lensWidth/2, centerY, lensHeight/2, -Math.PI/2, Math.PI/2, false);
        ctx.arc(centerX + lensWidth/2, centerY, lensHeight/2, Math.PI/2, -Math.PI/2, false);
        
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 标记光心O
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('O', centerX - 10, centerY + 25);
        
        // 标记焦点F和F'
        const focalPixel = f * scale;
        ctx.beginPath();
        ctx.arc(centerX + focalPixel, centerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.fillText('F\'', centerX + focalPixel - 10, centerY + 25);
        
        ctx.beginPath();
        ctx.arc(centerX - focalPixel, centerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.fillText('F', centerX - focalPixel - 10, centerY + 25);
        
        // 绘制物体
        const objectX = centerX - u * scale;
        const objectHeightPixel = h * scale;
        const objectTopY = centerY - objectHeightPixel/2;
        const objectBottomY = centerY + objectHeightPixel/2;
        
        // 绘制物体箭头
        drawArrow(objectX, objectBottomY, objectX, objectTopY, '#2ecc71', 3);
        ctx.fillStyle = '#2ecc71';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('物体', objectX - 25, objectTopY - 10);
        
        // 标记物距u
        ctx.beginPath();
        ctx.moveTo(objectX, centerY - 20);
        ctx.lineTo(centerX, centerY - 20);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`u = ${u}cm`, (objectX + centerX)/2 - 20, centerY - 30);
        
        // 计算像的位置和高度
        let imageX, imageHeightPixel;
        if (u === f) {
            // 不成像，光线平行
            imageX = Infinity;
            imageHeightPixel = Infinity;
        } else if (u < f) {
            // 虚像，与物体同侧
            imageX = centerX - Math.abs(v) * scale;
            imageHeightPixel = Math.abs(h_image) * scale;
        } else {
            // 实像，在透镜另一侧
            imageX = centerX + v * scale;
            imageHeightPixel = Math.abs(h_image) * scale;
        }
        
        // 绘制光线
        if (isFinite(imageX)) {
            // 光线1: 平行于主光轴 -> 过焦点F'
            drawRay(
                objectX, objectTopY,
                centerX, objectTopY,
                centerX + focalPixel, centerY,
                '#f39c12', 2
            );
            
            // 光线2: 过光心 -> 方向不变
            drawRay(
                objectX, objectTopY,
                centerX, centerY,
                imageX, imageTopY(objectTopY, objectX, imageX),
                '#9b59b6', 2
            );
            
            // 光线3: 过焦点F -> 平行于主光轴
            if (u > f) {
                // 实像情况
                drawRay(
                    objectX, objectTopY,
                    centerX - focalPixel, centerY,
                    centerX, objectTopY,
                    '#1abc9c', 2
                );
            } else if (u < f) {
                // 虚像情况
                drawRay(
                    objectX, objectTopY,
                    centerX - focalPixel, centerY,
                    centerX, objectTopY,
                    '#1abc9c', 2
                );
                
                // 绘制虚像光线的反向延长线
                ctx.beginPath();
                ctx.moveTo(centerX, objectTopY);
                ctx.lineTo(imageX, imageTopY(objectTopY, objectX, imageX));
                ctx.strokeStyle = '#1abc9c';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            // 绘制像 (如果存在)
            if (u !== f) {
                const imageTopY = centerY - imageHeightPixel/2;
                const imageBottomY = centerY + imageHeightPixel/2;
                
                // 绘制像箭头
                if (u > f) {
                    // 实像倒立
                    drawArrow(imageX, imageTopY, imageX, imageBottomY, '#e74c3c', 3);
                } else {
                    // 虚像正立
                    drawArrow(imageX, imageBottomY, imageX, imageTopY, '#e74c3c', 3);
                }
                
                // 标记像距v
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + 20);
                ctx.lineTo(imageX, centerY + 20);
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = '#e74c3c';
                ctx.font = 'bold 14px Arial';
                
                if (u < f) {
                    ctx.fillText(`|v| = ${Math.abs(v).toFixed(1)}cm`, (centerX + imageX)/2 - 25, centerY + 40);
                } else {
                    ctx.fillText(`v = ${v.toFixed(1)}cm`, (centerX + imageX)/2 - 20, centerY + 40);
                }
                
                ctx.fillStyle = '#e74c3c';
                ctx.font = 'bold 14px Arial';
                ctx.fillText('像', imageX + 15, 
                    u > f ? imageTopY - 10 : imageBottomY + 20);
            }
        } else {
            // u = f 情况，绘制平行光线
            drawRay(
                objectX, objectTopY,
                centerX, objectTopY,
                canvas.width - 50, objectTopY,
                '#f39c12', 2
            );
            
            drawRay(
                objectX, objectBottomY,
                centerX, objectBottomY,
                canvas.width - 50, objectBottomY,
                '#9b59b6', 2
            );
            
            // 标记特殊情形
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('出射光平行，不成像', centerX + 50, centerY - 50);
        }
        
        // 绘制2f点标记
        ctx.beginPath();
        ctx.arc(centerX + 2*f*scale, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.fillText('2F\'', centerX + 2*f*scale - 15, centerY + 25);
        
        ctx.beginPath();
        ctx.arc(centerX - 2*f*scale, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.fillText('2F', centerX - 2*f*scale - 15, centerY + 25);
    }
    
    // 绘制箭头的辅助函数
    function drawArrow(fromX, fromY, toX, toY, color, lineWidth) {
        const headLength = 10;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // 绘制箭头头部
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI/6), 
                  toY - headLength * Math.sin(angle - Math.PI/6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI/6), 
                  toY - headLength * Math.sin(angle + Math.PI/6));
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // 绘制光线的辅助函数
    function drawRay(fromX, fromY, throughX, throughY, toX, toY, color, lineWidth) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(throughX, throughY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // 在转折点画一个小圆点
        ctx.beginPath();
        ctx.arc(throughX, throughY, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // 计算像的顶部Y坐标
    function imageTopY(objectTopY, objectX, imageX) {
        // 根据相似三角形计算
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        if (objectX === centerX) return centerY;
        
        const slope = (objectTopY - centerY) / (objectX - centerX);
        return centerY + slope * (imageX - centerX);
    }
    
    // 从滑块初始化值
    function updateValuesFromSliders() {
        f = parseInt(focalLengthSlider.value);
        u = parseInt(objectDistanceSlider.value);
        h = parseInt(objectHeightSlider.value);
        
        fValueDisplay.textContent = f;
        uValueDisplay.textContent = u;
        hValueDisplay.textContent = h;
        
        fInput.value = f;
        uInput.value = u;
        hInput.value = h;
        
        updateCalculations();
    }
});