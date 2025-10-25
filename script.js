// Global variables
let uploadedImages = [];

// DOM elements
const imageUpload = document.getElementById('imageUpload');
const uploadedImagesContainer = document.getElementById('uploadedImages');
const mainImagePlaceholder = document.getElementById('mainImagePlaceholder');
const secondaryImagePlaceholders = [
    document.getElementById('secondaryImage1'),
    document.getElementById('secondaryImage2'),
    document.getElementById('secondaryImage3'),
    document.getElementById('secondaryImage4')
];

const projectNameInput = document.getElementById('projectNameInput');
const startPriceInput = document.getElementById('startPriceInput');
const examplePriceInput = document.getElementById('examplePriceInput');
const projectNameDisplay = document.getElementById('projectName');
const startPriceDisplay = document.getElementById('startPrice');
const examplePriceDisplay = document.getElementById('examplePrice');

const profitabilitySlider = document.getElementById('profitabilitySlider');
const sliderValue = document.getElementById('sliderValue');
const indicatorDot = document.getElementById('indicatorDot');

const generateBtn = document.getElementById('generateImage');
const mainContent = document.querySelector('.main-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateTextContent();
    updateProfitabilityIndicator();
});

// Event Listeners
function initializeEventListeners() {
    // Image upload
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Text inputs
    projectNameInput.addEventListener('input', updateTextContent);
    startPriceInput.addEventListener('input', updateTextContent);
    examplePriceInput.addEventListener('input', updateTextContent);
    
    // Profitability slider
    profitabilitySlider.addEventListener('input', updateProfitabilityIndicator);
    
    
    // Generate button
    generateBtn.addEventListener('click', downloadPNG);
}

// Image Upload Handling
function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create a new image to ensure it's not tainted
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
                    
                    const imageData = {
                        id: Date.now() + Math.random(),
                        src: cleanDataURL,
                        file: file
                    };
                    uploadedImages.push(imageData);
                    displayUploadedImages();
                    updateImageMosaic();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Clear the input
    event.target.value = '';
}

function displayUploadedImages() {
    uploadedImagesContainer.innerHTML = '';
    
    uploadedImages.forEach(imageData => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'uploaded-image';
        imageDiv.innerHTML = `
            <img src="${imageData.src}" alt="Uploaded image">
            <button class="remove-btn" onclick="removeImage('${imageData.id}')">×</button>
        `;
        uploadedImagesContainer.appendChild(imageDiv);
    });
}

function removeImage(imageId) {
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);
    displayUploadedImages();
    updateImageMosaic();
}

function updateImageMosaic() {
    // Clear existing images
    mainImagePlaceholder.innerHTML = '<span>Hauptbild hier</span>';
    secondaryImagePlaceholders.forEach(placeholder => {
        placeholder.innerHTML = '<span>Bild hier</span>';
    });
    
    if (uploadedImages.length === 0) return;
    
    // Set main image (first uploaded image)
    if (uploadedImages.length > 0) {
        mainImagePlaceholder.innerHTML = `<img src="${uploadedImages[0].src}" alt="Main image">`;
    }
    
    // Set secondary images
    for (let i = 1; i < uploadedImages.length && i <= 4; i++) {
        const placeholder = secondaryImagePlaceholders[i - 1];
        placeholder.innerHTML = `<img src="${uploadedImages[i].src}" alt="Secondary image ${i}">`;
    }
}

// Text Content Updates
function updateTextContent() {
    projectNameDisplay.textContent = projectNameInput.value || 'Projektname hier';
    startPriceDisplay.textContent = startPriceInput.value || 'Startpreis hier';
    examplePriceDisplay.textContent = examplePriceInput.value || 'Beispielpreis hier';
}

// Profitability Indicator
function updateProfitabilityIndicator() {
    const value = profitabilitySlider.value;
    sliderValue.textContent = value + '%';
    
    // Update indicator dot position
    const percentage = value / 100;
    const barWidth = document.querySelector('.indicator-bar').offsetWidth;
    const dotPosition = percentage * barWidth;
    indicatorDot.style.left = dotPosition + 'px';
    
    // Update color based on value
    let colorClass = '';
    if (value <= 33) {
        colorClass = 'low';
    } else if (value <= 66) {
        colorClass = 'medium';
    } else {
        colorClass = 'high';
    }
    
    // Update indicator labels
    document.querySelectorAll('.indicator-labels span').forEach(label => {
        label.classList.remove('active');
    });
    document.querySelector(`.label-${colorClass}`).classList.add('active');
}


