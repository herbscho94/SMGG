// Dynamic Mosaic Generator - Complete Rewrite
// This creates a mosaic that adapts to the aspect ratios of uploaded images

class DynamicMosaicGenerator {
    constructor() {
        this.uploadedImages = [];
        this.mosaicContainer = null;
        this.maxImages = 5;
        this.mosaicWidth = 800;
        this.mosaicHeight = 650; // 800 - 150 for footer
    }

    // Initialize the mosaic system
    init() {
        this.mosaicContainer = document.getElementById('imageMosaic');
        if (!this.mosaicContainer) {
            console.error('Mosaic container not found');
            return;
        }
        
        // Clear existing content
        this.mosaicContainer.innerHTML = '';
        console.log('Dynamic mosaic system initialized');
    }

    // Add image to the mosaic
    async addImage(imageData) {
        if (this.uploadedImages.length >= this.maxImages) {
            console.log('Maximum number of images reached');
            return;
        }

        // Load image to get dimensions
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        return new Promise((resolve) => {
            img.onload = () => {
                const imageInfo = {
                    ...imageData,
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height,
                    element: img
                };
                
                this.uploadedImages.push(imageInfo);
                this.generateMosaic();
                resolve(imageInfo);
            };
            img.onerror = () => {
                console.error('Failed to load image');
                resolve(null);
            };
            img.src = imageData.src;
        });
    }

    // Generate dynamic mosaic layout
    generateMosaic() {
        if (this.uploadedImages.length === 0) {
            this.showPlaceholders();
            return;
        }

        console.log('Generating dynamic mosaic for', this.uploadedImages.length, 'images');
        
        // Clear container
        this.mosaicContainer.innerHTML = '';

        if (this.uploadedImages.length === 1) {
            this.createSingleImageLayout();
        } else if (this.uploadedImages.length === 2) {
            this.createTwoImageLayout();
        } else if (this.uploadedImages.length === 3) {
            this.createThreeImageLayout();
        } else if (this.uploadedImages.length === 4) {
            this.createFourImageLayout();
        } else {
            this.createFiveImageLayout();
        }
    }

    // Single image - fills most of the space
    createSingleImageLayout() {
        const img = this.uploadedImages[0];
        const container = this.createImageContainer(img, 'main-image');
        
        // Calculate size to fill most of the mosaic area
        const maxWidth = this.mosaicWidth * 0.8;
        const maxHeight = this.mosaicHeight * 0.8;
        
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        
        container.style.width = width + 'px';
        container.style.height = height + 'px';
        container.style.margin = 'auto';
        
        this.mosaicContainer.appendChild(container);
    }

    // Two images - side by side or stacked
    createTwoImageLayout() {
        const img1 = this.uploadedImages[0];
        const img2 = this.uploadedImages[1];
        
        // Determine layout based on aspect ratios
        const avgAspectRatio = (img1.aspectRatio + img2.aspectRatio) / 2;
        
        if (avgAspectRatio > 1.2) {
            // Landscape images - stack vertically
            this.createVerticalStack([img1, img2]);
        } else {
            // Portrait/square images - side by side
            this.createHorizontalLayout([img1, img2]);
        }
    }

    // Three images - various layouts
    createThreeImageLayout() {
        const images = this.uploadedImages.slice(0, 3);
        
        // Create a flexible layout
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        
        // First image takes more space
        const mainImg = images[0];
        const mainContainer = this.createImageContainer(mainImg, 'main-image');
        mainContainer.style.flex = '2';
        mainContainer.style.minHeight = '60%';
        
        // Other two images share remaining space
        const secondaryContainer = document.createElement('div');
        secondaryContainer.style.display = 'flex';
        secondaryContainer.style.flex = '1';
        secondaryContainer.style.minHeight = '40%';
        
        images.slice(1).forEach(img => {
            const imgContainer = this.createImageContainer(img, 'secondary-image');
            imgContainer.style.flex = '1';
            secondaryContainer.appendChild(imgContainer);
        });
        
        container.appendChild(mainContainer);
        container.appendChild(secondaryContainer);
        this.mosaicContainer.appendChild(container);
    }

    // Four images - 2x2 grid with dynamic sizing
    createFourImageLayout() {
        const images = this.uploadedImages.slice(0, 4);
        
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        
        images.forEach(img => {
            const imgContainer = this.createImageContainer(img, 'grid-image');
            imgContainer.style.flex = '1 1 50%';
            imgContainer.style.minHeight = '50%';
            container.appendChild(imgContainer);
        });
        
        this.mosaicContainer.appendChild(container);
    }

    // Five images - main + 4 secondary
    createFiveImageLayout() {
        const mainImg = this.uploadedImages[0];
        const secondaryImages = this.uploadedImages.slice(1, 5);
        
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Main image
        const mainContainer = this.createImageContainer(mainImg, 'main-image');
        mainContainer.style.flex = '1.5';
        
        // Secondary images container
        const secondaryContainer = document.createElement('div');
        secondaryContainer.style.display = 'flex';
        secondaryContainer.style.flexWrap = 'wrap';
        secondaryContainer.style.flex = '1';
        
        secondaryImages.forEach(img => {
            const imgContainer = this.createImageContainer(img, 'secondary-image');
            imgContainer.style.flex = '1 1 50%';
            imgContainer.style.minHeight = '50%';
            secondaryContainer.appendChild(imgContainer);
        });
        
        container.appendChild(mainContainer);
        container.appendChild(secondaryContainer);
        this.mosaicContainer.appendChild(container);
    }

    // Create image container with proper styling
    createImageContainer(imageData, className) {
        const container = document.createElement('div');
        container.className = `image-placeholder ${className}`;
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        const img = document.createElement('img');
        img.src = imageData.src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        
        container.appendChild(img);
        return container;
    }

    // Show placeholders when no images
    showPlaceholders() {
        this.mosaicContainer.innerHTML = `
            <div class="image-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <span style="color: #718096; font-size: 18px;">Bilder hochladen für dynamisches Mosaik</span>
            </div>
        `;
    }

    // Remove image from mosaic
    removeImage(index) {
        if (index >= 0 && index < this.uploadedImages.length) {
            this.uploadedImages.splice(index, 1);
            this.generateMosaic();
        }
    }

    // Clear all images
    clearAll() {
        this.uploadedImages = [];
        this.generateMosaic();
    }

    // Get mosaic data for download
    getMosaicData() {
        return {
            images: this.uploadedImages,
            layout: this.getCurrentLayout(),
            dimensions: {
                width: this.mosaicWidth,
                height: this.mosaicHeight
            }
        };
    }

    // Get current layout information
    getCurrentLayout() {
        const imageCount = this.uploadedImages.length;
        const layouts = {
            1: 'single',
            2: 'two',
            3: 'three',
            4: 'four',
            5: 'five'
        };
        return layouts[imageCount] || 'unknown';
    }
}

// Export for use in main script
window.DynamicMosaicGenerator = DynamicMosaicGenerator;
