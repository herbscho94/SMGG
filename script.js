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


// Simple and Reliable PNG Download
async function downloadPNG() {
    try {
        generateBtn.textContent = 'Generiere PNG...';
        generateBtn.disabled = true;
        
        // Hide control panel temporarily
        const controlPanel = document.querySelector('.control-panel');
        controlPanel.style.display = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Ensure all images are loaded
        await waitForImages();
        
        console.log('Starting PNG generation...');
        console.log('Uploaded images count:', uploadedImages.length);
        
        // Try html2canvas with simple settings first
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
            console.log('html2canvas failed, trying manual method:', html2canvasError);
            
            // Fallback to manual drawing
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

// Manual canvas drawing as fallback
async function manualCanvasDrawing() {
    console.log('Using manual canvas drawing...');
    
    const size = 800;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw footer background
    const footerY = size - 150;
    ctx.fillStyle = '#0D47A1';
    ctx.fillRect(0, footerY, size, 150);
    
    // Draw green stripes
    ctx.fillStyle = '#2C6B3F';
    ctx.fillRect(size - 80, footerY, 20, 150);
    ctx.fillRect(size - 55, footerY + 15, 15, 120);
    ctx.fillRect(size - 35, footerY + 30, 10, 90);
    
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
    
    // Draw images if available - NEW SIMPLE APPROACH
    if (uploadedImages.length > 0) {
        console.log('Drawing images with simple approach...');
        const imageAreaHeight = size - 150;
        const mainImageWidth = imageAreaHeight * 0.6;
        
        // Draw main image - simple approach
        try {
            const mainImg = await loadImage(uploadedImages[0].src);
            console.log(`Main image loaded: ${mainImg.width}x${mainImg.height}`);
            
            // Calculate scaling to fill the area while maintaining aspect ratio
            const scaleX = mainImageWidth / mainImg.width;
            const scaleY = imageAreaHeight / mainImg.height;
            const scale = Math.max(scaleX, scaleY); // Use larger scale to fill area
            
            const scaledWidth = mainImg.width * scale;
            const scaledHeight = mainImg.height * scale;
            
            // Center the image
            const offsetX = (mainImageWidth - scaledWidth) / 2;
            const offsetY = (imageAreaHeight - scaledHeight) / 2;
            
            console.log(`Scaling main image by ${scale}, drawing at (${offsetX}, ${offsetY})`);
            ctx.drawImage(mainImg, offsetX, offsetY, scaledWidth, scaledHeight);
            console.log('Main image drawn successfully');
        } catch (error) {
            console.log('Could not draw main image:', error);
        }
        
        // Draw secondary images - simple approach
        const secondaryImages = uploadedImages.slice(1, 5);
        const secondaryImageSize = imageAreaHeight * 0.4;
        
        for (let i = 0; i < 4; i++) {
            if (secondaryImages[i]) {
                try {
                    const x = mainImageWidth + (i % 2) * (secondaryImageSize / 2);
                    const y = Math.floor(i / 2) * (secondaryImageSize / 2);
                    const img = await loadImage(secondaryImages[i].src);
                    
                    console.log(`Secondary image ${i + 1} loaded: ${img.width}x${img.height}`);
                    
                    // Calculate scaling for secondary images
                    const targetSize = secondaryImageSize / 2;
                    const scaleX = targetSize / img.width;
                    const scaleY = targetSize / img.height;
                    const scale = Math.max(scaleX, scaleY);
                    
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;
                    
                    // Center the image
                    const offsetX = x + (targetSize - scaledWidth) / 2;
                    const offsetY = y + (targetSize - scaledHeight) / 2;
                    
                    console.log(`Scaling secondary image ${i + 1} by ${scale}`);
                    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
                    console.log(`Secondary image ${i + 1} drawn successfully`);
                } catch (error) {
                    console.log(`Could not draw secondary image ${i + 1}:`, error);
                }
            }
        }
    }
    
    // Draw logo
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
            console.log('Manual PNG downloaded successfully');
        } else {
            throw new Error('Failed to create blob from manual canvas');
        }
    }, 'image/png', 0.95);
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

// Draw image with proper aspect ratio (like CSS object-fit: cover)
function drawImageWithAspectRatio(ctx, img, x, y, width, height) {
    console.log(`Drawing image: ${img.width}x${img.height} into ${width}x${height} at (${x}, ${y})`);
    
    // Calculate the aspect ratios
    const imageAspectRatio = img.width / img.height;
    const targetAspectRatio = width / height;
    
    console.log(`Image aspect ratio: ${imageAspectRatio}, Target aspect ratio: ${targetAspectRatio}`);
    
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.width;
    let sourceHeight = img.height;
    
    if (imageAspectRatio > targetAspectRatio) {
        // Image is wider than target - crop sides (image is too wide)
        sourceWidth = img.height * targetAspectRatio;
        sourceX = (img.width - sourceWidth) / 2;
        console.log(`Cropping sides: sourceX=${sourceX}, sourceWidth=${sourceWidth}`);
    } else {
        // Image is taller than target - crop top/bottom (image is too tall)
        sourceHeight = img.width / targetAspectRatio;
        sourceY = (img.height - sourceHeight) / 2;
        console.log(`Cropping top/bottom: sourceY=${sourceY}, sourceHeight=${sourceHeight}`);
    }
    
    // Draw the cropped image
    ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,  // Source rectangle
        x, y, width, height  // Destination rectangle
    );
    
    console.log(`Image drawn successfully`);
}




