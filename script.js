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


// Enhanced PNG Download Function
async function downloadPNG() {
    try {
        generateBtn.textContent = 'Generiere PNG...';
        generateBtn.disabled = true;
        
        // Hide control panel temporarily
        const controlPanel = document.querySelector('.control-panel');
        controlPanel.style.display = 'none';
        
        // Wait for layout to settle and ensure all images are loaded
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Ensure all images are loaded
        await waitForImages();
        
        // Force layout recalculation to ensure all styles are applied
        mainContent.style.display = 'none';
        mainContent.offsetHeight; // Trigger reflow
        mainContent.style.display = 'flex';
        
        // Wait a bit more for styles to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get exact dimensions
        const rect = mainContent.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        console.log('Creating PNG with dimensions:', width, 'x', height);
        
        // Create canvas with enhanced html2canvas settings for better design capture
        const canvas = await html2canvas(mainContent, {
            backgroundColor: '#ffffff',
            scale: 2, // High resolution
            useCORS: true,
            allowTaint: true,
            width: width,
            height: height,
            scrollX: 0,
            scrollY: 0,
            windowWidth: width,
            windowHeight: height,
            x: 0,
            y: 0,
            logging: false,
            removeContainer: false,
            imageTimeout: 15000,
            foreignObjectRendering: true,
            onclone: function(clonedDoc) {
                // Ensure cloned document has all styles properly applied
                const clonedMainContent = clonedDoc.querySelector('.main-content');
                if (clonedMainContent) {
                    // Force critical styles to be applied
                    clonedMainContent.style.position = 'relative';
                    clonedMainContent.style.overflow = 'visible';
                    clonedMainContent.style.display = 'flex';
                    clonedMainContent.style.flexDirection = 'column';
                    clonedMainContent.style.backgroundColor = '#ffffff';
                    clonedMainContent.style.borderRadius = '12px';
                    clonedMainContent.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                }
                
                // Ensure footer styles are applied
                const clonedFooter = clonedDoc.querySelector('.footer');
                if (clonedFooter) {
                    clonedFooter.style.backgroundColor = '#0D47A1';
                    clonedFooter.style.color = '#ffffff';
                    clonedFooter.style.padding = '30px';
                }
                
                // Ensure logo overlay is visible
                const clonedLogo = clonedDoc.querySelector('.logo-overlay');
                if (clonedLogo) {
                    clonedLogo.style.position = 'absolute';
                    clonedLogo.style.top = '20px';
                    clonedLogo.style.left = '20px';
                    clonedLogo.style.zIndex = '10';
                    clonedLogo.style.backgroundColor = '#ffffff';
                    clonedLogo.style.padding = '8px 12px';
                    clonedLogo.style.borderRadius = '8px';
                    clonedLogo.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }
            }
        });
        
        console.log('Canvas created with dimensions:', canvas.width, 'x', canvas.height);
        
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



