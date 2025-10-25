// Dynamic Mosaic Generator - Complete Rewrite
// This creates a mosaic that adapts to the aspect ratios of uploaded images

// Global variables
let uploadedImages = [];
let mosaicGenerator;

// DOM elements
let projectNameInput, startPriceInput, examplePriceInput, profitabilitySlider, generateBtn, mainContent;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Dynamic Mosaic Generator...');
    
    // Initialize mosaic generator
    mosaicGenerator = new DynamicMosaicGenerator();
    mosaicGenerator.init();
    
    // Get DOM elements
    projectNameInput = document.getElementById('projectName');
    startPriceInput = document.getElementById('startPrice');
    examplePriceInput = document.getElementById('examplePrice');
    profitabilitySlider = document.getElementById('profitabilitySlider');
    generateBtn = document.getElementById('generateImage');
    mainContent = document.querySelector('.main-content');
    
    // Initialize event listeners
    initializeEventListeners();
    
    console.log('Application initialized successfully');
});

function initializeEventListeners() {
    // Image upload
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) {
        fileInput.addEventListener('change', handleImageUpload);
    }
    
    // Text inputs
    if (projectNameInput) {
        projectNameInput.addEventListener('input', updatePreview);
    }
    if (startPriceInput) {
        startPriceInput.addEventListener('input', updatePreview);
    }
    if (examplePriceInput) {
        examplePriceInput.addEventListener('input', updatePreview);
    }
    
    // Profitability slider
    if (profitabilitySlider) {
        profitabilitySlider.addEventListener('input', updateProfitabilityIndicator);
    }
    
    // Generate button
    if (generateBtn) {
        generateBtn.addEventListener('click', downloadPNG);
    }
}

// Handle image upload with dynamic mosaic
async function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    console.log('Uploading', files.length, 'images...');
    
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const imageData = await processImageFile(file);
            if (imageData) {
                await mosaicGenerator.addImage(imageData);
                uploadedImages.push(imageData);
            }
        }
    }
    
    // Clear the input
    event.target.value = '';
    console.log('Total images:', uploadedImages.length);
}

// Process image file to data URL
function processImageFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                // Create canvas to convert to clean data URL
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const cleanDataURL = canvas.toDataURL('image/png');
                
                resolve({
                    id: Date.now() + Math.random(),
                    src: cleanDataURL,
                    file: file,
                    name: file.name
                });
            };
            img.onerror = () => resolve(null);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

// Update preview (placeholder for future enhancements)
function updatePreview() {
    console.log('Preview updated');
}

// Update profitability indicator
function updateProfitabilityIndicator() {
    const value = profitabilitySlider.value;
    const dot = document.getElementById('indicatorDot');
    
    if (dot) {
        dot.style.left = value + '%';
        
        // Update color based on value
        if (value <= 33) {
            dot.style.backgroundColor = '#e53e3e';
        } else if (value <= 66) {
            dot.style.backgroundColor = '#f6ad55';
        } else {
            dot.style.backgroundColor = '#38a169';
        }
    }
}

// Download PNG with dynamic mosaic
async function downloadPNG() {
    try {
        generateBtn.textContent = 'Generiere PNG...';
        generateBtn.disabled = true;
        
        // Hide control panel temporarily
        const controlPanel = document.querySelector('.control-panel');
        controlPanel.style.display = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('Starting PNG generation with dynamic mosaic...');
        
        // Try html2canvas first
        try {
            const canvas = await html2canvas(mainContent, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: true,
                imageTimeout: 10000
            });
            
            console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);
            
            // Convert to PNG and download
            canvas.toBlob(function(blob) {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `inside-property-graphic-${Date.now()}.png`;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    console.log('PNG downloaded successfully');
                } else {
                    throw new Error('Failed to create blob');
                }
            }, 'image/png', 0.95);
            
        } catch (html2canvasError) {
            console.log('html2canvas failed, using manual method:', html2canvasError);
            await manualCanvasDrawing();
        }
        
        // Show control panel again
        controlPanel.style.display = 'block';
        
    } catch (error) {
        console.error('Error creating PNG:', error);
        alert('Fehler beim Erstellen der PNG-Datei: ' + error.message);
    } finally {
        generateBtn.textContent = 'Grafik als PNG herunterladen';
        generateBtn.disabled = false;
    }
}

