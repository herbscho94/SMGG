// Simple and Working Image Mosaic Generator
// Fixed layout: 1 main image + 4 secondary images

// Global variables
let uploadedImages = [];
let mainImagePlaceholder, secondaryImagePlaceholders, projectNameInput, startPriceInput, examplePriceInput, profitabilitySlider, generateBtn, mainContent;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Simple Mosaic Generator...');
    
    // Get DOM elements
    mainImagePlaceholder = document.getElementById('mainImagePlaceholder');
    secondaryImagePlaceholders = [
        document.getElementById('secondaryImage1'),
        document.getElementById('secondaryImage2'),
        document.getElementById('secondaryImage3'),
        document.getElementById('secondaryImage4')
    ];
    projectNameInput = document.getElementById('projectNameInput');
    startPriceInput = document.getElementById('startPriceInput');
    examplePriceInput = document.getElementById('examplePriceInput');
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

function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    console.log('Uploading', files.length, 'images...');
    
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
                        file: file,
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height
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
    const uploadedImagesList = document.getElementById('uploadedImages');
    if (!uploadedImagesList) return;
    
    uploadedImagesList.innerHTML = '';
    
    uploadedImages.forEach((imageData, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'uploaded-image-item';
        imageItem.innerHTML = `
            <img src="${imageData.src}" alt="Uploaded image ${index + 1}">
            <span>Bild ${index + 1}</span>
            <button onclick="removeImage(${index})" class="remove-btn">×</button>
        `;
        uploadedImagesList.appendChild(imageItem);
    });
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    displayUploadedImages();
    updateImageMosaic();
}

function updateImageMosaic() {
    console.log('Updating image mosaic with', uploadedImages.length, 'images');
    
    // Clear existing images
    mainImagePlaceholder.innerHTML = '<span>Hauptbild hier</span>';
    secondaryImagePlaceholders.forEach(placeholder => {
        placeholder.innerHTML = '<span>Bild hier</span>';
    });
    
    if (uploadedImages.length === 0) return;
    
    // Set main image (first uploaded image)
    if (uploadedImages.length > 0) {
        mainImagePlaceholder.innerHTML = `<img src="${uploadedImages[0].src}" alt="Main image">`;
        console.log('Main image set');
    }
    
    // Set secondary images
    for (let i = 1; i < uploadedImages.length && i <= 5; i++) {
        const placeholder = secondaryImagePlaceholders[i - 1];
        placeholder.innerHTML = `<img src="${uploadedImages[i].src}" alt="Secondary image ${i}">`;
        console.log(`Secondary image ${i} set`);
    }
}

function updatePreview() {
    console.log('Preview updated');
    
    // Update project name
    const projectNameElement = document.getElementById('projectName');
    if (projectNameElement && projectNameInput) {
        projectNameElement.textContent = projectNameInput.value;
    }
    
    // Update start price
    const startPriceElement = document.getElementById('startPrice');
    if (startPriceElement && startPriceInput) {
        startPriceElement.textContent = startPriceInput.value;
    }
    
    // Update example price
    const examplePriceElement = document.getElementById('examplePrice');
    if (examplePriceElement && examplePriceInput) {
        examplePriceElement.textContent = examplePriceInput.value;
    }
}

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

// Download PNG - Simple and Reliable
async function downloadPNG() {
    try {
        generateBtn.textContent = 'Generiere PNG...';
        generateBtn.disabled = true;
        
        // Hide control panel temporarily
        const controlPanel = document.querySelector('.control-panel');
        controlPanel.style.display = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('Starting PNG generation...');
        console.log('Uploaded images count:', uploadedImages.length);
        
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

// Manual canvas drawing with CORRECT image scaling
async function manualCanvasDrawing() {
    console.log('Using manual canvas drawing with correct scaling...');
    
    const size = 800;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw images with CORRECT scaling (no distortion)
    await drawImagesCorrectly(ctx, size);
    
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
            console.log('Correctly scaled PNG downloaded successfully');
        } else {
            throw new Error('Failed to create blob');
        }
    }, 'image/png', 0.95);
}