// Manual Canvas Drawing for Perfect Design Capture
async function downloadPNG() {
    try {
        generateBtn.textContent = 'Generiere PNG...';
        generateBtn.disabled = true;
        
        // Hide control panel temporarily
        const controlPanel = document.querySelector('.control-panel');
        controlPanel.style.display = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Ensure all images are loaded
        await waitForImages();
        
        // Get dimensions (square format)
        const size = 800; // Fixed square size for consistent output
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size * 2; // High resolution
        canvas.height = size * 2;
        ctx.scale(2, 2);
        
        console.log('Creating manual canvas with size:', size, 'x', size);
        
        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Draw images in mosaic layout
        await drawImageMosaic(ctx, size);
        
        // Draw logo overlay
        await drawLogoOverlay(ctx);
        
        // Draw footer with text and indicator
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
                console.log('PNG downloaded successfully');
            } else {
                throw new Error('Failed to create blob');
            }
        }, 'image/png', 0.95);
        
        // Show control panel again
        controlPanel.style.display = 'block';
        
    } catch (error) {
        console.error('Error creating PNG:', error);
        alert('Fehler beim Erstellen der PNG-Datei. Bitte versuchen Sie es erneut.');
    } finally {
        generateBtn.textContent = 'Grafik als PNG herunterladen';
        generateBtn.disabled = false;
    }
}

// Wait for all images to load
async function waitForImages() {
    const images = mainContent.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = resolve;
            }
        });
    });
    
    await Promise.all(imagePromises);
    console.log('All images loaded');
}

// Draw image mosaic layout
async function drawImageMosaic(ctx, size) {
    const imageAreaHeight = size - 150; // Leave space for footer
    const mainImageWidth = imageAreaHeight * 0.6; // 60% of height
    const secondaryImageSize = imageAreaHeight * 0.4; // 40% of height
    
    // Draw main image (left side)
    if (uploadedImages.length > 0) {
        const mainImg = await loadImage(uploadedImages[0].src);
        ctx.drawImage(mainImg, 0, 0, mainImageWidth, imageAreaHeight);
    } else {
        // Draw placeholder
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, mainImageWidth, imageAreaHeight);
        ctx.fillStyle = '#718096';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Main Image', mainImageWidth / 2, imageAreaHeight / 2);
    }
    
    // Draw secondary images (right side, 2x2 grid)
    const secondaryImages = uploadedImages.slice(1, 5);
    for (let i = 0; i < 4; i++) {
        const x = mainImageWidth + (i % 2) * (secondaryImageSize / 2);
        const y = Math.floor(i / 2) * (secondaryImageSize / 2);
        
        if (secondaryImages[i]) {
            const img = await loadImage(secondaryImages[i].src);
            ctx.drawImage(img, x, y, secondaryImageSize / 2, secondaryImageSize / 2);
        } else {
            // Draw placeholder
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(x, y, secondaryImageSize / 2, secondaryImageSize / 2);
            ctx.fillStyle = '#718096';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Image ${i + 2}`, x + (secondaryImageSize / 4), y + (secondaryImageSize / 4));
        }
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

// Draw logo overlay
async function drawLogoOverlay(ctx) {
    try {
        const logoImg = await loadImage('logo.png');
        const logoSize = 40;
        const padding = 8;
        
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 20, logoSize + padding * 2, logoSize + padding * 2);
        
        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        // Draw logo
        ctx.drawImage(logoImg, 20 + padding, 20 + padding, logoSize, logoSize);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    } catch (error) {
        console.log('Logo not found, skipping...');
    }
}

// Draw footer with text and indicator
function drawFooter(ctx, size) {
    const footerY = size - 150;
    const footerHeight = 150;
    
    // Draw footer background
    ctx.fillStyle = '#0D47A1'; // Primary blue
    ctx.fillRect(0, footerY, size, footerHeight);
    
    // Draw green accent stripes
    ctx.fillStyle = '#2C6B3F'; // Secondary green
    ctx.fillRect(size - 80, footerY, 20, footerHeight);
    ctx.fillRect(size - 55, footerY + 15, 15, footerHeight - 30);
    ctx.fillRect(size - 35, footerY + 30, 10, footerHeight - 60);
    
    // Draw project name
    ctx.fillStyle = '#FFC107'; // Accent gold
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(projectNameInput.value || 'NUE EPIC ASOK - RAMA 9', 30, footerY + 40);
    
    // Draw prices
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(startPriceInput.value || '135,000 BAHT / SQM', 30, footerY + 70);
    
    ctx.font = '14px Arial';
    ctx.fillText(examplePriceInput.value || '26 SQM UNIT FROM 3.5 M BAHT', 30, footerY + 95);
    
    // Draw profitability indicator
    const indicatorY = footerY + 110;
    const indicatorWidth = size - 200;
    
    // Draw indicator background gradient
    const gradient = ctx.createLinearGradient(30, indicatorY, 30 + indicatorWidth, indicatorY);
    gradient.addColorStop(0, '#e53e3e');
    gradient.addColorStop(0.5, '#f6ad55');
    gradient.addColorStop(1, '#38a169');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(30, indicatorY, indicatorWidth, 20);
    
    // Draw indicator dot
    const sliderValue = parseInt(profitabilitySlider.value);
    const dotX = 30 + (indicatorWidth * sliderValue / 100);
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.arc(dotX, indicatorY + 10, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw indicator labels
    ctx.fillStyle = '#cbd5e0';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Less Profitable', 30, indicatorY + 35);
    ctx.textAlign = 'center';
    ctx.fillText('Normal', 30 + indicatorWidth / 2, indicatorY + 35);
    ctx.textAlign = 'right';
    ctx.fillText('Very Profitable', 30 + indicatorWidth, indicatorY + 35);
}