// Manual canvas drawing with dynamic mosaic
async function manualCanvasDrawing() {
    console.log('Using manual canvas drawing with dynamic mosaic...');
    
    const size = 800;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw images using dynamic mosaic data
    const mosaicData = mosaicGenerator.getMosaicData();
    await drawDynamicMosaic(ctx, mosaicData, size);
    
    // Draw logo
    await drawLogo(ctx);
    
    // Draw footer
    drawFooter(ctx, size);
    
    // Convert to PNG and download
    canvas.toBlob(function(blob) {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `inside-property-graphic-${Date.now()}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('Dynamic mosaic PNG downloaded successfully');
        } else {
            throw new Error('Failed to create blob from dynamic mosaic');
        }
    }, 'image/png', 0.95);
}

// Draw dynamic mosaic on canvas
async function drawDynamicMosaic(ctx, mosaicData, size) {
    const { images, layout } = mosaicData;
    const imageAreaHeight = size - 150;
    
    console.log('Drawing dynamic mosaic with layout:', layout);
    
    if (images.length === 0) return;
    
    // Draw images based on layout
    switch (layout) {
        case 'single':
            await drawSingleImage(ctx, images[0], 0, 0, size * 0.8, imageAreaHeight * 0.8);
            break;
        case 'two':
            await drawTwoImages(ctx, images, size, imageAreaHeight);
            break;
        case 'three':
            await drawThreeImages(ctx, images, size, imageAreaHeight);
            break;
        case 'four':
            await drawFourImages(ctx, images, size, imageAreaHeight);
            break;
        case 'five':
            await drawFiveImages(ctx, images, size, imageAreaHeight);
            break;
    }
}

// Draw single image
async function drawSingleImage(ctx, imageData, x, y, width, height) {
    try {
        const img = await loadImage(imageData.src);
        const aspectRatio = img.width / img.height;
        const containerAspectRatio = width / height;
        
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
        
        if (aspectRatio > containerAspectRatio) {
            sourceWidth = img.height * containerAspectRatio;
            sourceX = (img.width - sourceWidth) / 2;
        } else {
            sourceHeight = img.width / containerAspectRatio;
            sourceY = (img.height - sourceHeight) / 2;
        }
        
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
        console.log('Single image drawn');
    } catch (error) {
        console.log('Could not draw single image:', error);
    }
}

// Draw two images
async function drawTwoImages(ctx, images, size, imageAreaHeight) {
    const img1 = images[0];
    const img2 = images[1];
    
    // Determine layout based on aspect ratios
    const avgAspectRatio = (img1.aspectRatio + img2.aspectRatio) / 2;
    
    if (avgAspectRatio > 1.2) {
        // Stack vertically
        await drawSingleImage(ctx, img1, 0, 0, size, imageAreaHeight / 2);
        await drawSingleImage(ctx, img2, 0, imageAreaHeight / 2, size, imageAreaHeight / 2);
    } else {
        // Side by side
        await drawSingleImage(ctx, img1, 0, 0, size / 2, imageAreaHeight);
        await drawSingleImage(ctx, img2, size / 2, 0, size / 2, imageAreaHeight);
    }
}

// Draw three images
async function drawThreeImages(ctx, images, size, imageAreaHeight) {
    const mainImg = images[0];
    const secondaryImages = images.slice(1);
    
    // Main image takes more space
    await drawSingleImage(ctx, mainImg, 0, 0, size * 0.6, imageAreaHeight);
    
    // Secondary images
    await drawSingleImage(ctx, secondaryImages[0], size * 0.6, 0, size * 0.4, imageAreaHeight / 2);
    await drawSingleImage(ctx, secondaryImages[1], size * 0.6, imageAreaHeight / 2, size * 0.4, imageAreaHeight / 2);
}

// Draw four images
async function drawFourImages(ctx, images, size, imageAreaHeight) {
    const halfWidth = size / 2;
    const halfHeight = imageAreaHeight / 2;
    
    for (let i = 0; i < 4; i++) {
        const x = (i % 2) * halfWidth;
        const y = Math.floor(i / 2) * halfHeight;
        await drawSingleImage(ctx, images[i], x, y, halfWidth, halfHeight);
    }
}

// Draw five images
async function drawFiveImages(ctx, images, size, imageAreaHeight) {
    const mainImg = images[0];
    const secondaryImages = images.slice(1);
    
    // Main image
    await drawSingleImage(ctx, mainImg, 0, 0, size * 0.6, imageAreaHeight);
    
    // Secondary images in 2x2 grid
    const secondaryWidth = size * 0.4;
    const secondaryHeight = imageAreaHeight / 2;
    
    for (let i = 0; i < 4; i++) {
        const x = size * 0.6 + (i % 2) * (secondaryWidth / 2);
        const y = Math.floor(i / 2) * secondaryHeight;
        await drawSingleImage(ctx, secondaryImages[i], x, y, secondaryWidth / 2, secondaryHeight);
    }
}

// Load image from data URL
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Draw logo
async function drawLogo(ctx) {
    try {
        const logoImg = await loadImage('logo.png');
        const logoSize = 40;
        const padding = 8;
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 20, logoSize + padding * 2, logoSize + padding * 2);
        
        // Logo
        ctx.drawImage(logoImg, 20 + padding, 20 + padding, logoSize, logoSize);
        console.log('Logo drawn');
    } catch (error) {
        console.log('Could not draw logo:', error);
    }
}

// Draw footer
function drawFooter(ctx, size) {
    const footerY = size - 150;
    const footerHeight = 150;
    
    // Draw footer background
    ctx.fillStyle = '#0D47A1';
    ctx.fillRect(0, footerY, size, footerHeight);
    
    // Draw green accent stripes
    ctx.fillStyle = '#2C6B3F';
    ctx.fillRect(size - 80, footerY, 20, footerHeight);
    ctx.fillRect(size - 55, footerY + 15, 15, footerHeight - 30);
    ctx.fillRect(size - 35, footerY + 30, 10, footerHeight - 60);
    
    // Draw text content
    ctx.fillStyle = '#FFC107';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(projectNameInput.value || 'NUE EPIC ASOK - RAMA 9', 30, footerY + 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(startPriceInput.value || '135,000 BAHT / SQM', 30, footerY + 70);
    
    ctx.font = '14px Arial';
    ctx.fillText(examplePriceInput.value || '26 SQM UNIT FROM 3.5 M BAHT', 30, footerY + 95);
    
    // Draw profitability indicator
    const indicatorY = footerY + 110;
    const indicatorWidth = size - 200;
    
    // Gradient background
    const gradient = ctx.createLinearGradient(30, indicatorY, 30 + indicatorWidth, indicatorY);
    gradient.addColorStop(0, '#e53e3e');
    gradient.addColorStop(0.5, '#f6ad55');
    gradient.addColorStop(1, '#38a169');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(30, indicatorY, indicatorWidth, 20);
    
    // Indicator dot
    const sliderValue = parseInt(profitabilitySlider.value);
    const dotX = 30 + (indicatorWidth * sliderValue / 100);
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.arc(dotX, indicatorY + 10, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#cbd5e0';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Less Profitable', 30, indicatorY + 35);
    ctx.textAlign = 'center';
    ctx.fillText('Normal', 30 + indicatorWidth / 2, indicatorY + 35);
    ctx.textAlign = 'right';
    ctx.fillText('Very Profitable', 30 + indicatorWidth, indicatorY + 35);
}