// Draw images with CORRECT scaling - EXACT object-fit: cover behavior
async function drawImagesCorrectly(ctx, size) {
    if (uploadedImages.length === 0) return;
    
    const imageAreaHeight = size - 150;
    const mainImageWidth = imageAreaHeight * 0.6;
    const secondaryImageSize = imageAreaHeight * 0.4;
    
    console.log('Drawing images with EXACT object-fit: cover behavior...');
    
    // Draw main image with EXACT object-fit: cover
    if (uploadedImages.length > 0) {
        try {
            const mainImg = await loadImage(uploadedImages[0].src);
            console.log(`Main image: ${mainImg.width}x${mainImg.height}`);
            
            // EXACT object-fit: cover implementation
            const imageAspectRatio = mainImg.width / mainImg.height;
            const containerAspectRatio = mainImageWidth / imageAreaHeight;
            
            let sourceX = 0, sourceY = 0, sourceWidth = mainImg.width, sourceHeight = mainImg.height;
            
            if (imageAspectRatio > containerAspectRatio) {
                // Image is wider than container - crop sides
                sourceWidth = mainImg.height * containerAspectRatio;
                sourceX = (mainImg.width - sourceWidth) / 2;
                console.log(`Main image cropping sides: sourceX=${sourceX}, sourceWidth=${sourceWidth}`);
            } else {
                // Image is taller than container - crop top/bottom
                sourceHeight = mainImg.width / containerAspectRatio;
                sourceY = (mainImg.height - sourceHeight) / 2;
                console.log(`Main image cropping top/bottom: sourceY=${sourceY}, sourceHeight=${sourceHeight}`);
            }
            
            // Draw the cropped image to fill the entire container
            ctx.drawImage(mainImg, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, mainImageWidth, imageAreaHeight);
            console.log('Main image drawn with object-fit: cover');
        } catch (error) {
            console.log('Could not draw main image:', error);
        }
    }
    
    // Draw secondary images with EXACT object-fit: cover
    const secondaryImages = uploadedImages.slice(1, 5);
    for (let i = 0; i < 4; i++) {
        if (secondaryImages[i]) {
            try {
                const x = mainImageWidth + (i % 2) * (secondaryImageSize / 2);
                const y = Math.floor(i / 2) * (secondaryImageSize / 2);
                const img = await loadImage(secondaryImages[i].src);
                
                console.log(`Secondary image ${i + 1}: ${img.width}x${img.height}`);
                
                // EXACT object-fit: cover for secondary images
                const targetSize = secondaryImageSize / 2;
                const imageAspectRatio = img.width / img.height;
                const containerAspectRatio = targetSize / targetSize; // Square container
                
                let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
                
                if (imageAspectRatio > containerAspectRatio) {
                    // Image is wider - crop sides
                    sourceWidth = img.height * containerAspectRatio;
                    sourceX = (img.width - sourceWidth) / 2;
                } else {
                    // Image is taller - crop top/bottom
                    sourceHeight = img.width / containerAspectRatio;
                    sourceY = (img.height - sourceHeight) / 2;
                }
                
                console.log(`Secondary image ${i + 1} cropping: source(${sourceX}, ${sourceY}, ${sourceWidth}, ${sourceHeight})`);
                ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, targetSize, targetSize);
                console.log(`Secondary image ${i + 1} drawn with object-fit: cover`);
            } catch (error) {
                console.log(`Could not draw secondary image ${i + 1}:`, error);
            }
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
    ctx.fillText(projectNameInput ? projectNameInput.value : 'NUE EPIC ASOK - RAMA 9', 30, footerY + 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(startPriceInput ? startPriceInput.value : '135,000 BAHT / SQM', 30, footerY + 70);
    
    ctx.font = '14px Arial';
    ctx.fillText(examplePriceInput ? examplePriceInput.value : '26 SQM UNIT FROM 3.5 M BAHT', 30, footerY + 95);
    
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