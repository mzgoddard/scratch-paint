import paper from '@scratch/paper';

const forEachLinePoint = function (point1, point2, callback) {
    // Bresenham line algorithm
    let x1 = ~~point1.x;
    const x2 = ~~point2.x;
    let y1 = ~~point1.y;
    const y2 = ~~point2.y;
    
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    
    callback(x1, y1);
    while (x1 !== x2 || y1 !== y2) {
        const e2 = err * 2;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        callback(x1, y1);
    }
};

const fillEllipse = function (centerX, centerY, radiusX, radiusY, context) {
    // Bresenham ellipse algorithm
    centerX = ~~centerX;
    centerY = ~~centerY;
    radiusX = ~~radiusX;
    radiusY = ~~radiusY;
    const twoRadXSquared = 2 * radiusX * radiusX;
    const twoRadYSquared = 2 * radiusY * radiusY;
    let x = radiusX;
    let y = 0;
    let dx = radiusY * radiusY * (1 - (radiusX << 1));
    let dy = radiusX * radiusX;
    let error = 0;
    let stoppingX = twoRadYSquared * radiusX;
    let stoppingY = 0;
 
    while (stoppingX >= stoppingY) {
        context.fillRect(centerX - x, centerY - y, x << 1, y << 1);
        y++;
        stoppingY += twoRadXSquared;
        error += dy;
        dy += twoRadXSquared;
        if ((error << 1) + dx > 0) {
            x--;
            stoppingX -= twoRadYSquared;
            error += dx;
            dx += twoRadYSquared;
        }
    }

    x = 0;
    y = radiusY;
    dx = radiusY * radiusY;
    dy = radiusX * radiusX * (1 - (radiusY << 1));
    error = 0;
    stoppingX = 0;
    stoppingY = twoRadXSquared * radiusY;
    while (stoppingX <= stoppingY) {
        context.fillRect(centerX - x, centerY - y, x * 2, y * 2);
        x++;
        stoppingX += twoRadYSquared;
        error += dx;
        dx += twoRadYSquared;
        if ((error << 1) + dy > 0) {
            y--;
            stoppingY -= twoRadXSquared;
            error += dy;
            dy += twoRadXSquared;
        }

    }
};

const rowBlank_ = function (imageData, width, y) {
    for (let x = 0; x < width; ++x) {
        if (imageData.data[(y * width << 2) + (x << 2) + 3] !== 0) return false;
    }
    return true;
};

const columnBlank_ = function (imageData, width, x, top, bottom) {
    for (let y = top; y < bottom; ++y) {
        if (imageData.data[(y * width << 2) + (x << 2) + 3] !== 0) return false;
    }
    return true;
};

// Adapted from Tim Down's https://gist.github.com/timdown/021d9c8f2aabc7092df564996f5afbbf
// Trims transparent pixels from edges.
const trim = function (raster) {
    const width = raster.width;
    const imageData = raster.getImageData(raster.bounds);
    let top = 0;
    let bottom = imageData.height;
    let left = 0;
    let right = imageData.width;

    while (top < bottom && rowBlank_(imageData, width, top)) ++top;
    while (bottom - 1 > top && rowBlank_(imageData, width, bottom - 1)) --bottom;
    while (left < right && columnBlank_(imageData, width, left, top, bottom)) ++left;
    while (right - 1 > left && columnBlank_(imageData, width, right - 1, top, bottom)) --right;

    return raster.getSubRaster(new paper.Rectangle(left, top, right - left, bottom - top));
};

export {
    fillEllipse,
    forEachLinePoint,
    trim
};
